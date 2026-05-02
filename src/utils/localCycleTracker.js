// Local-only storage for the basal temperature & cervical fluid tracker.
// All data lives in localStorage. Nothing is sent off-device.

const ENTRIES_KEY = "cycleTrackerEntries";
const CONSENT_KEY = "cycleTrackerConsent";

export const FLUID_OPTIONS = [
  "not-observed",
  "dry",
  "sticky",
  "creamy",
  "watery",
  "egg-white",
  "not-sure",
];

export const BLEEDING_OPTIONS = ["none", "light", "medium", "heavy"];

export const TEMP_MIN = 35.0;
export const TEMP_MAX = 38.5;

function safeStorage() {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function hasConsent() {
  const s = safeStorage();
  if (!s) return false;
  try {
    return s.getItem(CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function grantConsent() {
  const s = safeStorage();
  if (!s) return false;
  try {
    s.setItem(CONSENT_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function revokeConsent() {
  const s = safeStorage();
  if (!s) return;
  try {
    s.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
}

export function loadEntries() {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidStoredEntry);
  } catch {
    return [];
  }
}

function isValidStoredEntry(e) {
  return e && typeof e === "object" && typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date);
}

function persistEntries(entries) {
  const s = safeStorage();
  if (!s) return false;
  try {
    s.setItem(ENTRIES_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function clearAllEntries() {
  const s = safeStorage();
  if (!s) return;
  try {
    s.removeItem(ENTRIES_KEY);
  } catch {
    /* ignore */
  }
}

export function findEntryByDate(entries, date) {
  return entries.find((e) => e.date === date) || null;
}

export function upsertEntry(entries, entry) {
  const next = entries.filter((e) => e.date !== entry.date);
  next.push(entry);
  next.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  persistEntries(next);
  return next;
}

export function validateEntry({ date, temperature, fluid, bleeding, notes }, messages) {
  const errors = {};

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = messages.errDate;
  }

  let tempValue = null;
  if (temperature !== "" && temperature !== null && temperature !== undefined) {
    const n = Number(String(temperature).replace(",", "."));
    if (!Number.isFinite(n) || n < TEMP_MIN || n > TEMP_MAX) {
      errors.temperature = messages.errTemperature;
    } else {
      tempValue = Math.round(n * 100) / 100;
    }
  }

  const fluidValue = fluid && FLUID_OPTIONS.includes(fluid) ? fluid : null;
  const bleedingValue = bleeding && BLEEDING_OPTIONS.includes(bleeding) ? bleeding : null;
  const notesValue = typeof notes === "string" ? notes.trim().slice(0, 500) : "";

  return {
    errors,
    entry: Object.keys(errors).length
      ? null
      : {
          date,
          temperature: tempValue,
          fluid: fluidValue,
          bleeding: bleedingValue,
          notes: notesValue,
        },
  };
}

export function entriesToJson(entries) {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      entries,
    },
    null,
    2
  );
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function entriesToCsv(entries) {
  const header = ["date", "temperature_c", "cervical_fluid", "bleeding", "notes"];
  const rows = entries.map((e) =>
    [e.date, e.temperature ?? "", e.fluid ?? "", e.bleeding ?? "", e.notes ?? ""]
      .map(csvCell)
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadFile(filename, content, mime) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
