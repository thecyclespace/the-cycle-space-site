import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon, Button, OrbitalGraphic } from "./ui";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";

// The Inner Rhythm Method — 4 phases (Decode, Regulate, Reconnect, Embody).
// `detailed` (Services page) adds the key points, outcome and quote of each phase
// plus the "Your Inner Rhythm" 6-month programme header; the compact version
// (Home) shows a short card per phase and links to the Services page.
export default function Method({ detailed = false }) {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  const m = t.method;
  if (!m) return null;

  return (
    <section
      id={detailed ? "inner-rhythm" : undefined}
      className="relative scroll-mt-20 overflow-hidden bg-[#362E28] px-5 py-16 text-[#FBF7EF] md:px-8 md:py-32"
    >
      <OrbitalGraphic dense />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1fr_0.85fr] md:items-end md:gap-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#D4887F] md:text-sm">
              {detailed ? m.programmeKicker : m.kicker}
            </p>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              {detailed ? m.programmeTitle : m.title}
            </h2>
            {detailed && (
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#DCCDB8] md:text-base">{m.programmeMeta}</p>
            )}
          </div>
          <div>
            {detailed && <p className="mb-3 font-serif text-xl text-[#FBF7EF] md:text-2xl">{m.title}</p>}
            <p className="text-base leading-7 text-[#E7D8C8] md:text-lg md:leading-8">{m.intro}</p>
          </div>
        </div>

        {detailed ? (
          <div className="mt-12 md:mt-16">
            {m.phases.map((phase, idx) => (
              <motion.article
                key={phase.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="grid gap-6 border-t border-[#FBF7EF]/15 py-8 md:grid-cols-[0.8fr_1.1fr_1fr] md:gap-10 md:py-10"
              >
                <div>
                  <p className="font-serif text-5xl text-[#D4887F] md:text-6xl">{phase.num}</p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl">{phase.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#DCCDB8] md:text-sm">{phase.tag}</p>
                </div>
                <div>
                  <p className="text-base leading-7 text-[#E7D8C8] md:text-lg md:leading-8">{phase.body}</p>
                  <p className="mt-5 text-sm leading-6 text-[#DCCDB8] md:text-base md:leading-7">{phase.outcome}</p>
                </div>
                <div>
                  <ul className="grid gap-3">
                    {phase.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-6 text-[#FBF7EF] md:text-base">
                        <Icon name="arrow" size={16} className="mt-1 shrink-0 text-[#D4887F]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-l-2 border-[#D4887F] pl-4 text-base font-light italic leading-7 text-[#E7D8C8]">
                    &ldquo;{phase.quote}&rdquo;
                  </p>
                </div>
              </motion.article>
            ))}
            <div className="border-t border-[#FBF7EF]/15 pt-10">
              <Button
                onClick={() => openBooking("intro")}
                className="bg-[#7C3C3C] px-7 py-4 text-[#FBF7EF] hover:bg-[#5C2B2B]"
              >
                {m.programmeCta} <Icon name="calendar" size={18} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-4 md:gap-5">
              {m.phases.map((phase, idx) => (
                <motion.div
                  key={phase.num}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="rounded-[2rem] border border-[#FBF7EF]/15 bg-[#43372F]/60 p-6 md:p-7"
                >
                  <p className="font-serif text-4xl text-[#D4887F] md:text-5xl">{phase.num}</p>
                  <h3 className="mt-5 font-serif text-2xl md:text-3xl">{phase.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#DCCDB8]">{phase.tag}</p>
                  <p className="mt-4 text-sm leading-6 text-[#E7D8C8] md:text-base md:leading-7">{phase.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 md:mt-12">
              <Link
                to="/services#inner-rhythm"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#FBF7EF] underline-offset-4 hover:text-[#D4887F] hover:underline"
              >
                {m.cta} <Icon name="arrow" size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
