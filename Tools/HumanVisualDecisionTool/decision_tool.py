from __future__ import annotations

import hashlib
import json
import math
import mimetypes
import re
import struct
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any


PACKAGE_SCHEMA_VERSION = "1.0"
RESULT_SCHEMA_VERSION = "1.0"
SUPPORTED_SELECTION_MODES = {
    "single",
    "multiple",
    "ordered",
    "approveReject",
}
SUPPORTED_PREVIEW_MODES = {
    "isolatedMaterial",
    "contextualScene",
    "sideBySide",
    "beforeAfter",
    "staticImage",
    "externalLocalImage",
}
SUPPORTED_IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".bmp"}
SUPPORTED_IMAGE_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/bmp",
}
DECISION_STATES = {"UNRESOLVED", "SELECT", "REJECT", "DEFER"}
CATEGORY_STATES = {"UNRESOLVED", "COMPLETED", "DEFERRED", "NOT_APPLICABLE"}
SAFE_IDENTIFIER = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$")
WINDOWS_RESERVED_NAMES = {
    "CON",
    "PRN",
    "AUX",
    "NUL",
    *(f"COM{number}" for number in range(1, 10)),
    *(f"LPT{number}" for number in range(1, 10)),
}
MAX_PREVIEW_BYTES = 64 * 1024 * 1024
MAX_PREVIEW_DIMENSION = 32768
TECHNICAL_MAPPING_PENDING = (
    "TECHNICAL MAPPING PENDING — visual selection recorded; deterministic "
    "renderer/slot mapping is required before Crime99 mutation."
)
GEOMETRY_MAPPING_PENDING = (
    "TECHNICAL MAPPING PENDING — geometry disposition recorded; exact object "
    "mapping is required before Crime99 mutation."
)
HUMAN_DECISION_DEFERRED = (
    "HUMAN DECISION DEFERRED — no Crime99 mutation is authorised."
)
NO_SUITABLE_OPTION = (
    "SEPARATE HUMAN DIRECTION REQUIRED — no suitable prepared option was selected."
)
NO_SUITABLE_REPAIR_OPTION = (
    "SEPARATE HUMAN DIRECTION REQUIRED — no prepared repair option was selected."
)


class DecisionToolError(Exception):
    pass


class ValidationError(DecisionToolError):
    def __init__(self, errors: list[str]):
        super().__init__("; ".join(errors))
        self.errors = errors


