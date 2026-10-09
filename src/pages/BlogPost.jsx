import { Link, Navigate, useParams } from "react-router-dom";
import { Icon } from "../components/ui";
import FinalCTA from "../components/FinalCTA";
import PeriodCalculator from "../components/tools/PeriodCalculator";
import CyclePhaseTool from "../components/tools/CyclePhaseTool";
import CycleRegularityTool from "../components/tools/CycleRegularityTool";
import PostContraceptionTimeline from "../components/tools/PostContraceptionTimeline";
import BasalTemperatureTracker from "../components/tools/BasalTemperatureTracker";
import { useI18n, I18nScope } from "../lib/i18n";
import { usePageMeta, useJsonLd, SITE_URL } from "../lib/seo";
import { getPost, formatDate } from "../lib/blog";

// Registre des widgets interactifs disponibles dans un article.
// L'article les déclenche via `tool: <key>` en frontmatter et un marqueur
// `<!-- calculator -->` placé dans le corps Markdown à l'endroit voulu.
const TOOLS = {
  "period-calculator": PeriodCalculator,
  "cycle-phase": CyclePhaseTool,
  "cycle-regularity": CycleRegularityTool,
  "post-contraception": PostContraceptionTimeline,
  "basal-tracker": BasalTemperatureTracker,
};
const TOOL_MARKER = "<!-- calculator -->";

export default function BlogPost() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const post = getPost(slug);

  usePageMeta(
    "blog",
    post
      ? {
          title: `${post.title} — The Cycle Space`,
          description: post.excerpt,
          image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
        }
      : undefined
  );
  useJsonLd(
    post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt || undefined,
          image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
          datePublished: post.date ? post.date.toISOString() : undefined,
          author: { "@type": "Person", name: "Elsa" },
          publisher: {
            "@type": "Organization",
            name: "The Cycle Space",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/favicon-512.png` },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          inLanguage: post.lang === "fr" ? "fr-FR" : "en",
        }
      : null
  );

  if (!post) return <Navigate to="/blog" replace />;

  const ToolComponent = post.tool ? TOOLS[post.tool] : null;
  const splitIndex = ToolComponent ? post.bodyHtml.indexOf(TOOL_MARKER) : -1;
  const bodyBefore = splitIndex >= 0 ? post.bodyHtml.slice(0, splitIndex) : post.bodyHtml;
  const bodyAfter = splitIndex >= 0 ? post.bodyHtml.slice(splitIndex + TOOL_MARKER.length) : "";

  const proseCls =
    "prose prose-lg mx-auto max-w-3xl prose-headings:font-serif prose-headings:text-[#362E28] prose-p:text-[#43372F] prose-a:text-[#7C3C3C] hover:prose-a:text-[#5C2B2B] prose-strong:text-[#362E28] prose-blockquote:border-[#7C3C3C] prose-blockquote:text-[#5C2B2B]";

  return (
    <>
      <section className="bg-[#FBF7EF] px-5 pb-10 pt-28 md:px-8 md:pb-12 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5C2B2B] hover:text-[#7C3C3C]"
          >
            <Icon name="arrowLeft" size={16} /> {lang === "fr" ? "Tous les articles" : "All articles"}
          </Link>
          {post.date && !post.tool && (
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#7C3C3C] md:mt-10">
              {formatDate(post.date, lang)}
            </p>
          )}
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-5 text-base leading-7 text-[#5d5049] md:mt-6 md:text-xl md:leading-8">{post.excerpt}</p>
          )}
        </div>
      </section>

      {post.coverImage && (
        <section className="px-5 md:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem]">
            <img src={post.coverImage} alt="" className="w-full" />
          </div>
        </section>
      )}

      <article className="px-5 py-12 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className={proseCls} dangerouslySetInnerHTML={{ __html: bodyBefore }} />
          {ToolComponent && (
            <I18nScope lang={post.lang}>
              <ToolComponent />
            </I18nScope>
          )}
          {bodyAfter && (
            <div className={proseCls} dangerouslySetInnerHTML={{ __html: bodyAfter }} />
          )}
        </div>
      </article>

      <FinalCTA />
    </>
  );
}
