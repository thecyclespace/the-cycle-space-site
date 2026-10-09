import { useEffect, useRef, useState } from "react";
import { Icon, Button } from "./ui";
import { useBooking } from "../lib/booking";
import { useI18n } from "../lib/i18n";

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendlyAssets() {
  if (typeof window === "undefined") return Promise.resolve();
  if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS;
    document.head.appendChild(link);
  }
  if (window.Calendly) return Promise.resolve();
  const existing = document.querySelector(`script[src="${CALENDLY_JS}"]`);
  if (existing) {
    return new Promise((resolve) => {
      if (window.Calendly) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function BookingModal() {
  const { open, url: bookingUrl, closeBooking } = useBooking();
  const { t, lang } = useI18n();
  const widgetRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeBooking();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeBooking]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    loadCalendlyAssets()
      .then(() => {
        if (cancelled || !widgetRef.current || !window.Calendly) return;
        widgetRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7C3C3C&text_color=362E28&background_color=FBF7EF`,
          parentElement: widgetRef.current,
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => { cancelled = true; };
  }, [open, lang, bookingUrl]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#362E28]/75 p-0 backdrop-blur-sm sm:p-3 md:p-6"
      onClick={closeBooking}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-in relative flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-[#FBF7EF] shadow-2xl sm:h-[92dvh] sm:rounded-[1.5rem] md:h-[88vh] md:rounded-[2rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#DCCDB8] px-4 py-3 sm:px-6 sm:py-5 md:px-8">
          <div>
            <div className="mb-2 hidden items-center gap-2 rounded-full bg-[#7C3C3C]/10 sm:inline-flex px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#5C2B2B]">
              <Icon name="calendar" size={13} /> Calendly
            </div>
            <h3 id="booking-title" className="font-serif text-xl leading-tight text-[#362E28] md:text-3xl">
              {t.modalTitle}
            </h3>
            <p className="mt-1 hidden text-sm text-[#5d5049] sm:block md:text-base">{t.modalText}</p>
          </div>
          <button
            onClick={closeBooking}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DCCDB8] text-[#43372F] transition hover:bg-[#F4EBDD]"
            aria-label={lang === "fr" ? "Fermer la fenêtre de réservation" : "Close booking modal"}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="relative flex-1 overflow-y-auto bg-[#FBF7EF]">
          {status !== "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#FBF7EF]">
              {status === "error" ? (
                <>
                  <p className="text-base text-[#5C2B2B]">{t.calendlyError}</p>
                  <Button href={bookingUrl} className="bg-[#7C3C3C] text-[#FBF7EF] hover:bg-[#5C2B2B]">
                    {t.calendly} <Icon name="arrow" size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#7C3C3C]/30 border-t-[#7C3C3C]" />
                  <p className="text-sm text-[#6e625b]">{t.calendlyLoading}</p>
                </>
              )}
            </div>
          )}
          <div ref={widgetRef} className="h-full w-full" style={{ minHeight: 600 }} />
        </div>
      </div>
    </div>
  );
}
