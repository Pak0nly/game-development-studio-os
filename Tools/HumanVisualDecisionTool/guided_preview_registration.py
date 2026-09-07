from __future__ import annotations

import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from decision_tool import DecisionToolError, load_package
from register_previews import register_entries


TOOL_ROOT = Path(__file__).resolve().parent
PACKAGE_PATH = TOOL_ROOT / "Packages" / "crime99-surface-material-v1.json"
RUNTIME_ROOT = TOOL_ROOT / "RuntimeData"


def main() -> int:
    package, package_hash = load_package(PACKAGE_PATH)
    choices: list[tuple[str, str]] = []
    for category in package["categories"]:
        for option in category["options"]:
            for preview in option.get("previewAssets", []):
                label = (
                    f"{category['title']} — {option['label']} — "
                    f"{preview.get('label', preview['id'])}"
                )
                choices.append((label, preview["id"]))

    root = tk.Tk()
    root.title("Register a local Human review preview")
    root.geometry("760x330")
    root.minsize(640, 300)
    root.configure(padx=24, pady=20)

    heading = ttk.Label(
        root,
        text="Register one local preview",
        font=("Segoe UI", 16, "bold"),
    )
    heading.pack(anchor="w")
    ttk.Label(
        root,
        text=(
            "Choose the exact decision option and its locally prepared image. "
            "The file stays on this computer. Registration records only its path, "
            "type, dimensions, size, and SHA-256."
        ),
        wraplength=700,
        justify="left",
    ).pack(anchor="w", pady=(6, 18))

    ttk.Label(root, text="Decision preview").pack(anchor="w")
    selected_label = tk.StringVar(value=choices[0][0] if choices else "")
    combo = ttk.Combobox(
        root,
        textvariable=selected_label,
        values=[label for label, _ in choices],
        state="readonly",
        width=95,
    )
    combo.pack(fill="x", pady=(4, 14))

    ttk.Label(root, text="Local image file").pack(anchor="w")
    selected_path = tk.StringVar()
    path_row = ttk.Frame(root)
    path_row.pack(fill="x", pady=(4, 16))
    ttk.Entry(path_row, textvariable=selected_path).pack(
        side="left", fill="x", expand=True
    )

    def browse() -> None:
        chosen = filedialog.askopenfilename(
            title="Choose a local Human review preview",
            filetypes=[
                ("Supported images", "*.png *.jpg *.jpeg *.gif *.bmp"),
                ("PNG", "*.png"),
                ("JPEG", "*.jpg *.jpeg"),
                ("GIF", "*.gif"),
                ("Bitmap", "*.bmp"),
            ],
        )
        if chosen:
            selected_path.set(chosen)

    ttk.Button(path_row, text="Choose file…", command=browse).pack(
        side="left", padx=(8, 0)
    )

    status = tk.StringVar(value="No file has been registered in this window.")
    ttk.Label(root, textvariable=status, wraplength=700).pack(anchor="w")

    def register() -> None:
        if not selected_label.get() or not selected_path.get():
            messagebox.showerror(
                "Missing information",
                "Choose a decision preview and a local image file.",
            )
            return
        preview_id = dict(choices)[selected_label.get()]
        try:
            output_path = register_entries(
                package,
                package_hash,
                [{"previewId": preview_id, "path": selected_path.get()}],
                RUNTIME_ROOT,
            )
        except (DecisionToolError, OSError) as exc:
            messagebox.showerror("Preview not registered", str(exc))
            return
        status.set(
            f"Registered {preview_id}. The text-only record is stored at {output_path}."
        )
        messagebox.showinfo(
            "Preview registered",
            "The local preview is ready for the Human review interface. "
            "No visual analysis was performed.",
        )

    ttk.Button(root, text="Register local preview", command=register).pack(
        anchor="e", pady=(18, 0)
    )
    root.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

