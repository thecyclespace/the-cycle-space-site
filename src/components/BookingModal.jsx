import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#362E28]/75 p-3 backdrop-blur-sm md:p-6"
      onClick={closeBooking}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-[#FBF7EF] shadow-2xl md:h-[88vh]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#DCCDB8] px-6 py-5 md:px-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#7C3C3C]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#5C2B2B]">
              <Icon name="calendar" size={13} /> Calendly
            </div>
            <h3 id="booking-title" className="font-serif text-2xl leading-tight text-[#362E28] md:text-3xl">
              {t.modalTitle}
            </h3>
            <p className="mt-1 text-sm text-[#5d5049] md:text-base">{t.modalText}</p>
          </div>
          <button
            onClick={closeBooking}
            className="shrink-0 rounded-full border border-[#DCCDB8] p-2 text-[#43372F] transition hover:bg-[#F4EBDD]"
            aria-label="Close booking modal"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="relative flex-1 bg-[#FBF7EF]">
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
      </motion.div>
    </div>
  );
}
