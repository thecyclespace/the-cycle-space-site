import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../lib/i18n";
import { formatDate } from "../../lib/blog";
import {
  BLEEDING_OPTIONS,
  FLUID_OPTIONS,
  TEMP_MAX,
  TEMP_MIN,
  clearAllEntries,
  downloadFile,
  entriesToCsv,
  entriesToJson,
  findEntryByDate,
  grantConsent,
  hasConsent,
  loadEntries,
  revokeConsent,
  upsertEntry,
  validateEntry,
} from "../../utils/localCycleTracker";

const STRINGS = {
  en: {
    formTitle: "Basal temperature & cervical fluid journal",
    privacyShort: "Your entries stay in this browser only. Nothing is sent or synced.",
    consentTitle: "Private local tracking",
    consentBody:
      "This tracker saves your entries only on this device, in this browser. Nothing is sent to a server, nothing is synced. If you clear your browser data, your entries may be deleted. This tool is informational and must not be used as a contraceptive method or medical diagnosis.",
    consentButton: "Enable private local tracking",
    addEntryTitle: "Add a daily entry",
    dateLabel: "Date",
    tempLabel: "Basal temperature (°C, optional)",
    tempPlaceholder: "e.g. 36.55",
    tempHint: `Realistic range: ${TEMP_MIN.toFixed(1)} – ${TEMP_MAX.toFixed(1)} °C`,
    fluidLabel: "Cervical fluid (optional)",
    bleedingLabel: "Bleeding (optional)",
    notesLabel: "Notes (optional)",
    notesPlaceholder: "A few words for yourself…",
    save: "Save entry",
    reset: "Reset form",
    errDate: "Please pick a date.",
    errTemperature: `Temperature must be between ${TEMP_MIN.toFixed(1)} and ${TEMP_MAX.toFixed(1)} °C.`,
    overwriteConfirm: "An entry already exists for this date. Replace it with the new values?",
    saved: "Entry saved.",
    listTitle: "Your entries",
    listEmpty: "No entries yet. Add your first one above.",
    listShowing: "Showing the 10 most recent of {total} entries.",
    listTotal: "{total} entries saved.",
    lastEntry: "Last entry",
    actionsTitle: "Your data",
    exportJson: "Export as JSON",
    exportCsv: "Export as CSV",
    deleteAll: "Delete all my local data",
    deleteConfirm:
      "This will permanently delete all your local tracker entries. Continue?",
    deleted: "All local entries deleted.",
    fluid: {
      "not-observed": "Not observed",
      dry: "Dry / none",
      sticky: "Sticky",
      creamy: "Creamy",
      watery: "Watery",
      "egg-white": "Egg-white",
      "not-sure": "Not sure",
    },
    bleeding: {
      none: "None",
      light: "Light",
      medium: "Medium",
      heavy: "Heavy",
    },
    fieldNone: "—",
    disclaimerTitle: "Health note —",
    disclaimer:
      "This information is for personal observation and education. It is not a substitute for medical advice, diagnosis or professional follow-up. Do not use this tool as a contraceptive method.",
    fluidShort: "Fluid",
    bleedingShort: "Bleeding",
    tempShort: "Temp.",
    notesShort: "Notes",
  },
  fr: {
    formTitle: "Mini journal température basale & glaire cervicale",
    privacyShort: "Tes entrées restent uniquement dans ce navigateur. Rien n'est envoyé ni synchronisé.",
    consentTitle: "Suivi local privé",
    consentBody:
      "Ce tracker enregistre tes données uniquement sur cet appareil, dans ce navigateur. Elles ne sont pas envoyées à un serveur et ne sont pas synchronisées. Si tu vides les données de ton navigateur, tes entrées peuvent être supprimées. Cet outil est informatif et ne doit pas être utilisé comme méthode contraceptive ou diagnostic médical.",
    consentButton: "Activer le suivi local privé",
    addEntryTitle: "Ajouter une entrée du jour",
    dateLabel: "Date",
    tempLabel: "Température basale (°C, optionnelle)",
    tempPlaceholder: "ex. 36,55",
    tempHint: `Plage réaliste : ${TEMP_MIN.toFixed(1)} – ${TEMP_MAX.toFixed(1)} °C`,
    fluidLabel: "Glaire cervicale (optionnelle)",
    bleedingLabel: "Saignement (optionnel)",
    notesLabel: "Notes (optionnelles)",
    notesPlaceholder: "Quelques mots pour toi…",
    save: "Enregistrer",
    reset: "Réinitialiser le formulaire",
    errDate: "Indique une date.",
    errTemperature: `La température doit être comprise entre ${TEMP_MIN.toFixed(1)} et ${TEMP_MAX.toFixed(1)} °C.`,
    overwriteConfirm: "Une entrée existe déjà pour cette date. La remplacer par les nouvelles valeurs ?",
    saved: "Entrée enregistrée.",
    listTitle: "Tes entrées",
    listEmpty: "Aucune entrée pour le moment. Ajoute la première ci-dessus.",
    listShowing: "10 entrées les plus récentes sur {total}.",
    listTotal: "{total} entrées enregistrées.",
    lastEntry: "Dernière entrée",
    actionsTitle: "Tes données",
    exportJson: "Exporter en JSON",
    exportCsv: "Exporter en CSV",
    deleteAll: "Supprimer toutes mes données locales",
    deleteConfirm:
      "Cela supprimera définitivement toutes tes entrées locales. Continuer ?",
    deleted: "Toutes les entrées locales ont été supprimées.",
    fluid: {
      "not-observed": "Non observée",
      dry: "Sèche / absente",
      sticky: "Collante",
      creamy: "Crémeuse",
      watery: "Liquide",
      "egg-white": "Blanc d'œuf",
      "not-sure": "Pas sûre",
    },
    bleeding: {
      none: "Aucun",
      light: "Léger",
      medium: "Moyen",
      heavy: "Abondant",
    },
    fieldNone: "—",
    disclaimerTitle: "Note santé —",
    disclaimer:
      "Ces informations sont destinées à l'observation personnelle et à l'éducation. Elles ne remplacent pas un avis médical, un diagnostic ou un suivi professionnel. N'utilise pas cet outil comme méthode contraceptive.",
    fluidShort: "Glaire",
    bleedingShort: "Saignement",
    tempShort: "Temp.",
    notesShort: "Notes",
  },
};

