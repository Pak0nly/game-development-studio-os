from __future__ import annotations

import datetime as dt
import hashlib
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


TOOL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOL_ROOT))

from validate_authority import (  # noqa: E402
    ConfigError,
    extract_section,
    main,
    validate_config,
    validate_output_path,
    validate_repository,
    write_snapshot,
)


WORK_ORDER = "C99-STUDIO-AUTHORITY-VALIDATOR-PATH-SAFETY-CORRECTION-V2"


FIXTURE_TEXT = {
    "AGENTS.md": """### Task-Pivot Revalidation
Re-freeze the authority scope. A recommendation may not contradict the confirmed bootstrap without a new authoritative decision. If sources conflict, stop and report the conflict.
### Task Closure
""",
    "Docs/CONFIRMED_DECISIONS.md": """### DEC-031
`Projects/Crime99MasterCityDiscovery` is a static protected learning-evidence project. It is not an accepted visual result, a current production baseline, an active production environment, or a future-assumed production environment.
Historical evidence proves only that its documented attempt, observation, result, or decision record existed under its documented conditions. It does not by itself prove correctness, acceptance, currency, reusability, production readiness, or future suitability.
No current canonical Crime99 city/world/level Unity production environment is designated. Future city production must explicitly select its pipeline, baseline, and repository ownership before implementation.
No future task may infer a production environment from historical contents. Reuse of an individual finding or asset still requires explicit selection, current authority, and fresh validation.
**Supersedes:** Only DEC-029's designation.
""",
    "Docs/Projects/Crime99/PRODUCTION_PROFILE.md": """## Canonical Repositories and Evidence Environments
Projects/Crime99MasterCityDiscovery is a static protected learning-evidence project. It is not an accepted visual result, a current production baseline, an active production environment, or a future-assumed production environment.
No current canonical Crime99 city/world/level Unity production environment is designated. Future work must explicitly select its pipeline, baseline, and repository ownership before implementation.
Evidence-environment status does not create production, restart, quality, or reuse authority. Current suitability requires explicit selection and fresh validation.
## Frozen Systems and Asset Boundaries
""",
    "Docs/Projects/Crime99/ASSET_INVENTORY.md": """## Status and Boundary
**Snapshot classification:** `HISTORICAL_SNAPSHOT`
**Current complete asset holdings:** `UNKNOWN_REFRESH_REQUIRED`
The number `37` is not the current complete asset ownership count.
## Evidence Rules
""",
    "Docs/Projects/Crime99/PROJECT_BRIEF.md": """## Production Model
Fuyoh Cyberpunk Diner, including every derived subasset, is TEMPORARILY EXCLUDED / DO NOT USE and grants no current planning, recommendation, Style Slice, or production authority.
""",
    "Docs/WORK_STATE.md": f"""# Current Work State
**Updated:** 2026-08-04
## Completed Work Order
`{WORK_ORDER}`
Status: `COMPLETE — MVP CANDIDATE; HUMAN CHECKPOINT`
OPEN / HUMAN DECISION REQUIRED
UNKNOWN / REFRESH REQUIRED
TEMPORARILY EXCLUDED / DO NOT USE
HISTORICAL ONLY
Human checkpoint
""",
    "Docs/CURRENT_HANDOVER.md": f"""# Current Handover
**Updated:** 2026-08-04
## Resume State
`{WORK_ORDER}`
Status: `COMPLETE — MVP CANDIDATE; HUMAN CHECKPOINT`
OPEN / HUMAN DECISION REQUIRED
UNKNOWN / REFRESH REQUIRED
TEMPORARILY EXCLUDED / DO NOT USE
HISTORICAL ONLY
Human checkpoint
""",
}


