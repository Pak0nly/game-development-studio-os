from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
from pathlib import Path

from decision_tool import (
    DecisionToolError,
    inspect_image,
    load_package,
    safe_relative_path,
    sha256_file,
)
from register_previews import register_entries


TOOL_ROOT = Path(__file__).resolve().parent
REPOSITORY_ROOT = TOOL_ROOT.parents[1]
DEFAULT_PROJECT = (
    REPOSITORY_ROOT
    / "Projects"
    / "Crime99AssetStylePreflight"
    / "Source"
    / "Crime99AssetStylePreflight"
)
DEFAULT_UNITY = Path(
    r"C:\Program Files\Unity\Hub\Editor\6000.3.19f1\Editor\Unity.exe"
)
GENERATOR_SOURCE = (
    TOOL_ROOT / "UnityAutomation" / "HvdtPreparedPreviewGenerator.cs"
)
TEMP_GENERATOR_RELATIVE = Path("Assets/Editor/HvdtPreparedPreviewGenerator.cs")


def package_preview_ids(package: dict) -> list[str]:
    preview_ids: list[str] = []
    for category in package["categories"]:
        for option in category["options"]:
            for preview in option.get("previewAssets", []):
                preview_ids.append(preview["id"])
    return preview_ids


def prepared_root(runtime_root: Path, decision_set_id: str) -> Path:
    return safe_relative_path(
        runtime_root,
        f"prepared-previews/{decision_set_id}",
    )


def load_prepared_manifest(
    package: dict,
    runtime_root: Path,
) -> tuple[Path, list[dict]]:
    root = prepared_root(runtime_root, package["decisionSetId"])
    manifest_path = root / "prepared-preview-manifest.json"
    if not manifest_path.is_file():
        raise DecisionToolError(
            "The prepared Crime99 preview set is missing. "
            "Run Prepare-Crime99-Previews.cmd as an advanced maintenance task."
        )
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise DecisionToolError(
            f"Prepared preview manifest is unreadable: {exc}"
        ) from exc
    if manifest.get("schemaVersion") != "1.0":
        raise DecisionToolError("Prepared preview manifest schema is unsupported.")
    records = manifest.get("previews")
    if not isinstance(records, list) or not records:
        raise DecisionToolError("Prepared preview manifest has no preview records.")

    expected_ids = package_preview_ids(package)
    records_by_id: dict[str, dict] = {}
    for record in records:
        if not isinstance(record, dict):
            raise DecisionToolError("Prepared preview record must be an object.")
        preview_id = record.get("previewId")
        if not isinstance(preview_id, str) or preview_id in records_by_id:
            raise DecisionToolError(
                "Prepared preview IDs must be non-empty and unique."
            )
        records_by_id[preview_id] = record

    missing = [preview_id for preview_id in expected_ids if preview_id not in records_by_id]
    extra = [preview_id for preview_id in records_by_id if preview_id not in expected_ids]
    if missing or extra:
        details = []
        if missing:
            details.append(f"missing: {', '.join(missing)}")
        if extra:
            details.append(f"unexpected: {', '.join(extra)}")
        raise DecisionToolError(
            "Prepared preview manifest does not match the active package ("
            + "; ".join(details)
            + ")."
        )

    entries: list[dict] = []
    for preview_id in expected_ids:
        record = records_by_id[preview_id]
        file_name = record.get("fileName")
        if (
            not isinstance(file_name, str)
            or not file_name
            or Path(file_name).name != file_name
        ):
            raise DecisionToolError(
                f"{preview_id}: prepared preview fileName must be a plain file name."
            )
        path = (root / file_name).resolve()
        try:
            path.relative_to(root.resolve())
        except ValueError as exc:
            raise DecisionToolError(
                f"{preview_id}: prepared preview is outside its local root."
            ) from exc
        _mime_type, width, height = inspect_image(path)
        actual_hash = sha256_file(path)
        if actual_hash != record.get("sha256"):
            raise DecisionToolError(
                f"{preview_id}: prepared preview SHA-256 no longer matches."
            )
        if width != record.get("width") or height != record.get("height"):
            raise DecisionToolError(
                f"{preview_id}: prepared preview dimensions no longer match."
            )
        if path.stat().st_size != record.get("byteSize"):
            raise DecisionToolError(
                f"{preview_id}: prepared preview byte size no longer matches."
            )
        entries.append(
            {
                "previewId": preview_id,
                "path": str(path),
                "expectedSha256": actual_hash,
            }
        )
    return manifest_path, entries