const todayIso = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const initialForm = () => ({
  date: todayIso(),
  temperature: "",
  fluid: "",
  bleeding: "",
  notes: "",
});

export default function BasalTemperatureTracker() {
  const { lang } = useI18n();
  const t = STRINGS[lang] || STRINGS.en;

  const [consent, setConsent] = useState(false);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (hasConsent()) {
      setConsent(true);
      setEntries(loadEntries());
    }
  }, []);

  const lastEntry = entries[0] || null;
  const visibleEntries = useMemo(() => entries.slice(0, 10), [entries]);

  const handleConsent = () => {
    if (grantConsent()) {
      setConsent(true);
      setEntries(loadEntries());
    }
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setFeedback(null);
  };

  const togglePill = (field, value) => {
    setForm((f) => ({ ...f, [field]: f[field] === value ? "" : value }));
    setFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: nextErrors, entry } = validateEntry(form, t);
    setErrors(nextErrors);
    if (!entry) return;

    const existing = findEntryByDate(entries, entry.date);
    if (existing) {
      const ok = window.confirm(t.overwriteConfirm);
      if (!ok) return;
    }

    const updated = upsertEntry(entries, entry);
    setEntries(updated);
    setFeedback({ type: "success", message: t.saved });
    setForm({ ...initialForm(), date: entry.date });
  };

  const handleResetForm = () => {
    setForm(initialForm());
    setErrors({});
    setFeedback(null);
  };

  const handleDeleteAll = () => {
    if (!entries.length) return;
    const ok = window.confirm(t.deleteConfirm);
    if (!ok) return;
    clearAllEntries();
    setEntries([]);
    setFeedback({ type: "info", message: t.deleted });
  };

  const handleExportJson = () => {
    if (!entries.length) return;
    downloadFile(
      `cycle-tracker-${todayIso()}.json`,
      entriesToJson(entries),
      "application/json"
    );
  };

  const handleExportCsv = () => {
    if (!entries.length) return;
    downloadFile(
      `cycle-tracker-${todayIso()}.csv`,
      entriesToCsv(entries),
      "text/csv"
    );
  };

  const inputCls =
    "mt-2 w-full rounded-2xl border border-[#DCCDB8] bg-white px-4 py-3 text-base text-[#362E28] outline-none transition focus:border-[#7C3C3C] focus:ring-2 focus:ring-[#7C3C3C]/30";
  const errorCls = "mt-2 text-sm text-[#9B2F2F]";
  const labelCls = "block text-sm font-medium text-[#43372F]";

  if (!consent) {
    return (
      <div className="not-prose my-12">
        <div className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10">
          <h2 className="font-serif text-3xl text-[#362E28]">{t.formTitle}</h2>
          <p className="mt-2 text-sm text-[#6e625b]">{t.privacyShort}</p>
          <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-white p-5 text-sm leading-6 text-[#5d5049]">
            <p className="font-medium text-[#5C2B2B]">{t.consentTitle}</p>
            <p className="mt-2">{t.consentBody}</p>
          </div>
          <button
            type="button"
            onClick={handleConsent}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#7C3C3C] px-7 py-3 text-sm font-medium text-[#FBF7EF] transition hover:bg-[#5C2B2B] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF]"
          >
            {t.consentButton}
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-sm leading-6 text-[#5d5049]">
          <strong className="text-[#5C2B2B]">{t.disclaimerTitle}</strong> {t.disclaimer}
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-3xl text-[#362E28]">{t.addEntryTitle}</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-[#7C3C3C]">
            {t.privacyShort}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="bt-date">
              {t.dateLabel}
            </label>
            <input
              id="bt-date"
              type="date"
              value={form.date}
              max={todayIso()}
              onChange={handleChange("date")}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "bt-date-error" : undefined}
              required
              className={inputCls}
            />
            {errors.date && (
              <p id="bt-date-error" role="alert" className={errorCls}>
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls} htmlFor="bt-temp">
              {t.tempLabel}
            </label>
            <input
              id="bt-temp"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={TEMP_MIN}
              max={TEMP_MAX}
              placeholder={t.tempPlaceholder}
              value={form.temperature}
              onChange={handleChange("temperature")}
              aria-invalid={!!errors.temperature}
              aria-describedby={
                errors.temperature ? "bt-temp-error" : "bt-temp-hint"
              }
              className={inputCls}
            />
            {errors.temperature ? (
              <p id="bt-temp-error" role="alert" className={errorCls}>
                {errors.temperature}
              </p>
            ) : (
              <p id="bt-temp-hint" className="mt-2 text-xs text-[#6e625b]">
                {t.tempHint}
              </p>
            )}
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className={labelCls}>{t.fluidLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {FLUID_OPTIONS.map((key) => (
              <PillButton
                key={key}
                pressed={form.fluid === key}
                onClick={() => togglePill("fluid", key)}
                label={t.fluid[key]}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className={labelCls}>{t.bleedingLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BLEEDING_OPTIONS.map((key) => (
              <PillButton
                key={key}
                pressed={form.bleeding === key}
                onClick={() => togglePill("bleeding", key)}
                label={t.bleeding[key]}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <label className={labelCls} htmlFor="bt-notes">
            {t.notesLabel}
          </label>
          <textarea
            id="bt-notes"
            rows={3}
            maxLength={500}
            placeholder={t.notesPlaceholder}
            value={form.notes}
            onChange={handleChange("notes")}
            className={`${inputCls} resize-y`}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#7C3C3C] px-7 py-3 text-sm font-medium text-[#FBF7EF] transition hover:bg-[#5C2B2B] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF]"
          >
            {t.save}
          </button>
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center justify-center rounded-full border border-[#DCCDB8] px-7 py-3 text-sm font-medium text-[#5d5049] transition hover:bg-[#F4EBDD] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/30"
          >
            {t.reset}
          </button>
        </div>

        {feedback && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-5 text-sm ${
              feedback.type === "success" ? "text-[#3F6B47]" : "text-[#5C2B2B]"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </form>

      <div
        className="mt-6 overflow-hidden rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:p-10"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4887F]">
            {t.listTitle}
          </p>
          <p className="text-xs text-[#DCCDB8]">
            {entries.length === 0
              ? ""
              : entries.length > 10
                ? t.listShowing.replace("{total}", String(entries.length))
                : t.listTotal.replace("{total}", String(entries.length))}
          </p>
        </div>

        {entries.length === 0 ? (
          <p className="mt-6 text-sm leading-6 text-[#E7D8C8]">{t.listEmpty}</p>
        ) : (
          <>
            {lastEntry && (
              <div className="mt-6 rounded-2xl border border-[#7C3C3C]/40 bg-[#7C3C3C]/10 p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4887F]">
                  {t.lastEntry}
                </p>
                <p className="mt-2 font-serif text-xl text-[#FBF7EF]">
                  {formatDate(parseEntryDate(lastEntry.date), lang)}
                </p>
                <EntrySummary entry={lastEntry} t={t} />
              </div>
            )}

            <ul className="mt-6 divide-y divide-[#FBF7EF]/10">
              {visibleEntries.map((entry) => (
                <li key={entry.date} className="py-4">
                  <p className="text-sm font-medium text-[#FBF7EF]">
                    {formatDate(parseEntryDate(entry.date), lang)}
                  </p>
                  <EntrySummary entry={entry} t={t} compact />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-6 rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#7C3C3C]">
          {t.actionsTitle}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            disabled={!entries.length}
            className="inline-flex items-center justify-center rounded-full border border-[#DCCDB8] bg-white px-5 py-2.5 text-sm font-medium text-[#43372F] transition hover:border-[#7C3C3C] hover:text-[#7C3C3C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.exportJson}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!entries.length}
            className="inline-flex items-center justify-center rounded-full border border-[#DCCDB8] bg-white px-5 py-2.5 text-sm font-medium text-[#43372F] transition hover:border-[#7C3C3C] hover:text-[#7C3C3C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.exportCsv}
          </button>
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={!entries.length}
            className="inline-flex items-center justify-center rounded-full border border-[#7C3C3C]/50 px-5 py-2.5 text-sm font-medium text-[#5C2B2B] transition hover:bg-[#7C3C3C] hover:text-[#FBF7EF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.deleteAll}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-sm leading-6 text-[#5d5049]">
        <strong className="text-[#5C2B2B]">{t.disclaimerTitle}</strong> {t.disclaimer}
      </div>
    </div>
  );
}

function EntrySummary({ entry, t, compact }) {
  const items = [];
  if (entry.temperature !== null && entry.temperature !== undefined) {
    items.push({ label: t.tempShort, value: `${entry.temperature.toFixed(2)} °C` });
  }
  if (entry.fluid) {
    items.push({ label: t.fluidShort, value: t.fluid[entry.fluid] });
  }
  if (entry.bleeding) {
    items.push({ label: t.bleedingShort, value: t.bleeding[entry.bleeding] });
  }

  return (
    <div className={compact ? "mt-1.5" : "mt-3"}>
      {items.length === 0 && !entry.notes ? (
        <p className="text-sm text-[#DCCDB8]/70">{t.fieldNone}</p>
      ) : (
        <>
          {items.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#E7D8C8]">
              {items.map((item) => (
                <li key={item.label}>
                  <span className="text-[#D4887F]">{item.label}:</span> {item.value}
                </li>
              ))}
            </ul>
          )}
          {entry.notes && (
            <p className="mt-2 text-sm leading-6 text-[#DCCDB8]">
              <span className="text-[#D4887F]">{t.notesShort}:</span> {entry.notes}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function PillButton({ pressed, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 ${
        pressed
          ? "border-[#7C3C3C] bg-[#7C3C3C] text-[#FBF7EF]"
          : "border-[#DCCDB8] bg-white text-[#43372F] hover:border-[#7C3C3C] hover:text-[#7C3C3C]"
      }`}
    >
      {label}
    </button>
  );
}

function parseEntryDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
