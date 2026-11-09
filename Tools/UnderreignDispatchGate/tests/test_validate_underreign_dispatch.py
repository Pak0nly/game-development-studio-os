"""Deterministic tests for the Underreign Claude dispatch gate.

Every test builds a synthetic temporary Git repository. Nothing depends on the
live repository state, network access or the current dirty tree.
"""

from __future__ import annotations

import contextlib
import copy
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


TOOL_ROOT = Path(__file__).resolve().parents[1]
SCHEMA = TOOL_ROOT / "underreign-dispatch-schema-v1.json"
sys.path.insert(0, str(TOOL_ROOT))

from validate_underreign_dispatch import (  # noqa: E402
    GateError,
    candidate_identity,
    canonical_json,
    dirty_projection,
    main,
    validate_manifest,
)


WORK_ORDER_ID = "MA-SYNTHETIC-WO-V1"
OTHER_WORK_ORDER_ID = "MA-SYNTHETIC-WO-V2"
ATTESTATION = "Requested model — not independently attested."
PROFILE = "Projects/Underreign/Docs/PRODUCTION_PROFILE.md"
WORK_STATE = "Projects/Underreign/Docs/WORK_STATE.md"
HANDOVER = "Projects/Underreign/Docs/CURRENT_HANDOVER.md"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class UnderreignDispatchGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name).resolve()
        self._write("AGENTS.md", "# Synthetic authority\n")
        self._write(PROFILE, "# Synthetic profile\n\nproject_id: Underreign\n")
        self._write(WORK_STATE, "# Synthetic work state\n")
        self._write(HANDOVER, "# Synthetic handover\n")
        self._write("ProjectionMarker.txt", "stable projection\n")
        self.dispatch_dir = f"Artifacts/Underreign/DirectorDispatch/{WORK_ORDER_ID}"
        self.evidence_dir = f"Artifacts/Underreign/Evidence/{WORK_ORDER_ID}"
        self.work_order_rel = f"{self.dispatch_dir}/WORK_ORDER.md"
        self._write(self.work_order_rel, f"# {WORK_ORDER_ID}\nSynthetic Work Order.\n")
        self._write_json(
            "capabilities.json",
            {"available": ["Agent", "SendMessage", "Bash", "Write"]},
        )
        self._git("init", "-b", "main")
        self._git("config", "user.email", "tests@example.invalid")
        self._git("config", "user.name", "Dispatch Gate Tests")
        self._git("config", "commit.gpgsign", "false")
        self._git("add", "AGENTS.md", PROFILE, WORK_STATE, HANDOVER, "ProjectionMarker.txt")
        self._git("commit", "-m", "fixture")
        self.manifest_path = self.root / self.dispatch_dir / "manifest.json"
        self.receipt_path = self.root / self.dispatch_dir / "receipt.json"
        self.work_order_path = self.root / self.work_order_rel
        self.capabilities_path = self.root / "capabilities.json"
        self.manifest = self._valid_manifest()
        self._save_manifest()

    def tearDown(self) -> None:
        self.temp.cleanup()

    # ----------------------------------------------------------------- helpers

    def _write(self, relative: str, text: str) -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8", newline="\n")
        return path

    def _write_json(self, relative: str, value: object) -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return path

    def _git(self, *args: str) -> str:
        result = subprocess.run(
            ["git", *args],
            cwd=self.root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            self.fail(f"git {' '.join(args)} failed: {result.stderr}")
        return result.stdout.strip()

    def _decl(self, value: str, declaration: str = "VERIFIED") -> dict:
        return {"value": value, "declaration": declaration}

    def _valid_manifest(self) -> dict:
        reason = "Bounded scaffolding with deterministic tests."
        return {
            "schema_version": 1,
            "kind": "claude_dispatch_manifest",
            "project_scope": "Underreign",
            "work_order_id": WORK_ORDER_ID,
            "assignment_type": self._decl("governance/tooling"),
            "classification": self._decl("Standard"),
            "work_order": {
                "path": self.work_order_rel,
                "sha256": sha256(self.work_order_path),
                "declaration": "VERIFIED",
            },
            "repository": {
                "root": ".",
                "repository_id": "synthetic-studio",
                "project_path": "Projects/Underreign",
                "project_id": "Underreign",
                "project_identity": {
                    "source_path": "Docs/PRODUCTION_PROFILE.md",
                    "source_sha256": sha256(self.root / PROFILE),
                    "method": "utf8_key_value",
                    "key": "project_id",
                    "expected_value": "Underreign",
                    "indentation": 0,
                    "declaration": "VERIFIED",
                },
                "branch": "main",
                "head": self._git("rev-parse", "HEAD"),
                "declaration": "VERIFIED",
            },
            "dirty_state": {
                "mode": "bounded_projection",
                "paths": ["ProjectionMarker.txt"],
                "sha256": dirty_projection(self.root, ["ProjectionMarker.txt"]),
                "declaration": "VERIFIED",
            },
            "human_authority": {
                "statement": "Human authorises this synthetic dispatch only.",
                "declaration": "HUMAN DECISION",
            },
            "required_live_task_tools": [
                {"name": "Agent", "declaration": "VERIFIED"},
                {"name": "SendMessage", "declaration": "VERIFIED"},
                {"name": "Bash", "declaration": "VERIFIED"},
            ],
            "authority_sources": [
                {"path": "AGENTS.md", "sha256": sha256(self.root / "AGENTS.md"), "declaration": "VERIFIED"}
            ],
            "project_sources": [
                {"path": PROFILE, "sha256": sha256(self.root / PROFILE), "declaration": "VERIFIED"}
            ],
            "baselines": {
                "technical": [
                    {
                        "id": "projection-marker-bytes",
                        "path": "ProjectionMarker.txt",
                        "method": "file_sha256",
                        "expected_sha256": sha256(self.root / "ProjectionMarker.txt"),
                        "declaration": "VERIFIED",
                    }
                ],
                "status_decisions": [
                    {
                        "id": "synthetic-status",
                        "statement": "Synthetic status for the test fixture.",
                        "declaration": "HUMAN DECISION",
                    }
                ],
            },
            "allowed_mutations": [
                "Projects/Underreign",
                "Tools/UnderreignDispatchGate",
                self.evidence_dir,
            ],
            "protected_paths": ["AGENTS.md", "Tools/AuthorityContinuity"],
            "stop_boundary": {"statement": "Stop after the synthetic task.", "declaration": "VERIFIED"},
            "execution_mode": self._decl("Integration"),
            "model_routing": [
                {
                    "task": "Synthetic scaffolding",
                    "class": "Standard",
                    "reason": reason,
                    "requested_model": "sonnet",
                    "context_fork": "Exact fixture files only.",
                    "attempts": "One planned candidate.",
                    "escalate_stop": "Stop on mismatch.",
                    "attestation": ATTESTATION,
                    "declaration": "VERIFIED",
                }
            ],
            "role_requirements": ["Producer / Scope Controller", "QA Lead"],
            "roles": [
                {
                    "role": "Producer / Scope Controller",
                    "status": "ACTIVATED",
                    "reason": "Owns scope and consolidation.",
                    "declaration": "VERIFIED",
                },
                {
                    "role": "QA Lead",
                    "status": "ACTIVATED",
                    "reason": "Independent review.",
                    "declaration": "VERIFIED",
                },
            ],
            "visible_task_plan": [
                {"step": "Validate manifest", "status": "in_progress"},
                {"step": "Verify worker receipt", "status": "pending"},
            ],
            "correction_allowance": {"stage": "Synthetic", "rounds": 1, "declaration": "VERIFIED"},
            "monitoring": {"owner": "Director", "declaration": "VERIFIED"},
            "orchestration": {
                "director_mode": "orchestration_only",
                "director_mutation_allowed": False,
                "separate_worker_task": {
                    "required": True,
                    "creation_tool": "Agent",
                    "resume_tool": "SendMessage",
                    "separate_from_director": True,
                },
                "worker_route": {
                    "requested_model": "sonnet",
                    "reasoning_effort": "medium",
                    "reason": reason,
                },
                "monitoring": {
                    "required": True,
                    "mode": "agent_completion",
                    "tool": "Agent",
                },
                "independent_review": {
                    "required": True,
                    "activation": "after_reviewable_evidence",
                    "separate_reviewer_task": True,
                    "reviewer_separate_from_worker_and_director": True,
                    "builder_self_review_is_independent": False,
                },
                "maximum_independent_reviewer_tasks": 1,
            },
            "human_checkpoint": {
                "statement": "Human reviews the synthetic result.",
                "declaration": "HUMAN DECISION",
            },
        }

    def _save_manifest(self, path: Path | None = None, manifest: dict | None = None) -> Path:
        target = path or self.manifest_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(
            json.dumps(manifest or self.manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        return target

    def _mutated(self, mutate) -> None:
        manifest = copy.deepcopy(self.manifest)
        mutate(manifest)
        self._save_manifest(manifest=manifest)

    def _args(self, command: str, *, receipt: Path | None = None, manifest: Path | None = None,
              work_order: Path | None = None) -> list[str]:
        args = [
            "--schema", str(SCHEMA), command,
            "--root", str(self.root),
            "--manifest", str(manifest or self.manifest_path),
            "--work-order", str(work_order or self.work_order_path),
            "--capabilities", str(self.capabilities_path),
        ]
        if command in ("verify-director", "verify-worker"):
            args.extend(["--receipt", str(receipt or self.receipt_path)])
        return args

    def _run(self, args: list[str]) -> tuple[int, str, str]:
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = main(args)
        return code, out.getvalue(), err.getvalue()

    def _expect_block(self, code: str, args: list[str]) -> None:
        exit_code, _out, err = self._run(args)
        self.assertEqual(exit_code, 2, err)
        self.assertTrue(err.startswith(code + ":"), err)

    def _emit_receipt(self) -> dict:
        exit_code, _out, err = self._run(self._args("verify-director"))
        self.assertEqual(exit_code, 0, err)
        return json.loads(self.receipt_path.read_text(encoding="utf-8"))

    # ------------------------------------------------------- dispatch handshake

    def test_valid_manifest_passes(self) -> None:
        exit_code, out, err = self._run(self._args("check-manifest"))
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS manifest", out)

    def test_dry_run_writes_no_receipt(self) -> None:
        args = [a for a in self._args("verify-director") if a != str(self.receipt_path)]
        args.pop(args.index("--receipt"))
        args.append("--dry-run")
        exit_code, out, err = self._run(args)
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS director dry-run", out)
        self.assertFalse(self.receipt_path.exists())

    def test_director_receipt_then_worker_verification_passes(self) -> None:
        self._emit_receipt()
        exit_code, out, err = self._run(self._args("verify-worker"))
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS worker receipt", out)

    def test_existing_receipt_is_never_overwritten(self) -> None:
        self._emit_receipt()
        self._expect_block("E_RECEIPT_EXISTS", self._args("verify-director"))

    def test_wrong_project_scope_is_rejected(self) -> None:
        self._mutated(lambda m: m.update(project_scope="Crime99"))
        self._expect_block("E_PROJECT_SCOPE", self._args("check-manifest"))

    def test_missing_project_scope_is_rejected(self) -> None:
        self._mutated(lambda m: m.pop("project_scope"))
        self._expect_block("E_MANIFEST_FIELD_MISSING", self._args("check-manifest"))

    def test_wrong_project_path_is_rejected(self) -> None:
        self._mutated(lambda m: m["repository"].update(project_path="Projects/Crime99"))
        self._expect_block("E_PROJECT_SCOPE", self._args("check-manifest"))

    def test_codex_worker_creation_tool_is_rejected(self) -> None:
        self._mutated(
            lambda m: m["orchestration"]["separate_worker_task"].update(creation_tool="create_thread")
        )
        self._expect_block("E_CODEX_TOOL_FORBIDDEN", self._args("check-manifest"))

    def test_codex_required_tools_are_rejected(self) -> None:
        self._mutated(
            lambda m: m["required_live_task_tools"].append(
                {"name": "wait_threads", "declaration": "VERIFIED"}
            )
        )
        self._expect_block("E_CODEX_TOOL_FORBIDDEN", self._args("check-manifest"))

    def test_codex_monitoring_tool_is_rejected(self) -> None:
        def mutate(m: dict) -> None:
            m["orchestration"]["monitoring"].update(mode="cursor_based", tool="wait_threads")

        self._mutated(mutate)
        self._expect_block("E_ORCHESTRATION_MONITORING", self._args("check-manifest"))

    def test_missing_agent_capability_is_rejected(self) -> None:
        self._write_json("capabilities.json", {"available": ["SendMessage", "Bash"]})
        self._expect_block("E_CAPABILITY_MISSING", self._args("check-manifest"))

    def test_non_claude_model_is_rejected(self) -> None:
        def mutate(m: dict) -> None:
            m["model_routing"][0]["requested_model"] = "gpt-5.6-sol"
            m["orchestration"]["worker_route"]["requested_model"] = "gpt-5.6-sol"

        self._mutated(mutate)
        self._expect_block("E_ROUTING_MODEL_INVALID", self._args("check-manifest"))

    def test_claude_model_id_and_attestation_are_enforced(self) -> None:
        def mutate(m: dict) -> None:
            m["model_routing"][0]["requested_model"] = "claude-sonnet-5-5"
            m["orchestration"]["worker_route"]["requested_model"] = "claude-sonnet-5-5"

        self._mutated(mutate)
        exit_code, _out, err = self._run(self._args("check-manifest"))
        self.assertEqual(exit_code, 0, err)
        self._mutated(lambda m: m["model_routing"][0].update(attestation="Verified model."))
        self._expect_block("E_ROUTING_ATTESTATION", self._args("check-manifest"))

    def test_director_self_execution_is_rejected(self) -> None:
        self._mutated(lambda m: m["orchestration"].update(director_mutation_allowed=True))
        self._expect_block("E_DIRECTOR_SELF_EXECUTION", self._args("check-manifest"))

    def test_builder_self_review_is_rejected(self) -> None:
        self._mutated(
            lambda m: m["orchestration"]["independent_review"].update(
                builder_self_review_is_independent=True
            )
        )
        self._expect_block("E_SELF_REVIEW", self._args("check-manifest"))

    def test_gate_forbidden_mutation_is_rejected(self) -> None:
        self._mutated(lambda m: m["allowed_mutations"].append("Docs/WORK_STATE.md"))
        self._expect_block("E_MUTATION_FORBIDDEN", self._args("check-manifest"))

    def test_other_project_roots_are_forbidden_mutations(self) -> None:
        self._mutated(lambda m: m["allowed_mutations"].append("Projects/Hearthlands/Docs/X.md"))
        self._expect_block("E_MUTATION_FORBIDDEN", self._args("check-manifest"))

    def test_manifest_outside_dispatch_namespace_is_rejected(self) -> None:
        moved = self._save_manifest(self.root / "Artifacts/Elsewhere/manifest.json")
        self._expect_block("E_DISPATCH_NAMESPACE", self._args("check-manifest", manifest=moved))

    def test_stale_work_order_hash_is_rejected(self) -> None:
        self.work_order_path.write_text(
            f"# {WORK_ORDER_ID}\nEdited after dispatch.\n", encoding="utf-8"
        )
        self._expect_block("E_WORK_ORDER_HASH_MISMATCH", self._args("check-manifest"))

    def test_stale_authority_source_is_rejected(self) -> None:
        (self.root / "AGENTS.md").write_text("# Edited authority\n", encoding="utf-8")
        self._expect_block("E_SOURCE_DRIFT", self._args("check-manifest"))

    def test_stale_project_identity_source_is_rejected(self) -> None:
        (self.root / PROFILE).write_text("# Edited\n\nproject_id: Underreign\n", encoding="utf-8")
        self._expect_block("E_PROJECT_IDENTITY_STALE", self._args("check-manifest"))

    def test_head_mismatch_is_rejected(self) -> None:
        self._write("extra.txt", "new commit\n")
        self._git("add", "extra.txt")
        self._git("commit", "-m", "moves HEAD")
        self._expect_block("E_REPOSITORY_HEAD", self._args("check-manifest"))

    def test_branch_mismatch_is_rejected(self) -> None:
        self._git("checkout", "-b", "other")
        self._expect_block("E_REPOSITORY_BRANCH", self._args("check-manifest"))

    def test_dirty_projection_drift_is_rejected(self) -> None:
        (self.root / "ProjectionMarker.txt").write_text("changed\n", encoding="utf-8")
        self._expect_block("E_DIRTY_STATE_DRIFT", self._args("check-manifest"))

    def test_tampered_receipt_is_rejected(self) -> None:
        receipt = self._emit_receipt()
        receipt["head"] = "tampered"
        self.receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
        self._expect_block("E_RECEIPT_TAMPERED", self._args("verify-worker"))

    def test_receipt_reused_for_another_work_order_is_rejected(self) -> None:
        self._emit_receipt()
        other_dir = f"Artifacts/Underreign/DirectorDispatch/{OTHER_WORK_ORDER_ID}"
        other_wo = self._write(f"{other_dir}/WORK_ORDER.md", f"# {OTHER_WORK_ORDER_ID}\nOther.\n")
        manifest = copy.deepcopy(self.manifest)
        manifest["work_order_id"] = OTHER_WORK_ORDER_ID
        manifest["work_order"] = {
            "path": f"{other_dir}/WORK_ORDER.md",
            "sha256": sha256(other_wo),
            "declaration": "VERIFIED",
        }
        other_manifest = self._save_manifest(self.root / other_dir / "manifest.json", manifest)
        stolen_receipt = self.root / other_dir / "receipt.json"
        stolen_receipt.write_bytes(self.receipt_path.read_bytes())
        self._expect_block(
            "E_RECEIPT_REUSE",
            self._args(
                "verify-worker",
                receipt=stolen_receipt,
                manifest=other_manifest,
                work_order=other_wo,
            ),
        )

    def test_receipt_stale_after_source_change_is_rejected(self) -> None:
        self._emit_receipt()
        # Re-pin the manifest to a changed source: the old receipt must not match.
        (self.root / "AGENTS.md").write_text("# Changed authority\n", encoding="utf-8")
        manifest = copy.deepcopy(self.manifest)
        manifest["authority_sources"][0]["sha256"] = sha256(self.root / "AGENTS.md")
        self._save_manifest(manifest=manifest)
        self._expect_block("E_RECEIPT_REUSE", self._args("verify-worker"))

    def test_validate_manifest_api_reports_gate_error_code(self) -> None:
        self._mutated(lambda m: m.update(kind="director_dispatch_manifest"))
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        with self.assertRaises(GateError) as context:
            validate_manifest(
                self.root, self.manifest_path, self.work_order_path, self.capabilities_path, schema
            )
        self.assertEqual(context.exception.code, "E_MANIFEST_KIND")

    # ----------------------------------------------------------------- closure

    def _closure_fixture(self, *, reviewer_task: str = "reviewer-task-001") -> Path:
        self._emit_receipt()
        candidate = self._write("Tools/UnderreignDispatchGate/candidate.txt", "candidate bytes\n")
        evidence = self._write(f"{self.evidence_dir}/test-results.txt", "all tests passed\n")
        candidate_id, _rows = candidate_identity(self.root, ["Tools/UnderreignDispatchGate/candidate.txt"])
        record = {
            "kind": "independent_review_record",
            "work_order_id": WORK_ORDER_ID,
            "director_task_id": "director-001",
            "worker_task_id": "worker-001",
            "reviewer_task_id": reviewer_task,
            "reviewer_role": "QA Lead",
            "candidate_identity": candidate_id,
            "evidence_ids": ["focused-tests"],
            "verdict": "PASS",
        }
        review_path = self._write_json(f"{self.evidence_dir}/review.json", record)
        closure = {
            "schema_version": 1,
            "kind": "claude_closure_manifest",
            "project_scope": "Underreign",
            "work_order": {
                "id": WORK_ORDER_ID,
                "path": self.work_order_rel,
                "sha256": sha256(self.work_order_path),
                "declaration": "VERIFIED",
            },
            "dispatch": {
                "manifest_path": f"{self.dispatch_dir}/manifest.json",
                "manifest_sha256": sha256(self.manifest_path),
                "receipt_path": f"{self.dispatch_dir}/receipt.json",
                "receipt_sha256": sha256(self.receipt_path),
                "receipt_id": json.loads(self.receipt_path.read_text(encoding="utf-8"))["receipt_id"],
                "declaration": "VERIFIED",
            },
            "tasks": {
                "director_task_id": "director-001",
                "worker_task_id": "worker-001",
                "reviewer_task_id": reviewer_task,
            },
            "candidate": {
                "identity": candidate_id,
                "files": [
                    {
                        "path": "Tools/UnderreignDispatchGate/candidate.txt",
                        "sha256": sha256(candidate),
                        "size": len(candidate.read_bytes()),
                    }
                ],
                "declaration": "VERIFIED",
            },
            "evidence": [
                {
                    "id": "focused-tests",
                    "path": f"{self.evidence_dir}/test-results.txt",
                    "sha256": sha256(evidence),
                    "size": len(evidence.read_bytes()),
                }
            ],
            "independent_review": {
                "required": True,
                "reviewer_role": "QA Lead",
                "record_path": f"{self.evidence_dir}/review.json",
                "record_sha256": sha256(review_path),
                "verdict": "PASS",
                "reviewed_candidate_identity": candidate_id,
                "reviewed_evidence_ids": ["focused-tests"],
                "declaration": "VERIFIED",
            },
            "operational_state": {"work_state_path": WORK_STATE, "handover_path": HANDOVER},
            "declaration": "VERIFIED",
        }
        return self._write_json(f"{self.evidence_dir}/closure.json", closure)

    def _closure_args(self, command: str, closure: Path, receipt: Path | None = None) -> list[str]:
        args = [
            "--schema", str(SCHEMA), command,
            "--root", str(self.root),
            "--closure-manifest", str(closure),
            "--work-order", str(self.work_order_path),
            "--receipt", str(receipt or (closure.parent / "closure-receipt.json")),
        ]
        if command == "verify-closure":
            args.extend(
                ["--work-state", str(self.root / WORK_STATE), "--handover", str(self.root / HANDOVER)]
            )
        return args

    def _write_markers(self, receipt_id: str, *, drop: str | None = None) -> None:
        candidate_id, _rows = candidate_identity(self.root, ["Tools/UnderreignDispatchGate/candidate.txt"])
        lines = [
            WORK_ORDER_ID,
            "Independent review verdict: PASS",
            "Worker task: worker-001",
            "Reviewer task: reviewer-task-001",
            f"Candidate identity: {candidate_id}",
            f"Closure receipt: {receipt_id}",
        ]
        text = "\n".join(line for line in lines if drop is None or drop not in line) + "\n"
        self._write(WORK_STATE, text)
        self._write(HANDOVER, text)

    def _issue_closure(self) -> tuple[Path, str]:
        closure = self._closure_fixture()
        exit_code, _out, err = self._run(self._closure_args("issue-closure", closure))
        self.assertEqual(exit_code, 0, err)
        receipt = json.loads((closure.parent / "closure-receipt.json").read_text(encoding="utf-8"))
        return closure, receipt["receipt_id"]

    def test_closure_happy_path_passes(self) -> None:
        closure, receipt_id = self._issue_closure()
        self._write_markers(receipt_id)
        exit_code, out, err = self._run(self._closure_args("verify-closure", closure))
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS operational closure", out)

    def test_missing_operational_markers_block_pass_claim(self) -> None:
        closure, receipt_id = self._issue_closure()
        self._write_markers(receipt_id, drop="Independent review verdict")
        self._expect_block("E_CLOSURE_PASS_CLAIM_BLOCKED", self._closure_args("verify-closure", closure))

    def test_untouched_operational_state_blocks_pass_claim(self) -> None:
        closure, _receipt_id = self._issue_closure()
        self._expect_block("E_CLOSURE_PASS_CLAIM_BLOCKED", self._closure_args("verify-closure", closure))

    def test_reviewer_identity_equal_to_worker_is_rejected(self) -> None:
        closure = self._closure_fixture(reviewer_task="worker-001")
        self._expect_block("E_CLOSURE_SELF_REVIEW", self._closure_args("issue-closure", closure))

    def test_stale_candidate_is_rejected(self) -> None:
        closure = self._closure_fixture()
        (self.root / "Tools/UnderreignDispatchGate/candidate.txt").write_text("changed\n", encoding="utf-8")
        self._expect_block("E_CLOSURE_CANDIDATE_STALE", self._closure_args("issue-closure", closure))

    def test_closure_receipt_mismatch_after_evidence_change_is_rejected(self) -> None:
        closure, receipt_id = self._issue_closure()
        self._write_markers(receipt_id)
        data = json.loads(closure.read_text(encoding="utf-8"))
        data["evidence"][0]["id"] = "renamed-evidence"
        closure.write_text(json.dumps(data), encoding="utf-8")
        exit_code, _out, err = self._run(self._closure_args("verify-closure", closure))
        self.assertEqual(exit_code, 2, err)
        self.assertTrue(err.startswith("E_CLOSURE_REVIEW_MISMATCH:"), err)

    def test_closure_wrong_project_scope_is_rejected(self) -> None:
        closure = self._closure_fixture()
        data = json.loads(closure.read_text(encoding="utf-8"))
        data["project_scope"] = "Crime99"
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_PROJECT_SCOPE", self._closure_args("issue-closure", closure))

    def test_closure_operational_paths_must_be_underreign(self) -> None:
        closure = self._closure_fixture()
        data = json.loads(closure.read_text(encoding="utf-8"))
        data["operational_state"] = {
            "work_state_path": "Docs/WORK_STATE.md",
            "handover_path": "Docs/CURRENT_HANDOVER.md",
        }
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_CLOSURE_OPERATIONAL_STATE", self._closure_args("issue-closure", closure))

    def test_evidence_outside_evidence_namespace_is_rejected(self) -> None:
        closure = self._closure_fixture()
        stray = self._write("Projects/Underreign/Docs/stray-evidence.txt", "stray\n")
        data = json.loads(closure.read_text(encoding="utf-8"))
        data["evidence"][0].update(
            path="Projects/Underreign/Docs/stray-evidence.txt",
            sha256=sha256(stray),
            size=len(stray.read_bytes()),
        )
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_EVIDENCE_NAMESPACE", self._closure_args("issue-closure", closure))

    # --------------------------------------------------------------- utilities

    def test_candidate_identity_is_deterministic_and_order_independent(self) -> None:
        self._write("a.txt", "a\n")
        self._write("b.txt", "b\n")
        first, _ = candidate_identity(self.root, ["a.txt", "b.txt"])
        second, _ = candidate_identity(self.root, ["b.txt", "a.txt"])
        self.assertEqual(first, second)
        (self.root / "b.txt").write_text("changed\n", encoding="utf-8")
        third, _ = candidate_identity(self.root, ["a.txt", "b.txt"])
        self.assertNotEqual(first, third)

    def test_candidate_identity_rejects_unsafe_paths(self) -> None:
        with self.assertRaises(GateError) as context:
            candidate_identity(self.root, ["../outside.txt"])
        self.assertEqual(context.exception.code, "E_PATH_INVALID")

    def test_canonical_json_is_stable(self) -> None:
        self.assertEqual(canonical_json({"b": 1, "a": 2}), b'{"a":2,"b":1}')

    def test_foreign_schema_path_is_rejected(self) -> None:
        other = self.root / "other-schema.json"
        other.write_text(SCHEMA.read_text(encoding="utf-8"), encoding="utf-8")
        args = self._args("check-manifest")
        args[args.index("--schema") + 1] = str(other)
        self._expect_block("E_SCHEMA_PATH", args)


# ===========================================================================
# External project root and night-shift mode (UR-GATE-EXTERNAL-NIGHT-V1).
#
# The class below reuses the synthetic Studio repository fixture of the class
# above but runs none of its inherited tests.  The external project is a second
# temporary repository; the schema is a temporary copy whose allow-list names
# that temporary root (the production schema allows only C:/GameDev/Underreign,
# which these tests never create or touch).  SCHEMA_FILE is patched only so the
# CLI accepts the temporary schema copy.
# ===========================================================================

import validate_underreign_dispatch as gate  # noqa: E402
from unittest import mock  # noqa: E402

NIGHT_BRANCH = "night/2026-10-13"


class ExternalAndNightTests(UnderreignDispatchGateTests):
    def setUp(self) -> None:
        super().setUp()
        self.ext_temp = tempfile.TemporaryDirectory()
        ext_parent = Path(self.ext_temp.name).resolve()
        self.ext_root = ext_parent / "Underreign"
        self.unborn_root = ext_parent / "Unborn"
        production = json.loads(SCHEMA.read_text(encoding="utf-8"))
        production["external_project"]["allowed_roots"] = [
            self.ext_root.as_posix(),
            self.unborn_root.as_posix(),
        ]
        self.schema_path = ext_parent / "schema.json"
        self.schema_path.write_text(json.dumps(production), encoding="utf-8")
        patcher = mock.patch.object(gate, "SCHEMA_FILE", self.schema_path)
        patcher.start()
        self.addCleanup(patcher.stop)

        self.ext_root.mkdir()
        self._xgit("init", "-b", "main")
        self._xgit("config", "user.email", "tests@example.invalid")
        self._xgit("config", "user.name", "Dispatch Gate Tests")
        self._xgit("config", "commit.gpgsign", "false")
        self._xgit("config", "core.autocrlf", "false")
        self._xwrite("Assets/Game/a.txt", "a\n")
        self._xwrite("ProjectSettings/p.txt", "p\n")
        self._xwrite("Docs/notes.txt", "n\n")
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "base0")
        self.base0 = self._xgit("rev-parse", "HEAD")
        self._xwrite("Assets/Game/a2.txt", "a2\n")
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "base")
        self.base = self._xgit("rev-parse", "HEAD")
        self.night_evidence = f"Evidence/{WORK_ORDER_ID}"
        self.ext_branch = "main"

    def tearDown(self) -> None:
        self.ext_temp.cleanup()
        super().tearDown()

    # ----------------------------------------------------------------- helpers

    def _xgit(self, *args: str) -> str:
        result = subprocess.run(
            ["git", *args], cwd=self.ext_root, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, text=True, check=False,
        )
        if result.returncode != 0:
            self.fail(f"ext git {' '.join(args)} failed: {result.stderr}")
        return result.stdout.strip()

    def _xwrite(self, relative: str, text: str) -> Path:
        path = self.ext_root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8", newline="\n")
        return path

    def _ext_section(self) -> dict:
        paths = ["Assets", "ProjectSettings"]
        return {
            "root": self.ext_root.as_posix(),
            "git": {"branch": self.ext_branch, "head": self.base},
            "allowed_mutations": ["Assets/Game", "Evidence"],
            "protected_paths": ["ProjectSettings", "Packages"],
            "dirty_state": {
                "mode": "bounded_projection",
                "paths": paths,
                "sha256": dirty_projection(self.ext_root, paths),
            },
            "declaration": "VERIFIED",
        }

    def _use_external(self) -> None:
        self._mutated(lambda m: m.update(external_project=self._ext_section()))

    def _use_night(self, edit=None, **overrides) -> None:
        def mutate(m: dict) -> None:
            m["external_project"] = self._ext_section()
            m["execution_location"] = "cloud_night"
            m["night_branch"] = NIGHT_BRANCH
            m["night_evidence_dir"] = self.night_evidence
            m.update(overrides)
            if edit is not None:
                edit(m)

        self._mutated(mutate)

    def _args(self, command: str, *, receipt: Path | None = None, manifest: Path | None = None,
              work_order: Path | None = None) -> list[str]:
        args = super()._args(command, receipt=receipt, manifest=manifest, work_order=work_order)
        args[args.index("--schema") + 1] = str(self.schema_path)
        return args

    def _closure_args(self, command: str, closure: Path, receipt: Path | None = None) -> list[str]:
        args = super()._closure_args(command, closure, receipt)
        args[args.index("--schema") + 1] = str(self.schema_path)
        return args

    def _night_args(self, *, return_receipt: Path | None = None) -> list[str]:
        return [
            "--schema", str(self.schema_path), "verify-night-return",
            "--root", str(self.root),
            "--manifest", str(self.manifest_path),
            "--work-order", str(self.work_order_path),
            "--receipt", str(self.receipt_path),
            "--return-receipt", str(return_receipt or self.return_receipt_path),
        ]

    @property
    def return_receipt_path(self) -> Path:
        return self.root / self.dispatch_dir / "night-return.json"

    def _make_night_branch(self, files: dict[str, str] | None = None, *, start: str | None = None,
                           branch: str = NIGHT_BRANCH) -> str:
        files = files if files is not None else {
            "Assets/Game/b.txt": "night work\n",
            f"{self.night_evidence}/result.md": "evidence\n",
        }
        self._xgit("checkout", "-b", branch, start or self.base)
        for relative, text in files.items():
            self._xwrite(relative, text)
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "night work")
        head = self._xgit("rev-parse", "HEAD")
        self._xgit("checkout", self.ext_branch)
        return head

    # --------------------------------------------------------- external section

    def test_old_manifest_receipt_has_no_external_keys(self) -> None:
        receipt = self._emit_receipt()
        for key in ("external_project", "execution_location", "night_shift"):
            self.assertNotIn(key, receipt)

    def test_valid_external_manifest_passes_and_receipt_binds_it(self) -> None:
        self._use_external()
        exit_code, out, err = self._run(self._args("check-manifest"))
        self.assertEqual(exit_code, 0, err)
        receipt = self._emit_receipt()
        self.assertEqual(receipt["external_project"]["root"], self.ext_root.as_posix())
        self.assertEqual(receipt["external_project"]["git"]["head"], self.base)
        self.assertEqual(receipt["execution_location"], "local")
        exit_code, out, err = self._run(self._args("verify-worker"))
        self.assertEqual(exit_code, 0, err)

    def test_external_uninitialised_root_absent_passes_and_nonempty_fails(self) -> None:
        def mutate(m: dict) -> None:
            section = self._ext_section()
            section.update(root=self.unborn_root.as_posix(), git="uninitialised")
            section["dirty_state"]["paths"] = ["."]
            section["dirty_state"]["sha256"] = gate.listing_projection(self.unborn_root, ["."])
            m["external_project"] = section

        self._mutated(mutate)
        self.assertFalse(self.unborn_root.exists())
        exit_code, _out, err = self._run(self._args("check-manifest"))
        self.assertEqual(exit_code, 0, err)
        self.assertFalse(self.unborn_root.exists(), "the gate must not create the external root")
        self.unborn_root.mkdir()
        exit_code, _out, err = self._run(self._args("check-manifest"))
        self.assertEqual(exit_code, 0, err)
        (self.unborn_root / "stray.txt").write_text("x\n", encoding="utf-8")
        self._expect_block("E_EXTERNAL_NOT_UNINITIALISED", self._args("check-manifest"))

    def test_external_root_outside_allow_list_fails_with_production_schema(self) -> None:
        production = json.loads(SCHEMA.read_text(encoding="utf-8"))
        self.assertEqual(production["external_project"]["allowed_roots"], ["C:/GameDev/Underreign"])
        self.assertEqual(gate.normalize_external_root("c:\\GameDev\\Underreign\\"), "C:/GameDev/Underreign")
        self.assertNotIn("budget_cap_eur_max", production["external_project"])
        self._use_external()  # temporary root, not on the production allow-list
        args = self._args("check-manifest")
        args[args.index("--schema") + 1] = str(SCHEMA)
        with mock.patch.object(gate, "SCHEMA_FILE", SCHEMA):
            self._expect_block("E_EXTERNAL_ROOT_NOT_ALLOWED", args)
        # Near misses and every Hearthlands root fail before the filesystem is touched.
        for hostile in ("C:/GameDev/Underreign2", "C:/GameDev/Underreig", "D:/GameDev/Underreign",
                        "C:/GameDev", "C:/GameDev/Underreign/sub", "C:/GameDev/underreign",
                        "C:/Underreign", "C:/GameDev/Underreign-Zwerge",
                        "C:/GameDev/Hearthlands", "C:/GameDev/Hearthlands-Zwerge",
                        "C:/GameDev/Hearthlands-Wege"):
            with self.subTest(root=hostile):
                self._mutated(lambda m, r=hostile: m.update(
                    external_project=dict(self._ext_section(), root=r)))
                with mock.patch.object(gate, "SCHEMA_FILE", SCHEMA):
                    self._expect_block("E_EXTERNAL_ROOT_NOT_ALLOWED", args)
        for invalid in ("relative/path", "C:/GameDev/../Underreign", "C:"):
            with self.subTest(root=invalid):
                self._mutated(lambda m, r=invalid: m.update(
                    external_project=dict(self._ext_section(), root=r)))
                self._expect_block("E_EXTERNAL_ROOT_INVALID", self._args("check-manifest"))

    def test_external_dirty_drift_fails(self) -> None:
        self._use_external()
        self._xwrite("Assets/Game/a.txt", "drifted\n")
        self._expect_block("E_EXTERNAL_DIRTY_DRIFT", self._args("check-manifest"))

    def test_external_untracked_file_in_projection_fails(self) -> None:
        self._use_external()
        self._xwrite("Assets/Game/new.txt", "untracked\n")
        self._expect_block("E_EXTERNAL_DIRTY_DRIFT", self._args("check-manifest"))

    def test_external_head_and_branch_drift_fail(self) -> None:
        self._use_external()
        self._xwrite("Docs/other.txt", "moves head\n")
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "moves head")
        self._expect_block("E_EXTERNAL_HEAD", self._args("check-manifest"))
        self._xgit("reset", "--hard", self.base)
        self._xgit("checkout", "-b", "other")
        self._expect_block("E_EXTERNAL_BRANCH", self._args("check-manifest"))

    def test_external_allowed_protected_overlap_fails(self) -> None:
        self._mutated(lambda m: m.update(external_project=dict(
            self._ext_section(), allowed_mutations=["Assets", "ProjectSettings/Sub"])))
        self._expect_block("E_EXTERNAL_MUTATION_PROTECTED_OVERLAP", self._args("check-manifest"))

    def test_external_receipt_goes_stale_and_is_bound(self) -> None:
        self._use_external()
        receipt = self._emit_receipt()
        self._xwrite("Assets/Game/a.txt", "drifted after dispatch\n")
        self._expect_block("E_EXTERNAL_DIRTY_DRIFT", self._args("verify-worker"))
        self._xgit("checkout", "--", "Assets/Game/a.txt")
        receipt["external_project"]["git"]["head"] = "0" * 40
        self.receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
        self._expect_block("E_RECEIPT_TAMPERED", self._args("verify-worker"))

    def test_external_receipt_cannot_be_stripped(self) -> None:
        self._use_external()
        receipt = self._emit_receipt()
        for key in ("external_project", "execution_location"):
            receipt.pop(key)
        receipt["receipt_id"] = hashlib.sha256(
            canonical_json({k: v for k, v in receipt.items() if k != "receipt_id"})
        ).hexdigest()
        self.receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
        self._expect_block("E_RECEIPT_STALE_EXTERNAL", self._args("verify-worker"))

    # ------------------------------------------------------------ ext: closure

    def _rebuild_closure(self, closure_path: Path, ext_paths: list[str], *,
                         ext_override: list[dict] | None = None,
                         night_return: dict | None = None) -> str:
        data = json.loads(closure_path.read_text(encoding="utf-8"))
        files = [i for i in data["candidate"]["files"] if not i["path"].startswith("ext:")]
        for relative in ext_paths:
            raw = (self.ext_root / relative).read_bytes()
            files.append({"path": f"ext:{relative}", "sha256": hashlib.sha256(raw).hexdigest(),
                          "size": len(raw)})
        files.extend(ext_override or [])
        rows = sorted(files, key=lambda item: item["path"].casefold())
        identity = hashlib.sha256("\n".join(
            f"{i['path']}\t{i['sha256']}\t{i['size']}" for i in rows).encode("utf-8")).hexdigest()
        record_path = self.root / data["independent_review"]["record_path"]
        record = json.loads(record_path.read_text(encoding="utf-8"))
        record["candidate_identity"] = identity
        record_path.write_text(json.dumps(record), encoding="utf-8")
        data["candidate"].update(identity=identity, files=files)
        data["independent_review"].update(
            reviewed_candidate_identity=identity, record_sha256=sha256(record_path))
        if night_return is not None:
            data["night_return"] = night_return
        closure_path.write_text(json.dumps(data), encoding="utf-8")
        return identity

    def _markers(self, identity: str, receipt_id: str, night_id: str | None = None) -> None:
        lines = [
            WORK_ORDER_ID, "Independent review verdict: PASS", "Worker task: worker-001",
            "Reviewer task: reviewer-task-001", f"Candidate identity: {identity}",
            f"Closure receipt: {receipt_id}",
        ]
        if night_id:
            lines.append(f"Night return receipt: {night_id}")
        self._write(WORK_STATE, "\n".join(lines) + "\n")
        self._write(HANDOVER, "\n".join(lines) + "\n")

    def _issue(self, closure: Path) -> str:
        exit_code, _out, err = self._run(self._closure_args("issue-closure", closure))
        self.assertEqual(exit_code, 0, err)
        return json.loads((closure.parent / "closure-receipt.json").read_text("utf-8"))["receipt_id"]

    def test_ext_candidate_closure_passes(self) -> None:
        self._use_external()
        closure = self._closure_fixture()
        identity = self._rebuild_closure(closure, ["Assets/Game/a.txt"])
        receipt_id = self._issue(closure)
        self._markers(identity, receipt_id)
        exit_code, out, err = self._run(self._closure_args("verify-closure", closure))
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS operational closure", out)

    def test_ext_candidate_drift_fails_closure(self) -> None:
        self._use_external()
        closure = self._closure_fixture()
        self._rebuild_closure(closure, ["Assets/Game/a.txt"])
        self._xwrite("Assets/Game/a.txt", "changed after review\n")
        self._expect_block("E_CLOSURE_CANDIDATE_STALE", self._closure_args("issue-closure", closure))

    def test_ext_candidate_outside_external_allowlist_fails(self) -> None:
        self._use_external()
        closure = self._closure_fixture()
        self._rebuild_closure(closure, ["ProjectSettings/p.txt"])
        self._expect_block("E_CLOSURE_SCOPE", self._closure_args("issue-closure", closure))
        self._rebuild_closure(closure, ["Docs/notes.txt"])
        self._expect_block("E_CLOSURE_SCOPE", self._closure_args("issue-closure", closure))

    def test_ext_candidate_without_external_section_fails(self) -> None:
        closure = self._closure_fixture()  # plain manifest, no external_project
        self._rebuild_closure(closure, ["Assets/Game/a.txt"])
        self._expect_block("E_CLOSURE_EXTERNAL_UNDECLARED", self._closure_args("issue-closure", closure))

    def test_ext_candidate_missing_file_and_traversal_fail(self) -> None:
        self._use_external()
        closure = self._closure_fixture()
        ghost = {"path": "ext:Assets/Game/ghost.txt", "sha256": "0" * 64, "size": 1}
        self._rebuild_closure(closure, [], ext_override=[ghost])
        self._expect_block("E_CLOSURE_FILE_MISSING", self._closure_args("issue-closure", closure))
        trap = {"path": "ext:Assets/Game/../../ProjectSettings/p.txt", "sha256": "0" * 64, "size": 1}
        self._rebuild_closure(closure, [], ext_override=[trap])
        self._expect_block("E_PATH_INVALID", self._closure_args("issue-closure", closure))

    # ------------------------------------------------------------- night shift

    def test_valid_night_manifest_passes_and_receipt_binds_it(self) -> None:
        self._use_night()
        receipt = self._emit_receipt()
        self.assertEqual(receipt["execution_location"], "cloud_night")
        self.assertEqual(receipt["night_shift"]["branch"], NIGHT_BRANCH)
        exit_code, _out, err = self._run(self._args("verify-worker"))
        self.assertEqual(exit_code, 0, err)

    def test_night_needs_no_budget_and_rejects_a_supplied_one(self) -> None:
        self._use_night()
        manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        self.assertNotIn("budget", manifest)
        receipt = self._emit_receipt()
        self.assertEqual(set(receipt["night_shift"]), {"branch", "evidence_dir"})
        for budget in ({"cap_eur": 100, "spent_before_eur": 20, "night_limit_eur": 30}, {}, None, 0):
            with self.subTest(budget=budget):
                self._use_night(budget=budget)
                self._expect_block("E_NIGHT_FIELDS_UNEXPECTED", self._args("check-manifest"))
        self._use_external()
        self._mutated(lambda m: m.update(budget={"cap_eur": 100}))
        self._expect_block("E_NIGHT_FIELDS_UNEXPECTED", self._args("check-manifest"))
        self._mutated(lambda m: m.update(budget={"cap_eur": 100}))  # plain manifest, no new sections
        self._expect_block("E_NIGHT_FIELDS_UNEXPECTED", self._args("check-manifest"))

    def test_night_manifest_structure_requirements(self) -> None:
        self._use_night(night_branch="night/2026-13-45")
        self._expect_block("E_NIGHT_BRANCH", self._args("check-manifest"))
        self._use_night(night_branch="feature/x")
        self._expect_block("E_NIGHT_BRANCH", self._args("check-manifest"))
        self._use_night(night_evidence_dir="ProjectSettings/evidence")
        self._expect_block("E_NIGHT_EVIDENCE_DIR", self._args("check-manifest"))
        self._use_night(execution_location="cloud_day")
        self._expect_block("E_EXECUTION_LOCATION", self._args("check-manifest"))
        self._use_night(edit=lambda m: m.pop("external_project"))
        self._expect_block("E_NIGHT_EXTERNAL_REQUIRED", self._args("check-manifest"))
        def unborn(m: dict) -> None:
            m["external_project"].update(root=self.unborn_root.as_posix(), git="uninitialised")
            m["external_project"]["dirty_state"].update(
                paths=["."], sha256=gate.listing_projection(self.unborn_root, ["."]))

        self._use_night(edit=unborn)
        self._expect_block("E_NIGHT_GIT_REQUIRED", self._args("check-manifest"))
        self._use_night(execution_location="local")
        self._expect_block("E_NIGHT_FIELDS_UNEXPECTED", self._args("check-manifest"))

    def _night_ready(self, files: dict[str, str] | None = None, **branch_kwargs) -> str:
        self._use_night()
        self._emit_receipt()
        return self._make_night_branch(files, **branch_kwargs)

    def test_night_return_passes_on_clean_branch_and_is_written_once(self) -> None:
        head = self._night_ready()
        exit_code, out, err = self._run(self._night_args())
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS night return", out)
        receipt = json.loads(self.return_receipt_path.read_text(encoding="utf-8"))
        self.assertEqual(receipt["branch_head"], head)
        self.assertEqual(receipt["base_head"], self.base)
        self.assertEqual(receipt["commits"], [head])
        before = self.return_receipt_path.read_bytes()
        self._expect_block("E_RECEIPT_EXISTS", self._night_args())
        self.assertEqual(self.return_receipt_path.read_bytes(), before)

    def test_night_return_survives_studio_head_change(self) -> None:
        self._night_ready()
        self._write("morning-note.txt", "studio moved on\n")
        self._git("add", "morning-note.txt")
        self._git("commit", "-m", "studio moves overnight")
        exit_code, _out, err = self._run(self._night_args())
        self.assertEqual(exit_code, 0, err)

    def test_night_return_accepts_remote_tracking_branch_only(self) -> None:
        head = self._night_ready()
        self._xgit("update-ref", f"refs/remotes/origin/{NIGHT_BRANCH}", head)
        self._xgit("branch", "-D", NIGHT_BRANCH)
        exit_code, _out, err = self._run(self._night_args())
        self.assertEqual(exit_code, 0, err)

    def test_night_return_requires_night_order_and_dispatch_receipt(self) -> None:
        self._use_external()
        self._emit_receipt()
        self._expect_block("E_NIGHT_NOT_NIGHT_ORDER", self._night_args())
        self.assertFalse(self.return_receipt_path.exists())

    def test_night_return_fails_on_protected_path(self) -> None:
        self._night_ready({"ProjectSettings/p.txt": "tampered\n",
                           f"{self.night_evidence}/result.md": "e\n"})
        self._expect_block("E_NIGHT_PROTECTED_PATH", self._night_args())
        self.assertFalse(self.return_receipt_path.exists())

    def test_night_return_fails_on_non_allowed_path(self) -> None:
        self._night_ready({"Docs/notes.txt": "outside\n", f"{self.night_evidence}/result.md": "e\n"})
        self._expect_block("E_NIGHT_PATH_NOT_ALLOWED", self._night_args())

    def test_night_return_fails_on_protected_path_hidden_in_second_commit(self) -> None:
        self._night_ready()
        self._xgit("checkout", NIGHT_BRANCH)
        self._xwrite("Packages/manifest.json", "{}\n")
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "late commit")
        self._xgit("checkout", "main")
        self._expect_block("E_NIGHT_PROTECTED_PATH", self._night_args())

    def test_night_return_fails_on_deleting_a_protected_path(self) -> None:
        self._night_ready()
        self._xgit("checkout", NIGHT_BRANCH)
        self._xgit("rm", "-q", "ProjectSettings/p.txt")
        self._xgit("commit", "-m", "delete protected")
        self._xgit("checkout", "main")
        self._expect_block("E_NIGHT_PROTECTED_PATH", self._night_args())

    def test_night_return_fails_on_wrong_merge_base(self) -> None:
        self._night_ready(start=self.base0)
        self._expect_block("E_NIGHT_MERGE_BASE", self._night_args())

    def test_night_return_fails_on_missing_branch_empty_branch_and_missing_evidence(self) -> None:
        self._use_night()
        self._emit_receipt()
        self._expect_block("E_NIGHT_BRANCH_MISSING", self._night_args())
        self._xgit("branch", NIGHT_BRANCH, self.base)
        self._expect_block("E_NIGHT_EMPTY", self._night_args())
        self._xgit("branch", "-D", NIGHT_BRANCH)
        self._make_night_branch({"Assets/Game/b.txt": "no evidence\n"})
        self._expect_block("E_NIGHT_EVIDENCE_MISSING", self._night_args())

    def test_night_return_fails_on_merge_commit_and_symlink_and_ambiguous_branch(self) -> None:
        head = self._night_ready()
        self._xgit("update-ref", f"refs/remotes/origin/{NIGHT_BRANCH}", self.base)
        self._expect_block("E_NIGHT_BRANCH_AMBIGUOUS", self._night_args())
        self._xgit("update-ref", "-d", f"refs/remotes/origin/{NIGHT_BRANCH}")
        self._xgit("checkout", "-b", "side", self.base)
        self._xwrite("Assets/Game/side.txt", "side\n")
        self._xgit("add", "-A")
        self._xgit("commit", "-m", "side")
        self._xgit("checkout", NIGHT_BRANCH)
        self._xgit("merge", "--no-ff", "-m", "merge side", "side")
        self._xgit("checkout", "main")
        self._expect_block("E_NIGHT_MERGE_COMMIT", self._night_args())
        self.assertNotEqual(head, self._xgit("rev-parse", NIGHT_BRANCH))
        self._xgit("branch", "-f", NIGHT_BRANCH, head)
        self._xgit("checkout", NIGHT_BRANCH)
        target = self._xwrite("link-target.txt", "target\n")
        blob = self._xgit("hash-object", "-w", str(target))
        target.unlink()
        self._xgit("update-index", "--add", "--cacheinfo", f"120000,{blob},Assets/Game/link")
        self._xgit("commit", "-m", "symlink")
        self._xgit("checkout", "main")
        self._expect_block("E_NIGHT_PATH_KIND", self._night_args())

    def test_night_return_fails_when_manifest_changed_after_dispatch(self) -> None:
        self._night_ready()
        manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        manifest["external_project"]["git"]["head"] = "1" * 40
        self.manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        self._expect_block("E_RECEIPT_REUSE", self._night_args())

    # ------------------------------------------------------------ night closure

    def _night_closure(self) -> tuple[Path, str, str]:
        return self._night_closure_for_branch()

    def _night_closure_for_branch(self) -> tuple[Path, str, str]:
        self._use_night()
        closure = self._closure_fixture()
        head = self._make_night_branch()
        exit_code, _out, err = self._run(self._night_args())
        self.assertEqual(exit_code, 0, err)
        self._xgit("checkout", NIGHT_BRANCH)  # the pulled branch is checked out for hashing
        self.assertEqual(self._xgit("rev-parse", "HEAD"), head)
        night_return = {
            "receipt_path": f"{self.dispatch_dir}/night-return.json",
            "receipt_sha256": sha256(self.return_receipt_path),
            "receipt_id": json.loads(self.return_receipt_path.read_text("utf-8"))["receipt_id"],
            "declaration": "VERIFIED",
        }
        identity = self._rebuild_closure(closure, ["Assets/Game/b.txt"], night_return=night_return)
        return closure, identity, night_return["receipt_id"]

    def test_night_closure_requires_and_accepts_return_receipt(self) -> None:
        closure, identity, night_id = self._night_closure()
        receipt_id = self._issue(closure)
        self._markers(identity, receipt_id, night_id)
        exit_code, out, err = self._run(self._closure_args("verify-closure", closure))
        self.assertEqual(exit_code, 0, err)
        self.assertIn("PASS operational closure", out)
        self._markers(identity, receipt_id)  # operational files lack the night marker
        self._expect_block("E_CLOSURE_PASS_CLAIM_BLOCKED", self._closure_args("verify-closure", closure))

    def test_night_closure_without_return_receipt_fails(self) -> None:
        closure, _identity, _night_id = self._night_closure()
        data = json.loads(closure.read_text(encoding="utf-8"))
        data.pop("night_return")
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_CLOSURE_NIGHT_RETURN_MISSING", self._closure_args("issue-closure", closure))

    def test_night_closure_with_reused_or_tampered_return_receipt_fails(self) -> None:
        closure, _identity, _night_id = self._night_closure()
        original = self.return_receipt_path.read_bytes()
        data = json.loads(closure.read_text(encoding="utf-8"))

        def install(receipt: dict) -> None:
            self.return_receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
            data["night_return"]["receipt_sha256"] = sha256(self.return_receipt_path)
            data["night_return"]["receipt_id"] = receipt["receipt_id"]
            closure.write_text(json.dumps(data), encoding="utf-8")

        receipt = json.loads(original)
        reused = dict(receipt, work_order_id=OTHER_WORK_ORDER_ID)
        reused["receipt_id"] = hashlib.sha256(canonical_json(
            {k: v for k, v in reused.items() if k != "receipt_id"})).hexdigest()
        install(reused)
        self._expect_block("E_NIGHT_RETURN_REUSE", self._closure_args("issue-closure", closure))
        tampered = dict(receipt, branch_head="2" * 40)
        install(tampered)
        self._expect_block("E_NIGHT_RETURN_TAMPERED", self._closure_args("issue-closure", closure))
        stale = json.loads(original)
        self.return_receipt_path.write_bytes(original)
        data["night_return"]["receipt_sha256"] = "3" * 64
        data["night_return"]["receipt_id"] = stale["receipt_id"]
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_CLOSURE_NIGHT_RETURN_STALE", self._closure_args("issue-closure", closure))

    def test_non_night_closure_rejects_night_return(self) -> None:
        self._use_external()
        closure = self._closure_fixture()
        data = json.loads(closure.read_text(encoding="utf-8"))
        data["night_return"] = {"receipt_path": "x", "receipt_sha256": "0" * 64,
                                "receipt_id": "0" * 64, "declaration": "VERIFIED"}
        closure.write_text(json.dumps(data), encoding="utf-8")
        self._expect_block("E_CLOSURE_NIGHT_UNEXPECTED", self._closure_args("issue-closure", closure))


# The subclass shares the fixture only; do not re-run the inherited tests.
for _name in [n for n in dir(UnderreignDispatchGateTests) if n.startswith("test_")]:
    setattr(ExternalAndNightTests, _name, None)


if __name__ == "__main__":
    unittest.main()
