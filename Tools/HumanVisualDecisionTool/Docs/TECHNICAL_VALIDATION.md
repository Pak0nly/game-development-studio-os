# Human Visual Decision Tool V1 — Technical Validation

Candidate ID: `HVDT-V1-HT6`

Validation date: `2026-07-23`

## Candidate Identity

The candidate is the following ordered 21-file set. The aggregate is SHA-256
over UTF-8 lines in table order using `relative/path|SHA256\n`.

Candidate aggregate SHA-256:

`96DF6C1C2AA8AB15638298C5E053B5FF20E42C9530E3461DD0FD369F32A8FCB6`

| File | SHA-256 |
|---|---|
| `decision_tool.py` | `BE382BE5ACD69A1F3037F9368155E82A26BDC80A36D006945E743B742D6E92C4` |
| `server.py` | `3C3C9DFEAEB636D2F9A3643E78B4B98AF192484D9288093F0F96615AE8597123` |
| `register_previews.py` | `CDAD8EE5ED0A6E78866CDA1AD5F83972019FC674069CE03EE6103DA390B5B270` |
| `guided_preview_registration.py` | `261F280103444B57C3C28669C91A443FD0EBC8C7B5452463C92944CB10B8044D` |
| `prepare_crime99_previews.py` | `6757BB4DF89B43B5A40994D4882402DA64BBDFB24807881ABFCB9B9C779F9E0A` |
| `UnityAutomation/HvdtPreparedPreviewGenerator.cs` | `BF3C358DC3EF359CFA29A77A512DD077A1A7BE4DE56D89E7526147103AF70FCA` |
| `Start-HumanVisualDecisionTool.cmd` | `5374055659A0829C59B81F67527C5343D265500CF9645B222E19D3BECBE670F8` |
| `Prepare-Crime99-Previews.cmd` | `D00196E12C649859D10F017545BC26132C68B90060C83E46EDB73B1D7B3875FC` |
| `Packages/crime99-surface-material-v1.json` | `FB1CE9475BC428037BD104954F5BEEB84F6834CEB879D875AE0BCEB9925E9168` |
| `Schemas/decision-package.schema.json` | `8D7082277A850B6DCCCBF628ED381FD7EFF354D0C44F0FADCA796B9DE13EEAB2` |
| `Schemas/decision-result.schema.json` | `BDECF008CE973818160C15B91238A4BA31D16088BF34F5DD522F62E6243810FB` |
| `web/index.html` | `9516D714DF61169E79A9A348C9913621EC9894EA4EACFF7C11071E8C34BEC2FD` |
| `web/styles.css` | `3B29D173CC9B0EAC58595660600A842084B891C73B5A33069C0FD15060FB21F8` |
| `web/app.js` | `2080786B3B36B995124966FE1A1159EE09F6D2CFC2AD4B7CE78B967A2D10B4D1` |
| `tests/test_decision_tool.py` | `87F69C88878E17102D80FC79C52A9D9945DA15D21E31AA91CEC566116B90A5CD` |
| `README.md` | `301F9FC21BC756988ABBA2F9EA2CA8A0CED45CA90CCCC46DCAE0F1567AD3C5E7` |
| `Docs/HUMAN_TEST_CHECKLIST.md` | `4D01299EC798D3F6BA33844B53EB477B8B4C31DA2C359200497B4BF015A47FDF` |
| `Docs/PREVIEW_WORKFLOW.md` | `C20C0A16D847A8111D84AC3039C0238ED3B3FCF065FA76F272422171CE086C1D` |
| `Docs/ARCHITECTURE.md` | `CF7BB6E18E63E600F2D572C4D5EC2E0716B3C1266C35163FB951E2D8A4B5B1CB` |
| `Docs/MAINTENANCE.md` | `FE4D79E390F4F57D43B044E142EB8E6B317A3206903D84785C3C4968B2A20F40` |
| `Docs/TASK_DELTA_WORK_ORDER.md` | `984C1DA9C2272280BC842A81E09111AD26FEA7C1BFE5C1AE294ACC4C341BD650` |

RuntimeData, this validation record, and formal review records are evidence, not
members of the candidate aggregate.

## Authority and Correction Accounting

The Human authorised one final bounded HT5-to-successor correction covering only:

1. complete disposition of the four ordinary repair candidates;
2. immediate invalidation and guided regeneration of derived status after an
   edit to a completed category;
3. exact checklist, help, and primary-control alignment; and
4. coherent German Guided accessibility semantics.

The allowance was consumed by the first HT5-to-HT6 mutation. There are zero
authorised post-freeze correction rounds. Formal Crime99 Surface corrections
remain `0 of 1`; no production candidate mutation is authorised.

## Corrected Guided-Flow Evidence

- `Reparaturen und Abnutzung` contains exactly four ordinary candidates.
- Every repair candidate requires one explicit `Verwenden`, `Nicht verwenden`,
  or `Später entscheiden` disposition before completion.
- All four candidates may be rejected; no repair material is forced.
- Every `Später entscheiden` disposition requires and preserves a visible Human
  reason.
- The readable summary reports all four dispositions and deferred reasons.
- Editing a completed category immediately changes it to `UNRESOLVED` and clears
  its derived implementation note.
