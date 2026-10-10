import { useState } from "react";
import { useI18n } from "../../lib/i18n";
import { parseLocalDate, getCurrentPhase } from "../../utils/cycleCalculator";

const STRINGS = {
  en: {
    formTitle: "Where am I in my cycle?",
    privacy: "Your inputs stay in your browser. Nothing is sent or stored.",
    lmpLabel: "First day of your last period",
    cycleLabel: "Cycle length (days)",
    submit: "See my phase",
    reset: "Reset",
    resultKicker: "Likely phase",
    cycleDayLabel: (d, total) => `Day ${d} of about ${total}`,
    individualNote:
      "Every body is different. These are general patterns — not a description of you specifically.",
    energyLabel: "Energy",
    moodLabel: "How you may feel",
    suggestionsLabel: "Gentle suggestions",
    disclaimerTitle: "Health note —",
    disclaimer:
      "This is an educational estimate, not a diagnosis. It does not replace medical advice and should not be used as a method of contraception.",
    errDate: "Please enter the date of your last period.",
    errFuture: "The date can't be in the future.",
    errCycle: "Cycle length must be between 21 and 45 days.",
    phases: {
      menstruation: {
        name: "Menstruation",
        description:
          "Your body is starting a new cycle. Hormone levels are at their lowest, the lining of the uterus is shedding.",
        energy: "Energy may be lower than usual.",
        mood: "More inward, sensitive or quiet for some.",
        suggestions: ["Rest when you can", "Stay hydrated", "Warmth on the abdomen", "Gentle movement"],
      },
      follicular: {
        name: "Follicular phase",
        description:
          "Estrogen is gradually rising. The body is preparing an egg for ovulation.",
        energy: "Often climbing — many feel more focused and outward.",
        mood: "Often more confident, social and motivated.",
        suggestions: ["Plan ahead", "Creative or detailed work", "Moderate-to-higher intensity activity"],
      },
      ovulation: {
        name: "Ovulation window",
        description:
          "An egg may be released. Estrogen peaks, fertility is at its highest of the cycle.",
        energy: "Energy and libido may be higher for some.",
        mood: "Often a confident, expressive feeling.",
        suggestions: [
          "Notice your body's signals (mucus, temperature, mood)",
          "Useful to track if you want to understand fertility",
          "Not reliable on its own as a method of contraception",
        ],
      },
      luteal: {
        name: "Luteal phase",
        description:
          "After ovulation. Progesterone rises, then drops if no pregnancy occurs — which can trigger PMS-type symptoms.",
        energy: "Often fluctuates, lower towards the end.",
        mood: "Some experience PMS — sensitivity, irritability, lower mood.",
        suggestions: ["Routine and rhythm", "Steady meals and sleep", "Reduce overload and high-stimulation tasks"],
      },
    },
  },
  fr: {
    formTitle: "Où en suis-je dans mon cycle ?",
    privacy: "Vos données restent dans votre navigateur. Rien n'est envoyé ni stocké.",
    lmpLabel: "Premier jour des dernières règles",
    cycleLabel: "Longueur du cycle (jours)",
    submit: "Voir ma phase",
    reset: "Réinitialiser",
    resultKicker: "Phase probable",
    cycleDayLabel: (d, total) => `Jour ${d} sur environ ${total}`,
    individualNote:
      "Chaque corps est différent : ce sont des tendances générales, pas une description exacte de votre cycle.",
    energyLabel: "Énergie",
    moodLabel: "Ressentis fréquents",
    suggestionsLabel: "Pistes à explorer",
    disclaimerTitle: "Note santé —",
    disclaimer:
      "Il s'agit d'une estimation à visée éducative, pas d'un diagnostic. Elle ne remplace pas un avis médical et ne doit pas être utilisée comme méthode contraceptive.",
    errDate: "Indiquez la date du premier jour de vos dernières règles.",
    errFuture: "La date ne peut pas être dans le futur.",
    errCycle: "La longueur du cycle doit être comprise entre 21 et 45 jours.",
    phases: {
      menstruation: {
        name: "Règles",
        description:
          "Un nouveau cycle commence. Les taux d'hormones sont au plus bas et la muqueuse utérine se détache.",
        energy: "L'énergie peut être plus basse que d'habitude.",
        mood: "Souvent plus introspective, sensible ou calme.",
        suggestions: ["Vous reposer quand c'est possible", "Boire suffisamment", "Chaleur sur le ventre", "Mouvement doux"],
      },
      follicular: {
        name: "Phase folliculaire",
        description:
          "Les œstrogènes augmentent progressivement. Le corps prépare un ovule en vue de l'ovulation.",
        energy: "Souvent en hausse, avec plus de concentration et d'envie d'aller vers les autres.",
        mood: "Souvent plus de confiance, d'envie de sortir et de motivation.",
        suggestions: ["Planifier à l'avance", "Travail créatif ou minutieux", "Activité physique modérée à plus soutenue"],
      },
      ovulation: {
        name: "Fenêtre d'ovulation",
        description:
          "Un ovule peut être libéré. Les œstrogènes atteignent leur pic et la fertilité est à son maximum.",
        energy: "L'énergie et la libido peuvent être plus élevées chez certaines femmes.",
        mood: "Souvent un sentiment de confiance et plus de facilité à vous exprimer.",
        suggestions: [
          "Observer les signaux du corps (glaire, température, humeur)",
          "Utile à suivre si vous cherchez à comprendre votre fertilité",
          "Ne suffit pas à lui seul comme méthode contraceptive",
        ],
      },
      luteal: {
        name: "Phase lutéale",
        description:
          "Après l'ovulation. La progestérone augmente puis chute en l'absence de grossesse, ce qui peut provoquer des symptômes de SPM.",
        energy: "Souvent fluctuante, plus basse en fin de phase.",
        mood: "Certaines femmes ressentent un SPM : sensibilité, irritabilité, baisse de moral.",
        suggestions: ["Une routine régulière", "Des repas et un sommeil réguliers", "Alléger votre emploi du temps et éviter la surcharge"],
      },
    },
  },
};

