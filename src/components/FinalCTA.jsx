import { Icon, Button, OrbitalGraphic } from "./ui";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";

export default function FinalCTA({ showSecondary = true }) {
  const { t, path } = useI18n();
  const { openBooking } = useBooking();
  return (
    <section className="relative overflow-hidden bg-[#362E28] px-5 py-16 text-[#FBF7EF] md:px-8 md:py-32">
      <OrbitalGraphic />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-7xl">{t.finalTitle}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#E7D8C8] md:mt-7 md:text-xl md:leading-8">{t.finalText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:mt-10 md:gap-4">
          <Button onClick={openBooking} className="bg-[#7C3C3C] px-7 py-4 text-[#FBF7EF] hover:bg-[#5C2B2B]">
            {t.book} <Icon name="calendar" size={18} />
          </Button>
          {showSecondary && (
            <Button to={path("/blog")} variant="outline" className="px-7 py-4 text-[#FBF7EF]">
              {t.download}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
