import { Icon, Button } from "./ui";
import Picture from "./Picture";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import images from "../content/settings/images.json";

// Closing call to action: soft landscape (decorative) behind a dark veil so the text stays readable.
export default function FinalCTA({ showSecondary = true }) {
  const { t, path } = useI18n();
  const { openBooking } = useBooking();
  return (
    <section className="relative isolate overflow-hidden bg-[#362E28] px-5 py-16 text-[#FBF7EF] md:px-8 md:py-28">
      {images.bannerImage && (
        <>
          <Picture
            src={images.bannerImage}
            alt=""
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[#362E28]/80" aria-hidden="true" />
        </>
      )}
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{t.finalTitle}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#E7D8C8] md:mt-7 md:text-lg md:leading-8">{t.finalText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:mt-10 md:gap-4">
          <Button onClick={() => openBooking("intro")} className="min-h-[52px] bg-[#7C3C3C] px-7 text-[#FBF7EF] hover:bg-[#5C2B2B]">
            {t.book} <Icon name="calendar" size={18} />
          </Button>
          {showSecondary && (
            <Button to={path("/blog")} variant="outline" className="min-h-[52px] px-7 text-[#FBF7EF]">
              {t.download}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
