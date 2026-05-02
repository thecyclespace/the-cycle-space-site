import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon, Button, LogoMark } from "./ui";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";

const NAV_ROUTES = ["/", "/services", "/blog", "/about"];

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { openBooking } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition ${isActive ? "text-[#9E4F49]" : "text-[#5d5049] hover:text-[#9E4F49]"}`;

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#DCCDB8]/60 bg-[#FBF7EF]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Go to homepage">
          <LogoMark size={40} color="#9E4F49" textColor="#241915" showWordmark={false} />
          <span className="font-serif text-xl tracking-tight">The Cycle Space</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary">
          {t.nav.map((item, idx) => (
            <NavLink
              key={NAV_ROUTES[idx]}
              to={NAV_ROUTES[idx]}
              end={NAV_ROUTES[idx] === "/"}
              className={navLinkClass}
            >
              {item}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="inline-flex items-center gap-2 rounded-full border border-[#DCCDB8] px-4 py-2 text-sm text-[#5d5049] hover:bg-[#F4EBDD]"
            aria-label={lang === "en" ? "Switch to French" : "Switch to English"}
          >
            <Icon name="globe" size={16} /> {lang === "en" ? "FR" : "EN"}
          </button>
          <Button onClick={openBooking}>{t.book}</Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <Icon name="x" /> : <Icon name="menu" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#DCCDB8] bg-[#FBF7EF] px-5 py-5 md:hidden">
          <div className="grid gap-4">
            {t.nav.map((item, idx) => (
              <NavLink
                key={NAV_ROUTES[idx]}
                to={NAV_ROUTES[idx]}
                end={NAV_ROUTES[idx] === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left text-lg ${isActive ? "text-[#9E4F49]" : "text-[#352A25]"}`
                }
              >
                {item}
              </NavLink>
            ))}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setMenuOpen(false); openBooking(); }} className="flex-1">
                {t.book}
              </Button>
              <Button
                onClick={() => setLang(lang === "en" ? "fr" : "en")}
                variant="outline"
                className="border-[#DCCDB8] text-[#241915] hover:bg-[#F4EBDD]"
              >
                {lang === "en" ? "FR" : "EN"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
