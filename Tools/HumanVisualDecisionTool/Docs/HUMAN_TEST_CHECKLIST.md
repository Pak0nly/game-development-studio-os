# Human Test Checklist — HVDT V1 Guided Crime99 Pass

This checklist is for the second local Human usability test. It does not
authorise a Crime99 Surface correction.

Do not send screenshots or Vendor-containing previews to an AI system. Return
text findings only.

## Guided Human Test

- [ ] Double-click `Start-HumanVisualDecisionTool.cmd`.
- [ ] Confirm the browser opens `http://127.0.0.1:8765/` and shows the local-only
      notice.
- [ ] Confirm the first of eight decisions opens directly in **Geführter
      Human-Test** mode.
- [ ] Confirm every material or geometry option that needs a comparison has a
      prepared preview. Do not send the previews or screenshots to AI.
- [ ] For each category, choose the intended option with **Diese Option
      verwenden**. For each of the four repair candidates, explicitly choose
      **Verwenden**, **Nicht verwenden**, or **Später entscheiden**. Confirm that
      no material is forced and that **Später entscheiden** requires a visible
      Human reason.
- [ ] Add a plain-language note only when useful. Confirm no renderer path,
      material slot, GUID, tiling, offset, colour, or other technical value is
      required in the normal flow.
- [ ] Select **Auswahl speichern und weiter** and complete all eight
      decisions.
- [ ] On the summary, confirm every selected option and any note are readable.
      Confirm that all four repair dispositions and each deferred reason are
      readable.
- [ ] Use **Ändern** on one completed decision and change its selection. Confirm
      the category immediately becomes **Noch offen** on the category view,
      navigation, summary, after saving, and after one close/restart. Confirm
      only **Auswahl speichern und weiter** can complete it again and regenerate
      the technical status.
- [ ] Enter the Human identifier and enable both confirmations. Confirm the
      decision time is filled automatically.
- [ ] Run the completion check, then finalise and export.
- [ ] Confirm one local JSON and one Markdown result are reported and that they
      contain `TECHNICAL MAPPING PENDING` where later renderer, slot, or object
      mapping is still required.

## Safety and Resume

- [ ] Close and restart once before finalisation; confirm saved choices reload.
- [ ] Confirm keyboard focus remains visible, the current navigation entry is
      announced, decision and comparison toggles expose their pressed state,
      dialogs have meaningful names/descriptions, and progress is announced.
- [ ] Confirm the exported files contain no image bytes, base64 content,
      embeddings, preview paths, or external image URLs.
- [ ] Stop with `Ctrl+C` and confirm `Stopped.`.
- [ ] Report only text findings, including unclear wording, missing previews,
      unexpected data loss, failed controls, or console errors.
- [ ] Do not begin the Crime99 Surface correction.