def canonical_json_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    ).encode("utf-8")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest().upper()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def _required_text(value: Any, name: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{name} must be non-empty text.")


def _reject_unexpected_keys(
    value: dict[str, Any],
    allowed: set[str],
    path: str,
    errors: list[str],
) -> None:
    for key in sorted(set(value) - allowed, key=str):
        errors.append(f"{path}.{key} is not supported by schema version 1.0.")


def _safe_identifier(value: Any, name: str, errors: list[str], *, storage: bool = False) -> None:
    _required_text(value, name, errors)
    if not isinstance(value, str) or not value:
        return
    if not SAFE_IDENTIFIER.fullmatch(value):
        errors.append(
            f"{name} must use only letters, numbers, dots, underscores, and hyphens "
            "and must start with a letter or number."
        )
    if value.endswith((".", " ")):
        errors.append(f"{name} must not end with a dot or space.")
    if storage and value.split(".", 1)[0].upper() in WINDOWS_RESERVED_NAMES:
        errors.append(f"{name} is a reserved Windows device name.")


def _is_external_reference(value: str) -> bool:
    lowered = value.strip().lower()
    return bool(
        re.match(
            r"(?i)^(?:[a-z][a-z0-9+.-]*:|//)",
            lowered,
        )
    )


def _visual_reference_errors(value: str, path: str) -> list[str]:
    errors: list[str] = []
    external_scheme = re.compile(
        r"(?i)(?<![a-z0-9+.-])(?:https?|wss?|ftp|file)://[^\s<>'\"`]+"
    )
    scheme_relative = re.compile(
        r"(?i)(?<![:a-z0-9_])//(?:[a-z0-9-]+\.)+[a-z]{2,}"
        r"(?::[0-9]{1,5})?(?:/[^\s<>'\"`]*)?"
    )
    data_uri = re.compile(
        r"(?i)(?<![a-z0-9+.-])data:[^,\s]{0,256},"
    )
    blob_uri = re.compile(
        r"(?i)(?<![a-z0-9+.-])blob:(?://|https?://|[a-z0-9])"
    )
    if external_scheme.search(value) or scheme_relative.search(value):
        errors.append(f"{path} contains an external URL.")
    if data_uri.search(value) or blob_uri.search(value):
        errors.append(f"{path} contains an embedded or transient data URL.")
    if re.search(r"!\s*\[[^\]]*\]\s*\(", value):
        errors.append(f"{path} contains Markdown image embedding.")
    if re.search(r"(?i)<\s*(img|picture|source|object|embed)\b", value):
        errors.append(f"{path} contains HTML media embedding.")
    return errors


def validate_external_visual_references(
    value: Any, path: str = "value"
) -> list[str]:
    errors: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            errors.extend(
                validate_external_visual_references(child, f"{path}.{key}")
            )
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(
                validate_external_visual_references(child, f"{path}[{index}]")
            )
    elif isinstance(value, str):
        errors.extend(_visual_reference_errors(value, path))
    return errors


def validate_text_only_export(value: Any, path: str = "result") -> list[str]:
    errors: list[str] = []
    prohibited_keys = {
        "base64",
        "embedding",
        "embeddings",
        "featurevector",
        "featurevectors",
        "imagedata",
        "previewassets",
        "thumbnaildata",
    }

    if isinstance(value, bytes):
        return [f"{path} contains binary data."]
    if isinstance(value, dict):
        for key, child in value.items():
            normalized_key = re.sub(r"[^a-z0-9]", "", str(key).lower())
            if normalized_key in prohibited_keys:
                errors.append(f"{path}.{key} is prohibited in text-only export.")
            errors.extend(validate_text_only_export(child, f"{path}.{key}"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(validate_text_only_export(child, f"{path}[{index}]"))
    elif isinstance(value, str):
        errors.extend(_visual_reference_errors(value, path))
    return errors


def validate_package(package: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(package, dict):
        return ["The decision package must be a JSON object."]
    _reject_unexpected_keys(
        package,
        {
            "schemaVersion",
            "decisionSetId",
            "title",
            "description",
            "project",
            "stage",
            "sourceContext",
            "validationRules",
            "categories",
            "outputConfiguration",
        },
        "package",
        errors,
    )

    for key in (
        "schemaVersion",
        "decisionSetId",
        "title",
        "description",
        "project",
        "stage",
        "sourceContext",
        "categories",
        "outputConfiguration",
    ):
        if key not in package:
            errors.append(f"Missing required package field: {key}.")

    if package.get("schemaVersion") != PACKAGE_SCHEMA_VERSION:
        errors.append(
            f"Unsupported schemaVersion. Expected {PACKAGE_SCHEMA_VERSION!r}."
        )

    _safe_identifier(package.get("decisionSetId"), "decisionSetId", errors, storage=True)
    for key in ("title", "description", "project", "stage"):
        _required_text(package.get(key), key, errors)
    if "sourceContext" in package and not isinstance(package.get("sourceContext"), dict):
        errors.append("sourceContext must be an object.")
    if "validationRules" in package and not isinstance(
        package.get("validationRules"), dict
    ):
        errors.append("validationRules must be an object.")
    elif isinstance(package.get("validationRules"), dict):
        global_rules = package["validationRules"]
        for flag in ("allowDeferred", "allowNotApplicable"):
            if flag in global_rules and not isinstance(global_rules[flag], bool):
                errors.append(f"validationRules.{flag} must be true or false.")
        for count_key in ("minimumSelections", "maximumSelections"):
            if count_key in global_rules and (
                not isinstance(global_rules[count_key], int)
                or isinstance(global_rules[count_key], bool)
                or global_rules[count_key] < 0
            ):
                errors.append(
                    f"validationRules.{count_key} must be a non-negative integer."
                )
        unsupported_global = set(global_rules) - {
            "allowDeferred",
            "allowNotApplicable",
            "minimumSelections",
            "maximumSelections",
        }
        for key in sorted(unsupported_global):
            errors.append(
                f"validationRules.{key} is category-specific and is not permitted "
                "at package level."
            )
        global_minimum = global_rules.get("minimumSelections")
        global_maximum = global_rules.get("maximumSelections")
        if (
            isinstance(global_minimum, int)
            and not isinstance(global_minimum, bool)
            and isinstance(global_maximum, int)
            and not isinstance(global_maximum, bool)
            and global_minimum > global_maximum
        ):
            errors.append(
                "validationRules.minimumSelections must not exceed "
                "maximumSelections."
            )

    categories = package.get("categories")
    if not isinstance(categories, list) or not categories:
        errors.append("categories must be a non-empty array.")
        return errors

    category_ids: set[str] = set()
    option_ids: set[str] = set()
    preview_ids: set[str] = set()

    for category_index, category in enumerate(categories):
        prefix = f"categories[{category_index}]"
        if not isinstance(category, dict):
            errors.append(f"{prefix} must be an object.")
            continue
        _reject_unexpected_keys(
            category,
            {
                "id",
                "title",
                "description",
                "selectionMode",
                "options",
                "implementationFields",
                "validationRules",
            },
            prefix,
            errors,
        )

        category_id = category.get("id")
        _safe_identifier(category_id, f"{prefix}.id", errors)
        if isinstance(category_id, str):
            if category_id in category_ids:
                errors.append(f"Duplicate category id: {category_id}.")
            category_ids.add(category_id)

        _required_text(category.get("title"), f"{prefix}.title", errors)
        _required_text(category.get("description"), f"{prefix}.description", errors)
        mode = category.get("selectionMode")
        if mode not in SUPPORTED_SELECTION_MODES:
            errors.append(
                f"{prefix}.selectionMode must be one of "
                f"{sorted(SUPPORTED_SELECTION_MODES)}."
            )

        options = category.get("options")
        if not isinstance(options, list) or not options:
            errors.append(f"{prefix}.options must be a non-empty array.")
            continue

        local_option_ids: set[str] = set()
        for option_index, option in enumerate(options):
            option_prefix = f"{prefix}.options[{option_index}]"
            if not isinstance(option, dict):
                errors.append(f"{option_prefix} must be an object.")
                continue
            _reject_unexpected_keys(
                option,
                {
                    "id",
                    "label",
                    "description",
                    "technicalName",
                    "sourceLabel",
                    "technicalMetadata",
                    "implementationMetadata",
                    "exclusiveSelection",
                    "previewAssets",
                },
                option_prefix,
                errors,
            )
            option_id = option.get("id")
            _safe_identifier(option_id, f"{option_prefix}.id", errors)
            _required_text(option.get("label"), f"{option_prefix}.label", errors)
            for text_key in ("description", "technicalName", "sourceLabel"):
                if text_key in option and not isinstance(option.get(text_key), str):
                    errors.append(f"{option_prefix}.{text_key} must be text.")
            if "technicalMetadata" in option and not isinstance(
                option.get("technicalMetadata"), dict
            ):
                errors.append(f"{option_prefix}.technicalMetadata must be an object.")
            if "implementationMetadata" in option and not isinstance(
                option.get("implementationMetadata"), dict
            ):
                errors.append(
                    f"{option_prefix}.implementationMetadata must be an object."
                )
            if "exclusiveSelection" in option and not isinstance(
                option.get("exclusiveSelection"), bool
            ):
                errors.append(
                    f"{option_prefix}.exclusiveSelection must be true or false."
                )
            if isinstance(option_id, str):
                if option_id in local_option_ids:
                    errors.append(
                        f"Duplicate option id {option_id!r} in category {category_id!r}."
                    )
                local_option_ids.add(option_id)
                combined = f"{category_id}/{option_id}"
                if combined in option_ids:
                    errors.append(f"Duplicate option identity: {combined}.")
                option_ids.add(combined)

            previews = option.get("previewAssets", [])
            if not isinstance(previews, list):
                errors.append(f"{option_prefix}.previewAssets must be an array.")
                continue
            for preview_index, preview in enumerate(previews):
                preview_prefix = (
                    f"{option_prefix}.previewAssets[{preview_index}]"
                )
                if not isinstance(preview, dict):
                    errors.append(f"{preview_prefix} must be an object.")
                    continue
                _reject_unexpected_keys(
                    preview,
                    {"id", "path", "mode", "label", "expectedSha256"},
                    preview_prefix,
                    errors,
                )
                preview_id = preview.get("id")
                _safe_identifier(preview_id, f"{preview_prefix}.id", errors)
                path_value = preview.get("path")
                _required_text(path_value, f"{preview_prefix}.path", errors)
                if isinstance(path_value, str):
                    path_object = Path(path_value)
                    if _is_external_reference(path_value) or path_object.is_absolute():
                        errors.append(
                            f"{preview_prefix}.path must be a relative local "
                            "filesystem reference."
                        )
                    elif (
                        not path_object.parts
                        or path_object.parts[0].lower() != "previews"
                        or ".." in path_object.parts
                    ):
                        errors.append(
                            f"{preview_prefix}.path must remain inside the approved "
                            "local previews root."
                        )
                mode_value = preview.get("mode")
                if mode_value not in SUPPORTED_PREVIEW_MODES:
                    errors.append(
                        f"{preview_prefix}.mode must be one of "
                        f"{sorted(SUPPORTED_PREVIEW_MODES)}."
                    )
                if "label" in preview and not isinstance(preview.get("label"), str):
                    errors.append(f"{preview_prefix}.label must be text.")
                expected_hash = preview.get("expectedSha256")
                if expected_hash is not None and re.fullmatch(
                    r"[A-Fa-f0-9]{64}", str(expected_hash)
                ) is None:
                    errors.append(
                        f"{preview_prefix}.expectedSha256 must be a 64-character SHA-256."
                    )
                if isinstance(preview_id, str):
                    if preview_id in preview_ids:
                        errors.append(f"Duplicate preview id: {preview_id}.")
                    preview_ids.add(preview_id)

        fields = category.get("implementationFields", [])
        field_ids: set[str] = set()
        if not isinstance(fields, list):
            errors.append(f"{prefix}.implementationFields must be an array.")
        else:
            for field_index, field in enumerate(fields):
                field_prefix = f"{prefix}.implementationFields[{field_index}]"
                if not isinstance(field, dict):
                    errors.append(f"{field_prefix} must be an object.")
                    continue
                _reject_unexpected_keys(
                    field,
                    {
                        "id",
                        "label",
                        "type",
                        "description",
                        "choices",
                        "minimum",
                        "maximum",
                        "pattern",
                    },
                    field_prefix,
                    errors,
                )
                field_id = field.get("id")
                _safe_identifier(field_id, f"{field_prefix}.id", errors)
                _required_text(field.get("label"), f"{field_prefix}.label", errors)
                field_type = field.get("type")
                if field_type not in {"text", "textarea", "number", "select"}:
                    errors.append(
                        f"{field_prefix}.type must be text, textarea, number, or select."
                    )
                if isinstance(field_id, str):
                    if field_id in field_ids:
                        errors.append(
                            f"Duplicate field id {field_id!r} in category {category_id!r}."
                        )
                    field_ids.add(field_id)
                if field_type == "select":
                    choices = field.get("choices")
                    if (
                        not isinstance(choices, list)
                        or not choices
                        or any(not isinstance(choice, str) for choice in choices)
                    ):
                        errors.append(
                            f"{field_prefix}.choices must be a non-empty text array."
                        )
                elif "choices" in field:
                    errors.append(
                        f"{field_prefix}.choices is permitted only for select fields."
                    )
                if field_type != "number" and (
                    "minimum" in field or "maximum" in field
                ):
                    errors.append(
                        f"{field_prefix}.minimum and maximum are permitted only "
                        "for number fields."
                    )
                if "minimum" in field and not isinstance(
                    field.get("minimum"), (int, float)
                ) or isinstance(field.get("minimum"), bool) or (
                    isinstance(field.get("minimum"), (int, float))
                    and not math.isfinite(field["minimum"])
                ):
                    errors.append(f"{field_prefix}.minimum must be numeric.")
                if "maximum" in field and not isinstance(
                    field.get("maximum"), (int, float)
                ) or isinstance(field.get("maximum"), bool) or (
                    isinstance(field.get("maximum"), (int, float))
                    and not math.isfinite(field["maximum"])
                ):
                    errors.append(f"{field_prefix}.maximum must be numeric.")
                if (
                    isinstance(field.get("minimum"), (int, float))
                    and not isinstance(field.get("minimum"), bool)
                    and isinstance(field.get("maximum"), (int, float))
                    and not isinstance(field.get("maximum"), bool)
                    and field["minimum"] > field["maximum"]
                ):
                    errors.append(f"{field_prefix}.minimum must not exceed maximum.")
                if "pattern" in field:
                    if field_type not in {"text", "textarea"}:
                        errors.append(
                            f"{field_prefix}.pattern is permitted only for text "
                            "and textarea fields."
                        )
                    elif not isinstance(field.get("pattern"), str):
                        errors.append(f"{field_prefix}.pattern must be text.")
                    else:
                        try:
                            re.compile(field["pattern"])
                        except re.error:
                            errors.append(
                                f"{field_prefix}.pattern is not a valid expression."
                            )

        rules = category.get("validationRules", {})
        if not isinstance(rules, dict):
            errors.append(f"{prefix}.validationRules must be an object.")
        else:
            _reject_unexpected_keys(
                rules,
                {
                    "allowDeferred",
                    "allowNotApplicable",
                    "minimumSelections",
                    "maximumSelections",
                    "requireCategoryComment",
                    "requireImplementationNote",
                    "requireDeferredOptionComment",
                    "requireDerivedImplementationNote",
                    "requiredFields",
                    "requiredFieldsByOption",
                },
                f"{prefix}.validationRules",
                errors,
            )
            required_fields = rules.get("requiredFields", [])
            if not isinstance(required_fields, list) or any(
                not isinstance(item, str) for item in required_fields
            ):
                errors.append(f"{prefix}.validationRules.requiredFields must be an array.")
            else:
                if len(required_fields) != len(set(required_fields)):
                    errors.append(
                        f"{prefix}.validationRules.requiredFields must be unique."
                    )
                missing_refs = sorted(set(required_fields) - field_ids)
                for missing in missing_refs:
                    errors.append(
                        f"{prefix}.validationRules references unknown field {missing!r}."
                    )
            required_by_option = rules.get("requiredFieldsByOption", {})
            if not isinstance(required_by_option, dict):
                errors.append(
                    f"{prefix}.validationRules.requiredFieldsByOption must be an object."
                )
            else:
                for option_ref, field_refs in required_by_option.items():
                    if option_ref not in local_option_ids:
                        errors.append(
                            f"{prefix}.validationRules references unknown option "
                            f"{option_ref!r}."
                        )
                    if not isinstance(field_refs, list) or any(
                        not isinstance(item, str) for item in field_refs
                    ):
                        errors.append(
                            f"{prefix}.validationRules.requiredFieldsByOption."
                            f"{option_ref} must be an array."
                        )
                        continue
                    if len(field_refs) != len(set(field_refs)):
                        errors.append(
                            f"{prefix}.validationRules.requiredFieldsByOption."
                            f"{option_ref} must be unique."
                        )
                    for missing in sorted(set(field_refs) - field_ids):
                        errors.append(
                            f"{prefix}.validationRules option {option_ref!r} "
                            f"references unknown field {missing!r}."
                        )
            for flag in (
                "allowDeferred",
                "allowNotApplicable",
                "requireCategoryComment",
                "requireImplementationNote",
                "requireDeferredOptionComment",
                "requireDerivedImplementationNote",
            ):
                if flag in rules and not isinstance(rules[flag], bool):
                    errors.append(f"{prefix}.validationRules.{flag} must be true or false.")
            for count_key in ("minimumSelections", "maximumSelections"):
                if count_key in rules and (
                    not isinstance(rules[count_key], int)
                    or isinstance(rules[count_key], bool)
                    or rules[count_key] < 0
                ):
                    errors.append(
                        f"{prefix}.validationRules.{count_key} must be a non-negative integer."
                    )
            minimum = rules.get("minimumSelections")
            maximum = rules.get("maximumSelections")
            if (
                isinstance(minimum, int)
                and not isinstance(minimum, bool)
                and isinstance(maximum, int)
                and not isinstance(maximum, bool)
                and minimum > maximum
            ):
                errors.append(
                    f"{prefix}.validationRules.minimumSelections must not exceed "
                    "maximumSelections."
                )

    output_configuration = package.get("outputConfiguration")
    if not isinstance(output_configuration, dict):
        errors.append("outputConfiguration must be an object.")
    else:
        _reject_unexpected_keys(
            output_configuration,
            {"resultDirectory", "generateMarkdown"},
            "outputConfiguration",
            errors,
        )
        result_directory = output_configuration.get("resultDirectory", "results")
        if (
            not isinstance(result_directory, str)
            or not result_directory.strip()
            or Path(result_directory).is_absolute()
            or ".." in Path(result_directory).parts
        ):
            errors.append(
                "outputConfiguration.resultDirectory must be a safe relative path."
            )
        if "generateMarkdown" in output_configuration and not isinstance(
            output_configuration.get("generateMarkdown"), bool
        ):
            errors.append("outputConfiguration.generateMarkdown must be true or false.")

    errors.extend(validate_external_visual_references(package, "package"))
    return errors


def load_package(path: Path) -> tuple[dict[str, Any], str]:
    try:
        raw = path.read_bytes()
        package = json.loads(raw.decode("utf-8-sig"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise DecisionToolError(f"Could not read decision package: {exc}") from exc
    errors = validate_package(package)
    if errors:
        raise ValidationError(errors)
    return package, sha256_bytes(raw)


def create_empty_draft(package: dict[str, Any]) -> dict[str, Any]:
    categories: dict[str, Any] = {}
    for category in package["categories"]:
        categories[category["id"]] = {
            "status": "UNRESOLVED",
            "categoryComment": "",
            "implementationNote": "",
            "exceptionOrConcern": "",
            "notApplicableReason": "",
            "optionStates": {
                option["id"]: {
                    "decision": "UNRESOLVED",
                    "comment": "",
                    "rank": None,
                }
                for option in category["options"]
            },
            "fields": {
                field["id"]: "" for field in category.get("implementationFields", [])
            },
        }
    return {
        "draftSchemaVersion": "1.0",
        "decisionSetId": package["decisionSetId"],
        "humanIdentifier": "",
        "decisionDateTime": "",
        "humanAttestation": False,
        "finalConfirmation": False,
        "categories": categories,
    }


def _is_blank(value: Any) -> bool:
    return value is None or (isinstance(value, str) and not value.strip())


def _unambiguous_datetime_error(value: Any) -> str | None:
    if not isinstance(value, str) or not value.strip():
        return "is required."
    try:
        parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError:
        return "must be a valid ISO date/time."
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        return "must include an explicit UTC offset or Z."
    return None


def _field_type_error(field: dict[str, Any], value: Any) -> str | None:
    field_type = field.get("type")
    if field_type in {"text", "textarea"}:
        if not isinstance(value, str):
            return "must be text."
    elif field_type == "number":
        if value == "":
            return None
        if (
            not isinstance(value, (int, float))
            or isinstance(value, bool)
            or not math.isfinite(value)
        ):
            return "must be a finite JSON number."
    elif field_type == "select":
        if not isinstance(value, str):
            return "must be one of the declared text choices."
    else:
        return "uses an unsupported package field type."
    return None


def _field_value_error(
    field: dict[str, Any],
    value: Any,
    *,
    required: bool,
) -> str | None:
    type_error = _field_type_error(field, value)
    if type_error:
        return type_error
    if value == "" or (isinstance(value, str) and not value.strip()):
        return "is required." if required else None
    field_type = field.get("type")
    if field_type == "number":
        if "minimum" in field and value < field["minimum"]:
            return f"must be at least {field['minimum']}."
        if "maximum" in field and value > field["maximum"]:
            return f"must be no more than {field['maximum']}."
    if field_type == "select" and value not in field.get("choices", []):
        return "must be one of the declared choices."
    if "pattern" in field:
        if (
            re.fullmatch(
                field["pattern"],
                value.strip(),
                flags=re.MULTILINE | re.IGNORECASE | re.DOTALL,
            )
            is None
        ):
            return "does not match the required format."
    return None


def validate_draft_structure(
    package: dict[str, Any], draft: Any
) -> list[str]:
    errors: list[str] = []
    if not isinstance(draft, dict):
        return ["Draft must be a JSON object."]

    top_keys = {
        "draftSchemaVersion",
        "decisionSetId",
        "humanIdentifier",
        "decisionDateTime",
        "humanAttestation",
        "finalConfirmation",
        "categories",
    }
    _reject_unexpected_keys(draft, top_keys, "draft", errors)
    for key in sorted(top_keys - set(draft)):
        errors.append(f"Draft is missing {key}.")
    if draft.get("draftSchemaVersion") != "1.0":
        errors.append("Draft schema version is unsupported.")
    if draft.get("decisionSetId") != package["decisionSetId"]:
        errors.append("Draft decisionSetId does not match the package.")
    for key in ("humanIdentifier", "decisionDateTime"):
        if not isinstance(draft.get(key), str):
            errors.append(f"draft.{key} must be text.")
    for key in ("humanAttestation", "finalConfirmation"):
        if not isinstance(draft.get(key), bool):
            errors.append(f"draft.{key} must be true or false.")

    categories = draft.get("categories")
    if not isinstance(categories, dict):
        errors.append("draft.categories must be an object.")
        return errors
    package_categories = {category["id"]: category for category in package["categories"]}
    for category_id in sorted(set(categories) - set(package_categories)):
        errors.append(f"draft.categories contains unknown category {category_id!r}.")
    for category_id in sorted(set(package_categories) - set(categories)):
        errors.append(f"draft.categories is missing category {category_id!r}.")

    category_keys = {
        "status",
        "categoryComment",
        "implementationNote",
        "exceptionOrConcern",
        "notApplicableReason",
        "optionStates",
        "fields",
    }
    option_state_keys = {"decision", "comment", "rank"}
    for category_id, category in package_categories.items():
        path = f"draft.categories.{category_id}"
        state = categories.get(category_id)
        if not isinstance(state, dict):
            errors.append(f"{path} must be an object.")
            continue
        _reject_unexpected_keys(state, category_keys, path, errors)
        for key in sorted(category_keys - set(state)):
            errors.append(f"{path} is missing {key}.")
        status = state.get("status")
        if not isinstance(status, str) or status not in CATEGORY_STATES:
            errors.append(f"{path}.status must be a supported category status.")
        for key in (
            "categoryComment",
            "implementationNote",
            "exceptionOrConcern",
            "notApplicableReason",
        ):
            if not isinstance(state.get(key), str):
                errors.append(f"{path}.{key} must be text.")

        option_states = state.get("optionStates")
        expected_options = {option["id"] for option in category["options"]}
        if not isinstance(option_states, dict):
            errors.append(f"{path}.optionStates must be an object.")
        else:
            for option_id in sorted(set(option_states) - expected_options):
                errors.append(f"{path}.optionStates contains unknown option {option_id!r}.")
            for option_id in sorted(expected_options - set(option_states)):
                errors.append(f"{path}.optionStates is missing option {option_id!r}.")
            for option_id in expected_options:
                option_state = option_states.get(option_id)
                option_path = f"{path}.optionStates.{option_id}"
                if not isinstance(option_state, dict):
                    errors.append(f"{option_path} must be an object.")
                    continue
                _reject_unexpected_keys(
                    option_state, option_state_keys, option_path, errors
                )
                for key in sorted(option_state_keys - set(option_state)):
                    errors.append(f"{option_path} is missing {key}.")
                if option_state.get("decision") not in DECISION_STATES:
                    errors.append(f"{option_path}.decision is unsupported.")
                if not isinstance(option_state.get("comment"), str):
                    errors.append(f"{option_path}.comment must be text.")
                rank = option_state.get("rank")
                if rank is not None and (
                    not isinstance(rank, int)
                    or isinstance(rank, bool)
                    or rank < 1
                ):
                    errors.append(
                        f"{option_path}.rank must be null or a positive integer."
                    )

        fields = state.get("fields")
        expected_fields = {
            field["id"]: field for field in category.get("implementationFields", [])
        }
        if not isinstance(fields, dict):
            errors.append(f"{path}.fields must be an object.")
        else:
            for field_id in sorted(set(fields) - set(expected_fields)):
                errors.append(f"{path}.fields contains unknown field {field_id!r}.")
            for field_id in sorted(set(expected_fields) - set(fields)):
                errors.append(f"{path}.fields is missing field {field_id!r}.")
            for field_id, field in expected_fields.items():
                if field_id in fields:
                    type_error = _field_type_error(field, fields[field_id])
                    if type_error:
                        errors.append(f"{path}.fields.{field_id} {type_error}")
    return errors


def normalise_draft(package: dict[str, Any], draft: Any) -> dict[str, Any]:
    errors = validate_draft_structure(package, draft)
    if errors:
        raise ValidationError(errors)
    return deepcopy(draft)


def clear_incompatible_not_applicable_reasons(
    draft: dict[str, Any],
) -> tuple[dict[str, Any], int]:
    cleaned = deepcopy(draft)
    removed = 0
    for state in cleaned["categories"].values():
        if (
            state.get("status") != "NOT_APPLICABLE"
            and isinstance(state.get("notApplicableReason"), str)
            and state["notApplicableReason"].strip()
        ):
            state["notApplicableReason"] = ""
            removed += 1
    return cleaned, removed


def expected_guided_implementation_note(
    category: dict[str, Any],
    state: dict[str, Any],
) -> str:
    option_states = state["optionStates"]
    selected = [
        option
        for option in category["options"]
        if option_states[option["id"]].get("decision") == "SELECT"
    ]
    deferred = [
        option
        for option in category["options"]
        if option_states[option["id"]].get("decision") == "DEFER"
    ]

    if category["id"] == "repairs-wear":
        deferred_names = ", ".join(
            option.get("technicalName") or option["label"]
            for option in deferred
        )
        if selected:
            if deferred_names:
                return (
                    TECHNICAL_MAPPING_PENDING
                    + " Deferred repair candidates: "
                    + deferred_names
                    + "."
                )
            return TECHNICAL_MAPPING_PENDING
        if deferred_names:
            return (
                "HUMAN DECISION DEFERRED — repair candidates pending: "
                + deferred_names
                + "; no Crime99 mutation is authorised."
            )
        return NO_SUITABLE_REPAIR_OPTION

    if any(
        option.get("technicalName") == "DEFER"
        or option.get("implementationMetadata", {}).get("geometryAction")
        == "deferred"
        for option in selected
    ):
        return HUMAN_DECISION_DEFERRED
    if any(
        option.get("technicalName") == "NO_SUITABLE_OPTION"
        for option in selected
    ):
        return NO_SUITABLE_OPTION
    if any(
        bool(option.get("technicalMetadata", {}).get("materialPath"))
        for option in selected
    ):
        return TECHNICAL_MAPPING_PENDING
    return GEOMETRY_MAPPING_PENDING


def validate_draft(
    package: dict[str, Any], draft: Any, *, final: bool = False
) -> list[str]:
    errors: list[str] = []
    try:
        draft = normalise_draft(package, draft)
    except ValidationError as exc:
        return exc.errors
    except DecisionToolError as exc:
        return [str(exc)]

    if final:
        _required_text(
            draft.get("humanIdentifier"), "Human identifier", errors
        )
        date_error = _unambiguous_datetime_error(draft.get("decisionDateTime"))
        if date_error:
            errors.append(f"Decision date and time {date_error}")
        if draft.get("humanAttestation") is not True:
            errors.append("Human attestation must be confirmed.")
        if draft.get("finalConfirmation") is not True:
            errors.append("Explicit final confirmation is required.")

    package_rules = package.get("validationRules", {})
    for category in package["categories"]:
        category_id = category["id"]
        state = draft["categories"][category_id]
        status = state.get("status")
        label = category["title"]
        rules = deepcopy(package_rules)
        rules.update(category.get("validationRules", {}))

        if status not in CATEGORY_STATES:
            errors.append(f"{label}: invalid category status.")
            continue
        if (
            status != "NOT_APPLICABLE"
            and isinstance(state.get("notApplicableReason"), str)
            and state["notApplicableReason"].strip()
        ):
            errors.append(
                f"{label}: NOT APPLICABLE reason must be empty unless the "
                "category status is NOT APPLICABLE."
            )

        if status == "NOT_APPLICABLE":
            if not rules.get("allowNotApplicable", False):
                errors.append(f"{label}: NOT APPLICABLE is not permitted.")
            if _is_blank(state.get("notApplicableReason")):
                errors.append(f"{label}: NOT APPLICABLE requires a Human reason.")
            if any(
                option_state.get("decision") != "UNRESOLVED"
                for option_state in state["optionStates"].values()
            ) or any(not _is_blank(value) for value in state["fields"].values()):
                errors.append(
                    f"{label}: NOT APPLICABLE cannot retain option decisions or "
                    "implementation-field values."
                )
            continue

        if status == "DEFERRED":
            if not rules.get("allowDeferred", False):
                errors.append(f"{label}: DEFERRED is not permitted.")
            if _is_blank(state.get("categoryComment")):
                errors.append(f"{label}: DEFERRED requires a Human comment.")
            if any(
                option_state.get("decision") != "UNRESOLVED"
                for option_state in state["optionStates"].values()
            ):
                errors.append(
                    f"{label}: a deferred category cannot retain option decisions."
                )
            if any(not _is_blank(value) for value in state["fields"].values()):
                errors.append(
                    f"{label}: a deferred category cannot retain implementation-field values."
                )
            continue

        option_states = state["optionStates"]
        for option in category["options"]:
            decision = option_states[option["id"]].get("decision")
            if decision not in DECISION_STATES:
                errors.append(
                    f"{label} / {option['label']}: invalid decision state."
                )
            if decision == "DEFER" and not rules.get("allowDeferred", False):
                errors.append(
                    f"{label} / {option['label']}: DEFER is not permitted."
                )
            if (
                decision == "DEFER"
                and rules.get("requireDeferredOptionComment", False)
                and _is_blank(option_states[option["id"]].get("comment"))
            ):
                errors.append(
                    f"{label} / {option['label']}: DEFER requires a Human reason."
                )

        selected = [
            option
            for option in category["options"]
            if option_states[option["id"]].get("decision") == "SELECT"
        ]
        mode = category["selectionMode"]
        if mode == "single" and len(selected) != 1:
            errors.append(f"{label}: select exactly one option.")
        elif mode == "multiple":
            minimum = rules.get("minimumSelections", 1)
            maximum = rules.get("maximumSelections")
            if len(selected) < minimum:
                errors.append(
                    f"{label}: select at least {minimum} option(s)."
                )
            if maximum is not None and len(selected) > maximum:
                errors.append(
                    f"{label}: select no more than {maximum} option(s)."
                )
            exclusive_selected = [
                option
                for option in selected
                if option.get("exclusiveSelection") is True
            ]
            if exclusive_selected and len(selected) != 1:
                errors.append(
                    f"{label}: {exclusive_selected[0]['label']} cannot be combined "
                    "with another selection."
                )
        elif mode == "ordered":
            minimum = rules.get("minimumSelections", 1)
            if len(selected) < minimum:
                errors.append(
                    f"{label}: rank at least {minimum} option(s)."
                )
            ranks = [option_states[item["id"]].get("rank") for item in selected]
            if (
                any(not isinstance(rank, int) or rank < 1 for rank in ranks)
                or len(ranks) != len(set(ranks))
                or sorted(ranks) != list(range(1, len(ranks) + 1))
            ):
                errors.append(
                    f"{label}: selected preferences need unique contiguous ranks "
                    "starting at 1."
                )
        elif mode == "approveReject":
            unresolved = [
                option["label"]
                for option in category["options"]
                if option_states[option["id"]].get("decision") == "UNRESOLVED"
            ]
            if unresolved:
                errors.append(
                    f"{label}: decide every option ({', '.join(unresolved)})."
                )

        if rules.get("requireCategoryComment") and _is_blank(
            state.get("categoryComment")
        ):
            errors.append(f"{label}: category comment is required.")
        if rules.get("requireImplementationNote") and _is_blank(
            state.get("implementationNote")
        ):
            errors.append(f"{label}: implementation note is required.")

        fields_by_id = {
            field["id"]: field for field in category.get("implementationFields", [])
        }
        required_field_ids = set(rules.get("requiredFields", []))
        required_by_option = rules.get("requiredFieldsByOption", {})
        for option in selected:
            required_field_ids.update(required_by_option.get(option["id"], []))
        for field_id in sorted(required_field_ids - set(fields_by_id)):
            errors.append(
                f"{label}: package references unknown required field {field_id!r}."
            )
        for field_id, field in fields_by_id.items():
            value_error = _field_value_error(
                field,
                state["fields"].get(field_id),
                required=field_id in required_field_ids,
            )
            if value_error:
                errors.append(
                    f"{label}: {field['label']} {value_error}"
                )

        if rules.get("requireDerivedImplementationNote", False):
            expected_note = (
                expected_guided_implementation_note(category, state)
                if status == "COMPLETED"
                else ""
            )
            if state.get("implementationNote") != expected_note:
                errors.append(
                    f"{label}: derived implementation status does not match "
                    "the current decisions."
                )

        if status == "UNRESOLVED":
            errors.append(f"{label}: category is not marked complete.")

    return errors


def save_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_bytes(canonical_json_bytes(value) + b"\n")
    temporary.replace(path)


def safe_relative_path(base: Path, relative: str) -> Path:
    candidate = (base / relative).resolve()
    resolved_base = base.resolve()
    try:
        candidate.relative_to(resolved_base)
    except ValueError as exc:
        raise DecisionToolError("Path traversal outside the local data root is blocked.") from exc
    return candidate


def registered_preview_root(runtime_root: Path, decision_set_id: str) -> Path:
    return safe_relative_path(
        runtime_root.resolve(),
        f"previews/registered/{decision_set_id}",
    )


def require_path_inside(root: Path, path: Path, message: str) -> Path:
    resolved_root = root.resolve()
    resolved_path = path.resolve()
    try:
        resolved_path.relative_to(resolved_root)
    except ValueError as exc:
        raise DecisionToolError(message) from exc
    return resolved_path


def detect_image_type(path: Path) -> str:
    if path.suffix.lower() not in SUPPORTED_IMAGE_SUFFIXES:
        raise DecisionToolError("Unsupported preview file extension.")
    mime_type, _ = mimetypes.guess_type(path.name)
    if mime_type not in SUPPORTED_IMAGE_MIME_TYPES:
        raise DecisionToolError("Unsupported preview MIME type.")
    return mime_type


def image_dimensions(path: Path) -> tuple[int, int]:
    if path.stat().st_size > MAX_PREVIEW_BYTES:
        raise DecisionToolError(
            f"Preview exceeds the {MAX_PREVIEW_BYTES // (1024 * 1024)} MB V1 limit."
        )
    with path.open("rb") as stream:
        header = stream.read(32)
        if header.startswith(b"\x89PNG\r\n\x1a\n") and len(header) >= 24:
            width, height = struct.unpack(">II", header[16:24])
        elif header[:6] in (b"GIF87a", b"GIF89a") and len(header) >= 10:
            width, height = struct.unpack("<HH", header[6:10])
        elif header.startswith(b"BM") and len(header) >= 26:
            width, height = struct.unpack("<II", header[18:26])
        elif header.startswith(b"\xff\xd8"):
            stream.seek(2)
            width = height = 0
            frame_markers = {
                0xC0,
                0xC1,
                0xC2,
                0xC3,
                0xC5,
                0xC6,
                0xC7,
                0xC9,
                0xCA,
                0xCB,
                0xCD,
                0xCE,
                0xCF,
            }
            while True:
                marker_start = stream.read(1)
                if not marker_start:
                    break
                if marker_start != b"\xff":
                    continue
                marker = stream.read(1)
                while marker == b"\xff":
                    marker = stream.read(1)
                if not marker:
                    break
                marker_value = marker[0]
                if marker_value in (0xD8, 0xD9):
                    continue
                length_data = stream.read(2)
                if len(length_data) != 2:
                    break
                segment_length = int.from_bytes(length_data, "big")
                if marker_value in frame_markers:
                    payload = stream.read(segment_length - 2)
                    if len(payload) >= 5:
                        height = int.from_bytes(payload[1:3], "big")
                        width = int.from_bytes(payload[3:5], "big")
                    break
                stream.seek(max(0, segment_length - 2), 1)
            if not width or not height:
                raise DecisionToolError("JPEG dimensions could not be verified.")
        else:
            raise DecisionToolError(
                "Preview file signature does not match a supported image type."
            )
    if (
        width < 1
        or height < 1
        or width > MAX_PREVIEW_DIMENSION
        or height > MAX_PREVIEW_DIMENSION
    ):
        raise DecisionToolError("Preview dimensions are outside the supported V1 range.")
    return width, height


def inspect_image(path: Path) -> tuple[str, int, int]:
    mime_type = detect_image_type(path)
    width, height = image_dimensions(path)
    with path.open("rb") as stream:
        signature = stream.read(8)
    signature_mime = (
        "image/png"
        if signature == b"\x89PNG\r\n\x1a\n"
        else "image/jpeg"
        if signature[:2] == b"\xff\xd8"
        else "image/gif"
        if signature[:6] in (b"GIF87a", b"GIF89a")
        else "image/bmp"
        if signature[:2] == b"BM"
        else ""
    )
    if signature_mime != mime_type:
        raise DecisionToolError("Preview extension does not match its file signature.")
    return mime_type, width, height


def load_registration(
    runtime_root: Path,
    decision_set_id: str,
    source_package_hash: str,
) -> dict[str, Any]:
    registration_path = safe_relative_path(
        runtime_root, f"preview-registrations/{decision_set_id}.json"
    )
    if not registration_path.is_file():
        return {"previews": {}}
    try:
        data = json.loads(registration_path.read_text(encoding="utf-8-sig"))
    except (OSError, json.JSONDecodeError, UnicodeError) as exc:
        raise DecisionToolError(f"Preview registration is invalid: {exc}") from exc
    previews = data.get("previews")
    if data.get("registrationSchemaVersion") != "1.0":
        raise DecisionToolError("Preview registration schema version is unsupported.")
    if data.get("decisionSetId") != decision_set_id:
        raise DecisionToolError("Preview registration decisionSetId does not match.")
    if data.get("sourcePackageHash") != source_package_hash:
        raise DecisionToolError(
            "Preview registration belongs to different package bytes. Register again."
        )
    if not isinstance(previews, dict):
        raise DecisionToolError("Preview registration must contain a previews object.")
    return data


def resolve_preview(
    package: dict[str, Any],
    package_hash: str,
    runtime_root: Path,
    preview_id: str,
) -> tuple[Path, str]:
    preview: dict[str, Any] | None = None
    for category in package["categories"]:
        for option in category["options"]:
            for candidate in option.get("previewAssets", []):
                if candidate["id"] == preview_id:
                    preview = candidate
                    break
    if preview is None:
        raise DecisionToolError("Unknown preview identifier.")

    registration = load_registration(
        runtime_root, package["decisionSetId"], package_hash
    )
    registered = registration.get("previews", {}).get(preview_id)
    package_relative_expected_hash: str | None = None
    if isinstance(registered, dict) and isinstance(registered.get("path"), str):
        path = Path(registered["path"])
        if not path.is_absolute():
            raise DecisionToolError("Registered preview path must be absolute.")
        path = require_path_inside(
            registered_preview_root(runtime_root, package["decisionSetId"]),
            path,
            (
                "Registered preview is outside the approved local preview root. "
                "Register it again so the tool can create an approved local copy."
            ),
        )
        if not path.is_file():
            raise DecisionToolError(
                "Registered preview is missing from its local path. Register it again."
            )
        expected_hash = registered.get("sha256")
        if (
            not isinstance(expected_hash, str)
            or re.fullmatch(r"[A-Fa-f0-9]{64}", expected_hash) is None
        ):
            raise DecisionToolError("Registered preview requires a valid SHA-256.")
        if sha256_file(path) != expected_hash.upper():
            raise DecisionToolError("Registered preview hash no longer matches.")
        mime_type, width, height = inspect_image(path)
        if registered.get("mimeType") != mime_type:
            raise DecisionToolError("Registered preview MIME metadata does not match.")
        if registered.get("width") != width or registered.get("height") != height:
            raise DecisionToolError(
                "Registered preview dimension metadata does not match."
            )
    else:
        expected_hash = preview.get("expectedSha256")
        if (
            not isinstance(expected_hash, str)
            or re.fullmatch(r"[A-Fa-f0-9]{64}", expected_hash) is None
        ):
            raise DecisionToolError(
                "Preview is not registered for the active package. Run the guided "
                "local preview registration."
            )
        path_value = preview["path"]
        if _is_external_reference(path_value) or Path(path_value).is_absolute():
            raise DecisionToolError(
                "Preview reference is not an approved local relative path."
            )
        path = safe_relative_path(runtime_root, path_value)
        path = require_path_inside(
            safe_relative_path(runtime_root, "previews"),
            path,
            (
                "Package preview is outside the approved local previews root. "
                "The file was not loaded."
            ),
        )
        package_relative_expected_hash = expected_hash.upper()

    if not path.is_file():
        raise DecisionToolError(
            "Preview is not available locally. Generate or prepare it, then run "
            "Register-Previews.cmd with a text-only registration manifest."
        )
    mime_type, _, _ = inspect_image(path)
    if (
        package_relative_expected_hash is not None
        and sha256_file(path) != package_relative_expected_hash
    ):
        raise DecisionToolError(
            "Package-relative preview SHA-256 does not match expectedSha256. "
            "The file was not served."
        )
    return path, mime_type


def _result_categories(
    package: dict[str, Any], draft: dict[str, Any]
) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    for category in package["categories"]:
        state = draft["categories"][category["id"]]
        option_results: list[dict[str, Any]] = []
        for option in category["options"]:
            option_state = state["optionStates"][option["id"]]
            option_results.append(
                {
                    "optionId": option["id"],
                    "label": option["label"],
                    "decision": option_state["decision"],
                    "rank": option_state.get("rank"),
                    "humanComment": option_state.get("comment", ""),
                    "technicalMetadata": option.get("technicalMetadata", {}),
                    "implementationMetadata": option.get(
                        "implementationMetadata", {}
                    ),
                }
            )
        selected_ids = [
            item["optionId"]
            for item in option_results
            if item["decision"] == "SELECT"
        ]
        output.append(
            {
                "categoryId": category["id"],
                "title": category["title"],
                "selectionMode": category["selectionMode"],
                "categoryStatus": state["status"],
                "selectedOptionIds": selected_ids,
                "categoryComment": state.get("categoryComment", ""),
                "implementationNote": state.get("implementationNote", ""),
                "exceptionOrConcern": state.get("exceptionOrConcern", ""),
                "notApplicableReason": state.get("notApplicableReason", ""),
                "implementationFields": state.get("fields", {}),
                "options": option_results,
            }
        )
    return output


def create_result(
    package: dict[str, Any],
    package_hash: str,
    draft: Any,
) -> dict[str, Any]:
    normalised = normalise_draft(package, draft)
    errors = validate_draft(package, normalised, final=True)
    if errors:
        raise ValidationError(errors)
    result: dict[str, Any] = {
        "schemaVersion": RESULT_SCHEMA_VERSION,
        "packageSchemaVersion": package["schemaVersion"],
        "decisionSetId": package["decisionSetId"],
        "sourcePackageHash": package_hash,
        "title": package["title"],
        "project": package["project"],
        "stage": package["stage"],
        "sourceContext": package.get("sourceContext", {}),
        "human": {
            "identifier": normalised["humanIdentifier"].strip(),
            "decisionDateTime": normalised["decisionDateTime"].strip(),
            "attestation": True,
        },
        "categories": _result_categories(package, normalised),
        "finalStatus": "FINAL",
    }
    export_errors = validate_text_only_export(result)
    if export_errors:
        raise ValidationError(export_errors)
    result["resultHash"] = sha256_bytes(canonical_json_bytes(result))
    result_errors = validate_result_against_package(
        result,
        package,
        package_hash,
    )
    if result_errors:
        raise ValidationError(result_errors)
    return result


def validate_result(result: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(result, dict):
        return ["Decision result must be a JSON object."]
    required = {
        "schemaVersion",
        "packageSchemaVersion",
        "decisionSetId",
        "sourcePackageHash",
        "title",
        "project",
        "stage",
        "sourceContext",
        "human",
        "categories",
        "finalStatus",
        "resultHash",
    }
    _reject_unexpected_keys(result, required, "result", errors)
    for key in sorted(required - set(result)):
        errors.append(f"Decision result is missing {key}.")
    if result.get("schemaVersion") != RESULT_SCHEMA_VERSION:
        errors.append("Decision result schemaVersion is unsupported.")
    if result.get("packageSchemaVersion") != PACKAGE_SCHEMA_VERSION:
        errors.append("Decision result packageSchemaVersion is unsupported.")
    _safe_identifier(result.get("decisionSetId"), "result.decisionSetId", errors, storage=True)
    if re.fullmatch(r"[A-Fa-f0-9]{64}", str(result.get("sourcePackageHash", ""))) is None:
        errors.append("result.sourcePackageHash must be a 64-character SHA-256.")
    for key in ("title", "project", "stage"):
        _required_text(result.get(key), f"result.{key}", errors)
    if not isinstance(result.get("sourceContext"), dict):
        errors.append("result.sourceContext must be an object.")
    if result.get("finalStatus") != "FINAL":
        errors.append("result.finalStatus must be FINAL.")
    human = result.get("human")
    if not isinstance(human, dict):
        errors.append("result.human must be an object.")
    else:
        _reject_unexpected_keys(
            human,
            {"identifier", "decisionDateTime", "attestation"},
            "result.human",
            errors,
        )
        _required_text(human.get("identifier"), "result.human.identifier", errors)
        _required_text(
            human.get("decisionDateTime"), "result.human.decisionDateTime", errors
        )
        date_error = _unambiguous_datetime_error(human.get("decisionDateTime"))
        if date_error:
            errors.append(f"result.human.decisionDateTime {date_error}")
        if human.get("attestation") is not True:
            errors.append("result.human.attestation must be true.")
    categories = result.get("categories")
    if not isinstance(categories, list) or not categories:
        errors.append("result.categories must be a non-empty array.")
    else:
        category_ids: set[str] = set()
        for index, category in enumerate(categories):
            prefix = f"result.categories[{index}]"
            if not isinstance(category, dict):
                errors.append(f"{prefix} must be an object.")
                continue
            category_keys = {
                "categoryId",
                "title",
                "selectionMode",
                "categoryStatus",
                "selectedOptionIds",
                "categoryComment",
                "implementationNote",
                "exceptionOrConcern",
                "notApplicableReason",
                "implementationFields",
                "options",
            }
            _reject_unexpected_keys(category, category_keys, prefix, errors)
            for key in sorted(category_keys - set(category)):
                errors.append(f"{prefix} is missing {key}.")
            category_id = category.get("categoryId")
            _safe_identifier(category_id, f"{prefix}.categoryId", errors)
            if isinstance(category_id, str):
                if category_id in category_ids:
                    errors.append(f"Duplicate result categoryId: {category_id}.")
                category_ids.add(category_id)
            _required_text(category.get("title"), f"{prefix}.title", errors)
            if category.get("selectionMode") not in SUPPORTED_SELECTION_MODES:
                errors.append(f"{prefix}.selectionMode is unsupported.")
            category_status = category.get("categoryStatus")
            if (
                not isinstance(category_status, str)
                or category_status not in CATEGORY_STATES - {"UNRESOLVED"}
            ):
                errors.append(f"{prefix}.categoryStatus is not final.")
            selected_ids = category.get("selectedOptionIds")
            if not isinstance(selected_ids, list):
                errors.append(f"{prefix}.selectedOptionIds must be an array.")
                selected_ids = []
            else:
                for selected_index, selected_id in enumerate(selected_ids):
                    _safe_identifier(
                        selected_id,
                        f"{prefix}.selectedOptionIds[{selected_index}]",
                        errors,
                    )
                string_selected_ids = [
                    item for item in selected_ids if isinstance(item, str)
                ]
                if len(string_selected_ids) != len(set(string_selected_ids)):
                    errors.append(f"{prefix}.selectedOptionIds must be unique.")
            for text_key in (
                "categoryComment",
                "implementationNote",
                "exceptionOrConcern",
                "notApplicableReason",
            ):
                if not isinstance(category.get(text_key), str):
                    errors.append(f"{prefix}.{text_key} must be text.")
            not_applicable_reason = category.get("notApplicableReason")
            if category_status == "NOT_APPLICABLE":
                if not isinstance(not_applicable_reason, str) or not not_applicable_reason.strip():
                    errors.append(
                        f"{prefix}.notApplicableReason is required for NOT_APPLICABLE."
                    )
            elif isinstance(not_applicable_reason, str) and not_applicable_reason.strip():
                errors.append(
                    f"{prefix}.notApplicableReason must be empty unless categoryStatus "
                    "is NOT_APPLICABLE."
                )
            options = category.get("options")
            if not isinstance(options, list) or not options:
                errors.append(f"{prefix}.options must be a non-empty array.")
                options = []
            option_ids: set[str] = set()
            selected_from_options: list[str] = []
            for option_index, option in enumerate(options):
                option_prefix = f"{prefix}.options[{option_index}]"
                if not isinstance(option, dict):
                    errors.append(f"{option_prefix} must be an object.")
                    continue
                option_keys = {
                    "optionId",
                    "label",
                    "decision",
                    "rank",
                    "humanComment",
                    "technicalMetadata",
                    "implementationMetadata",
                }
                _reject_unexpected_keys(option, option_keys, option_prefix, errors)
                for key in sorted(option_keys - set(option)):
                    errors.append(f"{option_prefix} is missing {key}.")
                option_id = option.get("optionId")
                _safe_identifier(option_id, f"{option_prefix}.optionId", errors)
                if isinstance(option_id, str):
                    if option_id in option_ids:
                        errors.append(f"{option_prefix}.optionId is duplicated.")
                    option_ids.add(option_id)
                _required_text(option.get("label"), f"{option_prefix}.label", errors)
                if option.get("decision") not in DECISION_STATES:
                    errors.append(f"{option_prefix}.decision is unsupported.")
                elif option.get("decision") == "SELECT" and isinstance(option_id, str):
                    selected_from_options.append(option_id)
                rank = option.get("rank")
                if rank is not None and (
                    not isinstance(rank, int) or isinstance(rank, bool) or rank < 1
                ):
                    errors.append(f"{option_prefix}.rank must be null or a positive integer.")
                if not isinstance(option.get("humanComment"), str):
                    errors.append(f"{option_prefix}.humanComment must be text.")
                for metadata_key in ("technicalMetadata", "implementationMetadata"):
                    if not isinstance(option.get(metadata_key), dict):
                        errors.append(f"{option_prefix}.{metadata_key} must be an object.")
            if isinstance(selected_ids, list) and selected_ids != selected_from_options:
                errors.append(
                    f"{prefix}.selectedOptionIds must match SELECT option decisions in package order."
                )
            is_non_decision_status = (
                isinstance(category_status, str)
                and category_status in {"DEFERRED", "NOT_APPLICABLE"}
            )
            if is_non_decision_status and selected_from_options:
                errors.append(
                    f"{prefix} cannot retain selected options when {category_status}."
                )
            if is_non_decision_status and any(
                isinstance(option, dict)
                and option.get("decision") != "UNRESOLVED"
                for option in options
            ):
                errors.append(
                    f"{prefix} cannot retain option decisions when {category_status}."
                )
            implementation_fields = category.get("implementationFields")
            if not isinstance(implementation_fields, dict):
                errors.append(f"{prefix}.implementationFields must be an object.")
            else:
                for field_id in implementation_fields:
                    _safe_identifier(
                        field_id,
                        f"{prefix}.implementationFields key",
                        errors,
                    )
                    field_value = implementation_fields[field_id]
                    if (
                        not isinstance(field_value, (str, int, float))
                        or isinstance(field_value, bool)
                        or (
                            isinstance(field_value, (int, float))
                            and not math.isfinite(field_value)
                        )
                    ):
                        errors.append(
                            f"{prefix}.implementationFields.{field_id} must be "
                            "text or a finite number."
                        )
                if is_non_decision_status and any(
                    not _is_blank(field_value)
                    for field_value in implementation_fields.values()
                ):
                    errors.append(
                        f"{prefix}.implementationFields must be empty when "
                        f"{category_status}."
                    )
    errors.extend(validate_text_only_export(result))
    if not isinstance(result.get("resultHash"), str) or re.fullmatch(
        r"[A-Fa-f0-9]{64}", str(result.get("resultHash", ""))
    ) is None:
        errors.append("result.resultHash must be a 64-character SHA-256.")
    return errors


def validate_result_against_package(
    result: Any,
    package: dict[str, Any],
    package_hash: str,
) -> list[str]:
    errors = list(validate_result(result))
    if not isinstance(result, dict):
        return errors

    if result.get("decisionSetId") != package.get("decisionSetId"):
        errors.append("Completed result decisionSetId does not match the active package.")
    if result.get("sourcePackageHash") != package_hash:
        errors.append(
            "Completed result sourcePackageHash does not match the active package bytes."
        )
    if result.get("packageSchemaVersion") != package.get("schemaVersion"):
        errors.append(
            "Completed result packageSchemaVersion is incompatible with the active package."
        )
    for key in ("title", "project", "stage", "sourceContext"):
        if result.get(key) != package.get(key, {} if key == "sourceContext" else None):
            errors.append(
                f"Completed result {key} does not match the active package."
            )

    result_categories = result.get("categories")
    if not isinstance(result_categories, list):
        return list(dict.fromkeys(errors))
    package_categories = package.get("categories")
    if not isinstance(package_categories, list):
        errors.append("Active package categories are invalid.")
        return list(dict.fromkeys(errors))

    expected_category_ids = [category["id"] for category in package_categories]
    actual_category_ids = [
        category.get("categoryId") if isinstance(category, dict) else None
        for category in result_categories
    ]
    if actual_category_ids != expected_category_ids:
        errors.append(
            "Completed result categories must match the active package exactly "
            "and in package order."
        )

    result_by_id: dict[str, dict[str, Any]] = {}
    for category in result_categories:
        if not isinstance(category, dict):
            continue
        category_id = category.get("categoryId")
        if isinstance(category_id, str) and category_id not in result_by_id:
            result_by_id[category_id] = category

    draft = create_empty_draft(package)
    human = result.get("human")
    if isinstance(human, dict):
        draft["humanIdentifier"] = human.get("identifier")
        draft["decisionDateTime"] = human.get("decisionDateTime")
        draft["humanAttestation"] = human.get("attestation")
    draft["finalConfirmation"] = True
    can_validate_draft = actual_category_ids == expected_category_ids

    for package_category in package_categories:
        category_id = package_category["id"]
        result_category = result_by_id.get(category_id)
        if not isinstance(result_category, dict):
            can_validate_draft = False
            continue
        category_path = f"Completed result category {category_id!r}"
        if result_category.get("title") != package_category.get("title"):
            errors.append(f"{category_path} title does not match the active package.")
        if result_category.get("selectionMode") != package_category.get(
            "selectionMode"
        ):
            errors.append(
                f"{category_path} selectionMode does not match the active package."
            )

        package_options = package_category.get("options", [])
        result_options = result_category.get("options")
        expected_option_ids = [option["id"] for option in package_options]
        actual_option_ids = (
            [
                option.get("optionId") if isinstance(option, dict) else None
                for option in result_options
            ]
            if isinstance(result_options, list)
            else []
        )
        if actual_option_ids != expected_option_ids:
            errors.append(
                f"{category_path} options must match the active package exactly "
                "and in package order."
            )
            can_validate_draft = False
        option_by_id = {
            option.get("optionId"): option
            for option in result_options or []
            if isinstance(option, dict) and isinstance(option.get("optionId"), str)
        }
        for package_option in package_options:
            option_id = package_option["id"]
            result_option = option_by_id.get(option_id)
            if not isinstance(result_option, dict):
                continue
            option_path = f"{category_path} option {option_id!r}"
            if result_option.get("label") != package_option.get("label"):
                errors.append(f"{option_path} label does not match the active package.")
            for metadata_key in ("technicalMetadata", "implementationMetadata"):
                if result_option.get(metadata_key) != package_option.get(
                    metadata_key, {}
                ):
                    errors.append(
                        f"{option_path} {metadata_key} does not match the active package."
                    )

        package_fields = {
            field["id"]: field
            for field in package_category.get("implementationFields", [])
        }
        result_fields = result_category.get("implementationFields")
        actual_field_ids = (
            set(result_fields) if isinstance(result_fields, dict) else set()
        )
        if actual_field_ids != set(package_fields):
            errors.append(
                f"{category_path} implementation-field IDs must match the active "
                "package exactly."
            )
            can_validate_draft = False

        if not can_validate_draft:
            continue
        state = draft["categories"][category_id]
        state["status"] = result_category.get("categoryStatus")
        state["categoryComment"] = result_category.get("categoryComment")
        state["implementationNote"] = result_category.get("implementationNote")
        state["exceptionOrConcern"] = result_category.get("exceptionOrConcern")
        state["notApplicableReason"] = result_category.get("notApplicableReason")
        state["fields"] = deepcopy(result_fields)
        for option_id in expected_option_ids:
            result_option = option_by_id[option_id]
            state["optionStates"][option_id] = {
                "decision": result_option.get("decision"),
                "comment": result_option.get("humanComment"),
                "rank": result_option.get("rank"),
            }

    if can_validate_draft:
        for draft_error in validate_draft(package, draft, final=True):
            errors.append(f"Active package contract: {draft_error}")
    return list(dict.fromkeys(errors))


def verify_result_hash(result: dict[str, Any]) -> bool:
    expected = result.get("resultHash")
    if not isinstance(expected, str):
        return False
    unsigned = deepcopy(result)
    unsigned.pop("resultHash", None)
    return sha256_bytes(canonical_json_bytes(unsigned)) == expected.upper()


def markdown_text(value: Any) -> str:
    text = str(value if value is not None else "")
    for character in ("\\", "`", "*", "_", "{", "}", "[", "]", "<", ">", "#", "|"):
        text = text.replace(character, f"\\{character}")
    return text.replace("\r", " ").replace("\n", "<br>")


def markdown_code(value: Any) -> str:
    return str(value if value is not None else "").replace("`", "'")


def result_markdown(result: dict[str, Any]) -> str:
    lines = [
        f"# {markdown_text(result['title'])} — Final Human Decision",
        "",
        f"- Decision set: `{markdown_code(result['decisionSetId'])}`",
        f"- Project: `{markdown_code(result['project'])}`",
        f"- Stage: `{markdown_code(result['stage'])}`",
        f"- Human: `{markdown_code(result['human']['identifier'])}`",
        f"- Decision date/time: `{markdown_code(result['human']['decisionDateTime'])}`",
        f"- Source package SHA-256: `{markdown_code(result['sourcePackageHash'])}`",
        f"- Result SHA-256: `{markdown_code(result['resultHash'])}`",
        f"- Final status: `{markdown_code(result['finalStatus'])}`",
        "",
        "This summary contains text metadata only. The JSON result is authoritative.",
        "",
    ]
    for category in result["categories"]:
        lines.extend(
            [
                f"## {markdown_text(category['title'])}",
                "",
                f"- Status: `{markdown_code(category['categoryStatus'])}`",
                "- Selected option IDs: "
                + (
                    ", ".join(
                        f"`{markdown_code(item)}`"
                        for item in category["selectedOptionIds"]
                    )
                    if category["selectedOptionIds"]
                    else "`NONE`"
                ),
                f"- Category comment: {markdown_text(category['categoryComment'] or 'NONE')}",
                f"- Implementation note: {markdown_text(category['implementationNote'] or 'NONE')}",
                f"- Exception or concern: {markdown_text(category['exceptionOrConcern'] or 'NONE')}",
                f"- Not-applicable reason: {markdown_text(category['notApplicableReason'] or 'NONE')}",
                "",
                "Implementation fields:",
                "",
            ]
        )
        if category["implementationFields"]:
            for key, value in category["implementationFields"].items():
                lines.append(
                    f"- `{markdown_code(key)}`: {markdown_text(value)}"
                )
        else:
            lines.append("- `NONE`")
        lines.extend(["", "Option decisions:", ""])
        for option in category["options"]:
            rank = (
                f", rank {option['rank']}" if option.get("rank") is not None else ""
            )
            lines.append(
                f"- `{markdown_code(option['optionId'])}`: "
                f"`{markdown_code(option['decision'])}`{rank}; "
                f"comment: {markdown_text(option['humanComment'] or 'NONE')}"
            )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def safe_result_stem(result: dict[str, Any]) -> str:
    decision_id = re.sub(r"[^A-Za-z0-9._-]+", "-", result["decisionSetId"]).strip("-")
    timestamp = re.sub(
        r"[^0-9A-Za-z]+", "-", result["human"]["decisionDateTime"]
    ).strip("-")
    return f"{decision_id}__{timestamp}__{result['resultHash'][:12]}"


def write_result(
    package: dict[str, Any],
    runtime_root: Path,
    result: dict[str, Any],
) -> tuple[Path, Path]:
    errors = validate_result(result)
    if errors or not verify_result_hash(result):
        raise ValidationError(errors or ["Decision result hash is invalid."])
    relative_directory = package.get("outputConfiguration", {}).get(
        "resultDirectory", "results"
    )
    result_directory = safe_relative_path(runtime_root, relative_directory)
    result_directory.mkdir(parents=True, exist_ok=True)
    stem = safe_result_stem(result)
    json_path = result_directory / f"{stem}.json"
    markdown_path = result_directory / f"{stem}.md"
    json_bytes = canonical_json_bytes(result) + b"\n"
    markdown = result_markdown(result)
    json_temporary = json_path.with_suffix(".json.tmp")
    markdown_temporary = markdown_path.with_suffix(".md.tmp")
    json_existed = json_path.exists()
    try:
        json_temporary.write_bytes(json_bytes)
        markdown_temporary.write_text(markdown, encoding="utf-8", newline="\n")
        if json_existed and json_path.read_bytes() != json_bytes:
            raise DecisionToolError(
                "A different result already uses the target JSON path."
            )
        if (
            markdown_path.exists()
            and markdown_path.read_text(encoding="utf-8") != markdown
        ):
            raise DecisionToolError(
                "A different result already uses the target Markdown path."
            )
        json_temporary.replace(json_path)
        try:
            markdown_temporary.replace(markdown_path)
        except OSError:
            if not json_existed:
                json_path.unlink(missing_ok=True)
            raise
    finally:
        json_temporary.unlink(missing_ok=True)
        markdown_temporary.unlink(missing_ok=True)
    return json_path, markdown_path
