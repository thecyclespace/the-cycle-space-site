import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, OrbitalGraphic, Reveal } from "./ui";

// Same four symbols as the brand icon set (magnifier, leaf, interlocking circles, sun).
const PHASE_ICONS = { "01": "magnifier", "02": "leaf", "03": "venn", "04": "sun" };
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";

// One phase of the detailed method. On phones the explanation is folded behind a button (the text
// stays in the page); from tablet width it is always shown in three columns.
function PhaseRow({ phase, idx, moreLabel }) {
  const [open, setOpen] = useState(false);
  const id = `phase-${phase.num}`;
  return (
    <Reveal
      as="article"
      delay={idx * 0.04}
      className="grid gap-4 border-t border-[#FBF7EF]/15 py-6 md:grid-cols-[0.8fr_1.1fr_1fr] md:gap-10 md:py-10"
    >
      <div>
        <p className="font-serif text-4xl text-[#D4887F] md:text-6xl">{phase.num}</p>
        <h3 className="mt-2 font-serif text-3xl md:mt-3 md:text-4xl">{phase.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#DCCDB8] md:text-sm">{phase.tag}</p>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#FBF7EF] md:hidden"
        >
          {moreLabel}
          <span aria-hidden="true" className={`text-xl leading-none transition ${open ? "rotate-45" : ""}`}>+</span>
        </button>
      </div>
      <div id={id} className={`${open ? "contents" : "hidden"} md:contents`}>
        <div>
          <p className="text-base leading-7 text-[#E7D8C8] md:text-lg md:leading-8">{phase.body}</p>
          <p className="mt-5 text-base leading-7 text-[#DCCDB8]">{phase.outcome}</p>
        </div>
        <div>
          <ul className="grid gap-3">
            {phase.points.map((point) => (
              <li key={point} className="flex gap-3 text-base leading-6 text-[#FBF7EF]">
                <Icon name="arrow" size={16} className="mt-1 shrink-0 text-[#D4887F]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-l-2 border-[#D4887F] pl-4 text-base font-light italic leading-7 text-[#E7D8C8]">
            &ldquo;{phase.quote}&rdquo;
          </p>
        </div>
      </div>
    </Reveal>
  );
}

// The Inner Rhythm Method — 4 phases (Decode, Regulate, Reconnect, Embody).
// `detailed` (Services page) adds the key points, outcome and quote of each phase
// plus the "Your Inner Rhythm" 6-month programme header; the compact version
// (Home) shows a short card per phase and links to the Services page.
export default function Method({ detailed = false }) {
  const { t, path } = useI18n();
  const { openBooking } = useBooking();
  const m = t.method;
  if (!m) return null;

  return (
    <section
      id={detailed ? "inner-rhythm" : undefined}
      className="relative scroll-mt-20 overflow-hidden bg-[#362E28] px-5 py-14 text-[#FBF7EF] md:px-8 md:py-28"
    >
      <OrbitalGraphic dense />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1fr_0.85fr] md:items-end md:gap-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#D4887F] md:text-sm">
              {detailed ? m.programmeKicker : m.kicker}
            </p>
            <h2 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {detailed ? m.programmeTitle : m.homeTitle || m.title}
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
              <PhaseRow key={phase.num} phase={phase} idx={idx} moreLabel={t.servicesLabels?.more} />
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
            <Reveal as="ol" className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-5 lg:grid-cols-4">
              {m.phases.map((phase) => (
                <li
                  key={phase.num}
                  className="flex gap-4 rounded-[1.5rem] border border-[#FBF7EF]/15 bg-[#43372F]/60 p-4 md:rounded-[2rem] md:p-6 lg:block"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF7EF]/10 text-[#D4887F] md:h-12 md:w-12">
                    <Icon name={PHASE_ICONS[phase.num] || "sun"} size={22} />
                  </span>
                  <div className="lg:mt-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#D4887F]">
                      {phase.num} · {phase.title}
                    </p>
                    <h3 className="mt-1 font-serif text-xl leading-tight md:text-2xl">{phase.homeTitle || phase.tag}</h3>
                    {phase.short && <p className="mt-2 text-base leading-6 text-[#E7D8C8]">{phase.short}</p>}
                  </div>
                </li>
              ))}
            </Reveal>
            <div className="mt-8 md:mt-12">
              <Link
                to={path("/services#inner-rhythm")}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#FBF7EF] underline-offset-4 hover:text-[#D4887F] hover:underline"
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