export default function CyclePhaseTool() {
  const { lang } = useI18n();
  const t = STRINGS[lang] || STRINGS.en;

  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState(28);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const parsedLmp = parseLocalDate(lmp);
    const cycleNum = Number(cycle);
    if (!parsedLmp) next.lmp = t.errDate;
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedLmp > today) next.lmp = t.errFuture;
    }
    if (!Number.isFinite(cycleNum) || cycleNum < 21 || cycleNum > 45) next.cycle = t.errCycle;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setResult(null);
      return;
    }
    setResult(getCurrentPhase(parsedLmp, cycleNum));
  };

  const handleReset = () => {
    setLmp("");
    setCycle(28);
    setErrors({});
    setResult(null);
  };

  const inputCls =
    "mt-2 w-full rounded-2xl border border-[#DCCDB8] bg-white px-4 py-3 text-base text-[#362E28] outline-none transition focus:border-[#7C3C3C] focus:ring-2 focus:ring-[#7C3C3C]/30";
  const errorCls = "mt-2 text-sm text-[#9B2F2F]";

  const phaseInfo = result ? t.phases[result.phase] : null;

  return (
    <div className="not-prose my-12">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10"
        noValidate
      >
        <h2 className="font-serif text-3xl text-[#362E28]">{t.formTitle}</h2>
        <p className="mt-2 text-sm text-[#6e625b]">{t.privacy}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#43372F]" htmlFor="cp-lmp">
              {t.lmpLabel}
            </label>
            <input
              id="cp-lmp"
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              aria-invalid={!!errors.lmp}
              aria-describedby={errors.lmp ? "cp-lmp-error" : undefined}
              required
              className={inputCls}
            />
            {errors.lmp && (
              <p id="cp-lmp-error" role="alert" className={errorCls}>
                {errors.lmp}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#43372F]" htmlFor="cp-cycle">
              {t.cycleLabel}
            </label>
            <input
              id="cp-cycle"
              type="number"
              inputMode="numeric"
              min={21}
              max={45}
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              aria-invalid={!!errors.cycle}
              aria-describedby={errors.cycle ? "cp-cycle-error" : undefined}
              className={inputCls}
            />
            {errors.cycle && (
              <p id="cp-cycle-error" role="alert" className={errorCls}>
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

      {result && phaseInfo && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:p-10"
          aria-live="polite"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4887F]">{t.resultKicker}</p>
          <div className="mt-4 grid gap-8 md:grid-cols-[180px_1fr] md:items-center">
            <div className="flex justify-center">
              <CycleDayRing
                cycleDay={result.cycleDay}
                cycleLength={result.cycleLength}
                ovulationDay={result.ovulationDay}
                periodEnd={result.periodEnd}
                fertileStart={result.fertileStart}
                fertileEnd={result.fertileEnd}
                lang={lang}
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#DCCDB8]">
                {t.cycleDayLabel(result.cycleDay, result.cycleLength)}
              </p>
              <h3 className="mt-2 font-serif text-4xl text-[#FBF7EF]">{phaseInfo.name}</h3>
              <p className="mt-4 text-base leading-7 text-[#E7D8C8]">{phaseInfo.description}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <DetailBlock label={t.energyLabel} value={phaseInfo.energy} />
            <DetailBlock label={t.moodLabel} value={phaseInfo.mood} />
            <DetailBlock label={t.suggestionsLabel}>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[#E7D8C8]">
                {phaseInfo.suggestions.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#7C3C3C]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          </div>

          <p className="mt-8 text-xs leading-5 text-[#DCCDB8]">{t.individualNote}</p>
        </div>
      )}

      <div className="mt-6 rounded-[1.5rem] border border-[#7C3C3C]/30 bg-[#FBF7EF] p-5 text-sm leading-6 text-[#5d5049]">
        <strong className="text-[#5C2B2B]">{t.disclaimerTitle}</strong> {t.disclaimer}
      </div>
    </div>
  );
}

function DetailBlock({ label, value, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{label}</p>
      {value && <p className="mt-2 text-sm leading-6 text-[#E7D8C8]">{value}</p>}
      {children}
    </div>
  );
}

function CycleDayRing({ cycleDay, cycleLength, ovulationDay, periodEnd, fertileStart, fertileEnd, lang }) {
  const radius = 70;
  const cx = 95;
  const cy = 95;
  const C = 2 * Math.PI * radius;

  const arc = (startDay, endDay) => {
    const startFrac = (startDay - 1) / cycleLength;
    const endFrac = endDay / cycleLength;
    return {
      dashArray: `${C * (endFrac - startFrac)} ${C}`,
      dashOffset: -C * startFrac,
    };
  };

  const period = arc(1, periodEnd);
  const fertile = arc(fertileStart, fertileEnd);

  const ovulationAngle = ((ovulationDay - 0.5) / cycleLength) * 360 - 90;
  const ovX = cx + radius * Math.cos((ovulationAngle * Math.PI) / 180);
  const ovY = cy + radius * Math.sin((ovulationAngle * Math.PI) / 180);

  const dayAngle = ((cycleDay - 0.5) / cycleLength) * 360 - 90;
  const dayX = cx + radius * Math.cos((dayAngle * Math.PI) / 180);
  const dayY = cy + radius * Math.sin((dayAngle * Math.PI) / 180);

  return (
    <svg
      viewBox="0 0 190 190"
      className="w-full max-w-[170px]"
      role="img"
      aria-label={lang === "fr" ? "Position dans le cycle" : "Position in cycle"}
    >
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#FBF7EF" strokeOpacity="0.08" strokeWidth="12" />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#7C3C3C"
          strokeWidth="12"
          strokeDasharray={period.dashArray}
          strokeDashoffset={period.dashOffset}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#B98E86"
          strokeWidth="12"
          strokeDasharray={fertile.dashArray}
          strokeDashoffset={fertile.dashOffset}
        />
      </g>
      <circle cx={ovX} cy={ovY} r="5" fill="#FBF7EF" stroke="#7C3C3C" strokeWidth="2" />
      <circle cx={dayX} cy={dayY} r="9" fill="#D4887F" stroke="#FBF7EF" strokeWidth="3" />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="#FBF7EF"
        fontFamily="Aboreto, serif"
        fontSize="32"
      >
        {cycleDay}
      </text>
    </svg>
  );
}
