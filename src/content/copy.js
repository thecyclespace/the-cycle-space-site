// All the texts of the site, per language. They are stored one file per page (what the admin edits)
// and merged here into the single object the components read: `copy.fr.heroTitle`, `copy.en.services`…
// A key lives in exactly one page file (checked by tests/content.test.mjs).
import homeEn from "./pages/home.en.json";
import homeFr from "./pages/home.fr.json";
import servicesEn from "./pages/services.en.json";
import servicesFr from "./pages/services.fr.json";
import aboutEn from "./pages/about.en.json";
import aboutFr from "./pages/about.fr.json";
import resourcesEn from "./pages/resources.en.json";
import resourcesFr from "./pages/resources.fr.json";
import sharedEn from "./pages/shared.en.json";
import sharedFr from "./pages/shared.fr.json";

export const copy = {
  en: { ...sharedEn, ...homeEn, ...servicesEn, ...aboutEn, ...resourcesEn },
  fr: { ...sharedFr, ...homeFr, ...servicesFr, ...aboutFr, ...resourcesFr },
};