- The unresolved state persists through save, back/next navigation, summary,
  reload, and final validation.
- Only `Auswahl speichern und weiter` can complete the category again and
  regenerate the exact derived implementation status.
- The server independently rejects a completed result with a stale derived
  implementation status.
- Checklist, help copy, and normal continuation controls use the same labels.
- Guided normal-flow strings, recovery, validation, result reopening, preview
  alternatives, and dialog copy are German.
- Decision and comparison toggles expose `aria-pressed`; current navigation uses
  `aria-current`; dialogs have programmatic labels and descriptions; progress is
  a programmatic progressbar; keyboard focus remains visible.

## Prepared Preview Evidence

- Package preview counts by category: `2, 2, 3, 4, 2, 4, 2, 2`.
- Package, manifest, and registration identities: `21/21/21`.
- Resolution metadata: fixed `960×540` for every preview.
- Package-to-manifest-to-registration ID or SHA-256 mismatches: `0`.
- Registration source-package hash:
  `FB1CE9475BC428037BD104954F5BEEB84F6834CEB879D875AE0BCEB9925E9168`.
- Registered-copy hash or dimension mismatches: `0`.
- The four repair-material preview hashes remain pairwise distinct.
- No preview was regenerated, opened, viewed, interpreted, attached, or
  transmitted to AI.
- The temporary Unity Editor helper and `.meta` file are absent.

## Automated Non-Visual Validation

Commands:

`py -3 -m py_compile decision_tool.py server.py register_previews.py prepare_crime99_previews.py`

`node --check web/app.js`

`py -3 -m unittest discover -s tests -v`

`git diff --check -- Tools/HumanVisualDecisionTool`

Results:

- Python compilation: `PASS`.
- JavaScript syntax: `PASS`.
- Automated suite: `PASS — 85 tests`.
- Candidate whitespace scan: `PASS`.
- Git index: empty.

All `80` HT5 tests remain and pass. Five focused tests were added; none were
removed or weakened. They verify the repair contract, rejection of every repair
candidate without a forced material, deferred-reason enforcement and derived
status, server rejection of stale derived status, control-label alignment, and
the required accessibility bindings.

## Browser QA

The exact candidate was exercised at `http://127.0.0.1:8765/` through the
in-app browser without screenshots or image judgement.

- Crime99 opened at decision 1 of 8 in German Guided Human Mode.
- Incomplete repair disposition was blocked.
- Four explicit repair dispositions, including one deferred reason, completed
  and survived save, summary, and reload.
- Editing that completed category immediately exposed `Noch offen`, cleared the
  derived status, survived save/summary/reload, and could only be completed
  again through guided continuation.
- All eight categories were completed; the summary showed all repair
  dispositions and the deferred reason.
- A deterministic JSON/Markdown result was exported and reopened as a
  hash-valid authoritative text record.
- `aria-pressed`, `aria-current`, dialog naming/description, and `100%`
  programmatic progress were observed.
- The A/B comparison dialog opened successfully.
- Browser console warnings/errors: `0`.
- The QA draft and result were removed, the server stopped, and the browser tab
  was finalised after the check.

## Protected Scope and Provenance

| Protected record | SHA-256 |
|---|---|
| Preserved Surface scene | `B40FC9198EACCD7AA569F671598B6A6DB2395489997225E9843B2EB569019EF0` |
| Placement proposal | `1CAA97BCBDC98E49F23427FA9A9577FEB46A01BC20506D3C1A070D9641444F20` |
| Material record | `2832275F0B014D332DA22EF38A640714184938B412310D70CEF2AEA3E2FABE50` |
| Vendor Material and AI-Use Audit | `A6A9B66649E72E774BBA17B06E0E392EC72CFC482CA4CDD7B0173D7DC161A234` |
| Audit blocker consolidation | `9B573118FD293666D621B61C31BCA8DB7A1A031A79D11EEE33C517EB0FEAB22D` |

No production scene, preserved candidate, placement, material record, Vendor
source, gameplay, lighting, geometry, or prepared preview content was mutated.
No Vendor preview, screenshot, texture, thumbnail, or capture was returned to
AI.

## Stage-Exit Status

`HVDT-V1-HT6` is frozen at the exact 21-file identity above. Mandatory role
reviews are recorded in:

- `Docs/Reviews/HVDT-V1-HT6-REVIEWS.md`
- `Docs/Reviews/HVDT-V1-HT6-CONSOLIDATION.md`

The frozen identity remained unchanged through all five mandatory reviews:

- UI/UX Reviewer: `FAIL`.
- Software Engineer / Technical Director: `FAIL`.
- QA Lead: `FAIL`.
- Asset & Provenance Manager: `PASS`.
- Producer / Scope Controller: `FAIL`.

Two controlling hard fails remain:

1. the actual final-category and summary control labels are not stated exactly
   in the checklist and README; and
2. category-level `DEFERRED` returns before repair-specific validation, allowing
   a direct or recovered draft to finalise with all four repair candidates
   `UNRESOLVED`.

Zero post-freeze correction rounds remain authorised. Formal Crime99 Surface
corrections remain `0 of 1`.

Stage-exit status:

`BLOCKED — HUMAN USABILITY REQUIREMENT REMAINS`
