import { Button } from "../components/ui";
import { useI18n } from "../lib/i18n";
import { usePageMeta } from "../lib/seo";

const STRINGS = {
  en: {
    kicker: "404",
    title: "This page doesn't exist.",
    text: "The link you followed didn't lead anywhere. Head back home or explore the rest of the site.",
    home: "Home",
    resources: "Resources",
  },
  fr: {
    kicker: "404",
    title: "Cette page n'existe pas.",
    text: "Le lien que tu as suivi ne mène nulle part. Reviens à l'accueil ou découvre le reste du site.",
    home: "Accueil",
    resources: "Ressources",
  },
};

export default function NotFound() {
  const { lang, path } = useI18n();
  usePageMeta("notFound", { alternates: [] });
  const t = STRINGS[lang] || STRINGS.en;

  return (
    <section className="px-5 pb-32 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#7C3C3C]">{t.kicker}</p>
        <h1 className="break-words font-serif text-4xl leading-tight sm:text-5xl md:text-7xl">{t.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#5d5049]">{t.text}</p>
        <div className="mt-10 flex gap-3">
          <Button to={path("/")}>{t.home}</Button>
          <Button to={path("/blog")} variant="outline">{t.resources}</Button>
        </div>
      </div>
    </section>
  );
}
