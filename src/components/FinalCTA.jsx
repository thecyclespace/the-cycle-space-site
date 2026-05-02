import { Icon, Button, OrbitalGraphic } from "./ui";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";

export default function FinalCTA({ showSecondary = true }) {
  const { t } = useI18n();
  const { openBooking } = useBooking();
  return (
    <section className="relative overflow-hidden bg-[#241915] px-5 py-24 text-[#FBF7EF] md:px-8 md:py-32">
      <OrbitalGraphic />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-5xl leading-tight md:text-7xl">{t.finalTitle}</h2>
        <p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-[#E7D8C8]">{t.finalText}</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={openBooking} className="bg-[#9E4F49] px-7 py-4 text-[#FBF7EF] hover:bg-[#6F3432]">
            {t.book} <Icon name="calendar" size={18} />
          </Button>
          {showSecondary && (
            <Button to="/blog" variant="outline" className="px-7 py-4 text-[#FBF7EF]">
              {t.download}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