def digest_path(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ValidatorRegressionTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for relative, text in FIXTURE_TEXT.items():
            path = self.root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")
        self.config = json.loads((TOOL_ROOT / "authority-core.json").read_text(encoding="utf-8"))
        for source in self.config["sources"].values():
            source["expected_sha256"] = digest_path(self.root / source["path"])

    def tearDown(self) -> None:
        self.temp.cleanup()

    def validate(self) -> dict:
        return validate_repository(
            self.root,
            self.config,
            include_git=False,
            as_of=dt.date(2026, 8, 4),
        )

    def replace_and_accept_hash(self, relative: str, old: str, new: str) -> None:
        path = self.root / relative
        text = path.read_text(encoding="utf-8").replace(old, new)
        path.write_text(text, encoding="utf-8")
        for source in self.config["sources"].values():
            if source["path"] == relative:
                source["expected_sha256"] = digest_path(path)

    def assert_error(self, code: str) -> None:
        snapshot = self.validate()
        self.assertEqual("BLOCKED", snapshot["result"])
        self.assertIn(code, {error["code"] for error in snapshot["errors"]})

    def test_clean_fixture_blocks_known_unknown_without_granting_continuation(self) -> None:
        snapshot = self.validate()
        self.assertEqual("BLOCKED", snapshot["result"])
        self.assertFalse(snapshot["continuation_authority_granted"])
        self.assertIn(
            "E_UNKNOWN_BLOCKING", {error["code"] for error in snapshot["errors"]}
        )
        self.assertIn(
            "E_HUMAN_DECISION_REQUIRED",
            {error["code"] for error in snapshot["errors"]},
        )
        statuses = {item["status"] for item in snapshot["findings"]}
        self.assertTrue(
            {
                "ADOPTED/CURRENT",
                "OPEN/HUMAN DECISION REQUIRED",
                "TEMPORARILY EXCLUDED",
                "HISTORICAL ONLY",
                "UNKNOWN/REFRESH REQUIRED",
            }.issubset(statuses)
        )

    def test_open_city_pipeline_cannot_be_presented_as_decided(self) -> None:
        self.replace_and_accept_hash(
            "Docs/CONFIRMED_DECISIONS.md",
            "No current canonical Crime99 city/world/level Unity production environment is designated",
            "The current canonical Crime99 city/world/level Unity production environment is designated",
        )
        self.assert_error("E_CITY_PIPELINE_FALSELY_DECIDED")

    def test_historical_asset_snapshot_cannot_be_current_inventory(self) -> None:
        self.replace_and_accept_hash(
            "Docs/Projects/Crime99/ASSET_INVENTORY.md",
            "`UNKNOWN_REFRESH_REQUIRED`",
            "`CURRENT`",
        )
        self.assert_error("E_HISTORICAL_ASSET_CURRENTNESS_VIOLATION")

    def test_mastercity_learning_evidence_cannot_be_production_base(self) -> None:
        self.replace_and_accept_hash(
            "Docs/CONFIRMED_DECISIONS.md",
            "static protected learning-evidence project",
            "current production baseline",
        )
        self.assert_error("E_MASTERCITY_PRODUCTION_BASE_VIOLATION")

    def test_excluded_asset_cannot_be_recommended(self) -> None:
        self.replace_and_accept_hash(
            "Docs/Projects/Crime99/PROJECT_BRIEF.md",
            "TEMPORARILY EXCLUDED / DO NOT USE",
            "recommended production base",
        )
        self.assert_error("E_EXCLUDED_ASSET_RECOMMENDATION")

    def test_historical_evidence_cannot_create_use_authority(self) -> None:
        self.replace_and_accept_hash(
            "Docs/CONFIRMED_DECISIONS.md",
            "It does not by itself prove correctness, acceptance, currency, reusability, production readiness, or future suitability.",
            "Historical evidence grants current use authority.",
        )
        self.assert_error("E_HISTORICAL_EVIDENCE_AUTHORITY_VIOLATION")

    def test_task_pivot_cannot_bypass_bootstrap_authority(self) -> None:
        self.replace_and_accept_hash(
            "AGENTS.md",
            "A recommendation may not contradict the confirmed bootstrap without a new authoritative decision.",
            "A recommendation may bypass the confirmed bootstrap.",
        )
        self.assert_error("E_TASK_PIVOT_AUTHORITY_VIOLATION")

    def test_hash_drift_blocks_before_semantic_trust(self) -> None:
        path = self.root / "Docs/Projects/Crime99/PROJECT_BRIEF.md"
        path.write_text(path.read_text(encoding="utf-8") + "drift\n", encoding="utf-8")
        self.assert_error("E_SOURCE_STALE")

    def test_missing_source_blocks(self) -> None:
        (self.root / "AGENTS.md").unlink()
        self.assert_error("E_SOURCE_MISSING")

    def test_stale_operational_docs_block(self) -> None:
        self.replace_and_accept_hash(
            "Docs/WORK_STATE.md", "2026-08-04", "2026-07-01"
        )
        self.assert_error("E_OPERATIONAL_STALE")

    def test_conflicting_operational_status_blocks(self) -> None:
        self.replace_and_accept_hash(
            "Docs/CURRENT_HANDOVER.md",
            "COMPLETE — MVP CANDIDATE; HUMAN CHECKPOINT",
            "ACTIVE — CONTRADICTORY PROJECTION",
        )
        self.assert_error("E_OPERATIONAL_CONFLICT")

    def test_invalid_source_encoding_blocks(self) -> None:
        path = self.root / "AGENTS.md"
        path.write_bytes(b"\xff\xfe\x00")
        self.config["sources"]["agents"]["expected_sha256"] = digest_path(path)
        self.assert_error("E_SOURCE_ENCODING")

    def test_unavailable_git_identity_blocks(self) -> None:
        with mock.patch(
            "validate_authority.run_git", return_value=(1, b"", b"not a repository")
        ):
            snapshot = validate_repository(
                self.root,
                self.config,
                include_git=True,
                as_of=dt.date(2026, 8, 4),
            )
        self.assertEqual("BLOCKED", snapshot["result"])
        self.assertIn(
            "E_GIT_STATE_UNAVAILABLE",
            {error["code"] for error in snapshot["errors"]},
        )

    def test_every_finding_has_machine_contract_fields(self) -> None:
        snapshot = self.validate()
        required = {
            "id",
            "scope",
            "status",
            "canonical_source",
            "source_hash",
            "freshness",
            "error_codes",
        }
        for finding in snapshot["findings"]:
            self.assertEqual(required, set(finding))

    def test_missing_configured_end_selector_blocks(self) -> None:
        self.replace_and_accept_hash(
            "Docs/Projects/Crime99/PRODUCTION_PROFILE.md",
            "## Frozen Systems and Asset Boundaries",
            "## Renamed Boundary",
        )
        self.assert_error("E_CITY_PIPELINE_FALSELY_DECIDED")

    def test_as_of_date_changes_snapshot_identity(self) -> None:
        first = validate_repository(
            self.root,
            self.config,
            include_git=False,
            as_of=dt.date(2026, 8, 4),
        )
        second = validate_repository(
            self.root,
            self.config,
            include_git=False,
            as_of=dt.date(2026, 8, 10),
        )
        self.assertNotEqual(first["snapshot_identity"], second["snapshot_identity"])
        self.assertIn(
            "E_OPERATIONAL_STALE", {error["code"] for error in second["errors"]}
        )

    def test_output_path_is_exactly_allowlisted(self) -> None:
        expected = self.root / self.config["output_policy"]["path"]
        self.assertEqual(
            expected.resolve(), validate_output_path(self.root, self.config, expected)
        )
        with self.assertRaises(ConfigError):
            validate_output_path(self.root, self.config, self.root / "AGENTS.md")
        with self.assertRaises(ConfigError):
            validate_output_path(
                self.root,
                self.config,
                self.root / "Tools/AuthorityContinuity/authority-core.json",
            )

    def test_unsafe_source_path_is_a_config_error(self) -> None:
        for unsafe_path in (
            "../AGENTS.md",
            "..\\AGENTS.md",
            str((self.root / "AGENTS.md").resolve()),
        ):
            with self.subTest(unsafe_path=unsafe_path):
                unsafe = json.loads(json.dumps(self.config))
                unsafe["sources"]["agents"]["path"] = unsafe_path
                with self.assertRaises(ConfigError):
                    validate_config(unsafe)
                with self.assertRaises(ConfigError):
                    validate_repository(
                        self.root,
                        unsafe,
                        include_git=False,
                        as_of=dt.date(2026, 8, 4),
                    )

    def test_configured_source_output_alias_is_rejected(self) -> None:
        aliased = json.loads(json.dumps(self.config))
        aliased["sources"]["agents"]["path"] = aliased["output_policy"]["path"]
        with self.assertRaises(ConfigError):
            validate_config(aliased)

    def test_hardlink_output_alias_is_rejected(self) -> None:
        output = self.root / self.config["output_policy"]["path"]
        output.parent.mkdir(parents=True, exist_ok=True)
        os.link(self.root / "AGENTS.md", output)
        with self.assertRaises(ConfigError):
            validate_output_path(self.root, self.config, output)

    def test_atomic_snapshot_replace_does_not_modify_hardlink_target(self) -> None:
        source = self.root / "AGENTS.md"
        original = source.read_bytes()
        output = self.root / self.config["output_policy"]["path"]
        output.parent.mkdir(parents=True, exist_ok=True)
        os.link(source, output)
        write_snapshot(output, {"result": "BLOCKED"})
        self.assertEqual(original, source.read_bytes())
        self.assertNotEqual(digest_path(source), digest_path(output))

    def test_reparse_or_symlink_output_alias_is_rejected(self) -> None:
        output = self.root / self.config["output_policy"]["path"]
        output.parent.mkdir(parents=True, exist_ok=True)
        try:
            os.symlink(self.root / "AGENTS.md", output)
        except OSError:
            output.write_text("reparse probe", encoding="utf-8")
            original = Path.resolve(output)

            def simulated_reparse(path: Path) -> bool:
                return Path.resolve(path) == original

            with mock.patch(
                "validate_authority.is_reparse_point", side_effect=simulated_reparse
            ):
                with self.assertRaises(ConfigError):
                    validate_output_path(self.root, self.config, output)
        else:
            with self.assertRaises(ConfigError):
                validate_output_path(self.root, self.config, output)

    def test_reparse_or_symlink_source_alias_is_rejected(self) -> None:
        alias = self.root / "AliasAgents.md"
        aliased = json.loads(json.dumps(self.config))
        aliased["sources"]["agents"]["path"] = "AliasAgents.md"
        try:
            os.symlink(self.root / "AGENTS.md", alias)
        except OSError:
            alias.write_text(
                (self.root / "AGENTS.md").read_text(encoding="utf-8"),
                encoding="utf-8",
            )
            aliased["sources"]["agents"]["expected_sha256"] = digest_path(alias)
            original = Path.resolve(alias)

            def simulated_reparse(path: Path) -> bool:
                return Path.resolve(path) == original

            with mock.patch(
                "validate_authority.is_reparse_point", side_effect=simulated_reparse
            ):
                with self.assertRaises(ConfigError):
                    validate_repository(
                        self.root,
                        aliased,
                        include_git=False,
                        as_of=dt.date(2026, 8, 4),
                    )
        else:
            aliased["sources"]["agents"]["expected_sha256"] = digest_path(alias)
            with self.assertRaises(ConfigError):
                validate_repository(
                    self.root,
                    aliased,
                    include_git=False,
                    as_of=dt.date(2026, 8, 4),
                )

    def test_malformed_config_and_regex_fail_validation(self) -> None:
        malformed = json.loads(json.dumps(self.config))
        malformed["claims"][0]["checks"][0]["forbidden_regex"] = ["["]
        malformed["operational_continuity"]["max_age_days"] = "one"
        with self.assertRaises(ConfigError):
            validate_config(malformed)

    def test_cli_returns_two_for_fail_closed_snapshot(self) -> None:
        config_path = self.root / "Tools/AuthorityContinuity/authority-core.json"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text(json.dumps(self.config), encoding="utf-8")
        output = self.root / self.config["output_policy"]["path"]
        result = main(
            [
                "--root",
                str(self.root),
                "--config",
                str(config_path),
                "--output",
                str(output),
                "--as-of",
                "2026-08-04",
            ]
        )
        self.assertEqual(2, result)
        self.assertTrue(output.is_file())

    def test_cli_returns_three_for_invalid_config_without_output(self) -> None:
        malformed = json.loads(json.dumps(self.config))
        malformed["claims"][0]["checks"][0]["forbidden_regex"] = ["["]
        config_path = self.root / "Tools/AuthorityContinuity/authority-core.json"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text(json.dumps(malformed), encoding="utf-8")
        output = self.root / self.config["output_policy"]["path"]
        result = main(
            [
                "--root",
                str(self.root),
                "--config",
                str(config_path),
                "--output",
                str(output),
                "--as-of",
                "2026-08-04",
            ]
        )
        self.assertEqual(3, result)
        self.assertFalse(output.exists())

    def test_cli_returns_three_for_unsafe_source_without_output(self) -> None:
        unsafe = json.loads(json.dumps(self.config))
        unsafe["sources"]["agents"]["path"] = "../AGENTS.md"
        config_path = self.root / "Tools/AuthorityContinuity/authority-core.json"
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text(json.dumps(unsafe), encoding="utf-8")
        output = self.root / self.config["output_policy"]["path"]
        result = main(
            [
                "--root",
                str(self.root),
                "--config",
                str(config_path),
                "--output",
                str(output),
                "--as-of",
                "2026-08-04",
            ]
        )
        self.assertEqual(3, result)
        self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
