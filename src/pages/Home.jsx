import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon, Button, LogoMark, OrbitalGraphic } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import PeriodCalculator from "../components/tools/PeriodCalculator";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta } from "../lib/seo";

const TOOL_BLOCK = {
  en: {
    kicker: "Free tool",
    title: "Track your cycle.",
    description:
      "Estimate your next period, your ovulation and your fertile window. Everything stays in your browser.",
    learnMore: "Read the full article",
    slug: "period-calculator",
  },
  fr: {
    kicker: "Outil gratuit",
    title: "Calcule ton cycle.",
    description:
      "Estime tes prochaines règles, ton ovulation et ta fenêtre fertile. Tout reste dans ton navigateur.",
    learnMore: "Lire l'article complet",
    slug: "calculateur-cycle-menstruel",
  },
};

export default function Home() {
  const { t, lang } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta(null);
  const tool = TOOL_BLOCK[lang] || TOOL_BLOCK.en;

  return (
    <>
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-[#241915] px-5 pb-16 pt-32 text-[#FBF7EF] md:px-8 md:pt-40">
        <OrbitalGraphic />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#9E4F49]/40 bg-[#FBF7EF]/5 px-4 py-2 text-sm text-[#E7D8C8]">
              <Icon name="sparkles" size={15} className="text-[#C46B63]" /> {t.heroKicker}
            </div>
            <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-tight md:text-8xl">{t.heroTitle}</h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-[#E7D8C8] md:text-2xl md:leading-9">{t.heroText}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button onClick={openBooking} className="bg-[#9E4F49] px-7 py-4 text-base text-[#FBF7EF] hover:bg-[#6F3432]">
                {t.book} <Icon name="calendar" size={18} />
              </Button>
              <Button to="/services" variant="outline" className="px-7 py-4 text-base text-[#FBF7EF]">
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

      <section className="bg-[#F4EBDD] px-5 py-24 md:px-8 md:py-32">
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
              <Button onClick={openBooking} className="mt-9 bg-[#9E4F49] px-6 py-4 text-[#FBF7EF] hover:bg-[#6F3432]">
                {t.book}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#9E4F49]">{tool.kicker}</p>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">{tool.title}</h2>
            <p className="mt-5 text-lg leading-7 text-[#5d5049]">{tool.description}</p>
          </div>
          <PeriodCalculator />
          <div className="mt-8">
            <Link
              to={`/blog/${tool.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
            >
              {tool.learnMore} <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
