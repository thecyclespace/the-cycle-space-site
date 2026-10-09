import { Icon, Button, Reveal } from "../components/ui";
import Picture from "../components/Picture";
import FinalCTA from "../components/FinalCTA";
import Method from "../components/Method";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta, useJsonLd } from "../lib/seo";
import { faqSchema } from "../lib/schemas";
import siteSettings from "../content/settings/site.json";
import images from "../content/settings/images.json";

export default function Services() {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta("services");
  useJsonLd(faqSchema(t.faq));
  const labels = t.servicesLabels || {};

  // "waitlist" offers (group programme) open an email; the others open Calendly.
  const renderCta = (service, featured) => {
    const cls = `min-h-[48px] w-full px-6 sm:w-auto ${
      featured ? "bg-[#7C3C3C] text-[#FBF7EF] hover:bg-[#5C2B2B]" : ""
    }`;
    if (service.action === "waitlist") {
      const subject = encodeURIComponent(service.title);
      return (
        <a
          href={`mailto:${siteSettings.contactEmail}?subject=${subject}`}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#7C3C3C]/55 px-6 text-sm font-medium text-[#362E28] transition hover:border-[#7C3C3C] hover:bg-[#F4EBDD] sm:w-auto"
        >
          {service.cta} <Icon name="arrow" size={16} />
        </a>
      );
    }
    return (
      <Button onClick={() => openBooking(service.action)} variant={featured ? "default" : "outline"} className={`${cls} ${featured ? "" : "text-[#362E28]"}`}>
        {service.cta} <Icon name="arrow" size={16} />
      </Button>
    );
  };

  return (
    <>
      <section className="bg-[#F4EBDD] px-5 pb-10 pt-24 md:px-8 md:pb-16 md:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div>
            <h1 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{t.pillarsTitle}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#5d5049] md:mt-6 md:text-lg md:leading-8">{t.pillarsSubtitle}</p>
          </div>
          {images.servicesImage && (
            <Picture
              src={images.servicesImage}
              alt=""
              sizes="(min-width: 768px) 40vw, 0px"
              className="hidden aspect-[4/3] w-full rounded-[2.5rem] object-cover md:block"
            />
          )}
        </div>
      </section>

      <section className="bg-[#F4EBDD] px-5 pb-14 md:px-8 md:pb-28">
        <Reveal className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 md:gap-6">
          {t.services.map((service, idx) => {
            const featured = idx === 0;
            const soon = service.action === "waitlist";
            return (
              <article
                key={service.title}
                className={`flex flex-col rounded-[1.75rem] border p-5 md:rounded-[2rem] md:p-8 ${
                  featured ? "border-[#7C3C3C]/50 bg-[#FBF7EF] shadow-lg shadow-[#7C3C3C]/10" : soon ? "border-[#DCCDB8] bg-[#F4EBDD]" : "border-[#DCCDB8] bg-[#FBF7EF]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[#7C3C3C] md:text-sm">{service.tag}</p>
                <h2 className="mt-2 break-words font-serif text-2xl leading-tight sm:text-3xl">{service.title}</h2>
                {service.priceLabel && <p className="mt-2 text-lg font-medium text-[#362E28]">{service.priceLabel}</p>}
                {service.summary && <p className="mt-3 text-base leading-7 text-[#43372F]">{service.summary}</p>}
                {service.audience && (
                  <p className="mt-2 text-sm leading-6 text-[#5d5049]">
                    <span className="font-medium text-[#362E28]">{labels.forWho} : </span>
                    {service.audience}
                  </p>
                )}
                <div className="mt-5">{renderCta(service, featured)}</div>
                {(service.body || service.forWho || service.leave) && (
                  <details className="group mt-5 border-t border-[#DCCDB8] pt-1">
                    <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[#5C2B2B] marker:content-none [&::-webkit-details-marker]:hidden">
                      <span>{labels.more}</span>
                      <span aria-hidden="true" className="text-xl leading-none transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-2 text-base leading-7 text-[#5d5049]">
                      <p className="whitespace-pre-line">{service.body}</p>
                      {service.forWho && (
                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.16em] text-[#7C3C3C]">{labels.forWho}</p>
                          <p className="mt-2">{service.forWho}</p>
                        </div>
                      )}
                      {service.leave && (
                        <div className="mt-5">
                          <p className="text-xs uppercase tracking-[0.16em] text-[#7C3C3C]">{labels.leave}</p>
                          <p className="mt-2">{service.leave}</p>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </article>
            );
          })}
        </Reveal>
      </section>

      <Method detailed />

      <section className="bg-[#F4EBDD] px-5 py-14 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{t.journeyTitle}</h2>
          <div className="mt-8 grid gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
            {t.journey.map(({ num, title, body }) => (
              <div key={num} className="rounded-[1.75rem] border border-[#DCCDB8] bg-[#FBF7EF] p-5 md:rounded-[2rem] md:p-7">
                <p className="font-serif text-4xl text-[#7C3C3C] md:text-5xl">{num}</p>
                <h3 className="mt-4 text-lg font-medium md:mt-8 md:text-xl">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#5d5049] md:mt-4">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {t.faq?.items?.length > 0 && (
        <section className="bg-[#FBF7EF] px-5 py-14 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{t.faq.title}</h2>
            <div className="mt-8 divide-y divide-[#DCCDB8] border-y border-[#DCCDB8] md:mt-10">
              {t.faq.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium text-[#362E28] marker:content-none md:text-lg [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-[#7C3C3C] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 text-base leading-7 text-[#5d5049]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
