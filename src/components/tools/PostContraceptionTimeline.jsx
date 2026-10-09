import { useState } from "react";
import { useI18n } from "../../lib/i18n";

const TYPES = ["pill", "hormonal-iud", "copper-iud", "not-sure"];
const PERIODS = ["0-1m", "1-3m", "3-6m", "6m+"];

const STRINGS = {
  en: {
    formTitle: "Post-pill / post-IUD recovery timeline",
    privacy: "Your selections stay in your browser. Nothing is sent or stored.",
    intro:
      "A gentle, educational walk-through of what can happen after stopping hormonal contraception or removing an IUD. Every body is different — these are general patterns, not medical predictions.",
    typeLabel: "What did you stop or remove?",
    periodLabel: "How long ago?",
    typeOptions: {
      pill: "The pill / hormonal contraception",
      "hormonal-iud": "Hormonal IUD",
      "copper-iud": "Copper IUD",
      "not-sure": "Not sure",
    },
    periodOptions: {
      "0-1m": "0–1 month",
      "1-3m": "1–3 months",
      "3-6m": "3–6 months",
      "6m+": "6+ months",
    },
    chooseBoth: "Choose both above to see what may be common at this stage.",
    expectKicker: "What can be common",
    watchKicker: "What's worth noticing",
    consultTitle: "When it may be worth speaking with a professional",
    consultIntro:
      "These are general signals. Trust your gut — if something feels off, persistent or worrying, it's always reasonable to check in.",
    consultPoints: [
      "No period after several months (and pregnancy is ruled out)",
      "Very heavy or very long bleeding",
      "Strong, unusual or worsening pain",
      "Fever, sharp pain or unusual discharge after IUD removal",
      "A change that feels new, persistent or concerning",
      "Trouble conceiving after a meaningful period of trying — context-dependent on age",
    ],
    individualNote:
      "Recovery patterns depend on how long you used the contraception, your prior cycle, your age and many individual factors. There is no one timeline.",
    disclaimerTitle: "Health note —",
    disclaimer:
      "This is an educational guide, not medical advice or a diagnosis. It is not a contraceptive method. If symptoms worry you, speak with a healthcare professional.",
    content: {
      pill: {
        "0-1m": {
          expect: [
            "A withdrawal bleed within a few days, similar to a period.",
            "Synthetic hormones leave the body relatively quickly — often within days.",
            "It can take some weeks before the body's own hormonal rhythm starts up again.",
          ],
          watch: [
            "If something previously masked by the pill (acne, mood changes, painful periods) returns, that's information about your underlying cycle.",
          ],
        },
        "1-3m": {
          expect: [
            "Cycles often return, but irregularly at first.",
            "Some people ovulate within weeks; others take a few months.",
            "Skin, mood, libido and energy can shift as natural hormones come back online.",
          ],
          watch: [
            "Notice patterns: cycle length, period flow, breast tenderness, cervical mucus, energy.",
            "Tracking now is much more useful than relying on memory later.",
          ],
        },
        "3-6m": {
          expect: [
            "For many, cycles start to settle into a rhythm — often by 3–6 months, sometimes longer.",
            "Symptoms that pre-date the pill may become clearer.",
          ],
          watch: [
            "Persistently absent periods (with no pregnancy) deserve attention.",
            "Very heavy, very painful or very erratic cycles are worth discussing with a professional.",
          ],
        },
        "6m+": {
          expect: [
            "Most people have established a recognisable cycle by this point.",
            "Underlying conditions (PCOS, endometriosis, thyroid issues) sometimes become visible now — not caused by the pill, but no longer masked.",
          ],
          watch: [
            "If your cycle is still absent or chaotic at 6+ months without pregnancy, that's a reasonable point to seek advice.",
          ],
        },
      },
      "hormonal-iud": {
        "0-1m": {
          expect: [
            "Some spotting in the days after removal is common.",
            "Bleeding patterns typically start to shift back towards your natural rhythm.",
          ],
          watch: [
            "Pain or fever after the removal procedure is not expected — speak with the practitioner who removed it.",
          ],
        },
        "1-3m": {
          expect: [
            "Periods may return progressively. They can be irregular at first.",
            "If you didn't bleed much during the IUD, the return of regular bleeding can feel like a big change.",
          ],
          watch: [
            "Mood, skin, libido and energy can shift as natural hormones come back online.",
          ],
        },
        "3-6m": {
          expect: [
            "Cycles often start to settle into a clearer pattern.",
            "Some people find their pre-IUD cycle returns; others find theirs has shifted.",
          ],
          watch: [
            "Persistently absent or very irregular cycles are worth a conversation with a professional.",
          ],
        },
        "6m+": {
          expect: [
            "Most people have a recognisable cycle pattern by now.",
            "If you're tracking, several months of data make it easier to understand what's typical for you.",
          ],
          watch: [
            "If something still feels off after 6 months — pain, missed periods, very heavy bleeding — it's reasonable to seek advice.",
          ],
        },
      },
      "copper-iud": {
        "0-1m": {
          expect: [
            "No synthetic hormones are leaving the body — your hormonal cycle was already running with a copper IUD.",
            "Some spotting in the days after removal is common.",
          ],
          watch: [
            "Pain or fever after removal is not expected — speak with the practitioner who removed it.",
          ],
        },
        "1-3m": {
          expect: [
            "If your periods were heavier or more painful with the copper IUD, that may ease in the coming cycles.",
            "If your cycle was already well-established with the IUD, it often continues at a similar rhythm.",
          ],
          watch: [
            "If bleeding stays unusually heavy or painful, it's worth discussing.",
          ],
        },
        "3-6m": {
          expect: [
            "Most people who had a regular rhythm with the IUD continue with that rhythm.",
            "Bleeding volume and cramps may have settled to a baseline that's typical for you.",
          ],
          watch: [
            "Sudden, unexplained changes in cycle length or flow are worth noting.",
          ],
        },
        "6m+": {
          expect: [
            "By now, you have a clear sense of your post-IUD cycle pattern.",
            "Tracking over several months gives you a useful baseline.",
          ],
          watch: [
            "Any persistent concern is reasonable to bring to a professional, especially if something has changed recently.",
          ],
        },
      },
      "not-sure": {
        "0-1m": {
          expect: [
            "Many things can shift in the first month: bleeding patterns, mood, skin, energy.",
            "The body is adapting — give it some time before drawing conclusions.",
          ],
          watch: [
            "Note any symptoms that feel new, persistent or worrying.",
          ],
        },
        "1-3m": {
          expect: [
            "Cycles often start to come back, but may be irregular.",
            "Pre-existing patterns (cycle length, PMS, period flow) can begin to show.",
          ],
          watch: [
            "Tracking even simple things — period start, flow, mood — is helpful.",
          ],
        },
        "3-6m": {
          expect: [
            "Many people start to see a clearer rhythm.",
            "If symptoms feel different from what you used to know, that's information.",
          ],
          watch: [
            "Persistent absence of periods, very heavy bleeding or strong pain is worth a conversation.",
          ],
        },
        "6m+": {
          expect: [
            "Most people have a recognisable cycle pattern by now.",
            "Several months of tracking make it easier to spot what's typical and what isn't.",
          ],
          watch: [
            "If something still feels off, it's reasonable to seek advice.",
          ],
        },
      },
    },
  },
  fr: {
    formTitle: "Après l'arrêt de la pilule ou le retrait d'un DIU",
    privacy: "Tes choix restent dans ton navigateur. Rien n'est envoyé ni stocké.",
    intro:
      "Un parcours doux et éducatif sur ce qui peut se passer après l'arrêt d'une contraception hormonale ou le retrait d'un DIU. Chaque corps est différent — ce sont des tendances générales, pas des prédictions médicales.",
    typeLabel: "Qu'est-ce que tu as arrêté ou retiré ?",
    periodLabel: "Depuis combien de temps ?",
    typeOptions: {
      pill: "Pilule / contraception hormonale",
      "hormonal-iud": "DIU hormonal",
      "copper-iud": "DIU au cuivre",
      "not-sure": "Pas sûre",
    },
    periodOptions: {
      "0-1m": "0–1 mois",
      "1-3m": "1–3 mois",
      "3-6m": "3–6 mois",
      "6m+": "6 mois et +",
    },
    chooseBoth: "Choisis les deux ci-dessus pour voir ce qui peut être fréquent à cette étape.",
    expectKicker: "Ce qui peut être fréquent",
    watchKicker: "Ce qui mérite d'être noté",
    consultTitle: "Quand ça peut valoir le coup d'en parler",
    consultIntro:
      "Ce sont des signaux généraux. Fie-toi à ton ressenti — si quelque chose te paraît bizarre, persistant ou inquiétant, c'est toujours raisonnable d'en parler.",
    consultPoints: [
      "Pas de règles depuis plusieurs mois (et pas de grossesse)",
      "Saignements très abondants ou très longs",
      "Douleurs fortes, inhabituelles ou qui s'aggravent",
      "Fièvre, douleur vive ou pertes inhabituelles après retrait du DIU",
      "Un changement qui semble nouveau, persistant ou préoccupant",
      "Difficulté à concevoir après une période d'essais significative — selon ton âge et ton contexte",
    ],
    individualNote:
      "Les retours dépendent de la durée d'utilisation, de ton cycle d'avant, de ton âge et de nombreux facteurs individuels. Il n'y a pas une seule chronologie.",
    disclaimerTitle: "Note santé —",
    disclaimer:
      "Il s'agit d'un guide éducatif, pas d'un avis médical ni d'un diagnostic. Ce n'est pas une méthode contraceptive. Si des symptômes t'inquiètent, parle avec un professionnel de santé.",
    content: {
      pill: {
        "0-1m": {
          expect: [
            "Un saignement de privation peut apparaître dans les jours qui suivent, semblable à des règles.",
            "Les hormones synthétiques quittent le corps assez vite — souvent en quelques jours.",
            "Quelques semaines peuvent passer avant que ton rythme hormonal naturel reprenne le relais.",
          ],
          watch: [
            "Si quelque chose était masqué par la pilule (acné, sautes d'humeur, règles douloureuses) et revient — c'est une info utile sur ton cycle naturel.",
          ],
        },
        "1-3m": {
          expect: [
            "Les cycles reviennent souvent, mais d'abord de manière irrégulière.",
            "Certaines ovulent en quelques semaines, d'autres en quelques mois.",
            "Peau, humeur, libido et énergie peuvent bouger pendant que les hormones naturelles reprennent.",
          ],
          watch: [
            "Note les patterns : longueur de cycle, flux, sensibilité des seins, glaire cervicale, énergie.",
            "Suivre maintenant est beaucoup plus utile que de se fier à la mémoire plus tard.",
          ],
        },
        "3-6m": {
          expect: [
            "Pour beaucoup, les cycles commencent à se stabiliser — souvent vers 3–6 mois, parfois plus.",
            "Les symptômes antérieurs à la pilule peuvent réapparaître plus clairement.",
          ],
          watch: [
            "Une absence persistante de règles (sans grossesse) mérite attention.",
            "Cycles très abondants, très douloureux ou très erratiques peuvent valoir une discussion avec un professionnel.",
          ],
        },
        "6m+": {
          expect: [
            "La plupart des personnes ont retrouvé un cycle reconnaissable à ce stade.",
            "Certaines conditions sous-jacentes (SOPK, endométriose, thyroïde) peuvent devenir visibles ici — non causées par la pilule, juste plus masquées.",
          ],
          watch: [
            "Si ton cycle est toujours absent ou chaotique après 6+ mois sans grossesse, c'est un moment raisonnable pour demander un avis.",
          ],
        },
      },
      "hormonal-iud": {
        "0-1m": {
          expect: [
            "Quelques saignements légers dans les jours après le retrait sont fréquents.",
            "Les patterns de saignement commencent souvent à revenir vers ton rythme naturel.",
          ],
          watch: [
            "Douleur ou fièvre après le retrait n'est pas attendue — parle avec la personne qui l'a retiré.",
          ],
        },
        "1-3m": {
          expect: [
            "Les règles peuvent revenir progressivement. Elles peuvent être irrégulières au début.",
            "Si tu saignais peu avec le DIU, le retour de saignements réguliers peut sembler être un grand changement.",
          ],
          watch: [
            "Humeur, peau, libido et énergie peuvent bouger pendant que les hormones naturelles reprennent.",
          ],
        },
        "3-6m": {
          expect: [
            "Les cycles commencent souvent à dessiner un pattern plus clair.",
            "Certaines retrouvent leur cycle d'avant le DIU, d'autres en trouvent un nouveau.",
          ],
          watch: [
            "Cycles persistamment absents ou très irréguliers méritent d'en parler.",
          ],
        },
        "6m+": {
          expect: [
            "La plupart des personnes ont un pattern reconnaissable à ce stade.",
            "Si tu suis ton cycle, plusieurs mois de données rendent l'interprétation beaucoup plus claire.",
          ],
          watch: [
            "Si quelque chose te semble encore bizarre après 6 mois — douleur, règles absentes, saignements très abondants — c'est raisonnable de demander un avis.",
          ],
        },
      },
      "copper-iud": {
        "0-1m": {
          expect: [
            "Pas d'arrêt d'hormones synthétiques — ton cycle hormonal tournait déjà avec un DIU cuivre.",
            "Quelques saignements légers dans les jours après le retrait sont fréquents.",
          ],
          watch: [
            "Douleur ou fièvre après retrait n'est pas attendue — parle avec la personne qui l'a retiré.",
          ],
        },
        "1-3m": {
          expect: [
            "Si tes règles étaient plus abondantes ou douloureuses avec le DIU cuivre, ça peut s'apaiser dans les cycles à venir.",
            "Si ton cycle était déjà bien en place avec le DIU, il continue souvent à un rythme similaire.",
          ],
          watch: [
            "Si les saignements restent inhabituellement abondants ou douloureux, ça vaut le coup d'en parler.",
          ],
        },
        "3-6m": {
          expect: [
            "La plupart de celles qui avaient un rythme régulier avec le DIU le gardent.",
            "Volume des saignements et crampes ont souvent retrouvé une base typique pour toi.",
          ],
          watch: [
            "Des changements soudains et inexpliqués de longueur ou de flux méritent d'être notés.",
          ],
        },
        "6m+": {
          expect: [
            "À ce stade, tu as une idée claire de ton pattern de cycle post-DIU.",
            "Plusieurs mois de suivi te donnent une base de référence utile.",
          ],
          watch: [
            "Toute préoccupation persistante est raisonnable à porter à un professionnel, surtout si quelque chose a changé récemment.",
          ],
        },
      },
      "not-sure": {
        "0-1m": {
          expect: [
            "Beaucoup de choses peuvent bouger dans le premier mois : saignements, humeur, peau, énergie.",
            "Le corps s'adapte — laisse-lui un peu de temps avant de tirer des conclusions.",
          ],
          watch: ["Note les symptômes qui semblent nouveaux, persistants ou inquiétants."],
        },
        "1-3m": {
          expect: [
            "Les cycles commencent souvent à revenir, mais peuvent être irréguliers.",
            "Les patterns préexistants (longueur de cycle, SPM, flux) peuvent commencer à se montrer.",
          ],
          watch: [
            "Suivre des choses simples — début des règles, flux, humeur — est utile.",
          ],
        },
        "3-6m": {
          expect: [
            "Beaucoup commencent à voir un rythme plus clair.",
            "Si les symptômes te paraissent différents de ce que tu connaissais, c'est une info.",
          ],
          watch: [
            "Absence persistante de règles, saignements très abondants ou douleurs fortes méritent une discussion.",
          ],
        },
        "6m+": {
          expect: [
            "La plupart des personnes ont un pattern reconnaissable à ce stade.",
            "Plusieurs mois de suivi rendent l'interprétation beaucoup plus claire.",
          ],
          watch: [
            "Si quelque chose te paraît encore bizarre, c'est raisonnable de demander un avis.",
          ],
        },
      },
    },
  },
};

