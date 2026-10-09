// JSON-LD builders shared by the pages (client) and the prerender script (build),
// so structured data in the initial HTML and after hydration is identical.
import { SITE_URL, canonicalUrl, absoluteAsset } from "./seo";
import siteSettings from "../content/settings/site.json";

const ORG = {
  "@type": "Organization",
  name: "The Cycle Space",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/favicon-512.png` },
};

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Elsa",
    jobTitle: "Women's health practitioner, osteopath, cycle educator",
    description:
      "Elsa is a women's health practitioner and osteopath, trained in London, fascinated by the intelligence of the female body.",
    image: `${SITE_URL}/${siteSettings.elsaImage}`,
    url: canonicalUrl("/about"),
    sameAs: [siteSettings.instagramUrl],
    knowsAbout: ["Women's health", "Menstrual cycle", "Hormonal health", "Osteopathy", "Body literacy", "Cycle education"],
    alumniOf: { "@type": "EducationalOrganization", name: "University College of Osteopathy" },
    worksFor: ORG,
  };
}

export function articleSchema(post) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  const date = post.date ? post.date.toISOString() : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || undefined,
        image: absoluteAsset(post.coverImage),
        datePublished: date,
        author: { "@type": "Person", name: "Elsa" },
        publisher: ORG,
        mainEntityOfPage: url,
        inLanguage: post.lang === "fr" ? "fr-FR" : "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "The Cycle Space", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

// FAQPage: only built from the questions that are visibly displayed on the page.
export function faqSchema(faq) {
  if (!faq?.items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
