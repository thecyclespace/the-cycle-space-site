import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  };
  return icons[name] || null;
}

export function LogoMark({ size = 200, color = "#9E4F49", textColor = "#F4EBDD", className = "", showWordmark = true }) {
  const cx = 100;
  const cy = 100;
  const r = 88;
  const dotAngleDeg = -55;
  const a = (dotAngleDeg * Math.PI) / 180;
  const dotX = cx + r * Math.cos(a);
  const dotY = cy + r * Math.sin(a);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="The Cycle Space"
    >
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="172 22 86 18 118 16 88 22"
        />
      </g>
      <circle cx={dotX} cy={dotY} r="5" fill={color} />
      {showWordmark && (
        <g textAnchor="middle" fill={textColor}>
          <text x={cx} y={cy - 22} fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="6" fontWeight="500">
            THE
          </text>
          <text
            x={cx}
            y={cy + 18}
            fontFamily='"EB Garamond", Garamond, serif'
            fontStyle="italic"
            fontSize="58"
            fontWeight="500"
          >
            Cycle
          </text>
          <text x={cx} y={cy + 50} fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="8" fontWeight="500">
            SPACE
          </text>
        </g>
      )}
    </svg>
  );
}

export function Button({ children, className = "", variant = "default", href, to, onClick, type = "button", ariaLabel }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#9E4F49]/50 focus:ring-offset-2 focus:ring-offset-[#FBF7EF] disabled:pointer-events-none disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-[#9E4F49]/55 bg-transparent text-inherit hover:bg-[#FBF7EF]/10 hover:border-[#9E4F49]"
      : "bg-[#241915] text-[#FBF7EF] hover:bg-[#352A25]";
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

export function OrbitalGraphic({ dense = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className={`absolute rounded-full border border-[#9E4F49]/50 ${
          dense ? "right-[-160px] top-[-140px] h-[520px] w-[520px]" : "right-[-220px] top-[-120px] h-[680px] w-[680px]"
        }`}
      />
      <motion.div
        initial={{ opacity: 0, rotate: 18 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        className={`absolute rounded-full border border-[#9E4F49]/25 ${
          dense ? "right-[40px] top-[70px] h-[280px] w-[280px]" : "right-[80px] top-[110px] h-[360px] w-[360px]"
        }`}
      />
      <div className="absolute right-[13%] top-[18%] h-5 w-5 rounded-full bg-[#9E4F49] shadow-[0_0_0_10px_rgba(158,79,73,0.08)]" />
    </div>
  );
}
