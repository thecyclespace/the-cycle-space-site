import manifest from "../content/images.manifest.json";

const BASE = import.meta.env.BASE_URL; // "/the-cycle-space-site/" or "/"
// A photo of the site set: "/images/site/<name>.webp". Its lighter versions are in the "variantes" sub-folder.
const OPTIMISED = /^\/images\/site\/([^/]+?)(?:-\d+)?\.(?:webp|avif)$/;

const withBase = (p) => (/^https?:\/\//.test(p) ? p : `${BASE}${p.replace(/^\//, "")}`);

// Everything the page needs to describe one image: responsive AVIF/WebP sources when the
// file comes from the optimised set (public/images/site), or the file itself when Elsa
// uploaded her own through the admin (then the box keeps its shape through `aspect` + object-cover).
export function describeImage(src) {
  const m = src && src.match(OPTIMISED);
  const entry = m && manifest[m[1]];
  if (!entry) return { src: src ? withBase(src) : null };
  const set = (ext) => entry.widths.map((w) => `${withBase(`/images/site/variantes/${m[1]}-${w}.${ext}`)} ${w}w`).join(", ");
  const widest = entry.widths[entry.widths.length - 1];
  return {
    src: withBase(`/images/site/variantes/${m[1]}-${widest}.webp`),
    avif: set("avif"),
    webp: set("webp"),
    width: entry.width,
    height: entry.height,
  };
}

// <picture> with AVIF -> WebP -> fallback. `priority` = the main image of the first screen
// (no lazy loading, high fetch priority). `alt=""` marks a purely decorative image.
export default function Picture({ src, alt = "", sizes = "100vw", priority = false, className = "", style }) {
  const d = describeImage(src);
  if (!d.src) return null;
  const img = (
    <img
      src={d.src}
      alt={alt}
      width={d.width}
      height={d.height}
      sizes={d.webp ? sizes : undefined}
      srcSet={d.webp}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
  if (!d.avif) return img;
  return (
    <picture>
      <source type="image/avif" srcSet={d.avif} sizes={sizes} />
      <source type="image/webp" srcSet={d.webp} sizes={sizes} />
      {img}
    </picture>
  );
}