def register_existing(package_path: Path, runtime_root: Path) -> Path:
    package, package_hash = load_package(package_path)
    _manifest_path, entries = load_prepared_manifest(package, runtime_root)
    registration_path = register_entries(
        package,
        package_hash,
        entries,
        runtime_root,
    )
    return registration_path


def render_previews(
    unity_path: Path,
    project_path: Path,
    package_path: Path,
    runtime_root: Path,
) -> Path:
    if not unity_path.is_file():
        raise DecisionToolError(f"Unity executable not found: {unity_path}")
    if not (project_path / "Assets").is_dir():
        raise DecisionToolError(f"Unity project Assets folder not found: {project_path}")
    if not GENERATOR_SOURCE.is_file():
        raise DecisionToolError(
            f"Prepared preview generator source not found: {GENERATOR_SOURCE}"
        )
    lock_file = project_path / "Temp" / "UnityLockfile"
    if lock_file.exists():
        raise DecisionToolError(
            "The Crime99 Unity project appears to be open. Close Unity before "
            "preparing the isolated preview set."
        )

    package, _package_hash = load_package(package_path)
    output_root = prepared_root(runtime_root, package["decisionSetId"])
    output_root.mkdir(parents=True, exist_ok=True)
    temporary_generator = project_path / TEMP_GENERATOR_RELATIVE
    temporary_meta = Path(str(temporary_generator) + ".meta")
    if temporary_generator.exists() or temporary_meta.exists():
        raise DecisionToolError(
            "Temporary HVDT Unity generator path is already occupied."
        )
    temporary_generator.parent.mkdir(parents=True, exist_ok=True)
    log_path = output_root / "unity-prepared-preview-generation.log"

    environment = os.environ.copy()
    environment["HVDT_PREVIEW_OUTPUT"] = str(output_root.resolve())
    command = [
        str(unity_path),
        "-batchmode",
        "-quit",
        "-force-d3d11",
        "-projectPath",
        str(project_path.resolve()),
        "-executeMethod",
        "HvdtPreparedPreviewGenerator.Run",
        "-logFile",
        str(log_path.resolve()),
    ]
    try:
        shutil.copyfile(GENERATOR_SOURCE, temporary_generator)
        completed = subprocess.run(
            command,
            env=environment,
            check=False,
        )
    finally:
        temporary_generator.unlink(missing_ok=True)
        temporary_meta.unlink(missing_ok=True)

    if completed.returncode != 0:
        raise DecisionToolError(
            "Unity did not complete the prepared preview render successfully. "
            f"See the local text log: {log_path}"
        )
    manifest_path, entries = load_prepared_manifest(package, runtime_root)
    if len(entries) != len(package_preview_ids(package)):
        raise DecisionToolError("Prepared preview count is incomplete.")
    register_existing(package_path, runtime_root)
    return manifest_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Render or automatically register the deterministic Crime99 Human-only "
            "preview set without visually inspecting it."
        )
    )
    parser.add_argument(
        "--package",
        type=Path,
        default=TOOL_ROOT / "Packages" / "crime99-surface-material-v1.json",
    )
    parser.add_argument(
        "--runtime-data",
        type=Path,
        default=TOOL_ROOT / "RuntimeData",
    )
    parser.add_argument("--unity", type=Path, default=DEFAULT_UNITY)
    parser.add_argument("--project", type=Path, default=DEFAULT_PROJECT)
    parser.add_argument(
        "--register-existing",
        action="store_true",
        help="Verify and register an already prepared local set without Unity.",
    )
    args = parser.parse_args()

    package_path = args.package.resolve()
    runtime_root = args.runtime_data.resolve()
    runtime_root.mkdir(parents=True, exist_ok=True)
    try:
        if args.register_existing:
            registration_path = register_existing(package_path, runtime_root)
            print(f"Prepared Crime99 previews ready: {registration_path}")
        else:
            manifest_path = render_previews(
                args.unity.resolve(),
                args.project.resolve(),
                package_path,
                runtime_root,
            )
            print(f"Prepared Crime99 preview manifest: {manifest_path}")
    except DecisionToolError as exc:
        raise SystemExit(str(exc)) from exc


if __name__ == "__main__":
    main()
