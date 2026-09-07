"use strict";

const state = {
  package: null,
  packageHash: "",
  guidedMode: false,
  draft: null,
  lastSavedAt: null,
  currentCategoryId: null,
  comparison: [],
  results: [],
  dirty: false,
  saving: false,
  revision: 0,
  recoveryRequired: false,
  recoveryFile: null,
  recoveryMessage: "",
};

const elements = {};

const GUIDED_CATEGORY_COPY = {
  road: {
    title: "Straße",
    explanation:
      "Wähle die Oberfläche, die künftig für die normale Straße verwendet werden soll. Beide Varianten werden unter identischen Bedingungen gezeigt.",
  },
  sidewalk: {
    title: "Gehweg und Pflaster",
    explanation:
      "Wähle genau eine Oberfläche für den normalen Gehweg. Die Optionen werden im gleichen festen Aufbau gezeigt.",
  },
  curb: {
    title: "Bordstein",
    explanation:
      "Wähle genau eine Oberfläche für den Bordstein. Alle Kandidaten werden auf derselben festen Bordstein-Geometrie gezeigt.",
  },
  "service-loading": {
    title: "Service- und Ladefläche",
    explanation:
      "Wähle eine vorhandene Oberfläche für den Servicebereich oder entscheide ausdrücklich, dass keine Option geeignet ist.",
  },
  "ground-beneath-buildings": {
    title: "Boden unter Gebäuden",
    explanation:
      "Entscheide, ob die bestehende Bodenfläche erhalten, entfernt, später ersetzt oder vorerst zurückgestellt werden soll.",
  },
  "repairs-wear": {
    title: "Reparaturen und Abnutzung",
    explanation:
      "Entscheide für jede der vier vorhandenen Detailoberflächen: verwenden, nicht verwenden oder später entscheiden. Keine Oberfläche wird erzwungen.",
  },
  "rectangular-repair-geometry": {
    title: "Rechteckige Reparaturflächen",
    explanation:
      "Entscheide, ob die vorhandenen rechteckigen Reparaturflächen erhalten, entfernt, später ersetzt oder zurückgestellt werden sollen.",
  },
  "ground-infill-geometry": {
    title: "Bodenfüllflächen (Ground-Infills)",
    explanation:
      "Entscheide, ob die zwei vorhandenen Ground-Infills erhalten, entfernt, später ersetzt oder zurückgestellt werden sollen.",
  },
};

const GUIDED_OPTION_LABELS = {
  "service-no-suitable-option": "Keine Option ist geeignet",
  "ground-retain-selected-material": "Bestehende Fläche erhalten",
  "ground-remove": "Bestehende Fläche entfernen",
  "ground-replace-separate-scope": "Später ersetzen",
  "ground-defer": "Später entscheiden",
  "rectangular-repair-retain": "Erhalten",
  "rectangular-repair-remove": "Entfernen",
  "rectangular-repair-replace": "Später ersetzen",
  "rectangular-repair-defer": "Später entscheiden",
  "ground-infill-retain": "Erhalten",
  "ground-infill-remove": "Entfernen",
  "ground-infill-replace": "Später ersetzen",
  "ground-infill-defer": "Später entscheiden",
};

const TECHNICAL_MAPPING_PENDING =
  "TECHNICAL MAPPING PENDING — visual selection recorded; deterministic renderer/slot mapping is required before Crime99 mutation.";
const GEOMETRY_MAPPING_PENDING =
  "TECHNICAL MAPPING PENDING — geometry disposition recorded; exact object mapping is required before Crime99 mutation.";
const HUMAN_DECISION_DEFERRED =
  "HUMAN DECISION DEFERRED — no Crime99 mutation is authorised.";
const NO_SUITABLE_OPTION =
  "SEPARATE HUMAN DIRECTION REQUIRED — no suitable prepared option was selected.";
const NO_SUITABLE_REPAIR_OPTION =
  "SEPARATE HUMAN DIRECTION REQUIRED — no prepared repair option was selected.";

function guidedCategoryCopy(category) {
  return GUIDED_CATEGORY_COPY[category.id] || {
    title: category.title.replace(/^\d+\.\s*/, ""),
    explanation: category.description,
  };
}

function optionDisplayLabel(option) {
  return GUIDED_OPTION_LABELS[option.id] || option.label;
}

function selectedOptions(category) {
  const categoryState = getCategoryState(category.id);
  return category.options.filter(
    (option) => categoryState.optionStates[option.id].decision === "SELECT",
  );
}

function isDeferredOption(option) {
  return (
    option.technicalName === "DEFER" ||
    option.implementationMetadata?.geometryAction === "deferred"
  );
}

function isNoSuitableOption(option) {
  return option.technicalName === "NO_SUITABLE_OPTION";
}

function categoryHasMaterialSelection(category) {
  return selectedOptions(category).some(
    (option) => Boolean(option.technicalMetadata?.materialPath),
  );
}

function isRepairCategory(category) {
  return category.id === "repairs-wear";
}

function repairDispositionLabel(decision) {
  return {
    SELECT: "Verwenden",
    REJECT: "Nicht verwenden",
    DEFER: "Später entscheiden",
    UNRESOLVED: "Noch nicht geprüft",
  }[decision] || "Ungültiger Zustand";
}

function invalidateCompletedCategory(categoryState) {
  if (categoryState.status !== "COMPLETED") return false;
  categoryState.status = "UNRESOLVED";
  categoryState.implementationNote = "";
  const note = document.getElementById("implementation-note");
  if (note) note.value = "";
  return true;
}

