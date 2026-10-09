import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function Icon({ name, size = 18, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
  const icons = {
    calendar: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
    arrowLeft: (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </svg>
    ),
    download: (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
    menu: (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
    x: (
      <svg {...common}>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    ),
    globe: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </svg>
    ),
    sparkles: (
      <svg {...common}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      </svg>
    ),
    drop: (
      <svg {...common}>
        <path d="M12 3c3.5 4.2 6 7 6 10a6 6 0 0 1-12 0c0-3 2.5-5.8 6-10z" />
      </svg>
    ),
    mood: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2M9 9.5h.01M15 9.5h.01" />
      </svg>
    ),
    cycle: (
      <svg {...common}>
        <path d="M20 12a8 8 0 1 1-2.6-5.9" />
        <path d="M20 4v4h-4" />
      </svg>
    ),
    waves: (
      <svg {...common}>
        <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      </svg>
    ),
    capsule: (
      <svg {...common}>
        <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-40 12 12)" />
        <path d="m9.4 8.6 5.5 6.9" />
      </svg>
    ),
    sprout: (
      <svg {...common}>
        <path d="M12 21v-9" />
        <path d="M12 12c0-4 2.5-6 7-6 0 4-2.5 6-7 6z" />
        <path d="M12 15c0-3-2-5-6-5 0 3.5 2 5 6 5z" />
      </svg>
    ),
    magnifier: (
      <svg {...common}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5.5 5.5" />
      </svg>
    ),
    leaf: (
      <svg {...common}>
        <path d="M5 19c0-8 5-14 15-14 0 9-5 15-13 15" />
        <path d="M5 19 14 10" />
      </svg>
    ),
    venn: (
      <svg {...common}>
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </svg>
    ),
    sun: (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// Official brand logos (public/brand). `tone` is the background they sit on:
// "light" background -> dark artwork, "dark" background -> cream artwork.
// `variant`: "main" (stacked, circular) or "wordmark" (secondary, horizontal).
const LOGO_RATIO = { main: 720 / 716, wordmark: 900 / 119 };

export function BrandLogo({ variant = "main", tone = "light", height, className = "" }) {
  const file = `${variant}-${tone === "dark" ? "light" : "dark"}`;
  const style = height ? { height, width: height * LOGO_RATIO[variant] } : undefined;
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/logo-${file}.png`}
      alt="The Cycle Space"
      style={style}
      className={`select-none ${className}`}
      draggable="false"
    />
  );
}

export function Button({ children, className = "", variant = "default", href, to, onClick, type = "button", ariaLabel }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#7C3C3C]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF] disabled:pointer-events-none disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-[#7C3C3C]/55 bg-transparent text-inherit hover:bg-[#FBF7EF]/10 hover:border-[#7C3C3C]"
      : "bg-[#362E28] text-[#FBF7EF] hover:bg-[#43372F]";
  const cls = `${base} ${styles} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[2rem] border border-[#DCCDB8] bg-[#FBF7EF] ${className}`}>{children}</div>
  );
}

// Fade-up on scroll, with no animation library. Content is ALWAYS visible in the HTML
// (prerender, no JavaScript, reduced motion). Only blocks that start below the fold are
// hidden by the browser right after load, then revealed when they scroll into view.
export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.style.transitionDelay = `${delay}s`;
    el.classList.add("reveal-hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.remove("reveal-hidden");
        io.disconnect();
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function OrbitalGraphic({ dense = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`orbit-a absolute rounded-full border border-[#7C3C3C]/50 ${
          dense ? "right-[-160px] top-[-140px] h-[520px] w-[520px]" : "right-[-220px] top-[-120px] h-[680px] w-[680px]"
        }`}
      />
      <div
        className={`orbit-b absolute rounded-full border border-[#7C3C3C]/25 ${
          dense ? "right-[40px] top-[70px] h-[280px] w-[280px]" : "right-[80px] top-[110px] h-[360px] w-[360px]"
        }`}
      />
      <div className="absolute right-[13%] top-[18%] hidden h-5 w-5 rounded-full bg-[#7C3C3C] shadow-[0_0_0_10px_rgba(124,60,60,0.08)] sm:block" />
    </div>
  );
}
