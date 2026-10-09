import { createContext, useContext, useState } from "react";
import siteSettings from "../content/settings/site.json";

const BookingContext = createContext(null);

// Calendly link per offer ("intro" | "checkin"). Falls back to the default
// booking URL while Elsa has not created a dedicated Calendly event type.
function resolveUrl(kind) {
  if (kind === "intro") return siteSettings.bookingUrlIntroduction || siteSettings.bookingUrl;
  if (kind === "checkin") return siteSettings.bookingUrlCheckIn || siteSettings.bookingUrl;
  return siteSettings.bookingUrlIntroduction || siteSettings.bookingUrl;
}

export function BookingProvider({ children }) {
  const [kind, setKind] = useState(null);
  const [open, setOpen] = useState(false);
  const value = {
    open,
    url: resolveUrl(kind),
    // Safe to use directly as an onClick handler (the click event is ignored).
    openBooking: (nextKind) => {
      setKind(typeof nextKind === "string" ? nextKind : null);
      setOpen(true);
    },
    closeBooking: () => setOpen(false),
  };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
