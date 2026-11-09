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


if __name__ == "__main__":
    unittest.main()
