#!/usr/bin/env python3
"""Fail-closed, repository-local authority continuity validator.

The authority core contains selectors and invariants, never replacement prose.
Canonical Markdown remains authoritative. Any missing, drifted, contradictory,
or operationally stale input makes the emitted state UNKNOWN and blocking.
"""

from __future__ import annotations

import argparse
import datetime as dt
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


VALID_STATUSES = {
    "ADOPTED/CURRENT",
    "OPEN/HUMAN DECISION REQUIRED",
    "TEMPORARILY EXCLUDED",
    "HISTORICAL ONLY",
    "UNKNOWN/REFRESH REQUIRED",
}

TOOL_CANDIDATE_FILES = (
    "README.md",
    "authority-core.json",
    "validate_authority.py",
    "tests/test_validate_authority.py",
)


class ConfigError(ValueError):
    """The authority core or requested output violates the MVP contract."""


def normalize_relative_path(relative: str) -> PurePosixPath:
    """Return one unambiguous repository-relative path or fail closed."""
    if not isinstance(relative, str) or not relative.strip():
        raise ConfigError("repository-relative path must be a non-empty string")
    normalized = relative.replace("\\", "/")
    pure = PurePosixPath(normalized)
    if (
        pure.is_absolute()
        or pure.root
        or pure.anchor
        or ".." in pure.parts
        or any(part in ("", ".") for part in pure.parts)
        or re.match(r"^[A-Za-z]:", normalized)
    ):
        raise ConfigError(f"unsafe repository-relative path: {relative}")
    return pure


def lexical_repo_path(root: Path, relative: str) -> Path:
    pure = normalize_relative_path(relative)
    return root.resolve() / Path(*pure.parts)


def is_reparse_point(path: Path) -> bool:
    """Detect symlinks and Windows reparse points without following them."""
    if path.is_symlink():
        return True
    try:
        attributes = os.lstat(path).st_file_attributes
    except (AttributeError, FileNotFoundError, OSError):
        return False
    return bool(attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT)


def assert_no_reparse_components(root: Path, candidate: Path, label: str) -> None:
    resolved_root = root.resolve()
    try:
        relative = candidate.relative_to(resolved_root)
    except ValueError as exc:
        raise ConfigError(f"{label} escapes repository root: {candidate}") from exc
    current = resolved_root
    for part in relative.parts:
        current = current / part
        if current.exists() or current.is_symlink():
            if is_reparse_point(current):
                raise ConfigError(f"{label} uses a reparse or symlink component: {current}")


