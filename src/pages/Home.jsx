import { Link } from "react-router-dom";
import { Icon, Button, Reveal } from "../components/ui";
import Picture from "../components/Picture";
import FinalCTA from "../components/FinalCTA";
import Method from "../components/Method";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta } from "../lib/seo";
import { concernHref } from "../lib/concernLinks";
import siteSettings from "../content/settings/site.json";
import images from "../content/settings/images.json";

const TOOL_SLUG_BY_LANG = {
  en: "period-calculator",
  fr: "calculateur-cycle-menstruel",
};

export default function Home() {
  const { t, lang, path } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta(null);
  const tool = t.homeTool || {};
  const toolSlug = TOOL_SLUG_BY_LANG[lang] || TOOL_SLUG_BY_LANG.en;
  const alts = t.imageAlts || {};

  return (
    <>
      {/* 1. Hero: who is speaking (Elsa, her real photo), the promise, one action */}
      <section className="bg-[#F4EBDD] px-5 pb-12 pt-24 md:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
          <div>
            {t.heroKicker && (
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#7C3C3C] md:mb-4 md:text-sm">{t.heroKicker}</p>
            )}
            <h1 className="break-words font-serif text-[clamp(2rem,8.6vw,2.7rem)] leading-[1.08] text-[#362E28] sm:text-5xl md:text-5xl lg:text-6xl">
              {t.mobileHeroTitle && t.mobileHeroTitle.trim() ? (
                <>
                  <span className="md:hidden">{t.mobileHeroTitle}</span>
                  <span className="hidden md:inline">{t.heroTitle}</span>
                </>
              ) : (
                t.heroTitle
              )}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-7 text-[#5d5049] md:mt-6 md:text-xl md:leading-8">
              {t.mobileHeroText && t.mobileHeroText.trim() ? (
                <>
                  <span className="md:hidden">{t.mobileHeroText}</span>
                  <span className="hidden md:inline">{t.heroText}</span>
                </>
              ) : (
                t.heroText
              )}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
              <Button
                onClick={() => openBooking("intro")}
                className="min-h-[52px] bg-[#7C3C3C] px-7 text-base text-[#FBF7EF] hover:bg-[#5C2B2B]"
              >
                {t.book} <Icon name="calendar" size={18} />
              </Button>
              <Button to={path("/services")} variant="outline" className="min-h-[52px] px-7 text-base text-[#362E28]">
                {t.heroSecondary}
              </Button>
            </div>
            <p className="mt-4 text-sm text-[#5d5049]">{t.trust}</p>
          </div>
          <figure className="mx-auto w-full max-w-[300px] md:max-w-[400px]">
            <div className="overflow-hidden rounded-[2rem] bg-[#DCCDB8] p-2 md:rounded-[2.5rem] md:p-3">
              <img
                src={`${import.meta.env.BASE_URL}${images.elsaImage.replace(/^\//, "")}`}
                alt={alts.elsa || "Elsa"}
                width="400"
                height="400"
                loading="eager"
                fetchpriority="high"
                className="aspect-square w-full rounded-[1.6rem] object-cover md:rounded-[2rem]"
              />
            </div>
            {t.heroCaption && <figcaption className="mt-3 text-center text-sm text-[#6e625b]">{t.heroCaption}</figcaption>}
          </figure>
        </div>
      </section>

      {/* 2. How Elsa works: the method in plain words */}
      <Method />

      {/* 3. What brings you here */}
      <section className="bg-[#FBF7EF] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="break-words font-serif text-3xl leading-tight text-[#362E28] sm:text-4xl md:text-5xl">
            {t.concerns.title}
          </h2>
          <Reveal className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-5">
            {t.concerns.items.map((item) => (
              <Link
                key={item.title}
                to={path(concernHref(item.link, lang))}
                className="group flex min-h-[112px] flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-[#DCCDB8] bg-[#FBF7EF] p-4 transition hover:-translate-y-0.5 hover:border-[#7C3C3C]/50 hover:shadow-lg md:min-h-[150px] md:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EBDD] text-[#7C3C3C] md:h-12 md:w-12">
                  <Icon name={item.icon} size={22} />
                </span>
                <span className="text-[0.95rem] font-medium leading-snug text-[#362E28] md:text-lg">{item.title}</span>
              </Link>
            ))}
          </Reveal>
          {t.concerns.unsure && (
            <div className="mt-8 max-w-2xl md:mt-10">
              <p className="text-base leading-7 text-[#43372F] md:text-lg md:leading-8">{t.concerns.unsure}</p>
              <button
                type="button"
                onClick={() => openBooking("intro")}
                className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#5C2B2B] underline-offset-4 hover:text-[#7C3C3C] hover:underline"
              >
                {t.book} <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6e625b]">{t.concerns.note}</p>
        </div>
      </section>

      {/* 4. Why Elsa does this work (her story, in her words) */}
      <section className="bg-[#F4EBDD] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="break-words font-serif text-3xl leading-tight text-[#362E28] sm:text-4xl md:text-5xl">
            {t.meetElsa.title}
          </h2>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#5d5049] md:mt-6 md:text-lg md:leading-8">{t.meetElsa.text}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {t.credentials.slice(0, 2).map((c) => (
              <li key={c} className="rounded-full border border-[#DCCDB8] bg-[#FBF7EF] px-4 py-2 text-sm text-[#5d5049]">
                {c}
              </li>
            ))}
          </ul>
          <Button to={path("/about")} variant="outline" className="mt-7 min-h-[48px] px-7 text-[#362E28]">
            {t.meetElsa.cta} <Icon name="arrow" size={16} />
          </Button>
        </div>
      </section>

      {/* 5. Offers */}
      <section className="bg-[#FBF7EF] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="break-words font-serif text-3xl leading-tight text-[#362E28] sm:text-4xl md:text-5xl">
            {t.offersTitle}
          </h2>
          <Reveal className="mt-8 grid gap-3 md:mt-12 md:grid-cols-3 md:gap-5">
            {t.services.slice(0, 3).map((service, i) => (
              <div
                key={service.title}
                className={`flex flex-col rounded-[1.5rem] border p-5 md:rounded-[2rem] md:p-7 ${
                  i === 0 ? "border-[#7C3C3C]/50 bg-[#F4EBDD]" : "border-[#DCCDB8] bg-[#FBF7EF]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[#7C3C3C]">{service.tag}</p>
                <h3 className="mt-2 break-words font-serif text-2xl leading-tight text-[#362E28] md:text-xl lg:text-2xl xl:text-3xl">{service.title}</h3>
                {service.summary && (
                  <p className="mt-3 hidden flex-1 text-base leading-7 text-[#5d5049] sm:block">{service.summary}</p>
                )}
                <button
                  onClick={() => openBooking(service.action)}
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C] md:mt-6"
                >
                  {service.cta} <Icon name="arrow" size={16} />
                </button>
              </div>
            ))}
          </Reveal>
          <Link
            to={path("/services")}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#5C2B2B] underline-offset-4 hover:text-[#7C3C3C] hover:underline"
          >
            {t.offersCta} <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>

      {/* 6. Free tool (the calculator itself lives in its article) */}
      <section className="bg-[#F4EBDD] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14">
          <Picture
            src={images.toolImage}
            alt={alts.tool}
            sizes="(min-width: 768px) 44vw, 100vw"
            className="aspect-[5/4] w-full rounded-[2rem] object-cover md:rounded-[2.5rem]"
          />
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#7C3C3C] md:text-sm">{tool.kicker}</p>
            <h2 className="break-words font-serif text-3xl leading-tight text-[#362E28] sm:text-4xl md:text-5xl">{tool.title}</h2>
            <p className="mt-4 text-base leading-7 text-[#5d5049] md:text-lg md:leading-8">{tool.description}</p>
            <Button
              to={path(`/blog/${toolSlug}`)}
              className="mt-7 min-h-[48px] bg-[#7C3C3C] px-7 text-[#FBF7EF] hover:bg-[#5C2B2B]"
            >
              {tool.cta || tool.learnMore} <Icon name="arrow" size={16} />
            </Button>
            {tool.note && <p className="mt-4 text-sm leading-6 text-[#6e625b]">{tool.note}</p>}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
