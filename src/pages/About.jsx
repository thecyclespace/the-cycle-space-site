import { Button } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta, useJsonLd, SITE_URL } from "../lib/seo";
import siteSettings from "../content/settings/site.json";

export default function About() {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta("about");
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Elsa",
    jobTitle: "Women's health practitioner, osteopath, cycle educator",
    description:
      "Elsa is a women's health practitioner and osteopath, trained in London, fascinated by the intelligence of the female body.",
    image: `${SITE_URL}/${siteSettings.elsaImage}`,
    url: `${SITE_URL}/about`,
    sameAs: [siteSettings.instagramUrl],
    knowsAbout: [
      "Women's health",
      "Menstrual cycle",
      "Hormonal health",
      "Osteopathy",
      "Body literacy",
      "Cycle education",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University College of Osteopathy",
    },
  });

  return (
    <>
      <section className="bg-[#F4EBDD] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#DCCDB8] p-3">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
              <img
                src={`${import.meta.env.BASE_URL}${siteSettings.elsaImage}`}
                alt="Elsa, osteopath and women's health practitioner"
                loading="eager"
                fetchpriority="high"
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
            <h1 className="font-serif text-5xl leading-tight md:text-7xl">{t.aboutTitle}</h1>
            <p className="mt-7 whitespace-pre-line text-xl leading-9 text-[#5d5049]">{t.aboutText}</p>
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
            <Button onClick={openBooking} className="mt-10 px-7 py-4">
              {t.book}
            </Button>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
