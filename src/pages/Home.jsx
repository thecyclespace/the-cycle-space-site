import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon, Button, BrandLogo, OrbitalGraphic } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import Method from "../components/Method";
import PeriodCalculator from "../components/tools/PeriodCalculator";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta } from "../lib/seo";

const TOOL_SLUG_BY_LANG = {
  en: "period-calculator",
  fr: "calculateur-cycle-menstruel",
};

export default function Home() {
  const { t, lang } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta(null);
  const tool = t.homeTool || {};
  const toolSlug = TOOL_SLUG_BY_LANG[lang] || TOOL_SLUG_BY_LANG.en;

  return (
    <>
      <section className="relative isolate min-h-[80vh] overflow-hidden bg-[#362E28] px-5 pb-14 pt-28 text-[#FBF7EF] md:min-h-[92vh] md:px-8 md:pb-16 md:pt-40">
        <OrbitalGraphic />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C3C3C]/40 bg-[#FBF7EF]/5 px-4 py-2 text-xs text-[#E7D8C8] md:mb-8 md:text-sm">
              <Icon name="sparkles" size={14} className="text-[#D4887F]" /> {t.heroKicker}
            </div>
            <h1 className="max-w-4xl font-serif text-[2.75rem] leading-[1.02] tracking-tight md:text-8xl md:leading-[0.92]">
              {t.mobileHeroTitle && t.mobileHeroTitle.trim() ? (
                <>
                  <span className="md:hidden">{t.mobileHeroTitle}</span>
                  <span className="hidden md:inline">{t.heroTitle}</span>
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-[#E7D8C8] md:mt-8 md:text-2xl md:leading-9">
              {t.mobileHeroText && t.mobileHeroText.trim() ? (
                <>
                  <span className="md:hidden">{t.mobileHeroText}</span>
                  <span className="hidden md:inline">{t.heroText}</span>
                </>
              ) : (
                t.heroText
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10 md:gap-4">
              <Button onClick={openBooking} className="bg-[#7C3C3C] px-7 py-4 text-base text-[#FBF7EF] hover:bg-[#5C2B2B]">
                {t.book} <Icon name="calendar" size={18} />
              </Button>
              <Button to="/services" variant="outline" className="px-7 py-4 text-base text-[#FBF7EF]">
                {t.heroSecondary}
              </Button>
            </div>
            <p className="mt-6 text-xs tracking-wide text-[#DCCDB8] md:mt-7 md:text-sm">{t.trust}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative ml-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] border border-[#7C3C3C]/30 bg-[#43372F] p-10 shadow-2xl">
              <BrandLogo variant="main" tone="dark" className="h-full w-full object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-12">
          <h2 className="font-serif text-4xl leading-tight md:text-7xl">{t.manifestoTitle}</h2>
          <div>
            <p className="text-lg leading-7 text-[#5d5049] md:text-xl md:leading-9">{t.manifestoText}</p>
            <p className="mt-8 font-sans text-xl font-light italic leading-snug text-[#5C2B2B] md:mt-10 md:text-3xl">
              &ldquo;{t.manifestoQuote}&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Method />

      <section className="bg-[#F4EBDD] px-5 py-16 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_0.85fr] md:gap-8">
          <div className="rounded-[2rem] bg-[#362E28] p-6 text-[#FBF7EF] md:rounded-[2.5rem] md:p-12">
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">{t.forYouTitle}</h2>
            <div className="mt-8 grid gap-4 md:mt-10 md:gap-5">
              {t.forYou.map((item) => (
                <div key={item} className="flex gap-3 border-b border-[#FBF7EF]/10 pb-4 last:border-0 md:gap-4 md:pb-5">
                  <Icon name="check" className="mt-1 shrink-0 text-[#D4887F]" size={20} />
                  <p className="text-base leading-6 text-[#E7D8C8] md:text-lg md:leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#DCCDB8] bg-[#F4EBDD] p-6 md:rounded-[2.5rem] md:p-12">
            <OrbitalGraphic dense />
            <div className="relative">
              <h3 className="font-serif text-3xl leading-tight md:text-4xl">{t.notForTitle}</h3>
              <p className="mt-5 text-base leading-7 text-[#5d5049] md:mt-6 md:text-lg md:leading-8">{t.notForText}</p>
              <Button onClick={openBooking} className="mt-7 bg-[#7C3C3C] px-6 py-4 text-[#FBF7EF] hover:bg-[#5C2B2B] md:mt-9">
                {t.book}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-2xl md:mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#7C3C3C] md:mb-4 md:text-sm">{tool.kicker}</p>
            <h2 className="font-serif text-3xl leading-tight md:text-6xl">{tool.title}</h2>
            <p className="mt-4 text-base leading-7 text-[#5d5049] md:mt-5 md:text-lg">{tool.description}</p>
          </div>
          <PeriodCalculator />
          <div className="mt-8">
            <Link
              to={`/blog/${toolSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]"
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
