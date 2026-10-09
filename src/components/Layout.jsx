import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BookingModal from "./BookingModal";
import { I18nProvider } from "../lib/i18n";
import { BookingProvider } from "../lib/booking";

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "instant" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <I18nProvider>
      <BookingProvider>
        <main className="min-h-screen bg-[#FBF7EF] text-[#362E28]">
          <BookingModal />
          <Header />
          <Suspense fallback={<div className="min-h-[70vh]" aria-hidden="true" />}>
            <Outlet />
          </Suspense>
          <Footer />
        </main>
      </BookingProvider>
    </I18nProvider>
  );
}