export default function PostContraceptionTimeline() {
  const { lang } = useI18n();
  const t = STRINGS[lang] || STRINGS.en;

  const [type, setType] = useState("");
  const [period, setPeriod] = useState("");

  const reset = () => {
    setType("");
    setPeriod("");
  };

  const content = type && period ? t.content[type]?.[period] : null;

  return (
    <div className="not-prose my-12">
      <div className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-10">
        <h2 className="font-serif text-3xl text-[#362E28]">{t.formTitle}</h2>
        <p className="mt-2 text-sm text-[#6e625b]">{t.privacy}</p>
        <p className="mt-3 text-sm text-[#5d5049]">{t.intro}</p>

        <fieldset className="mt-8">
          <legend className="text-sm font-medium text-[#43372F]">{t.typeLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TYPES.map((key) => (
              <PillButton
                key={key}
                pressed={type === key}
                onClick={() => setType(key)}
                label={t.typeOptions[key]}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-[#43372F]">{t.periodLabel}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PERIODS.map((key) => (
              <PillButton
                key={key}
                pressed={period === key}
                onClick={() => setPeriod(key)}
                label={t.periodOptions[key]}
              />
            ))}
          </div>
        </fieldset>

        {(type || period) && (
          <button
            type="button"
            onClick={reset}
            className="mt-6 text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]"
          >
            ↻ {lang === "fr" ? "Réinitialiser" : "Reset"}
          </button>
        )}
      </div>

      {!content && (type || period) && (
        <p className="mt-4 px-2 text-sm text-[#6e625b]">{t.chooseBoth}</p>
      )}

      {content && (
        <div
          className="mt-6 overflow-hidden rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:p-10"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4887F]">
              {t.typeOptions[type]}
            </p>
            <span className="text-xs text-[#DCCDB8]">{t.periodOptions[period]}</span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-[#43372F]/40 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{t.expectKicker}</p>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-[#E7D8C8]">
                {content.expect.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#7C3C3C]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#43372F]/40 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{t.watchKicker}</p>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-[#E7D8C8]">
                {content.watch.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#B98E86]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#7C3C3C]/40 bg-[#7C3C3C]/10 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#D4887F]">{t.consultTitle}</p>
            <p className="mt-3 text-sm leading-6 text-[#E7D8C8]">{t.consultIntro}</p>
            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-[#E7D8C8]">
              {t.consultPoints.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#D4887F]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
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
