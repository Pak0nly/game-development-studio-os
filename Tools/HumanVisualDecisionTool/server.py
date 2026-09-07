from __future__ import annotations

import argparse
import json
import signal
import threading
import webbrowser
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from decision_tool import (
    clear_incompatible_not_applicable_reasons,
    DecisionToolError,
    ValidationError,
    create_empty_draft,
    create_result,
    load_package,
    normalise_draft,
    resolve_preview,
    safe_relative_path,
    save_json,
    sha256_bytes,
    validate_draft,
    validate_result,
    validate_result_against_package,
    verify_result_hash,
    write_result,
)


HOST = "127.0.0.1"
DEFAULT_PORT = 8765
MAX_JSON_BODY = 5 * 1024 * 1024
CSP = (
    "default-src 'self'; "
    "base-uri 'none'; "
    "connect-src 'self'; "
    "font-src 'self'; "
    "form-action 'self'; "
    "frame-ancestors 'none'; "
    "img-src 'self'; "
    "object-src 'none'; "
    "script-src 'self'; "
    "style-src 'self'"
)


class DecisionToolApplication:
    def __init__(self, package_path: Path, runtime_root: Path, static_root: Path):
        self.package_path = package_path.resolve()
        self.runtime_root = runtime_root.resolve()
        self.static_root = static_root.resolve()
        self.runtime_root.mkdir(parents=True, exist_ok=True)
        for relative in ("drafts", "results", "previews", "preview-registrations"):
            safe_relative_path(self.runtime_root, relative).mkdir(
                parents=True, exist_ok=True
            )
        self.package, self.package_hash = load_package(self.package_path)
        self.write_lock = threading.Lock()
        self.draft_recovery_required = False
        self.draft_recovery_path: Path | None = None
        self.draft_load_checked = False

    @property
    def decision_set_id(self) -> str:
        return self.package["decisionSetId"]

    @property
    def draft_path(self) -> Path:
        return safe_relative_path(
            self.runtime_root, f"drafts/{self.decision_set_id}.json"
        )

    def _preserve_draft_bytes(self, raw_bytes: bytes) -> Path:
        recovery_path = safe_relative_path(
            self.runtime_root,
            (
                f"drafts/recovery/{self.decision_set_id}__"
                f"{sha256_bytes(raw_bytes)[:16]}.json"
            ),
        )
        recovery_path.parent.mkdir(parents=True, exist_ok=True)
        if not recovery_path.exists():
            recovery_path.write_bytes(raw_bytes)
        return recovery_path

    def load_draft(self) -> tuple[dict, str | None, str | None]:
        self.draft_load_checked = True
        if not self.draft_path.is_file():
            self.draft_recovery_required = False
            self.draft_recovery_path = None
            return create_empty_draft(self.package), None, None
        raw_bytes: bytes | None = None
        try:
            raw_bytes = self.draft_path.read_bytes()
            raw = json.loads(raw_bytes.decode("utf-8-sig"))
            if not isinstance(raw, dict):
                raise ValidationError(["Saved draft must be a JSON object."])
            saved_at = raw.pop("_savedAt", None)
            if saved_at is not None and not isinstance(saved_at, str):
                raise ValidationError(["Saved draft _savedAt must be text."])
            normalised = normalise_draft(self.package, raw)
            cleaned, removed = clear_incompatible_not_applicable_reasons(normalised)
            self.draft_recovery_required = False
            self.draft_recovery_path = None
            if removed:
                recovery_path = self._preserve_draft_bytes(raw_bytes)
                stored = dict(cleaned)
                stored["_savedAt"] = saved_at
                with self.write_lock:
                    save_json(self.draft_path, stored)
                return (
                    cleaned,
                    saved_at,
                    (
                        f"Removed {removed} status-incompatible NOT APPLICABLE "
                        f"reason(s). The original draft is preserved at {recovery_path}."
                    ),
                )
            return normalised, saved_at, None
        except (OSError, UnicodeError, json.JSONDecodeError, DecisionToolError) as exc:
            recovery_path = None
            if raw_bytes is not None:
                try:
                    recovery_path = self._preserve_draft_bytes(raw_bytes)
                except OSError:
                    recovery_path = None
            self.draft_recovery_required = True
            self.draft_recovery_path = recovery_path
            recovery_text = (
                f" A recovery copy is stored at {recovery_path}."
                if recovery_path is not None
                else ""
            )
            return (
                create_empty_draft(self.package),
                None,
                (
                    "The saved draft could not be loaded. Its original file was "
                    f"preserved for recovery at {self.draft_path}.{recovery_text} "
                    "Saving or finalising requires explicit confirmation before "
                    f"the malformed draft is replaced. Details: {exc}"
                ),
            )

    def _require_recovery_confirmation(self, confirmed: bool) -> None:
        if not self.draft_load_checked and self.draft_path.is_file():
            self.load_draft()
        if self.draft_recovery_required and not confirmed:
            raise DecisionToolError(
                "The existing draft is malformed. Explicitly confirm replacement "
                "after reviewing the recovery warning."
            )

    def save_draft(
        self,
        draft: dict,
        saved_at: str,
        confirm_replace_malformed: bool = False,
    ) -> list[str]:
        self._require_recovery_confirmation(confirm_replace_malformed)
        normalised = normalise_draft(self.package, draft)
        validation_errors = validate_draft(self.package, normalised, final=False)
        cleaned, _ = clear_incompatible_not_applicable_reasons(normalised)
        stored = dict(cleaned)
        stored["_savedAt"] = saved_at
        with self.write_lock:
            save_json(self.draft_path, stored)
        self.draft_recovery_required = False
        self.draft_recovery_path = None
        self.draft_load_checked = True
        return validation_errors

    def finalize(
        self,
        draft: dict,
        saved_at: str,
        confirm_replace_malformed: bool = False,
    ) -> tuple[dict, Path, Path]:
        self._require_recovery_confirmation(confirm_replace_malformed)
        result = create_result(self.package, self.package_hash, draft)
        normalised = normalise_draft(self.package, draft)
        stored = dict(normalised)
        stored["_savedAt"] = saved_at
        with self.write_lock:
            save_json(self.draft_path, stored)
            json_path, markdown_path = write_result(
                self.package, self.runtime_root, result
            )
        self.draft_recovery_required = False
        self.draft_recovery_path = None
        self.draft_load_checked = True
        return result, json_path, markdown_path

    def latest_results(self) -> list[dict]:
        relative_directory = self.package.get("outputConfiguration", {}).get(
            "resultDirectory", "results"
        )
        directory = safe_relative_path(self.runtime_root, relative_directory)
        records: list[dict] = []
        for path in sorted(directory.glob("*.json"), reverse=True):
            try:
                value = json.loads(path.read_text(encoding="utf-8-sig"))
                if not isinstance(value, dict):
                    raise ValueError("Completed result must be a JSON object.")
                valid_schema = not validate_result(value)
                hash_valid = valid_schema and verify_result_hash(value)
                package_compatible = (
                    hash_valid
                    and value.get("decisionSetId") == self.decision_set_id
                    and value.get("sourcePackageHash") == self.package_hash
                    and not validate_result_against_package(
                        value,
                        self.package,
                        self.package_hash,
                    )
                )
                human = value.get("human")
                records.append(
                    {
                        "fileName": path.name,
                        "decisionDateTime": (
                            human.get("decisionDateTime")
                            if isinstance(human, dict)
                            else None
                        ),
                        "resultHash": value.get("resultHash"),
                        "hashValid": hash_valid,
                        "packageCompatible": package_compatible,
                    }
                )
            except (OSError, UnicodeError, json.JSONDecodeError, ValueError):
                records.append(
                    {
                        "fileName": path.name,
                        "decisionDateTime": None,
                        "resultHash": None,
                        "hashValid": False,
                        "packageCompatible": False,
                    }
                )
        return records

    def load_result(self, file_name: str) -> dict:
        if (
            not file_name
            or Path(file_name).name != file_name
            or not file_name.lower().endswith(".json")
        ):
            raise DecisionToolError("Result filename is invalid.")
        relative_directory = self.package.get("outputConfiguration", {}).get(
            "resultDirectory", "results"
        )
        directory = safe_relative_path(self.runtime_root, relative_directory)
        path = safe_relative_path(directory, file_name)
        if not path.is_file():
            raise DecisionToolError("Completed result was not found.")
        try:
            value = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            raise DecisionToolError(f"Completed result is unreadable: {exc}") from exc
        errors = validate_result(value)
        if errors or not verify_result_hash(value):
            raise ValidationError(errors or ["Completed result hash is invalid."])
        if value.get("decisionSetId") != self.decision_set_id:
            raise DecisionToolError("Completed result belongs to another decision set.")
        if value.get("sourcePackageHash") != self.package_hash:
            raise DecisionToolError(
                "Completed result belongs to another package revision and is "
                "historical/incompatible with the active package."
            )
        compatibility_errors = validate_result_against_package(
            value,
            self.package,
            self.package_hash,
        )
        if compatibility_errors:
            raise ValidationError(
                [
                    "Completed result is incompatible with the active package. "
                    "The original result file was not changed.",
                    *compatibility_errors,
                ]
            )
        return value


