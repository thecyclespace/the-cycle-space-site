import { useEffect, useRef } from "react";
import { Button, Icon } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta, useJsonLd } from "../lib/seo";
import { personSchema } from "../lib/schemas";
import siteSettings from "../content/settings/site.json";

export default function About() {
  const { t, lang } = useI18n();
  const { openBooking } = useBooking();
  const story = useRef(null);
  const copy = t.about || {};
  usePageMeta("about");
  useJsonLd(personSchema(lang));

  // The full story is folded on phones (the text stays in the page for readers and search engines)
  // and open on larger screens.
  useEffect(() => {
    if (story.current && window.matchMedia("(min-width: 768px)").matches) story.current.open = true;
  }, []);

  return (
    <>
      <section className="bg-[#F4EBDD] px-5 pb-12 pt-24 md:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
          <div className="mx-auto w-full max-w-[320px] md:max-w-[420px]">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#DCCDB8] p-2 md:rounded-[2.5rem] md:p-3">
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] md:rounded-[2rem]">
                <img
                  src={`${import.meta.env.BASE_URL}${siteSettings.elsaImage}`}
                  alt={t.imageAlts?.elsa || "Elsa"}
                  width="400"
                  height="400"
                  loading="eager"
                  fetchpriority="high"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className="break-words font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">{t.aboutTitle}</h1>
            <p className="mt-4 text-lg leading-7 text-[#5d5049] md:mt-6 md:text-xl md:leading-8">{copy.intro || t.meetElsa?.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {t.credentials.map((credential) => (
                <li key={credential} className="rounded-full border border-[#DCCDB8] bg-[#FBF7EF] px-4 py-2 text-sm text-[#5d5049]">
                  {credential}
                </li>
              ))}
            </ul>
            <Button onClick={() => openBooking("intro")} className="mt-7 min-h-[52px] bg-[#7C3C3C] px-7 text-[#FBF7EF] hover:bg-[#5C2B2B]">
              {t.book} <Icon name="calendar" size={18} />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <details ref={story} className="group">
            <summary className="flex min-h-[56px] cursor-pointer list-none flex-wrap items-center justify-between gap-x-4 gap-y-1 border-y border-[#DCCDB8] py-3 marker:content-none [&::-webkit-details-marker]:hidden">
              <h2 className="py-1 font-serif text-2xl text-[#362E28] sm:text-3xl md:text-4xl">{copy.storyTitle}</h2>
              <span className="text-sm font-medium text-[#5C2B2B] group-open:hidden">{copy.storyToggle} +</span>
              <span aria-hidden="true" className="hidden shrink-0 text-3xl leading-none text-[#7C3C3C] group-open:block">&minus;</span>
            </summary>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#5d5049] md:text-lg md:leading-9">{t.aboutText}</p>
          </details>
        </div>
      </section>

      <section className="bg-[#F4EBDD] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#7C3C3C] md:text-sm">{copy.approachKicker}</p>
            <h2 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{t.manifestoTitle}</h2>
          </div>
          <div>
            <p className="whitespace-pre-line text-base leading-7 text-[#5d5049] md:text-lg md:leading-8">{t.manifestoText}</p>
            <p className="mt-6 border-l-2 border-[#7C3C3C] pl-4 text-xl font-light italic leading-snug text-[#5C2B2B] md:text-2xl">
              &ldquo;{t.manifestoQuote}&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7EF] px-5 py-14 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
          <div className="rounded-[1.75rem] bg-[#362E28] p-6 text-[#FBF7EF] md:rounded-[2.5rem] md:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#D4887F] md:text-sm">{copy.forYouKicker}</p>
            <h2 className="break-words font-serif text-2xl leading-tight [overflow-wrap:anywhere] sm:text-3xl md:text-4xl">{t.forYouTitle}</h2>
            <ul className="mt-6 grid gap-4 md:mt-8">
              {t.forYou.map((item) => (
                <li key={item} className="flex gap-3">
                  <Icon name="check" className="mt-1 shrink-0 text-[#D4887F]" size={20} />
                  <span className="text-base leading-7 text-[#E7D8C8]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-[#DCCDB8] bg-[#F4EBDD] p-6 md:rounded-[2.5rem] md:p-10">
            <h3 className="break-words font-serif text-2xl leading-tight [overflow-wrap:anywhere] sm:text-3xl">{t.notForTitle}</h3>
            <p className="mt-4 text-base leading-7 text-[#5d5049]">{t.notForText}</p>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