function cacheElements() {
  [
    "loading-screen",
    "app-shell",
    "save-state",
    "save-button",
    "progress-panel",
    "progress-number",
    "progress-fill",
    "progress-detail",
    "overview-nav",
    "category-nav",
    "overview-view",
    "category-view",
    "main-content",
    "package-identity",
    "jump-pending",
    "comparison-tray",
    "comparison-selection",
    "clear-comparison",
    "open-comparison",
    "preview-dialog",
    "preview-dialog-kicker",
    "preview-dialog-title",
    "preview-dialog-body",
    "validation-dialog",
    "validation-title",
    "validation-body",
    "toast-region",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(value) {
  return String(value)
    .toLowerCase()
    .replaceAll(/(^|[_\s])([a-z])/g, (_, lead, letter) => `${lead}${letter.toUpperCase()}`);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`);
    error.details = payload.errors || [];
    throw error;
  }
  return payload;
}

function getCategory(categoryId) {
  return state.package.categories.find((category) => category.id === categoryId);
}

function getCategoryState(categoryId) {
  return state.draft.categories[categoryId];
}

function mergedRules(category) {
  return {
    ...(state.package.validationRules || {}),
    ...(category.validationRules || {}),
  };
}

function setDirty() {
  state.dirty = true;
  state.revision += 1;
  updateSaveState();
}

function updateSaveState() {
  if (state.saving) {
    elements["save-state"].textContent = state.guidedMode ? "Wird gespeichert…" : "Saving…";
    return;
  }
  if (state.dirty) {
    elements["save-state"].textContent = state.guidedMode ? "Nicht gespeicherte Änderung" : "Unsaved changes";
    return;
  }
  if (state.lastSavedAt) {
    const date = new Date(state.lastSavedAt);
    elements["save-state"].textContent = Number.isNaN(date.valueOf())
      ? state.guidedMode
        ? "Lokal gespeichert"
        : "Draft saved"
      : `${state.guidedMode ? "Gespeichert" : "Saved"} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    return;
  }
  elements["save-state"].textContent = state.guidedMode ? "Noch nicht gespeichert" : "Not saved yet";
}

function completionSnapshot() {
  const categories = state.package.categories;
  const completed = categories.filter((category) => categoryIssues(category).length === 0);
  const pending = categories.filter(
    (category) => !completed.some((item) => item.id === category.id),
  );
  return {
    completed,
    pending,
    percentage: Math.round((completed.length / categories.length) * 100),
  };
}

function fieldValid(field, value) {
  if (value === "") return false;
  if (field.type === "text" || field.type === "textarea") {
    if (typeof value !== "string") return false;
  }
  if (field.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) return false;
    if (field.minimum !== undefined && value < field.minimum) return false;
    if (field.maximum !== undefined && value > field.maximum) return false;
  }
  if (field.type === "select") {
    if (typeof value !== "string" || !(field.choices || []).includes(value)) return false;
  }
  if (field.pattern) {
    try {
      if (!new RegExp(field.pattern, "mis").test(String(value).trim())) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function categoryIssues(category) {
  const categoryState = getCategoryState(category.id);
  const rules = mergedRules(category);
  const issues = [];
  if (categoryState.status === "UNRESOLVED") {
    issues.push("Category is not marked complete.");
  }
  if (
    categoryState.status !== "NOT_APPLICABLE" &&
    String(categoryState.notApplicableReason || "").trim()
  ) {
    issues.push("NOT APPLICABLE reason must be empty for the current status.");
  }
  if (categoryState.status === "NOT_APPLICABLE") {
    if (!rules.allowNotApplicable) issues.push("NOT APPLICABLE is not permitted.");
    if (!String(categoryState.notApplicableReason || "").trim()) {
      issues.push("NOT APPLICABLE requires a Human reason.");
    }
    if (
      Object.values(categoryState.optionStates).some(
        (optionState) => optionState.decision !== "UNRESOLVED",
      ) ||
      Object.values(categoryState.fields).some((value) => String(value || "").trim())
    ) {
      issues.push("NOT APPLICABLE cannot retain decisions or implementation values.");
    }
    return issues;
  }
  if (categoryState.status === "DEFERRED") {
    if (!rules.allowDeferred) issues.push("Category deferral is not permitted.");
    if (!String(categoryState.categoryComment || "").trim()) {
      issues.push("Deferred status requires a Human comment.");
    }
    if (
      Object.values(categoryState.optionStates).some(
        (optionState) => optionState.decision !== "UNRESOLVED",
      )
    ) {
      issues.push("Deferred status cannot retain option decisions.");
    }
    if (Object.values(categoryState.fields).some((value) => String(value || "").trim())) {
      issues.push("Deferred status cannot retain implementation values.");
    }
    return issues;
  }

  const selected = category.options.filter(
    (option) => categoryState.optionStates[option.id].decision === "SELECT",
  );
  if (category.selectionMode === "single" && selected.length !== 1) {
    issues.push("Select exactly one option.");
  }
  if (category.selectionMode === "multiple") {
    const minimum = rules.minimumSelections ?? 1;
    if (selected.length < minimum) issues.push(`Select at least ${minimum} option(s).`);
    if (rules.maximumSelections !== undefined && selected.length > rules.maximumSelections) {
      issues.push(`Select no more than ${rules.maximumSelections} option(s).`);
    }
    if (selected.some((option) => option.exclusiveSelection) && selected.length !== 1) {
      issues.push("An exclusive option cannot be combined with another selection.");
    }
  }
  if (category.selectionMode === "ordered") {
    const minimum = rules.minimumSelections ?? 1;
    if (selected.length < minimum) issues.push(`Rank at least ${minimum} option(s).`);
    const ranks = selected.map((option) => categoryState.optionStates[option.id].rank);
    const sorted = [...ranks].sort((a, b) => a - b);
    if (
      ranks.some((rank) => !Number.isInteger(rank) || rank < 1) ||
      new Set(ranks).size !== ranks.length ||
      sorted.some((rank, index) => rank !== index + 1)
    ) {
      issues.push("Ranks must be unique and contiguous from 1.");
    }
  }
  if (category.selectionMode === "approveReject") {
    const unresolved = category.options.filter(
      (option) => categoryState.optionStates[option.id].decision === "UNRESOLVED",
    );
    if (unresolved.length) issues.push("Decide every option.");
  }
  if (rules.requireDeferredOptionComment) {
    for (const option of category.options) {
      const optionState = categoryState.optionStates[option.id];
      if (
        optionState.decision === "DEFER" &&
        !String(optionState.comment || "").trim()
      ) {
        issues.push(`${optionDisplayLabel(option)}: Grund für „Später entscheiden“ fehlt.`);
      }
    }
  }
  if (rules.requireCategoryComment && !String(categoryState.categoryComment || "").trim()) {
    issues.push("Category comment is required.");
  }
  if (
    rules.requireImplementationNote &&
    !String(categoryState.implementationNote || "").trim()
  ) {
    issues.push("Implementation note is required.");
  }
  const fields = new Map(
    (category.implementationFields || []).map((field) => [field.id, field]),
  );
  const required = new Set(rules.requiredFields || []);
  for (const option of selected) {
    for (const fieldId of rules.requiredFieldsByOption?.[option.id] || []) {
      required.add(fieldId);
    }
  }
  for (const fieldId of required) {
    const field = fields.get(fieldId);
    if (!field || !fieldValid(field, categoryState.fields[fieldId])) {
      issues.push(`Complete ${field?.label || fieldId}.`);
    }
  }
  if (rules.requireDerivedImplementationNote) {
    const expectedNote =
      categoryState.status === "COMPLETED"
        ? guidedImplementationStatus(category)
        : "";
    if (categoryState.implementationNote !== expectedNote) {
      issues.push("Der technische Umsetzungsstatus passt nicht zur aktuellen Auswahl.");
    }
  }
  return issues;
}

function renderProgress() {
  const snapshot = completionSnapshot();
  elements["progress-number"].textContent = `${snapshot.percentage}%`;
  elements["progress-fill"].style.width = `${snapshot.percentage}%`;
  elements["progress-panel"].setAttribute("aria-valuenow", String(snapshot.percentage));
  elements["progress-panel"].setAttribute(
    "aria-valuetext",
    `${snapshot.completed.length} von ${state.package.categories.length} Entscheidungen vollständig`,
  );
  elements["progress-detail"].textContent = snapshot.pending.length
    ? state.guidedMode
      ? `${snapshot.pending.length} von ${state.package.categories.length} Entscheidungen offen.`
      : `${snapshot.pending.length} of ${state.package.categories.length} categories pending.`
    : state.guidedMode
      ? "Alle visuellen Entscheidungen sind vollständig."
      : "Every category is marked complete.";

  for (const button of elements["category-nav"].querySelectorAll("[data-category-id]")) {
    const categoryState = getCategoryState(button.dataset.categoryId);
    const category = getCategory(button.dataset.categoryId);
    const issues = categoryIssues(category);
    const marker = button.querySelector(".nav-status");
    marker.className = "nav-status";
    if (issues.length === 0 && categoryState.status === "COMPLETED") {
      marker.classList.add("is-complete");
    }
    if (
      issues.length === 0 &&
      ["DEFERRED", "NOT_APPLICABLE"].includes(categoryState.status)
    ) {
      marker.classList.add("is-deferred");
    }
    const statusText = button.querySelector("small");
    statusText.textContent = state.guidedMode
      ? issues.length
        ? "Noch offen"
        : categoryState.status === "COMPLETED"
          ? "Visuell entschieden"
          : "Zurückgestellt"
      : issues.length
        ? `${titleCase(categoryState.status)} · ${issues.length} needed`
        : titleCase(categoryState.status);
  }
}

function renderNavigation() {
  elements["category-nav"].innerHTML = state.package.categories
    .map((category, index) => {
      const categoryState = getCategoryState(category.id);
      const issues = categoryIssues(category);
      const active = state.currentCategoryId === category.id ? " is-active" : "";
      const markerClass =
        issues.length === 0 && categoryState.status === "COMPLETED"
          ? " is-complete"
          : issues.length === 0 && ["DEFERRED", "NOT_APPLICABLE"].includes(categoryState.status)
            ? " is-deferred"
            : "";
      const guidedCopy = guidedCategoryCopy(category);
      return `
        <button class="nav-item${active}" type="button" data-category-id="${escapeHtml(category.id)}"${active ? ' aria-current="page"' : ""}>
          <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong>${escapeHtml(state.guidedMode ? guidedCopy.title : category.title.replace(/^\d+\.\s*/, ""))}</strong>
            <small>${escapeHtml(
              state.guidedMode
                ? issues.length
                  ? "Noch offen"
                  : categoryState.status === "COMPLETED"
                    ? "Visuell entschieden"
                    : "Zurückgestellt"
                : issues.length
                  ? `${titleCase(categoryState.status)} · ${issues.length} needed`
                  : titleCase(categoryState.status),
            )}</small>
          </span>
          <span class="nav-status${markerClass}" aria-hidden="true"></span>
        </button>
      `;
    })
    .join("");

  elements["category-nav"].querySelectorAll("[data-category-id]").forEach((button) => {
    button.addEventListener("click", () => showCategory(button.dataset.categoryId));
  });
  elements["overview-nav"].classList.toggle("is-active", state.currentCategoryId === null);
  if (state.currentCategoryId === null) {
    elements["overview-nav"].setAttribute("aria-current", "page");
  } else {
    elements["overview-nav"].removeAttribute("aria-current");
  }
  renderProgress();
}

function showOverview() {
  state.currentCategoryId = null;
  elements["overview-view"].hidden = false;
  elements["category-view"].hidden = true;
  renderNavigation();
  renderOverview();
  elements["main-content"].focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCategory(categoryId) {
  state.currentCategoryId = categoryId;
  elements["overview-view"].hidden = true;
  elements["category-view"].hidden = false;
  renderNavigation();
  renderCategory();
  elements["main-content"].focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLegacyOverview() {
  const snapshot = completionSnapshot();
  const pendingMarkup = snapshot.pending.length
    ? snapshot.pending
        .map(
          (category) => `
            <li>
              <button type="button" data-open-category="${escapeHtml(category.id)}">
                <span>${escapeHtml(category.title)}</span>
                <span class="nav-status" aria-hidden="true"></span>
              </button>
            </li>
          `,
        )
        .join("")
    : "<li class=\"panel-copy\">No categories are pending.</li>";

  const selectedStatus = state.package.sourceContext?.historicalStatus || "Current package";
  const recoveryMarkup = state.recoveryRequired
    ? `
      <section class="panel">
        <div class="panel-body">
          <p class="eyebrow">Draft recovery required</p>
          <h2>The existing saved draft is malformed</h2>
          <p class="panel-copy">${escapeHtml(state.recoveryMessage || "A recoverable copy was preserved. Saving or finalising requires explicit confirmation before replacement.")}</p>
          ${state.recoveryFile ? `<p class="panel-copy">Recovery copy: ${escapeHtml(state.recoveryFile)}</p>` : ""}
        </div>
      </section>
    `
    : "";
  const resultsMarkup = state.results.length
    ? state.results
        .slice(0, 5)
        .map((result) => {
          const current = result.hashValid && result.packageCompatible;
          const statusText = !result.hashValid
            ? "Hash invalid — do not use"
            : result.packageCompatible
              ? `Current package · hash valid · ${result.resultHash}`
              : "Historical/incompatible package revision — cannot open as current";
          return `
            <li>
              <button type="button" data-open-result="${escapeHtml(result.fileName)}" ${current ? "" : "disabled"}>
                <span>
                  <strong>${escapeHtml(result.decisionDateTime || result.fileName)}</strong>
                  <small>${escapeHtml(statusText)}</small>
                </span>
                <span class="nav-status${current ? " is-complete" : ""}" aria-hidden="true"></span>
              </button>
            </li>
          `;
        })
        .join("")
    : "<li class=\"panel-copy\">No completed result has been exported yet.</li>";
  elements["overview-view"].innerHTML = `
    <header class="view-header">
      <div>
        <p class="eyebrow">Human decision package</p>
        <h1>${escapeHtml(state.package.title)}</h1>
        <p class="view-subtitle">${escapeHtml(state.package.description)}</p>
        <div class="context-chips">
          <span class="chip">${escapeHtml(state.package.project)}</span>
          <span class="chip">${escapeHtml(state.package.stage)}</span>
          <span class="chip">Schema ${escapeHtml(state.package.schemaVersion)}</span>
        </div>
      </div>
    </header>

    ${recoveryMarkup}

    <div class="overview-grid">
      <section class="panel">
        <div class="panel-body">
          <p class="eyebrow">Pending work</p>
          <h2>${snapshot.pending.length ? "Complete every required category" : "All categories marked complete"}</h2>
          <p class="panel-copy">Only categories with complete, valid decisions count toward progress. Use the completion check before final export.</p>
          <ul class="pending-list">${pendingMarkup}</ul>
        </div>
      </section>

      <section class="panel">
        <div class="panel-body">
          <p class="eyebrow">Package state</p>
          <div class="status-list">
            <div class="status-row"><span>Completed</span><strong>${snapshot.completed.length} / ${state.package.categories.length}</strong></div>
            <div class="status-row"><span>Draft state</span><strong>${state.dirty ? "Unsaved changes" : state.lastSavedAt ? "Saved locally" : "New draft"}</strong></div>
            <div class="status-row"><span>Historical candidate</span><strong>${escapeHtml(selectedStatus)}</strong></div>
            <div class="status-row"><span>Surface corrections used</span><strong>${escapeHtml(state.package.sourceContext?.formalSurfaceCorrectionsUsed || "Not recorded")}</strong></div>
          </div>
        </div>
      </section>
    </div>

    <section class="panel results-panel">
      <div class="panel-body">
        <p class="eyebrow">Completed text records</p>
        <h2>Reopen and verify a prior result</h2>
        <p class="panel-copy">Only hash-valid JSON results bound to the exact active package SHA-256 can be opened. Other revisions are marked historical/incompatible.</p>
        <ul class="pending-list result-list">${resultsMarkup}</ul>
      </div>
    </section>

    <section class="panel final-panel">
      <p class="eyebrow">Final Human record</p>
      <h2>Validate and export</h2>
      <p class="panel-copy">The authoritative JSON export contains text metadata only. It never contains preview bytes, thumbnails, base64 data, embeddings, or remote image URLs.</p>
      <div class="final-panel-grid">
        <div class="field">
          <label for="human-identifier">Human name or identifier</label>
          <input id="human-identifier" class="input" type="text" autocomplete="name" value="${escapeHtml(state.draft.humanIdentifier)}" placeholder="Required for final export">
        </div>
        <div class="field">
          <label for="decision-date-time">Decision date and time</label>
          <input id="decision-date-time" class="input" type="datetime-local" value="${escapeHtml(toLocalDateTimeInput(state.draft.decisionDateTime))}">
        </div>
      </div>
      <label class="check-row">
        <input id="human-attestation" type="checkbox" ${state.draft.humanAttestation ? "checked" : ""}>
        <span>I confirm that these visual decisions were made by a Human through local inspection and were not delegated to an AI visual reviewer.</span>
      </label>
      <label class="check-row">
        <input id="final-confirmation" type="checkbox" ${state.draft.finalConfirmation ? "checked" : ""}>
        <span>I have reviewed every category and explicitly confirm that this decision record is ready to finalise. Saving a draft alone never makes it final.</span>
      </label>
      <div class="final-actions">
        <button id="validate-button" class="button button-secondary" type="button">Check completion</button>
        <button id="finalize-button" class="button button-primary" type="button">Finalise and export</button>
      </div>
    </section>
  `;

  elements["overview-view"].querySelectorAll("[data-open-category]").forEach((button) => {
    button.addEventListener("click", () => showCategory(button.dataset.openCategory));
  });
  elements["overview-view"].querySelectorAll("[data-open-result]").forEach((button) => {
    button.addEventListener("click", () => openCompletedResult(button.dataset.openResult));
  });
  bindValue("human-identifier", (value) => {
    state.draft.humanIdentifier = value;
  });
  bindValue("decision-date-time", (value) => {
    state.draft.decisionDateTime = localDateTimeWithOffset(value);
  });
  bindChecked("human-attestation", (value) => {
    state.draft.humanAttestation = value;
  });
  bindChecked("final-confirmation", (value) => {
    state.draft.finalConfirmation = value;
  });
  document.getElementById("validate-button").addEventListener("click", () => validateFinal(false));
  document.getElementById("finalize-button").addEventListener("click", finalize);
}

function summaryStatus(category) {
  const categoryState = getCategoryState(category.id);
  const selected = selectedOptions(category);
  if (categoryIssues(category).length) return "Noch offen";
  if (
    isRepairCategory(category) &&
    category.options.some(
      (option) => categoryState.optionStates[option.id].decision === "DEFER",
    )
  ) {
    return "Visuelle Entscheidung vollständig · einzelne Reparaturkandidaten zurückgestellt";
  }
  if (selected.some(isDeferredOption)) return "Human-Entscheidung zurückgestellt";
  if (selected.some(isNoSuitableOption)) return "Keine Option geeignet";
  if (categoryHasMaterialSelection(category)) {
    return "Visuelle Entscheidung vollständig · Technische Zuordnung ausstehend";
  }
  return "Visuelle Entscheidung vollständig";
}

function renderGuidedOverview() {
  const snapshot = completionSnapshot();
  const recoveryMarkup = state.recoveryRequired
    ? `
      <section class="panel">
        <div class="panel-body">
          <p class="eyebrow">Entwurfswiederherstellung</p>
          <h2>Der vorhandene Entwurf ist beschädigt</h2>
          <p class="panel-copy">Eine Wiederherstellungskopie wurde lokal gesichert. Der neue Entwurf ersetzt die beschädigte Datei nur nach ausdrücklicher Bestätigung.</p>
        </div>
      </section>
    `
    : "";
  const summaryMarkup = state.package.categories
    .map((category, index) => {
      const copy = guidedCategoryCopy(category);
      const categoryState = getCategoryState(category.id);
      const choices = selectedOptions(category);
      const chosen = isRepairCategory(category)
        ? category.options
            .map((option) => {
              const optionState = categoryState.optionStates[option.id];
              const reason =
                optionState.decision === "DEFER" && String(optionState.comment || "").trim()
                  ? ` — Grund: ${String(optionState.comment).trim()}`
                  : "";
              return `${optionDisplayLabel(option)}: ${repairDispositionLabel(optionState.decision)}${reason}`;
            })
            .join(" · ")
        : choices.length
          ? choices.map((option) => optionDisplayLabel(option)).join(", ")
          : "Noch keine Auswahl";
      const comment = String(categoryState.categoryComment || "").trim();
      return `
        <article class="decision-summary-card${categoryIssues(category).length ? " is-pending" : " is-complete"}">
          <div class="decision-summary-index">${String(index + 1).padStart(2, "0")}</div>
          <div class="decision-summary-copy">
            <h2>${escapeHtml(copy.title)}</h2>
            <p class="summary-choice">${escapeHtml(chosen)}</p>
            <p class="summary-state">${escapeHtml(summaryStatus(category))}</p>
            ${comment ? `<p class="summary-comment">Kommentar: ${escapeHtml(comment)}</p>` : ""}
          </div>
          <button class="button button-quiet" type="button" data-open-category="${escapeHtml(category.id)}">Ändern</button>
        </article>
      `;
    })
    .join("");

  const resultsMarkup = state.results.length
    ? state.results
        .slice(0, 5)
        .map((result) => {
          const current = result.hashValid && result.packageCompatible;
          return `
            <li>
              <button type="button" data-open-result="${escapeHtml(result.fileName)}" ${current ? "" : "disabled"}>
                <span>
                  <strong>${escapeHtml(result.decisionDateTime || result.fileName)}</strong>
                  <small>${escapeHtml(current ? "Aktuelles Paket · Hash gültig" : "Historisch oder inkompatibel")}</small>
                </span>
                <span class="nav-status${current ? " is-complete" : ""}" aria-hidden="true"></span>
              </button>
            </li>
          `;
        })
        .join("")
    : "<li class=\"panel-copy\">Noch kein Ergebnis exportiert.</li>";

  elements["overview-view"].innerHTML = `
    <header class="view-header guided-overview-header">
      <div>
        <p class="eyebrow">Entscheidungen prüfen</p>
        <h1>Deine Crime99-Auswahl</h1>
        <p class="view-subtitle">Prüfe jede visuelle Entscheidung. Technische Zuordnungen werden später textbasiert vorbereitet und blockieren diesen Export nicht.</p>
      </div>
      <div class="guided-overview-progress">
        <strong>${snapshot.completed.length} / ${state.package.categories.length}</strong>
        <span>visuell entschieden</span>
      </div>
    </header>

    ${recoveryMarkup}

    <section class="decision-summary-list">
      ${summaryMarkup}
    </section>

    <section class="panel final-panel">
      <p class="eyebrow">Lokaler Human-Nachweis</p>
      <h2>Prüfen und exportieren</h2>
      <p class="panel-copy">Die JSON-Datei ist maßgeblich und enthält keine Bilder, Preview-Pfade oder eingebetteten Bilddaten.</p>
      <div class="final-panel-grid">
        <div class="field">
          <label for="human-identifier">Human-Name oder Kennung</label>
          <input id="human-identifier" class="input" type="text" autocomplete="name" value="${escapeHtml(state.draft.humanIdentifier)}" placeholder="Für den Export erforderlich">
        </div>
      </div>
      <label class="check-row">
        <input id="human-attestation" type="checkbox" ${state.draft.humanAttestation ? "checked" : ""}>
        <span>Ich bestätige, dass ich diese Entscheidungen lokal selbst getroffen und nicht an einen AI-Bildprüfer delegiert habe.</span>
      </label>
      <label class="check-row">
        <input id="final-confirmation" type="checkbox" ${state.draft.finalConfirmation ? "checked" : ""}>
        <span>Ich habe die Zusammenfassung geprüft und bestätige den lokalen Export.</span>
      </label>
      <div class="final-actions">
        <button id="validate-button" class="button button-secondary" type="button">Entscheidungen prüfen</button>
        <button id="finalize-button" class="button button-primary" type="button">Entscheidungen exportieren</button>
      </div>
    </section>

    <details class="panel advanced-results">
      <summary>Frühere lokale Exporte und Paketdetails</summary>
      <div class="panel-body">
        <ul class="pending-list result-list">${resultsMarkup}</ul>
        <p class="panel-copy">Paket: ${escapeHtml(state.packageHash)} · Schema ${escapeHtml(state.package.schemaVersion)}</p>
      </div>
    </details>
  `;

  elements["overview-view"].querySelectorAll("[data-open-category]").forEach((button) => {
    button.addEventListener("click", () => showCategory(button.dataset.openCategory));
  });
  elements["overview-view"].querySelectorAll("[data-open-result]").forEach((button) => {
    button.addEventListener("click", () => openCompletedResult(button.dataset.openResult));
  });
  bindValue("human-identifier", (value) => {
    state.draft.humanIdentifier = value;
  });
  bindChecked("human-attestation", (value) => {
    state.draft.humanAttestation = value;
  });
  bindChecked("final-confirmation", (value) => {
    state.draft.finalConfirmation = value;
  });
  document.getElementById("validate-button").addEventListener("click", () => validateFinal(false));
  document.getElementById("finalize-button").addEventListener("click", finalize);
}

function renderOverview() {
  if (state.guidedMode) {
    renderGuidedOverview();
  } else {
    renderLegacyOverview();
  }
}

async function openCompletedResult(fileName) {
  try {
    const payload = await requestJson(`/api/result?name=${encodeURIComponent(fileName)}`);
    elements["validation-title"].textContent = state.guidedMode
      ? "Vollständiges, hash-geprüftes JSON-Ergebnis"
      : "Completed hash-valid JSON result";
    elements["validation-body"].innerHTML = `
      <p class="panel-copy">${state.guidedMode ? "Dies ist der maßgebliche reine Textnachweis." : "This is the authoritative text-only record."}</p>
      <pre class="completed-result-json">${escapeHtml(JSON.stringify(payload.result, null, 2))}</pre>
    `;
    elements["validation-dialog"].showModal();
  } catch (error) {
    showValidation(error.details?.length ? error.details : [error.message], false);
  }
}

function toLocalDateTimeInput(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

function localDateTimeWithOffset(value) {
  if (!value) return "";
  const localDate = new Date(value);
  if (Number.isNaN(localDate.valueOf())) return value;
  const offsetMinutes = -localDate.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const minutes = String(absoluteOffset % 60).padStart(2, "0");
  const localSeconds = value.length === 16 ? `${value}:00` : value.slice(0, 19);
  return `${localSeconds}${sign}${hours}:${minutes}`;
}

function currentLocalDateTimeWithOffset() {
  const now = new Date();
  const localValue = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-") +
    `T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  return localDateTimeWithOffset(localValue);
}

function bindValue(id, callback) {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    callback(input.value);
    setDirty();
  });
}

function bindChecked(id, callback) {
  const input = document.getElementById(id);
  input.addEventListener("change", () => {
    callback(input.checked);
    setDirty();
  });
}

function optionPreviewMarkup(option) {
  const preview = option.previewAssets?.[0];
  if (!preview) {
    return `
      <div class="preview-frame">
        <div class="preview-unavailable">
          <strong>Keine visuelle Vorschau erforderlich</strong>
          Diese Option hält eine eindeutige spätere Aktion fest.
        </div>
      </div>
    `;
  }
  const previewUrl = `/api/preview?id=${encodeURIComponent(preview.id)}`;
  return `
    <div class="preview-frame" data-preview-frame="${escapeHtml(preview.id)}">
      <img src="${previewUrl}" alt="${escapeHtml(`${optionDisplayLabel(option)} — lokale Vorschau`)}" loading="lazy">
      <div class="preview-unavailable" hidden>
        <strong>Vorbereitete lokale Vorschau fehlt</strong>
        Die automatische lokale Vorbereitung ist unvollständig. Starte das Toolpaket erneut.
      </div>
      <div class="preview-tools">
        <button class="preview-tool" type="button" data-enlarge-option="${escapeHtml(option.id)}">Vergrößern</button>
        <button class="preview-tool" type="button" data-compare-option="${escapeHtml(option.id)}">Zum A/B-Vergleich</button>
      </div>
    </div>
  `;
}

function renderGuidedOption(category, option) {
  const optionState = getCategoryState(category.id).optionStates[option.id];
  const selected = optionState.decision === "SELECT";
  const rejected = optionState.decision === "REJECT";
  const deferred = optionState.decision === "DEFER";
  const repair = isRepairCategory(category);
  const badge =
    optionState.decision === "UNRESOLVED"
      ? ""
      : `<span class="guided-selected-badge">${escapeHtml(
          repair ? repairDispositionLabel(optionState.decision) : selected ? "Ausgewählt" : "Nicht verwendet",
        )}</span>`;
  const decisionButtons = repair
    ? [
        ["SELECT", "Verwenden", "guided-select"],
        ["REJECT", "Nicht verwenden", "guided-reject"],
        ["DEFER", "Später entscheiden", "guided-defer"],
      ]
        .map(
          ([decision, label, buttonClass]) =>
            `<button class="decision-button ${buttonClass}${optionState.decision === decision ? " is-active" : ""}" type="button" data-decision="${decision}" data-option-id="${escapeHtml(option.id)}" aria-pressed="${optionState.decision === decision}">${label}</button>`,
        )
        .join("")
    : `
        <button class="decision-button guided-select${selected ? " is-active" : ""}" type="button" data-decision="SELECT" data-option-id="${escapeHtml(option.id)}" aria-pressed="${selected}">
          ${isDeferredOption(option) ? "Später entscheiden" : isNoSuitableOption(option) ? "Keine Option ist geeignet" : "Diese Option verwenden"}
        </button>
        <button class="decision-button guided-reject${rejected ? " is-active" : ""}" type="button" data-decision="REJECT" data-option-id="${escapeHtml(option.id)}" aria-pressed="${rejected}">Nicht verwenden</button>
      `;
  const deferredReason = repair && deferred
    ? `
        <label class="field guided-deferred-reason">
          <span class="field-label">Grund für „Später entscheiden“</span>
          <textarea class="textarea" data-option-comment="${escapeHtml(option.id)}" placeholder="Warum soll dieser Reparaturkandidat später entschieden werden?">${escapeHtml(optionState.comment || "")}</textarea>
        </label>
      `
    : "";
  const technical = {
    technicalName: option.technicalName || null,
    technicalMetadata: option.technicalMetadata || {},
    implementationMetadata: option.implementationMetadata || {},
  };
  return `
    <article class="option-card guided-option-card${selected ? " is-selected" : ""}${rejected ? " is-rejected" : ""}${deferred ? " is-deferred" : ""}" data-option-card="${escapeHtml(option.id)}">
      ${optionPreviewMarkup(option)}
      <div class="option-content">
        <div class="option-heading">
          <div>
            <h2>${escapeHtml(optionDisplayLabel(option))}</h2>
          </div>
          ${badge}
        </div>
        <div class="decision-buttons guided-decision-buttons${repair ? " is-repair" : ""}" aria-label="Entscheidung für ${escapeHtml(optionDisplayLabel(option))}">
          ${decisionButtons}
        </div>
        ${deferredReason}
        <details class="technical-details">
          <summary>Technische Details</summary>
          <pre>${escapeHtml(JSON.stringify(technical, null, 2))}</pre>
        </details>
      </div>
    </article>
  `;
}

function renderOption(category, option) {
  if (state.guidedMode) return renderGuidedOption(category, option);
  const optionState = getCategoryState(category.id).optionStates[option.id];
  const cardClass =
    optionState.decision === "SELECT"
      ? " is-selected"
      : optionState.decision === "REJECT"
        ? " is-rejected"
        : optionState.decision === "DEFER"
          ? " is-deferred"
          : "";
  const rules = mergedRules(category);
  const technical = {
    technicalName: option.technicalName || null,
    technicalMetadata: option.technicalMetadata || {},
    implementationMetadata: option.implementationMetadata || {},
  };
  const explicitDeferralOption =
    option.technicalName === "DEFER" ||
    option.implementationMetadata?.geometryAction === "deferred";
  const decisions = rules.allowDeferred
    ? ["SELECT", "REJECT", "DEFER"]
    : ["SELECT", "REJECT"];
  const rankMarkup =
    category.selectionMode === "ordered"
      ? `
        <label class="rank-field">
          <span>Preference rank (1 is highest)</span>
          <input class="input" type="number" min="1" step="1" data-rank-option="${escapeHtml(option.id)}" value="${optionState.rank ?? ""}" ${optionState.decision !== "SELECT" ? "disabled" : ""}>
        </label>
      `
      : "";
  return `
    <article class="option-card${cardClass}" data-option-card="${escapeHtml(option.id)}">
      ${optionPreviewMarkup(option)}
      <div class="option-content">
        <div class="option-heading">
          <div>
            <h2>${escapeHtml(option.label)}</h2>
            <p class="option-source">${escapeHtml(option.sourceLabel || option.technicalName || "Decision option")}</p>
          </div>
          <span class="decision-pill ${escapeHtml(optionState.decision)}">${escapeHtml(optionState.decision)}</span>
        </div>
        <p class="option-description">${escapeHtml(option.description || "No additional Human-facing description.")}</p>
        ${
          explicitDeferralOption
            ? `<p class="panel-copy"><strong>Explicit deferral option:</strong> choose SELECT, complete its required Human reason or fields, then mark this category Complete.</p>`
            : ""
        }
        <div class="decision-buttons" aria-label="Decision for ${escapeHtml(option.label)}">
          ${decisions
            .map((decision) => {
              const active = optionState.decision === decision ? " is-active" : "";
              return `<button class="decision-button${active}" type="button" data-decision="${decision}" data-option-id="${escapeHtml(option.id)}" aria-pressed="${optionState.decision === decision}">${decision}</button>`;
            })
            .join("")}
        </div>
        ${rankMarkup}
        <details class="technical-details">
          <summary>Technical details</summary>
          <pre>${escapeHtml(JSON.stringify(technical, null, 2))}</pre>
        </details>
        <label class="field">
          <span class="field-label">Option comment</span>
          <textarea class="textarea" data-option-comment="${escapeHtml(option.id)}" placeholder="Human observation, concern, or exact option-specific instruction">${escapeHtml(optionState.comment || "")}</textarea>
        </label>
      </div>
    </article>
  `;
}

function renderLegacyCategory() {
  const category = getCategory(state.currentCategoryId);
  const categoryState = getCategoryState(category.id);
  const rules = mergedRules(category);
  const modeLabels = {
    single: "Single choice — select exactly one option",
    multiple: "Multiple choice — select every option you approve",
    ordered: "Ordered preference — select and rank options",
    approveReject: "Approve/reject — decide every option",
  };
  const optionalStatuses = [
    { value: "UNRESOLVED", label: "Pending" },
    { value: "COMPLETED", label: "Complete" },
    ...(rules.allowDeferred ? [{ value: "DEFERRED", label: "Deferred" }] : []),
    ...(rules.allowNotApplicable ? [{ value: "NOT_APPLICABLE", label: "Not applicable" }] : []),
  ];

  const fieldsMarkup = (category.implementationFields || [])
    .map((field) => {
      const value = categoryState.fields[field.id] ?? "";
      let input;
      if (field.type === "textarea") {
        input = `<textarea class="textarea" data-implementation-field="${escapeHtml(field.id)}">${escapeHtml(value)}</textarea>`;
      } else if (field.type === "select") {
        input = `
          <select class="select" data-implementation-field="${escapeHtml(field.id)}">
            <option value="">Choose…</option>
            ${(field.choices || []).map((choice) => `<option value="${escapeHtml(choice)}" ${value === choice ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
          </select>
        `;
      } else {
        const numberConstraints =
          field.type === "number"
            ? `${Number.isFinite(field.minimum) ? ` min="${field.minimum}"` : ""}${Number.isFinite(field.maximum) ? ` max="${field.maximum}"` : ""} step="any"`
            : "";
        const textPattern =
          field.type === "text" && field.pattern
            ? ` pattern="${escapeHtml(field.pattern)}"`
            : "";
        input = `<input class="input" type="${field.type === "number" ? "number" : "text"}" data-implementation-field="${escapeHtml(field.id)}" value="${escapeHtml(value)}"${numberConstraints}${textPattern}>`;
      }
      return `
        <label class="field">
          <span class="field-label">${escapeHtml(field.label)}</span>
          ${input}
          ${field.description ? `<small>${escapeHtml(field.description)}</small>` : ""}
        </label>
      `;
    })
    .join("");

  const notApplicableMarkup =
    categoryState.status === "NOT_APPLICABLE"
      ? `
        <label class="field not-applicable-reason">
          <span class="field-label">Human-authored NOT APPLICABLE reason</span>
          <textarea class="textarea" id="not-applicable-reason">${escapeHtml(categoryState.notApplicableReason || "")}</textarea>
        </label>
      `
      : "";

  elements["category-view"].innerHTML = `
    <header class="view-header">
      <div>
        <p class="eyebrow">Decision category</p>
        <h1>${escapeHtml(category.title)}</h1>
        <p class="view-subtitle">${escapeHtml(category.description)}</p>
      </div>
    </header>

    <div class="category-toolbar">
      <span class="mode-note">${escapeHtml(modeLabels[category.selectionMode])}</span>
      <div class="status-control" aria-label="Category completion state">
        ${optionalStatuses
          .map(
            (item) => `
              <button class="status-button${categoryState.status === item.value ? " is-active" : ""}" type="button" data-category-status="${item.value}">
                ${escapeHtml(item.label)}
              </button>
            `,
          )
          .join("")}
      </div>
    </div>

    <div class="option-grid">
      ${category.options.map((option) => renderOption(category, option)).join("")}
    </div>

    <section class="panel category-inputs">
      <label class="field">
        <span class="field-label">Category comment</span>
        <textarea id="category-comment" class="textarea" placeholder="Human rationale, comparison notes, or deferral reason">${escapeHtml(categoryState.categoryComment || "")}</textarea>
      </label>
      <label class="field">
        <span class="field-label">Implementation note</span>
        <textarea id="implementation-note" class="textarea" placeholder="Exact downstream implementation instruction">${escapeHtml(categoryState.implementationNote || "")}</textarea>
      </label>
      <label class="field wide">
        <span class="field-label">Exception or concern</span>
        <textarea id="exception-concern" class="textarea" placeholder="Write NONE when there is no exception or concern">${escapeHtml(categoryState.exceptionOrConcern || "")}</textarea>
      </label>
      ${fieldsMarkup}
    </section>
    ${notApplicableMarkup}
  `;

  bindCategoryEvents(category);
}

function guidedImplementationFieldsMarkup(category, categoryState) {
  return (category.implementationFields || [])
    .map((field) => {
      const value = categoryState.fields[field.id] ?? "";
      let input;
      if (field.type === "textarea") {
        input = `<textarea class="textarea" data-implementation-field="${escapeHtml(field.id)}">${escapeHtml(value)}</textarea>`;
      } else if (field.type === "select") {
        input = `
          <select class="select" data-implementation-field="${escapeHtml(field.id)}">
            <option value="">Nicht festgelegt</option>
            ${(field.choices || []).map((choice) => `<option value="${escapeHtml(choice)}" ${value === choice ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
          </select>
        `;
      } else {
        const numberConstraints =
          field.type === "number"
            ? `${Number.isFinite(field.minimum) ? ` min="${field.minimum}"` : ""}${Number.isFinite(field.maximum) ? ` max="${field.maximum}"` : ""} step="any"`
            : "";
        input = `<input class="input" type="${field.type === "number" ? "number" : "text"}" data-implementation-field="${escapeHtml(field.id)}" value="${escapeHtml(value)}"${numberConstraints}>`;
      }
      return `
        <label class="field">
          <span class="field-label">${escapeHtml(field.label)}</span>
          ${input}
          ${field.description ? `<small>${escapeHtml(field.description)}</small>` : ""}
        </label>
      `;
    })
    .join("");
}

function renderGuidedCategory() {
  const category = getCategory(state.currentCategoryId);
  const categoryState = getCategoryState(category.id);
  const copy = guidedCategoryCopy(category);
  const categoryIndex = state.package.categories.findIndex((item) => item.id === category.id);
  const modeText =
    isRepairCategory(category)
      ? "Entscheide jeden Kandidaten: Verwenden, Nicht verwenden oder Später entscheiden."
      : category.selectionMode === "multiple"
      ? "Du kannst eine oder mehrere Optionen auswählen."
      : "Wähle genau eine Option.";
  const fieldsMarkup = guidedImplementationFieldsMarkup(category, categoryState);
  elements["category-view"].innerHTML = `
    <header class="view-header guided-category-header">
      <div>
        <p class="eyebrow">Entscheidung ${categoryIndex + 1} von ${state.package.categories.length}</p>
        <h1>${escapeHtml(copy.title)}</h1>
        <p class="view-subtitle">${escapeHtml(copy.explanation)}</p>
        <p class="mode-note guided-mode-note">${escapeHtml(modeText)}</p>
      </div>
    </header>

    <div class="option-grid guided-option-grid">
      ${category.options.map((option) => renderOption(category, option)).join("")}
    </div>

    <section class="panel guided-comment-panel">
      <label class="field">
        <span class="field-label">Optionaler Kommentar</span>
        <textarea id="category-comment" class="textarea" placeholder="Was soll später berücksichtigt werden?">${escapeHtml(categoryState.categoryComment || "")}</textarea>
      </label>
    </section>

    <details class="panel technical-details guided-technical-panel">
      <summary>Technische Details</summary>
      <div class="panel-body">
        <p class="panel-copy">Diese Angaben sind für die visuelle Entscheidung nicht erforderlich. Fehlende Zuordnungen werden als TECHNICAL MAPPING PENDING exportiert.</p>
        <label class="field">
          <span class="field-label">Technischer Umsetzungsstatus</span>
          <textarea id="implementation-note" class="textarea" readonly>${escapeHtml(categoryState.implementationNote || "")}</textarea>
        </label>
        <label class="field">
          <span class="field-label">Ausnahme oder technischer Hinweis</span>
          <textarea id="exception-concern" class="textarea">${escapeHtml(categoryState.exceptionOrConcern || "")}</textarea>
        </label>
        <div class="technical-field-grid">${fieldsMarkup}</div>
      </div>
    </details>

    <div class="guided-actions">
      <button class="button button-quiet" type="button" data-guided-back>Zurück</button>
      <button class="button button-primary" type="button" data-guided-next>${categoryIndex === state.package.categories.length - 1 ? "Auswahl speichern und Entscheidungen prüfen" : "Auswahl speichern und weiter"}</button>
    </div>
  `;
  bindCategoryEvents(category);
}

function renderCategory() {
  if (state.guidedMode) {
    renderGuidedCategory();
  } else {
    renderLegacyCategory();
  }
}

function guidedImplementationStatus(category) {
  const categoryState = getCategoryState(category.id);
  const selected = selectedOptions(category);
  if (isRepairCategory(category)) {
    const deferredNames = category.options
      .filter((option) => categoryState.optionStates[option.id].decision === "DEFER")
      .map((option) => option.technicalName || option.id);
    if (selected.length) {
      return deferredNames.length
        ? `${TECHNICAL_MAPPING_PENDING} Deferred repair candidates: ${deferredNames.join(", ")}.`
        : TECHNICAL_MAPPING_PENDING;
    }
    if (deferredNames.length) {
      return `HUMAN DECISION DEFERRED — repair candidates pending: ${deferredNames.join(", ")}; no Crime99 mutation is authorised.`;
    }
    return NO_SUITABLE_REPAIR_OPTION;
  }
  if (selected.some(isDeferredOption)) {
    return HUMAN_DECISION_DEFERRED;
  }
  if (selected.some(isNoSuitableOption)) {
    return NO_SUITABLE_OPTION;
  }
  if (categoryHasMaterialSelection(category)) {
    return TECHNICAL_MAPPING_PENDING;
  }
  return GEOMETRY_MAPPING_PENDING;
}

async function completeGuidedCategoryAndContinue(category) {
  const categoryState = getCategoryState(category.id);
  categoryState.status = "COMPLETED";
  categoryState.implementationNote = guidedImplementationStatus(category);
  const errors = categoryIssues(category);
  if (errors.length) {
    categoryState.status = "UNRESOLVED";
    categoryState.implementationNote = "";
    renderCategory();
    renderNavigation();
    toast(
      isRepairCategory(category)
        ? "Entscheide jeden Reparaturkandidaten und ergänze bei „Später entscheiden“ einen Grund."
        : category.selectionMode === "multiple"
        ? "Wähle mindestens eine Option, bevor du fortfährst."
        : "Wähle genau eine Option, bevor du fortfährst.",
      true,
    );
    return;
  }
  setDirty();
  renderNavigation();
  await saveDraft();
  const index = state.package.categories.findIndex((item) => item.id === category.id);
  if (index < state.package.categories.length - 1) {
    showCategory(state.package.categories[index + 1].id);
  } else {
    showOverview();
  }
}

function bindCategoryEvents(category) {
  const categoryState = getCategoryState(category.id);
  elements["category-view"].querySelectorAll("[data-category-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const previousStatus = categoryState.status;
      categoryState.status = button.dataset.categoryStatus;
      if (
        previousStatus === "NOT_APPLICABLE" &&
        categoryState.status !== "NOT_APPLICABLE"
      ) {
        categoryState.notApplicableReason = "";
      }
      if (categoryState.status === "DEFERRED") {
        categoryState.notApplicableReason = "";
      }
      if (["DEFERRED", "NOT_APPLICABLE"].includes(categoryState.status)) {
        Object.values(categoryState.optionStates).forEach((optionState) => {
          optionState.decision = "UNRESOLVED";
          optionState.rank = null;
        });
        Object.keys(categoryState.fields).forEach((fieldId) => {
          categoryState.fields[fieldId] = "";
        });
        categoryState.implementationNote = "";
      }
      setDirty();
      renderCategory();
      renderNavigation();
    });
  });

  elements["category-view"].querySelectorAll("[data-option-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const optionId = button.dataset.optionId;
      const decision = button.dataset.decision;
      const optionState = categoryState.optionStates[optionId];
      const nextDecision = optionState.decision === decision ? "UNRESOLVED" : decision;
      if (nextDecision === optionState.decision) return;
      invalidateCompletedCategory(categoryState);
      if (category.selectionMode === "single" && nextDecision === "SELECT") {
        Object.values(categoryState.optionStates).forEach((candidate) => {
          if (candidate.decision === "SELECT") candidate.decision = "UNRESOLVED";
        });
      }
      if (category.selectionMode === "multiple" && nextDecision === "SELECT") {
        const selectedOption = category.options.find((item) => item.id === optionId);
        if (selectedOption?.exclusiveSelection) {
          Object.entries(categoryState.optionStates).forEach(([candidateId, candidate]) => {
            if (candidateId !== optionId && candidate.decision === "SELECT") {
              candidate.decision = "UNRESOLVED";
              candidate.rank = null;
            }
          });
        } else {
          category.options
            .filter((item) => item.exclusiveSelection)
            .forEach((exclusiveOption) => {
              const candidate = categoryState.optionStates[exclusiveOption.id];
              if (candidate.decision === "SELECT") {
                candidate.decision = "UNRESOLVED";
                candidate.rank = null;
              }
            });
        }
      }
      optionState.decision = nextDecision;
      if (nextDecision !== "SELECT") optionState.rank = null;
      if (isRepairCategory(category) && nextDecision !== "DEFER") optionState.comment = "";
      setDirty();
      renderCategory();
      renderNavigation();
    });
  });

  elements["category-view"].querySelectorAll("[data-option-comment]").forEach((input) => {
    input.addEventListener("input", () => {
      invalidateCompletedCategory(categoryState);
      categoryState.optionStates[input.dataset.optionComment].comment = input.value;
      setDirty();
      renderNavigation();
    });
  });

  elements["category-view"].querySelectorAll("[data-rank-option]").forEach((input) => {
    input.addEventListener("input", () => {
      invalidateCompletedCategory(categoryState);
      const raw = input.value;
      categoryState.optionStates[input.dataset.rankOption].rank =
        raw === "" ? null : Number.parseInt(raw, 10);
      setDirty();
      renderNavigation();
    });
  });

  elements["category-view"].querySelectorAll("[data-implementation-field]").forEach((input) => {
    input.addEventListener("input", () => {
      invalidateCompletedCategory(categoryState);
      const field = (category.implementationFields || []).find(
        (candidate) => candidate.id === input.dataset.implementationField,
      );
      categoryState.fields[input.dataset.implementationField] =
        field?.type === "number"
          ? input.value === ""
            ? ""
            : input.valueAsNumber
          : input.value;
      setDirty();
      renderNavigation();
    });
  });

  document.getElementById("category-comment").addEventListener("input", (event) => {
    invalidateCompletedCategory(categoryState);
    categoryState.categoryComment = event.target.value;
    setDirty();
    renderNavigation();
  });
  document.getElementById("implementation-note").addEventListener("input", (event) => {
    categoryState.implementationNote = event.target.value;
    setDirty();
  });
  document.getElementById("exception-concern").addEventListener("input", (event) => {
    invalidateCompletedCategory(categoryState);
    categoryState.exceptionOrConcern = event.target.value;
    setDirty();
    renderNavigation();
  });
  document.getElementById("not-applicable-reason")?.addEventListener("input", (event) => {
    invalidateCompletedCategory(categoryState);
    categoryState.notApplicableReason = event.target.value;
    setDirty();
    renderNavigation();
  });

  elements["category-view"].querySelectorAll("[data-preview-frame]").forEach((frame) => {
    const image = frame.querySelector("img");
    image.addEventListener("error", () => {
      image.hidden = true;
      frame.querySelector(".preview-unavailable").hidden = false;
    });
  });
  elements["category-view"].querySelectorAll("[data-enlarge-option]").forEach((button) => {
    button.addEventListener("click", () => openPreviewDialog([button.dataset.enlargeOption]));
  });
  elements["category-view"].querySelectorAll("[data-compare-option]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      state.comparison.some(
        (item) => item.categoryId === category.id && item.optionId === button.dataset.compareOption,
      ),
    );
    button.setAttribute(
      "aria-pressed",
      String(
        state.comparison.some(
          (item) => item.categoryId === category.id && item.optionId === button.dataset.compareOption,
        ),
      ),
    );
    button.addEventListener("click", () => toggleComparison(category.id, button.dataset.compareOption));
  });
  elements["category-view"].querySelector("[data-guided-back]")?.addEventListener("click", () => {
    const index = state.package.categories.findIndex((item) => item.id === category.id);
    if (index > 0) showCategory(state.package.categories[index - 1].id);
    else showOverview();
  });
  elements["category-view"].querySelector("[data-guided-next]")?.addEventListener(
    "click",
    () => completeGuidedCategoryAndContinue(category),
  );
}

function toggleComparison(categoryId, optionId) {
  const existingIndex = state.comparison.findIndex(
    (item) => item.categoryId === categoryId && item.optionId === optionId,
  );
  if (existingIndex >= 0) {
    state.comparison.splice(existingIndex, 1);
  } else {
    if (state.comparison.length >= 2) state.comparison.shift();
    state.comparison.push({ categoryId, optionId });
  }
  renderComparisonTray();
  if (state.currentCategoryId) renderCategory();
}

function comparisonOption(item) {
  const category = getCategory(item.categoryId);
  const option = category.options.find((candidate) => candidate.id === item.optionId);
  return { category, option };
}

function renderComparisonTray() {
  elements["comparison-tray"].hidden = state.comparison.length === 0;
  const labels = state.comparison.map((item) =>
    optionDisplayLabel(comparisonOption(item).option),
  );
  elements["comparison-selection"].textContent = labels.length
    ? labels.join(" ↔ ")
    : state.guidedMode
      ? "Wähle zwei Vorschauen."
      : "Choose two preview options.";
  elements["open-comparison"].disabled = state.comparison.length !== 2;
}

function openPreviewDialog(optionIds) {
  let selections;
  if (optionIds.length === 1) {
    const category = getCategory(state.currentCategoryId);
    const option = category.options.find((item) => item.id === optionIds[0]);
    selections = [{ category, option }];
  } else {
    selections = state.comparison.map(comparisonOption);
  }
  elements["preview-dialog-kicker"].textContent =
    selections.length === 2
      ? state.guidedMode
        ? "Human A/B-Vergleich"
        : "Human A/B comparison"
      : state.guidedMode
        ? "Lokale Vorschau"
        : "Local preview";
  elements["preview-dialog-title"].textContent =
    selections.length === 2
      ? `${optionDisplayLabel(selections[0].option)} ↔ ${optionDisplayLabel(selections[1].option)}`
      : optionDisplayLabel(selections[0].option);
  elements["preview-dialog-body"].innerHTML = selections
    .map(({ category, option }) => {
      const preview = option.previewAssets?.[0];
      if (!preview) {
        return `
          <div class="dialog-preview">
            <div class="preview-unavailable">
              <strong>Keine visuelle Vorschau erforderlich</strong>
              Diese Option hält eine eindeutige spätere Aktion fest.
            </div>
            <div class="dialog-preview-copy">
              <strong>${escapeHtml(optionDisplayLabel(option))}</strong>
              <small>${escapeHtml(guidedCategoryCopy(category).title)}</small>
            </div>
          </div>
        `;
      }
      return `
        <div class="dialog-preview">
          <img src="/api/preview?id=${encodeURIComponent(preview.id)}" alt="${escapeHtml(`${optionDisplayLabel(option)} — lokale Vorschau`)}">
          <div class="dialog-preview-copy">
            <strong>${escapeHtml(optionDisplayLabel(option))}</strong>
            <small>${escapeHtml(guidedCategoryCopy(category).title)} · lokale Vorschau</small>
          </div>
        </div>
      `;
    })
    .join("");
  elements["preview-dialog-body"].querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const replacement = document.createElement("div");
      replacement.className = "preview-unavailable";
      replacement.innerHTML =
        "<strong>Vorbereitete lokale Vorschau fehlt</strong>Starte das lokale Toolpaket erneut, damit die automatische Registrierung geprüft wird.";
      image.replaceWith(replacement);
    });
  });
  elements["preview-dialog"].showModal();
}

function confirmDraftRecoveryReplacement() {
  if (!state.recoveryRequired) return true;
  return window.confirm(
    state.guidedMode
      ? "Der vorhandene gespeicherte Entwurf ist beschädigt. Eine Wiederherstellungskopie wurde aufbewahrt. Fahre nur fort, wenn dieser neue Entwurf den beschädigten Entwurf ersetzen soll."
      : "The existing saved draft is malformed. A recovery copy was preserved. " +
          "Continue only if you explicitly want this new draft to replace the malformed saved draft.",
  );
}

async function saveDraft() {
  if (state.saving) return;
  if (!confirmDraftRecoveryReplacement()) return;
  state.saving = true;
  const savingRevision = state.revision;
  updateSaveState();
  try {
    const savedAt = new Date().toISOString();
    const payload = await requestJson("/api/draft", {
      method: "POST",
      body: JSON.stringify({
        draft: state.draft,
        savedAt,
        confirmReplaceMalformedDraft: state.recoveryRequired,
      }),
    });
    state.recoveryRequired = false;
    state.recoveryFile = null;
    state.recoveryMessage = "";
    state.lastSavedAt = payload.lastSavedAt;
    if (state.revision === savingRevision) {
      state.dirty = false;
      toast(state.guidedMode ? "Auswahl lokal gespeichert." : "Draft saved locally.");
    } else {
      state.dirty = true;
      toast(
        state.guidedMode
          ? "Frühere Änderungen wurden gespeichert; neuere Änderungen sind noch offen."
          : "Earlier changes were saved; newer edits still need saving.",
      );
    }
  } catch (error) {
    toast(state.guidedMode ? guidedErrorText(error.message) : error.message, true);
  } finally {
    state.saving = false;
    updateSaveState();
    if (state.currentCategoryId === null) renderOverview();
  }
}

async function validateFinal(showSuccess = true) {
  try {
    const payload = await requestJson("/api/validate", {
      method: "POST",
      body: JSON.stringify({ draft: state.draft, final: true }),
    });
    showValidation(payload.errors, showSuccess);
    return payload.valid;
  } catch (error) {
    showValidation([error.message, ...(error.details || [])], false);
    return false;
  }
}

function guidedErrorText(error) {
  let text = String(error || "Unbekannter lokaler Fehler.");
  for (const category of state.package?.categories || []) {
    if (text.startsWith(`${category.title}:`)) {
      text = `${guidedCategoryCopy(category).title}:${text.slice(category.title.length + 1)}`;
      break;
    }
    if (text.startsWith(`${category.title} / `)) {
      text = `${guidedCategoryCopy(category).title} / ${text.slice(category.title.length + 3)}`;
      break;
    }
  }
  const replacements = [
    ["Human identifier must be non-empty text.", "Human-Name oder Kennung ist erforderlich."],
    ["Decision date and time must be non-empty text.", "Entscheidungsdatum und -zeit fehlen."],
    ["Human attestation must be confirmed.", "Die Human-Bestätigung muss gesetzt sein."],
    ["Explicit final confirmation is required.", "Die ausdrückliche Exportbestätigung fehlt."],
    ["select exactly one option.", "Wähle genau eine Option."],
    ["select at least 1 option(s).", "Wähle mindestens eine Option."],
    ["decide every option", "Entscheide jeden Kandidaten"],
    ["DEFER requires a Human reason.", "„Später entscheiden“ benötigt einen Human-Grund."],
    ["derived implementation status does not match the current decisions.", "Der technische Umsetzungsstatus passt nicht zu den aktuellen Entscheidungen."],
    ["category is not marked complete.", "Die Entscheidung ist noch nicht vollständig abgeschlossen."],
    ["Finalisation is blocked", "Der Export ist gesperrt"],
  ];
  for (const [source, replacement] of replacements) {
    text = text.replace(source, replacement);
  }
  return text;
}

function showValidation(errors, showSuccess = true, result = null) {
  if (errors.length) {
    const displayedErrors = errors.map((error) => ({
      raw: String(error),
      display: state.guidedMode ? guidedErrorText(error) : String(error),
    }));
    elements["validation-title"].textContent = state.guidedMode
      ? `${errors.length} Punkt${errors.length === 1 ? "" : "e"} noch offen`
      : `${errors.length} item${errors.length === 1 ? "" : "s"} need attention`;
    elements["validation-body"].innerHTML = `
      <p class="panel-copy">${state.guidedMode ? "Der Export bleibt gesperrt, bis jede visuelle Entscheidung und der lokale Human-Nachweis vollständig sind." : "Finalisation is blocked until every required decision and Human field is complete."}</p>
      <ul class="validation-list">
        ${displayedErrors
          .map(({ raw, display }) => {
            const category = state.package.categories.find((item) =>
              raw.startsWith(`${item.title}:`) || raw.startsWith(`${item.title} / `),
            );
            return `
              <li>
                <span>${escapeHtml(display)}</span>
                ${category ? `<button class="text-button" type="button" data-fix-category="${escapeHtml(category.id)}">${state.guidedMode ? "Entscheidung öffnen" : "Open category"}</button>` : ""}
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  } else if (result) {
    elements["validation-title"].textContent = state.guidedMode ? "Entscheidungen exportiert" : "Decision record exported";
    elements["validation-body"].innerHTML = `
      <div class="validation-success">
        ${state.guidedMode ? "JSON und Markdown wurden lokal geschrieben. JSON ist maßgeblich." : "Final JSON and Markdown were written locally. JSON is authoritative."}
        <div class="result-files">
          ${state.guidedMode ? "Ergebnis-Hash" : "Result hash"}: ${escapeHtml(result.resultHash)}<br>
          JSON: ${escapeHtml(result.jsonFile)}<br>
          Markdown: ${escapeHtml(result.markdownFile)}
        </div>
      </div>
    `;
  } else if (showSuccess) {
    elements["validation-title"].textContent = state.guidedMode ? "Alle Entscheidungen vollständig" : "Completion check passed";
    elements["validation-body"].innerHTML = `
      <div class="validation-success">
        ${state.guidedMode ? "Alle visuellen Entscheidungen und Human-Felder sind vollständig. Der lokale Text-Export ist bereit." : "Every required decision and final Human field is complete. You can finalise and export the deterministic text record."}
      </div>
    `;
  } else {
    return;
  }
  elements["validation-body"].querySelectorAll("[data-fix-category]").forEach((button) => {
    button.addEventListener("click", () => {
      elements["validation-dialog"].close();
      showCategory(button.dataset.fixCategory);
    });
  });
  if (!elements["validation-dialog"].open) elements["validation-dialog"].showModal();
}

async function finalize() {
  if (!(await validateFinal(false))) return;
  if (!confirmDraftRecoveryReplacement()) return;
  const finalizeRevision = state.revision;
  state.saving = true;
  updateSaveState();
  try {
    const savedAt = new Date().toISOString();
    const result = await requestJson("/api/finalize", {
      method: "POST",
      body: JSON.stringify({
        draft: state.draft,
        savedAt,
        confirmReplaceMalformedDraft: state.recoveryRequired,
      }),
    });
    state.recoveryRequired = false;
    state.recoveryFile = null;
    state.recoveryMessage = "";
    state.lastSavedAt = savedAt;
    state.results = (await requestJson("/api/results")).results;
    state.dirty = state.revision !== finalizeRevision;
    showValidation([], true, result);
  } catch (error) {
    showValidation(error.details?.length ? error.details : [error.message], false);
  } finally {
    state.saving = false;
    updateSaveState();
  }
}

function jumpToNextPending() {
  const pending = completionSnapshot().pending;
  if (pending.length) showCategory(pending[0].id);
  else showOverview();
}

function toast(message, isError = false) {
  const item = document.createElement("div");
  item.className = `toast${isError ? " is-error" : ""}`;
  item.textContent = message;
  elements["toast-region"].append(item);
  window.setTimeout(() => item.remove(), 4200);
}

function bindGlobalEvents() {
  elements["overview-nav"].addEventListener("click", showOverview);
  elements["save-button"].addEventListener("click", saveDraft);
  elements["jump-pending"].addEventListener("click", jumpToNextPending);
  elements["clear-comparison"].addEventListener("click", () => {
    state.comparison = [];
    renderComparisonTray();
    if (state.currentCategoryId) renderCategory();
  });
  elements["open-comparison"].addEventListener("click", () => openPreviewDialog([]));
  document.querySelectorAll(".dialog-close").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
  window.addEventListener("beforeunload", (event) => {
    if (!state.dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

async function initialise() {
  cacheElements();
  bindGlobalEvents();
  try {
    const [packageResponse, draftResponse, resultsResponse] = await Promise.all([
      requestJson("/api/package"),
      requestJson("/api/draft"),
      requestJson("/api/results"),
    ]);
    state.package = packageResponse.package;
    state.packageHash = packageResponse.sourcePackageHash;
    state.guidedMode =
      state.package.decisionSetId === "crime99-surface-material-human-selection-v1";
    state.draft = draftResponse.draft;
    if (state.guidedMode && !state.draft.decisionDateTime) {
      state.draft.decisionDateTime = currentLocalDateTimeWithOffset();
    }
    state.lastSavedAt = draftResponse.lastSavedAt;
    state.recoveryRequired = Boolean(draftResponse.recoveryRequired);
    state.recoveryFile = draftResponse.recoveryFile;
    state.recoveryMessage = draftResponse.loadError || "";
    state.results = resultsResponse.results;
    elements["package-identity"].textContent =
      `${state.package.decisionSetId} · package ${state.packageHash.slice(0, 12)}…`;
    document.title = `${state.package.title} — Human Visual Decision Tool`;
    elements["loading-screen"].hidden = true;
    elements["app-shell"].hidden = false;
    updateSaveState();
    renderNavigation();
    renderComparisonTray();
    if (state.guidedMode) {
      showCategory(state.package.categories[0].id);
    } else {
      showOverview();
    }
    if (draftResponse.loadError) {
      toast(
        state.guidedMode
          ? "Der gespeicherte Entwurf konnte nicht geladen werden. Eine Wiederherstellungskopie wurde lokal gesichert."
          : draftResponse.loadError,
        true,
      );
    }
  } catch (error) {
    elements["loading-screen"].innerHTML = `
      <div class="loading-mark" aria-hidden="true">!</div>
      <p>Das lokale Entscheidungspaket konnte nicht geöffnet werden.</p>
      <p class="panel-copy">Prüfe das lokale Paket und starte das Tool erneut.</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initialise);
