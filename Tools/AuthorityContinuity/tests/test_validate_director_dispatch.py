from __future__ import annotations

import contextlib
import copy
import hashlib
import io
import json
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


TOOL_ROOT = Path(__file__).resolve().parents[1]
SCHEMA = TOOL_ROOT / "director-dispatch-schema-v1.json"
sys.path.insert(0, str(TOOL_ROOT))

from validate_director_dispatch import (  # noqa: E402
    GateError,
    build_receipt,
    candidate_identity,
    canonical_json,
    dirty_projection,
    main,
    reject_reparse_component,
    sha256_bytes,
    validate_manifest,
)


WORK_ORDER_ID = "SYNTHETIC-NO-MUTATION-WORK-ORDER-V1"
ATTESTATION = "Requested model — not independently attested."


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class DirectorDispatchGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self._write("AGENTS.md", "# Synthetic authority\n")
        self._write("Project/profile.md", "# Synthetic project profile\n")
        self._write("Project/identity.txt", "projectName: synthetic-project\n")
        self._write("ProjectionMarker.txt", "stable projection\n")
        self._write("WorkOrders/synthetic.txt", f"ID: {WORK_ORDER_ID}\nNo mutation.\n")
        self._write_json(
            "capabilities.json",
            {
                "available": [
                    "apply_patch",
                    "create_thread",
                    "exec_command",
                    "wait_threads",
                ]
            },
        )
        self._git("init", "-b", "main")
        self._git("config", "user.email", "tests@example.invalid")
        self._git("config", "user.name", "Dispatch Gate Tests")
        self._git(
            "add",
            "AGENTS.md",
            "Project/profile.md",
            "Project/identity.txt",
            "ProjectionMarker.txt",
        )
        self._git("commit", "-m", "fixture")
        self.manifest = self._valid_manifest()
        self.manifest_path = self.root / "Artifacts/manifest.json"
        self.receipt_path = self.root / "Artifacts/receipt.json"
        self.capabilities_path = self.root / "capabilities.json"
        self.work_order_path = self.root / "WorkOrders/synthetic.txt"
        self._save_manifest()

    def tearDown(self) -> None:
        self.temp.cleanup()

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

    def _decl(self, value: str, declaration: str = "VERIFIED", **extra: object) -> dict:
        result = {"value": value, "declaration": declaration}
        result.update(extra)
        return result

    def _valid_manifest(self) -> dict:
        return {
            "schema_version": 2,
            "kind": "director_dispatch_manifest",
            "work_order_id": WORK_ORDER_ID,
            "assignment_type": self._decl("documentation/governance"),
            "classification": self._decl("Critical"),
            "work_order": {
                "path": "WorkOrders/synthetic.txt",
                "sha256": sha256(self.root / "WorkOrders/synthetic.txt"),
                "declaration": "VERIFIED",
            },
            "repository": {
                "root": ".",
                "repository_id": "synthetic-studio",
                "project_path": "Project",
                "project_id": "synthetic-project",
                "project_identity": {
                    "source_path": "identity.txt",
                    "source_sha256": sha256(self.root / "Project/identity.txt"),
                    "method": "utf8_key_value",
                    "key": "projectName",
                    "expected_value": "synthetic-project",
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
                "statement": "Human authorises this synthetic no-mutation handshake only.",
                "declaration": "HUMAN DECISION",
            },
            "required_live_task_tools": [
                {"name": "exec_command", "declaration": "VERIFIED"},
                {"name": "apply_patch", "declaration": "VERIFIED"},
                {"name": "create_thread", "declaration": "VERIFIED"},
                {"name": "wait_threads", "declaration": "VERIFIED"},
            ],
            "authority_sources": [
                {
                    "path": "AGENTS.md",
                    "sha256": sha256(self.root / "AGENTS.md"),
                    "declaration": "VERIFIED",
                }
            ],
            "project_sources": [
                {
                    "path": "Project/profile.md",
                    "sha256": sha256(self.root / "Project/profile.md"),
                    "declaration": "VERIFIED",
                }
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
                        "id": "synthetic-no-mutation-status",
                        "statement": "No mutation is authorised by this synthetic baseline status.",
                        "declaration": "HUMAN DECISION",
                    }
                ],
            },
            "allowed_mutations": [
                "Tools/SyntheticTask",
                "Artifacts/Closure",
                "Docs/WORK_STATE.md",
                "Docs/CURRENT_HANDOVER.md",
            ],
            "protected_paths": ["AGENTS.md", "Project"],
            "stop_boundary": {
                "statement": "Stop after local no-mutation worker verification.",
                "declaration": "VERIFIED",
            },
            "execution_mode": self._decl("Diagnostic"),
            "model_routing": [
                {
                    "task": "Synthetic dispatch handshake verification",
                    "class": "Critical",
                    "reason": "Authority-enforcement handshake needs fail-closed verification.",
                    "requested_model": "gpt-5.6-sol",
                    "sol_exception": "novel governance",
                    "context_fork": "Synthetic authority and exact fixture state only.",
                    "attempts": "One planned implementation candidate.",
                    "escalate_stop": "Stop on mismatch or missing capability.",
                    "attestation": ATTESTATION,
                    "declaration": "VERIFIED",
                }
            ],
            "role_requirements": [
                "Producer / Scope Controller",
                "Technical Director",
                "QA Lead",
            ],
            "roles": [
                {
                    "role": "Producer / Scope Controller",
                    "status": "ACTIVATED",
                    "reason": "Owns bounded scope and later consolidation.",
                    "declaration": "VERIFIED",
                },
                {
                    "role": "Technical Director",
                    "status": "ACTIVATED",
                    "reason": "Reviews architecture and bypass failure modes.",
                    "declaration": "VERIFIED",
                },
                {
                    "role": "QA Lead",
                    "status": "ACTIVATED",
                    "reason": "Reviews deterministic tests and evidence identity.",
                    "declaration": "VERIFIED",
                },
            ],
            "visible_task_plan": [
                {"step": "Validate synthetic manifest", "status": "in_progress"},
                {"step": "Verify worker receipt", "status": "pending"},
            ],
            "correction_allowance": {
                "stage": "Dispatch gate candidate",
                "rounds": 1,
                "declaration": "VERIFIED",
            },
            "monitoring": {
                "owner": "Originating Director",
                "declaration": "VERIFIED",
            },
            "orchestration": {
                "director_mode": "orchestration_only",
                "director_mutation_allowed": False,
                "separate_worker_task": {
                    "required": True,
                    "creation_tool": "create_thread",
                    "separate_from_director": True,
                },
                "worker_route": {
                    "requested_model": "gpt-5.6-sol",
                    "reasoning_effort": "xhigh",
                    "reason": "Authority-enforcement handshake needs fail-closed verification.",
                },
                "monitoring": {
                    "required": True,
                    "mode": "cursor_based",
                    "tool": "wait_threads",
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
                "statement": "Human governance adoption checkpoint; candidate remains inactive.",
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

    def _args(self, command: str, *, manifest: Path | None = None, receipt: Path | None = None) -> list[str]:
        args = [
            "--schema",
            str(SCHEMA),
            command,
            "--root",
            str(self.root),
            "--manifest",
            str(manifest or self.manifest_path),
            "--work-order",
            str(self.work_order_path),
            "--capabilities",
            str(self.capabilities_path),
        ]
        if command == "verify-director":
            args.extend(["--receipt", str(receipt or self.receipt_path)])
        elif command == "verify-worker":
            args.extend(["--receipt", str(receipt or self.receipt_path)])
        return args

    def _closure_args(
        self,
        command: str,
        *,
        manifest: Path,
        receipt: Path,
    ) -> list[str]:
        args = [
            "--schema",
            str(SCHEMA),
            command,
            "--root",
            str(self.root),
            "--closure-manifest",
            str(manifest),
            "--work-order",
            str(self.work_order_path),
            "--receipt",
            str(receipt),
        ]
        if command == "verify-closure":
            args.extend(
                [
                    "--work-state",
                    str(self.root / "Docs/WORK_STATE.md"),
                    "--handover",
                    str(self.root / "Docs/CURRENT_HANDOVER.md"),
                ]
            )
        return args

    def _closure_fixture(self) -> tuple[Path, Path, str]:
        self._emit_receipt()
        candidate_path = self._write("Tools/SyntheticTask/candidate.txt", "candidate bytes\n")
        evidence_path = self._write("Artifacts/Closure/test-results.txt", "all tests passed\n")
        candidate_id, _rows = candidate_identity(
            self.root, ["Tools/SyntheticTask/candidate.txt"]
        )
        review_record = {
            "kind": "independent_review_record",
            "work_order_id": WORK_ORDER_ID,
            "director_task_id": "director-task-001",
            "worker_task_id": "worker-task-001",
            "reviewer_task_id": "reviewer-task-001",
            "reviewer_role": "QA Lead",
            "candidate_identity": candidate_id,
            "evidence_ids": ["focused-tests"],
            "verdict": "PASS",
        }
        review_path = self._write_json("Artifacts/Closure/review.json", review_record)
        closure = {
            "schema_version": 1,
            "kind": "director_closure_manifest",
            "work_order": {
                "id": WORK_ORDER_ID,
                "path": "WorkOrders/synthetic.txt",
                "sha256": sha256(self.work_order_path),
                "declaration": "VERIFIED",
            },
            "dispatch": {
                "manifest_path": "Artifacts/manifest.json",
                "manifest_sha256": sha256(self.manifest_path),
                "receipt_path": "Artifacts/receipt.json",
                "receipt_sha256": sha256(self.receipt_path),
                "receipt_id": json.loads(self.receipt_path.read_text(encoding="utf-8"))[
                    "receipt_id"
                ],
                "declaration": "VERIFIED",
            },
            "tasks": {
                "director_task_id": "director-task-001",
                "worker_task_id": "worker-task-001",
                "reviewer_task_id": "reviewer-task-001",
            },
            "candidate": {
                "identity": candidate_id,
                "files": [
                    {
                        "path": "Tools/SyntheticTask/candidate.txt",
                        "sha256": sha256(candidate_path),
                        "size": len(candidate_path.read_bytes()),
                    }
                ],
                "declaration": "VERIFIED",
            },
            "evidence": [
                {
                    "id": "focused-tests",
                    "path": "Artifacts/Closure/test-results.txt",
                    "sha256": sha256(evidence_path),
                    "size": len(evidence_path.read_bytes()),
                }
            ],
            "independent_review": {
                "required": True,
                "reviewer_role": "QA Lead",
                "record_path": "Artifacts/Closure/review.json",
                "record_sha256": sha256(review_path),
                "verdict": "PASS",
                "reviewed_candidate_identity": candidate_id,
                "reviewed_evidence_ids": ["focused-tests"],
                "declaration": "VERIFIED",
            },
            "operational_state": {
                "work_state_path": "Docs/WORK_STATE.md",
                "handover_path": "Docs/CURRENT_HANDOVER.md",
            },
            "declaration": "VERIFIED",
        }
        manifest_path = self._write_json("Artifacts/Closure/manifest.json", closure)
        return manifest_path, self.root / "Artifacts/Closure/receipt.json", candidate_id

    def _write_operational_pass(self, candidate_id: str, closure_receipt_id: str) -> None:
        text = (
            f"# Operational state\n\n{WORK_ORDER_ID}\n"
            "Independent review verdict: PASS\n"
            "Worker task: worker-task-001\n"
            "Reviewer task: reviewer-task-001\n"
            f"Candidate identity: {candidate_id}\n"
            f"Closure receipt: {closure_receipt_id}\n"
        )
        self._write("Docs/WORK_STATE.md", text)
        self._write("Docs/CURRENT_HANDOVER.md", text)

    def _run(self, args: list[str]) -> tuple[int, str, str]:
        stdout = io.StringIO()
        stderr = io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = main(args)
        return code, stdout.getvalue(), stderr.getvalue()

    def _assert_error(self, expected: str, args: list[str] | None = None) -> None:
        code, _stdout, stderr = self._run(args or self._args("check-manifest"))
        self.assertEqual(2, code, stderr)
        self.assertTrue(stderr.startswith(expected + ":"), stderr)

    def _emit_receipt(self) -> None:
        code, _stdout, stderr = self._run(self._args("verify-director"))
        self.assertEqual(0, code, stderr)
        self.assertTrue(self.receipt_path.is_file())

    def _rewrite_receipt(self, **changes: object) -> None:
        receipt = json.loads(self.receipt_path.read_text(encoding="utf-8"))
        receipt.update(changes)
        unsigned = dict(receipt)
        unsigned.pop("receipt_id", None)
        receipt["receipt_id"] = sha256_bytes(canonical_json(unsigned))
        self.receipt_path.write_text(
            json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    def _set_project_identity_source(self, text: str) -> None:
        path = self._write("Project/identity.txt", text)
        self.manifest["repository"]["project_identity"]["source_sha256"] = sha256(path)
        self._save_manifest()

    def test_successful_two_sided_handshake(self) -> None:
        self._emit_receipt()
        first = self._run(self._args("verify-worker"))
        second = self._run(self._args("verify-worker"))
        self.assertEqual(0, first[0], first[2])
        self.assertEqual(0, second[0], second[2])
        self.assertIn("PASS worker receipt", first[1])

    def test_candidate_identity_fixture_is_non_recursive_and_reproducible(self) -> None:
        first = self._write("Identity/first.txt", "first fixture bytes\n")
        second = self._write("Identity/second.txt", "second fixture bytes\n")
        paths = ["Identity/second.txt", "Identity/first.txt"]
        actual, rows = candidate_identity(self.root, paths)
        expected_rows = [
            ("Identity/first.txt", sha256(first), len(first.read_bytes())),
            ("Identity/second.txt", sha256(second), len(second.read_bytes())),
        ]
        expected_payload = "\n".join(
            f"{path}\t{digest}\t{size}" for path, digest, size in expected_rows
        ).encode("utf-8")
        self.assertEqual(expected_rows, rows)
        self.assertEqual(hashlib.sha256(expected_payload).hexdigest(), actual)
        self.assertFalse((self.root / "Identity/candidate-identity.txt").exists())

    def test_bundled_schema_declares_adopted_active_state(self) -> None:
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        self.assertEqual("ADOPTED_ACTIVE", schema["state"])

    def test_bundled_candidate_identity_command_prints_declared_rows(self) -> None:
        workspace = TOOL_ROOT.parents[1]
        code, stdout, stderr = self._run(["candidate-identity", "--root", str(workspace)])
        self.assertEqual(0, code, stderr)
        lines = stdout.strip().splitlines()
        self.assertRegex(lines[0], r"^CANDIDATE_IDENTITY [0-9a-f]{64}$")
        self.assertEqual(9, len(lines))
        self.assertEqual(
            "AGENTS.md",
            lines[1].split("\t")[0],
        )

    def test_missing_tool_capability_fails_closed(self) -> None:
        self._write_json("capabilities.json", {"available": ["exec_command"]})
        self._assert_error("E_CAPABILITY_MISSING")

    def test_authority_hash_drift_fails_closed(self) -> None:
        self._write("AGENTS.md", "# Drifted authority\n")
        self._assert_error("E_SOURCE_DRIFT")

    def test_work_order_hash_mismatch_fails_closed(self) -> None:
        self._write("WorkOrders/synthetic.txt", f"ID: {WORK_ORDER_ID}\nChanged bytes.\n")
        self._assert_error("E_WORK_ORDER_HASH_MISMATCH")

    def test_receipt_reuse_for_another_work_order_fails_closed(self) -> None:
        self._emit_receipt()
        second_id = "SECOND-SYNTHETIC-WORK-ORDER-V1"
        second_work_order = self._write("WorkOrders/second.txt", f"ID: {second_id}\nNo mutation.\n")
        second_manifest = copy.deepcopy(self.manifest)
        second_manifest["work_order_id"] = second_id
        second_manifest["work_order"] = {
            "path": "WorkOrders/second.txt",
            "sha256": sha256(second_work_order),
            "declaration": "VERIFIED",
        }
        second_path = self._save_manifest(self.root / "Artifacts/second-manifest.json", second_manifest)
        args = self._args("verify-worker", manifest=second_path)
        work_order_index = args.index("--work-order") + 1
        args[work_order_index] = str(second_work_order)
        self._assert_error("E_RECEIPT_REUSE", args)

    def test_missing_model_class_fails_closed(self) -> None:
        self.manifest["model_routing"][0].pop("class")
        self._save_manifest()
        self._assert_error("E_ROUTING_CLASS_MISSING")

    def test_missing_requested_model_fails_closed(self) -> None:
        self.manifest["model_routing"][0].pop("requested_model")
        self._save_manifest()
        self._assert_error("E_ROUTING_MODEL_MISSING")

    def test_missing_routing_reason_fails_closed(self) -> None:
        self.manifest["model_routing"][0]["reason"] = ""
        self._save_manifest()
        self._assert_error("E_ROUTING_REASON_MISSING")

    def test_director_self_execution_fails_closed(self) -> None:
        self.manifest["orchestration"]["director_mode"] = "implementation"
        self._save_manifest()
        self._assert_error("E_DIRECTOR_SELF_EXECUTION")

    def test_missing_cursor_monitoring_fails_closed(self) -> None:
        self.manifest["orchestration"].pop("monitoring")
        self._save_manifest()
        self._assert_error("E_ORCHESTRATION_FIELD_MISSING")

    def test_missing_separate_task_capability_contract_fails_closed(self) -> None:
        self.manifest["required_live_task_tools"] = [
            entry
            for entry in self.manifest["required_live_task_tools"]
            if entry["name"] != "wait_threads"
        ]
        self._save_manifest()
        self._assert_error("E_ORCHESTRATION_CAPABILITY")

    def test_missing_orchestration_model_rationale_fails_closed(self) -> None:
        self.manifest["orchestration"]["worker_route"]["reason"] = ""
        self._save_manifest()
        self._assert_error("E_ORCHESTRATION_ROUTE_REASON")

    def test_builder_self_review_cannot_be_independent(self) -> None:
        self.manifest["orchestration"]["independent_review"][
            "builder_self_review_is_independent"
        ] = True
        self._save_manifest()
        self._assert_error("E_SELF_REVIEW")

    def test_sol_without_valid_exception_fails_closed(self) -> None:
        self.manifest["model_routing"][0].pop("sol_exception")
        self._save_manifest()
        self._assert_error("E_SOL_EXCEPTION_INVALID")

    def test_missing_mandatory_role_fails_closed(self) -> None:
        self.manifest["roles"] = [
            role for role in self.manifest["roles"] if role["role"] != "QA Lead"
        ]
        self._save_manifest()
        self._assert_error("E_MANDATORY_ROLE_MISSING")

    def test_unjustified_not_applicable_fails_closed(self) -> None:
        self.manifest["roles"].append(
            {
                "role": "Release Reviewer",
                "status": "NOT APPLICABLE",
                "reason": "N/A",
                "declaration": "VERIFIED",
            }
        )
        self._save_manifest()
        self._assert_error("E_NOT_APPLICABLE_UNJUSTIFIED")

    def test_missing_monitoring_owner_fails_closed(self) -> None:
        self.manifest["monitoring"]["owner"] = ""
        self._save_manifest()
        self._assert_error("E_MONITORING_OWNER_MISSING")

    def test_missing_human_checkpoint_fails_closed(self) -> None:
        self.manifest["human_checkpoint"]["statement"] = ""
        self._save_manifest()
        self._assert_error("E_HUMAN_CHECKPOINT_MISSING")

    def test_mutation_and_frozen_path_overlap_fails_closed(self) -> None:
        self.manifest["allowed_mutations"] = ["Project/generated"]
        self._save_manifest()
        self._assert_error("E_MUTATION_PROTECTED_OVERLAP")

    def test_changed_live_source_after_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._write("AGENTS.md", "# Changed after receipt\n")
        self._assert_error("E_SOURCE_DRIFT", self._args("verify-worker"))

    def test_changed_live_head_after_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._write("unrelated.txt", "new committed state\n")
        self._git("add", "unrelated.txt")
        self._git("commit", "-m", "change head")
        self._assert_error("E_REPOSITORY_HEAD", self._args("verify-worker"))

    def test_worker_without_receipt_fails_closed(self) -> None:
        self._assert_error("E_RECEIPT_MISSING", self._args("verify-worker"))

    def test_dirty_projection_drift_fails_closed(self) -> None:
        self._write("ProjectionMarker.txt", "dirty after manifest\n")
        self._assert_error("E_DIRTY_STATE_DRIFT")

    def test_receipt_content_tampering_fails_closed(self) -> None:
        self._emit_receipt()
        receipt = json.loads(self.receipt_path.read_text(encoding="utf-8"))
        receipt["required_live_task_tools"] = ["forged_tool"]
        self.receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
        self._assert_error("E_RECEIPT_TAMPERED", self._args("verify-worker"))

    def test_self_consistent_wrong_gate_state_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(gate_state="ACTIVE")
        self._assert_error("E_RECEIPT_STATE", self._args("verify-worker"))

    def test_project_identity_wrong_id_fails_closed(self) -> None:
        self.manifest["repository"]["project_id"] = "arbitrary-project"
        self._save_manifest()
        self._assert_error("E_PROJECT_IDENTITY_VALUE")

    def test_project_identity_wrong_source_path_fails_closed(self) -> None:
        self.manifest["repository"]["project_identity"]["source_path"] = "missing.txt"
        self._save_manifest()
        self._assert_error("E_PROJECT_IDENTITY_SOURCE_MISSING")

    def test_project_identity_stale_source_fails_closed(self) -> None:
        self._write("Project/identity.txt", "projectName: drifted-project\n")
        self._assert_error("E_PROJECT_IDENTITY_STALE")

    def test_project_identity_duplicate_top_level_key_fails_closed(self) -> None:
        self._set_project_identity_source(
            "projectName: synthetic-project\nprojectName: conflicting-project\n"
        )
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_nested_conflicting_key_fails_closed(self) -> None:
        self._set_project_identity_source(
            "projectName: synthetic-project\n  projectName: conflicting-project\n"
        )
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_physical_line_break_after_colon_fails_closed(self) -> None:
        self._set_project_identity_source("projectName:\nsynthetic-project\n")
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_split_key_fails_closed(self) -> None:
        self._set_project_identity_source("project\nName: synthetic-project\n")
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_wrong_indentation_fails_closed(self) -> None:
        self._set_project_identity_source("  projectName: synthetic-project\n")
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_mismatched_content_fails_closed(self) -> None:
        self.manifest["repository"]["project_identity"]["expected_value"] = "other-project"
        self.manifest["repository"]["project_id"] = "other-project"
        self._save_manifest()
        self._assert_error("E_PROJECT_IDENTITY_CONTENT")

    def test_project_identity_missing_contract_fails_closed(self) -> None:
        self.manifest["repository"].pop("project_identity")
        self._save_manifest()
        self._assert_error("E_REPOSITORY_FIELD_MISSING")

    def test_baseline_stale_file_fails_closed(self) -> None:
        self._write("ProjectionMarker.txt", "changed technical baseline\n")
        self.manifest["dirty_state"]["sha256"] = dirty_projection(
            self.root, ["ProjectionMarker.txt"]
        )
        self._save_manifest()
        self._assert_error("E_BASELINE_STALE")

    def test_baseline_missing_proof_field_fails_closed(self) -> None:
        self.manifest["baselines"]["technical"][0].pop("expected_sha256")
        self._save_manifest()
        self._assert_error("E_BASELINE_FIELD_MISSING")

    def test_baseline_arbitrary_method_fails_closed(self) -> None:
        self.manifest["baselines"]["technical"][0]["method"] = "claimed_status"
        self._save_manifest()
        self._assert_error("E_BASELINE_METHOD")

    def test_baseline_status_cannot_masquerade_as_verified_identity(self) -> None:
        self.manifest["baselines"]["status_decisions"][0]["declaration"] = "VERIFIED"
        self._save_manifest()
        self._assert_error("E_DECLARATION_CLASS")

    def test_malformed_manifest_json_fails_closed(self) -> None:
        self.manifest_path.write_text("{not-json", encoding="utf-8")
        self._assert_error("E_JSON_INVALID")

    def test_duplicate_manifest_json_key_fails_closed(self) -> None:
        self.manifest_path.write_text('{"schema_version":1,"schema_version":1}', encoding="utf-8")
        self._assert_error("E_JSON_DUPLICATE_KEY")

    def test_unsafe_manifest_path_fails_closed(self) -> None:
        self.manifest["authority_sources"][0]["path"] = "../AGENTS.md"
        self._save_manifest()
        self._assert_error("E_PATH_INVALID")

    def test_reparse_rejection_helper_has_stable_code(self) -> None:
        fake_stat = mock.Mock(st_file_attributes=stat.FILE_ATTRIBUTE_REPARSE_POINT)
        with mock.patch("validate_director_dispatch.os.lstat", return_value=fake_stat):
            with self.assertRaises(GateError) as caught:
                reject_reparse_component(self.root / "AGENTS.md", "AGENTS.md")
        self.assertEqual("E_PATH_REPARSE", caught.exception.code)

    def test_receipt_must_be_manifest_sibling(self) -> None:
        other = self.root / "Other/receipt.json"
        self._assert_error("E_RECEIPT_PATH", self._args("verify-director", receipt=other))

    def test_existing_receipt_is_not_overwritten(self) -> None:
        self._emit_receipt()
        self._assert_error("E_RECEIPT_EXISTS", self._args("verify-director"))

    def test_malformed_receipt_json_fails_closed(self) -> None:
        self._emit_receipt()
        self.receipt_path.write_text("{not-json", encoding="utf-8")
        self._assert_error("E_JSON_INVALID", self._args("verify-worker"))

    def test_missing_receipt_field_fails_closed(self) -> None:
        self._emit_receipt()
        receipt = json.loads(self.receipt_path.read_text(encoding="utf-8"))
        receipt.pop("baseline_state_sha256")
        self.receipt_path.write_text(json.dumps(receipt), encoding="utf-8")
        self._assert_error("E_RECEIPT_FIELD_MISSING", self._args("verify-worker"))

    def test_self_consistent_stale_project_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(project_identity_sha256="0" * 64)
        self._assert_error("E_RECEIPT_STALE_PROJECT", self._args("verify-worker"))

    def test_self_consistent_stale_baseline_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(baseline_state_sha256="0" * 64)
        self._assert_error("E_RECEIPT_STALE_BASELINE", self._args("verify-worker"))

    def test_self_consistent_stale_repository_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(repository={"branch": "other", "head": "0" * 40})
        self._assert_error("E_RECEIPT_STALE_REPOSITORY", self._args("verify-worker"))

    def test_self_consistent_stale_dirty_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        dirty = copy.deepcopy(json.loads(self.receipt_path.read_text())["dirty_state"])
        dirty["sha256"] = "0" * 64
        self._rewrite_receipt(dirty_state=dirty)
        self._assert_error("E_RECEIPT_STALE_DIRTY_STATE", self._args("verify-worker"))

    def test_self_consistent_stale_source_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(source_state_sha256="0" * 64)
        self._assert_error("E_RECEIPT_STALE_SOURCE", self._args("verify-worker"))

    def test_self_consistent_capability_receipt_fails_closed(self) -> None:
        self._emit_receipt()
        self._rewrite_receipt(required_live_task_tools=["apply_patch"])
        self._assert_error("E_RECEIPT_CAPABILITIES", self._args("verify-worker"))

    def test_worker_receipt_must_be_manifest_sibling(self) -> None:
        self._emit_receipt()
        other = self.root / "Other/receipt.json"
        other.parent.mkdir(parents=True, exist_ok=True)
        other.write_bytes(self.receipt_path.read_bytes())
        self._assert_error("E_RECEIPT_PATH", self._args("verify-worker", receipt=other))

    def test_schema_path_override_fails_closed(self) -> None:
        alternate = self._write_json("alternate-schema.json", json.loads(SCHEMA.read_text()))
        args = self._args("check-manifest")
        args[args.index("--schema") + 1] = str(alternate)
        self._assert_error("E_SCHEMA_PATH", args)

    def test_missing_manifest_field_fails_closed(self) -> None:
        self.manifest.pop("monitoring")
        self._save_manifest()
        self._assert_error("E_MANIFEST_FIELD_MISSING")

    def test_manifest_schema_version_fails_closed(self) -> None:
        self.manifest["schema_version"] = 99
        self._save_manifest()
        self._assert_error("E_SCHEMA_VERSION")

    def test_historical_v1_worker_receipt_remains_verifiable(self) -> None:
        self.manifest["schema_version"] = 1
        self.manifest.pop("orchestration")
        self._save_manifest()
        schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        validated = validate_manifest(
            self.root,
            self.manifest_path,
            self.work_order_path,
            self.capabilities_path,
            schema,
        )
        receipt = build_receipt(validated, schema)
        self.receipt_path.write_text(
            json.dumps(receipt, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        code, stdout, stderr = self._run(self._args("verify-worker"))
        self.assertEqual(0, code, stderr)
        self.assertIn("PASS worker receipt", stdout)

    def test_historical_v1_cannot_issue_a_new_director_receipt(self) -> None:
        self.manifest["schema_version"] = 1
        self.manifest.pop("orchestration")
        self._save_manifest()
        self._assert_error(
            "E_PROSPECTIVE_SCHEMA_REQUIRED", self._args("verify-director")
        )

    def test_valid_independent_closure_and_operational_projection(self) -> None:
        manifest_path, receipt_path, candidate_id = self._closure_fixture()
        issued = self._run(
            self._closure_args(
                "issue-closure", manifest=manifest_path, receipt=receipt_path
            )
        )
        self.assertEqual(0, issued[0], issued[2])
        receipt_id = json.loads(receipt_path.read_text(encoding="utf-8"))["receipt_id"]
        self._write_operational_pass(candidate_id, receipt_id)
        verified = self._run(
            self._closure_args(
                "verify-closure", manifest=manifest_path, receipt=receipt_path
            )
        )
        self.assertEqual(0, verified[0], verified[2])
        self.assertIn("PASS operational closure", verified[1])

    def test_missing_closure_receipt_blocks_pass_projection(self) -> None:
        manifest_path, receipt_path, candidate_id = self._closure_fixture()
        self._write_operational_pass(candidate_id, "0" * 64)
        self._assert_error(
            "E_CLOSURE_RECEIPT_MISSING",
            self._closure_args(
                "verify-closure", manifest=manifest_path, receipt=receipt_path
            ),
        )

    def test_operational_pass_without_exact_receipt_markers_fails_closed(self) -> None:
        manifest_path, receipt_path, _candidate_id = self._closure_fixture()
        issued = self._run(
            self._closure_args(
                "issue-closure", manifest=manifest_path, receipt=receipt_path
            )
        )
        self.assertEqual(0, issued[0], issued[2])
        self._write("Docs/WORK_STATE.md", f"{WORK_ORDER_ID} PASS\n")
        self._write("Docs/CURRENT_HANDOVER.md", f"{WORK_ORDER_ID} PASS\n")
        self._assert_error(
            "E_CLOSURE_PASS_CLAIM_BLOCKED",
            self._closure_args(
                "verify-closure", manifest=manifest_path, receipt=receipt_path
            ),
        )

    def test_stale_candidate_blocks_closure(self) -> None:
        manifest_path, receipt_path, _candidate_id = self._closure_fixture()
        self._write("Tools/SyntheticTask/candidate.txt", "changed candidate bytes\n")
        self._assert_error(
            "E_CLOSURE_CANDIDATE_STALE",
            self._closure_args(
                "issue-closure", manifest=manifest_path, receipt=receipt_path
            ),
        )

    def test_reviewed_candidate_mismatch_blocks_closure(self) -> None:
        manifest_path, receipt_path, _candidate_id = self._closure_fixture()
        closure = json.loads(manifest_path.read_text(encoding="utf-8"))
        closure["independent_review"]["reviewed_candidate_identity"] = "0" * 64
        self._write_json("Artifacts/Closure/manifest.json", closure)
        self._assert_error(
            "E_CLOSURE_REVIEW_MISMATCH",
            self._closure_args(
                "issue-closure", manifest=manifest_path, receipt=receipt_path
            ),
        )

    def test_reviewer_task_must_be_distinct_from_worker_and_director(self) -> None:
        manifest_path, receipt_path, _candidate_id = self._closure_fixture()
        closure = json.loads(manifest_path.read_text(encoding="utf-8"))
        closure["tasks"]["reviewer_task_id"] = closure["tasks"]["worker_task_id"]
        self._write_json("Artifacts/Closure/manifest.json", closure)
        self._assert_error(
            "E_CLOSURE_SELF_REVIEW",
            self._closure_args(
                "issue-closure", manifest=manifest_path, receipt=receipt_path
            ),
        )

    def test_mandatory_role_not_applicable_fails_closed(self) -> None:
        self.manifest["roles"][2]["status"] = "NOT APPLICABLE"
        self.manifest["roles"][2]["reason"] = (
            "This exact synthetic scope would otherwise omit QA validation."
        )
        self._save_manifest()
        self._assert_error("E_MANDATORY_ROLE_NOT_APPLICABLE")

    def test_unknown_material_declaration_fails_closed(self) -> None:
        self.manifest["classification"]["declaration"] = "UNKNOWN"
        self._save_manifest()
        self._assert_error("E_UNKNOWN_DECLARATION")


if __name__ == "__main__":
    unittest.main()