def make_handler(application: DecisionToolApplication):
    class Handler(BaseHTTPRequestHandler):
        server_version = "HumanVisualDecisionTool/1.0"

        def log_message(self, format_string: str, *args) -> None:
            print(
                f"{self.address_string()} - "
                f"{format_string % args}",
                flush=True,
            )

        def _security_headers(self) -> None:
            self.send_header("Content-Security-Policy", CSP)
            self.send_header("Cross-Origin-Opener-Policy", "same-origin")
            self.send_header("Cross-Origin-Resource-Policy", "same-origin")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

        def _request_is_local(self) -> bool:
            host = self.headers.get("Host", "")
            host_name = host.rsplit(":", 1)[0].lower()
            if host_name not in {"127.0.0.1", "localhost"}:
                return False
            origin = self.headers.get("Origin")
            if origin:
                allowed = {
                    f"http://127.0.0.1:{self.server.server_address[1]}",
                    f"http://localhost:{self.server.server_address[1]}",
                }
                if origin.lower() not in allowed:
                    return False
            return True

        def _send_bytes(
            self, status: HTTPStatus, content_type: str, body: bytes
        ) -> None:
            self.send_response(status)
            self._security_headers()
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def _send_json(self, status: HTTPStatus, value) -> None:
            body = json.dumps(
                value,
                ensure_ascii=False,
                sort_keys=True,
                separators=(",", ":"),
            ).encode("utf-8")
            self._send_bytes(status, "application/json; charset=utf-8", body)

        def _read_json(self):
            length_value = self.headers.get("Content-Length")
            try:
                length = int(length_value or "0")
            except ValueError as exc:
                raise DecisionToolError("Invalid Content-Length.") from exc
            if length <= 0 or length > MAX_JSON_BODY:
                raise DecisionToolError("JSON request body size is invalid.")
            content_type = self.headers.get("Content-Type", "")
            if not content_type.lower().startswith("application/json"):
                raise DecisionToolError("Content-Type must be application/json.")
            try:
                return json.loads(self.rfile.read(length).decode("utf-8"))
            except (UnicodeError, json.JSONDecodeError) as exc:
                raise DecisionToolError(f"Invalid JSON request: {exc}") from exc

        def do_GET(self) -> None:
            parsed = urlparse(self.path)
            if not self._request_is_local():
                self._send_json(HTTPStatus.FORBIDDEN, {"error": "Local origin required."})
                return
            try:
                if parsed.path == "/api/health":
                    self._send_json(
                        HTTPStatus.OK,
                        {
                            "status": "ok",
                            "host": HOST,
                            "localOnly": True,
                            "decisionSetId": application.decision_set_id,
                        },
                    )
                    return
                if parsed.path == "/api/package":
                    self._send_json(
                        HTTPStatus.OK,
                        {
                            "package": application.package,
                            "sourcePackageHash": application.package_hash,
                        },
                    )
                    return
                if parsed.path == "/api/draft":
                    draft, saved_at, load_error = application.load_draft()
                    self._send_json(
                        HTTPStatus.OK,
                        {
                            "draft": draft,
                            "lastSavedAt": saved_at,
                            "loadError": load_error,
                            "recoveryRequired": application.draft_recovery_required,
                            "recoveryFile": (
                                str(application.draft_recovery_path)
                                if application.draft_recovery_path is not None
                                else None
                            ),
                        },
                    )
                    return
                if parsed.path == "/api/results":
                    self._send_json(
                        HTTPStatus.OK, {"results": application.latest_results()}
                    )
                    return
                if parsed.path == "/api/result":
                    file_name = parse_qs(parsed.query).get("name", [""])[0]
                    self._send_json(
                        HTTPStatus.OK,
                        {"result": application.load_result(file_name)},
                    )
                    return
                if parsed.path == "/api/preview":
                    preview_id = parse_qs(parsed.query).get("id", [""])[0]
                    path, mime_type = resolve_preview(
                        application.package,
                        application.package_hash,
                        application.runtime_root,
                        preview_id,
                    )
                    self._send_bytes(HTTPStatus.OK, mime_type, path.read_bytes())
                    return
                self._serve_static(parsed.path)
            except DecisionToolError as exc:
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
            except OSError as exc:
                self._send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": f"Local file operation failed: {exc}"},
                )

        def _serve_static(self, request_path: str) -> None:
            relative = "index.html" if request_path == "/" else unquote(
                request_path.lstrip("/")
            )
            try:
                path = safe_relative_path(application.static_root, relative)
            except DecisionToolError:
                self._send_json(HTTPStatus.NOT_FOUND, {"error": "Not found."})
                return
            if not path.is_file():
                self._send_json(HTTPStatus.NOT_FOUND, {"error": "Not found."})
                return
            content_types = {
                ".html": "text/html; charset=utf-8",
                ".css": "text/css; charset=utf-8",
                ".js": "text/javascript; charset=utf-8",
                ".json": "application/json; charset=utf-8",
                ".ico": "image/x-icon",
            }
            content_type = content_types.get(
                path.suffix.lower(), "application/octet-stream"
            )
            self._send_bytes(HTTPStatus.OK, content_type, path.read_bytes())

        def do_POST(self) -> None:
            parsed = urlparse(self.path)
            if not self._request_is_local():
                self._send_json(HTTPStatus.FORBIDDEN, {"error": "Local origin required."})
                return
            try:
                payload = self._read_json()
                if not isinstance(payload, dict):
                    raise DecisionToolError("JSON request body must be an object.")
                if parsed.path == "/api/draft":
                    saved_at = payload.get("savedAt")
                    if not isinstance(saved_at, str) or not saved_at:
                        raise DecisionToolError("savedAt is required.")
                    errors = application.save_draft(
                        payload.get("draft"),
                        saved_at,
                        payload.get("confirmReplaceMalformedDraft") is True,
                    )
                    self._send_json(
                        HTTPStatus.OK,
                        {
                            "saved": True,
                            "lastSavedAt": saved_at,
                            "validationErrors": errors,
                        },
                    )
                    return
                if parsed.path == "/api/validate":
                    errors = validate_draft(
                        application.package,
                        payload.get("draft"),
                        final=bool(payload.get("final")),
                    )
                    self._send_json(
                        HTTPStatus.OK,
                        {"valid": not errors, "errors": errors},
                    )
                    return
                if parsed.path == "/api/finalize":
                    saved_at = payload.get("savedAt")
                    if not isinstance(saved_at, str) or not saved_at:
                        raise DecisionToolError("savedAt is required.")
                    result, json_path, markdown_path = application.finalize(
                        payload.get("draft"),
                        saved_at,
                        payload.get("confirmReplaceMalformedDraft") is True,
                    )
                    self._send_json(
                        HTTPStatus.OK,
                        {
                            "finalized": True,
                            "resultHash": result["resultHash"],
                            "jsonFile": str(json_path),
                            "markdownFile": str(markdown_path),
                            "result": result,
                        },
                    )
                    return
                self._send_json(HTTPStatus.NOT_FOUND, {"error": "Not found."})
            except ValidationError as exc:
                error_message = (
                    "Draft data is invalid."
                    if parsed.path == "/api/draft"
                    else "Finalisation blocked."
                )
                self._send_json(
                    HTTPStatus.UNPROCESSABLE_ENTITY,
                    {"error": error_message, "errors": exc.errors},
                )
            except DecisionToolError as exc:
                self._send_json(HTTPStatus.BAD_REQUEST, {"error": str(exc)})
            except (TypeError, ValueError) as exc:
                self._send_json(
                    HTTPStatus.BAD_REQUEST,
                    {"error": f"Request data is malformed: {exc}"},
                )
            except OSError as exc:
                self._send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": f"Local file operation failed: {exc}"},
                )

    return Handler


