#!/usr/bin/env python3
"""Cooperative fail-closed Claude Code dispatch and closure gate for Underreign.

Adapted (copied and modified) from the Studio OS Director dispatch gate; it does
not import from or depend on ``Tools/AuthorityContinuity``. It is NOT a security
boundary against an agent with filesystem access. It deterministically binds a
compact dispatch manifest, exact Work Order bytes, repository state, canonical
source hashes, declared capabilities and a one-Work-Order receipt, and it
enforces Director non-execution declarations (one separate Claude Code ``Agent``
subagent Worker). The closure path binds distinct task identities, candidate
and evidence bytes, and independent review before an operational PASS
projection. Every manifest must declare ``project_scope: "Underreign"``.

Optional per manifest: an ``external_project`` root (allow-listed in the schema) and a
``cloud_night`` night-shift mode with a local ``verify-night-return`` command
(independent copy of proven logic, UR-GATE-EXTERNAL-NIGHT-V1; no night budget).
"""

from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import os
import re
import stat
import subprocess
import sys
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any, Iterable


EXIT_GATE_BLOCKED = 2
EXIT_CONFIGURATION = 3
HEX64 = re.compile(r"^[0-9a-f]{64}$")
GENERIC_NA_REASONS = {
    "not applicable",
    "n/a",
    "none",
    "not needed",
    "out of scope",
}


class GateError(ValueError):
    def __init__(self, code: str, detail: str) -> None:
        super().__init__(detail)
        self.code = code
        self.detail = detail


