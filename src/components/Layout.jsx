import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BookingModal from "./BookingModal";
import { I18nProvider } from "../lib/i18n";
import { BookingProvider } from "../lib/booking";

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <I18nProvider>
      <BookingProvider>
        <main className="min-h-screen bg-[#FBF7EF] text-[#241915]">
          <BookingModal />
          <Header />
          <Outlet />
          <Footer />
        </main>
      </BookingProvider>
    </I18nProvider>
  );
}
