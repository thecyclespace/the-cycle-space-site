import { useState } from "react";
import { useI18n } from "../../lib/i18n";
import { parseLocalDate, analyzeRegularity } from "../../utils/cycleCalculator";
import { formatDate } from "../../lib/blog";

const MIN_DATES = 3;
const MAX_DATES = 6;

const STRINGS = {
  en: {
    formTitle: "Is your cycle regular?",
    privacy: "Your inputs stay in your browser. Nothing is sent or stored.",
    intro: `Enter the first day of your last ${MIN_DATES} to ${MAX_DATES} periods to see how consistent your cycle has been.`,
    dateLabel: (i) => `Period start #${i + 1}`,
    addDate: "Add another date",
    remove: "Remove",
    submit: "Analyse my cycles",
    reset: "Reset",
    resultKicker: "Your cycle pattern",
    avg: "Average cycle",
    shortest: "Shortest",
    longest: "Longest",
    variability: "Variability",
    days: "days",
    cyclesAnalysed: (n) => `${n} cycles analysed`,
    classifications: {
      regular: "Likely regular",
      "slightly-variable": "Slightly variable",
      "more-variable": "More variable",
    },
    classificationDescriptions: {
      regular:
        "Your cycle length is staying within a narrow range. That's a sign of a fairly consistent rhythm.",
      "slightly-variable":
        "Your cycles are varying a bit. Many people experience this — stress, sleep, travel, weight changes, hormonal transitions and lifestyle shifts can all influence cycle length.",
      "more-variable":
        "Your cycles are varying significantly between months. This can happen for many reasons and isn't necessarily a problem on its own — but it can be worth understanding.",
    },
    contextTitle: "Some context",
    contextNote:
      "Cycle variability can come from many places: stress, sleep, travel, recent weight changes, stopping a contraception, breastfeeding, or hormonal transitions like perimenopause or post-pill recovery.",
    consultTitle: "When it can be worth speaking with a professional",
    consultGeneric:
      "If your cycles are often very short, very long, absent, very painful or very heavy, or if a sudden change worries you — it can be worth checking in with a healthcare professional.",
    consultVeryShort: "Some of your cycles are shorter than 21 days.",
    consultVeryLong: "Some of your cycles are longer than 35 days.",
    disclaimerTitle: "Health note —",
    disclaimer:
      "This is an educational estimate, not a diagnosis. It does not replace medical advice. Cycle length variation can have many causes.",
    errMin: `Please enter at least ${MIN_DATES} dates.`,
    errInvalid: "One or more dates are invalid.",
    errFuture: "Dates can't be in the future.",
    errDuplicate: "Please remove duplicate dates.",
  },
  fr: {
    formTitle: "Votre cycle est-il régulier ?",
    privacy: "Vos données restent dans votre navigateur. Rien n'est envoyé ni stocké.",
    intro: `Saisissez le premier jour de vos ${MIN_DATES} à ${MAX_DATES} dernières règles pour voir la régularité de votre cycle.`,
    dateLabel: (i) => `Début des règles n°${i + 1}`,
    addDate: "Ajouter une date",
    remove: "Retirer",
    submit: "Analyser mes cycles",
    reset: "Réinitialiser",
    resultKicker: "Votre profil de cycle",
    avg: "Cycle moyen",
    shortest: "Le plus court",
    longest: "Le plus long",
    variability: "Variabilité",
    days: "jours",
    cyclesAnalysed: (n) => `${n} cycles analysés`,
    classifications: {
      regular: "Plutôt régulier",
      "slightly-variable": "Légèrement variable",
      "more-variable": "Plus variable",
    },
    classificationDescriptions: {
      regular:
        "La longueur de votre cycle reste dans une fourchette étroite. C'est le signe d'un rythme relativement constant.",
      "slightly-variable":
        "Vos cycles varient un peu. C'est fréquent : le stress, le sommeil, les voyages, les variations de poids, les transitions hormonales ou les changements de mode de vie peuvent influencer la durée du cycle.",
      "more-variable":
        "Vos cycles varient nettement d'un mois à l'autre. Cela peut avoir de nombreuses causes et n'est pas forcément un problème en soi, mais cela peut valoir la peine de chercher à mieux comprendre ce qui se passe.",
    },
    contextTitle: "Un peu de contexte",
    contextNote:
      "La variabilité du cycle peut avoir de nombreuses origines : stress, sommeil, voyages, variations de poids récentes, arrêt d'une contraception, allaitement ou transitions hormonales comme la périménopause.",
    consultTitle: "Quand en parler à un professionnel ?",
    consultGeneric:
      "Si vos cycles sont souvent très courts ou très longs, absents, très douloureux ou très abondants, ou si un changement soudain vous inquiète, il est raisonnable d'en parler avec un professionnel de santé.",
    consultVeryShort: "Certains de vos cycles durent moins de 21 jours.",
    consultVeryLong: "Certains de vos cycles durent plus de 35 jours.",
    disclaimerTitle: "Note santé —",
    disclaimer:
      "Il s'agit d'une estimation à visée éducative, pas d'un diagnostic. Elle ne remplace pas un avis médical. La variabilité du cycle peut avoir de nombreuses causes.",
    errMin: `Saisissez au moins ${MIN_DATES} dates.`,
    errInvalid: "Une ou plusieurs dates sont invalides.",
    errFuture: "Les dates ne peuvent pas être dans le futur.",
    errDuplicate: "Retirez les dates en double.",
  },
};