def build_server(
    package_path: Path,
    runtime_root: Path,
    static_root: Path,
    port: int = DEFAULT_PORT,
) -> ThreadingHTTPServer:
    application = DecisionToolApplication(package_path, runtime_root, static_root)
    return ThreadingHTTPServer((HOST, port), make_handler(application))


def parse_arguments() -> argparse.Namespace:
    tool_root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description="Run the local-only Human Visual Decision Tool."
    )
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
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--open", action="store_true", dest="open_browser")
    return parser.parse_args()


def main() -> int:
    args = parse_arguments()
    tool_root = Path(__file__).resolve().parent
    if args.port < 1 or args.port > 65535:
        raise SystemExit("Port must be between 1 and 65535.")
    server = build_server(
        args.package,
        args.runtime_data,
        tool_root / "web",
        args.port,
    )
    url = f"http://{HOST}:{server.server_address[1]}/"
    print("Human Visual Decision Tool V1", flush=True)
    print(f"Local-only address: {url}", flush=True)
    print(f"Decision package: {Path(args.package).resolve()}", flush=True)
    print(f"Runtime data: {Path(args.runtime_data).resolve()}", flush=True)
    print("Press Ctrl+C to stop.", flush=True)
    def request_shutdown(_signal_number, _frame) -> None:
        raise KeyboardInterrupt

    signal.signal(signal.SIGINT, request_shutdown)
    if hasattr(signal, "SIGBREAK"):
        signal.signal(signal.SIGBREAK, request_shutdown)
    if args.open_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=0.2)
    except KeyboardInterrupt:
        print("\nStopping local server...", flush=True)
    finally:
        server.server_close()
    print("Stopped.", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
