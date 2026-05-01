import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendlyAssets() {
  if (typeof window === "undefined") return Promise.resolve();
  if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS;
    document.head.appendChild(link);
  }
  if (window.Calendly) return Promise.resolve();
  const existing = document.querySelector(`script[src="${CALENDLY_JS}"]`);
  if (existing) {
    return new Promise((resolve) => {
      if (window.Calendly) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const BOOKING_URL = "https://calendly.com/thecyclespaceadmin";

function Icon({ name, size = 18, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
  const icons = {
    calendar: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
    download: (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
    menu: (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
    x: (
      <svg {...common}>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    ),
    globe: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </svg>
    ),
    sparkles: (
      <svg {...common}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

function LogoMark({ size = 200, color = "#9E4F49", textColor = "#F4EBDD", className = "", showWordmark = true }) {
  const cx = 100;
  const cy = 100;
  const r = 88;
  const dotAngleDeg = -55;
  const a = (dotAngleDeg * Math.PI) / 180;
  const dotX = cx + r * Math.cos(a);
  const dotY = cy + r * Math.sin(a);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="The Cycle Space"
    >
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="172 22 86 18 118 16 88 22"
        />
      </g>
      <circle cx={dotX} cy={dotY} r="5" fill={color} />
      {showWordmark && (
        <g textAnchor="middle" fill={textColor}>
          <text x={cx} y={cy - 22} fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="6" fontWeight="500">
            THE
          </text>
          <text
            x={cx}
            y={cy + 18}
            fontFamily='"EB Garamond", Garamond, serif'
            fontStyle="italic"
            fontSize="58"
            fontWeight="500"
          >
            Cycle
          </text>
          <text x={cx} y={cy + 50} fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="8" fontWeight="500">
            SPACE
          </text>
        </g>
      )}
    </svg>
  );
}

function Button({ children, className = "", variant = "default", href, onClick, type = "button", ariaLabel }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#9E4F49]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF] disabled:pointer-events-none disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-[#9E4F49]/55 bg-transparent text-inherit hover:bg-[#FBF7EF]/10 hover:border-[#9E4F49]"
      : "bg-[#241915] text-[#FBF7EF] hover:bg-[#352A25]";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        className={`${base} ${styles} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] ${className}`}>
      {children}
    </div>
  );
}

const copy = {
  en: {
    nav: ["Start", "Services", "For you", "Resources", "About"],
    book: "Book a consultation",
    heroKicker: "Women's health. Cycle education. Body literacy.",
    heroTitle: "Your body has been speaking. Learn to read it.",
    heroText:
      "The Cycle Space helps women understand their cycle, hormones, symptoms and fertility signs through clinically grounded, deeply human online care.",
    heroSecondary: "Explore the space",
    trust: "Online sessions in English or French. Worldwide.",
    manifestoTitle: "This is not symptom management. This is body literacy.",
    manifestoText:
      "Pain, fatigue, bloating, acne, mood shifts and irregular cycles are not random failures. They are signals. The work is to understand what your body is trying to tell you, then build support that is personal, practical and sustainable.",
    manifestoQuote: "Your body is not a problem to fix. It is a system to understand.",
    pillarsTitle: "A calmer, smarter route into hormonal health.",
    pillarsSubtitle:
      "Clinical thinking, cycle education and everyday tools. No fear-based wellness. No quick fixes. No vague advice.",
    services: [
      {
        title: "1:1 Women's Health Consultation",
        tag: "Online deep dive",
        body: "A personalised session combining osteopathic knowledge, functional health analysis, cycle education and recommendations across nutrition, lifestyle, movement and supplementation.",
        cta: "Book this session",
      },
      {
        title: "Cycle Education Session",
        tag: "Understand your phases",
        body: "Learn the four phases of your cycle, how to track them and how to adapt your work, movement, food and recovery with more clarity.",
        cta: "Learn more",
      },
      {
        title: "Digital Resources",
        tag: "Guides + trackers",
        body: "Downloadable tools including cycle tracking guides in English and French, created to help you build body literacy one signal at a time.",
        cta: "Get the guide",
      },
      {
        title: "Group Programmes",
        tag: "Coming soon",
        body: "Cohort-based cycle syncing and hormonal health programmes for women who want structure, education and community.",
        cta: "Join the list",
      },
    ],
    forYouTitle: "You are probably in the right place if...",
    forYou: [
      "You have been told everything looks normal, but you know something is off.",
      "You have PMS, PMDD, PCOS, endometriosis, painful periods, hormonal acne or irregular cycles.",
      "You are coming off the pill and want to understand your natural cycle.",
      "You are perimenopausal, postmenopausal or trying to understand fertility signs.",
      "You want education, not just instructions.",
    ],
    notForTitle: "This may not be the right fit if you want a quick fix.",
    notForText:
      "The Cycle Space is built for women who are ready to be curious about their body and open to gradual, sustainable changes. It works alongside conventional medicine, but does not replace urgent medical care.",
    journeyTitle: "The UX of care: simple, guided, human.",
    journey: [
      ["01", "Choose your path", "Start with a consultation, an education session, or a free resource."],
      ["02", "Share your story", "A short intake helps Elsa understand your cycle, symptoms, lifestyle and goals."],
      ["03", "Meet online", "Your session is calm, clear and practical, with space for questions."],
      ["04", "Leave with a plan", "You receive grounded next steps across tracking, nutrition, lifestyle and support."],
    ],
    resourcesTitle: "Start with a free cycle guide.",
    resourcesText:
      "Download Know Your Flow or Connais Ton Cycle and begin tracking your body with more confidence and less noise.",
    emailPlaceholder: "your@email.com",
    download: "Download the guide",
    aboutTitle: "Meet Elsa.",
    aboutText:
      "Elsa is a French osteopath, women's health practitioner and cycle educator. Born in Venezuela, raised in Brazil, clinically trained in London and shaped by movement, language and culture, she brings a rare mix of rigour, warmth and lived understanding to women's health.",
    credentials: [
      "M.Ost. University College of Osteopathy",
      "7+ years clinical practice",
      "Women's health practitioner",
      "Yoga teacher 200h RYT",
      "French, English, Portuguese, Spanish",
    ],
    finalTitle: "Ready to understand what your body has been trying to say?",
    finalText: "Book a first consultation or start with a free guide. Either way, this is a space for clarity.",
    modalTitle: "Book a consultation",
    modalText: "Pick a date and time below. Recommended: a short discovery call first, then a full consultation.",
    calendly: "Open Calendly",
    calendlyLoading: "Loading the calendar…",
    calendlyError: "We couldn't load the calendar. You can open Calendly directly.",
    disclaimer:
      "Education and support — does not replace urgent medical care. If you are in distress or experiencing severe symptoms, please contact your doctor or local emergency services.",
    footerTagline: "Cycle education. Women's health. Online, worldwide.",
  },
  fr: {
    nav: ["Accueil", "Services", "Pour toi", "Ressources", "À propos"],
    book: "Prendre rendez-vous",
    heroKicker: "Santé féminine. Éducation du cycle. Compréhension du corps.",
    heroTitle: "Ton corps communique. Apprends à lire ses signaux.",
    heroText:
      "The Cycle Space aide les femmes à comprendre leur cycle, leurs hormones, leurs symptômes et leurs signes de fertilité grâce à un accompagnement en ligne, clinique, clair et humain.",
    heroSecondary: "Explorer l'espace",
    trust: "Séances en ligne en anglais ou français. Partout dans le monde.",
    manifestoTitle: "On ne gère pas juste des symptômes. On apprend le langage du corps.",
    manifestoText:
      "Douleurs, fatigue, ballonnements, acné, variations d'humeur et cycles irréguliers ne sont pas des échecs aléatoires. Ce sont des signaux. Le travail consiste à comprendre ce que ton corps essaie de dire, puis à construire un soutien personnel, concret et durable.",
    manifestoQuote: "Ton corps n'est pas un problème à corriger. C'est un système à comprendre.",
    pillarsTitle: "Une approche plus calme et plus intelligente de la santé hormonale.",
    pillarsSubtitle:
      "Réflexion clinique, éducation du cycle et outils concrets. Pas de wellness anxiogène. Pas de solution magique. Pas de conseils flous.",
    services: [
      {
        title: "Consultation santé féminine 1:1",
        tag: "Bilan en ligne",
        body: "Une séance personnalisée qui combine ostéopathie, analyse fonctionnelle, éducation du cycle et recommandations autour de la nutrition, du mode de vie, du mouvement et du soutien complémentaire.",
        cta: "Réserver cette séance",
      },
      {
        title: "Session d'éducation du cycle",
        tag: "Comprendre tes phases",
        body: "Apprends les quatre phases de ton cycle, comment les suivre, et comment adapter ton travail, ton mouvement, ton alimentation et ta récupération avec plus de clarté.",
        cta: "En savoir plus",
      },
      {
        title: "Ressources digitales",
        tag: "Guides + trackers",
        body: "Des outils téléchargeables, dont des guides de suivi du cycle en anglais et en français, pour développer ta compréhension du corps signal après signal.",
        cta: "Recevoir le guide",
      },
      {
        title: "Programmes de groupe",
        tag: "Bientôt disponible",
        body: "Des programmes en cohorte autour du cycle syncing et de la santé hormonale pour les femmes qui cherchent structure, éducation et communauté.",
        cta: "Rejoindre la liste",
      },
    ],
    forYouTitle: "Tu es probablement au bon endroit si...",
    forYou: [
      "On t'a dit que tout était normal, mais tu sens que quelque chose ne va pas.",
      "Tu vis avec du SPM, PMDD, SOPK, endométriose, règles douloureuses, acné hormonale ou cycles irréguliers.",
      "Tu arrêtes la pilule et tu veux comprendre ton cycle naturel.",
      "Tu es en périménopause, ménopause, ou tu veux comprendre tes signes de fertilité.",
      "Tu veux comprendre, pas seulement recevoir des instructions.",
    ],
    notForTitle: "Ce n'est peut-être pas pour toi si tu cherches une solution magique.",
    notForText:
      "The Cycle Space est fait pour les femmes prêtes à être curieuses de leur corps et ouvertes à des changements progressifs et durables. L'approche travaille avec la médecine conventionnelle, mais ne remplace pas une prise en charge médicale urgente.",
    journeyTitle: "L'expérience de soin : simple, guidée, humaine.",
    journey: [
      ["01", "Choisis ton point d'entrée", "Commence par une consultation, une session d'éducation ou une ressource gratuite."],
      ["02", "Partage ton histoire", "Un court questionnaire aide Elsa à comprendre ton cycle, tes symptômes, ton mode de vie et tes objectifs."],
      ["03", "Rendez-vous en ligne", "La séance est calme, claire, pratique, avec de l'espace pour tes questions."],
      ["04", "Repars avec un plan", "Tu reçois des étapes concrètes autour du tracking, de la nutrition, du mode de vie et du soutien."],
    ],
    resourcesTitle: "Commence avec un guide gratuit du cycle.",
    resourcesText:
      "Télécharge Know Your Flow ou Connais Ton Cycle et commence à suivre ton corps avec plus de confiance et moins de bruit.",
    emailPlaceholder: "ton@email.com",
    download: "Télécharger le guide",
    aboutTitle: "Rencontrer Elsa.",
    aboutText:
      "Elsa est ostéopathe française, praticienne en santé féminine et éducatrice du cycle. Née au Venezuela, élevée au Brésil, formée cliniquement à Londres et influencée par le mouvement, les langues et les cultures, elle apporte une combinaison rare de rigueur, chaleur et compréhension vécue à la santé féminine.",
    credentials: [
      "M.Ost. University College of Osteopathy",
      "7+ ans de pratique clinique",
      "Praticienne en santé féminine",
      "Professeure de yoga 200h RYT",
      "Français, anglais, portugais, espagnol",
    ],
    finalTitle: "Prête à comprendre ce que ton corps essaie de dire ?",
    finalText: "Réserve une première consultation ou commence avec un guide gratuit. Dans tous les cas, cet espace est fait pour la clarté.",
    modalTitle: "Prendre rendez-vous",
    modalText: "Choisis une date et un horaire ci-dessous. Parcours conseillé : un appel découverte court, puis une consultation complète.",
    calendly: "Ouvrir Calendly",
    calendlyLoading: "Chargement du calendrier…",
    calendlyError: "Impossible de charger le calendrier. Tu peux ouvrir Calendly directement.",
    disclaimer:
      "Éducation et accompagnement — ne remplace pas un avis médical urgent. En cas de détresse ou de symptômes sévères, contacte ton médecin ou les services d'urgence.",
    footerTagline: "Éducation du cycle. Santé féminine. En ligne, partout dans le monde.",
  },
};

function OrbitalGraphic({ dense = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className={`absolute rounded-full border border-[#9E4F49]/50 ${
          dense ? "right-[-160px] top-[-140px] h-[520px] w-[520px]" : "right-[-220px] top-[-120px] h-[680px] w-[680px]"
        }`}
      />
      <motion.div
        initial={{ opacity: 0, rotate: 18 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        className={`absolute rounded-full border border-[#9E4F49]/25 ${
          dense ? "right-[40px] top-[70px] h-[280px] w-[280px]" : "right-[80px] top-[110px] h-[360px] w-[360px]"
        }`}
      />
      <div className="absolute right-[13%] top-[18%] h-5 w-5 rounded-full bg-[#9E4F49] shadow-[0_0_0_10px_rgba(158,79,73,0.08)]" />
    </div>
  );
}

function BookingModal({ open, onClose, t, lang }) {
  const widgetRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    loadCalendlyAssets()
      .then(() => {
        if (cancelled || !widgetRef.current || !window.Calendly) return;
        widgetRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: `${BOOKING_URL}?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=9E4F49&text_color=241915&background_color=FBF7EF`,
          parentElement: widgetRef.current,
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [open, lang]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241915]/75 p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-[#FBF7EF] shadow-2xl md:h-[88vh]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#DCCDB8] px-6 py-5 md:px-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#9E4F49]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#6F3432]">
              <Icon name="calendar" size={13} /> Calendly
            </div>
            <h3 id="booking-title" className="font-serif text-2xl leading-tight text-[#241915] md:text-3xl">
              {t.modalTitle}
            </h3>
            <p className="mt-1 text-sm text-[#5d5049] md:text-base">{t.modalText}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-[#DCCDB8] p-2 text-[#352A25] transition hover:bg-[#F4EBDD]"
            aria-label="Close booking modal"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="relative flex-1 bg-[#FBF7EF]">
          {status !== "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FBF7EF]">
              {status === "error" ? (
                <>
                  <p className="text-base text-[#6F3432]">{t.calendlyError}</p>
                  <Button href={BOOKING_URL} className="bg-[#9E4F49] text-[#FBF7EF] hover:bg-[#6F3432]">
                    {t.calendly} <Icon name="arrow" size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#9E4F49]/30 border-t-[#9E4F49]" />
                  <p className="text-sm text-[#6e625b]">{t.calendlyLoading}</p>
                </>
              )}
            </div>
          )}
          <div ref={widgetRef} className="h-full w-full" style={{ minHeight: 600 }} />
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const t = useMemo(() => copy[lang], [lang]);

  const sectionIds = ["start", "services", "for-you", "resources", "about"];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#FBF7EF] text-[#241915]">
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} t={t} lang={lang} />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#DCCDB8]/60 bg-[#FBF7EF]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button onClick={() => scrollTo("start")} className="group flex items-center gap-3" aria-label="Go to homepage">
            <LogoMark size={40} color="#9E4F49" textColor="#241915" showWordmark={false} />
            <span className="font-serif text-xl tracking-tight">The Cycle Space</span>
          </button>

          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary">
            {t.nav.map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollTo(sectionIds[idx])}
                className="text-[#5d5049] transition hover:text-[#9E4F49]"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setLang(lang === "en" ? "fr" : "en")}
              className="inline-flex items-center gap-2 rounded-full border border-[#DCCDB8] px-4 py-2 text-sm text-[#5d5049] hover:bg-[#F4EBDD]"
              aria-label={lang === "en" ? "Switch to French" : "Switch to English"}
            >
              <Icon name="globe" size={16} /> {lang === "en" ? "FR" : "EN"}
            </button>
            <Button onClick={() => setBookingOpen(true)}>{t.book}</Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Icon name="x" /> : <Icon name="menu" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#DCCDB8] bg-[#FBF7EF] px-5 py-5 md:hidden">
            <div className="grid gap-4">
              {t.nav.map((item, idx) => (
                <button
                  key={item}
                  onClick={() => scrollTo(sectionIds[idx])}
                  className="text-left text-lg text-[#352A25]"
                >
                  {item}
                </button>
              ))}
              <div className="flex gap-3 pt-2">
                <Button onClick={() => { setMenuOpen(false); setBookingOpen(true); }} className="flex-1">
                  {t.book}
                </Button>
                <Button
                  onClick={() => setLang(lang === "en" ? "fr" : "en")}
                  variant="outline"
                  className="border-[#DCCDB8] text-[#241915] hover:bg-[#F4EBDD]"
                >
                  {lang === "en" ? "FR" : "EN"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <section
        id="start"
        className="relative isolate min-h-[92vh] overflow-hidden bg-[#241915] px-5 pb-16 pt-32 text-[#FBF7EF] md:px-8 md:pt-40"
      >
        <OrbitalGraphic />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#9E4F49]/40 bg-[#FBF7EF]/5 px-4 py-2 text-sm text-[#E7D8C8]">
              <Icon name="sparkles" size={15} className="text-[#C46B63]" /> {t.heroKicker}
            </div>
            <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-tight md:text-8xl">
              {t.heroTitle}
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-[#E7D8C8] md:text-2xl md:leading-9">{t.heroText}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => setBookingOpen(true)}
                className="bg-[#9E4F49] px-7 py-4 text-base text-[#FBF7EF] hover:bg-[#6F3432]"
              >
                {t.book} <Icon name="calendar" size={18} />
              </Button>
              <Button
                onClick={() => scrollTo("services")}
                variant="outline"
                className="px-7 py-4 text-base text-[#FBF7EF]"
              >
                {t.heroSecondary}
              </Button>
            </div>
            <p className="mt-7 text-sm tracking-wide text-[#DCCDB8]">{t.trust}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative ml-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#9E4F49]/30 bg-[#352A25] p-10 shadow-2xl">
              <LogoMark size="100%" color="#9E4F49" textColor="#F4EBDD" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.manifestoTitle}</h2>
          <div>
            <p className="text-xl leading-9 text-[#5d5049]">{t.manifestoText}</p>
            <p className="mt-10 font-serif text-2xl italic leading-snug text-[#6F3432] md:text-3xl">
              &ldquo;{t.manifestoQuote}&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#F4EBDD] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 md:grid-cols-[1fr_0.85fr] md:items-end">
            <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.pillarsTitle}</h2>
            <p className="text-lg leading-8 text-[#5d5049]">{t.pillarsSubtitle}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {t.services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
              >
                <Card className="h-full shadow-none transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-full flex-col p-7">
                    <span className="mb-7 h-5 w-5 rounded-full bg-[#9E4F49]" />
                    <p className="mb-3 text-sm uppercase tracking-[0.16em] text-[#9E4F49]">{service.tag}</p>
                    <h3 className="font-serif text-3xl leading-tight">{service.title}</h3>
                    <p className="mt-5 flex-1 text-base leading-7 text-[#5d5049]">{service.body}</p>
                    {idx === 0 ? (
                      <button
                        onClick={() => setBookingOpen(true)}
                        className="mt-8 inline-flex items-center gap-2 text-left text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
                      >
                        {service.cta} <Icon name="arrow" size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => scrollTo("resources")}
                        className="mt-8 inline-flex items-center gap-2 text-left text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
                      >
                        {service.cta} <Icon name="arrow" size={16} />
                      </button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="for-you" className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2.5rem] bg-[#241915] p-8 text-[#FBF7EF] md:p-12">
            <h2 className="font-serif text-5xl leading-tight">{t.forYouTitle}</h2>
            <div className="mt-10 grid gap-5">
              {t.forYou.map((item) => (
                <div key={item} className="flex gap-4 border-b border-[#FBF7EF]/10 pb-5 last:border-0">
                  <Icon name="check" className="mt-1 shrink-0 text-[#C46B63]" size={21} />
                  <p className="text-lg leading-7 text-[#E7D8C8]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#DCCDB8] bg-[#F4EBDD] p-8 md:p-12">
            <OrbitalGraphic dense />
            <div className="relative">
              <h3 className="font-serif text-4xl leading-tight">{t.notForTitle}</h3>
              <p className="mt-6 text-lg leading-8 text-[#5d5049]">{t.notForText}</p>
              <Button
                onClick={() => setBookingOpen(true)}
                className="mt-9 bg-[#9E4F49] px-6 py-4 text-[#FBF7EF] hover:bg-[#6F3432]"
              >
                {t.book}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F4EBDD] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">{t.journeyTitle}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {t.journey.map(([num, title, body]) => (
              <div key={num} className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-7">
                <p className="font-serif text-5xl text-[#9E4F49]">{num}</p>
                <h3 className="mt-8 text-xl font-medium">{title}</h3>
                <p className="mt-4 leading-7 text-[#5d5049]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.8rem] bg-[#241915] text-[#FBF7EF] md:grid-cols-[1fr_0.8fr]">
          <div className="p-8 md:p-14">
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#C46B63]">Free resource</p>
            <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.resourcesTitle}</h2>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-[#E7D8C8]">{t.resourcesText}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 flex max-w-xl flex-col gap-3 rounded-[2rem] bg-[#FBF7EF] p-2 sm:flex-row sm:rounded-full"
            >
              <input
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-[#241915] outline-none placeholder:text-[#8a7d75]"
                placeholder={t.emailPlaceholder}
                type="email"
                aria-label="Email"
                required
              />
              <Button type="submit" className="bg-[#9E4F49] px-6 py-4 text-[#FBF7EF] hover:bg-[#6F3432]">
                <Icon name="download" size={18} /> {t.download}
              </Button>
            </form>
          </div>
          <div className="relative min-h-[420px] bg-[#352A25] p-8 md:p-14">
            <OrbitalGraphic dense />
            <div className="relative ml-auto flex h-full max-w-sm flex-col justify-end rounded-[2rem] border border-[#9E4F49]/40 bg-[#FBF7EF] p-8 text-[#241915] shadow-2xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[#9E4F49]">Guide</p>
              <h3 className="mt-6 font-serif text-5xl leading-none">Know Your Flow</h3>
              <p className="mt-6 text-[#5d5049]">Cycle tracking guide · English + French</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#F4EBDD] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#DCCDB8] p-3">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
              <img
                src={`${import.meta.env.BASE_URL}elsa.jpg`}
                alt="Elsa, osteopath and women's health practitioner"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241915]/85 via-[#241915]/45 to-transparent p-7 pt-20 text-[#FBF7EF]">
                <p className="font-serif text-5xl leading-none">Elsa</p>
                <p className="mt-3 text-sm leading-6 text-[#E7D8C8]">
                  Osteopath · Women's health practitioner · Cycle educator
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.aboutTitle}</h2>
            <p className="mt-7 text-xl leading-9 text-[#5d5049]">{t.aboutText}</p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {t.credentials.map((credential) => (
                <div
                  key={credential}
                  className="rounded-full border border-[#DCCDB8] bg-[#FBF7EF] px-5 py-3 text-sm text-[#5d5049]"
                >
                  {credential}
                </div>
              ))}
            </div>
            <Button onClick={() => setBookingOpen(true)} className="mt-10 px-7 py-4">
              {t.book}
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#241915] px-5 py-24 text-[#FBF7EF] md:px-8 md:py-32">
        <OrbitalGraphic />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-[#E7D8C8]">{t.finalText}</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => setBookingOpen(true)}
              className="bg-[#9E4F49] px-7 py-4 text-[#FBF7EF] hover:bg-[#6F3432]"
            >
              {t.book} <Icon name="calendar" size={18} />
            </Button>
            <Button
              onClick={() => scrollTo("resources")}
              variant="outline"
              className="px-7 py-4 text-[#FBF7EF]"
            >
              {t.download}
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-[#FBF7EF] px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl border-t border-[#DCCDB8] pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-2xl">The Cycle Space</p>
              <p className="mt-1 text-sm text-[#6e625b]">{t.footerTagline}</p>
              <p className="mt-1 text-sm text-[#6e625b]">thecyclespace.com · @elsa.thecyclespace</p>
            </div>
            <div className="flex gap-3 text-[#5d5049]">
              <a
                href="https://www.instagram.com/elsa.thecyclespace"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#DCCDB8] p-3 hover:bg-[#F4EBDD]"
                aria-label="Instagram"
              >
                <Icon name="instagram" size={18} />
              </a>
              <a
                href="mailto:hello@thecyclespace.com"
                className="rounded-full border border-[#DCCDB8] p-3 hover:bg-[#F4EBDD]"
                aria-label="Email"
              >
                <Icon name="mail" size={18} />
              </a>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-5 text-[#8a7d75]">{t.disclaimer}</p>
          <p className="mt-3 text-xs text-[#8a7d75]">© {new Date().getFullYear()} The Cycle Space</p>
        </div>
      </footer>
    </main>
  );
}
