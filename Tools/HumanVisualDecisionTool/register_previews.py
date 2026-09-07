from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from decision_tool import (
    DecisionToolError,
    inspect_image,
    load_package,
    load_registration,
    registered_preview_root,
    require_path_inside,
    safe_relative_path,
    save_json,
    sha256_file,
)


def register_entries(
    package: dict,
    package_hash: str,
    entries: list[dict],
    runtime_data: Path,
) -> Path:
    runtime_root = runtime_data.resolve()
    approved_root = registered_preview_root(
        runtime_root,
        package["decisionSetId"],
    )
    approved_root.mkdir(parents=True, exist_ok=True)
    known_previews = {
        preview["id"]: preview
        for category in package["categories"]
        for option in category["options"]
        for preview in option.get("previewAssets", [])
    }
    registered: dict[str, dict] = dict(
        load_registration(
            runtime_root,
            package["decisionSetId"],
            package_hash,
        ).get("previews", {})
    )
    approved_existing: dict[str, dict] = {}
    for existing_id, metadata in registered.items():
        if (
            existing_id not in known_previews
            or not isinstance(metadata, dict)
            or not isinstance(metadata.get("path"), str)
            or not Path(metadata["path"]).is_absolute()
        ):
            continue
        try:
            require_path_inside(
                approved_root,
                Path(metadata["path"]),
                "Existing preview registration is outside the approved local root.",
            )
        except DecisionToolError:
            continue
        approved_existing[existing_id] = metadata
    registered = approved_existing
    for entry in entries:
        if not isinstance(entry, dict):
            raise DecisionToolError("Each preview registration must be an object.")
        preview_id = entry.get("previewId")
        if preview_id not in known_previews:
            raise DecisionToolError(f"Unknown previewId: {preview_id!r}.")
        path_value = entry.get("path")
        if not isinstance(path_value, str) or not path_value.strip():
            raise DecisionToolError(f"{preview_id}: path is required.")
        path = Path(path_value).resolve()
        if not path.is_file():
            raise DecisionToolError(
                f"{preview_id}: local file does not exist: {path}"
            )
        mime_type, width, height = inspect_image(path)
        actual_hash = sha256_file(path)
        manifest_expected_hash = entry.get("expectedSha256")
        package_expected_hash = known_previews[preview_id].get("expectedSha256")
        for expected_hash, source in (
            (package_expected_hash, "decision package"),
            (manifest_expected_hash, "registration manifest"),
        ):
            if expected_hash is None or expected_hash == "":
                continue
            if (
                not isinstance(expected_hash, str)
                or len(expected_hash) != 64
                or any(character not in "0123456789abcdefABCDEF" for character in expected_hash)
            ):
                raise DecisionToolError(
                    f"{preview_id}: {source} expectedSha256 is invalid."
                )
            if expected_hash.upper() != actual_hash:
                raise DecisionToolError(
                    f"{preview_id}: SHA-256 does not match the {source} expected value."
                )
        approved_path = safe_relative_path(
            approved_root,
            f"{preview_id}{path.suffix.lower()}",
        )
        if path != approved_path:
            temporary = approved_path.with_name(
                f".{approved_path.stem}.tmp{approved_path.suffix}"
            )
            try:
                shutil.copyfile(path, temporary)
                copied_hash = sha256_file(temporary)
                copied_mime, copied_width, copied_height = inspect_image(temporary)
                if (
                    copied_hash != actual_hash
                    or copied_mime != mime_type
                    or copied_width != width
                    or copied_height != height
                ):
                    raise DecisionToolError(
                        f"{preview_id}: approved local copy verification failed."
                    )
                temporary.replace(approved_path)
            except OSError as exc:
                raise DecisionToolError(
                    f"{preview_id}: approved local preview copy failed: {exc}"
                ) from exc
            finally:
                try:
                    temporary.unlink(missing_ok=True)
                except OSError:
                    pass
        elif not approved_path.is_file():
            raise DecisionToolError(
                f"{preview_id}: approved local preview file is missing."
            )
        registered[preview_id] = {
            "path": str(approved_path),
            "sha256": actual_hash,
            "mimeType": mime_type,
            "width": width,
            "height": height,
            "byteLength": approved_path.stat().st_size,
        }

    output = {
        "registrationSchemaVersion": "1.0",
        "decisionSetId": package["decisionSetId"],
        "sourcePackageHash": package_hash,
        "previews": registered,
    }
    output_path = safe_relative_path(
        runtime_root,
        f"preview-registrations/{package['decisionSetId']}.json",
    )
    save_json(output_path, output)
    return output_path


def parse_arguments() -> argparse.Namespace:
    tool_root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description=(
            "Register local Human-only previews without inspecting or interpreting "
            "their visual content."
        )
    )
    parser.add_argument("manifest", type=Path)
    parser.add_argument(
        "--package",
        type=Path,
        default=tool_root / "Packages" / "crime99-surface-material-v1.json",
    )
    parser.add_argument(
        "--runtime-data",
        type=Path,
        default=tool_root / "RuntimeData",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_arguments()
    package, package_hash = load_package(args.package.resolve())
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8-sig"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise SystemExit(f"Could not read registration manifest: {exc}") from exc

    if manifest.get("decisionSetId") != package["decisionSetId"]:
        raise SystemExit("Registration decisionSetId does not match the package.")
    entries = manifest.get("previews")
    if not isinstance(entries, list) or not entries:
        raise SystemExit("Registration manifest previews must be a non-empty array.")

    try:
        output_path = register_entries(
            package, package_hash, entries, args.runtime_data
        )
    except DecisionToolError as exc:
        raise SystemExit(str(exc)) from exc
    print(f"Registered {len(entries)} local preview(s).")
    print(f"Text-only registration: {output_path}")
    print("No visual analysis was performed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
