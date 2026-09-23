import React, {useEffect, useRef, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAuthStore} from "../store/authStore";
import {Navigation} from "./components/navigation";

// ─── Brand tokens (strict monochromatic) ──────────────────────────────────────
const C = {
  bg: "#F8F8F8",
  bg1: "#F5F5F5",
  bg2: "#F1F1F1",
  bg3: "#ECECEC",
  bg4: "#E8E8E8",
  border: "rgba(43,43,43,0.06)",
  border2: "rgba(43,43,43,0.10)",
  border3: "rgba(43,43,43,0.14)",
  text: "#2B2B2B",
  text2: "#6E6E6E",
  text3: "#858585",
  text4: "#9A9A9A",
  accent: "#2B2B2B",
  accent2: "#454545",
  accentL: "#5C5C5C",
  accentG: "rgba(43,43,43,0.06)",
  accentGS: "rgba(43,43,43,0.12)",
  accentB: "rgba(43,43,43,0.18)",
  green: "#2B2B2B",
  greenG: "rgba(43,43,43,0.06)",
  greenB: "rgba(43,43,43,0.16)",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  arrow: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  zap: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 2L3 10h6L7.5 15 15 7H9L9.5 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 1.5L2 4.5v5.5c0 3.3 2.7 5.9 6.5 6.5 3.8-.6 6.5-3.2 6.5-6.5V4.5L8.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.5l2.5 2.5L12.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  layers: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 11l6.5 3.5L15 11M2 7.5l6.5 3.5L15 7.5M8.5 1.5L2 5l6.5 3.5L15 5 8.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clock: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8.5"
        cy="8.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.5 5v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  users: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="6.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 14.5c0-2.8 2.2-5 5-5s5 2.2 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4.5c1.5.4 2.5 1.7 2.5 3.2M15.5 14.5c0-2-1-3.8-2.5-4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  chart: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 13l3.5-5L9 11l4.5-7L16 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 15.5h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  sparkle: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 1v2.5M7 10.5V13M1 7h2.5M10.5 7H13M2.7 2.7l1.8 1.8M9.5 9.5l1.8 1.8M2.7 11.3l1.8-1.8M9.5 4.5l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  lock: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="6"
        width="9"
        height="7"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M4.5 6V4.5a2.5 2.5 0 015 0V6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  globe: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.5 7h11M7 1.5c1.7 1.8 2.2 3.5 2.2 5.5S8.7 10.7 7 12.5M7 1.5C5.3 3.3 4.8 5 4.8 7s.5 3.7 2.2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  play: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3.5 2l8 5-8 5V2Z" fill="currentColor" />
    </svg>
  ),
  arrowUpRight: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  barChart: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1"
        y="8"
        width="3"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="6"
        y="4"
        width="3"
        height="11"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="11"
        y="1"
        width="3"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  activity: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 8h2.5l2-5 3 10 2-7 1.5 2H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 11l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  trendUp: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 11L6 6.5 8.5 9 13 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4h3v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// Every claim below describes what the product does, not what it has achieved.
// No fabricated traction, user counts, or performance benchmarks.

const highlights = [
  {value: "Zero", label: "Double-booked teachers or rooms"},
  {value: "Minutes", label: "To generate your full timetable"},
  {value: "One", label: "Dashboard for every department"},
  {value: "Free", label: "While we're in early access"},
];

const features = [
  {
    icon: Ic.zap,
    title: "Automated generation",
    desc: "Enter your teachers, rooms, and class groups once. Get a conflict-free timetable in minutes, not weeks.",
    badge: "Constraint engine",
  },
  {
    icon: Ic.shield,
    title: "Zero conflicts",
    desc: "Every teacher, room, and class clash is resolved before you ever see the timetable. No manual cleanup.",
    badge: "Clash-free by design",
  },
  {
    icon: Ic.layers,
    title: "Any size",
    desc: "From small primary schools to large high schools. One platform handles every year level and every department.",
    badge: "Primary and secondary",
  },
  {
    icon: Ic.clock,
    title: "Real-time sync",
    desc: "Push a last-minute change and everyone sees it instantly. No emails, no printouts, no confusion.",
    badge: "Instant updates",
  },
  {
    icon: Ic.users,
    title: "Team collaboration",
    desc: "Admins, heads of department, and teachers all work from the same schedule. No version conflicts.",
    badge: "Role-based access",
  },
  {
    icon: Ic.chart,
    title: "Operational insights",
    desc: "See classroom utilisation, spot bottlenecks, and plan next semester with built-in analytics.",
    badge: "Live dashboards",
  },
];

// Honest early-access section replacing the previous fabricated testimonials.
const earlyAccessPerks = [
  {
    icon: Ic.users,
    title: "Guided onboarding",
    desc: "We help you import your teachers, rooms, subjects, and class groups so your first timetable is ready on day one.",
  },
  {
    icon: Ic.sparkle,
    title: "Direct access",
    desc: "Talk directly to the team building Protiba. Your feedback decides what we build next.",
  },
  {
    icon: Ic.shield,
    title: "Founding school pricing",
    desc: "Get preferential pricing for as long as you stay with Protiba.",
  },
];

// Replaces named "customer" logos with the school types Protiba is built for.
const builtFor = [
  "Secondary schools",
  "Primary schools",
  "Day schools",
  "Boarding schools",
  "Mixed and single-sex",
  "Public and private",
  "Multi-campus groups",
  "TVET and colleges",
];

const analyticsBenefits = [
  {icon: Ic.barChart, text: "See which classrooms sit empty"},
  {icon: Ic.users, text: "Balance teacher workload across departments"},
  {icon: Ic.activity, text: "Find timetable gaps instantly"},
  {icon: Ic.trendUp, text: "Plan with real numbers, not guesswork"},
];

const howItWorksSteps = [
  {
    n: "01",
    title: "Configure your school",
    desc: "Enter teachers, rooms, subjects, and class groups. Set availability windows, preferences, and hard constraints.",
  },
  {
    n: "02",
    title: "Let the engine run",
    desc: "Our engine tests thousands of schedule combinations and picks the one with zero conflicts.",
  },
  {
    n: "03",
    title: "Publish and manage",
    desc: "Review, fine-tune, and publish with one click. Push updates in real time and everyone sees the changes instantly.",
  },
];

