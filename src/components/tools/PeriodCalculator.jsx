import { useState } from "react";
import { useI18n } from "../../lib/i18n";
import { calculateCycle, parseLocalDate } from "../../utils/cycleCalculator";
import { formatDate } from "../../lib/blog";

const STRINGS = {
  en: {
    formTitle: "Period calculator",
    privacy: "All calculations happen locally in your browser. No data is sent or stored.",
    lmpLabel: "Last period start date",
    periodLabel: "Period duration (days)",
    cycleLabel: "Cycle length (days)",
    calculate: "Calculate",
    reset: "Reset",
    resultsTitle: "Your estimates",
    nextPeriod: "Next period",
    ovulation: "Estimated ovulation",
    fertileWindow: "Fertile window",
    followingCycle: "Following cycle starts",
    estimateNote: "These are estimates. Cycles vary from one person to another, and from one month to the next.",
    disclaimerTitle: "Health note —",
    disclaimer: "These results are estimates for informational purposes. They do not replace medical advice, diagnosis or professional follow-up. They should not be used as a method of contraception.",
    errDate: "Please enter the date of your last period.",
    errPeriod: "Period duration must be between 2 and 10 days.",
    errCycle: "Cycle length must be between 21 and 45 days.",
    rangeSeparator: "→",
  },
  fr: {
    formTitle: "Calculateur de cycle",
    privacy: "Tous les calculs sont faits localement dans ton navigateur. Aucune donnée n'est envoyée ni stockée.",
    lmpLabel: "Date du premier jour des dernières règles",
    periodLabel: "Durée moyenne des règles (jours)",
    cycleLabel: "Longueur moyenne du cycle (jours)",
    calculate: "Calculer",
    reset: "Réinitialiser",
    resultsTitle: "Tes estimations",
    nextPeriod: "Prochaines règles",
    ovulation: "Ovulation estimée",
    fertileWindow: "Fenêtre fertile",
    followingCycle: "Début du cycle suivant",
    estimateNote: "Ce sont des estimations. Les cycles varient d'une personne à l'autre, et d'un mois à l'autre.",
    disclaimerTitle: "Note santé —",
    disclaimer: "Ces résultats sont des estimations à titre informatif. Ils ne remplacent pas un avis médical, un diagnostic ou un suivi professionnel. Ils ne doivent pas être utilisés comme méthode contraceptive.",
    errDate: "Indique la date du premier jour de tes dernières règles.",
    errPeriod: "La durée des règles doit être comprise entre 2 et 10 jours.",
    errCycle: "La longueur du cycle doit être comprise entre 21 et 45 jours.",
    rangeSeparator: "→",
  },
};

