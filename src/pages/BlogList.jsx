import { Link } from "react-router-dom";
import { Icon, OrbitalGraphic } from "../components/ui";
import GuideForm from "../components/GuideForm";
import FinalCTA from "../components/FinalCTA";
import { useI18n } from "../lib/i18n";
import { usePageMeta } from "../lib/seo";
import { posts, formatDate } from "../lib/blog";

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
      guideTagline: "Cycle tracking guide · EN + FR",
      empty: "No articles yet.",
    },
    fr: {
      kicker: "Ressources",
      title: "Idées, outils, articles.",
      intro: "Notes, ressources gratuites et outils interactifs autour du cycle, des hormones et du corps. Mises à jour régulièrement.",
      free: { title: "Ressources gratuites", subtitle: "Guides téléchargeables pour commencer." },
      tools: { title: "Outils", subtitle: "Calculateurs et aides interactives, tout dans ton navigateur." },
      articles: { title: "Articles", subtitle: "Notes et essais autour du cycle." },
      pdf: "Guide PDF",
      guideTagline: "Guide de suivi du cycle · EN + FR",
      empty: "Aucun article pour le moment.",
    },
  };
  const L = labels[lang] || labels.en;

  return (
    <>
      <section className="bg-[#FBF7EF] px-5 pb-12 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#9E4F49]">{L.kicker}</p>
          <h1 className="max-w-4xl font-serif text-5xl leading-tight md:text-7xl">{L.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5d5049]">{L.intro}</p>
        </div>
      </section>

      <section className="px-5 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader number="01" title={L.free.title} subtitle={L.free.subtitle} />
          <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-[2.8rem] bg-[#241915] text-[#FBF7EF] md:grid-cols-[1fr_0.8fr]">
            <div className="p-8 md:p-14">
              <p className="mb-5 text-sm uppercase tracking-[0.2em] text-[#C46B63]">{L.pdf}</p>
              <h3 className="font-serif text-4xl leading-tight md:text-5xl">{t.resourcesTitle}</h3>
              <p className="mt-6 max-w-2xl text-lg leading-7 text-[#E7D8C8]">{t.resourcesText}</p>
              <GuideForm />
            </div>
            <div className="relative hidden min-h-[420px] bg-[#352A25] p-8 md:block md:p-14">
              <OrbitalGraphic dense />
              <div className="relative ml-auto flex h-full max-w-sm flex-col justify-end rounded-[2rem] border border-[#9E4F49]/40 bg-[#FBF7EF] p-8 text-[#241915] shadow-2xl">
                <p className="text-sm uppercase tracking-[0.25em] text-[#9E4F49]">Guide</p>
                <h4 className="mt-6 font-serif text-5xl leading-none">Know Your Flow</h4>
                <p className="mt-6 text-[#5d5049]">{L.guideTagline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="px-5 pt-20 md:px-8 md:pt-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeader number="02" title={L.tools.title} subtitle={L.tools.subtitle} />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {tools.map((post) => (
                <PostCard key={post.slug} post={post} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            number={tools.length > 0 ? "03" : "02"}
            title={L.articles.title}
            subtitle={L.articles.subtitle}
          />
          {articles.length === 0 ? (
            <div className="mt-8 rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] p-12 text-center text-[#5d5049]">
              {L.empty}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
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
      <span className="font-serif text-3xl italic text-[#9E4F49] md:text-4xl">{number}</span>
      <div>
        <h2 className="font-serif text-3xl leading-tight text-[#241915] md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#5d5049] md:text-base">{subtitle}</p>}
      </div>
    </div>
  );
}

function PostCard({ post, lang }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
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
          <span className="inline-flex items-center rounded-full bg-[#9E4F49]/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F3432]">
            {lang === "fr" ? "Outil" : "Tool"}
          </span>
        ) : (
          post.date && (
            <p className="text-xs uppercase tracking-[0.18em] text-[#9E4F49]">
              {formatDate(post.date, lang)}
            </p>
          )
        )}
      </div>
      <h3 className="mt-3 font-serif text-2xl leading-tight transition group-hover:text-[#6F3432]">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-3 flex-1 text-sm leading-6 text-[#5d5049]">{post.excerpt}</p>
      )}
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#6F3432] group-hover:text-[#9E4F49]">
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