export default function CycleRegularityTool() {
  const { lang } = useI18n();
  const t = STRINGS[lang] || STRINGS.en;

  const [dates, setDates] = useState(["", "", ""]);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const setDateAt = (idx, value) => {
    const next = [...dates];
    next[idx] = value;
    setDates(next);
  };

  const addDate = () => {
    if (dates.length < MAX_DATES) setDates([...dates, ""]);
  };
  const removeDate = (idx) => {
    if (dates.length > MIN_DATES) setDates(dates.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const filled = dates.filter((d) => d);
    if (filled.length < MIN_DATES) next.global = t.errMin;
    const parsed = filled.map(parseLocalDate);
    if (parsed.some((d) => !d)) next.global = t.errInvalid;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed.some((d) => d && d > today)) next.global = t.errFuture;
    const set = new Set(filled);
    if (set.size !== filled.length) next.global = t.errDuplicate;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setResult(null);
      return;
    }
    setResult(analyzeRegularity(parsed));
  };

  const handleReset = () => {
    setDates(["", "", ""]);
    setErrors({});
    setResult(null);
  };

  const inputCls =
    "mt-2 w-full rounded-2xl border border-[#DCCDB8] bg-white px-4 py-3 text-base text-[#362E28] outline-none transition focus:border-[#7C3C3C] focus:ring-2 focus:ring-[#7C3C3C]/30";

  return (
    <div className="not-prose my-12">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10"
        noValidate
      >
        <h2 className="font-serif text-3xl text-[#362E28]">{t.formTitle}</h2>
        <p className="mt-2 text-sm text-[#6e625b]">{t.privacy}</p>
        <p className="mt-3 text-sm text-[#5d5049]">{t.intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {dates.map((d, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-[#43372F]" htmlFor={`cr-date-${idx}`}>
                {t.dateLabel(idx)}
              </label>
              <div className="flex gap-2">
                <input
                  id={`cr-date-${idx}`}
                  type="date"
                  value={d}
                  onChange={(e) => setDateAt(idx, e.target.value)}
                  className={inputCls}
                />
                {dates.length > MIN_DATES && (
                  <button
                    type="button"
                    onClick={() => removeDate(idx)}
                    className="mt-2 shrink-0 rounded-2xl border border-[#DCCDB8] px-3 text-sm text-[#5C2B2B] transition hover:bg-[#F4EBDD]"
                    aria-label={`${t.remove} ${t.dateLabel(idx)}`}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {dates.length < MAX_DATES && (
          <button
            type="button"
            onClick={addDate}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]"
          >
            + {t.addDate}
          </button>
        )}

        {errors.global && (
          <p role="alert" className="mt-4 text-sm text-[#9B2F2F]">
            {errors.global}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#7C3C3C] px-7 py-3 text-sm font-medium text-[#FBF7EF] transition hover:bg-[#5C2B2B] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF]"
          >
            {t.submit}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-full border border-[#DCCDB8] px-7 py-3 text-sm font-medium text-[#5d5049] transition hover:bg-[#F4EBDD]"
          >
            {t.reset}
          </button>
        </div>
      </form>

      {result && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:p-10"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4887F]">{t.resultKicker}</p>
            <span className="text-xs text-[#DCCDB8]">{t.cyclesAnalysed(result.cycles.length)}</span>
          </div>
          <h3 className="mt-3 font-serif text-4xl text-[#FBF7EF]">
            {t.classifications[result.classification]}
          </h3>
          <p className="mt-4 text-base leading-7 text-[#E7D8C8]">
            {t.classificationDescriptions[result.classification]}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={t.avg} value={`${result.avg} ${t.days}`} />
            <Stat label={t.shortest} value={`${result.shortest} ${t.days}`} />
            <Stat label={t.longest} value={`${result.longest} ${t.days}`} />
            <Stat label={t.variability} value={`±${result.variability} ${t.days}`} />
          </div>

          <CyclesBarChart cycles={result.cycles} avg={result.avg} sortedDates={result.sortedDates} lang={lang} />

          <div className="mt-8 rounded-2xl bg-[#43372F]/60 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{t.contextTitle}</p>
            <p className="mt-2 text-sm leading-6 text-[#E7D8C8]">{t.contextNote}</p>
          </div>

          {(result.flagsMedical || result.veryShort || result.veryLong) && (
            <div className="mt-4 rounded-2xl border border-[#7C3C3C]/40 bg-[#7C3C3C]/10 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{t.consultTitle}</p>
              <p className="mt-2 text-sm leading-6 text-[#E7D8C8]">{t.consultGeneric}</p>
              {result.veryShort && (
                <p className="mt-2 text-sm leading-6 text-[#E7D8C8]">• {t.consultVeryShort}</p>
              )}
              {result.veryLong && (
                <p className="mt-2 text-sm leading-6 text-[#E7D8C8]">• {t.consultVeryLong}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-sm leading-6 text-[#5d5049]">
        <strong className="text-[#5C2B2B]">{t.disclaimerTitle}</strong> {t.disclaimer}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#43372F]/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4887F]">{label}</p>
      <p className="mt-2 font-serif text-2xl text-[#FBF7EF]">{value}</p>
    </div>
  );
}

function CyclesBarChart({ cycles, avg, sortedDates, lang }) {
  const max = Math.max(...cycles, avg + 5);
  return (
    <div className="mt-8">
      <div className="space-y-3">
        {cycles.map((days, i) => {
          const widthPct = Math.max(8, (days / max) * 100);
          const color = days < 21 || days > 35 ? "#D4887F" : "#B98E86";
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-[#DCCDB8]">
                {formatDate(sortedDates[i], lang)}
                <span className="mx-1.5">→</span>
                {formatDate(sortedDates[i + 1], lang)}
              </span>
              <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#FBF7EF]/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${widthPct}%`, background: color }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-sm tabular-nums text-[#FBF7EF]">{days}d</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