// ─── useScrollReveal ──────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      {threshold, rootMargin: "0px 0px -40px 0px"},
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ─── Reveal wrapper (avoids calling hooks inside .map) ────────────────────────
function Reveal({base, delay = 0, children}) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${base}${visible ? ` ${base}--in` : ""}`}
      style={delay ? {transitionDelay: `${delay}s`} : undefined}
    >
      {children}
    </div>
  );
}

// ─── AnimatedCounter ──────────────────────────────────────────────────────────
function AnimatedCounter({value, label, delay = 0}) {
  const [ref, visible] = useScrollReveal(0.3);
  const hasDigits = /\d/.test(value);
  const [display, setDisplay] = useState(hasDigits ? "0" : value);

  useEffect(() => {
    if (!hasDigits) {
      setDisplay(value);
      return undefined;
    }
    if (!visible) return undefined;

    const target = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9]*$/)?.[0] || "";
    const duration = 1600;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(prefix + Math.round(eased * target) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visible, value, delay, hasDigits]);

  return (
    <div ref={ref} className={`stat-card${visible ? " stat-card--in" : ""}`}>
      <div className="stat-card__value">{display}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────
function DashboardMockup() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
  const cells = {
    "0-0": {label: "Math 101", color: "#EA580C", bg: "rgba(234,88,12,0.12)"},
    "0-2": {label: "Physics", color: "#DC2626", bg: "rgba(220,38,38,0.12)"},
    "0-4": {label: "English", color: "#2563EB", bg: "rgba(37,99,235,0.12)"},
    "1-1": {label: "Chemistry", color: "#16A34A", bg: "rgba(22,163,74,0.12)"},
    "1-3": {label: "Math 101", color: "#EA580C", bg: "rgba(234,88,12,0.12)"},
    "2-0": {label: "Biology", color: "#0D9488", bg: "rgba(13,148,136,0.12)"},
    "2-2": {label: "Physics", color: "#DC2626", bg: "rgba(220,38,38,0.12)"},
    "2-4": {label: "History", color: "#7C3AED", bg: "rgba(124,58,237,0.12)"},
    "3-1": {label: "English", color: "#2563EB", bg: "rgba(37,99,235,0.12)"},
    "3-3": {label: "Chemistry", color: "#16A34A", bg: "rgba(22,163,74,0.12)"},
    "4-0": {label: "Math 101", color: "#EA580C", bg: "rgba(234,88,12,0.12)"},
    "4-2": {label: "History", color: "#7C3AED", bg: "rgba(124,58,237,0.12)"},
    "4-4": {label: "Biology", color: "#0D9488", bg: "rgba(13,148,136,0.12)"},
  };

  return (
    <figure className="mock-figure">
      <div
        className="mock"
        role="img"
        aria-label="Preview of the Protiba timetable dashboard, showing a conflict-free weekly schedule for a sample school."
      >
        <div className="mock__bar">
          <div className="mock__dots">
            <span />
            <span />
            <span />
          </div>
          <div className="mock__url">protiba.app / timetable</div>
          <div className="mock__pills">
            <span className="mock__pill mock__pill--ghost">Preview</span>
          </div>
        </div>
        <div className="mock__toolbar">
          <div className="mock__toolbar-left">
            <span className="mock__toolbar-title">Spring Semester 2026</span>
            <span className="mock__toolbar-badge">Sample data</span>
          </div>
          <div className="mock__toolbar-right">
            <span className="mock__toolbar-btn">Export</span>
            <span className="mock__toolbar-btn">Share</span>
          </div>
        </div>
        <div className="mock__grid-head">
          <div className="mock__time-col" />
          {days.map((d) => (
            <div key={d} className="mock__head-cell">
              {d}
            </div>
          ))}
        </div>
        {periods.map((p, pi) => (
          <div key={p} className="mock__row">
            <div className="mock__time">{p}</div>
            {days.map((_, di) => {
              const cell = cells[`${di}-${pi}`];
              return (
                <div
                  key={di}
                  className="mock__cell"
                  style={
                    cell
                      ? {background: cell.bg, borderColor: `${cell.color}30`}
                      : undefined
                  }
                >
                  {cell && (
                    <span style={{color: cell.color}}>{cell.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="mock__status">
          <span className="mock__status-badge mock__status-badge--green">
            <Ic.check /> 0 conflicts
          </span>
          <span className="mock__status-badge">
            <Ic.sparkle /> Generated automatically
          </span>
          <span className="mock__status-badge">
            <Ic.users /> Teachers, rooms, and classes
          </span>
        </div>
      </div>
      <figcaption className="mock-figure__caption">
        Sample preview. Your school's data appears here once you generate your
        first timetable.
      </figcaption>
    </figure>
  );
}

// ─── Analytics Showcase section ───────────────────────────────────────────────
function AnalyticsShowcase() {
  const [ref, visible] = useScrollReveal(0.08);
  const frameRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = frameRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const factor = center * 0.018;
        const rx = Math.max(-4, Math.min(4, factor * 0.4));
        const ry = Math.max(-3, Math.min(3, -factor * 0.2));
        const ty = Math.max(-8, Math.min(8, -factor * 0.3));
        el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ty}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="showcase" ref={ref} aria-labelledby="showcase-title">
      <div className="showcase__inner">
        <div
          className={`showcase__copy${visible ? " showcase__copy--in" : ""}`}
        >
          <span className="eyebrow">Analytics</span>
          <h2 className="showcase__title" id="showcase-title">
            See how your school is running.
            <br />
            <span className="showcase__title-dim">In real time.</span>
          </h2>
          <p className="showcase__desc">
            After each timetable generation, you see exactly how your school is
            running: classroom utilisation, teacher workload, and any
            bottlenecks. No more guessing. No more spreadsheets. Just the
            numbers you need to make decisions.
          </p>
          <ul className="showcase__benefits">
            {analyticsBenefits.map((b, i) => (
              <li
                key={b.text}
                className={`showcase__benefit${visible ? " showcase__benefit--in" : ""}`}
                style={{transitionDelay: `${0.18 + i * 0.09}s`}}
              >
                <div className="showcase__benefit-icon">
                  <b.icon />
                </div>
                <span className="showcase__benefit-text">{b.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/analytics" className="showcase__cta">
            Explore Analytics <Ic.arrow />
          </Link>
        </div>

        <div
          className={`showcase__visual${visible ? " showcase__visual--in" : ""}`}
        >
          <div className="showcase__glow" aria-hidden="true" />
          <div className="showcase__frame" ref={frameRef}>
            <div className="showcase__chrome">
              <div className="showcase__chrome-dots" aria-hidden="true">
                <span className="showcase__chrome-dot showcase__chrome-dot--r" />
                <span className="showcase__chrome-dot showcase__chrome-dot--y" />
                <span className="showcase__chrome-dot showcase__chrome-dot--g" />
              </div>
              <div className="showcase__chrome-url">
                protiba.app / analytics
              </div>
              <div className="showcase__chrome-badges">
                <span className="showcase__chrome-badge">Preview</span>
              </div>
            </div>

            <div className="showcase__img-wrap">
              {!imageFailed ? (
                <img
                  src="https://res.cloudinary.com/dnadawobi/image/upload/v1785103029/Screenshot_2026-07-27_005648_ytqzjo.png"
                  alt="Preview of the Protiba analytics dashboard, showing timetable health, teacher utilisation, and subject allocation for a sample school."
                  className="showcase__img"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="showcase__placeholder">
                  <div className="showcase__placeholder-inner">
                    <div className="showcase__mini-header">
                      <div className="showcase__mini-title">Analytics</div>
                      <div className="showcase__mini-sub">
                        Institution performance and timetable insights
                      </div>
                    </div>
                    <div className="showcase__mini-metrics">
                      {[
                        {label: "Teachers", value: "—"},
                        {label: "Subjects", value: "—"},
                        {label: "Classes", value: "—"},
                        {label: "Timetables", value: "—"},
                      ].map((m) => (
                        <div key={m.label} className="showcase__mini-metric">
                          <div className="showcase__mini-metric-label">
                            {m.label}
                          </div>
                          <div className="showcase__mini-metric-value">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="showcase__mini-health">
                      <div className="showcase__mini-health-ring">
                        <svg
                          viewBox="0 0 100 100"
                          width="90"
                          height="90"
                          aria-hidden="true"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(43,43,43,0.08)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#2B2B2B"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="0 251"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="showcase__mini-health-score">
                          <span
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              color: "#2B2B2B",
                            }}
                          >
                            —
                          </span>
                          <span style={{fontSize: 10, color: "#A8A8A8"}}>
                            / 100
                          </span>
                        </div>
                      </div>
                      <div className="showcase__mini-health-label">
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#2B2B2B",
                          }}
                        >
                          Timetable Health
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#6E6E6E",
                            marginTop: 4,
                            fontWeight: 500,
                          }}
                        >
                          Available after your first generation
                        </div>
                      </div>
                    </div>
                    <div className="showcase__mini-chart">
                      <div className="showcase__mini-chart-label">
                        Subject Allocation
                      </div>
                      <div className="showcase__mini-bars">
                        {[10, 10, 10, 10, 10, 10, 10, 10].map((h, i) => (
                          <div
                            key={i}
                            className="showcase__mini-bar"
                            style={{
                              height: h,
                              background: "rgba(43,43,43,0.10)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="showcase__placeholder-hint">
                      Your analytics will appear here once you generate a
                      timetable.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="showcase__frame-fade" aria-hidden="true" />
          </div>

          <p className="showcase__caption">
            Sample preview. Your school's figures appear here after your first
            generation.
          </p>

          <div
            className="showcase__float showcase__float--tl"
            aria-hidden="true"
          >
            <div className="showcase__float-card">
              <div
                className="showcase__float-dot"
                style={{background: "#2B2B2B"}}
              />
              <div>
                <div className="showcase__float-title">Health Score</div>
                <div className="showcase__float-val" style={{color: "#2B2B2B"}}>
                  Sample metric
                </div>
              </div>
            </div>
          </div>
          <div
            className="showcase__float showcase__float--br"
            aria-hidden="true"
          >
            <div className="showcase__float-card">
              <div
                className="showcase__float-dot"
                style={{background: C.accentL}}
              />
              <div>
                <div className="showcase__float-title">Teacher Utilization</div>
                <div className="showcase__float-val" style={{color: C.accentL}}>
                  Sample metric
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const {user, isLoading: authLoading} = useAuthStore();
  const cursorRef = useRef(null);
  const heroRef = useRef(null);

  const userName = user?.fullName || "Guest";
  const institutionName = user?.institution || "";
  const notificationCount = user?.unreadNotifications ?? 0;

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Direct DOM writes to avoid re-rendering the whole page on every mousemove.
  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current || !heroRef.current) return;
    cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }, []);

  if (authLoading) {
    return (
      <div
        style={{
          background: C.bg,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="status"
        aria-live="polite"
      >
        <div className="hp-spinner" />
        <span className="sr-only">Loading Protiba</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Protiba: Academic Scheduling for Schools</title>
        <meta
          name="description"
          content="Protiba automates school timetable generation for high schools and primary schools. Zero conflicts, instant updates, built for educators. Now in early access."
        />
      </Helmet>
      <style>{CSS}</style>

      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      <div className="hp" style={{paddingTop: 68}}>
        <div className="hp-ambient" aria-hidden="true">
          <div className="hp-ambient__cursor" ref={cursorRef} />
          <div className="hp-ambient__orb hp-ambient__orb--1" />
          <div className="hp-ambient__orb hp-ambient__orb--2" />
          <div className="hp-ambient__orb hp-ambient__orb--3" />
          <div className="hp-ambient__grid" />
        </div>

        <section className="hero" ref={heroRef} onMouseMove={handleMouseMove}>
          <div className="hero__inner">
            <a href="#early-access" className="hero__badge hp-anim hp-anim--1">
              <span className="hero__badge-dot" />
              Now onboarding our first schools
              <Ic.arrowUpRight />
            </a>

            <h1 className="hero__title hp-anim hp-anim--2">
              Academic scheduling,
              <br />
              <span className="hero__title-grad">finally automated.</span>
            </h1>

            <p className="hero__sub hp-anim hp-anim--3">
              Stop spending weeks on your school timetable. Protiba takes your
              teachers, rooms, and class groups and generates a conflict-free
              schedule in minutes. Built for secondary and primary schools.
            </p>

            <div className="hero__actions hp-anim hp-anim--4">
              <Link to="/signup" className="btn-primary">
                Start for free <Ic.arrow />
              </Link>
              <Link to="/home/demo" className="btn-ghost">
                <Ic.play /> See how it works
              </Link>
            </div>

            <div className="hero__status hp-anim hp-anim--5">
              <span className="hero__status-dot" aria-hidden="true" />
              <p className="hero__status-text">
                <strong>Early access.</strong> We onboard a small number of
                schools each month.
              </p>
            </div>

            <div className="hero__trust hp-anim hp-anim--5">
              <span className="hero__trust-item">
                <Ic.lock /> No credit card required
              </span>
              <span className="hero__trust-div" aria-hidden="true" />
              <span className="hero__trust-item">
                <Ic.sparkle /> Free during early access
              </span>
              <span className="hero__trust-div" aria-hidden="true" />
              <span className="hero__trust-item">
                <Ic.globe /> Your data stays yours
              </span>
            </div>

            <div className="hero__mockup hp-anim hp-anim--6">
              <DashboardMockup />
              <div className="float-card float-card--left" aria-hidden="true">
                <div className="float-card__icon float-card__icon--green">
                  <Ic.check />
                </div>
                <div>
                  <div className="float-card__title">Auto-resolved</div>
                  <div className="float-card__sub">Room conflicts</div>
                </div>
              </div>
              <div className="float-card float-card--right" aria-hidden="true">
                <div className="float-card__icon float-card__icon--purple">
                  <Ic.zap />
                </div>
                <div>
                  <div className="float-card__title">Optimised</div>
                  <div className="float-card__sub">Room utilisation</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-strip" aria-label="Product qualities">
          <div className="feature-strip__inner">
            {[
              {icon: Ic.zap, label: "Performance"},
              {icon: Ic.shield, label: "Security"},
              {icon: Ic.layers, label: "Scalability"},
              {icon: Ic.clock, label: "Automation"},
              {icon: Ic.check, label: "Reliability"},
            ].map(({icon: Icon, label}) => (
              <div key={label} className="feature-strip__item">
                <div className="feature-strip__icon">
                  <Icon />
                </div>
                <span className="feature-strip__label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <AnalyticsShowcase />

        <section className="logos" aria-label="Who Protiba is built for">
          <p className="logos__label">Built for every kind of school</p>
          <div className="logos__wrap">
            <div className="logos__track">
              {[...builtFor, ...builtFor, ...builtFor].map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="logos__item"
                  aria-hidden={i >= builtFor.length}
                >
                  <span className="logos__dot" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="stats" aria-label="What Protiba does">
          <div className="stats__inner">
            {highlights.map((s, i) => (
              <AnimatedCounter
                key={s.label}
                value={s.value}
                label={s.label}
                delay={i * 140}
              />
            ))}
          </div>
        </section>

        <section
          className="features"
          id="features"
          aria-labelledby="features-title"
        >
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">Platform capabilities</span>
              <h2 className="section-title" id="features-title">
                Everything your school needs.
                <br />
                <span className="section-title-muted">Nothing it doesn't.</span>
              </h2>
              <p className="section-sub">
                Built for the way secondary and primary schools actually
                operate, from small rural schools to large high schools.
              </p>
            </div>
            <div className="features__grid">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.title} base="feat-card" delay={i * 0.07}>
                    <div className="feat-card__glow" aria-hidden="true" />
                    <div className="feat-card__icon">
                      <Icon />
                    </div>
                    <span className="feat-card__badge">{f.badge}</span>
                    <h3 className="feat-card__title">{f.title}</h3>
                    <p className="feat-card__desc">{f.desc}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="how" id="how-it-works" aria-labelledby="how-title">
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2 className="section-title" id="how-title">
                From constraints to schedule
                <br />
                <span className="section-title-muted">in three steps.</span>
              </h2>
            </div>
            <div className="steps">
              {howItWorksSteps.map((s, i) => (
                <Reveal key={s.n} base="step" delay={i * 0.14}>
                  <div className="step__num" aria-hidden="true">
                    {s.n}
                  </div>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__desc">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="early"
          id="early-access"
          aria-labelledby="early-title"
        >
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">Early access</span>
              <h2 className="section-title" id="early-title">
                We're onboarding our
                <br />
                <span className="section-title-muted">first schools.</span>
              </h2>
              <p className="section-sub">
                Protiba is new. We're working closely with a small group of
                schools to make it the best timetabling tool in the region.
                Here's what you get when you join early.
              </p>
            </div>

            <div className="early__grid">
              {earlyAccessPerks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Reveal key={p.title} base="early__card" delay={i * 0.09}>
                    <div className="early__card-icon">
                      <Icon />
                    </div>
                    <h3 className="early__card-title">{p.title}</h3>
                    <p className="early__card-desc">{p.desc}</p>
                  </Reveal>
                );
              })}
            </div>

            <div className="early__cta">
              <Link to="/signup" className="btn-primary">
                Request early access <Ic.arrow />
              </Link>
              <span className="early__note">
                No credit card required. We reply within two working days.
              </span>
            </div>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-title">
          <div className="cta__inner">
            <div className="cta__glow" aria-hidden="true" />
            <span className="eyebrow eyebrow--center">
              Start today, it's free
            </span>
            <h2 className="cta__title" id="cta-title">
              Your school deserves
              <br />a better way to schedule.
            </h2>
            <p className="cta__sub">
              Create an account, add your teachers and class groups, and
              generate your first conflict-free timetable today.
            </p>
            <div className="cta__actions">
              <Link to="/signup" className="btn-primary btn-primary--lg">
                Create your free account <Ic.arrow />
              </Link>
              <div className="cta__checks">
                {[
                  "No credit card required",
                  "Setup in under 10 minutes",
                  "Cancel anytime",
                ].map((c) => (
                  <span key={c} className="cta__check">
                    <Ic.check /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .hp{font-family:'Inter',-apple-system,system-ui,sans-serif;background:${C.bg};color:${C.text};-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;position:relative;}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
  :focus-visible{outline:2px solid ${C.accent};outline-offset:3px;border-radius:6px;}

  @keyframes spin{to{transform:rotate(360deg);}}
  .hp-spinner{width:36px;height:36px;border-radius:50%;border:2.5px solid ${C.accentG};border-top-color:${C.accent};animation:spin 0.75s linear infinite;}

  @keyframes revealUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
  .hp-anim{opacity:0;transform:translateY(28px);animation:revealUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards;}
  .hp-anim--1{animation-delay:0.08s;}.hp-anim--2{animation-delay:0.18s;}.hp-anim--3{animation-delay:0.30s;}
  .hp-anim--4{animation-delay:0.42s;}.hp-anim--5{animation-delay:0.54s;}.hp-anim--6{animation-delay:0.68s;}

  .hp-ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .hp-ambient__cursor{position:fixed;top:0;left:0;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(43,43,43,0.05) 0%,transparent 60%);transform:translate(-50%,-50%);filter:blur(40px);transition:transform 0.22s ease-out;will-change:transform;}
  @keyframes floatA{0%,100%{transform:translate(0,0)}33%{transform:translate(40px,-30px)}66%{transform:translate(-30px,40px)}}
  @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,30px)}}
  .hp-ambient__orb{position:absolute;border-radius:50%;filter:blur(90px);}
  .hp-ambient__orb--1{width:800px;height:800px;top:-250px;left:-180px;background:radial-gradient(circle,rgba(43,43,43,0.07) 0%,transparent 70%);animation:floatA 22s ease-in-out infinite;}
  .hp-ambient__orb--2{width:600px;height:600px;top:30%;right:-140px;background:radial-gradient(circle,rgba(43,43,43,0.05) 0%,transparent 70%);animation:floatB 28s ease-in-out infinite;}
  .hp-ambient__orb--3{width:480px;height:480px;bottom:18%;left:14%;background:radial-gradient(circle,rgba(43,43,43,0.04) 0%,transparent 70%);animation:floatA 24s ease-in-out infinite reverse;}
  .hp-ambient__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(43,43,43,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(43,43,43,0.03) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 80% 50% at 50% 0%,black 0%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse 80% 50% at 50% 0%,black 0%,transparent 70%);}

  .btn-primary{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#fff;background:linear-gradient(135deg,${C.accent} 0%,${C.accent2} 100%);text-decoration:none;padding:13px 26px;border-radius:11px;border:1px solid ${C.accentB};box-shadow:0 4px 22px rgba(43,43,43,0.22),inset 0 1px 0 rgba(255,255,255,0.12);transition:transform 0.22s,box-shadow 0.22s;letter-spacing:-0.01em;position:relative;overflow:hidden;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(43,43,43,0.30),inset 0 1px 0 rgba(255,255,255,0.16);}
  .btn-primary:active{transform:translateY(0);}
  .btn-primary--lg{font-size:16px;padding:15px 32px;}
  .btn-ghost{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:500;color:${C.text2};background:rgba(43,43,43,0.02);border:1px solid ${C.border3};text-decoration:none;padding:13px 26px;border-radius:11px;transition:color 0.22s,background 0.22s,transform 0.22s;backdrop-filter:blur(10px);}
  .btn-ghost:hover{color:${C.text};background:rgba(43,43,43,0.05);transform:translateY(-2px);}

  .hero{position:relative;z-index:1;padding:160px 24px 80px;text-align:center;}
  .hero__inner{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;align-items:center;}

  @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
  .hero__badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:${C.accentL};background:${C.accentG};border:1px solid ${C.border3};padding:6px 15px 6px 11px;border-radius:24px;margin-bottom:30px;text-decoration:none;transition:background 0.22s,border-color 0.22s,transform 0.22s;backdrop-filter:blur(10px);}
  .hero__badge:hover{background:${C.accentGS};border-color:${C.accentB};transform:translateY(-1px);}
  .hero__badge-dot{width:7px;height:7px;border-radius:50%;background:${C.accentL};animation:pulseDot 2.5s ease-in-out infinite;box-shadow:0 0 10px rgba(92,92,92,0.5);flex-shrink:0;}

  .hero__title{font-size:clamp(44px,6.5vw,74px);font-weight:900;letter-spacing:-0.045em;line-height:0.95;color:${C.text};margin-bottom:22px;}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .hero__title-grad{background:linear-gradient(135deg,${C.accentL} 0%,#3A3A3A 30%,${C.text} 60%,${C.accent2} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gradShift 6s ease infinite;}
  .hero__sub{font-size:clamp(16px,2vw,19px);color:${C.text2};line-height:1.72;max-width:620px;margin-bottom:36px;font-weight:400;}
  .hero__actions{display:flex;gap:14px;margin-bottom:36px;flex-wrap:wrap;justify-content:center;}

  .hero__status{display:flex;align-items:center;gap:9px;margin-bottom:18px;padding:7px 16px;border-radius:24px;background:rgba(43,43,43,0.025);border:1px solid ${C.border};}
  .hero__status-dot{width:6px;height:6px;border-radius:50%;background:#22C55E;box-shadow:0 0 6px rgba(34,197,94,0.6);flex-shrink:0;}
  .hero__status-text{font-size:13px;color:${C.text4};font-weight:500;}
  .hero__status-text strong{color:${C.text2};font-weight:600;}

  .hero__trust{display:flex;align-items:center;gap:16px;margin-bottom:56px;flex-wrap:wrap;justify-content:center;}
  .hero__trust-item{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:${C.text4};letter-spacing:0.02em;}
  .hero__trust-item svg{color:${C.text};}
  .hero__trust-div{width:3px;height:3px;border-radius:50%;background:${C.border3};}

  .hero__mockup{width:100%;max-width:900px;margin:0 auto;position:relative;}
  .mock-figure{margin:0;position:relative;}
  .mock-figure__caption{margin-top:16px;font-size:11.5px;color:${C.text4};text-align:center;font-weight:500;}
  .mock{background:${C.bg2};border:1px solid ${C.border2};border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(43,43,43,0.05),0 32px 100px rgba(43,43,43,0.10),0 0 80px rgba(43,43,43,0.05);transition:transform 0.5s ease,box-shadow 0.5s ease;}
  .hero__mockup:hover .mock{transform:rotateX(2deg) rotateY(-1deg) translateY(-4px);}
  .mock__bar{display:flex;align-items:center;gap:14px;padding:13px 20px;background:${C.bg3};border-bottom:1px solid ${C.border};}
  .mock__dots{display:flex;gap:7px;}
  .mock__dots span{width:11px;height:11px;border-radius:50%;background:${C.bg4};}
  .mock__dots span:first-child{background:#A0A0A0;opacity:0.7;}
  .mock__dots span:nth-child(2){background:#898989;opacity:0.7;}
  .mock__dots span:last-child{background:${C.text};opacity:0.6;}
  .mock__url{flex:1;font-size:12px;color:${C.text4};background:${C.bg4};padding:5px 14px;border-radius:7px;text-align:center;max-width:260px;margin:0 auto;font-weight:500;border:1px solid ${C.border};}
  .mock__pills{display:flex;gap:7px;margin-left:auto;}
  .mock__pill{font-size:9px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;}
  .mock__pill--ghost{color:${C.text3};background:${C.bg4};border:1px solid ${C.border};}
  .mock__toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid ${C.border};}
  .mock__toolbar-left{display:flex;align-items:center;gap:10px;}
  .mock__toolbar-right{display:flex;gap:8px;}
  .mock__toolbar-title{font-size:13px;font-weight:700;color:${C.text};letter-spacing:-0.01em;}
  .mock__toolbar-badge{font-size:9px;font-weight:700;color:${C.text3};background:${C.bg3};border:1px solid ${C.border};padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .mock__toolbar-btn{font-size:11px;font-weight:600;color:${C.text3};background:${C.bg4};border:1px solid ${C.border};padding:4px 10px;border-radius:6px;transition:color 0.18s,background 0.18s;}
  .mock__toolbar-btn:hover{color:${C.text2};background:#DEDEDE;}
  .mock__grid-head,.mock__row{display:grid;grid-template-columns:52px repeat(5,1fr);gap:4px;padding:0 16px;margin-bottom:4px;}
  .mock__grid-head{margin-top:12px;}
  .mock__head-cell{font-size:10px;font-weight:700;color:${C.text4};text-align:center;padding:6px 2px;text-transform:uppercase;letter-spacing:0.06em;}
  .mock__time{font-size:10px;color:${C.text4};display:flex;align-items:center;justify-content:center;font-weight:600;}
  .mock__cell{height:42px;border-radius:7px;border:1px solid ${C.border};background:${C.bg3};display:flex;align-items:center;justify-content:center;transition:transform 0.18s,box-shadow 0.18s;}
  .mock__cell:hover{transform:scale(1.04);z-index:2;box-shadow:0 4px 14px rgba(43,43,43,0.10);}
  .mock__cell span{font-size:10px;font-weight:700;letter-spacing:-0.01em;padding:0 6px;text-align:center;line-height:1.3;}
  .mock__status{display:flex;align-items:center;gap:10px;padding:14px 20px;border-top:1px solid ${C.border};flex-wrap:wrap;margin-top:4px;}
  .mock__status-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;color:${C.text3};background:${C.bg3};border:1px solid ${C.border};padding:4px 10px;border-radius:20px;}
  .mock__status-badge--green{color:${C.text};background:${C.accentG};border-color:${C.border3};}

  @keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  .float-card{position:absolute;display:flex;align-items:center;gap:11px;background:rgba(248,248,248,0.92);backdrop-filter:blur(16px);border:1px solid ${C.border2};border-radius:11px;padding:12px 16px;box-shadow:0 8px 28px rgba(43,43,43,0.14);}
  .float-card--left{top:18%;left:-55px;animation:floatCard 5s ease-in-out infinite;}
  .float-card--right{bottom:18%;right:-50px;animation:floatCard 5s ease-in-out 2.5s infinite;}
  .float-card__icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .float-card__icon--green{background:rgba(43,43,43,0.08);border:1px solid ${C.accentB};color:${C.text};}
  .float-card__icon--purple{background:${C.accentG};border:1px solid ${C.border3};color:${C.accentL};}
  .float-card__title{font-size:11px;font-weight:700;color:${C.text};}
  .float-card__sub{font-size:10px;color:${C.text3};font-weight:500;}

  .feature-strip{position:relative;z-index:1;padding:40px 24px;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};background:rgba(43,43,43,0.015);}
  .feature-strip__inner{max-width:900px;margin:0 auto;display:flex;justify-content:center;gap:clamp(24px,5vw,64px);flex-wrap:wrap;}
  .feature-strip__item{display:flex;align-items:center;gap:8px;cursor:default;}
  .feature-strip__item:hover .feature-strip__icon{color:${C.accentL};}
  .feature-strip__item:hover .feature-strip__label{color:${C.text2};}
  .feature-strip__icon{color:${C.text3};transition:color 0.2s;display:flex;align-items:center;}
  .feature-strip__label{font-size:13px;font-weight:600;color:${C.text4};letter-spacing:0.02em;transition:color 0.2s;}

  .showcase{position:relative;z-index:1;padding:120px 24px;border-top:1px solid ${C.border};overflow:hidden;}
  .showcase__inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:center;}
  @media(max-width:960px){.showcase__inner{grid-template-columns:1fr;gap:56px;}.showcase{padding:80px 24px;}}
  .showcase__copy{display:flex;flex-direction:column;gap:0;opacity:0;transform:translateX(-24px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1);}
  .showcase__copy--in{opacity:1;transform:translateX(0);}
  .showcase__title{font-size:clamp(28px,3.6vw,46px);font-weight:900;letter-spacing:-0.04em;line-height:1.06;color:${C.text};margin-bottom:18px;margin-top:14px;}
  .showcase__title-dim{color:${C.text4};}
  .showcase__desc{font-size:15px;color:${C.text2};line-height:1.78;margin-bottom:32px;font-weight:400;}
  .showcase__benefits{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:36px;}
  .showcase__benefit{display:flex;align-items:center;gap:12px;opacity:0;transform:translateX(-16px);transition:opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1);}
  .showcase__benefit--in{opacity:1;transform:translateX(0);}
  .showcase__benefit-icon{width:30px;height:30px;border-radius:8px;flex-shrink:0;background:${C.accentG};border:1px solid ${C.border3};display:flex;align-items:center;justify-content:center;color:${C.accentL};transition:background 0.22s,transform 0.22s;}
  .showcase__benefit:hover .showcase__benefit-icon{background:${C.accentGS};transform:scale(1.08);}
  .showcase__benefit-text{font-size:14px;font-weight:500;color:${C.text2};transition:color 0.22s;}
  .showcase__benefit:hover .showcase__benefit-text{color:${C.text};}
  .showcase__cta{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#fff;background:linear-gradient(135deg,${C.accent} 0%,${C.accent2} 100%);text-decoration:none;padding:12px 22px;border-radius:10px;border:1px solid ${C.accentB};box-shadow:0 4px 18px rgba(43,43,43,0.22),inset 0 1px 0 rgba(255,255,255,0.12);transition:transform 0.22s,box-shadow 0.22s;width:fit-content;}
  .showcase__cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(43,43,43,0.30),inset 0 1px 0 rgba(255,255,255,0.16);}
  .showcase__visual{position:relative;opacity:0;transform:translateX(28px);transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s,transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s;}
  .showcase__visual--in{opacity:1;transform:translateX(0);}
  .showcase__glow{position:absolute;inset:-60px;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(43,43,43,0.08) 0%,transparent 65%);filter:blur(50px);z-index:0;pointer-events:none;}
  .showcase__frame{position:relative;z-index:1;border-radius:18px;overflow:hidden;border:1px solid ${C.border3};box-shadow:0 0 0 1px rgba(43,43,43,0.06),0 40px 100px rgba(43,43,43,0.12),0 0 80px rgba(43,43,43,0.05);transition:transform 0.6s cubic-bezier(0.16,1,0.3,1),box-shadow 0.6s cubic-bezier(0.16,1,0.3,1);transform:perspective(1200px) rotateY(-2deg) rotateX(1deg);will-change:transform;}
  .showcase__visual:hover .showcase__frame{box-shadow:0 0 0 1px rgba(43,43,43,0.16),0 56px 120px rgba(43,43,43,0.16),0 0 100px rgba(43,43,43,0.08);}
  .showcase__chrome{display:flex;align-items:center;gap:12px;padding:12px 18px;background:${C.bg2};border-bottom:1px solid rgba(43,43,43,0.07);}
  .showcase__chrome-dots{display:flex;gap:6px;}
  .showcase__chrome-dot{width:11px;height:11px;border-radius:50%;}
  .showcase__chrome-dot--r{background:#A0A0A0;opacity:0.7;}
  .showcase__chrome-dot--y{background:#898989;opacity:0.7;}
  .showcase__chrome-dot--g{background:${C.text};opacity:0.6;}
  .showcase__chrome-url{flex:1;font-size:11px;color:${C.text4};background:${C.bg3};padding:5px 14px;border-radius:7px;text-align:center;max-width:240px;margin:0 auto;font-weight:500;border:1px solid ${C.border};}
  .showcase__chrome-badges{display:flex;gap:6px;margin-left:auto;}
  .showcase__chrome-badge{font-size:9px;font-weight:700;color:${C.text3};background:${C.bg3};border:1px solid ${C.border};padding:3px 8px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;}
  .showcase__img-wrap{position:relative;background:${C.bg2};min-height:360px;display:block;}
  .showcase__img{width:100%;height:auto;display:block;object-fit:cover;}
  .showcase__frame-fade{position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top,rgba(248,248,248,0.7) 0%,transparent 100%);pointer-events:none;z-index:2;}
  .showcase__caption{margin-top:16px;font-size:11.5px;color:${C.text4};text-align:center;font-weight:500;}
  .showcase__placeholder{width:100%;min-height:420px;background:${C.bg2};display:flex;align-items:center;justify-content:center;}
  .showcase__placeholder-inner{width:100%;padding:24px;display:flex;flex-direction:column;gap:18px;}
  .showcase__mini-title{font-size:17px;font-weight:800;color:${C.text};letter-spacing:-0.02em;margin-bottom:4px;}
  .showcase__mini-sub{font-size:12px;color:${C.text3};}
  .showcase__mini-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
  .showcase__mini-metric{background:${C.bg3};border:1px solid rgba(43,43,43,0.07);border-radius:10px;padding:12px 14px;}
  .showcase__mini-metric-label{font-size:9px;color:${C.text3};font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;}
  .showcase__mini-metric-value{font-size:22px;font-weight:800;letter-spacing:-0.03em;line-height:1;color:${C.text4};}
  .showcase__mini-health{display:flex;align-items:center;gap:18px;background:${C.bg3};border:1px solid rgba(43,43,43,0.07);border-radius:12px;padding:16px 20px;}
  .showcase__mini-health-ring{position:relative;display:flex;align-items:center;justify-content:center;}
  .showcase__mini-health-score{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .showcase__mini-chart{background:${C.bg3};border:1px solid rgba(43,43,43,0.07);border-radius:12px;padding:16px 20px;}
  .showcase__mini-chart-label{font-size:10px;font-weight:700;color:${C.text3};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;}
  .showcase__mini-bars{display:flex;align-items:flex-end;gap:4px;height:56px;}
  .showcase__mini-bar{flex:1;border-radius:3px 3px 0 0;min-height:6px;}
  .showcase__placeholder-hint{font-size:11px;color:${C.text4};text-align:center;font-style:italic;padding:4px 0;}

  @keyframes showcaseFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .showcase__float{position:absolute;z-index:10;}
  .showcase__float--tl{top:-16px;left:-16px;animation:showcaseFloat 5s ease-in-out infinite;}
  .showcase__float--br{bottom:-16px;right:-12px;animation:showcaseFloat 5s ease-in-out 2.5s infinite;}
  @media(max-width:600px){.showcase__float{display:none;}}
  .showcase__float-card{display:flex;align-items:center;gap:10px;background:rgba(248,248,248,0.94);backdrop-filter:blur(18px);border:1px solid ${C.border3};border-radius:10px;padding:10px 14px;box-shadow:0 8px 28px rgba(43,43,43,0.14);white-space:nowrap;}
  .showcase__float-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .showcase__float-title{font-size:10px;color:${C.text3};font-weight:600;margin-bottom:1px;}
  .showcase__float-val{font-size:12px;font-weight:700;}

  .logos{position:relative;z-index:1;padding:52px 24px;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};overflow:hidden;}
  .logos__label{text-align:center;font-size:10px;font-weight:700;color:${C.text4};text-transform:uppercase;letter-spacing:0.14em;margin-bottom:26px;}
  .logos__wrap{position:relative;mask-image:linear-gradient(90deg,transparent 0%,black 14%,black 86%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,black 14%,black 86%,transparent 100%);}
  @keyframes scrollLogos{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
  .logos__track{display:flex;gap:52px;animation:scrollLogos 30s linear infinite;width:max-content;}
  .logos:hover .logos__track{animation-play-state:paused;}
  .logos__item{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;color:${C.text4};white-space:nowrap;padding:6px 14px;border-radius:7px;transition:color 0.2s,background 0.2s;cursor:default;}
  .logos__item:hover{color:${C.text2};background:rgba(43,43,43,0.03);}
  .logos__dot{width:5px;height:5px;border-radius:50%;background:${C.text};opacity:0.4;}

  .stats{position:relative;z-index:1;padding:80px 24px;}
  .stats__inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(43,43,43,0.08);}
  @media(max-width:760px){.stats__inner{grid-template-columns:repeat(2,1fr);}}
  .stat-card{padding:42px 24px;background:${C.bg2};text-align:center;position:relative;overflow:hidden;opacity:0;transform:translateY(12px);transition:background 0.22s,transform 0.6s cubic-bezier(0.16,1,0.3,1),opacity 0.6s cubic-bezier(0.16,1,0.3,1);}
  .stat-card--in{opacity:1;transform:translateY(0);}
  .stat-card:hover{background:${C.bg3};}
  .stat-card__value{font-size:clamp(28px,4vw,38px);font-weight:900;letter-spacing:-0.045em;margin-bottom:8px;background:linear-gradient(135deg,${C.text} 0%,${C.accentL} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
  .stat-card__label{font-size:12px;color:${C.text3};font-weight:600;text-transform:uppercase;letter-spacing:0.06em;line-height:1.5;}

  .section-wrap{max-width:1100px;margin:0 auto;padding:0 24px;}
  .section-head{text-align:center;margin-bottom:64px;}
  .eyebrow{display:inline-flex;align-items:center;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.14em;color:${C.accentL};background:${C.accentG};border:1px solid ${C.border3};padding:5px 14px;border-radius:24px;margin-bottom:20px;}
  .eyebrow--center{display:block;text-align:center;width:fit-content;margin:0 auto 20px;}
  .section-title{font-size:clamp(32px,4.5vw,50px);font-weight:900;letter-spacing:-0.04em;line-height:1.06;color:${C.text};margin-bottom:18px;}
  .section-title-muted{color:${C.text4};}
  .section-sub{font-size:16px;color:${C.text2};line-height:1.7;max-width:600px;margin:0 auto;}

  .features{position:relative;z-index:1;padding:120px 0;}
  .features__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border:1px solid ${C.border};border-radius:20px;overflow:hidden;}
  @media(max-width:900px){.features__grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:540px){.features__grid{grid-template-columns:1fr;}}
  .feat-card{padding:34px 30px;background:${C.bg2};transition:background 0.4s cubic-bezier(0.16,1,0.3,1),transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s cubic-bezier(0.16,1,0.3,1);opacity:0;transform:translateY(18px);position:relative;overflow:hidden;}
  .feat-card--in{opacity:1;transform:translateY(0);}
  .feat-card:hover{background:${C.bg3};transform:translateY(-4px);z-index:2;}
  .feat-card__glow{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.accentL},transparent);opacity:0;transition:opacity 0.22s;}
  .feat-card:hover .feat-card__glow{opacity:0.5;}
  .feat-card__icon{width:38px;height:38px;border-radius:10px;background:${C.accentG};border:1px solid ${C.border3};display:flex;align-items:center;justify-content:center;color:${C.accentL};margin-bottom:16px;transition:background 0.22s,transform 0.22s;}
  .feat-card:hover .feat-card__icon{background:${C.accentGS};transform:scale(1.06);}
  .feat-card__badge{display:inline-block;font-size:10px;font-weight:700;color:${C.accentL};background:${C.accentG};border:1px solid ${C.border3};padding:3px 9px;border-radius:20px;margin-bottom:10px;letter-spacing:0.04em;}
  .feat-card__title{font-size:15px;font-weight:800;color:${C.text};letter-spacing:-0.02em;margin-bottom:9px;}
  .feat-card__desc{font-size:13px;color:${C.text2};line-height:1.7;}

  .how{position:relative;z-index:1;padding:120px 0;border-top:1px solid ${C.border};}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;}
  @media(max-width:768px){.steps{grid-template-columns:1fr;gap:32px;}}
  .step{opacity:0;transform:translateY(28px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1);}
  .step--in{opacity:1;transform:translateY(0);}
  .step__num{font-size:52px;font-weight:900;letter-spacing:-0.05em;color:${C.bg4};line-height:1;margin-bottom:18px;font-variant-numeric:tabular-nums;transition:color 0.22s,opacity 0.22s;}
  .step:hover .step__num{color:${C.text};opacity:0.35;}
  .step__title{font-size:17px;font-weight:800;color:${C.text};letter-spacing:-0.02em;margin-bottom:10px;}
  .step__desc{font-size:14px;color:${C.text2};line-height:1.7;}

  .early{position:relative;z-index:1;padding:120px 0;border-top:1px solid ${C.border};}
  .early__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  @media(max-width:768px){.early__grid{grid-template-columns:1fr;}}
  .early__card{background:${C.bg2};border:1px solid rgba(43,43,43,0.08);border-radius:16px;padding:30px;position:relative;overflow:hidden;opacity:0;transform:translateY(22px);transition:background 0.4s cubic-bezier(0.16,1,0.3,1),transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);}
  .early__card--in{opacity:1;transform:translateY(0);}
  .early__card:hover{background:${C.bg3};transform:translateY(-4px);box-shadow:0 16px 48px rgba(43,43,43,0.10);}
  .early__card-icon{width:34px;height:34px;border-radius:9px;background:${C.accentG};border:1px solid ${C.border3};display:flex;align-items:center;justify-content:center;color:${C.accentL};margin-bottom:16px;}
  .early__card-title{font-size:15px;font-weight:800;color:${C.text};letter-spacing:-0.02em;margin-bottom:9px;}
  .early__card-desc{font-size:13.5px;color:${C.text2};line-height:1.72;}
  .early__cta{display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:48px;}
  .early__note{font-size:12.5px;color:${C.text4};font-weight:500;text-align:center;}

  .cta{position:relative;z-index:1;padding:130px 24px;text-align:center;border-top:1px solid ${C.border};overflow:hidden;}
  .cta__inner{position:relative;max-width:700px;margin:0 auto;}
  @keyframes glowPulse{0%,100%{opacity:0.8;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}
  .cta__glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(43,43,43,0.06) 0%,transparent 70%);pointer-events:none;z-index:-1;animation:glowPulse 4s ease-in-out infinite;}
  .cta__title{font-size:clamp(34px,5vw,54px);font-weight:900;letter-spacing:-0.04em;line-height:1.06;color:${C.text};margin-bottom:18px;}
  .cta__sub{font-size:16px;color:${C.text2};line-height:1.7;max-width:540px;margin:0 auto 44px;}
  .cta__actions{display:flex;flex-direction:column;align-items:center;gap:22px;}
  .cta__checks{display:flex;gap:22px;flex-wrap:wrap;justify-content:center;}
  .cta__check{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:${C.text3};font-weight:500;}
  .cta__check svg{color:${C.text};}

  @media(max-width:600px){
    .hero{padding:120px 16px 60px;}
    .float-card--left,.float-card--right{display:none;}
    .cta{padding:80px 16px;}
    .section-head{margin-bottom:44px;}
    .features,.how,.early{padding:80px 0;}
    .stats{padding:56px 16px;}
    .showcase__float{display:none;}
  }

  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;}
    .logos__track{animation:none!important;transform:none!important;}
    .hp-ambient__orb,.hp-ambient__cursor,.float-card,.showcase__float,.cta__glow{animation:none!important;}
    .showcase__frame{transform:none!important;}
  }
`;

export default Home;