export default function PeriodCalculator() {
  const { lang } = useI18n();
  const t = STRINGS[lang] || STRINGS.en;

  const [lmp, setLmp] = useState("");
  const [period, setPeriod] = useState(5);
  const [cycle, setCycle] = useState(28);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const parsedLmp = parseLocalDate(lmp);
    const periodNum = Number(period);
    const cycleNum = Number(cycle);
    if (!parsedLmp) next.lmp = t.errDate;
    if (!Number.isFinite(periodNum) || periodNum < 2 || periodNum > 10) next.period = t.errPeriod;
    if (!Number.isFinite(cycleNum) || cycleNum < 21 || cycleNum > 45) next.cycle = t.errCycle;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setResults(null);
      return;
    }
    setResults(calculateCycle(parsedLmp, periodNum, cycleNum));
  };

  const handleReset = () => {
    setLmp("");
    setPeriod(5);
    setCycle(28);
    setErrors({});
    setResults(null);
  };

  const inputCls =
    "mt-2 w-full rounded-2xl border border-[#DCCDB8] bg-white px-4 py-3 text-base text-[#362E28] outline-none transition focus:border-[#7C3C3C] focus:ring-2 focus:ring-[#7C3C3C]/30";
  const errorCls = "mt-2 text-sm text-[#9B2F2F]";

  return (
    <div className="not-prose my-12">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10"
        noValidate
      >
        <h2 className="font-serif text-3xl text-[#362E28]">{t.formTitle}</h2>
        <p className="mt-2 text-sm text-[#6e625b]">{t.privacy}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-[#43372F]" htmlFor="pc-lmp">
              {t.lmpLabel}
            </label>
            <input
              id="pc-lmp"
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              aria-invalid={!!errors.lmp}
              aria-describedby={errors.lmp ? "pc-lmp-error" : undefined}
              required
              className={inputCls}
            />
            {errors.lmp && (
              <p id="pc-lmp-error" role="alert" className={errorCls}>
                {errors.lmp}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#43372F]" htmlFor="pc-period">
              {t.periodLabel}
            </label>
            <input
              id="pc-period"
              type="number"
              inputMode="numeric"
              min={2}
              max={10}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              aria-invalid={!!errors.period}
              aria-describedby={errors.period ? "pc-period-error" : undefined}
              className={inputCls}
            />
            {errors.period && (
              <p id="pc-period-error" role="alert" className={errorCls}>
                {errors.period}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#43372F]" htmlFor="pc-cycle">
              {t.cycleLabel}
            </label>
            <input
              id="pc-cycle"
              type="number"
              inputMode="numeric"
              min={21}
              max={45}
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              aria-invalid={!!errors.cycle}
              aria-describedby={errors.cycle ? "pc-cycle-error" : undefined}
              className={inputCls}
            />
            {errors.cycle && (
              <p id="pc-cycle-error" role="alert" className={errorCls}>
                {errors.cycle}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#7C3C3C] px-7 py-3 text-sm font-medium text-[#FBF7EF] transition hover:bg-[#5C2B2B] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF]"
          >
            {t.calculate}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-full border border-[#DCCDB8] px-7 py-3 text-sm font-medium text-[#5d5049] transition hover:bg-[#F4EBDD] focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/30"
          >
            {t.reset}
          </button>
        </div>
      </form>

      {results && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:p-10"
          aria-live="polite"
        >
          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-[#D4887F]">{t.resultsTitle}</p>

          <div className="grid gap-10 md:grid-cols-[220px_1fr] md:items-center">
            <div className="flex justify-center">
              <CyclePhaseRing
                periodDuration={Number(period)}
                cycleLength={Number(cycle)}
                lang={lang}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ResultCard
                dotColor="#7C3C3C"
                label={t.nextPeriod}
                primary={`${formatDate(results.nextPeriodStart, lang)} ${t.rangeSeparator} ${formatDate(results.nextPeriodEnd, lang)}`}
                countdown={formatCountdown(results.nextPeriodStart, lang)}
              />
              <ResultCard
                dotColor="#FBF7EF"
                ringColor="#7C3C3C"
                label={t.ovulation}
                primary={formatDate(results.ovulation, lang)}
                countdown={formatCountdown(results.ovulation, lang)}
              />
              <ResultCard
                dotColor="#B98E86"
                label={t.fertileWindow}
                primary={`${formatDate(results.fertileStart, lang)} ${t.rangeSeparator} ${formatDate(results.fertileEnd, lang)}`}
                countdown={formatCountdown(results.fertileStart, lang)}
              />
              <ResultCard
                dotColor="#A8A091"
                label={t.followingCycle}
                primary={formatDate(results.followingPeriodStart, lang)}
                countdown={formatCountdown(results.followingPeriodStart, lang)}
              />
            </div>
          </div>

          <p className="mt-10 text-xs leading-5 text-[#DCCDB8]">{t.estimateNote}</p>
        </div>
      )}

      <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-sm leading-6 text-[#5d5049]">
        <strong className="text-[#5C2B2B]">{t.disclaimerTitle}</strong> {t.disclaimer}
      </div>
    </div>
  );
}

function ResultCard({ dotColor, ringColor, label, primary, countdown }) {
  return (
    <div className="rounded-2xl bg-[#43372F]/40 p-4">
      <div className="flex items-center gap-2.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{
            background: dotColor,
            boxShadow: ringColor ? `0 0 0 2px ${ringColor}` : undefined,
          }}
          aria-hidden="true"
        />
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4887F]">{label}</p>
      </div>
      <p className="mt-3 font-serif text-lg leading-tight text-[#FBF7EF]">{primary}</p>
      {countdown && <p className="mt-1 text-xs text-[#DCCDB8]/80">{countdown}</p>}
    </div>
  );
}

// SVG circulaire représentant un cycle. Phase période + fenêtre fertile colorées,
// point d'ovulation marqué, durée du cycle au centre.
function CyclePhaseRing({ periodDuration, cycleLength, lang }) {
  const radius = 80;
  const cx = 110;
  const cy = 110;
  const C = 2 * Math.PI * radius;
  const safeCycle = Math.max(1, cycleLength);

  const arc = (startDay, endDay) => {
    const startFrac = startDay / safeCycle;
    const endFrac = endDay / safeCycle;
    return {
      dashArray: `${C * (endFrac - startFrac)} ${C}`,
      dashOffset: -C * startFrac,
    };
  };

  const period = arc(0, Math.min(periodDuration, safeCycle));
  const fertileStartDay = Math.max(0, safeCycle - 14 - 5);
  const fertileEndDay = Math.min(safeCycle, safeCycle - 14 + 1);
  const fertile = arc(fertileStartDay, fertileEndDay);
  const ovulationAngle = ((safeCycle - 14) / safeCycle) * 360 - 90;
  const ovulationX = cx + radius * Math.cos((ovulationAngle * Math.PI) / 180);
  const ovulationY = cy + radius * Math.sin((ovulationAngle * Math.PI) / 180);

  return (
    <svg
      viewBox="0 0 220 220"
      className="w-full max-w-[200px]"
      role="img"
      aria-label={lang === "fr" ? "Visualisation du cycle" : "Cycle visualisation"}
    >
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#FBF7EF" strokeOpacity="0.08" strokeWidth="14" />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#7C3C3C"
          strokeWidth="14"
          strokeDasharray={period.dashArray}
          strokeDashoffset={period.dashOffset}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#B98E86"
          strokeWidth="14"
          strokeDasharray={fertile.dashArray}
          strokeDashoffset={fertile.dashOffset}
        />
      </g>
      <circle cx={ovulationX} cy={ovulationY} r="7" fill="#FBF7EF" stroke="#7C3C3C" strokeWidth="3" />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill="#FBF7EF"
        fontFamily="Aboreto, serif"
        fontSize="38"
      >
        {cycleLength}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fill="#DCCDB8"
        fontFamily="Montserrat, sans-serif"
        fontSize="9"
        letterSpacing="3"
      >
        {lang === "fr" ? "JOURS" : "DAYS"}
      </text>
    </svg>
  );
}

function formatCountdown(date, lang) {
  if (!date) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (days === 0) return lang === "fr" ? "Aujourd'hui" : "Today";
  if (days === 1) return lang === "fr" ? "Demain" : "Tomorrow";
  if (days === -1) return lang === "fr" ? "Hier" : "Yesterday";
  if (days > 0) return lang === "fr" ? `Dans ${days} jours` : `In ${days} days`;
  return lang === "fr" ? `Il y a ${Math.abs(days)} jours` : `${Math.abs(days)} days ago`;
}
