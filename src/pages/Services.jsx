import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon, Card } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { usePageMeta } from "../lib/seo";

export default function Services() {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  usePageMeta("services");

  return (
    <>
      <section className="bg-[#F4EBDD] px-5 pb-12 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-[1fr_0.85fr] md:items-end">
            <h1 className="font-serif text-5xl leading-tight md:text-7xl">{t.pillarsTitle}</h1>
            <p className="text-lg leading-8 text-[#5d5049]">{t.pillarsSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F4EBDD] px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className={`grid gap-5 ${t.services.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
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
                        onClick={openBooking}
                        className="mt-8 inline-flex items-center gap-2 text-left text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
                      >
                        {service.cta} <Icon name="arrow" size={16} />
                      </button>
                    ) : (
                      <Link
                        to="/blog"
                        className="mt-8 inline-flex items-center gap-2 text-left text-sm font-medium text-[#6F3432] hover:text-[#9E4F49]"
                      >
                        {service.cta} <Icon name="arrow" size={16} />
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-serif text-5xl leading-tight md:text-7xl">{t.journeyTitle}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {t.journey.map(({ num, title, body }) => (
              <div key={num} className="rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-7">
                <p className="font-serif text-5xl text-[#9E4F49]">{num}</p>
                <h3 className="mt-8 text-xl font-medium">{title}</h3>
                <p className="mt-4 leading-7 text-[#5d5049]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