def fail(code: str, detail: str) -> None:
    raise GateError(code, detail)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_json(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def strict_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            fail("E_JSON_DUPLICATE_KEY", f"duplicate JSON key: {key}")
        result[key] = value
    return result


def load_json(path: Path, missing_code: str) -> tuple[dict[str, Any], bytes]:
    if not path.is_file():
        fail(missing_code, f"required JSON file is missing: {path}")
    try:
        raw = path.read_bytes()
        value = json.loads(raw.decode("utf-8-sig"), object_pairs_hook=strict_object)
    except GateError:
        raise
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        fail("E_JSON_INVALID", f"cannot read JSON {path}: {exc}")
    if not isinstance(value, dict):
        fail("E_JSON_INVALID", f"JSON root must be an object: {path}")
    return value, raw

def normalize_relative(value: str, *, allow_root: bool = False) -> str:
    if not isinstance(value, str) or not value.strip():
        fail("E_PATH_INVALID", "path must be a non-empty string")
    normalized = value.replace("\\", "/")
    if normalized.endswith("/**"):
        normalized = normalized[:-3]
    normalized = normalized.rstrip("/")
    if allow_root and normalized == ".":
        return "."
    pure = PurePosixPath(normalized)
    if (
        pure.is_absolute()
        or pure.root
        or pure.anchor
        or ".." in pure.parts
        or any(part in ("", ".") for part in pure.parts)
        or any(":" in part for part in pure.parts)
        or any("*" in part or "?" in part or "[" in part for part in pure.parts)
    ):
        fail("E_PATH_INVALID", f"unsafe repository-relative path: {value}")
    return pure.as_posix()


def repo_path(root: Path, relative: str, *, allow_root: bool = False) -> Path:
    normalized = normalize_relative(relative, allow_root=allow_root)
    candidate = root if normalized == "." else root.joinpath(*normalized.split("/"))
    resolved_root = root.resolve()
    resolved = candidate.resolve(strict=False)
    if resolved != resolved_root and resolved_root not in resolved.parents:
        fail("E_PATH_INVALID", f"path escapes repository root: {relative}")
    current = resolved_root
    try:
        parts = candidate.absolute().relative_to(resolved_root).parts
    except ValueError:
        fail("E_PATH_INVALID", f"path escapes repository root: {relative}")
    for part in parts:
        current = current / part
        if current.exists() or current.is_symlink():
            reject_reparse_component(current, relative)
    return candidate


def reject_reparse_component(path: Path, label: str) -> None:
    """Reject a present symlink/reparse component; exposed for deterministic tests."""
    try:
        attributes = os.lstat(path).st_file_attributes
    except AttributeError:
        attributes = 0
    if path.is_symlink() or bool(attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT):
        fail("E_PATH_REPARSE", f"path uses a symlink or reparse component: {label}")


def require_fields(value: dict[str, Any], fields: Iterable[str], code: str) -> None:
    missing = [field for field in fields if field not in value]
    if missing:
        fail(code, f"missing required fields: {missing}")


def require_string(value: Any, code: str, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        fail(code, f"{label} must be a non-empty string")
    return value


def require_declaration(
    value: Any,
    declarations: set[str],
    label: str,
    *,
    expected: str | None = None,
) -> str:
    if not isinstance(value, dict):
        fail("E_DECLARATION_MISSING", f"{label} must be an object")
    declaration = value.get("declaration")
    if declaration not in declarations:
        fail("E_DECLARATION_MISSING", f"{label}.declaration is missing or invalid")
    if declaration == "UNKNOWN":
        fail("E_UNKNOWN_DECLARATION", f"{label} is UNKNOWN and blocks dispatch")
    if expected is not None and declaration != expected:
        fail(
            "E_DECLARATION_CLASS",
            f"{label}.declaration must be {expected}, got {declaration}",
        )
    return declaration


def run_git(root: Path, *args: str) -> bytes:
    try:
        result = subprocess.run(
            ["git", "-c", "core.quotepath=false", *args],
            cwd=root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=15,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        fail("E_GIT_UNAVAILABLE", f"git invocation failed: {exc}")
    if result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        fail("E_GIT_UNAVAILABLE", f"git {' '.join(args)} failed: {detail}")
    return result.stdout


def live_repository(root: Path) -> dict[str, str]:
    top = run_git(root, "rev-parse", "--show-toplevel").decode("utf-8").strip()
    if Path(top).resolve() != root.resolve():
        fail("E_REPOSITORY_IDENTITY", f"root is not the Git top level: {root}")
    return {
        "branch": run_git(root, "branch", "--show-current").decode("utf-8").strip(),
        "head": run_git(root, "rev-parse", "HEAD").decode("ascii").strip(),
    }


def dirty_projection(root: Path, paths: list[str]) -> str:
    normalized = [normalize_relative(path) for path in paths]
    if not normalized:
        fail("E_DIRTY_STATE_MISSING", "bounded dirty projection requires paths")
    if len(normalized) != len(set(normalized)):
        fail("E_DIRTY_STATE_DUPLICATE", "dirty projection paths must be unique")
    raw = run_git(
        root,
        "status",
        "--porcelain=v1",
        "-z",
        "--untracked-files=all",
        "--",
        *normalized,
    )
    return sha256_bytes(raw)


def validate_sha(value: Any, code: str, label: str) -> str:
    if not isinstance(value, str) or HEX64.fullmatch(value) is None:
        fail(code, f"{label} must be a lowercase SHA-256")
    return value


def candidate_identity(
    root: Path, declared_paths: Any
) -> tuple[str, list[tuple[str, str, int]]]:
    """Return the non-recursive aggregate identity for the schema-declared files."""
    if not isinstance(declared_paths, list) or not declared_paths:
        fail("E_CANDIDATE_IDENTITY_FILES", "candidate_identity_files must be a non-empty array")
    if not all(isinstance(path, str) for path in declared_paths):
        fail("E_CANDIDATE_IDENTITY_FILES", "candidate_identity_files must contain paths")
    normalized = [normalize_relative(path) for path in declared_paths]
    if len(normalized) != len(set(normalized)):
        fail("E_CANDIDATE_IDENTITY_FILES", "candidate_identity_files must be unique")
    rows: list[tuple[str, str, int]] = []
    for relative in sorted(normalized, key=str.casefold):
        path = repo_path(root, relative)
        if not path.is_file():
            fail("E_CANDIDATE_IDENTITY_FILE_MISSING", f"candidate identity file is missing: {relative}")
        raw = path.read_bytes()
        rows.append((relative, sha256_bytes(raw), len(raw)))
    payload = "\n".join(f"{path}\t{digest}\t{size}" for path, digest, size in rows).encode("utf-8")
    return sha256_bytes(payload), rows


def path_is_within(relative: str, roots: list[str]) -> bool:
    normalized = normalize_relative(relative)
    return any(
        normalized == root or normalized.startswith(root + "/")
        for root in roots
    )


def validate_project_identity(
    root: Path,
    repository: dict[str, Any],
    declarations: set[str],
) -> str:
    project_relative = normalize_relative(repository["project_path"], allow_root=True)
    project_root = repo_path(root, project_relative, allow_root=True)
    if not project_root.is_dir():
        fail("E_PROJECT_PATH_MISSING", f"project root is missing: {project_relative}")
    project_id = require_string(
        repository["project_id"], "E_PROJECT_IDENTITY_VALUE", "project_id"
    )
    proof = repository.get("project_identity")
    if not isinstance(proof, dict):
        fail("E_PROJECT_IDENTITY_FIELD_MISSING", "repository.project_identity is required")
    require_declaration(
        proof, declarations, "repository.project_identity", expected="VERIFIED"
    )
    require_fields(
        proof,
        (
            "source_path",
            "source_sha256",
            "method",
            "key",
            "expected_value",
            "indentation",
            "declaration",
        ),
        "E_PROJECT_IDENTITY_FIELD_MISSING",
    )
    if proof["method"] != "utf8_key_value":
        fail("E_PROJECT_IDENTITY_METHOD", "project identity method must be utf8_key_value")
    source_relative = normalize_relative(proof["source_path"])
    source = repo_path(project_root, source_relative)
    if not source.is_file():
        fail(
            "E_PROJECT_IDENTITY_SOURCE_MISSING",
            f"project identity source is missing: {project_relative}/{source_relative}",
        )
    expected_hash = validate_sha(
        proof["source_sha256"],
        "E_PROJECT_IDENTITY_HASH_INVALID",
        "repository.project_identity.source_sha256",
    )
    raw = source.read_bytes()
    actual_hash = sha256_bytes(raw)
    if actual_hash != expected_hash:
        fail(
            "E_PROJECT_IDENTITY_STALE",
            f"project identity source drift: expected {expected_hash}, got {actual_hash}",
        )
    key = require_string(proof["key"], "E_PROJECT_IDENTITY_FIELD_MISSING", "project identity key")
    indentation = proof["indentation"]
    if not isinstance(indentation, int) or isinstance(indentation, bool) or indentation < 0:
        fail("E_PROJECT_IDENTITY_FIELD_MISSING", "project identity indentation must be a non-negative integer")
    expected_value = require_string(
        proof["expected_value"],
        "E_PROJECT_IDENTITY_FIELD_MISSING",
        "project identity expected_value",
    )
    if expected_value != project_id:
        fail("E_PROJECT_IDENTITY_VALUE", "project_id must equal project identity expected_value")
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeError as exc:
        fail("E_PROJECT_IDENTITY_ENCODING", f"project identity source is not UTF-8: {exc}")
    # Identity is a single physical line: only horizontal whitespace may
    # surround the delimiter and value.  Using ``\s`` here would allow a
    # physical line break and turn a malformed multi-line proof into PASS.
    matches = list(
        re.finditer(
            rf"(?m)^([ \t]*){re.escape(key)}[ \t]*:[ \t]*([^\r\n]*?)[ \t]*$",
            text,
        )
    )
    if len(matches) != 1:
        fail(
            "E_PROJECT_IDENTITY_CONTENT",
            f"project identity key must occur exactly once: {key}",
        )
    match = matches[0]
    if match.group(1) != " " * indentation or match.group(2) != expected_value:
        fail(
            "E_PROJECT_IDENTITY_CONTENT",
            f"project identity source does not contain exact indentation/key/value for {key}",
        )
    state = {
        "project_path": project_relative,
        "project_id": project_id,
        "source_path": source_relative,
        "source_sha256": actual_hash,
        "method": "utf8_key_value",
        "key": key,
        "indentation": indentation,
        "expected_value": expected_value,
    }
    return sha256_bytes(canonical_json(state))


def validate_baselines(
    root: Path,
    baselines: Any,
    declarations: set[str],
) -> str:
    if not isinstance(baselines, dict):
        fail("E_BASELINE_MISSING", "baselines must be an object")
    require_fields(baselines, ("technical", "status_decisions"), "E_BASELINE_FIELD_MISSING")
    technical = baselines["technical"]
    statuses = baselines["status_decisions"]
    if not isinstance(technical, list) or not technical:
        fail("E_BASELINE_MISSING", "baselines.technical must not be empty")
    if not isinstance(statuses, list):
        fail("E_BASELINE_STATUS_INVALID", "baselines.status_decisions must be an array")
    verified: list[dict[str, str]] = []
    seen: set[str] = set()
    for index, baseline in enumerate(technical):
        label = f"baselines.technical[{index}]"
        if not isinstance(baseline, dict):
            fail("E_BASELINE_FIELD_MISSING", f"{label} must be an object")
        require_declaration(baseline, declarations, label, expected="VERIFIED")
        require_fields(
            baseline,
            ("id", "path", "method", "expected_sha256", "declaration"),
            "E_BASELINE_FIELD_MISSING",
        )
        baseline_id = require_string(baseline["id"], "E_BASELINE_FIELD_MISSING", f"{label}.id")
        if baseline_id in seen:
            fail("E_BASELINE_DUPLICATE", f"duplicate technical baseline id: {baseline_id}")
        seen.add(baseline_id)
        if baseline["method"] != "file_sha256":
            fail("E_BASELINE_METHOD", f"{label}.method must be file_sha256")
        relative = normalize_relative(baseline["path"])
        source = repo_path(root, relative)
        if not source.is_file():
            fail("E_BASELINE_SOURCE_MISSING", f"technical baseline source is missing: {relative}")
        expected = validate_sha(
            baseline["expected_sha256"], "E_BASELINE_HASH_INVALID", f"{label}.expected_sha256"
        )
        actual = sha256_bytes(source.read_bytes())
        if actual != expected:
            fail(
                "E_BASELINE_STALE",
                f"technical baseline drift for {relative}: expected {expected}, got {actual}",
            )
        verified.append(
            {"id": baseline_id, "path": relative, "method": "file_sha256", "sha256": actual}
        )
    for index, status_entry in enumerate(statuses):
        label = f"baselines.status_decisions[{index}]"
        if not isinstance(status_entry, dict):
            fail("E_BASELINE_STATUS_INVALID", f"{label} must be an object")
        require_declaration(status_entry, declarations, label, expected="HUMAN DECISION")
        require_fields(
            status_entry,
            ("id", "statement", "declaration"),
            "E_BASELINE_STATUS_FIELD_MISSING",
        )
        require_string(status_entry["id"], "E_BASELINE_STATUS_FIELD_MISSING", f"{label}.id")
        require_string(
            status_entry["statement"], "E_BASELINE_STATUS_FIELD_MISSING", f"{label}.statement"
        )
    return sha256_bytes(canonical_json(sorted(verified, key=lambda item: item["id"])))


def source_state(
    root: Path,
    manifest: dict[str, Any],
    declarations: set[str],
) -> str:
    combined: list[dict[str, str]] = []
    seen: set[str] = set()
    for field in ("authority_sources", "project_sources"):
        entries = manifest[field]
        if not isinstance(entries, list):
            fail("E_SOURCE_LIST_INVALID", f"{field} must be an array")
        for index, entry in enumerate(entries):
            label = f"{field}[{index}]"
            require_declaration(entry, declarations, label, expected="VERIFIED")
            require_fields(entry, ("path", "sha256", "declaration"), "E_SOURCE_FIELD_MISSING")
            relative = normalize_relative(entry["path"])
            if relative in seen:
                fail("E_SOURCE_DUPLICATE", f"duplicate source path: {relative}")
            seen.add(relative)
            expected = validate_sha(entry["sha256"], "E_SOURCE_HASH_INVALID", label)
            path = repo_path(root, relative)
            if not path.is_file():
                fail("E_SOURCE_MISSING", f"source is missing: {relative}")
            actual = sha256_bytes(path.read_bytes())
            if actual != expected:
                fail(
                    "E_SOURCE_DRIFT",
                    f"source hash drift for {relative}: expected {expected}, got {actual}",
                )
            combined.append({"path": relative, "sha256": actual, "class": field})
    if not manifest["authority_sources"]:
        fail("E_SOURCE_LIST_INVALID", "authority_sources must not be empty")
    return sha256_bytes(canonical_json(sorted(combined, key=lambda item: item["path"])))


def validate_path_boundaries(manifest: dict[str, Any]) -> None:
    allowed = manifest["allowed_mutations"]
    protected = manifest["protected_paths"]
    if not isinstance(allowed, list) or not all(isinstance(item, str) for item in allowed):
        fail("E_ALLOWLIST_MISSING", "allowed_mutations must be an array of paths")
    if not isinstance(protected, list) or not protected:
        fail("E_PROTECTED_PATHS_MISSING", "protected_paths must be a non-empty array")
    if not all(isinstance(item, str) for item in protected):
        fail("E_PROTECTED_PATHS_MISSING", "protected_paths must contain only paths")
    normalized_allowed = [normalize_relative(item) for item in allowed]
    normalized_protected = [normalize_relative(item) for item in protected]
    if len(normalized_allowed) != len(set(normalized_allowed)):
        fail("E_ALLOWLIST_DUPLICATE", "allowed_mutations contains duplicate paths")
    if len(normalized_protected) != len(set(normalized_protected)):
        fail("E_PROTECTED_PATHS_DUPLICATE", "protected_paths contains duplicates")
    for mutation in normalized_allowed:
        for frozen in normalized_protected:
            if (
                mutation == frozen
                or mutation.startswith(frozen + "/")
                or frozen.startswith(mutation + "/")
            ):
                fail(
                    "E_MUTATION_PROTECTED_OVERLAP",
                    f"allowed mutation {mutation} overlaps protected path {frozen}",
                )


def require_project_scope(value: Any, schema: dict[str, Any]) -> None:
    if value != schema["project_scope"]:
        fail(
            "E_PROJECT_SCOPE",
            f"project_scope must be {schema['project_scope']!r}, got {value!r}",
        )


WORK_ORDER_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")


def namespace_dir(root: Path, schema: dict[str, Any], key: str, work_order_id: str) -> Path:
    if WORK_ORDER_ID_PATTERN.fullmatch(work_order_id) is None:
        fail("E_WORK_ORDER_ID_MISSING", f"work order id is not a safe name: {work_order_id!r}")
    return repo_path(root, f"{schema[key]}/{work_order_id}")


def require_in_namespace(
    root: Path,
    schema: dict[str, Any],
    key: str,
    work_order_id: str,
    path: Path,
    code: str,
    label: str,
) -> None:
    base = namespace_dir(root, schema, key, work_order_id).resolve(strict=False)
    resolved = path.resolve(strict=False)
    if base != resolved and base not in resolved.parents:
        fail(code, f"{label} must be inside {schema[key]}/{work_order_id}: {path}")


def validate_mutation_scope(manifest: dict[str, Any], schema: dict[str, Any]) -> None:
    forbidden = [normalize_relative(item) for item in schema["forbidden_mutation_roots"]]
    for item in manifest["allowed_mutations"]:
        mutation = normalize_relative(item)
        for frozen in forbidden:
            if (
                mutation == frozen
                or mutation.startswith(frozen + "/")
                or frozen.startswith(mutation + "/")
            ):
                fail(
                    "E_MUTATION_FORBIDDEN",
                    f"allowed mutation {mutation} touches gate-forbidden path {frozen}",
                )


def validate_capabilities(
    manifest: dict[str, Any],
    capabilities_path: Path,
    declarations: set[str],
    schema: dict[str, Any],
) -> list[str]:
    capabilities, _ = load_json(capabilities_path, "E_CAPABILITY_EVIDENCE_MISSING")
    available = capabilities.get("available")
    if not isinstance(available, list) or not all(isinstance(item, str) for item in available):
        fail("E_CAPABILITY_EVIDENCE_INVALID", "capabilities.available must be strings")
    required_entries = manifest["required_live_task_tools"]
    if not isinstance(required_entries, list) or not required_entries:
        fail("E_REQUIRED_TOOLS_MISSING", "required_live_task_tools must not be empty")
    required: list[str] = []
    for index, entry in enumerate(required_entries):
        label = f"required_live_task_tools[{index}]"
        require_declaration(entry, declarations, label, expected="VERIFIED")
        name = require_string(entry.get("name"), "E_REQUIRED_TOOLS_MISSING", f"{label}.name")
        required.append(name)
    if len(required) != len(set(required)):
        fail("E_REQUIRED_TOOLS_DUPLICATE", "required_live_task_tools contains duplicates")
    codex = sorted(set(required) & set(schema["forbidden_codex_tool_names"]))
    if codex:
        fail("E_CODEX_TOOL_FORBIDDEN", f"Codex task tools are not valid for this gate: {codex}")
    missing = sorted(set(required) - set(available))
    if missing:
        fail("E_CAPABILITY_MISSING", f"required live task capabilities are missing: {missing}")
    return sorted(required)


def validate_routing(
    manifest: dict[str, Any], schema: dict[str, Any], declarations: set[str]
) -> None:
    routes = manifest["model_routing"]
    if not isinstance(routes, list) or not routes:
        fail("E_ROUTING_MISSING", "model_routing must not be empty")
    for index, route in enumerate(routes):
        label = f"model_routing[{index}]"
        require_declaration(route, declarations, label, expected="VERIFIED")
        model_class = route.get("class")
        if not isinstance(model_class, str) or not model_class:
            fail("E_ROUTING_CLASS_MISSING", f"{label}.class is required")
        if model_class not in schema["model_classes"]:
            fail("E_ROUTING_CLASS_INVALID", f"{label}.class is invalid: {model_class}")
        requested = route.get("requested_model")
        if not isinstance(requested, str) or not requested:
            fail("E_ROUTING_MODEL_MISSING", f"{label}.requested_model is required")
        if requested not in schema["claude_models"]:
            fail(
                "E_ROUTING_MODEL_INVALID",
                f"{label}.requested_model is not a Claude model: {requested}",
            )
        reason = route.get("reason")
        if not isinstance(reason, str) or len(reason.strip()) < 12:
            fail("E_ROUTING_REASON_MISSING", f"{label}.reason is missing or too vague")
        for field in ("task", "context_fork", "attempts", "escalate_stop"):
            require_string(route.get(field), "E_ROUTING_FIELD_MISSING", f"{label}.{field}")
        if route.get("attestation") != schema["requested_model_attestation"]:
            fail("E_ROUTING_ATTESTATION", f"{label}.attestation is invalid")


def validate_orchestration(manifest: dict[str, Any], schema: dict[str, Any]) -> None:
    orchestration = manifest.get("orchestration")
    if not isinstance(orchestration, dict):
        fail("E_ORCHESTRATION_MISSING", "dispatch requires orchestration")
    require_fields(
        orchestration,
        (
            "director_mode",
            "director_mutation_allowed",
            "separate_worker_task",
            "worker_route",
            "monitoring",
            "independent_review",
            "maximum_independent_reviewer_tasks",
        ),
        "E_ORCHESTRATION_FIELD_MISSING",
    )
    if orchestration["director_mode"] != "orchestration_only":
        fail("E_DIRECTOR_SELF_EXECUTION", "Director mode must be orchestration_only")
    if orchestration["director_mutation_allowed"] is not False:
        fail("E_DIRECTOR_SELF_EXECUTION", "Director mutation must be explicitly prohibited")

    worker = orchestration["separate_worker_task"]
    if not isinstance(worker, dict):
        fail("E_SEPARATE_WORKER_MISSING", "separate_worker_task must be an object")
    require_fields(
        worker,
        ("required", "creation_tool", "separate_from_director"),
        "E_SEPARATE_WORKER_MISSING",
    )
    if worker["creation_tool"] in schema["forbidden_codex_tool_names"]:
        fail(
            "E_CODEX_TOOL_FORBIDDEN",
            f"Codex tool {worker['creation_tool']!r} is not a valid Worker creation tool",
        )
    if (
        worker["required"] is not True
        or worker["creation_tool"] != schema["worker_creation_tool"]
        or worker["separate_from_director"] is not True
    ):
        fail(
            "E_SEPARATE_WORKER_MISSING",
            "mutating work requires one Agent subagent Worker separate from the Director",
        )
    declared_tools = {
        entry.get("name")
        for entry in manifest["required_live_task_tools"]
        if isinstance(entry, dict)
    }
    if schema["worker_creation_tool"] not in declared_tools:
        fail(
            "E_ORCHESTRATION_CAPABILITY",
            f"orchestration tool is not required by the manifest: {schema['worker_creation_tool']}",
        )
    resume_tool = worker.get("resume_tool")
    if resume_tool is not None:
        if resume_tool != schema["optional_resume_tool"] or resume_tool not in declared_tools:
            fail(
                "E_ORCHESTRATION_CAPABILITY",
                f"resume_tool must be {schema['optional_resume_tool']} and a declared required tool",
            )

    route = orchestration["worker_route"]
    if not isinstance(route, dict):
        fail("E_ORCHESTRATION_ROUTE_MISSING", "worker_route must be an object")
    require_fields(
        route,
        ("requested_model", "reasoning_effort", "reason"),
        "E_ORCHESTRATION_ROUTE_MISSING",
    )
    requested_model = require_string(
        route["requested_model"],
        "E_ORCHESTRATION_ROUTE_MISSING",
        "orchestration.worker_route.requested_model",
    )
    if requested_model not in schema["claude_models"]:
        fail(
            "E_ROUTING_MODEL_INVALID",
            f"worker requested_model is not a Claude model: {requested_model}",
        )
    if route["reasoning_effort"] not in schema["reasoning_efforts"]:
        fail("E_ORCHESTRATION_REASONING", "worker reasoning_effort is missing or invalid")
    reason = route["reason"]
    if not isinstance(reason, str) or len(reason.strip()) < 12:
        fail("E_ORCHESTRATION_ROUTE_REASON", "worker model route requires a specific reason")
    matching_routes = [
        item
        for item in manifest["model_routing"]
        if isinstance(item, dict)
        and item.get("requested_model") == requested_model
        and item.get("reason") == reason
    ]
    if len(matching_routes) != 1:
        fail(
            "E_ORCHESTRATION_ROUTE_MISMATCH",
            "worker route must match exactly one declared model_routing entry",
        )

    monitoring = orchestration["monitoring"]
    if not isinstance(monitoring, dict):
        fail("E_ORCHESTRATION_MONITORING", "orchestration monitoring must be an object")
    require_fields(monitoring, ("required", "mode", "tool"), "E_ORCHESTRATION_MONITORING")
    if (
        monitoring["required"] is not True
        or monitoring["mode"] != schema["worker_monitoring_mode"]
        or monitoring["tool"] != schema["worker_creation_tool"]
    ):
        fail(
            "E_ORCHESTRATION_MONITORING",
            "Director must monitor the Worker through agent_completion of the Agent tool",
        )

    review = orchestration["independent_review"]
    if not isinstance(review, dict):
        fail("E_INDEPENDENT_REVIEW_CONTRACT", "independent_review must be an object")
    require_fields(
        review,
        (
            "required",
            "activation",
            "separate_reviewer_task",
            "reviewer_separate_from_worker_and_director",
            "builder_self_review_is_independent",
        ),
        "E_INDEPENDENT_REVIEW_CONTRACT",
    )
    if not isinstance(review["required"], bool):
        fail("E_INDEPENDENT_REVIEW_CONTRACT", "independent_review.required must be boolean")
    if review["activation"] != "after_reviewable_evidence":
        fail(
            "E_INDEPENDENT_REVIEW_CONTRACT",
            "independent review may activate only after reviewable evidence exists",
        )
    if review["builder_self_review_is_independent"] is not False:
        fail("E_SELF_REVIEW", "Builder self-review is never independent review")
    if review["required"] and (
        review["separate_reviewer_task"] is not True
        or review["reviewer_separate_from_worker_and_director"] is not True
    ):
        fail("E_SELF_REVIEW", "required independent review needs a separate Reviewer task identity")
    if orchestration["maximum_independent_reviewer_tasks"] != 1:
        fail(
            "E_REVIEWER_TASK_LIMIT",
            "a dispatch must allow at most one decision-relevant Reviewer task",
        )


def validate_roles(
    manifest: dict[str, Any], schema: dict[str, Any], declarations: set[str]
) -> None:
    requirements = manifest["role_requirements"]
    roles = manifest["roles"]
    if not isinstance(requirements, list) or not requirements or not all(
        isinstance(item, str) and item.strip() for item in requirements
    ):
        fail("E_ROLE_REQUIREMENTS_MISSING", "role_requirements must be non-empty strings")
    if not isinstance(roles, list) or not roles:
        fail("E_ROLES_MISSING", "roles must not be empty")
    classification = manifest["classification"]["value"]
    mandatory = set(requirements)
    if classification == "Critical":
        mandatory.update(schema["critical_mandatory_roles"])
    entries: dict[str, dict[str, Any]] = {}
    for index, entry in enumerate(roles):
        if not isinstance(entry, dict):
            fail("E_ROLES_INVALID", f"roles[{index}] must be an object")
        require_declaration(entry, declarations, f"roles[{index}]", expected="VERIFIED")
        role = require_string(entry.get("role"), "E_ROLES_INVALID", f"roles[{index}].role")
        if role in entries:
            fail("E_ROLE_DUPLICATE", f"duplicate role entry: {role}")
        entries[role] = entry
        status = entry.get("status")
        if status not in ("ACTIVATED", "NOT APPLICABLE"):
            fail("E_ROLE_STATUS_INVALID", f"role {role} has invalid status")
        reason = entry.get("reason")
        if status == "NOT APPLICABLE":
            if (
                not isinstance(reason, str)
                or len(reason.strip()) < 16
                or reason.strip().casefold() in GENERIC_NA_REASONS
            ):
                fail("E_NOT_APPLICABLE_UNJUSTIFIED", f"role {role} lacks a scope-specific reason")
    omitted = sorted(mandatory - set(entries))
    if omitted:
        fail("E_MANDATORY_ROLE_MISSING", f"mandatory roles omitted: {omitted}")
    invalid_na = sorted(role for role in mandatory if entries[role]["status"] != "ACTIVATED")
    if invalid_na:
        fail("E_MANDATORY_ROLE_NOT_APPLICABLE", f"mandatory roles must be activated: {invalid_na}")


# --------------------------------------------------------------------------
# External project root and night-shift mode (UR-GATE-EXTERNAL-NIGHT-V1)
#
# Both features are strictly opt-in per manifest.  A manifest without
# ``external_project`` and without ``execution_location: "cloud_night"`` takes
# none of the code paths below.
# --------------------------------------------------------------------------

HEX_COMMIT = re.compile(r"^[0-9a-f]{40}(?:[0-9a-f]{24})?$")
EXTERNAL_DRIVE_ROOT = re.compile(r"^([A-Za-z]):/((?:[^/:*?\"<>|]+/)*[^/:*?\"<>|]+)$")
EXTERNAL_POSIX_ROOT = re.compile(r"^/((?:[^/:*?\"<>|]+/)*[^/:*?\"<>|]+)$")
NIGHT_MANIFEST_FIELDS = ("night_branch", "night_evidence_dir")
# Underreign has no night cost cap (Human, 2026-10-24).  A ``budget`` field is
# rejected on every manifest so that no one mistakes it for an enforced limit.
UNSUPPORTED_MANIFEST_FIELDS = ("budget",)
EXT_PREFIX = "ext:"


def normalize_external_root(value: Any) -> str:
    """Return a forward-slash absolute root with an upper-case drive letter."""
    if not isinstance(value, str) or not value.strip():
        fail("E_EXTERNAL_ROOT_INVALID", "external root must be a non-empty string")
    normalized = value.replace("\\", "/").rstrip("/")
    match = EXTERNAL_DRIVE_ROOT.fullmatch(normalized)
    if match is not None:
        parts = match.group(2).split("/")
        prefix = f"{match.group(1).upper()}:/"
    else:
        match = EXTERNAL_POSIX_ROOT.fullmatch(normalized)
        if match is None:
            fail(
                "E_EXTERNAL_ROOT_INVALID",
                f"external root must be an absolute drive-letter path: {value!r}",
            )
        parts = match.group(1).split("/")
        prefix = "/"
    if any(part in (".", "..") for part in parts):
        fail("E_EXTERNAL_ROOT_INVALID", f"external root must not contain . or ..: {value!r}")
    return prefix + "/".join(parts)


def external_schema(schema: dict[str, Any]) -> dict[str, Any]:
    config = schema.get("external_project")
    if not isinstance(config, dict):
        fail("E_SCHEMA_EXTERNAL_MISSING", "schema has no external_project configuration")
    return config


def external_root_path(normalized_root: str) -> Path:
    path = Path(normalized_root)
    if path.exists() or path.is_symlink():
        reject_reparse_component(path, normalized_root)
    return path


def external_relative_list(value: Any, label: str, *, allow_root: bool = False) -> list[str]:
    if not isinstance(value, list) or not value or not all(isinstance(i, str) for i in value):
        fail("E_EXTERNAL_PATHS_INVALID", f"{label} must be a non-empty array of paths")
    normalized = [normalize_relative(item, allow_root=allow_root) for item in value]
    if len(normalized) != len(set(normalized)):
        fail("E_EXTERNAL_PATHS_INVALID", f"{label} contains duplicate paths")
    return normalized


def listing_projection(root: Path, paths: list[str]) -> str:
    """Sorted file-listing digest (path, sha256, size) used for an uninitialised root."""
    rows: dict[str, str] = {}
    if root.exists():
        for relative in paths:
            start = repo_path(root, relative, allow_root=True)
            if not start.exists():
                continue
            if start.is_file():
                candidates = [start]
            else:
                candidates = []
                for directory, _dirs, files in os.walk(start, followlinks=False):
                    reject_reparse_component(Path(directory), relative)
                    candidates.extend(Path(directory) / name for name in files)
            for item in candidates:
                reject_reparse_component(item, relative)
                key = item.relative_to(root).as_posix()
                raw = item.read_bytes()
                rows[key] = f"{key}\t{sha256_bytes(raw)}\t{len(raw)}"
    payload = "\n".join(rows[key] for key in sorted(rows)).encode("utf-8")
    return sha256_bytes(payload)


def validate_external_project(
    section: Any,
    schema: dict[str, Any],
    declarations: set[str],
    *,
    live: bool,
) -> dict[str, Any]:
    """Validate the optional ``external_project`` section; return its bound state.

    The allowed-root check happens before any filesystem access so that a root
    outside the schema list is never touched.
    """
    if not isinstance(section, dict):
        fail("E_EXTERNAL_SECTION", "external_project must be an object")
    require_declaration(section, declarations, "external_project", expected="VERIFIED")
    require_fields(
        section,
        ("root", "git", "allowed_mutations", "protected_paths", "dirty_state", "declaration"),
        "E_EXTERNAL_FIELD_MISSING",
    )
    root_text = normalize_external_root(section["root"])
    allowed_roots = {
        normalize_external_root(item) for item in external_schema(schema).get("allowed_roots", [])
    }
    if root_text not in allowed_roots:
        fail(
            "E_EXTERNAL_ROOT_NOT_ALLOWED",
            f"external root is not in the schema allow-list: {root_text}",
        )

    allowed = external_relative_list(
        section["allowed_mutations"], "external_project.allowed_mutations"
    )
    protected = external_relative_list(
        section["protected_paths"], "external_project.protected_paths"
    )
    for mutation in allowed:
        for frozen in protected:
            if (
                mutation == frozen
                or mutation.startswith(frozen + "/")
                or frozen.startswith(mutation + "/")
            ):
                fail(
                    "E_EXTERNAL_MUTATION_PROTECTED_OVERLAP",
                    f"external allowed mutation {mutation} overlaps protected path {frozen}",
                )

    git = section["git"]
    if git == "uninitialised":
        git_state: Any = "uninitialised"
    elif isinstance(git, dict):
        require_fields(git, ("branch", "head"), "E_EXTERNAL_GIT_INVALID")
        branch = require_string(git["branch"], "E_EXTERNAL_GIT_INVALID", "external git.branch")
        head = git["head"]
        if not isinstance(head, str) or HEX_COMMIT.fullmatch(head) is None:
            fail("E_EXTERNAL_GIT_INVALID", "external git.head must be a lowercase commit id")
        git_state = {"branch": branch, "head": head}
    else:
        fail(
            "E_EXTERNAL_GIT_INVALID",
            'external git must be "uninitialised" or an object with branch and head',
        )

    dirty = section["dirty_state"]
    if not isinstance(dirty, dict):
        fail("E_EXTERNAL_DIRTY_STATE", "external dirty_state must be an object")
    require_fields(dirty, ("mode", "paths", "sha256"), "E_EXTERNAL_DIRTY_STATE")
    if dirty["mode"] != "bounded_projection":
        fail("E_EXTERNAL_DIRTY_STATE", "only bounded_projection is supported")
    dirty_paths = external_relative_list(
        dirty["paths"], "external_project.dirty_state.paths", allow_root=True
    )
    expected_dirty = validate_sha(
        dirty["sha256"], "E_EXTERNAL_DIRTY_STATE", "external_project.dirty_state.sha256"
    )

    dirty_sha = expected_dirty
    if live:
        root = external_root_path(root_text)
        if git_state == "uninitialised":
            if root.exists() and (not root.is_dir() or any(root.iterdir())):
                fail(
                    "E_EXTERNAL_NOT_UNINITIALISED",
                    "uninitialised external root must be absent or an empty directory",
                )
            actual_dirty = listing_projection(root, dirty_paths)
        else:
            if not root.is_dir():
                fail("E_EXTERNAL_ROOT_MISSING", f"external root is missing: {root_text}")
            live_git = live_repository(root)
            if live_git["branch"] != git_state["branch"]:
                fail("E_EXTERNAL_BRANCH", f"external branch mismatch: {live_git['branch']}")
            if live_git["head"] != git_state["head"]:
                fail("E_EXTERNAL_HEAD", f"external HEAD mismatch: {live_git['head']}")
            actual_dirty = dirty_projection(root, dirty_paths)
        if actual_dirty != expected_dirty:
            fail(
                "E_EXTERNAL_DIRTY_DRIFT",
                f"external dirty projection drift: expected {expected_dirty}, got {actual_dirty}",
            )
        dirty_sha = actual_dirty

    return {
        "root": root_text,
        "git": git_state,
        "allowed_mutations": sorted(allowed),
        "protected_paths": sorted(protected),
        "dirty_state": {
            "mode": "bounded_projection",
            "paths": sorted(dirty_paths),
            "sha256": dirty_sha,
        },
    }


def validate_night_shift(
    manifest: dict[str, Any], schema: dict[str, Any], external: dict[str, Any] | None
) -> dict[str, Any]:
    config = external_schema(schema)
    if external is None:
        fail("E_NIGHT_EXTERNAL_REQUIRED", "cloud_night requires an external_project section")
    if not isinstance(external["git"], dict):
        fail(
            "E_NIGHT_GIT_REQUIRED",
            "cloud_night requires the external git branch and head (the evening base)",
        )
    for field in NIGHT_MANIFEST_FIELDS:
        if field not in manifest:
            fail("E_NIGHT_FIELD_MISSING", f"cloud_night requires manifest field: {field}")
    branch = manifest["night_branch"]
    pattern = re.compile(config["night_branch_pattern"])
    if not isinstance(branch, str) or pattern.fullmatch(branch) is None:
        fail("E_NIGHT_BRANCH", "night_branch must match night/<YYYY-MM-DD>")
    try:
        datetime.datetime.strptime(branch.split("/", 1)[1], "%Y-%m-%d")
    except ValueError:
        fail("E_NIGHT_BRANCH", f"night_branch is not a calendar date: {branch}")
    evidence_dir = manifest["night_evidence_dir"]
    if not isinstance(evidence_dir, str):
        fail("E_NIGHT_EVIDENCE_DIR", "night_evidence_dir must be a relative path string")
    evidence_dir = normalize_relative(evidence_dir)
    if not path_is_within(evidence_dir, external["allowed_mutations"]) or path_is_within(
        evidence_dir, external["protected_paths"]
    ):
        fail(
            "E_NIGHT_EVIDENCE_DIR",
            "night_evidence_dir must be inside external allowed_mutations and outside protected paths",
        )
    return {
        "branch": branch,
        "evidence_dir": evidence_dir,
    }


def validate_external_and_night(
    manifest: dict[str, Any],
    schema: dict[str, Any],
    declarations: set[str],
    *,
    live: bool,
) -> dict[str, Any]:
    """Return the receipt extras for the optional features; ``{}`` when neither is used."""
    location = manifest.get("execution_location", "local")
    if location not in schema.get("execution_locations", ["local"]):
        fail("E_EXECUTION_LOCATION", f"execution_location is invalid: {location!r}")
    unsupported = [field for field in UNSUPPORTED_MANIFEST_FIELDS if field in manifest]
    if unsupported:
        fail(
            "E_NIGHT_FIELDS_UNEXPECTED",
            f"fields not supported by the Underreign gate (no night budget): {unsupported}",
        )
    external = None
    if "external_project" in manifest:
        external = validate_external_project(
            manifest["external_project"], schema, declarations, live=live
        )
    night = None
    if location == "local":
        stray = [field for field in NIGHT_MANIFEST_FIELDS if field in manifest]
        if stray:
            fail("E_NIGHT_FIELDS_UNEXPECTED", f"night fields without cloud_night: {stray}")
    else:
        night = validate_night_shift(manifest, schema, external)
    extras: dict[str, Any] = {}
    if external is not None:
        state = dict(external)
        state["state_sha256"] = sha256_bytes(canonical_json(external))
        extras["external_project"] = state
        extras["execution_location"] = location
    if night is not None:
        extras["night_shift"] = night
    return extras


def validate_manifest(
    root: Path,
    manifest_path: Path,
    work_order_path: Path,
    capabilities_path: Path | None,
    schema: dict[str, Any],
    *,
    live: bool = True,
) -> dict[str, Any]:
    """Validate a dispatch manifest.

    ``live=False`` is the static pass used by ``verify-night-return``: it keeps
    every structural, Work Order and external-section check but skips the
    comparisons against live Studio repository state (HEAD, dirty projection,
    sources, baselines, project identity, capabilities), which legitimately
    change between the evening dispatch and the morning return.
    """
    manifest, manifest_raw = load_json(manifest_path, "E_MANIFEST_MISSING")
    require_fields(manifest, schema["required_manifest_fields"], "E_MANIFEST_FIELD_MISSING")
    if manifest["schema_version"] not in schema["supported_dispatch_manifest_versions"]:
        fail("E_SCHEMA_VERSION", "manifest schema_version mismatch")
    if manifest["kind"] != schema["manifest_kind"]:
        fail("E_MANIFEST_KIND", "manifest kind mismatch")
    require_project_scope(manifest["project_scope"], schema)
    declarations = set(schema["declaration_classes"])

    work_order_id = require_string(
        manifest["work_order_id"], "E_WORK_ORDER_ID_MISSING", "work_order_id"
    )
    require_in_namespace(
        root, schema, "dispatch_root", work_order_id, manifest_path,
        "E_DISPATCH_NAMESPACE", "manifest",
    )
    require_in_namespace(
        root, schema, "dispatch_root", work_order_id, work_order_path,
        "E_DISPATCH_NAMESPACE", "Work Order",
    )

    assignment = manifest["assignment_type"]
    require_declaration(assignment, declarations, "assignment_type", expected="VERIFIED")
    require_string(assignment.get("value"), "E_ASSIGNMENT_TYPE", "assignment_type.value")
    classification = manifest["classification"]
    require_declaration(classification, declarations, "classification", expected="VERIFIED")
    if classification.get("value") not in schema["model_classes"]:
        fail("E_CLASSIFICATION_INVALID", "classification.value is invalid")

    work_order = manifest["work_order"]
    require_declaration(work_order, declarations, "work_order", expected="VERIFIED")
    require_fields(work_order, ("path", "sha256", "declaration"), "E_WORK_ORDER_FIELD_MISSING")
    declared_work_order_path = normalize_relative(work_order["path"])
    expected_work_order_path = repo_path(root, declared_work_order_path)
    if expected_work_order_path.resolve() != work_order_path.resolve():
        fail("E_WORK_ORDER_PATH", "provided Work Order path does not match manifest")
    if not work_order_path.is_file():
        fail("E_WORK_ORDER_MISSING", f"Work Order is missing: {work_order_path}")
    work_order_raw = work_order_path.read_bytes()
    expected_work_order_hash = validate_sha(
        work_order["sha256"], "E_WORK_ORDER_HASH_INVALID", "work_order.sha256"
    )
    actual_work_order_hash = sha256_bytes(work_order_raw)
    if actual_work_order_hash != expected_work_order_hash:
        fail(
            "E_WORK_ORDER_HASH_MISMATCH",
            f"expected {expected_work_order_hash}, got {actual_work_order_hash}",
        )
    if work_order_id.encode("utf-8") not in work_order_raw:
        fail("E_WORK_ORDER_ID_MISMATCH", "Work Order bytes do not contain work_order_id")

    repository = manifest["repository"]
    require_declaration(repository, declarations, "repository", expected="VERIFIED")
    require_fields(
        repository,
        (
            "root",
            "repository_id",
            "project_path",
            "project_id",
            "project_identity",
            "branch",
            "head",
            "declaration",
        ),
        "E_REPOSITORY_FIELD_MISSING",
    )
    if normalize_relative(repository["root"], allow_root=True) != ".":
        fail("E_REPOSITORY_IDENTITY", "repository.root must be '.'")
    require_string(repository["repository_id"], "E_REPOSITORY_IDENTITY", "repository_id")
    if normalize_relative(repository["project_path"]) != schema["project_path"]:
        fail("E_PROJECT_SCOPE", f"repository.project_path must be {schema['project_path']}")
    project_identity_digest = None
    live_repo = None
    if live:
        project_identity_digest = validate_project_identity(root, repository, declarations)
        live_repo = live_repository(root)
        if repository["branch"] != live_repo["branch"]:
            fail("E_REPOSITORY_BRANCH", f"branch mismatch: {live_repo['branch']}")
        if repository["head"] != live_repo["head"]:
            fail("E_REPOSITORY_HEAD", f"HEAD mismatch: {live_repo['head']}")

    dirty = manifest["dirty_state"]
    require_declaration(dirty, declarations, "dirty_state", expected="VERIFIED")
    require_fields(dirty, ("mode", "paths", "sha256", "declaration"), "E_DIRTY_STATE_MISSING")
    if dirty["mode"] != "bounded_projection":
        fail("E_DIRTY_STATE_MODE", "only bounded_projection is supported")
    if not isinstance(dirty["paths"], list):
        fail("E_DIRTY_STATE_MISSING", "dirty_state.paths must be an array")
    expected_dirty = validate_sha(dirty["sha256"], "E_DIRTY_STATE_HASH_INVALID", "dirty_state.sha256")
    actual_dirty = expected_dirty
    if live:
        actual_dirty = dirty_projection(root, dirty["paths"])
        if actual_dirty != expected_dirty:
            fail("E_DIRTY_STATE_DRIFT", f"dirty projection drift: expected {expected_dirty}, got {actual_dirty}")

    authority = manifest["human_authority"]
    require_declaration(authority, declarations, "human_authority", expected="HUMAN DECISION")
    require_string(authority.get("statement"), "E_HUMAN_AUTHORITY_MISSING", "human_authority.statement")
    stop = manifest["stop_boundary"]
    require_declaration(stop, declarations, "stop_boundary")
    require_string(stop.get("statement"), "E_STOP_BOUNDARY_MISSING", "stop_boundary.statement")
    checkpoint = manifest["human_checkpoint"]
    require_declaration(checkpoint, declarations, "human_checkpoint", expected="HUMAN DECISION")
    require_string(checkpoint.get("statement"), "E_HUMAN_CHECKPOINT_MISSING", "human_checkpoint.statement")

    execution = manifest["execution_mode"]
    require_declaration(execution, declarations, "execution_mode", expected="VERIFIED")
    if execution.get("value") not in schema["execution_modes"]:
        fail("E_EXECUTION_MODE", "execution_mode.value is invalid")
    correction = manifest["correction_allowance"]
    require_declaration(correction, declarations, "correction_allowance")
    rounds = correction.get("rounds")
    if not isinstance(rounds, int) or isinstance(rounds, bool) or rounds not in (0, 1, 2):
        fail("E_CORRECTION_ALLOWANCE", "correction_allowance.rounds must be 0, 1, or 2")
    require_string(correction.get("stage"), "E_CORRECTION_ALLOWANCE", "correction_allowance.stage")
    monitoring = manifest["monitoring"]
    require_declaration(monitoring, declarations, "monitoring", expected="VERIFIED")
    require_string(monitoring.get("owner"), "E_MONITORING_OWNER_MISSING", "monitoring.owner")
    plan = manifest["visible_task_plan"]
    if not isinstance(plan, list) or not plan:
        fail("E_VISIBLE_PLAN_MISSING", "visible_task_plan must not be empty")
    for index, step in enumerate(plan):
        if not isinstance(step, dict):
            fail("E_VISIBLE_PLAN_MISSING", f"visible_task_plan[{index}] must be an object")
        require_string(step.get("step"), "E_VISIBLE_PLAN_MISSING", f"visible_task_plan[{index}].step")
        if step.get("status") not in ("pending", "in_progress", "completed"):
            fail("E_VISIBLE_PLAN_MISSING", f"visible_task_plan[{index}].status is invalid")

    baseline_digest = None
    if live:
        baseline_digest = validate_baselines(root, manifest["baselines"], declarations)

    validate_path_boundaries(manifest)
    validate_mutation_scope(manifest, schema)
    validate_routing(manifest, schema, declarations)
    validate_orchestration(manifest, schema)
    validate_roles(manifest, schema, declarations)
    receipt_extras = validate_external_and_night(manifest, schema, declarations, live=live)
    required_tools = None
    source_digest = None
    if live:
        required_tools = validate_capabilities(manifest, capabilities_path, declarations, schema)
        source_digest = source_state(root, manifest, declarations)
    return {
        "manifest": manifest,
        "schema_version": manifest["schema_version"],
        "manifest_sha256": sha256_bytes(manifest_raw),
        "work_order_sha256": actual_work_order_hash,
        "receipt_extras": receipt_extras,
        "repository": live_repo,
        "project_identity_sha256": project_identity_digest,
        "dirty_state": {
            "mode": "bounded_projection",
            "paths": [normalize_relative(item) for item in dirty["paths"]],
            "sha256": actual_dirty,
        },
        "source_state_sha256": source_digest,
        "baseline_state_sha256": baseline_digest,
        "required_live_task_tools": required_tools,
    }


def build_receipt(validated: dict[str, Any], schema: dict[str, Any]) -> dict[str, Any]:
    manifest = validated["manifest"]
    receipt: dict[str, Any] = {
        "schema_version": validated["schema_version"],
        "kind": schema["receipt_kind"],
        "gate_state": schema["state"],
        "project_scope": schema["project_scope"],
        "work_order_id": manifest["work_order_id"],
        "work_order_sha256": validated["work_order_sha256"],
        "manifest_sha256": validated["manifest_sha256"],
        "repository": validated["repository"],
        "project_identity_sha256": validated["project_identity_sha256"],
        "dirty_state": validated["dirty_state"],
        "source_state_sha256": validated["source_state_sha256"],
        "baseline_state_sha256": validated["baseline_state_sha256"],
        "required_live_task_tools": validated["required_live_task_tools"],
    }
    receipt.update(validated.get("receipt_extras", {}))
    receipt["receipt_id"] = sha256_bytes(canonical_json(receipt))
    return receipt


def verify_receipt(
    receipt_path: Path,
    validated: dict[str, Any],
    schema: dict[str, Any],
    *,
    live: bool = True,
) -> dict[str, Any]:
    receipt, _ = load_json(receipt_path, "E_RECEIPT_MISSING")
    require_fields(receipt, schema["required_receipt_fields"], "E_RECEIPT_FIELD_MISSING")
    if (
        receipt["schema_version"] != validated["schema_version"]
        or receipt["kind"] != schema["receipt_kind"]
    ):
        fail("E_RECEIPT_INVALID", "receipt schema or kind mismatch")
    if receipt["gate_state"] != schema["state"]:
        fail(
            "E_RECEIPT_STATE",
            f"receipt gate_state must exactly equal schema state {schema['state']}",
        )
    if receipt["project_scope"] != schema["project_scope"]:
        fail("E_PROJECT_SCOPE", "receipt project_scope mismatch")
    unsigned = dict(receipt)
    unsigned.pop("receipt_id", None)
    if receipt["receipt_id"] != sha256_bytes(canonical_json(unsigned)):
        fail("E_RECEIPT_TAMPERED", "receipt_id does not match receipt content")
    manifest = validated["manifest"]
    bound_fields = {
        "work_order_id": manifest["work_order_id"],
        "work_order_sha256": validated["work_order_sha256"],
        "manifest_sha256": validated["manifest_sha256"],
    }
    mismatched = [key for key, expected in bound_fields.items() if receipt.get(key) != expected]
    if mismatched:
        fail("E_RECEIPT_REUSE", f"receipt is bound to another manifest or Work Order: {mismatched}")
    if live:
        if receipt["repository"] != validated["repository"]:
            fail("E_RECEIPT_STALE_REPOSITORY", "live repository identity differs from receipt")
        if receipt["project_identity_sha256"] != validated["project_identity_sha256"]:
            fail("E_RECEIPT_STALE_PROJECT", "live project identity differs from receipt")
        if receipt["dirty_state"] != validated["dirty_state"]:
            fail("E_RECEIPT_STALE_DIRTY_STATE", "live dirty projection differs from receipt")
        if receipt["source_state_sha256"] != validated["source_state_sha256"]:
            fail("E_RECEIPT_STALE_SOURCE", "live canonical source state differs from receipt")
        if receipt["baseline_state_sha256"] != validated["baseline_state_sha256"]:
            fail("E_RECEIPT_STALE_BASELINE", "live technical baseline state differs from receipt")
        if receipt["required_live_task_tools"] != validated["required_live_task_tools"]:
            fail("E_RECEIPT_CAPABILITIES", "required capability set differs from receipt")
    check_receipt_extras(receipt, validated.get("receipt_extras", {}))
    return receipt


def check_receipt_extras(receipt: dict[str, Any], extras: dict[str, Any]) -> None:
    """External-root and night-shift state bound by the receipt (absent for old manifests)."""
    for key in ("external_project", "execution_location", "night_shift"):
        if receipt.get(key) != extras.get(key):
            fail(
                "E_RECEIPT_STALE_EXTERNAL",
                f"receipt {key} differs from the manifest/live external state",
            )


def write_new_json(
    root: Path, manifest_path: Path, path: Path, value: dict[str, Any]
) -> None:
    validate_receipt_location(root, manifest_path, path, must_exist=False)
    if path.exists():
        fail("E_RECEIPT_EXISTS", f"receipt output already exists: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(value, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=path.parent
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        try:
            os.link(temporary, path)
        except FileExistsError:
            fail("E_RECEIPT_EXISTS", f"receipt output appeared during write: {path}")
        temporary.unlink()
    finally:
        if temporary.exists():
            temporary.unlink()


def validate_receipt_location(
    root: Path,
    manifest_path: Path,
    receipt_path: Path,
    *,
    must_exist: bool,
) -> None:
    resolved_root = root.resolve()
    resolved = receipt_path.resolve(strict=False)
    if resolved != resolved_root and resolved_root not in resolved.parents:
        fail("E_RECEIPT_PATH", "receipt must remain inside repository")
    if receipt_path.parent.resolve() != manifest_path.parent.resolve():
        fail("E_RECEIPT_PATH", "receipt must be a sibling of the manifest")
    try:
        relative = receipt_path.absolute().relative_to(resolved_root).as_posix()
    except ValueError:
        fail("E_RECEIPT_PATH", "receipt must remain inside repository")
    repo_path(root, relative)
    if must_exist and not receipt_path.is_file():
        fail("E_RECEIPT_MISSING", f"required receipt is missing: {receipt_path}")


def validate_file_identity_entries(
    root: Path,
    entries: Any,
    allowed_roots: list[str],
    *,
    label: str,
    external: dict[str, Any] | None = None,
) -> tuple[str, list[dict[str, Any]]]:
    stale_code = (
        "E_CLOSURE_CANDIDATE_STALE" if label == "candidate.files" else "E_CLOSURE_FILE_STALE"
    )
    if not isinstance(entries, list) or not entries:
        fail("E_CLOSURE_FILE_SET", f"{label} must be a non-empty array")
    normalized_allowed = [normalize_relative(path) for path in allowed_roots]
    verified: list[dict[str, Any]] = []
    seen_paths: set[str] = set()
    seen_ids: set[str] = set()
    for index, entry in enumerate(entries):
        item_label = f"{label}[{index}]"
        if not isinstance(entry, dict):
            fail("E_CLOSURE_FILE_SET", f"{item_label} must be an object")
        require_fields(entry, ("path", "sha256", "size"), "E_CLOSURE_FILE_SET")
        is_external = (
            label == "candidate.files"
            and isinstance(entry["path"], str)
            and entry["path"].startswith(EXT_PREFIX)
        )
        if is_external:
            if external is None:
                fail(
                    "E_CLOSURE_EXTERNAL_UNDECLARED",
                    "ext: candidate file but the dispatch declares no external_project",
                )
            relative = normalize_relative(entry["path"][len(EXT_PREFIX):])
            display = EXT_PREFIX + relative
            if display in seen_paths:
                fail("E_CLOSURE_FILE_SET", f"duplicate closure file path: {display}")
            seen_paths.add(display)
            if _under(relative, external["protected_paths"], fold=True) or not _under(
                relative, external["allowed_mutations"], fold=False
            ):
                fail(
                    "E_CLOSURE_SCOPE",
                    f"closure file is outside external dispatch mutations: {display}",
                )
            file_root = external_root_path(external["root"])
            path = repo_path(file_root, relative)
            relative = display
        else:
            relative = normalize_relative(entry["path"])
            if relative in seen_paths:
                fail("E_CLOSURE_FILE_SET", f"duplicate closure file path: {relative}")
            seen_paths.add(relative)
            if not path_is_within(relative, normalized_allowed):
                fail("E_CLOSURE_SCOPE", f"closure file is outside dispatch mutations: {relative}")
        item_id = entry.get("id")
        if item_id is not None:
            item_id = require_string(item_id, "E_CLOSURE_FILE_SET", f"{item_label}.id")
            if item_id in seen_ids:
                fail("E_CLOSURE_FILE_SET", f"duplicate closure evidence id: {item_id}")
            seen_ids.add(item_id)
        if not is_external:
            path = repo_path(root, relative)
        if not path.is_file():
            fail("E_CLOSURE_FILE_MISSING", f"closure file is missing: {relative}")
        raw = path.read_bytes()
        actual_hash = sha256_bytes(raw)
        expected_hash = validate_sha(
            entry["sha256"], "E_CLOSURE_FILE_HASH", f"{item_label}.sha256"
        )
        if actual_hash != expected_hash:
            fail(
                stale_code,
                f"closure file drift for {relative}: expected {expected_hash}, got {actual_hash}",
            )
        size = entry["size"]
        if not isinstance(size, int) or isinstance(size, bool) or size < 0:
            fail("E_CLOSURE_FILE_SET", f"{item_label}.size must be a non-negative integer")
        if len(raw) != size:
            fail(
                stale_code,
                f"closure file size drift for {relative}: expected {size}, got {len(raw)}",
            )
        verified_entry: dict[str, Any] = {
            "path": relative,
            "sha256": actual_hash,
            "size": len(raw),
        }
        if item_id is not None:
            verified_entry["id"] = item_id
        verified.append(verified_entry)
    rows = sorted(verified, key=lambda item: item["path"].casefold())
    if all("id" not in item for item in rows):
        payload = "\n".join(
            f"{item['path']}\t{item['sha256']}\t{item['size']}" for item in rows
        ).encode("utf-8")
    else:
        if not all("id" in item for item in rows):
            fail("E_CLOSURE_FILE_SET", f"{label} must either declare every id or no ids")
        payload = canonical_json(sorted(rows, key=lambda item: item["id"]))
    return sha256_bytes(payload), rows


def validate_dispatch_closure_binding(
    root: Path,
    closure: dict[str, Any],
    work_order_path: Path,
    schema: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    dispatch = closure["dispatch"]
    if not isinstance(dispatch, dict):
        fail("E_CLOSURE_DISPATCH", "dispatch must be an object")
    declarations = set(schema["declaration_classes"])
    require_declaration(dispatch, declarations, "dispatch", expected="VERIFIED")
    require_fields(
        dispatch,
        (
            "manifest_path",
            "manifest_sha256",
            "receipt_path",
            "receipt_sha256",
            "receipt_id",
            "declaration",
        ),
        "E_CLOSURE_DISPATCH",
    )
    manifest_path = repo_path(root, normalize_relative(dispatch["manifest_path"]))
    receipt_path = repo_path(root, normalize_relative(dispatch["receipt_path"]))
    if manifest_path.parent.resolve() != receipt_path.parent.resolve():
        fail("E_CLOSURE_DISPATCH", "dispatch receipt must be a manifest sibling")
    dispatch_manifest, dispatch_raw = load_json(manifest_path, "E_CLOSURE_DISPATCH")
    dispatch_receipt, receipt_raw = load_json(receipt_path, "E_CLOSURE_DISPATCH")
    actual_manifest_hash = sha256_bytes(dispatch_raw)
    actual_receipt_hash = sha256_bytes(receipt_raw)
    if actual_manifest_hash != validate_sha(
        dispatch["manifest_sha256"], "E_CLOSURE_DISPATCH", "dispatch.manifest_sha256"
    ):
        fail("E_CLOSURE_DISPATCH_STALE", "dispatch manifest hash mismatch")
    if actual_receipt_hash != validate_sha(
        dispatch["receipt_sha256"], "E_CLOSURE_DISPATCH", "dispatch.receipt_sha256"
    ):
        fail("E_CLOSURE_DISPATCH_STALE", "dispatch receipt hash mismatch")
    require_fields(dispatch_manifest, schema["required_manifest_fields"], "E_CLOSURE_DISPATCH")
    if dispatch_manifest.get("schema_version") not in schema["supported_dispatch_manifest_versions"]:
        fail("E_CLOSURE_DISPATCH_VERSION", "closure requires a supported dispatch manifest")
    if dispatch_manifest.get("kind") != schema["manifest_kind"]:
        fail("E_CLOSURE_DISPATCH", "dispatch manifest kind mismatch")
    require_project_scope(dispatch_manifest.get("project_scope"), schema)
    require_in_namespace(
        root, schema, "dispatch_root", str(dispatch_manifest["work_order_id"]), manifest_path,
        "E_DISPATCH_NAMESPACE", "dispatch manifest",
    )
    validate_routing(dispatch_manifest, schema, declarations)
    validate_orchestration(dispatch_manifest, schema)
    if not dispatch_manifest["orchestration"]["independent_review"]["required"]:
        fail("E_CLOSURE_REVIEW_NOT_REQUIRED", "this closure path requires independent review")

    require_fields(
        dispatch_receipt, schema["required_receipt_fields"], "E_CLOSURE_DISPATCH_RECEIPT"
    )
    if (
        dispatch_receipt.get("schema_version") != dispatch_manifest["schema_version"]
        or dispatch_receipt.get("kind") != schema["receipt_kind"]
        or dispatch_receipt.get("gate_state") != schema["state"]
        or dispatch_receipt.get("project_scope") != schema["project_scope"]
    ):
        fail("E_CLOSURE_DISPATCH_RECEIPT", "dispatch receipt schema, kind, state or scope mismatch")
    unsigned = dict(dispatch_receipt)
    supplied_receipt_id = unsigned.pop("receipt_id", None)
    if supplied_receipt_id != sha256_bytes(canonical_json(unsigned)):
        fail("E_CLOSURE_DISPATCH_RECEIPT", "dispatch receipt identity is invalid")
    if supplied_receipt_id != dispatch["receipt_id"]:
        fail("E_CLOSURE_DISPATCH_RECEIPT", "dispatch receipt id mismatch")

    work_order = closure["work_order"]
    dispatch_work_order = dispatch_manifest.get("work_order")
    if not isinstance(dispatch_work_order, dict):
        fail("E_CLOSURE_WORK_ORDER", "dispatch work_order is invalid")
    bound = {
        "work_order_id": work_order["id"],
        "work_order_sha256": work_order["sha256"],
        "manifest_sha256": actual_manifest_hash,
    }
    mismatched = [key for key, value in bound.items() if dispatch_receipt.get(key) != value]
    if mismatched:
        fail("E_CLOSURE_DISPATCH_RECEIPT", f"dispatch receipt binding mismatch: {mismatched}")
    if (
        dispatch_manifest.get("work_order_id") != work_order["id"]
        or dispatch_work_order.get("sha256") != work_order["sha256"]
        or repo_path(root, normalize_relative(dispatch_work_order.get("path", ""))).resolve()
        != work_order_path.resolve()
    ):
        fail("E_CLOSURE_WORK_ORDER", "dispatch and closure Work Order identity mismatch")
    # External root / night shift (opt-in).  Static pass only: the live state is
    # intentionally not re-compared at closure; the receipt must still bind it.
    extras = validate_external_and_night(dispatch_manifest, schema, declarations, live=False)
    try:
        check_receipt_extras(dispatch_receipt, extras)
    except GateError as exc:
        fail("E_CLOSURE_DISPATCH_RECEIPT", exc.detail)
    return dispatch_manifest, dispatch_receipt, extras


def validate_closure_night_return(
    root: Path,
    closure: dict[str, Any],
    dispatch_manifest: dict[str, Any],
    dispatch_receipt: dict[str, Any],
    work_order_hash: str,
    extras: dict[str, Any],
    schema: dict[str, Any],
    declarations: set[str],
) -> str:
    """A cloud_night closure needs the verified night return receipt; returns its id."""
    night_return = closure.get("night_return")
    if not isinstance(night_return, dict):
        fail("E_CLOSURE_NIGHT_RETURN_MISSING", "cloud_night closure requires night_return")
    require_declaration(night_return, declarations, "night_return", expected="VERIFIED")
    require_fields(
        night_return,
        ("receipt_path", "receipt_sha256", "receipt_id", "declaration"),
        "E_CLOSURE_NIGHT_RETURN_MISSING",
    )
    dispatch = closure["dispatch"]
    manifest_path = repo_path(root, normalize_relative(dispatch["manifest_path"]))
    receipt_path = repo_path(root, normalize_relative(night_return["receipt_path"]))
    if receipt_path.parent.resolve() != manifest_path.parent.resolve():
        fail("E_CLOSURE_NIGHT_RETURN_MISSING", "night return receipt must be a dispatch manifest sibling")
    receipt, raw = load_json(receipt_path, "E_CLOSURE_NIGHT_RETURN_MISSING")
    if sha256_bytes(raw) != validate_sha(
        night_return["receipt_sha256"], "E_CLOSURE_NIGHT_RETURN_STALE", "night_return.receipt_sha256"
    ):
        fail("E_CLOSURE_NIGHT_RETURN_STALE", "night return receipt hash mismatch")
    verify_night_return_receipt(
        receipt,
        work_order_id=dispatch_manifest["work_order_id"],
        work_order_sha256=work_order_hash,
        manifest_sha256=sha256_bytes(manifest_path.read_bytes()),
        dispatch_receipt_id=dispatch_receipt["receipt_id"],
        extras=extras,
        schema=schema,
    )
    if receipt["receipt_id"] != night_return["receipt_id"]:
        fail("E_NIGHT_RETURN_REUSE", "night return receipt id differs from the closure manifest")
    ext_root = external_root_path(extras["external_project"]["root"])
    if not ext_root.is_dir() or git_try(
        ext_root, "cat-file", "-e", f"{receipt['branch_head']}^{{commit}}"
    ) is None:
        fail(
            "E_CLOSURE_NIGHT_RETURN_HEAD",
            "recorded night branch head is not a commit in the external repository",
        )
    return receipt["receipt_id"]


def validate_closure_manifest(
    root: Path,
    closure_manifest_path: Path,
    work_order_path: Path,
    schema: dict[str, Any],
) -> dict[str, Any]:
    closure, closure_raw = load_json(closure_manifest_path, "E_CLOSURE_MANIFEST_MISSING")
    require_fields(
        closure,
        schema["required_closure_manifest_fields"],
        "E_CLOSURE_MANIFEST_FIELD_MISSING",
    )
    if (
        closure["schema_version"] != schema["closure_schema_version"]
        or closure["kind"] != schema["closure_manifest_kind"]
    ):
        fail("E_CLOSURE_SCHEMA", "closure manifest schema or kind mismatch")
    require_project_scope(closure["project_scope"], schema)
    declarations = set(schema["declaration_classes"])
    require_declaration(closure, declarations, "closure", expected="VERIFIED")

    work_order = closure["work_order"]
    if not isinstance(work_order, dict):
        fail("E_CLOSURE_WORK_ORDER", "work_order must be an object")
    require_declaration(work_order, declarations, "closure.work_order", expected="VERIFIED")
    require_fields(
        work_order, ("id", "path", "sha256", "declaration"), "E_CLOSURE_WORK_ORDER"
    )
    work_order_id = require_string(work_order["id"], "E_CLOSURE_WORK_ORDER", "work_order.id")
    require_in_namespace(
        root, schema, "evidence_root", work_order_id, closure_manifest_path,
        "E_EVIDENCE_NAMESPACE", "closure manifest",
    )
    require_in_namespace(
        root, schema, "dispatch_root", work_order_id, work_order_path,
        "E_DISPATCH_NAMESPACE", "Work Order",
    )
    declared_work_order = repo_path(root, normalize_relative(work_order["path"]))
    if declared_work_order.resolve() != work_order_path.resolve() or not work_order_path.is_file():
        fail("E_CLOSURE_WORK_ORDER", "provided Work Order path does not match closure")
    work_order_raw = work_order_path.read_bytes()
    work_order_hash = sha256_bytes(work_order_raw)
    if work_order_hash != validate_sha(
        work_order["sha256"], "E_CLOSURE_WORK_ORDER", "work_order.sha256"
    ):
        fail("E_CLOSURE_WORK_ORDER", "closure Work Order hash mismatch")
    if work_order_id.encode("utf-8") not in work_order_raw:
        fail("E_CLOSURE_WORK_ORDER", "Work Order bytes do not contain closure id")

    dispatch_manifest, dispatch_receipt, extras = validate_dispatch_closure_binding(
        root, closure, work_order_path, schema
    )
    external_state = extras.get("external_project")
    if not isinstance(dispatch_manifest["allowed_mutations"], list) or not all(
        isinstance(path, str) for path in dispatch_manifest["allowed_mutations"]
    ):
        fail("E_CLOSURE_SCOPE", "dispatch allowed_mutations is invalid")
    allowed_roots = [normalize_relative(path) for path in dispatch_manifest["allowed_mutations"]]

    tasks = closure["tasks"]
    if not isinstance(tasks, dict):
        fail("E_CLOSURE_TASK_IDENTITY", "tasks must be an object")
    require_fields(
        tasks,
        ("director_task_id", "worker_task_id", "reviewer_task_id"),
        "E_CLOSURE_TASK_IDENTITY",
    )
    task_ids = [
        require_string(tasks[key], "E_CLOSURE_TASK_IDENTITY", f"tasks.{key}")
        for key in ("director_task_id", "worker_task_id", "reviewer_task_id")
    ]
    if len(set(task_ids)) != 3:
        fail(
            "E_CLOSURE_SELF_REVIEW",
            "Director, Worker, and independent Reviewer task identities must be distinct",
        )

    candidate = closure["candidate"]
    if not isinstance(candidate, dict):
        fail("E_CLOSURE_CANDIDATE", "candidate must be an object")
    require_declaration(candidate, declarations, "candidate", expected="VERIFIED")
    require_fields(candidate, ("identity", "files", "declaration"), "E_CLOSURE_CANDIDATE")
    candidate_identity_actual, candidate_rows = validate_file_identity_entries(
        root, candidate["files"], allowed_roots, label="candidate.files", external=external_state
    )
    if any("id" in item for item in candidate_rows):
        fail("E_CLOSURE_CANDIDATE", "candidate file entries must not declare evidence ids")
    candidate_identity_expected = validate_sha(
        candidate["identity"], "E_CLOSURE_CANDIDATE", "candidate.identity"
    )
    if candidate_identity_actual != candidate_identity_expected:
        fail(
            "E_CLOSURE_CANDIDATE_STALE",
            f"candidate identity mismatch: expected {candidate_identity_expected}, got {candidate_identity_actual}",
        )

    evidence_identity, evidence_rows = validate_file_identity_entries(
        root, closure["evidence"], allowed_roots, label="evidence"
    )
    if not all("id" in item for item in evidence_rows):
        fail("E_CLOSURE_FILE_SET", "every closure evidence entry requires an id")
    for item in evidence_rows:
        require_in_namespace(
            root, schema, "evidence_root", work_order_id, repo_path(root, item["path"]),
            "E_EVIDENCE_NAMESPACE", "closure evidence",
        )
    evidence_ids = sorted(item["id"] for item in evidence_rows)

    review = closure["independent_review"]
    if not isinstance(review, dict):
        fail("E_CLOSURE_REVIEW", "independent_review must be an object")
    require_declaration(review, declarations, "independent_review", expected="VERIFIED")
    require_fields(
        review,
        (
            "required",
            "reviewer_role",
            "record_path",
            "record_sha256",
            "verdict",
            "reviewed_candidate_identity",
            "reviewed_evidence_ids",
            "declaration",
        ),
        "E_CLOSURE_REVIEW",
    )
    if review["required"] is not True or review["verdict"] != "PASS":
        fail("E_CLOSURE_VERDICT", "independent closure requires an applicable PASS verdict")
    reviewer_role = require_string(
        review["reviewer_role"], "E_CLOSURE_REVIEW", "independent_review.reviewer_role"
    )
    if review["reviewed_candidate_identity"] != candidate_identity_actual:
        fail("E_CLOSURE_REVIEW_MISMATCH", "review references another candidate identity")
    if not isinstance(review["reviewed_evidence_ids"], list) or not all(
        isinstance(item, str) and item for item in review["reviewed_evidence_ids"]
    ):
        fail("E_CLOSURE_REVIEW", "reviewed_evidence_ids must be non-empty strings")
    if sorted(review["reviewed_evidence_ids"]) != evidence_ids:
        fail("E_CLOSURE_REVIEW_MISMATCH", "review references another evidence set")
    record_relative = normalize_relative(review["record_path"])
    if not path_is_within(record_relative, allowed_roots):
        fail("E_CLOSURE_SCOPE", "review record is outside dispatch mutations")
    record_path = repo_path(root, record_relative)
    require_in_namespace(
        root, schema, "evidence_root", work_order_id, record_path,
        "E_EVIDENCE_NAMESPACE", "review record",
    )
    review_record, record_raw = load_json(record_path, "E_CLOSURE_REVIEW_MISSING")
    record_hash = sha256_bytes(record_raw)
    if record_hash != validate_sha(
        review["record_sha256"], "E_CLOSURE_REVIEW", "independent_review.record_sha256"
    ):
        fail("E_CLOSURE_REVIEW_STALE", "independent review record hash mismatch")
    require_fields(
        review_record,
        (
            "kind",
            "work_order_id",
            "director_task_id",
            "worker_task_id",
            "reviewer_task_id",
            "reviewer_role",
            "candidate_identity",
            "evidence_ids",
            "verdict",
        ),
        "E_CLOSURE_REVIEW_MISMATCH",
    )
    expected_review = {
        "kind": schema["independent_review_record_kind"],
        "work_order_id": work_order_id,
        "director_task_id": tasks["director_task_id"],
        "worker_task_id": tasks["worker_task_id"],
        "reviewer_task_id": tasks["reviewer_task_id"],
        "reviewer_role": reviewer_role,
        "candidate_identity": candidate_identity_actual,
        "evidence_ids": evidence_ids,
        "verdict": "PASS",
    }
    mismatched_review = [
        key for key, value in expected_review.items() if review_record.get(key) != value
    ]
    if mismatched_review:
        fail(
            "E_CLOSURE_REVIEW_MISMATCH",
            f"independent review record mismatch: {mismatched_review}",
        )

    night_return_id = None
    if "night_shift" in extras:
        night_return_id = validate_closure_night_return(
            root, closure, dispatch_manifest, dispatch_receipt, work_order_hash,
            extras, schema, declarations,
        )
    elif "night_return" in closure:
        fail("E_CLOSURE_NIGHT_UNEXPECTED", "night_return given for an order that is not cloud_night")

    operational = closure["operational_state"]
    if not isinstance(operational, dict):
        fail("E_CLOSURE_OPERATIONAL_STATE", "operational_state must be an object")
    require_fields(
        operational,
        ("work_state_path", "handover_path"),
        "E_CLOSURE_OPERATIONAL_STATE",
    )
    expected_state = schema["operational_state_paths"]
    if (
        normalize_relative(operational["work_state_path"]) != expected_state["work_state_path"]
        or normalize_relative(operational["handover_path"]) != expected_state["handover_path"]
    ):
        fail(
            "E_CLOSURE_OPERATIONAL_STATE",
            "closure operational state must target the Underreign WORK_STATE and CURRENT_HANDOVER",
        )
    return {
        "closure": closure,
        "closure_manifest_sha256": sha256_bytes(closure_raw),
        "work_order_id": work_order_id,
        "work_order_sha256": work_order_hash,
        "dispatch_receipt_id": dispatch_receipt["receipt_id"],
        "director_task_id": tasks["director_task_id"],
        "worker_task_id": tasks["worker_task_id"],
        "reviewer_task_id": tasks["reviewer_task_id"],
        "candidate_identity": candidate_identity_actual,
        "candidate_rows": candidate_rows,
        "evidence_state_sha256": evidence_identity,
        "evidence_rows": evidence_rows,
        "review_record_sha256": record_hash,
        "reviewer_role": reviewer_role,
        "verdict": "PASS",
        "night_return_receipt_id": night_return_id,
    }


def build_closure_receipt(validated: dict[str, Any], schema: dict[str, Any]) -> dict[str, Any]:
    receipt = {
        "schema_version": schema["closure_schema_version"],
        "kind": schema["closure_receipt_kind"],
        "gate_state": schema["closure_gate_state"],
        "project_scope": schema["project_scope"],
        "work_order_id": validated["work_order_id"],
        "work_order_sha256": validated["work_order_sha256"],
        "closure_manifest_sha256": validated["closure_manifest_sha256"],
        "dispatch_receipt_id": validated["dispatch_receipt_id"],
        "director_task_id": validated["director_task_id"],
        "worker_task_id": validated["worker_task_id"],
        "reviewer_task_id": validated["reviewer_task_id"],
        "candidate_identity": validated["candidate_identity"],
        "evidence_state_sha256": validated["evidence_state_sha256"],
        "review_record_sha256": validated["review_record_sha256"],
        "verdict": validated["verdict"],
    }
    if validated.get("night_return_receipt_id") is not None:
        receipt["night_return_receipt_id"] = validated["night_return_receipt_id"]
    receipt["receipt_id"] = sha256_bytes(canonical_json(receipt))
    return receipt


def verify_closure_receipt(
    receipt_path: Path, validated: dict[str, Any], schema: dict[str, Any]
) -> dict[str, Any]:
    receipt, _ = load_json(receipt_path, "E_CLOSURE_RECEIPT_MISSING")
    require_fields(
        receipt,
        schema["required_closure_receipt_fields"],
        "E_CLOSURE_RECEIPT_FIELD_MISSING",
    )
    if (
        receipt["schema_version"] != schema["closure_schema_version"]
        or receipt["kind"] != schema["closure_receipt_kind"]
        or receipt["gate_state"] != schema["closure_gate_state"]
    ):
        fail("E_CLOSURE_RECEIPT_INVALID", "closure receipt schema, kind, or state mismatch")
    unsigned = dict(receipt)
    supplied_id = unsigned.pop("receipt_id", None)
    if supplied_id != sha256_bytes(canonical_json(unsigned)):
        fail("E_CLOSURE_RECEIPT_TAMPERED", "closure receipt identity is invalid")
    expected = build_closure_receipt(validated, schema)
    mismatched = [
        key for key, value in expected.items() if key != "receipt_id" and receipt.get(key) != value
    ]
    if mismatched:
        fail("E_CLOSURE_RECEIPT_MISMATCH", f"closure receipt is stale or mismatched: {mismatched}")
    return receipt


def verify_operational_pass_claims(
    root: Path,
    validated: dict[str, Any],
    receipt: dict[str, Any],
    work_state_path: Path,
    handover_path: Path,
) -> None:
    operational = validated["closure"]["operational_state"]
    expected_paths = {
        "work_state": repo_path(root, normalize_relative(operational["work_state_path"])).resolve(),
        "handover": repo_path(root, normalize_relative(operational["handover_path"])).resolve(),
    }
    if work_state_path.resolve() != expected_paths["work_state"]:
        fail("E_CLOSURE_OPERATIONAL_STATE", "provided WORK_STATE path does not match closure")
    if handover_path.resolve() != expected_paths["handover"]:
        fail("E_CLOSURE_OPERATIONAL_STATE", "provided CURRENT_HANDOVER path does not match closure")
    markers = (
        validated["work_order_id"],
        "Independent review verdict: PASS",
        f"Worker task: {validated['worker_task_id']}",
        f"Reviewer task: {validated['reviewer_task_id']}",
        f"Candidate identity: {validated['candidate_identity']}",
        f"Closure receipt: {receipt['receipt_id']}",
    )
    if validated.get("night_return_receipt_id") is not None:
        markers += (f"Night return receipt: {validated['night_return_receipt_id']}",)
    for label, path in expected_paths.items():
        if not path.is_file():
            fail("E_CLOSURE_OPERATIONAL_STATE", f"{label} is missing: {path}")
        try:
            text = path.read_text(encoding="utf-8-sig")
        except (OSError, UnicodeError) as exc:
            fail("E_CLOSURE_OPERATIONAL_STATE", f"cannot read {label}: {exc}")
        missing = [marker for marker in markers if marker not in text]
        if missing:
            fail(
                "E_CLOSURE_PASS_CLAIM_BLOCKED",
                f"{label} lacks exact independently reviewed PASS markers: {missing}",
            )


# --------------------------------------------------------------------------
# Night-shift return verification (UR-GATE-EXTERNAL-NIGHT-V1)
# --------------------------------------------------------------------------


def git_try(root: Path, *args: str) -> bytes | None:
    """Run git; return None on any failure (used for existence probes)."""
    try:
        return run_git(root, *args)
    except GateError:
        return None


def resolve_night_branch(root: Path, branch: str) -> str:
    """Return the night branch head; local and origin refs must agree when both exist."""
    heads: dict[str, str] = {}
    for ref in (f"refs/heads/{branch}", f"refs/remotes/origin/{branch}"):
        out = git_try(root, "rev-parse", "--verify", "--quiet", f"{ref}^{{commit}}")
        if out is not None and out.strip():
            heads[ref] = out.decode("ascii").strip()
    if not heads:
        fail("E_NIGHT_BRANCH_MISSING", f"night branch does not exist in the external repository: {branch}")
    if len(set(heads.values())) != 1:
        fail("E_NIGHT_BRANCH_AMBIGUOUS", f"local and origin night branch differ: {heads}")
    return next(iter(heads.values()))


def _under(path: str, roots: list[str], *, fold: bool) -> bool:
    candidate = path.casefold() if fold else path
    for entry in roots:
        base = entry.casefold() if fold else entry
        if candidate == base or candidate.startswith(base + "/"):
            return True
    return False


def parse_raw_diff_tree(raw: bytes) -> list[tuple[str, str, str]]:
    """Parse ``git diff-tree -r -z --raw --no-renames`` into (old_mode, new_mode, path)."""
    tokens = raw.split(b"\0")
    rows: list[tuple[str, str, str]] = []
    index = 0
    while index < len(tokens) and tokens[index]:
        meta = tokens[index].decode("ascii", errors="replace")
        if index + 1 >= len(tokens) or not meta.startswith(":"):
            fail("E_NIGHT_DIFF_PARSE", "cannot parse git diff-tree output")
        fields = meta[1:].split(" ")
        if len(fields) < 5:
            fail("E_NIGHT_DIFF_PARSE", "cannot parse git diff-tree metadata")
        rows.append((fields[0], fields[1], tokens[index + 1].decode("utf-8")))
        index += 2
    return rows


def night_return_state(
    root: Path, validated: dict[str, Any], schema: dict[str, Any]
) -> dict[str, Any]:
    """Check the night branch in the external repository; return the facts to bind."""
    extras = validated["receipt_extras"]
    external = extras["external_project"]
    night = extras["night_shift"]
    ext_root = external_root_path(external["root"])
    if not ext_root.is_dir():
        fail("E_EXTERNAL_ROOT_MISSING", f"external root is missing: {external['root']}")
    live_repository(ext_root)  # raises unless the root is the Git top level
    base = external["git"]["head"]
    if git_try(ext_root, "cat-file", "-e", f"{base}^{{commit}}") is None:
        fail("E_NIGHT_BASE_MISSING", f"declared base commit is not in the external repository: {base}")
    head = resolve_night_branch(ext_root, night["branch"])
    merge_base = git_try(ext_root, "merge-base", base, head)
    if merge_base is None or merge_base.decode("ascii").strip() != base:
        fail(
            "E_NIGHT_MERGE_BASE",
            f"night branch merge-base is not the declared base {base}",
        )
    span = f"{base}..{head}"
    if run_git(ext_root, "rev-list", "--min-parents=2", span).strip():
        fail("E_NIGHT_MERGE_COMMIT", "night branch contains a merge commit")
    commits = run_git(ext_root, "rev-list", "--reverse", span).decode("ascii").split()
    if not commits:
        fail("E_NIGHT_EMPTY", "night branch has no commits beyond the declared base")
    allowed = external["allowed_mutations"]
    protected = external["protected_paths"]
    for commit in commits:
        raw = run_git(
            ext_root, "diff-tree", "-r", "-z", "--raw", "--no-renames", "--no-commit-id", commit
        )
        for old_mode, new_mode, path in parse_raw_diff_tree(raw):
            if _under(path, protected, fold=True):
                fail("E_NIGHT_PROTECTED_PATH", f"commit {commit} touches protected path: {path}")
            if not _under(path, allowed, fold=False):
                fail("E_NIGHT_PATH_NOT_ALLOWED", f"commit {commit} touches a non-allowed path: {path}")
            if {old_mode, new_mode} & {"120000", "160000"}:
                fail("E_NIGHT_PATH_KIND", f"commit {commit} adds or changes a symlink/submodule: {path}")
    listing = run_git(
        ext_root, "ls-tree", "-r", "--name-only", "-z", head, "--", night["evidence_dir"] + "/"
    )
    if not listing.strip(b"\0"):
        fail(
            "E_NIGHT_EVIDENCE_MISSING",
            f"evidence directory is absent or empty on the night branch: {night['evidence_dir']}",
        )
    return {
        "external_root": external["root"],
        "night_branch": night["branch"],
        "base_head": base,
        "branch_head": head,
        "commits": commits,
        "evidence_dir": night["evidence_dir"],
    }


def build_night_return_receipt(
    validated: dict[str, Any],
    state: dict[str, Any],
    dispatch_receipt_id: str,
    schema: dict[str, Any],
) -> dict[str, Any]:
    config = external_schema(schema)
    receipt: dict[str, Any] = {
        "schema_version": validated["schema_version"],
        "kind": config["return_receipt_kind"],
        "gate_state": config["return_gate_state"],
        "project_scope": schema["project_scope"],
        "work_order_id": validated["manifest"]["work_order_id"],
        "work_order_sha256": validated["work_order_sha256"],
        "manifest_sha256": validated["manifest_sha256"],
        "dispatch_receipt_id": dispatch_receipt_id,
        **state,
    }
    receipt["receipt_id"] = sha256_bytes(canonical_json(receipt))
    return receipt


def verify_night_return_receipt(
    receipt: dict[str, Any],
    *,
    work_order_id: str,
    work_order_sha256: str,
    manifest_sha256: str,
    dispatch_receipt_id: str,
    extras: dict[str, Any],
    schema: dict[str, Any],
) -> None:
    """Integrity and binding checks for a night return receipt (no live Git state)."""
    config = external_schema(schema)
    require_fields(
        receipt,
        schema["required_night_return_receipt_fields"],
        "E_NIGHT_RETURN_FIELD_MISSING",
    )
    if (
        receipt["kind"] != config["return_receipt_kind"]
        or receipt["gate_state"] != config["return_gate_state"]
        or receipt["project_scope"] != schema["project_scope"]
    ):
        fail("E_NIGHT_RETURN_INVALID", "night return receipt kind, state or scope mismatch")
    unsigned = dict(receipt)
    supplied = unsigned.pop("receipt_id", None)
    if supplied != sha256_bytes(canonical_json(unsigned)):
        fail("E_NIGHT_RETURN_TAMPERED", "night return receipt identity is invalid")
    night = extras["night_shift"]
    external = extras["external_project"]
    bound = {
        "work_order_id": work_order_id,
        "work_order_sha256": work_order_sha256,
        "manifest_sha256": manifest_sha256,
        "dispatch_receipt_id": dispatch_receipt_id,
        "external_root": external["root"],
        "night_branch": night["branch"],
        "base_head": external["git"]["head"],
        "evidence_dir": night["evidence_dir"],
    }
    mismatched = [key for key, value in bound.items() if receipt.get(key) != value]
    if mismatched:
        fail(
            "E_NIGHT_RETURN_REUSE",
            f"night return receipt is bound to another order, manifest or dispatch: {mismatched}",
        )
    commits = receipt["commits"]
    if (
        not isinstance(commits, list)
        or not commits
        or not all(isinstance(item, str) and HEX_COMMIT.fullmatch(item) for item in commits)
        or commits[-1] != receipt["branch_head"]
    ):
        fail("E_NIGHT_RETURN_INVALID", "night return commits must end at branch_head")


def verify_night_return_command(
    root: Path,
    manifest_path: Path,
    work_order_path: Path,
    receipt_path: Path,
    return_receipt_path: Path,
    schema: dict[str, Any],
) -> dict[str, Any]:
    validated = validate_manifest(
        root, manifest_path, work_order_path, None, schema, live=False
    )
    extras = validated["receipt_extras"]
    if extras.get("execution_location") != external_schema(schema)["night_location"]:
        fail("E_NIGHT_NOT_NIGHT_ORDER", "verify-night-return requires an execution_location of cloud_night")
    dispatch_receipt = verify_receipt(receipt_path, validated, schema, live=False)
    validate_receipt_location(root, manifest_path, return_receipt_path, must_exist=False)
    if return_receipt_path.exists():
        fail("E_RECEIPT_EXISTS", f"night return receipt already exists: {return_receipt_path}")
    state = night_return_state(root, validated, schema)
    receipt = build_night_return_receipt(
        validated, state, dispatch_receipt["receipt_id"], schema
    )
    write_new_json(root, manifest_path, return_receipt_path, receipt)
    return receipt


SCHEMA_FILE = Path(__file__).with_name("underreign-dispatch-schema-v1.json")


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--schema", type=Path, default=SCHEMA_FILE)
    subparsers = parser.add_subparsers(dest="command", required=True)
    identity = subparsers.add_parser(
        "candidate-identity",
        help="print the aggregate identity for schema-declared implementation files",
    )
    identity.add_argument("--root", type=Path, required=True)
    for command in ("check-manifest", "verify-director", "verify-worker"):
        sub = subparsers.add_parser(command)
        sub.add_argument("--root", type=Path, required=True)
        sub.add_argument("--manifest", type=Path, required=True)
        sub.add_argument("--work-order", type=Path, required=True)
        sub.add_argument("--capabilities", type=Path, required=True)
        if command == "verify-director":
            sub.add_argument("--receipt", type=Path)
            sub.add_argument("--dry-run", action="store_true")
        if command == "verify-worker":
            sub.add_argument("--receipt", type=Path, required=True)
    night = subparsers.add_parser(
        "verify-night-return",
        help="verify the cloud night branch locally and write a once-only return receipt",
    )
    night.add_argument("--root", type=Path, required=True)
    night.add_argument("--manifest", type=Path, required=True)
    night.add_argument("--work-order", type=Path, required=True)
    night.add_argument("--receipt", type=Path, required=True, help="the dispatch receipt")
    night.add_argument("--return-receipt", type=Path, required=True, help="output, written once")
    for command in ("issue-closure", "verify-closure"):
        sub = subparsers.add_parser(command)
        sub.add_argument("--root", type=Path, required=True)
        sub.add_argument("--closure-manifest", type=Path, required=True)
        sub.add_argument("--work-order", type=Path, required=True)
        sub.add_argument("--receipt", type=Path, required=True)
        if command == "verify-closure":
            sub.add_argument("--work-state", type=Path, required=True)
            sub.add_argument("--handover", type=Path, required=True)
    return parser.parse_args(argv)


def require_inside(root: Path, supplied: Path, label: str) -> None:
    resolved = supplied.resolve(strict=False)
    if resolved != root and root not in resolved.parents:
        fail("E_PATH_INVALID", f"{label} path must remain inside repository")


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        if args.schema.resolve() != SCHEMA_FILE.resolve():
            fail("E_SCHEMA_PATH", "only the bundled dispatch schema is permitted")
        schema, _ = load_json(args.schema, "E_SCHEMA_MISSING")
        if schema.get("state") != "ACTIVE_UNDERREIGN_CLAUDE":
            fail("E_SCHEMA_STATE", "schema does not declare the active Underreign Claude boundary")
        root = args.root.resolve(strict=True)
        if args.command == "candidate-identity":
            identity, rows = candidate_identity(root, schema.get("candidate_identity_files"))
            print(f"CANDIDATE_IDENTITY {identity}")
            for path, digest, size in rows:
                print(f"{path}\t{digest}\t{size}")
            return 0
        if args.command in ("issue-closure", "verify-closure"):
            for label, supplied in (
                ("closure manifest", args.closure_manifest),
                ("Work Order", args.work_order),
                ("closure receipt", args.receipt),
            ):
                require_inside(root, supplied, label)
            validated_closure = validate_closure_manifest(
                root,
                args.closure_manifest.resolve(),
                args.work_order.resolve(),
                schema,
            )
            if args.command == "issue-closure":
                closure_receipt = build_closure_receipt(validated_closure, schema)
                write_new_json(
                    root,
                    args.closure_manifest.resolve(),
                    args.receipt.resolve(strict=False),
                    closure_receipt,
                )
                print(f"PASS closure receipt {closure_receipt['receipt_id']} -> {args.receipt}")
            else:
                validate_receipt_location(
                    root,
                    args.closure_manifest.resolve(),
                    args.receipt.resolve(strict=False),
                    must_exist=True,
                )
                verified_closure = verify_closure_receipt(
                    args.receipt.resolve(), validated_closure, schema
                )
                verify_operational_pass_claims(
                    root,
                    validated_closure,
                    verified_closure,
                    args.work_state.resolve(strict=False),
                    args.handover.resolve(strict=False),
                )
                print(f"PASS operational closure {verified_closure['receipt_id']}")
            return 0
        if args.command == "verify-night-return":
            for label, supplied in (
                ("manifest", args.manifest),
                ("Work Order", args.work_order),
                ("dispatch receipt", args.receipt),
                ("return receipt", args.return_receipt),
            ):
                require_inside(root, supplied, label)
            validate_receipt_location(
                root, args.manifest.resolve(), args.receipt.resolve(strict=False), must_exist=True
            )
            returned = verify_night_return_command(
                root,
                args.manifest.resolve(),
                args.work_order.resolve(),
                args.receipt.resolve(),
                args.return_receipt.resolve(strict=False),
                schema,
            )
            print(f"PASS night return {returned['receipt_id']} -> {args.return_receipt}")
            return 0
        for label, supplied in (
            ("manifest", args.manifest),
            ("Work Order", args.work_order),
            ("capabilities", args.capabilities),
        ):
            require_inside(root, supplied, label)
        validated = validate_manifest(
            root,
            args.manifest.resolve(),
            args.work_order.resolve(),
            args.capabilities.resolve(),
            schema,
        )
        receipt = build_receipt(validated, schema)
        if args.command == "check-manifest":
            print(f"PASS manifest {validated['manifest_sha256']}")
        elif args.command == "verify-director":
            if args.dry_run:
                print(f"PASS director dry-run {receipt['receipt_id']}")
            else:
                if args.receipt is None:
                    fail("E_RECEIPT_PATH", "--receipt is required unless --dry-run is used")
                write_new_json(
                    root,
                    args.manifest.resolve(),
                    args.receipt.resolve(strict=False),
                    receipt,
                )
                print(f"PASS director receipt {receipt['receipt_id']} -> {args.receipt}")
        else:
            validate_receipt_location(
                root,
                args.manifest.resolve(),
                args.receipt.resolve(strict=False),
                must_exist=True,
            )
            verified = verify_receipt(args.receipt.resolve(), validated, schema)
            print(f"PASS worker receipt {verified['receipt_id']}")
        return 0
    except GateError as exc:
        print(f"{exc.code}: {exc.detail}", file=sys.stderr)
        return EXIT_GATE_BLOCKED
    except Exception as exc:
        print(f"E_GATE_INTERNAL: {exc}", file=sys.stderr)
        return EXIT_CONFIGURATION


if __name__ == "__main__":
    raise SystemExit(main())
