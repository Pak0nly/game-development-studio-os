from __future__ import annotations

import json
import hashlib
import http.client
import signal
import socket
import subprocess
import sys
import time
import tempfile
import threading
import unittest
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

from decision_tool import (
    canonical_json_bytes,
    DecisionToolError,
    ValidationError,
    create_empty_draft,
    create_result,
    expected_guided_implementation_note,
    load_package,
    resolve_preview,
    result_markdown,
    safe_relative_path,
    save_json,
    sha256_bytes,
    validate_draft,
    validate_package,
    validate_result,
    validate_result_against_package,
    validate_text_only_export,
    verify_result_hash,
    write_result,
)
from register_previews import register_entries
from prepare_crime99_previews import package_preview_ids
from server import DecisionToolApplication, HOST, build_server


TOOL_ROOT = Path(__file__).resolve().parents[1]
CRIME99_PACKAGE = TOOL_ROOT / "Packages" / "crime99-surface-material-v1.json"


def minimal_package() -> dict:
    return {
        "schemaVersion": "1.0",
        "decisionSetId": "test-decision",
        "title": "Test Decision",
        "description": "A deterministic local test package.",
        "project": "Test",
        "stage": "Human Review",
        "sourceContext": {"candidateId": "TEST-1"},
        "validationRules": {
            "allowDeferred": False,
            "allowNotApplicable": False,
        },
        "categories": [
            {
                "id": "material",
                "title": "Material",
                "description": "Choose one.",
                "selectionMode": "single",
                "options": [
                    {
                        "id": "a",
                        "label": "Option A",
                        "technicalMetadata": {
                            "materialPath": "Assets/A.mat",
                            "guid": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        },
                        "previewAssets": [
                            {
                                "id": "preview-a",
                                "path": "previews/a.png",
                                "mode": "staticImage",
                            }
                        ],
                    },
                    {
                        "id": "b",
                        "label": "Option B",
                        "technicalMetadata": {
                            "materialPath": "Assets/B.mat",
                            "guid": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        },
                    },
                ],
                "implementationFields": [
                    {
                        "id": "mapping",
                        "label": "Mapping",
                        "type": "textarea",
                    }
                ],
                "validationRules": {"requiredFields": ["mapping"]},
            }
        ],
        "outputConfiguration": {
            "resultDirectory": "results/final",
            "generateMarkdown": True,
        },
    }


def completed_draft(package: dict) -> dict:
    draft = create_empty_draft(package)
    draft["humanIdentifier"] = "HUMAN-TEST"
    draft["decisionDateTime"] = "2026-07-23T12:30:00+02:00"
    draft["humanAttestation"] = True
    draft["finalConfirmation"] = True
    state = draft["categories"]["material"]
    state["status"] = "COMPLETED"
    state["optionStates"]["a"]["decision"] = "SELECT"
    state["optionStates"]["b"]["decision"] = "REJECT"
    state["fields"]["mapping"] = "Renderer/Test, slot 0, Assets/A.mat"
    return draft


def package_for_mode(mode: str) -> dict:
    package = minimal_package()
    category = package["categories"][0]
    category["selectionMode"] = mode
    category["validationRules"] = {}
    category["implementationFields"] = []
    if mode in {"multiple", "ordered"}:
        category["validationRules"]["minimumSelections"] = 1
    return package


def minimal_png_bytes() -> bytes:
    return (
        b"\x89PNG\r\n\x1a\n"
        b"\x00\x00\x00\rIHDR"
        b"\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00"
    )


def rehash_result(result: dict) -> None:
    unsigned = dict(result)
    unsigned.pop("resultHash", None)
    result["resultHash"] = sha256_bytes(canonical_json_bytes(unsigned))


