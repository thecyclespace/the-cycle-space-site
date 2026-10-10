import { Link } from "react-router-dom";
import { Icon, OrbitalGraphic } from "../components/ui";
import GuideForm from "../components/GuideForm";
import guideSettings from "../content/settings/guide.json";
import FinalCTA from "../components/FinalCTA";
import { useI18n } from "../lib/i18n";
import { usePageMeta } from "../lib/seo";
import { posts, formatDate } from "../lib/blog";
import { postPath } from "../lib/paths";

export default function BlogList() {
  const { t, lang } = useI18n();
  usePageMeta("blog");

  const visiblePosts = posts.filter((p) => p.lang === lang);
  const tools = visiblePosts.filter((p) => p.tool);
  const articles = visiblePosts.filter((p) => !p.tool);

  const labels = {
    en: {
      kicker: "Resources",
      title: "Ideas, tools, articles.",
      intro: "Notes, free resources and interactive tools on the cycle, hormones and the body. Updated regularly.",
      free: { title: "Free resources", subtitle: "Downloadable guides to start with." },
      tools: { title: "Tools", subtitle: "Calculators and interactive helpers, all in your browser." },
      articles: { title: "Articles", subtitle: "Notes and essays on the cycle." },
      pdf: "PDF guide",
      guideName: "Know Your Cycle",
      coverAlt: "Cover of the free guide",
      empty: "No articles yet.",
    },
    fr: {
      kicker: "Ressources",
      title: "Outils, articles et ressources",
      intro: "Des articles, des ressources gratuites et des outils interactifs pour mieux comprendre votre cycle, vos hormones et votre corps. Mis à jour régulièrement.",
      free: { title: "Ressources gratuites", subtitle: "Un guide à télécharger pour commencer." },
      tools: { title: "Outils", subtitle: "Des calculateurs et des outils de suivi, directement dans votre navigateur." },
      articles: { title: "Articles", subtitle: "Des textes pour mieux comprendre votre cycle." },
      pdf: "Guide PDF",
      guideName: "Connaître votre cycle",
      coverAlt: "Couverture du guide gratuit",
      empty: "Aucun article pour le moment.",
    },
  };
  const L = labels[lang] || labels.en;
  const cover = (lang === "fr" ? guideSettings.guideCoverFr : guideSettings.guideCoverEn) || guideSettings.guideCoverEn;

  return (
    <>
      <section className="bg-[#FBF7EF] px-5 pb-10 pt-28 md:px-8 md:pb-12 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#7C3C3C] md:mb-5 md:text-sm">{L.kicker}</p>
          <h1 className="max-w-4xl break-words font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-7xl">{L.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d5049] md:mt-6 md:text-lg md:leading-8">{L.intro}</p>
        </div>
      </section>

      <section className="px-5 pt-10 md:px-8 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader number="01" title={L.free.title} subtitle={L.free.subtitle} />
          <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-[2rem] bg-[#362E28] text-[#FBF7EF] md:mt-8 md:grid-cols-[1fr_0.8fr] md:rounded-[2.8rem]">
            <div className="p-6 md:p-14">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#D4887F] md:mb-5 md:text-sm">{L.pdf}</p>
              <h3 className="font-serif text-3xl leading-tight md:text-5xl">{t.resourcesTitle}</h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#E7D8C8] md:mt-6 md:text-lg">{t.resourcesText}</p>
              <GuideForm />
            </div>
            <div className="relative hidden bg-[#43372F] p-8 md:flex md:items-center md:justify-center md:p-12">
              <OrbitalGraphic dense />
              <img
                src={`${import.meta.env.BASE_URL}${cover.replace(/^\//, "")}`}
                alt={`${L.coverAlt} « ${L.guideName} »`}
                width="900"
                height="1274"
                loading="lazy"
                decoding="async"
                className="relative w-full max-w-[300px] rounded-xl border border-[#FBF7EF]/20 shadow-2xl shadow-black/50"
              />
            </div>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="px-5 pt-14 md:px-8 md:pt-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeader number="02" title={L.tools.title} subtitle={L.tools.subtitle} />
            <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
              {tools.map((post) => (
                <PostCard key={post.slug} post={post} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-14 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            number={tools.length > 0 ? "03" : "02"}
            title={L.articles.title}
            subtitle={L.articles.subtitle}
          />
          {articles.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-8 text-center text-sm text-[#5d5049] md:mt-8 md:p-12 md:text-base">
              {L.empty}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
              {articles.map((post) => (
                <PostCard key={post.slug} post={post} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTA showSecondary={false} />
    </>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-baseline gap-5 border-t border-[#DCCDB8] pt-6">
      <span className="font-serif text-3xl text-[#7C3C3C] md:text-4xl">{number}</span>
      <div>
        <h2 className="font-serif text-3xl leading-tight text-[#362E28] md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#5d5049] md:text-base">{subtitle}</p>}
      </div>
    </div>
  );
}

function PostCard({ post, lang }) {
  return (
    <Link
      to={postPath(post)}
      className="group flex flex-col rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-7 transition hover:-translate-y-1 hover:shadow-xl"
    >
      {post.coverImage && (
        <div className="mb-5 overflow-hidden rounded-2xl">
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        {post.tool ? (
          <span className="inline-flex items-center rounded-full bg-[#7C3C3C]/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#5C2B2B]">
            {lang === "fr" ? "Outil" : "Tool"}
          </span>
        ) : (
          post.date && (
            <p className="text-xs uppercase tracking-[0.18em] text-[#7C3C3C]">
              {formatDate(post.date, lang)}
            </p>
          )
        )}
      </div>
      <h3 className="mt-3 font-serif text-2xl leading-tight transition group-hover:text-[#5C2B2B]">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-3 flex-1 text-sm leading-6 text-[#5d5049]">{post.excerpt}</p>
      )}
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#5C2B2B] group-hover:text-[#7C3C3C]">
        {post.tool
          ? lang === "fr"
            ? "Ouvrir l'outil"
            : "Open the tool"
          : lang === "fr"
            ? "Lire"
            : "Read"}
        <Icon name="arrow" size={14} />
      </span>
    </Link>
  );
}