def path_identity(path: Path) -> str:
    return os.path.normcase(os.path.abspath(os.fspath(path)))


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_json(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def resolve_repo_path(root: Path, relative: str) -> Path:
    candidate = lexical_repo_path(root, relative).resolve()
    resolved_root = root.resolve()
    if candidate != resolved_root and resolved_root not in candidate.parents:
        raise ConfigError(f"path escapes repository root: {relative}")
    return candidate


def extract_section(text: str, start: str | None, end: str | None) -> str | None:
    start_index = 0
    if start:
        start_index = text.find(start)
        if start_index < 0:
            return None
    if not end:
        return text[start_index:]
    end_index = text.find(end, start_index + len(start or ""))
    if end_index < 0:
        return None
    return text[start_index:end_index]


def validate_config(config: Any) -> None:
    problems: list[str] = []

    def require(condition: bool, message: str) -> None:
        if not condition:
            problems.append(message)

    require(isinstance(config, dict), "root must be an object")
    if not isinstance(config, dict):
        raise ConfigError("; ".join(problems))
    require(config.get("schema_version") == 1, "schema_version must equal 1")
    require(isinstance(config.get("authority_core_id"), str), "authority_core_id must be a string")
    require(isinstance(config.get("authority_core_state"), str), "authority_core_state must be a string")

    output_policy = config.get("output_policy")
    require(isinstance(output_policy, dict), "output_policy must be an object")
    if isinstance(output_policy, dict):
        require(isinstance(output_policy.get("path"), str), "output_policy.path must be a string")
        if isinstance(output_policy.get("path"), str):
            try:
                pure = normalize_relative_path(output_policy["path"])
                require(
                    pure.parts[:2] == ("Artifacts", "Reports"),
                    "output_policy.path must be under Artifacts/Reports",
                )
            except (TypeError, ValueError) as exc:
                problems.append(f"invalid output_policy.path: {exc}")

    sources = config.get("sources")
    require(isinstance(sources, dict) and bool(sources), "sources must be a non-empty object")
    source_ids = set(sources) if isinstance(sources, dict) else set()
    if isinstance(sources, dict):
        normalized_source_paths: list[str] = []
        for source_id, spec in sources.items():
            require(isinstance(source_id, str) and bool(source_id), "source IDs must be non-empty strings")
            require(isinstance(spec, dict), f"source {source_id} must be an object")
            if not isinstance(spec, dict):
                continue
            require(isinstance(spec.get("path"), str), f"source {source_id}.path must be a string")
            if isinstance(spec.get("path"), str):
                try:
                    normalized_source_paths.append(
                        normalize_relative_path(spec["path"]).as_posix()
                    )
                except ConfigError as exc:
                    problems.append(f"source {source_id}.path: {exc}")
            expected = spec.get("expected_sha256")
            require(
                isinstance(expected, str) and re.fullmatch(r"[0-9a-f]{64}", expected) is not None,
                f"source {source_id}.expected_sha256 must be lowercase SHA-256",
            )
        require(
            len(normalized_source_paths) == len(set(normalized_source_paths)),
            "source paths must be unique",
        )
        if isinstance(output_policy, dict) and isinstance(output_policy.get("path"), str):
            try:
                output_relative = normalize_relative_path(output_policy["path"]).as_posix()
                protected_relative = set(normalized_source_paths)
                protected_relative.add("Tools/AuthorityContinuity/authority-core.json")
                protected_relative.update(
                    f"Tools/AuthorityContinuity/{relative}"
                    for relative in TOOL_CANDIDATE_FILES
                )
                require(
                    output_relative not in protected_relative,
                    "output_policy.path must not alias a source, config, or tooling path",
                )
            except ConfigError as exc:
                problems.append(str(exc))

    claims = config.get("claims")
    require(isinstance(claims, list) and bool(claims), "claims must be a non-empty array")
    if isinstance(claims, list):
        for index, claim in enumerate(claims):
            prefix = f"claims[{index}]"
            require(isinstance(claim, dict), f"{prefix} must be an object")
            if not isinstance(claim, dict):
                continue
            require(isinstance(claim.get("id"), str), f"{prefix}.id must be a string")
            require(isinstance(claim.get("scope"), str), f"{prefix}.scope must be a string")
            require(claim.get("status") in VALID_STATUSES, f"{prefix}.status is invalid")
            checks = claim.get("checks")
            require(isinstance(checks, list) and bool(checks), f"{prefix}.checks must be a non-empty array")
            if not isinstance(checks, list):
                continue
            for check_index, check in enumerate(checks):
                check_prefix = f"{prefix}.checks[{check_index}]"
                require(isinstance(check, dict), f"{check_prefix} must be an object")
                if not isinstance(check, dict):
                    continue
                require(check.get("source") in source_ids, f"{check_prefix}.source is unknown")
                require(isinstance(check.get("failure_code"), str), f"{check_prefix}.failure_code must be a string")
                for key in ("section_start", "section_end"):
                    require(
                        key not in check or isinstance(check[key], str),
                        f"{check_prefix}.{key} must be a string",
                    )
                for key in ("required_all", "forbidden_any", "forbidden_regex"):
                    values = check.get(key, [])
                    require(
                        isinstance(values, list) and all(isinstance(item, str) for item in values),
                        f"{check_prefix}.{key} must be an array of strings",
                    )
                    if key == "forbidden_regex" and isinstance(values, list):
                        for pattern in values:
                            if isinstance(pattern, str):
                                try:
                                    re.compile(pattern)
                                except re.error as exc:
                                    problems.append(f"{check_prefix}.{key} invalid regex: {exc}")

    operational = config.get("operational_continuity")
    require(isinstance(operational, dict), "operational_continuity must be an object")
    if isinstance(operational, dict):
        operational_sources = operational.get("sources")
        require(
            isinstance(operational_sources, list)
            and bool(operational_sources)
            and all(item in source_ids for item in operational_sources),
            "operational_continuity.sources must reference known sources",
        )
        require(isinstance(operational.get("work_order_id"), str), "operational work_order_id must be a string")
        max_age = operational.get("max_age_days")
        require(isinstance(max_age, int) and max_age >= 0, "max_age_days must be a non-negative integer")
        required_all = operational.get("required_all")
        require(
            isinstance(required_all, list) and all(isinstance(item, str) for item in required_all),
            "operational required_all must be an array of strings",
        )

    if problems:
        raise ConfigError("; ".join(problems))


def preflight_repository_paths(
    root: Path, config: dict[str, Any], config_path: Path | None = None
) -> dict[str, Path]:
    """Resolve protected inputs before evaluation and reject filesystem aliases."""
    resolved_root = root.resolve(strict=True)
    expected_config = lexical_repo_path(
        resolved_root, "Tools/AuthorityContinuity/authority-core.json"
    )
    actual_config = (config_path or expected_config).absolute()
    if path_identity(actual_config) != path_identity(expected_config):
        raise ConfigError("config must be the repository Authority Continuity core")
    assert_no_reparse_components(resolved_root, expected_config, "config path")

    protected: dict[str, Path] = {"config": expected_config.resolve(strict=False)}
    for relative in TOOL_CANDIDATE_FILES:
        tool_path = lexical_repo_path(
            resolved_root, f"Tools/AuthorityContinuity/{relative}"
        )
        assert_no_reparse_components(resolved_root, tool_path, f"tooling path {relative}")
        protected[f"tool:{relative}"] = tool_path.resolve(strict=False)

    seen_existing: list[tuple[str, Path]] = []
    for source_id, spec in config["sources"].items():
        source_path = lexical_repo_path(resolved_root, spec["path"])
        assert_no_reparse_components(
            resolved_root, source_path, f"source path {source_id}"
        )
        resolved_source = source_path.resolve(strict=False)
        if resolved_source != resolved_root and resolved_root not in resolved_source.parents:
            raise ConfigError(f"source path {source_id} escapes repository root")
        if source_path.exists():
            resolved_source = source_path.resolve(strict=True)
            for other_id, other_path in seen_existing:
                if os.path.samefile(source_path, other_path):
                    raise ConfigError(
                        f"source path {source_id} aliases source path {other_id}"
                    )
            seen_existing.append((source_id, source_path))
        protected[f"source:{source_id}"] = resolved_source
    return protected


def validate_output_path(
    root: Path,
    config: dict[str, Any],
    requested: Path,
    config_path: Path | None = None,
) -> Path:
    protected = preflight_repository_paths(root, config, config_path)
    resolved_root = root.resolve(strict=True)
    expected = lexical_repo_path(resolved_root, config["output_policy"]["path"])
    actual = requested if requested.is_absolute() else Path.cwd() / requested
    if ".." in actual.parts or path_identity(actual) != path_identity(expected):
        raise ConfigError(
            f"output must be the authorised report path: {config['output_policy']['path']}"
        )
    assert_no_reparse_components(resolved_root, expected, "output path")
    resolved_output = expected.resolve(strict=False)
    if resolved_output != resolved_root and resolved_root not in resolved_output.parents:
        raise ConfigError("output path escapes repository root")
    for protected_id, protected_path in protected.items():
        if path_identity(resolved_output) == path_identity(protected_path):
            raise ConfigError(f"output path aliases protected input {protected_id}")
        if expected.exists() and protected_path.exists() and os.path.samefile(
            expected, protected_path
        ):
            raise ConfigError(f"output path aliases protected input {protected_id}")
    return expected


def append_error(
    errors: list[dict[str, Any]],
    code: str,
    scope: str,
    detail: str,
    source: str | None = None,
) -> None:
    item: dict[str, Any] = {"code": code, "scope": scope, "detail": detail}
    if source is not None:
        item["source"] = source
    errors.append(item)


def load_sources(
    root: Path, config: dict[str, Any], errors: list[dict[str, Any]]
) -> dict[str, dict[str, Any]]:
    loaded: dict[str, dict[str, Any]] = {}
    for source_id, spec in config["sources"].items():
        relative = spec["path"]
        try:
            path = resolve_repo_path(root, relative)
        except ValueError as exc:
            append_error(errors, "E_CONFIG_INVALID", "authority core", str(exc), relative)
            loaded[source_id] = {
                "path": relative,
                "freshness": "INVALID",
                "hash": None,
                "text": None,
            }
            continue
        if not path.is_file():
            append_error(
                errors,
                "E_SOURCE_MISSING",
                "authority source",
                "required canonical source is missing",
                relative,
            )
            loaded[source_id] = {
                "path": relative,
                "freshness": "MISSING",
                "hash": None,
                "text": None,
            }
            continue
        raw = path.read_bytes()
        actual_hash = sha256_bytes(raw)
        expected_hash = spec.get("expected_sha256")
        freshness = "CURRENT"
        if not expected_hash or actual_hash != expected_hash:
            freshness = "STALE"
            append_error(
                errors,
                "E_SOURCE_STALE",
                "authority source",
                f"expected {expected_hash or 'NO_HASH'}, got {actual_hash}",
                relative,
            )
        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            text = None
            freshness = "INVALID"
            append_error(
                errors,
                "E_SOURCE_ENCODING",
                "authority source",
                f"source is not valid UTF-8: {exc}",
                relative,
            )
        loaded[source_id] = {
            "path": relative,
            "freshness": freshness,
            "hash": actual_hash,
            "text": text,
        }
    return loaded


def evaluate_claim(
    claim: dict[str, Any],
    loaded: dict[str, dict[str, Any]],
    errors: list[dict[str, Any]],
) -> dict[str, Any]:
    scope = claim["scope"]
    expected_status = claim["status"]
    claim_codes: list[str] = []
    source_ids = list(dict.fromkeys(check["source"] for check in claim["checks"]))
    sources = [loaded[source_id] for source_id in source_ids]

    unavailable = any(
        source["freshness"] != "CURRENT" or source["text"] is None
        for source in sources
    )
    if not unavailable:
        for check in claim["checks"]:
            source = loaded[check["source"]]
            section = extract_section(
                source["text"], check.get("section_start"), check.get("section_end")
            )
            failure_code = check["failure_code"]
            if section is None:
                if failure_code not in claim_codes:
                    claim_codes.append(failure_code)
                append_error(
                    errors,
                    failure_code,
                    scope,
                    f"canonical selector not found: {check.get('section_start')}",
                    source["path"],
                )
                continue
            normalized = re.sub(r"\s+", " ", section).strip()
            folded = normalized.casefold()
            missing = [
                value
                for value in check.get("required_all", [])
                if re.sub(r"\s+", " ", value).strip().casefold() not in folded
            ]
            forbidden = [
                value
                for value in check.get("forbidden_any", [])
                if re.sub(r"\s+", " ", value).strip().casefold() in folded
            ]
            forbidden_regex = [
                pattern
                for pattern in check.get("forbidden_regex", [])
                if re.search(pattern, normalized, flags=re.IGNORECASE | re.MULTILINE)
            ]
            if missing or forbidden or forbidden_regex:
                if failure_code not in claim_codes:
                    claim_codes.append(failure_code)
                detail_parts = []
                if missing:
                    detail_parts.append(f"missing invariants: {missing}")
                if forbidden:
                    detail_parts.append(f"contradictory text: {forbidden}")
                if forbidden_regex:
                    detail_parts.append(f"contradictory patterns: {forbidden_regex}")
                append_error(
                    errors,
                    failure_code,
                    scope,
                    "; ".join(detail_parts),
                    source["path"],
                )

    freshness_values = {source["freshness"] for source in sources}
    freshness = "CURRENT" if freshness_values == {"CURRENT"} else "/".join(sorted(freshness_values))
    actual_status = (
        expected_status
        if not unavailable and not claim_codes
        else "UNKNOWN/REFRESH REQUIRED"
    )
    if actual_status == "UNKNOWN/REFRESH REQUIRED" and not claim_codes:
        claim_codes = sorted(
            {
                "E_SOURCE_MISSING" if source["freshness"] == "MISSING" else "E_SOURCE_STALE"
                for source in sources
                if source["freshness"] != "CURRENT"
            }
        )
    return {
        "id": claim["id"],
        "scope": scope,
        "status": actual_status,
        "canonical_source": [source["path"] for source in sources],
        "source_hash": {source["path"]: source["hash"] for source in sources},
        "freshness": freshness,
        "error_codes": claim_codes,
    }


def evaluate_operational_state(
    config: dict[str, Any],
    loaded: dict[str, dict[str, Any]],
    errors: list[dict[str, Any]],
    as_of: dt.date,
) -> dict[str, Any]:
    spec = config["operational_continuity"]
    scope = "Studio operational continuity projection"
    sources = [loaded[source_id] for source_id in spec["sources"]]
    codes: list[str] = []
    unavailable = any(
        source["freshness"] != "CURRENT" or source["text"] is None
        for source in sources
    )
    if not unavailable:
        texts = [source["text"] for source in sources]
        for source, text in zip(sources, texts):
            if spec["work_order_id"] not in text:
                append_error(
                    errors,
                    "E_OPERATIONAL_CONFLICT",
                    scope,
                    "current work order ID is absent",
                    source["path"],
                )
                codes.append("E_OPERATIONAL_CONFLICT")
            match = re.search(r"\*\*Updated:\*\*\s*(\d{4}-\d{2}-\d{2})", text)
            if not match:
                append_error(
                    errors,
                    "E_OPERATIONAL_STALE",
                    scope,
                    "Updated date is missing",
                    source["path"],
                )
                codes.append("E_OPERATIONAL_STALE")
            else:
                updated = dt.date.fromisoformat(match.group(1))
                age = (as_of - updated).days
                if age < 0 or age > spec["max_age_days"]:
                    append_error(
                        errors,
                        "E_OPERATIONAL_STALE",
                        scope,
                        f"Updated date {updated.isoformat()} is outside the allowed age",
                        source["path"],
                    )
                    codes.append("E_OPERATIONAL_STALE")
            missing = [
                value
                for value in spec.get("required_all", [])
                if value.casefold() not in text.casefold()
            ]
            if missing:
                append_error(
                    errors,
                    "E_OPERATIONAL_CONFLICT",
                    scope,
                    f"operational projection is incomplete: {missing}",
                    source["path"],
                )
                codes.append("E_OPERATIONAL_CONFLICT")
        status_values = []
        for text in texts:
            match = re.search(r"^Status:\s*`([^`]+)`", text, flags=re.MULTILINE)
            status_values.append(match.group(1) if match else None)
        if len(set(status_values)) != 1 or status_values[0] is None:
            append_error(
                errors,
                "E_OPERATIONAL_CONFLICT",
                scope,
                f"operational status mismatch: {status_values}",
            )
            codes.append("E_OPERATIONAL_CONFLICT")

    freshness_values = {source["freshness"] for source in sources}
    freshness = "CURRENT" if freshness_values == {"CURRENT"} else "/".join(sorted(freshness_values))
    actual_status = (
        "ADOPTED/CURRENT"
        if not unavailable and not codes
        else "UNKNOWN/REFRESH REQUIRED"
    )
    if unavailable:
        codes.extend(
            "E_SOURCE_MISSING" if source["freshness"] == "MISSING" else "E_SOURCE_STALE"
            for source in sources
            if source["freshness"] != "CURRENT"
        )
    return {
        "id": "operational-continuity",
        "scope": scope,
        "status": actual_status,
        "canonical_source": [source["path"] for source in sources],
        "source_hash": {source["path"]: source["hash"] for source in sources},
        "freshness": freshness,
        "error_codes": sorted(set(codes)),
    }


def run_git(root: Path, *args: str) -> tuple[int, bytes, bytes]:
    completed = subprocess.run(
        ["git", "-c", "core.quotepath=false", *args],
        cwd=root,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    return completed.returncode, completed.stdout, completed.stderr


def collect_git_state(root: Path, errors: list[dict[str, Any]]) -> dict[str, Any]:
    commands = {
        "top_level": ("rev-parse", "--show-toplevel"),
        "branch": ("branch", "--show-current"),
        "head": ("rev-parse", "HEAD"),
        "status": ("status", "--porcelain=v2", "--branch", "--untracked-files=normal", "-z"),
    }
    results: dict[str, tuple[int, bytes, bytes]] = {
        name: run_git(root, *args) for name, args in commands.items()
    }
    if any(result[0] != 0 for result in results.values()):
        for name, (code, _stdout, stderr) in results.items():
            if code != 0:
                append_error(
                    errors,
                    "E_GIT_STATE_UNAVAILABLE",
                    "repository identity",
                    f"git {name} failed ({code}): {stderr.decode('utf-8', errors='replace').strip()}",
                )
        return {
            "available": False,
            "branch": None,
            "head": None,
            "status_sha256": None,
            "candidate_identity": None,
        }
    status_raw = results["status"][1]
    records = [
        item.decode("utf-8", errors="replace")
        for item in status_raw.split(b"\0")
        if item
    ]
    state = {
        "available": True,
        "top_level": results["top_level"][1].decode("utf-8").strip().replace("\\", "/"),
        "branch": results["branch"][1].decode("utf-8").strip(),
        "head": results["head"][1].decode("utf-8").strip(),
        "status_sha256": sha256_bytes(status_raw),
        "status_records": records,
        "warnings": sorted(
            {
                result[2].decode("utf-8", errors="replace").strip()
                for result in results.values()
                if result[2].strip()
            }
        ),
    }
    state["candidate_identity"] = sha256_bytes(canonical_json(state))
    return state


def validate_repository(
    root: Path,
    config: dict[str, Any],
    *,
    include_git: bool = True,
    as_of: dt.date | None = None,
) -> dict[str, Any]:
    as_of = as_of or dt.date.today()
    validate_config(config)
    preflight_repository_paths(root, config)
    errors: list[dict[str, Any]] = []
    loaded = load_sources(root, config, errors)
    findings = [evaluate_claim(claim, loaded, errors) for claim in config["claims"]]
    findings.append(evaluate_operational_state(config, loaded, errors, as_of))
    git_state = collect_git_state(root, errors) if include_git else {"available": False, "fixture_mode": True}

    unknown_ids = [
        finding["id"]
        for finding in findings
        if finding["status"] == "UNKNOWN/REFRESH REQUIRED"
    ]
    if unknown_ids:
        append_error(
            errors,
            "E_UNKNOWN_BLOCKING",
            "authority snapshot",
            f"UNKNOWN is blocking for: {unknown_ids}",
        )
    open_ids = [
        finding["id"]
        for finding in findings
        if finding["status"] == "OPEN/HUMAN DECISION REQUIRED"
    ]
    if open_ids:
        append_error(
            errors,
            "E_HUMAN_DECISION_REQUIRED",
            "authority snapshot",
            f"open Human decisions block continuation for: {open_ids}",
        )

    source_hashes = {
        source["path"]: source["hash"] for source in loaded.values()
    }
    tool_root = Path(__file__).resolve().parent
    tooling_files = {
        relative: sha256_bytes(resolve_repo_path(tool_root, relative).read_bytes())
        for relative in TOOL_CANDIDATE_FILES
    }
    tooling = {
        "files": tooling_files,
        "authority_core_sha256": sha256_bytes(canonical_json(config)),
    }
    tooling["candidate_identity"] = sha256_bytes(canonical_json(tooling))
    identity_input = {
        "authority_core_id": config["authority_core_id"],
        "authority_core_state": config["authority_core_state"],
        "as_of_date": as_of.isoformat(),
        "tooling": tooling,
        "source_hashes": source_hashes,
        "repository": git_state,
        "findings": findings,
        "errors": errors,
        "continuation_authority_granted": False,
    }
    snapshot = {
        "schema_version": 1,
        "authority_core_id": config["authority_core_id"],
        "authority_core_state": config["authority_core_state"],
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "as_of_date": as_of.isoformat(),
        "result": "PASS" if not errors else "BLOCKED",
        "continuation_authority_granted": False,
        "tooling": tooling,
        "repository": git_state,
        "snapshot_identity": sha256_bytes(canonical_json(identity_input)),
        "findings": findings,
        "errors": errors,
    }
    return snapshot


def load_config(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_snapshot(path: Path, snapshot: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = (json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n").encode(
        "utf-8"
    )
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=path.parent
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    default_config = Path(__file__).with_name("authority-core.json")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True, help="Studio repository root")
    parser.add_argument("--config", type=Path, default=default_config)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--as-of", type=dt.date.fromisoformat, default=None)
    return parser.parse_args(argv)


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        root = args.root.resolve()
        expected_config = resolve_repo_path(root, "Tools/AuthorityContinuity/authority-core.json")
        if args.config.resolve() != expected_config:
            raise ConfigError("config must be the repository Authority Continuity core")
        config = load_config(expected_config)
        validate_config(config)
        output = validate_output_path(root, config, args.output, expected_config)
        snapshot = validate_repository(
            root, config, include_git=True, as_of=args.as_of
        )
        write_snapshot(output, snapshot)
    except Exception as exc:
        print(f"E_VALIDATOR_INTERNAL: {exc}", file=sys.stderr)
        return 3
    print(
        f"{snapshot['result']} {snapshot['snapshot_identity']} -> {output}",
        file=sys.stdout,
    )
    return 0 if snapshot["result"] == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())