class PackageValidationTests(unittest.TestCase):
    def test_crime99_package_is_valid_and_has_eight_categories(self) -> None:
        package, package_hash = load_package(CRIME99_PACKAGE)
        self.assertEqual(8, len(package["categories"]))
        self.assertEqual(64, len(package_hash))
        self.assertTrue(
            all(
                category["id"] in create_empty_draft(package)["categories"]
                for category in package["categories"]
            )
        )

    def test_crime99_prepared_preview_contract_is_complete_and_hash_pinned(
        self,
    ) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        counts = []
        hashes = []
        for category in package["categories"]:
            previews = [
                preview
                for option in category["options"]
                for preview in option.get("previewAssets", [])
            ]
            counts.append(len(previews))
            hashes.extend(preview.get("expectedSha256") for preview in previews)
        self.assertEqual([2, 2, 3, 4, 2, 4, 2, 2], counts)
        self.assertEqual(21, len(package_preview_ids(package)))
        self.assertEqual(21, len(set(package_preview_ids(package))))
        self.assertTrue(
            all(
                isinstance(value, str)
                and len(value) == 64
                and all(character in "0123456789ABCDEF" for character in value)
                for value in hashes
            )
        )

    def test_crime99_visual_choices_do_not_require_technical_fields(self) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        draft = create_empty_draft(package)
        draft["humanIdentifier"] = "HUMAN-TEST"
        draft["decisionDateTime"] = "2026-07-23T12:30:00+02:00"
        draft["humanAttestation"] = True
        draft["finalConfirmation"] = True
        for category in package["categories"]:
            self.assertNotIn(
                "requiredFields",
                category.get("validationRules", {}),
            )
            state = draft["categories"][category["id"]]
            state["status"] = "COMPLETED"
            for index, option in enumerate(category["options"]):
                state["optionStates"][option["id"]]["decision"] = (
                    "SELECT" if index == 0 else "REJECT"
                )
            state["implementationNote"] = expected_guided_implementation_note(
                category,
                state,
            )
        self.assertEqual([], validate_draft(package, draft, final=True))
        result = create_result(package, "A" * 64, draft)
        serialized = json.dumps(result)
        self.assertIn("TECHNICAL MAPPING PENDING", serialized)
        self.assertNotIn("previewAssets", serialized)

    def test_repairs_require_one_explicit_disposition_for_each_candidate(self) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        category = next(
            item for item in package["categories"] if item["id"] == "repairs-wear"
        )
        self.assertEqual("approveReject", category["selectionMode"])
        self.assertEqual(4, len(category["options"]))
        self.assertTrue(category["validationRules"]["allowDeferred"])
        self.assertTrue(
            category["validationRules"]["requireDeferredOptionComment"]
        )
        self.assertTrue(
            category["validationRules"]["requireDerivedImplementationNote"]
        )
        self.assertNotIn(
            "repair-no-suitable-option",
            {option["id"] for option in category["options"]},
        )

    def test_repairs_allow_rejecting_every_candidate_without_forced_material(self) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        category = next(
            item for item in package["categories"] if item["id"] == "repairs-wear"
        )
        draft = create_empty_draft(package)
        state = draft["categories"][category["id"]]
        state["status"] = "COMPLETED"
        for option_state in state["optionStates"].values():
            option_state["decision"] = "REJECT"
        state["implementationNote"] = expected_guided_implementation_note(
            category,
            state,
        )
        errors = validate_draft(package, draft)
        self.assertFalse(
            [error for error in errors if error.startswith(category["title"])]
        )
        self.assertIn("no prepared repair option", state["implementationNote"])

    def test_repairs_defer_requires_reason_and_is_preserved_in_derived_status(
        self,
    ) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        category = next(
            item for item in package["categories"] if item["id"] == "repairs-wear"
        )
        draft = create_empty_draft(package)
        state = draft["categories"][category["id"]]
        state["status"] = "COMPLETED"
        option_ids = [option["id"] for option in category["options"]]
        state["optionStates"][option_ids[0]]["decision"] = "SELECT"
        state["optionStates"][option_ids[1]]["decision"] = "DEFER"
        for option_id in option_ids[2:]:
            state["optionStates"][option_id]["decision"] = "REJECT"
        state["implementationNote"] = expected_guided_implementation_note(
            category,
            state,
        )
        errors = validate_draft(package, draft)
        self.assertTrue(
            any("DEFER requires a Human reason" in error for error in errors)
        )
        state["optionStates"][option_ids[1]]["comment"] = "Kontext später prüfen"
        errors = validate_draft(package, draft)
        self.assertFalse(
            [error for error in errors if error.startswith(category["title"])]
        )
        self.assertIn(
            category["options"][1]["technicalName"],
            state["implementationNote"],
        )

    def test_server_rejects_stale_derived_status_after_completed_choice_edit(
        self,
    ) -> None:
        package, _package_hash = load_package(CRIME99_PACKAGE)
        category = next(
            item for item in package["categories"] if item["id"] == "service-loading"
        )
        draft = create_empty_draft(package)
        state = draft["categories"][category["id"]]
        state["status"] = "COMPLETED"
        for index, option in enumerate(category["options"]):
            state["optionStates"][option["id"]]["decision"] = (
                "SELECT" if index == 0 else "REJECT"
            )
        state["implementationNote"] = expected_guided_implementation_note(
            category,
            state,
        )
        selected = category["options"][0]["id"]
        no_suitable = next(
            option["id"]
            for option in category["options"]
            if option["technicalName"] == "NO_SUITABLE_OPTION"
        )
        state["optionStates"][selected]["decision"] = "REJECT"
        state["optionStates"][no_suitable]["decision"] = "SELECT"
        errors = validate_draft(package, draft)
        self.assertTrue(
            any(
                "derived implementation status does not match" in error
                for error in errors
            )
        )

    def test_invalid_package_has_human_readable_errors(self) -> None:
        errors = validate_package({"schemaVersion": "9"})
        self.assertTrue(any("Missing required package field" in item for item in errors))
        self.assertTrue(any("Unsupported schemaVersion" in item for item in errors))

    def test_external_preview_reference_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "path"
        ] = "https://example.invalid/a.png"
        errors = validate_package(package)
        self.assertTrue(any("local filesystem reference" in item for item in errors))

    def test_duplicate_option_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][1]["id"] = "a"
        errors = validate_package(package)
        self.assertTrue(any("Duplicate option id" in item for item in errors))

    def test_storage_unsafe_decision_set_id_is_rejected(self) -> None:
        package = minimal_package()
        package["decisionSetId"] = "CON"
        errors = validate_package(package)
        self.assertTrue(any("reserved Windows" in item for item in errors))

    def test_unknown_required_field_reference_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["validationRules"]["requiredFields"] = ["missing"]
        errors = validate_package(package)
        self.assertTrue(any("unknown field" in item for item in errors))

    def test_scheme_relative_package_reference_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["description"] = (
            "Visual reference //external.example/private.png"
        )
        errors = validate_package(package)
        self.assertTrue(any("external URL" in item for item in errors))

    def test_published_package_schema_matches_executable_rule_shapes(self) -> None:
        schema = json.loads(
            (TOOL_ROOT / "Schemas" / "decision-package.schema.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual(
            "#/$defs/globalValidationRules",
            schema["properties"]["validationRules"]["$ref"],
        )
        self.assertEqual(
            0,
            schema["$defs"]["validationRules"]["properties"][
                "maximumSelections"
            ]["minimum"],
        )
        self.assertEqual(
            0,
            schema["$defs"]["globalValidationRules"]["properties"][
                "maximumSelections"
            ]["minimum"],
        )
        preview_path_rules = schema["$defs"]["preview"]["properties"]["path"][
            "allOf"
        ]
        self.assertEqual("^previews[\\\\/]", preview_path_rules[0]["pattern"])
        self.assertEqual([], validate_package(minimal_package()))


class PathAndPreviewTests(unittest.TestCase):
    def test_path_traversal_is_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(DecisionToolError):
                safe_relative_path(Path(directory), "../outside.json")

    def test_missing_preview_has_actionable_error(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(DecisionToolError, "not registered"):
                resolve_preview(
                    minimal_package(), "A" * 64, Path(directory), "preview-a"
                )

    def test_package_relative_preview_with_matching_hash_is_served(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "previews" / "a.png"
            path.parent.mkdir()
            path.write_bytes(minimal_png_bytes())
            package["categories"][0]["options"][0]["previewAssets"][0][
                "expectedSha256"
            ] = hashlib.sha256(path.read_bytes()).hexdigest().upper()
            resolved, mime_type = resolve_preview(
                package, "A" * 64, root, "preview-a"
            )
            self.assertEqual(path.resolve(), resolved)
            self.assertEqual("image/png", mime_type)

    def test_package_relative_preview_missing_file_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "expectedSha256"
        ] = "A" * 64
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(DecisionToolError, "not available locally"):
                resolve_preview(
                    package, "A" * 64, Path(directory), "preview-a"
                )

    def test_package_relative_preview_hash_mismatch_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "expectedSha256"
        ] = "A" * 64
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "previews" / "a.png"
            path.parent.mkdir()
            path.write_bytes(minimal_png_bytes())
            with self.assertRaisesRegex(DecisionToolError, "does not match"):
                resolve_preview(package, "A" * 64, root, "preview-a")

    def test_preview_traversal_is_blocked(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "path"
        ] = "../escape.png"
        package["categories"][0]["options"][0]["previewAssets"][0][
            "expectedSha256"
        ] = "A" * 64
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(DecisionToolError, "traversal"):
                resolve_preview(package, "A" * 64, Path(directory), "preview-a")

    def test_package_preview_must_use_approved_local_root(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "path"
        ] = "other-local-root/a.png"
        errors = validate_package(package)
        self.assertTrue(any("approved local previews root" in item for item in errors))

    def test_registered_preview_outside_approved_root_is_not_loaded(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            outside = root / "outside.png"
            outside.write_bytes(minimal_png_bytes())
            registration = root / "preview-registrations" / "test-decision.json"
            registration.parent.mkdir(parents=True)
            registration.write_text(
                json.dumps(
                    {
                        "registrationSchemaVersion": "1.0",
                        "decisionSetId": "test-decision",
                        "sourcePackageHash": "A" * 64,
                        "previews": {
                            "preview-a": {
                                "path": str(outside.resolve()),
                                "sha256": hashlib.sha256(
                                    outside.read_bytes()
                                ).hexdigest().upper(),
                                "mimeType": "image/png",
                                "width": 1,
                                "height": 1,
                                "byteLength": outside.stat().st_size,
                            }
                        },
                    }
                ),
                encoding="utf-8",
            )
            with self.assertRaisesRegex(
                DecisionToolError,
                "outside the approved local preview root",
            ):
                resolve_preview(package, "A" * 64, root, "preview-a")

    def test_explicit_remote_preview_reference_is_rejected(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "path"
        ] = "https:external.invalid/a.png"
        errors = validate_package(package)
        self.assertTrue(any("relative local filesystem" in item for item in errors))

    def test_unsupported_preview_type_is_blocked(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "path"
        ] = "previews/a.txt"
        package["categories"][0]["options"][0]["previewAssets"][0][
            "expectedSha256"
        ] = "A" * 64
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "previews" / "a.txt"
            path.parent.mkdir()
            path.write_text("not an image", encoding="utf-8")
            with self.assertRaisesRegex(DecisionToolError, "Unsupported"):
                resolve_preview(package, "A" * 64, Path(directory), "preview-a")

    def test_windows_path_with_spaces_is_supported_by_registration(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory(prefix="decision tool ") as directory:
            root = Path(directory)
            preview = root / "Human Review Images" / "a.png"
            preview.parent.mkdir()
            preview.write_bytes(minimal_png_bytes())
            output_path = register_entries(
                package,
                "A" * 64,
                [{"previewId": "preview-a", "path": str(preview)}],
                root,
            )
            registration = json.loads(output_path.read_text(encoding="utf-8"))
            approved_path = Path(
                registration["previews"]["preview-a"]["path"]
            )
            self.assertNotEqual(preview.resolve(), approved_path)
            self.assertEqual(
                (root / "previews" / "registered" / "test-decision").resolve(),
                approved_path.parent,
            )
            resolved, mime_type = resolve_preview(
                package, "A" * 64, root, "preview-a"
            )
            self.assertEqual(approved_path, resolved)
            self.assertEqual(preview.read_bytes(), resolved.read_bytes())
            self.assertEqual("image/png", mime_type)

    def test_spoofed_png_content_is_rejected(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            fake = root / "fake.png"
            fake.write_text("not a png", encoding="utf-8")
            with self.assertRaisesRegex(DecisionToolError, "signature"):
                register_entries(
                    package,
                    "A" * 64,
                    [{"previewId": "preview-a", "path": str(fake)}],
                    root / "runtime",
                )

    def test_registration_enforces_package_expected_hash(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][0]["previewAssets"][0][
            "expectedSha256"
        ] = "B" * 64
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            preview = root / "a.png"
            preview.write_bytes(minimal_png_bytes())
            with self.assertRaisesRegex(DecisionToolError, "decision package"):
                register_entries(
                    package,
                    "A" * 64,
                    [{"previewId": "preview-a", "path": str(preview)}],
                    root / "runtime",
                )

    def test_stale_registration_package_hash_is_rejected(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            preview = root / "a.png"
            preview.write_bytes(minimal_png_bytes())
            runtime = root / "runtime"
            register_entries(
                package,
                "A" * 64,
                [{"previewId": "preview-a", "path": str(preview)}],
                runtime,
            )
            with self.assertRaisesRegex(DecisionToolError, "different package bytes"):
                resolve_preview(package, "B" * 64, runtime, "preview-a")

    def test_registration_without_hash_is_rejected_at_serve_time(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            preview = (
                root
                / "previews"
                / "registered"
                / "test-decision"
                / "a.png"
            )
            preview.parent.mkdir(parents=True)
            preview.write_bytes(minimal_png_bytes())
            registration = root / "preview-registrations" / "test-decision.json"
            registration.parent.mkdir(parents=True)
            registration.write_text(
                json.dumps(
                    {
                        "registrationSchemaVersion": "1.0",
                        "decisionSetId": "test-decision",
                        "sourcePackageHash": "A" * 64,
                        "previews": {"preview-a": {"path": str(preview)}},
                    }
                ),
                encoding="utf-8",
            )
            with self.assertRaisesRegex(DecisionToolError, "valid SHA-256"):
                resolve_preview(package, "A" * 64, root, "preview-a")

    def test_guided_registration_preserves_existing_entries(self) -> None:
        package = minimal_package()
        package["categories"][0]["options"][1]["previewAssets"] = [
            {"id": "preview-b", "path": "previews/b.png", "mode": "staticImage"}
        ]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            a_path = root / "a.png"
            b_path = root / "b.png"
            a_path.write_bytes(minimal_png_bytes())
            b_path.write_bytes(minimal_png_bytes())
            runtime = root / "runtime"
            register_entries(
                package,
                "A" * 64,
                [{"previewId": "preview-a", "path": str(a_path)}],
                runtime,
            )
            output_path = register_entries(
                package,
                "A" * 64,
                [{"previewId": "preview-b", "path": str(b_path)}],
                runtime,
            )
            registration = json.loads(output_path.read_text(encoding="utf-8"))
            self.assertEqual({"preview-a", "preview-b"}, set(registration["previews"]))


class DraftAndResultTests(unittest.TestCase):
    def test_empty_draft_is_not_final(self) -> None:
        errors = validate_draft(minimal_package(), create_empty_draft(minimal_package()), final=True)
        self.assertGreaterEqual(len(errors), 5)

    def test_finalisation_blocks_missing_fields(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["fields"]["mapping"] = ""
        with self.assertRaises(ValidationError):
            create_result(package, "A" * 64, draft)

    def test_result_is_deterministic(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        first = create_result(package, "A" * 64, draft)
        second = create_result(package, "A" * 64, draft)
        self.assertEqual(first, second)
        self.assertTrue(verify_result_hash(first))

    def test_result_contains_no_preview_payload_or_path(self) -> None:
        package = minimal_package()
        result = create_result(package, "A" * 64, completed_draft(package))
        serialized = json.dumps(result)
        self.assertNotIn("previewAssets", serialized)
        self.assertNotIn("a.png", serialized)
        self.assertNotIn("base64", serialized.lower())
        self.assertNotIn("data:image", serialized.lower())

    def test_text_only_export_guard_rejects_embedded_and_remote_images(self) -> None:
        errors = validate_text_only_export(
            {
                "imageData": "data:image/png;base64,AAAA",
                "reference": "https://example.invalid/private-preview.png",
            }
        )
        self.assertGreaterEqual(len(errors), 3)

    def test_text_only_export_rejects_scheme_relative_and_css_urls(self) -> None:
        errors = validate_text_only_export(
            {
                "plain": "//external.example/private-preview.png",
                "css": "background-image: url(//external.example/private.png)",
            }
        )
        self.assertEqual(2, sum("external URL" in item for item in errors))

    def test_text_only_export_allows_non_url_data_word_and_local_paths(self) -> None:
        self.assertEqual(
            [],
            validate_text_only_export(
                {
                    "note": "metadata: reviewed by the Human",
                    "local": "Assets/Materials/Local.mat",
                }
            ),
        )

    def test_adversarial_human_comment_cannot_enter_result_or_markdown(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["categoryComment"] = (
            "Human note ![remote](https://example.invalid/vendor.png) "
            "prefix data:image/png;base64,AAAA"
        )
        with self.assertRaises(ValidationError):
            create_result(package, "A" * 64, draft)

    def test_markdown_controls_in_human_text_are_escaped(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["categoryComment"] = "**literal** [label]"
        markdown = result_markdown(create_result(package, "A" * 64, draft))
        self.assertIn(r"\*\*literal\*\* \[label\]", markdown)

    def test_markdown_is_text_only(self) -> None:
        package = minimal_package()
        markdown = result_markdown(
            create_result(package, "A" * 64, completed_draft(package))
        )
        self.assertNotIn("![", markdown)
        self.assertNotIn("data:image", markdown.lower())
        self.assertIn("JSON result is authoritative", markdown)

    def test_write_and_reload_completed_result(self) -> None:
        package = minimal_package()
        result = create_result(package, "A" * 64, completed_draft(package))
        with tempfile.TemporaryDirectory() as directory:
            json_path, markdown_path = write_result(package, Path(directory), result)
            loaded = json.loads(json_path.read_text(encoding="utf-8"))
            self.assertTrue(verify_result_hash(loaded))
            self.assertTrue(markdown_path.is_file())

    def test_draft_save_and_reload(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(package_path, root / "runtime", TOOL_ROOT / "web")
            draft = completed_draft(package)
            app.save_draft(draft, "2026-07-23T12:35:00+02:00")
            loaded, saved_at, load_error = app.load_draft()
            self.assertEqual(draft, loaded)
            self.assertEqual("2026-07-23T12:35:00+02:00", saved_at)
            self.assertIsNone(load_error)

    def test_completed_result_is_listed_with_valid_hash(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(package_path, root / "runtime", TOOL_ROOT / "web")
            result = create_result(package, app.package_hash, completed_draft(package))
            write_result(package, app.runtime_root, result)
            listed = app.latest_results()
            self.assertEqual(1, len(listed))
            self.assertTrue(listed[0]["hashValid"])

    def test_multiple_mode_rejects_exclusive_contradiction(self) -> None:
        package = package_for_mode("multiple")
        package["categories"][0]["options"][1]["exclusiveSelection"] = True
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "COMPLETED"
        category["optionStates"]["a"]["decision"] = "SELECT"
        category["optionStates"]["b"]["decision"] = "SELECT"
        errors = validate_draft(package, draft)
        self.assertTrue(any("cannot be combined" in item for item in errors))

    def test_ordered_mode_requires_contiguous_unique_ranks(self) -> None:
        package = package_for_mode("ordered")
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "COMPLETED"
        category["optionStates"]["a"].update({"decision": "SELECT", "rank": 1})
        category["optionStates"]["b"].update({"decision": "SELECT", "rank": 3})
        errors = validate_draft(package, draft)
        self.assertTrue(any("contiguous ranks" in item for item in errors))
        category["optionStates"]["b"]["rank"] = 2
        self.assertEqual([], validate_draft(package, draft))

    def test_approve_reject_mode_requires_every_option(self) -> None:
        package = package_for_mode("approveReject")
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "COMPLETED"
        category["optionStates"]["a"]["decision"] = "SELECT"
        self.assertTrue(any("decide every option" in item for item in validate_draft(package, draft)))
        category["optionStates"]["b"]["decision"] = "REJECT"
        self.assertEqual([], validate_draft(package, draft))

    def test_deferred_and_not_applicable_reject_lingering_state(self) -> None:
        package = package_for_mode("single")
        package["categories"][0]["validationRules"] = {
            "allowDeferred": True,
            "allowNotApplicable": True,
        }
        package["categories"][0]["implementationFields"] = [
            {"id": "mapping", "label": "Mapping", "type": "text"}
        ]
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "DEFERRED"
        category["categoryComment"] = "Human deferral reason"
        category["optionStates"]["a"]["decision"] = "SELECT"
        self.assertTrue(any("cannot retain option" in item for item in validate_draft(package, draft)))
        category["optionStates"]["a"]["decision"] = "UNRESOLVED"
        self.assertEqual([], validate_draft(package, draft))
        category["status"] = "NOT_APPLICABLE"
        category["notApplicableReason"] = "Human reason"
        category["fields"]["mapping"] = "stale"
        self.assertTrue(any("cannot retain" in item for item in validate_draft(package, draft)))

    def test_not_applicable_reason_is_rejected_for_every_other_status(self) -> None:
        package = package_for_mode("single")
        package["categories"][0]["validationRules"] = {
            "allowDeferred": True,
            "allowNotApplicable": True,
        }
        for status in ("UNRESOLVED", "COMPLETED", "DEFERRED"):
            with self.subTest(status=status):
                draft = create_empty_draft(package)
                category = draft["categories"]["material"]
                category["status"] = status
                category["notApplicableReason"] = "stale N/A reason"
                if status == "COMPLETED":
                    category["optionStates"]["a"]["decision"] = "SELECT"
                if status == "DEFERRED":
                    category["categoryComment"] = "Human deferral reason"
                errors = validate_draft(package, draft)
                self.assertTrue(
                    any("reason must be empty" in item for item in errors),
                    errors,
                )

    def test_result_rejects_status_incompatible_not_applicable_reason(self) -> None:
        package = minimal_package()
        result = create_result(package, "A" * 64, completed_draft(package))
        result["categories"][0]["notApplicableReason"] = "stale"
        result["resultHash"] = "A" * 64
        errors = validate_result(result)
        self.assertTrue(any("must be empty" in item for item in errors))

    def test_typed_fields_enforce_bounds_choices_and_pattern(self) -> None:
        package = package_for_mode("single")
        category_package = package["categories"][0]
        category_package["implementationFields"] = [
            {"id": "number", "label": "Number", "type": "number", "minimum": 0, "maximum": 1},
            {"id": "choice", "label": "Choice", "type": "select", "choices": ["A", "B"]},
            {"id": "format", "label": "Format", "type": "text", "pattern": "^slot [0-9]+$"},
        ]
        category_package["validationRules"] = {
            "requiredFields": ["number", "choice", "format"]
        }
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "COMPLETED"
        category["optionStates"]["a"]["decision"] = "SELECT"
        category["fields"].update({"number": 2, "choice": "X", "format": "bad"})
        self.assertEqual(3, len(validate_draft(package, draft)))
        category["fields"].update({"number": 0.5, "choice": "A", "format": "slot 0"})
        self.assertEqual([], validate_draft(package, draft))

    def test_implementation_field_types_reject_objects_lists_and_numeric_strings(self) -> None:
        package = package_for_mode("single")
        category_package = package["categories"][0]
        category_package["implementationFields"] = [
            {"id": "text", "label": "Text", "type": "textarea"},
            {"id": "number", "label": "Number", "type": "number"},
            {"id": "choice", "label": "Choice", "type": "select", "choices": ["A"]},
        ]
        category_package["validationRules"] = {
            "requiredFields": ["text", "number", "choice"]
        }
        invalid_values = (
            {"text": {"bad": True}, "number": 1, "choice": "A"},
            {"text": "ok", "number": "1", "choice": "A"},
            {"text": "ok", "number": 1, "choice": ["A"]},
        )
        for values in invalid_values:
            with self.subTest(values=values):
                draft = create_empty_draft(package)
                category = draft["categories"]["material"]
                category["status"] = "COMPLETED"
                category["optionStates"]["a"]["decision"] = "SELECT"
                category["fields"].update(values)
                errors = validate_draft(package, draft)
                self.assertTrue(errors)
                with self.assertRaises(ValidationError):
                    create_result(package, "A" * 64, draft)

    def test_malformed_status_type_returns_validation_error(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["status"] = []
        errors = validate_draft(package, draft)
        self.assertTrue(any("status" in item for item in errors))

    def test_corrupt_draft_is_preserved_and_reported(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(package_path, root / "runtime", TOOL_ROOT / "web")
            app.draft_path.write_text("{broken", encoding="utf-8")
            _, _, load_error = app.load_draft()
            self.assertIn("preserved for recovery", load_error)
            self.assertEqual("{broken", app.draft_path.read_text(encoding="utf-8"))
            self.assertTrue(app.draft_recovery_required)
            self.assertTrue(app.draft_recovery_path.is_file())
            with self.assertRaisesRegex(DecisionToolError, "Explicitly confirm"):
                app.save_draft(
                    completed_draft(package),
                    "2026-07-23T12:36:00+02:00",
                )
            recovery_bytes = app.draft_recovery_path.read_bytes()
            app.save_draft(
                completed_draft(package),
                "2026-07-23T12:36:00+02:00",
                confirm_replace_malformed=True,
            )
            self.assertFalse(app.draft_recovery_required)
            self.assertEqual(b"{broken", recovery_bytes)

    def test_structurally_malformed_json_draft_uses_recovery_flow(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path, root / "runtime", TOOL_ROOT / "web"
            )
            malformed = completed_draft(package)
            malformed["categories"]["material"]["status"] = []
            app.draft_path.write_text(json.dumps(malformed), encoding="utf-8")
            loaded, _, load_error = app.load_draft()
            self.assertEqual("UNRESOLVED", loaded["categories"]["material"]["status"])
            self.assertIn("explicit confirmation", load_error)
            self.assertTrue(app.draft_recovery_required)

    def test_save_cannot_bypass_unloaded_malformed_draft(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path, root / "runtime", TOOL_ROOT / "web"
            )
            app.draft_path.write_text("{broken", encoding="utf-8")
            with self.assertRaisesRegex(DecisionToolError, "Explicitly confirm"):
                app.save_draft(
                    completed_draft(package),
                    "2026-07-23T12:36:00+02:00",
                )
            self.assertEqual("{broken", app.draft_path.read_text(encoding="utf-8"))
            self.assertTrue(app.draft_recovery_path.is_file())

    def test_stale_not_applicable_reason_is_cleared_on_draft_load(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path, root / "runtime", TOOL_ROOT / "web"
            )
            draft = completed_draft(package)
            draft["categories"]["material"]["notApplicableReason"] = "stale"
            stored = dict(draft)
            stored["_savedAt"] = "2026-07-23T12:37:00+02:00"
            app.draft_path.write_text(json.dumps(stored), encoding="utf-8")
            loaded, _, load_error = app.load_draft()
            self.assertEqual(
                "",
                loaded["categories"]["material"]["notApplicableReason"],
            )
            self.assertIn("status-incompatible", load_error)
            persisted = json.loads(app.draft_path.read_text(encoding="utf-8"))
            self.assertEqual(
                "",
                persisted["categories"]["material"]["notApplicableReason"],
            )

    def test_completed_result_requires_active_package_hash(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path, root / "runtime", TOOL_ROOT / "web"
            )
            historical = create_result(
                package, "B" * 64, completed_draft(package)
            )
            historical_path, _ = write_result(
                package, app.runtime_root, historical
            )
            listed = app.latest_results()
            self.assertEqual(1, len(listed))
            self.assertTrue(listed[0]["hashValid"])
            self.assertFalse(listed[0]["packageCompatible"])
            with self.assertRaisesRegex(
                DecisionToolError, "historical/incompatible"
            ):
                app.load_result(historical_path.name)

    def test_completed_result_rejects_decision_set_mismatch(self) -> None:
        package = minimal_package()
        other_package = minimal_package()
        other_package["decisionSetId"] = "other-decision"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path, root / "runtime", TOOL_ROOT / "web"
            )
            other = create_result(
                other_package, app.package_hash, completed_draft(other_package)
            )
            other_path, _ = write_result(package, app.runtime_root, other)
            with self.assertRaisesRegex(DecisionToolError, "another decision set"):
                app.load_result(other_path.name)

    def test_published_result_schema_uses_only_executable_field_types(self) -> None:
        schema = json.loads(
            (TOOL_ROOT / "Schemas" / "decision-result.schema.json").read_text(
                encoding="utf-8"
            )
        )
        allowed = schema["$defs"]["categoryResult"]["properties"][
            "implementationFields"
        ]["additionalProperties"]["type"]
        self.assertEqual(["string", "number"], allowed)
        self.assertEqual(
            [],
            validate_result(
                create_result(
                    minimal_package(),
                    "A" * 64,
                    completed_draft(minimal_package()),
                )
            ),
        )

    def test_result_filename_changes_with_result_hash(self) -> None:
        package = minimal_package()
        first_draft = completed_draft(package)
        second_draft = completed_draft(package)
        second_draft["categories"]["material"]["optionStates"]["a"]["decision"] = "REJECT"
        second_draft["categories"]["material"]["optionStates"]["b"]["decision"] = "SELECT"
        with tempfile.TemporaryDirectory() as directory:
            first = create_result(package, "A" * 64, first_draft)
            second = create_result(package, "A" * 64, second_draft)
            first_path, _ = write_result(package, Path(directory), first)
            second_path, _ = write_result(package, Path(directory), second)
            self.assertNotEqual(first_path.name, second_path.name)


class MustFixV1Tests(unittest.TestCase):
    def test_authoritative_json_round_trip_preserves_human_decision(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["categoryComment"] = "Human rationale"
        draft["categories"]["material"]["implementationNote"] = "Apply exactly"
        draft["categories"]["material"]["exceptionOrConcern"] = "NONE"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path,
                root / "runtime",
                TOOL_ROOT / "web",
            )
            result = create_result(package, app.package_hash, draft)
            json_path, _ = write_result(package, app.runtime_root, result)
            loaded = app.load_result(json_path.name)
            self.assertEqual(result, loaded)
            self.assertTrue(verify_result_hash(loaded))
            self.assertEqual(
                "Renderer/Test, slot 0, Assets/A.mat",
                loaded["categories"][0]["implementationFields"]["mapping"],
            )
            self.assertEqual("Human rationale", loaded["categories"][0]["categoryComment"])
            self.assertNotIn("previewAssets", json.dumps(loaded))

    def test_reopen_rejects_rehashed_package_incompatible_field_type(self) -> None:
        package = minimal_package()
        package["categories"][0]["implementationFields"] = [
            {"id": "mapping", "label": "Mapping", "type": "number"}
        ]
        draft = completed_draft(package)
        draft["categories"]["material"]["fields"]["mapping"] = 2.5
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path,
                root / "runtime",
                TOOL_ROOT / "web",
            )
            result = create_result(package, app.package_hash, draft)
            result["categories"][0]["implementationFields"]["mapping"] = "2.5"
            rehash_result(result)
            path, _ = write_result(package, app.runtime_root, result)
            original_bytes = path.read_bytes()
            with self.assertRaisesRegex(
                ValidationError,
                "incompatible with the active package",
            ):
                app.load_result(path.name)
            self.assertEqual(original_bytes, path.read_bytes())

    def test_reopen_rejects_missing_duplicate_and_unknown_categories(self) -> None:
        package = minimal_package()
        base = create_result(package, "A" * 64, completed_draft(package))
        mutations = {
            "missing": [],
            "duplicate": [base["categories"][0], base["categories"][0]],
            "unknown": [
                {
                    **base["categories"][0],
                    "categoryId": "unknown-category",
                }
            ],
        }
        for name, categories in mutations.items():
            with self.subTest(name=name):
                result = json.loads(json.dumps(base))
                result["categories"] = categories
                rehash_result(result)
                errors = validate_result_against_package(
                    result,
                    package,
                    "A" * 64,
                )
                self.assertTrue(errors)

    def test_reopen_rejects_empty_options_and_invalid_selection_semantics(self) -> None:
        package = minimal_package()
        base = create_result(package, "A" * 64, completed_draft(package))
        empty = json.loads(json.dumps(base))
        empty["categories"][0]["options"] = []
        empty["categories"][0]["selectedOptionIds"] = []
        rehash_result(empty)
        self.assertTrue(
            any(
                "non-empty array" in error or "options must match" in error
                for error in validate_result_against_package(
                    empty,
                    package,
                    "A" * 64,
                )
            )
        )

        contradictory = json.loads(json.dumps(base))
        contradictory["categories"][0]["options"][0]["decision"] = "REJECT"
        contradictory["categories"][0]["selectedOptionIds"] = []
        rehash_result(contradictory)
        errors = validate_result_against_package(
            contradictory,
            package,
            "A" * 64,
        )
        self.assertTrue(any("select exactly one" in error for error in errors))

    def test_reopen_rejects_schema_version_incompatibility(self) -> None:
        package = minimal_package()
        result = create_result(package, "A" * 64, completed_draft(package))
        result["packageSchemaVersion"] = "9.0"
        rehash_result(result)
        errors = validate_result_against_package(result, package, "A" * 64)
        self.assertTrue(any("packageSchemaVersion" in error for error in errors))

    def test_required_text_fields_reject_whitespace_only_values(self) -> None:
        package = minimal_package()
        draft = completed_draft(package)
        draft["categories"]["material"]["fields"]["mapping"] = "   "
        errors = validate_draft(package, draft, final=True)
        self.assertTrue(any("Mapping is required" in error for error in errors))
        with self.assertRaises(ValidationError):
            create_result(package, "A" * 64, draft)

    def test_explicit_defer_option_requires_reason_fields_and_completion(self) -> None:
        package = minimal_package()
        category_package = package["categories"][0]
        category_package["options"][1]["technicalName"] = "DEFER"
        category_package["validationRules"] = {
            "requireCategoryComment": True,
            "requiredFieldsByOption": {"b": ["mapping"]},
        }
        draft = create_empty_draft(package)
        category = draft["categories"]["material"]
        category["status"] = "COMPLETED"
        category["optionStates"]["b"]["decision"] = "SELECT"
        errors = validate_draft(package, draft)
        self.assertTrue(any("category comment is required" in error for error in errors))
        self.assertTrue(any("Mapping is required" in error for error in errors))
        category["categoryComment"] = "Human deferral reason"
        category["fields"]["mapping"] = "DEFER — preserve current state"
        self.assertEqual([], validate_draft(package, draft))

    def test_final_timestamp_requires_explicit_offset_and_round_trips(self) -> None:
        package = minimal_package()
        ambiguous = completed_draft(package)
        ambiguous["decisionDateTime"] = "2026-07-23T12:30"
        self.assertTrue(
            any(
                "explicit UTC offset" in error
                for error in validate_draft(package, ambiguous, final=True)
            )
        )
        unambiguous = completed_draft(package)
        unambiguous["decisionDateTime"] = "2026-07-23T12:30:00+02:00"
        result = create_result(package, "A" * 64, unambiguous)
        self.assertEqual(
            "2026-07-23T12:30:00+02:00",
            result["human"]["decisionDateTime"],
        )

    def test_latest_results_marks_semantically_incompatible_result(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            app = DecisionToolApplication(
                package_path,
                root / "runtime",
                TOOL_ROOT / "web",
            )
            result = create_result(package, app.package_hash, completed_draft(package))
            result["categories"][0]["options"] = []
            result["categories"][0]["selectedOptionIds"] = []
            rehash_result(result)
            result_directory = safe_relative_path(
                app.runtime_root,
                package["outputConfiguration"]["resultDirectory"],
            )
            save_json(result_directory / "semantic-invalid.json", result)
            listed = app.latest_results()
            self.assertEqual(1, len(listed))
            self.assertFalse(listed[0]["hashValid"])
            self.assertFalse(listed[0]["packageCompatible"])


class FrontendContractTests(unittest.TestCase):
    def test_browser_transition_and_numeric_input_contracts_are_present(self) -> None:
        app = (TOOL_ROOT / "web" / "app.js").read_text(encoding="utf-8")
        self.assertIn('previousStatus === "NOT_APPLICABLE"', app)
        self.assertIn('categoryState.notApplicableReason = "";', app)
        self.assertIn("input.valueAsNumber", app)
        self.assertIn("confirmReplaceMalformedDraft", app)
        self.assertIn("localDateTimeWithOffset", app)

    def test_crime99_guided_mode_is_default_and_uses_plain_german_copy(self) -> None:
        app = (TOOL_ROOT / "web" / "app.js").read_text(encoding="utf-8")
        checklist = (
            TOOL_ROOT / "Docs" / "HUMAN_TEST_CHECKLIST.md"
        ).read_text(encoding="utf-8")
        html = (TOOL_ROOT / "web" / "index.html").read_text(encoding="utf-8")
        self.assertIn(
            'state.package.decisionSetId === '
            '"crime99-surface-material-human-selection-v1"',
            app,
        )
        self.assertIn("showCategory(state.package.categories[0].id)", app)
        self.assertIn("Entscheidung ${categoryIndex + 1} von", app)
        self.assertIn("Diese Option verwenden", app)
        self.assertIn("Technische Details", app)
        self.assertIn("TECHNICAL MAPPING PENDING", app)
        self.assertIn('<html lang="de">', html)
        self.assertIn("Nur lokal — kein Upload", html)
        self.assertIn("Geführter", checklist)
        self.assertIn("Human-Test", checklist)

    def test_guided_flow_refresh_repair_labels_and_accessibility_are_bound(
        self,
    ) -> None:
        app = (TOOL_ROOT / "web" / "app.js").read_text(encoding="utf-8")
        html = (TOOL_ROOT / "web" / "index.html").read_text(encoding="utf-8")
        checklist = (
            TOOL_ROOT / "Docs" / "HUMAN_TEST_CHECKLIST.md"
        ).read_text(encoding="utf-8")
        self.assertIn("invalidateCompletedCategory(categoryState)", app)
        self.assertIn('categoryState.status = "UNRESOLVED";', app)
        self.assertIn('categoryState.implementationNote = "";', app)
        self.assertIn("Auswahl speichern und weiter", app)
        self.assertNotIn("data-guided-save", app)
        for label in ("Verwenden", "Nicht verwenden", "Später entscheiden"):
            self.assertIn(label, app)
            self.assertIn(label, checklist)
        self.assertIn('aria-pressed="${optionState.decision === decision}"', app)
        self.assertIn('aria-current="page"', app)
        self.assertIn('role="progressbar"', html)
        self.assertIn('aria-labelledby="preview-dialog-title"', html)
        self.assertIn('aria-labelledby="validation-title"', html)

    def test_crime99_launcher_registers_prepared_previews_automatically(
        self,
    ) -> None:
        launcher = (
            TOOL_ROOT / "Start-HumanVisualDecisionTool.cmd"
        ).read_text(encoding="utf-8")
        self.assertIn(
            "prepare_crime99_previews.py --register-existing",
            launcher,
        )
        self.assertLess(
            launcher.index("prepare_crime99_previews.py --register-existing"),
            launcher.index("server.py"),
        )

    def test_prepared_preview_generator_is_fixed_and_non_mutating(self) -> None:
        generator = (
            TOOL_ROOT
            / "UnityAutomation"
            / "HvdtPreparedPreviewGenerator.cs"
        ).read_text(encoding="utf-8")
        self.assertIn("private const int Width = 960;", generator)
        self.assertIn("private const int Height = 540;", generator)
        self.assertEqual(21, generator.count("new PreviewSpec("))
        self.assertIn("CreateRepairPreviewMaterial", generator)
        self.assertIn("FindTextureByDescription", generator)
        self.assertIn(
            "EditorSceneManager.NewScene(NewSceneSetup.EmptyScene",
            generator,
        )
        self.assertNotIn("OpenScene(", generator)
        self.assertNotIn("SaveScene(", generator)


class ServerSecurityTests(unittest.TestCase):
    def test_server_binds_to_loopback_only(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            try:
                self.assertEqual(HOST, server.server_address[0])
                self.assertEqual("127.0.0.1", server.server_address[0])
            finally:
                server.server_close()

    def test_csp_and_health_endpoint(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                url = f"http://127.0.0.1:{server.server_address[1]}/api/health"
                with urllib.request.urlopen(url, timeout=5) as response:
                    body = json.loads(response.read())
                    self.assertTrue(body["localOnly"])
                    self.assertIn(
                        "connect-src 'self'",
                        response.headers["Content-Security-Policy"],
                    )
                    self.assertEqual(
                        "same-origin",
                        response.headers["Cross-Origin-Resource-Policy"],
                    )
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)
            self.assertFalse(thread.is_alive())

    def test_non_local_host_header_is_rejected(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                connection = http.client.HTTPConnection(
                    "127.0.0.1", server.server_address[1], timeout=5
                )
                connection.request("GET", "/api/health", headers={"Host": "attacker.invalid"})
                response = connection.getresponse()
                self.assertEqual(403, response.status)
                response.read()
                connection.close()
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_non_local_origin_is_rejected(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                request = urllib.request.Request(
                    f"http://127.0.0.1:{server.server_address[1]}/api/health",
                    headers={"Origin": "https://attacker.invalid"},
                )
                with self.assertRaises(urllib.error.HTTPError) as raised:
                    urllib.request.urlopen(request, timeout=5)
                self.assertEqual(403, raised.exception.code)
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_static_file_traversal_is_rejected(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                url = (
                    f"http://127.0.0.1:{server.server_address[1]}"
                    "/%2e%2e/decision_tool.py"
                )
                with self.assertRaises(urllib.error.HTTPError) as raised:
                    urllib.request.urlopen(url, timeout=5)
                self.assertEqual(404, raised.exception.code)
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_full_http_finalise_and_completed_result_reload(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(package_path, root / "runtime", TOOL_ROOT / "web", 0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{server.server_address[1]}"
            try:
                request = urllib.request.Request(
                    f"{base}/api/finalize",
                    method="POST",
                    data=json.dumps(
                        {
                            "draft": completed_draft(package),
                            "savedAt": "2026-07-23T12:40:00+02:00",
                        }
                    ).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                )
                with urllib.request.urlopen(request, timeout=5) as response:
                    finalized = json.loads(response.read())
                self.assertTrue(finalized["finalized"])
                self.assertTrue(Path(finalized["jsonFile"]).is_file())
                with urllib.request.urlopen(f"{base}/api/results", timeout=5) as response:
                    results = json.loads(response.read())["results"]
                self.assertEqual(1, len(results))
                self.assertTrue(results[0]["hashValid"])
                name = urllib.parse.quote(results[0]["fileName"])
                with urllib.request.urlopen(f"{base}/api/result?name={name}", timeout=5) as response:
                    reopened = json.loads(response.read())["result"]
                self.assertTrue(verify_result_hash(reopened))
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_http_malformed_draft_and_field_types_fail_safely(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(
                package_path, root / "runtime", TOOL_ROOT / "web", 0
            )
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{server.server_address[1]}"
            try:
                malformed = completed_draft(package)
                malformed["categories"]["material"]["status"] = []
                validate_request = urllib.request.Request(
                    f"{base}/api/validate",
                    method="POST",
                    data=json.dumps(
                        {"draft": malformed, "final": True}
                    ).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                )
                with urllib.request.urlopen(validate_request, timeout=5) as response:
                    validation = json.loads(response.read())
                self.assertFalse(validation["valid"])
                self.assertTrue(
                    any("status" in item for item in validation["errors"])
                )

                invalid_field = completed_draft(package)
                invalid_field["categories"]["material"]["fields"]["mapping"] = {
                    "bad": True
                }
                finalize_request = urllib.request.Request(
                    f"{base}/api/finalize",
                    method="POST",
                    data=json.dumps(
                        {
                            "draft": invalid_field,
                            "savedAt": "2026-07-23T12:45:00+02:00",
                        }
                    ).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                )
                with self.assertRaises(urllib.error.HTTPError) as raised:
                    urllib.request.urlopen(finalize_request, timeout=5)
                self.assertEqual(422, raised.exception.code)
                body = json.loads(raised.exception.read())
                self.assertTrue(
                    any("mapping" in item for item in body["errors"])
                )
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_http_reopen_rejects_package_hash_mismatch(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            server = build_server(
                package_path, root / "runtime", TOOL_ROOT / "web", 0
            )
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                historical = create_result(
                    package, "B" * 64, completed_draft(package)
                )
                result_path, _ = write_result(
                    package, root / "runtime", historical
                )
                name = urllib.parse.quote(result_path.name)
                url = (
                    f"http://127.0.0.1:{server.server_address[1]}"
                    f"/api/result?name={name}"
                )
                with self.assertRaises(urllib.error.HTTPError) as raised:
                    urllib.request.urlopen(url, timeout=5)
                self.assertEqual(400, raised.exception.code)
                body = json.loads(raised.exception.read())
                self.assertIn("historical/incompatible", body["error"])
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_http_reopen_rejects_semantically_incompatible_result_unchanged(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            _, package_hash = load_package(package_path)
            runtime = root / "runtime"
            result = create_result(
                package,
                package_hash,
                completed_draft(package),
            )
            result["categories"][0]["implementationFields"]["mapping"] = 5
            rehash_result(result)
            result_path = safe_relative_path(
                runtime,
                "results/final/semantic-incompatible.json",
            )
            save_json(result_path, result)
            original_bytes = result_path.read_bytes()
            server = build_server(
                package_path,
                runtime,
                TOOL_ROOT / "web",
                0,
            )
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                name = urllib.parse.quote(result_path.name)
                url = (
                    f"http://127.0.0.1:{server.server_address[1]}"
                    f"/api/result?name={name}"
                )
                with self.assertRaises(urllib.error.HTTPError) as raised:
                    urllib.request.urlopen(url, timeout=5)
                self.assertEqual(400, raised.exception.code)
                body = json.loads(raised.exception.read())
                self.assertIn(
                    "incompatible with the active package",
                    body["error"],
                )
                self.assertEqual(original_bytes, result_path.read_bytes())
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)

    def test_runtime_web_files_have_no_external_request_targets(self) -> None:
        for name in ("index.html", "styles.css", "app.js"):
            content = (TOOL_ROOT / "web" / name).read_text(encoding="utf-8").lower()
            self.assertNotIn("http://", content)
            self.assertNotIn("https://", content)
            self.assertNotIn("wss://", content)
            self.assertNotIn("cdn.", content)

    @unittest.skipUnless(sys.platform == "win32", "Windows launcher reference test")
    def test_process_stops_cleanly_on_ctrl_break(self) -> None:
        package = minimal_package()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package_path = root / "package.json"
            package_path.write_text(json.dumps(package), encoding="utf-8")
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
                probe.bind(("127.0.0.1", 0))
                port = probe.getsockname()[1]
            process = subprocess.Popen(
                [
                    sys.executable,
                    str(TOOL_ROOT / "server.py"),
                    "--package",
                    str(package_path),
                    "--runtime-data",
                    str(root / "runtime data"),
                    "--port",
                    str(port),
                ],
                cwd=TOOL_ROOT,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
            )
            captured = ""
            try:
                deadline = time.time() + 8
                while "Press Ctrl+C to stop." not in captured and time.time() < deadline:
                    line = process.stdout.readline()
                    if line:
                        captured += line
                    elif process.poll() is not None:
                        break
                self.assertIn("Press Ctrl+C to stop.", captured)
                process.send_signal(signal.CTRL_BREAK_EVENT)
                remainder, _ = process.communicate(timeout=8)
                captured += remainder
                self.assertEqual(0, process.returncode)
                self.assertIn("Stopped.", captured)
            finally:
                if process.poll() is None:
                    process.kill()
                    process.wait(timeout=5)
                if process.stdout:
                    process.stdout.close()


if __name__ == "__main__":
    unittest.main()
