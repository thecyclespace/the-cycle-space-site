import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, Button, LogoMark } from "./ui";
import { useI18n } from "../lib/i18n";
import { useBooking } from "../lib/booking";
import { getPost } from "../lib/blog";

// Default nav structure used as a safety net if the CMS content is malformed
// or missing entries — guarantees the header always renders 4 working links.
const DEFAULT_NAV = [
  { route: "/", labels: { en: "Home", fr: "Accueil" } },
  { route: "/services", labels: { en: "Services", fr: "Services" } },
  { route: "/blog", labels: { en: "Resources", fr: "Ressources" } },
  { route: "/about", labels: { en: "About", fr: "À propos" } },
];

// Accepts both shapes:
//   - legacy: ["Home", "Services", "Resources", "About"] (positional)
//   - new:    [{ label: "Home", route: "/" }, ...]      (explicit route)
// Always returns [{ label, route }] in a stable, route-anchored order so
// reordering labels in the CMS can never mismap to wrong routes.
function resolveNav(navInput, lang) {
  if (Array.isArray(navInput) && navInput.length > 0) {
    if (typeof navInput[0] === "object" && navInput[0] !== null) {
      const byRoute = new Map(
        navInput
          .filter((n) => n && typeof n.route === "string")
          .map((n) => [n.route, n.label])
      );
      return DEFAULT_NAV.map((d) => ({
        route: d.route,
        label: byRoute.get(d.route) || d.labels[lang] || d.labels.en,
      }));
    }
    if (typeof navInput[0] === "string") {
      return DEFAULT_NAV.map((d, i) => ({
        route: d.route,
        label: navInput[i] || d.labels[lang] || d.labels.en,
      }));
    }
  }
  return DEFAULT_NAV.map((d) => ({
    route: d.route,
    label: d.labels[lang] || d.labels.en,
  }));
}

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { openBooking } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = resolveNav(t.nav, lang);

  const handleToggleLang = () => {
    const nextLang = lang === "en" ? "fr" : "en";
    const blogMatch = location.pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (blogMatch) {
      const current = getPost(blogMatch[1]);
      if (current?.translation) {
        const target = getPost(current.translation);
        if (target && target.lang === nextLang) {
          setLang(nextLang);
          navigate(`/blog/${target.slug}`);
          return;
        }
      }
      if (current && current.lang !== nextLang) {
        setLang(nextLang);
        navigate("/blog");
        return;
      }
    }
    setLang(nextLang);
  };

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
          {navItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              end={item.route === "/"}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={handleToggleLang}
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
            {navItems.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                end={item.route === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left text-lg ${isActive ? "text-[#9E4F49]" : "text-[#352A25]"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { setMenuOpen(false); openBooking(); }} className="flex-1">
                {t.book}
              </Button>
              <Button
                onClick={handleToggleLang}
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
