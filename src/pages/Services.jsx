import { motion } from "framer-motion";
import { Icon, Card } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import Method from "../components/Method";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta, useJsonLd } from "../lib/seo";
import { faqSchema } from "../lib/schemas";
import siteSettings from "../content/settings/site.json";

const CTA_CLASS =
  "mt-6 inline-flex min-h-[44px] items-center gap-2 text-left text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]";

export default function Services() {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta("services");
  useJsonLd(faqSchema(t.faq));
  const labels = t.servicesLabels || {};

  // "waitlist" offers (group programme) open an email; the others open Calendly.
  const renderCta = (service) => {
    if (service.action === "waitlist") {
      const subject = encodeURIComponent(service.title);
      return (
        <a href={`mailto:${siteSettings.contactEmail}?subject=${subject}`} className={CTA_CLASS}>
          {service.cta} <Icon name="arrow" size={16} />
        </a>
      );
    }
    return (
      <button onClick={() => openBooking(service.action)} className={CTA_CLASS}>
        {service.cta} <Icon name="arrow" size={16} />
      </button>
    );
  };

  return (
    <>
      <section className="bg-[#F4EBDD] px-5 pb-10 pt-28 md:px-8 md:pb-12 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-[1fr_0.85fr] md:items-end md:gap-6">
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">{t.pillarsTitle}</h1>
            <p className="text-base leading-7 text-[#5d5049] md:text-lg md:leading-8">{t.pillarsSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F4EBDD] px-5 pb-16 md:px-8 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-4 md:gap-5">
          {t.services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(idx, 2) * 0.05 }}
            >
              <Card className="shadow-none transition hover:shadow-xl">
                <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-[0.8fr_1.2fr] md:gap-12 md:p-10">
                  <div className="flex min-w-0 flex-col">
                    <span className="mb-6 h-5 w-5 rounded-full bg-[#7C3C3C]" />
                    <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#7C3C3C] md:text-sm">{service.tag}</p>
                    <h2 className="break-words font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">{service.title}</h2>
                    {service.priceLabel && (
                      <p className="mt-3 text-lg font-medium text-[#362E28]">{service.priceLabel}</p>
                    )}
                    <div className="mt-auto">{renderCta(service)}</div>
                  </div>
                  <div className="min-w-0 text-base leading-7 text-[#5d5049] md:leading-8">
                    <p className="whitespace-pre-line">{service.body}</p>
                    {service.forWho && (
                      <div className="mt-6 border-t border-[#DCCDB8] pt-5">
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
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Method detailed />

      <section className="bg-[#F4EBDD] px-5 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">{t.journeyTitle}</h2>
          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
            {t.journey.map(({ num, title, body }) => (
              <div key={num} className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-6 md:p-7">
                <p className="font-serif text-4xl text-[#7C3C3C] md:text-5xl">{num}</p>
                <h3 className="mt-6 text-lg font-medium md:mt-8 md:text-xl">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#5d5049] md:mt-4">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {t.faq?.items?.length > 0 && (
        <section className="bg-[#FBF7EF] px-5 py-16 md:px-8 md:py-24">
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
