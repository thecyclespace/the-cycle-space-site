import { useEffect, useState } from "react";
import { Icon } from "./ui";
import { useBooking } from "../lib/booking";
import { useI18n } from "../lib/i18n";

// Discreet booking shortcut on phones, shown only once the first screen has scrolled away.
// It steps aside when the booking window is open or while a form field has focus
// (so it never covers a field or the on-screen keyboard).
export default function StickyBook() {
  const { t } = useI18n();
  const { open, openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520);
    const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    const onIn = (e) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const visible = scrolled && !open && !typing;
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => openBooking("intro")}
        className="pointer-events-auto mx-auto flex min-h-[48px] w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#7C3C3C] px-6 text-sm font-medium text-[#FBF7EF] shadow-lg shadow-[#362E28]/25 hover:bg-[#5C2B2B]"
      >
        {t.book} <Icon name="calendar" size={16} />
      </button>
    </div>
  );
}
