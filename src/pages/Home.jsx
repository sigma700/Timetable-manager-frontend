import React, {useEffect, useRef, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAuthStore} from "../store/authStore";
import {Navigation} from "./components/navigation";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
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
  text2: "#898989",
  text3: "#A8A8A8",
  text4: "#C4C4C4",
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
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
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
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
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
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1v2.5M7 10.5V13M1 7h2.5M10.5 7H13M2.7 2.7l1.8 1.8M9.5 9.5l1.8 1.8M2.7 11.3l1.8-1.8M9.5 4.5l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  lock: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.5 7h11M7 1.5c1.7 1.8 2.2 3.5 2.2 5.5S8.7 10.7 7 12.5M7 1.5C5.3 3.3 4.8 5 4.8 7s.5 3.7 2.2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  play: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 2l8 5-8 5V2Z" fill="currentColor" />
    </svg>
  ),
  arrowUpRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
const stats = [
  {value: "94%", label: "Conflict reduction"},
  {value: "3x", label: "Faster generation"},
  {value: "500+", label: "Institutions served"},
  {value: "40h", label: "Saved per semester"},
];

const features = [
  {
    icon: Ic.zap,
    title: "Automated generation",
    desc: "Feed in constraints once. Get a fully optimized timetable in minutes.",
    badge: "2.3s avg",
  },
  {
    icon: Ic.shield,
    title: "Zero conflicts",
    desc: "Our constraint engine resolves teacher, room, and class clashes automatically.",
    badge: "100% clash-free",
  },
  {
    icon: Ic.layers,
    title: "Any scale",
    desc: "Primary schools to universities. One platform, unlimited campuses.",
    badge: "Unlimited campuses",
  },
  {
    icon: Ic.clock,
    title: "Real-time sync",
    desc: "Push last-minute changes instantly. Every stakeholder stays in sync.",
    badge: "Instant updates",
  },
  {
    icon: Ic.users,
    title: "Team collaboration",
    desc: "Admins, heads, and teachers all work from a single source of truth.",
    badge: "Role-based access",
  },
  {
    icon: Ic.chart,
    title: "Operational insights",
    desc: "Track utilization, identify bottlenecks, and plan ahead with analytics.",
    badge: "Live dashboards",
  },
];

const testimonials = [
  {
    quote:
      "We eliminated three full weeks of back-and-forth. Protiba generates what used to take our admin team a month.",
    name: "Margaret Wanjiku",
    role: "Deputy Principal",
    institution: "St. Mary's Academy, Nairobi",
    initials: "MW",
  },
  {
    quote:
      "The first generated timetable had zero conflicts. I expected to spend days adjusting. I spent twenty minutes.",
    name: "David Omondi",
    role: "Academic Registrar",
    institution: "Greenfield College, Mombasa",
    initials: "DO",
  },
  {
    quote:
      "We run six departments and 200 courses. Protiba handles all of it without breaking a sweat.",
    name: "Prof. Amina Suleiman",
    role: "Director of Academics",
    institution: "East Africa Polytechnic",
    initials: "AS",
  },
];

const trustLogos = [
  "St. Mary's Academy",
  "Greenfield College",
  "Rift Valley Institute",
  "Nairobi Technical",
  "Coastal University",
  "Mount Kenya University",
  "Kisumu High School",
  "Moi University",
];

// ─── Analytics benefit rows ────────────────────────────────────────────────────
const analyticsBenefits = [
  {icon: Ic.barChart, text: "Monitor classroom utilization in real time"},
  {icon: Ic.users, text: "Track teacher workload across departments"},
  {icon: Ic.activity, text: "Detect scheduling inefficiencies instantly"},
  {icon: Ic.trendUp, text: "Make data-driven planning decisions"},
];

// ─── useScrollReveal ──────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(e.target);
        }
      },
      {threshold, rootMargin: "0px 0px -40px 0px"},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── AnimatedCounter ──────────────────────────────────────────────────────────
function AnimatedCounter({value, label, delay}) {
  const [ref, visible] = useScrollReveal(0.3);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!visible) return;
    const num = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9]*$/)?.[0] || "";
    const dur = 1800;
    const start = performance.now();
    const animate = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(prefix + Math.floor(eased * num) + suffix);
      if (p < 1) requestAnimationFrame(animate);
    };
    const t = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(t);
  }, [visible, value, delay]);
  return (
    <div ref={ref} className="stat-card">
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
    <div className="mock">
      <div className="mock__bar">
        <div className="mock__dots">
          <span />
          <span />
          <span />
        </div>
        <div className="mock__url">protiba.app / timetable</div>
        <div className="mock__pills">
          <span className="mock__pill mock__pill--green">Live</span>
          <span className="mock__pill mock__pill--purple">Pro</span>
        </div>
      </div>
      <div className="mock__toolbar">
        <div className="mock__toolbar-left">
          <span className="mock__toolbar-title">Spring Semester 2026</span>
          <span className="mock__toolbar-badge">Published</span>
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
                    ? {background: cell.bg, borderColor: cell.color + "30"}
                    : {}
                }
              >
                {cell && <span style={{color: cell.color}}>{cell.label}</span>}
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
          <Ic.sparkle /> Generated in 2.3s
        </span>
        <span className="mock__status-badge">
          <Ic.users /> 47 teachers
        </span>
      </div>
    </div>
  );
}

// ─── Analytics Showcase section ───────────────────────────────────────────────
function AnalyticsShowcase() {
  const [ref, visible] = useScrollReveal(0.08);
  const imgRef = useRef(null);

  // Subtle parallax depth on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const factor = center * 0.018;
      imgRef.current.style.transform = `perspective(1200px) rotateX(${Math.max(-4, Math.min(4, factor * 0.4))}deg) rotateY(${Math.max(-3, Math.min(3, -factor * 0.2))}deg) translateY(${Math.max(-8, Math.min(8, -factor * 0.3))}px)`;
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="showcase" ref={ref}>
      <div className="showcase__inner">
        {/* Left: copy */}
        <div
          className={`showcase__copy ${visible ? "showcase__copy--in" : ""}`}
        >
          <h2 className="showcase__title">
            Everything happening across your institution.
            <br />
            <span className="showcase__title-dim">At a glance.</span>
          </h2>
          <p className="showcase__desc">
            After generating a timetable, administrators should instantly
            understand how efficiently their institution is operating. Instead
            of manually checking classrooms, teachers, utilization and
            conflicts, Protiba visualizes everything in one place.
          </p>

          {/* Benefit rows */}
          <ul className="showcase__benefits">
            {analyticsBenefits.map((b, i) => (
              <li
                key={b.text}
                className={`showcase__benefit ${visible ? "showcase__benefit--in" : ""}`}
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

        {/* Right: screenshot */}
        <div
          className={`showcase__visual ${visible ? "showcase__visual--in" : ""}`}
        >
          {/* Glow behind image */}
          <div className="showcase__glow" aria-hidden="true" />

          {/* Image frame */}
          <div className="showcase__frame" ref={imgRef}>
            {/* Chrome bar */}
            <div className="showcase__chrome">
              <div className="showcase__chrome-dots">
                <span className="showcase__chrome-dot showcase__chrome-dot--r" />
                <span className="showcase__chrome-dot showcase__chrome-dot--y" />
                <span className="showcase__chrome-dot showcase__chrome-dot--g" />
              </div>
              <div className="showcase__chrome-url">
                protiba.app / analytics
              </div>
              <div className="showcase__chrome-badges">
                <span className="showcase__chrome-badge">Live</span>
              </div>
            </div>

            {/* Image placeholder — replace src with your screenshot */}
            <div className="showcase__img-wrap">
              <img
                src="https://res.cloudinary.com/dnadawobi/image/upload/v1785099928/Screenshot_2026-07-26_235428_yi7uhf.png"
                alt="Protiba Analytics Dashboard showing institution overview, teacher workload, and timetable health score"
                className="showcase__img"
                onError={(e) => {
                  // Fallback: show a premium placeholder when image not yet provided
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback placeholder — hidden once real image is provided */}
              <div className="showcase__placeholder" style={{display: "none"}}>
                <div className="showcase__placeholder-inner">
                  {/* Mini analytics mockup */}
                  <div className="showcase__mini-header">
                    <div className="showcase__mini-title">Analytics</div>
                    <div className="showcase__mini-sub">
                      Institution performance and timetable insights
                    </div>
                  </div>
                  {/* Metric cards */}
                  <div className="showcase__mini-metrics">
                    {[
                      {label: "Teachers", value: "47", color: "#2B2B2B"},
                      {label: "Subjects", value: "12", color: "#5C5C5C"},
                      {label: "Classes", value: "24", color: "#2B2B2B"},
                      {label: "Timetables", value: "3", color: "#898989"},
                    ].map((m) => (
                      <div key={m.label} className="showcase__mini-metric">
                        <div className="showcase__mini-metric-label">
                          {m.label}
                        </div>
                        <div
                          className="showcase__mini-metric-value"
                          style={{color: m.color}}
                        >
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Health ring */}
                  <div className="showcase__mini-health">
                    <div className="showcase__mini-health-ring">
                      <svg viewBox="0 0 100 100" width="90" height="90">
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
                          strokeDasharray="229 251"
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
                          91
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
                          color: "#2B2B2B",
                          marginTop: 4,
                          fontWeight: 600,
                        }}
                      >
                        Excellent
                      </div>
                    </div>
                  </div>
                  {/* Mini bar chart */}
                  <div className="showcase__mini-chart">
                    <div className="showcase__mini-chart-label">
                      Subject Allocation
                    </div>
                    <div className="showcase__mini-bars">
                      {[65, 48, 82, 55, 71, 38, 90, 44].map((h, i) => (
                        <div
                          key={i}
                          className="showcase__mini-bar"
                          style={{
                            height: h * 0.55,
                            background:
                              i === 6
                                ? C.accent
                                : `rgba(43,43,43,${0.12 + i * 0.06})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="showcase__placeholder-hint">
                    Replace with your analytics screenshot
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlay at bottom for depth */}
            <div className="showcase__frame-fade" aria-hidden="true" />
          </div>

          {/* Floating stat pill */}
          <div className="showcase__float showcase__float--tl">
            <div className="showcase__float-card">
              <div
                className="showcase__float-dot"
                style={{background: "#2B2B2B"}}
              />
              <div>
                <div className="showcase__float-title">Health Score</div>
                <div className="showcase__float-val" style={{color: "#2B2B2B"}}>
                  91.08 Excellent
                </div>
              </div>
            </div>
          </div>
          <div className="showcase__float showcase__float--br">
            <div className="showcase__float-card">
              <div
                className="showcase__float-dot"
                style={{background: C.accentL}}
              />
              <div>
                <div className="showcase__float-title">Teacher Utilization</div>
                <div className="showcase__float-val" style={{color: C.accentL}}>
                  82% avg this week
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
  const [activeT, setActiveT] = useState(0);
  const [mouse, setMouse] = useState({x: 50, y: 50});
  const heroRef = useRef(null);

  const userName = user?.fullName || "Margaret Wanjiku";
  const institutionName = user?.institution || "St. Mary's Academy";
  const notificationCount = user?.unreadNotifications ?? 3;

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {method: "POST", credentials: "include"},
      );
      if (res.ok) window.location.href = "/login";
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const t = setInterval(
      () => setActiveT((i) => (i + 1) % testimonials.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
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
      >
        <div className="hp-spinner" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Protiba - Academic Scheduling, Automated</title>
        <meta
          name="description"
          content="Protiba automates school timetable generation for institutions of any size. Zero conflicts, instant updates, built for educators."
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
        {/* Ambient */}
        <div className="hp-ambient" aria-hidden="true">
          <div
            className="hp-ambient__cursor"
            style={{left: `${mouse.x}%`, top: `${mouse.y}%`}}
          />
          <div className="hp-ambient__orb hp-ambient__orb--1" />
          <div className="hp-ambient__orb hp-ambient__orb--2" />
          <div className="hp-ambient__orb hp-ambient__orb--3" />
          <div className="hp-ambient__grid" />
        </div>

        {/* Hero */}
        <section className="hero" ref={heroRef} onMouseMove={handleMouseMove}>
          <div className="hero__inner">
            <div className="hero__badge hp-anim hp-anim--1">
              <span className="hero__badge-dot" />
              Now serving 500+ institutions across East Africa
              <Ic.arrowUpRight />
            </div>
            <h1 className="hero__title hp-anim hp-anim--2">
              Academic scheduling,
              <br />
              <span className="hero__title-grad">finally automated.</span>
            </h1>
            <p className="hero__sub hp-anim hp-anim--3">
              Protiba eliminates weeks of manual timetabling. Feed in your
              constraints and receive a conflict-free schedule in minutes. Built
              for schools, colleges, and universities.
            </p>
            <div className="hero__actions hp-anim hp-anim--4">
              <Link to="/signup" className="btn-primary">
                Start for free <Ic.arrow />
              </Link>
              <Link to="/login" className="btn-ghost">
                <Ic.play /> Watch demo
              </Link>
            </div>
            <div className="hero__proof hp-anim hp-anim--5">
              <div className="hero__avatars">
                {["MW", "DO", "AS", "FK", "RN"].map((s, i) => (
                  <div
                    key={s}
                    className="hero__avatar"
                    style={{marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i}}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <p className="hero__proof-text">
                Trusted by <strong>500+ administrators</strong> this semester
              </p>
            </div>
            <div className="hero__trust hp-anim hp-anim--5">
              <span className="hero__trust-item">
                <Ic.lock /> SOC 2 Compliant
              </span>
              <span className="hero__trust-div" />
              <span className="hero__trust-item">
                <Ic.globe /> 99.9% Uptime
              </span>
              <span className="hero__trust-div" />
              <span className="hero__trust-item">
                <Ic.shield /> GDPR Ready
              </span>
            </div>
            <div className="hero__mockup hp-anim hp-anim--6">
              <DashboardMockup />
              <div className="float-card float-card--left">
                <div className="float-card__icon float-card__icon--green">
                  <Ic.check />
                </div>
                <div>
                  <div className="float-card__title">Auto-resolved</div>
                  <div className="float-card__sub">3 room conflicts</div>
                </div>
              </div>
              <div className="float-card float-card--right">
                <div className="float-card__icon float-card__icon--purple">
                  <Ic.zap />
                </div>
                <div>
                  <div className="float-card__title">Optimized</div>
                  <div className="float-card__sub">97% room utilization</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <section className="feature-strip">
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

        {/* ── Analytics Showcase (replaces Bento) ── */}
        <AnalyticsShowcase />

        {/* Logo strip */}
        <section className="logos">
          <p className="logos__label">Trusted by leading institutions</p>
          <div className="logos__wrap">
            <div className="logos__track">
              {[...trustLogos, ...trustLogos, ...trustLogos].map((n, i) => (
                <div key={i} className="logos__item">
                  <span className="logos__dot" />
                  {n}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats">
          <div className="stats__inner">
            {stats.map((s, i) => (
              <AnimatedCounter
                key={s.label}
                value={s.value}
                label={s.label}
                delay={i * 180}
              />
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section className="features" id="features">
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">Platform capabilities</span>
              <h2 className="section-title">
                Everything your institution needs.
                <br />
                <span className="section-title-muted">Nothing it doesn't.</span>
              </h2>
              <p className="section-sub">
                Built around the real operational complexity of academic
                institutions, from small schools to multi-campus universities.
              </p>
            </div>
            <div className="features__grid">
              {features.map((f, i) => {
                const [ref, visible] = useScrollReveal();
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    ref={ref}
                    className={`feat-card ${visible ? "feat-card--in" : ""}`}
                    style={{transitionDelay: `${i * 0.07}s`}}
                  >
                    <div className="feat-card__glow" />
                    <div className="feat-card__icon">
                      <Icon />
                    </div>
                    <span className="feat-card__badge">{f.badge}</span>
                    <h3 className="feat-card__title">{f.title}</h3>
                    <p className="feat-card__desc">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how" id="how-it-works">
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2 className="section-title">
                From constraints to schedule
                <br />
                <span className="section-title-muted">in three steps.</span>
              </h2>
            </div>
            <div className="steps">
              {[
                {
                  n: "01",
                  title: "Configure your institution",
                  desc: "Enter teachers, rooms, subjects, and class groups. Set availability windows, preferences, and hard constraints.",
                },
                {
                  n: "02",
                  title: "Let the engine run",
                  desc: "Our constraint-satisfaction algorithm generates thousands of valid permutations and selects the optimal schedule.",
                },
                {
                  n: "03",
                  title: "Publish and manage",
                  desc: "Review, fine-tune, and publish with one click. Push updates in real time and all stakeholders see changes instantly.",
                },
              ].map((s, i) => {
                const [ref, visible] = useScrollReveal();
                return (
                  <div
                    key={s.n}
                    ref={ref}
                    className={`step ${visible ? "step--in" : ""}`}
                    style={{transitionDelay: `${i * 0.14}s`}}
                  >
                    <div className="step__num">{s.n}</div>
                    <h3 className="step__title">{s.title}</h3>
                    <p className="step__desc">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" id="testimonials">
          <div className="section-wrap">
            <div className="section-head">
              <span className="eyebrow">From the field</span>
              <h2 className="section-title">
                Real results from
                <br />
                <span className="section-title-muted">real institutions.</span>
              </h2>
            </div>
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`testi ${i === activeT ? "testi--active" : ""}`}
                  onClick={() => setActiveT(i)}
                >
                  <div className="testi__glow" />
                  <div className="testi__stars">★★★★★</div>
                  <p className="testi__quote">"{t.quote}"</p>
                  <div className="testi__author">
                    <div className="testi__avatar">{t.initials}</div>
                    <div>
                      <div className="testi__name">{t.name}</div>
                      <div className="testi__role">{t.role}</div>
                      <div className="testi__inst">{t.institution}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testi-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === activeT ? "dot--active" : ""}`}
                  onClick={() => setActiveT(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta__inner">
            <div className="cta__glow" />
            <span className="eyebrow eyebrow--center">
              Start today, it's free
            </span>
            <h2 className="cta__title">
              Your institution deserves
              <br />a better way to schedule.
            </h2>
            <p className="cta__sub">
              Join 500+ schools and universities that have reclaimed weeks of
              administrative time every semester.
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

  .hp{
    font-family:'Inter',-apple-system,system-ui,sans-serif;
    background:#F8F8F8;color:#2B2B2B;
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;min-height:100vh;position:relative;
  }

  @keyframes spin{to{transform:rotate(360deg);}}
  .hp-spinner{width:36px;height:36px;border-radius:50%;border:2.5px solid rgba(43,43,43,0.15);border-top-color:#2B2B2B;animation:spin 0.75s linear infinite;}

  @keyframes revealUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
  .hp-anim{opacity:0;transform:translateY(28px);animation:revealUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards;}
  .hp-anim--1{animation-delay:0.08s;}.hp-anim--2{animation-delay:0.18s;}.hp-anim--3{animation-delay:0.30s;}
  .hp-anim--4{animation-delay:0.42s;}.hp-anim--5{animation-delay:0.54s;}.hp-anim--6{animation-delay:0.68s;}

  /* Ambient */
  .hp-ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .hp-ambient__cursor{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(43,43,43,0.05) 0%,transparent 60%);transform:translate(-50%,-50%);filter:blur(40px);transition:left 0.3s ease,top 0.3s ease;}
  @keyframes floatA{0%,100%{transform:translate(0,0)}33%{transform:translate(40px,-30px)}66%{transform:translate(-30px,40px)}}
  @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,30px)}}
  .hp-ambient__orb{position:absolute;border-radius:50%;filter:blur(90px);}
  .hp-ambient__orb--1{width:800px;height:800px;top:-250px;left:-180px;background:radial-gradient(circle,rgba(43,43,43,0.07) 0%,transparent 70%);animation:floatA 22s ease-in-out infinite;}
  .hp-ambient__orb--2{width:600px;height:600px;top:30%;right:-140px;background:radial-gradient(circle,rgba(43,43,43,0.05) 0%,transparent 70%);animation:floatB 28s ease-in-out infinite;}
  .hp-ambient__orb--3{width:480px;height:480px;bottom:18%;left:14%;background:radial-gradient(circle,rgba(43,43,43,0.04) 0%,transparent 70%);animation:floatA 24s ease-in-out infinite reverse;}
  .hp-ambient__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(43,43,43,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(43,43,43,0.03) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 80% 50% at 50% 0%,black 0%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse 80% 50% at 50% 0%,black 0%,transparent 70%);}

  /* Buttons */
  .btn-primary{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#fff;background:linear-gradient(135deg,#2B2B2B 0%,#454545 100%);text-decoration:none;padding:13px 26px;border-radius:11px;border:1px solid rgba(43,43,43,0.4);box-shadow:0 4px 22px rgba(43,43,43,0.22),inset 0 1px 0 rgba(255,255,255,0.12);transition:all 0.22s;letter-spacing:-0.01em;position:relative;overflow:hidden;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(43,43,43,0.30),inset 0 1px 0 rgba(255,255,255,0.16);}
  .btn-primary--lg{font-size:16px;padding:15px 32px;}
  .btn-ghost{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:500;color:#898989;background:rgba(43,43,43,0.02);border:1px solid rgba(43,43,43,0.14);text-decoration:none;padding:13px 26px;border-radius:11px;transition:all 0.22s;backdrop-filter:blur(10px);}
  .btn-ghost:hover{color:#2B2B2B;background:rgba(43,43,43,0.05);transform:translateY(-2px);}

  /* Hero */
  .hero{position:relative;z-index:1;padding:160px 24px 80px;text-align:center;}
  .hero__inner{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;align-items:center;}
  @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
  .hero__badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#5C5C5C;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);padding:6px 15px 6px 11px;border-radius:24px;margin-bottom:30px;cursor:default;transition:all 0.22s;backdrop-filter:blur(10px);}
  .hero__badge:hover{background:rgba(43,43,43,0.10);border-color:rgba(43,43,43,0.22);transform:translateY(-1px);}
  .hero__badge-dot{width:7px;height:7px;border-radius:50%;background:#5C5C5C;animation:pulseDot 2.5s ease-in-out infinite;box-shadow:0 0 10px rgba(92,92,92,0.5);flex-shrink:0;}
  .hero__title{font-size:clamp(44px,6.5vw,74px);font-weight:900;letter-spacing:-0.045em;line-height:0.95;color:#2B2B2B;margin-bottom:22px;}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .hero__title-grad{background:linear-gradient(135deg,#5C5C5C 0%,#3A3A3A 30%,#2B2B2B 60%,#454545 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:gradShift 6s ease infinite;}
  .hero__sub{font-size:clamp(16px,2vw,19px);color:#898989;line-height:1.72;max-width:600px;margin-bottom:36px;font-weight:400;}
  .hero__actions{display:flex;gap:14px;margin-bottom:44px;flex-wrap:wrap;justify-content:center;}
  .hero__proof{display:flex;align-items:center;gap:14px;margin-bottom:18px;}
  .hero__avatars{display:flex;}
  .hero__avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#ECECEC,#E8E8E8);border:2.5px solid #F8F8F8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#5C5C5C;box-shadow:0 2px 8px rgba(43,43,43,0.12);}
  .hero__proof-text{font-size:13px;color:#C4C4C4;font-weight:500;}
  .hero__proof-text strong{color:#898989;font-weight:600;}
  .hero__trust{display:flex;align-items:center;gap:16px;margin-bottom:56px;flex-wrap:wrap;justify-content:center;}
  .hero__trust-item{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#C4C4C4;letter-spacing:0.02em;}
  .hero__trust-item svg{color:#2B2B2B;}
  .hero__trust-div{width:3px;height:3px;border-radius:50%;background:rgba(43,43,43,0.14);}
  .hero__mockup{width:100%;max-width:900px;margin:0 auto;position:relative;}

  /* Mock */
  .mock{background:#F1F1F1;border:1px solid rgba(43,43,43,0.10);border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(43,43,43,0.05),0 32px 100px rgba(43,43,43,0.10),0 0 80px rgba(43,43,43,0.05);transition:transform 0.5s ease,box-shadow 0.5s ease;}
  .hero__mockup:hover .mock{transform:rotateX(2deg) rotateY(-1deg) translateY(-4px);}
  .mock__bar{display:flex;align-items:center;gap:14px;padding:13px 20px;background:#ECECEC;border-bottom:1px solid rgba(43,43,43,0.06);}
  .mock__dots{display:flex;gap:7px;}
  .mock__dots span{width:11px;height:11px;border-radius:50%;background:#E8E8E8;}
  .mock__dots span:first-child{background:#A0A0A0;opacity:0.7;}
  .mock__dots span:nth-child(2){background:#898989;opacity:0.7;}
  .mock__dots span:last-child{background:#2B2B2B;opacity:0.6;}
  .mock__url{flex:1;font-size:12px;color:#C4C4C4;background:#E8E8E8;padding:5px 14px;border-radius:7px;text-align:center;max-width:260px;margin:0 auto;font-weight:500;border:1px solid rgba(43,43,43,0.06);}
  .mock__pills{display:flex;gap:7px;margin-left:auto;}
  .mock__pill{font-size:9px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;}
  .mock__pill--green{color:#2B2B2B;background:rgba(43,43,43,0.08);border:1px solid rgba(43,43,43,0.16);}
  .mock__pill--purple{color:#5C5C5C;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);}
  .mock__toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(43,43,43,0.06);}
  .mock__toolbar-left{display:flex;align-items:center;gap:10px;}
  .mock__toolbar-right{display:flex;gap:8px;}
  .mock__toolbar-title{font-size:13px;font-weight:700;color:#2B2B2B;letter-spacing:-0.01em;}
  .mock__toolbar-badge{font-size:9px;font-weight:700;color:#2B2B2B;background:rgba(43,43,43,0.08);border:1px solid rgba(43,43,43,0.16);padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .mock__toolbar-btn{font-size:11px;font-weight:600;color:#A8A8A8;background:#E8E8E8;border:1px solid rgba(43,43,43,0.06);padding:4px 10px;border-radius:6px;cursor:pointer;transition:all 0.18s;}
  .mock__toolbar-btn:hover{color:#898989;background:#DEDEDE;}
  .mock__grid-head,.mock__row{display:grid;grid-template-columns:52px repeat(5,1fr);gap:4px;padding:0 16px;margin-bottom:4px;}
  .mock__grid-head{margin-top:12px;}
  .mock__head-cell{font-size:10px;font-weight:700;color:#C4C4C4;text-align:center;padding:6px 2px;text-transform:uppercase;letter-spacing:0.06em;}
  .mock__time{font-size:10px;color:#C4C4C4;display:flex;align-items:center;justify-content:center;font-weight:600;}
  .mock__cell{height:42px;border-radius:7px;border:1px solid rgba(43,43,43,0.06);background:#ECECEC;display:flex;align-items:center;justify-content:center;transition:all 0.18s;}
  .mock__cell:hover{transform:scale(1.04);z-index:2;box-shadow:0 4px 14px rgba(43,43,43,0.10);}
  .mock__cell span{font-size:10px;font-weight:700;letter-spacing:-0.01em;padding:0 6px;text-align:center;line-height:1.3;}
  .mock__status{display:flex;align-items:center;gap:10px;padding:14px 20px;border-top:1px solid rgba(43,43,43,0.06);flex-wrap:wrap;margin-top:4px;}
  .mock__status-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;color:#A8A8A8;background:#ECECEC;border:1px solid rgba(43,43,43,0.06);padding:4px 10px;border-radius:20px;}
  .mock__status-badge--green{color:#2B2B2B;background:rgba(43,43,43,0.06);border-color:rgba(43,43,43,0.14);}

  /* Float cards */
  @keyframes floatCard{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  .float-card{position:absolute;display:flex;align-items:center;gap:11px;background:rgba(248,248,248,0.92);backdrop-filter:blur(16px);border:1px solid rgba(43,43,43,0.10);border-radius:11px;padding:12px 16px;box-shadow:0 8px 28px rgba(43,43,43,0.14);}
  .float-card--left{top:18%;left:-55px;animation:floatCard 5s ease-in-out infinite;}
  .float-card--right{bottom:18%;right:-50px;animation:floatCard 5s ease-in-out 2.5s infinite;}
  .float-card__icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .float-card__icon--green{background:rgba(43,43,43,0.08);border:1px solid rgba(43,43,43,0.18);color:#2B2B2B;}
  .float-card__icon--purple{background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.16);color:#5C5C5C;}
  .float-card__title{font-size:11px;font-weight:700;color:#2B2B2B;}
  .float-card__sub{font-size:10px;color:#A8A8A8;font-weight:500;}

  /* Feature strip */
  .feature-strip{position:relative;z-index:1;padding:40px 24px;border-top:1px solid rgba(43,43,43,0.06);border-bottom:1px solid rgba(43,43,43,0.06);background:rgba(43,43,43,0.015);}
  .feature-strip__inner{max-width:900px;margin:0 auto;display:flex;justify-content:center;gap:clamp(24px,5vw,64px);flex-wrap:wrap;}
  .feature-strip__item{display:flex;align-items:center;gap:8px;cursor:default;transition:color 0.2s;}
  .feature-strip__item:hover .feature-strip__icon{color:#5C5C5C;}
  .feature-strip__item:hover .feature-strip__label{color:#898989;}
  .feature-strip__icon{color:#A8A8A8;transition:color 0.2s;display:flex;align-items:center;}
  .feature-strip__label{font-size:13px;font-weight:600;color:#C4C4C4;letter-spacing:0.02em;transition:color 0.2s;}

  /* ══════════════════════════════════════
     ANALYTICS SHOWCASE
  ══════════════════════════════════════ */
  .showcase{
    position:relative;z-index:1;
    padding:120px 24px;
    border-top:1px solid rgba(43,43,43,0.06);
    overflow:hidden;
  }
  .showcase__inner{
    max-width:1200px;margin:0 auto;
    display:grid;
    grid-template-columns:1fr 1.4fr;
    gap:80px;
    align-items:center;
  }
  @media(max-width:960px){
    .showcase__inner{grid-template-columns:1fr;gap:56px;}
    .showcase{padding:80px 24px;}
  }

  /* Copy column */
  .showcase__copy{
    display:flex;flex-direction:column;gap:0;
    opacity:0;transform:translateX(-24px);
    transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .showcase__copy--in{opacity:1;transform:translateX(0);}

  .showcase__title{
    font-size:clamp(28px,3.6vw,46px);
    font-weight:900;letter-spacing:-0.04em;line-height:1.06;
    color:#2B2B2B;margin-bottom:18px;margin-top:14px;
  }
  .showcase__title-dim{color:#C4C4C4;}

  .showcase__desc{
    font-size:15px;color:#898989;line-height:1.78;
    margin-bottom:32px;font-weight:400;
  }

  /* Benefit list */
  .showcase__benefits{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:36px;}
  .showcase__benefit{
    display:flex;align-items:center;gap:12px;
    opacity:0;transform:translateX(-16px);
    transition:opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1);
  }
  .showcase__benefit--in{opacity:1;transform:translateX(0);}
  .showcase__benefit-icon{
    width:30px;height:30px;border-radius:8px;flex-shrink:0;
    background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);
    display:flex;align-items:center;justify-content:center;color:#5C5C5C;
    transition:all 0.22s;
  }
  .showcase__benefit:hover .showcase__benefit-icon{background:rgba(43,43,43,0.12);transform:scale(1.08);}
  .showcase__benefit-text{font-size:14px;font-weight:500;color:#898989;transition:color 0.22s;}
  .showcase__benefit:hover .showcase__benefit-text{color:#2B2B2B;}

  /* CTA */
  .showcase__cta{
    display:inline-flex;align-items:center;gap:8px;
    font-size:14px;font-weight:600;color:#fff;
    background:linear-gradient(135deg,#2B2B2B 0%,#454545 100%);
    text-decoration:none;padding:12px 22px;border-radius:10px;
    border:1px solid rgba(43,43,43,0.4);
    box-shadow:0 4px 18px rgba(43,43,43,0.22),inset 0 1px 0 rgba(255,255,255,0.12);
    transition:all 0.22s;width:fit-content;
  }
  .showcase__cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(43,43,43,0.30),inset 0 1px 0 rgba(255,255,255,0.16);}

  /* Visual column */
  .showcase__visual{
    position:relative;
    opacity:0;transform:translateX(28px);
    transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s,transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s;
  }
  .showcase__visual--in{opacity:1;transform:translateX(0);}

  /* Glow */
  .showcase__glow{
    position:absolute;inset:-60px;
    background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(43,43,43,0.08) 0%,transparent 65%);
    filter:blur(50px);z-index:0;pointer-events:none;
  }

  /* Frame */
  .showcase__frame{
    position:relative;z-index:1;
    border-radius:18px;overflow:hidden;
    border:1px solid rgba(43,43,43,0.12);
    box-shadow:
      0 0 0 1px rgba(43,43,43,0.06),
      0 40px 100px rgba(43,43,43,0.12),
      0 0 80px rgba(43,43,43,0.05);
    transition:transform 0.6s cubic-bezier(0.16,1,0.3,1),box-shadow 0.6s cubic-bezier(0.16,1,0.3,1);
    transform:perspective(1200px) rotateY(-2deg) rotateX(1deg);
    will-change:transform;
  }
  .showcase__visual:hover .showcase__frame{
    box-shadow:
      0 0 0 1px rgba(43,43,43,0.16),
      0 56px 120px rgba(43,43,43,0.16),
      0 0 100px rgba(43,43,43,0.08);
    transform:perspective(1200px) rotateY(-1deg) rotateX(0.5deg) translateY(-4px);
  }

  /* Chrome bar */
  .showcase__chrome{
    display:flex;align-items:center;gap:12px;
    padding:12px 18px;background:#F1F1F1;
    border-bottom:1px solid rgba(43,43,43,0.07);
  }
  .showcase__chrome-dots{display:flex;gap:6px;}
  .showcase__chrome-dot{width:11px;height:11px;border-radius:50%;}
  .showcase__chrome-dot--r{background:#A0A0A0;opacity:0.7;}
  .showcase__chrome-dot--y{background:#898989;opacity:0.7;}
  .showcase__chrome-dot--g{background:#2B2B2B;opacity:0.6;}
  .showcase__chrome-url{
    flex:1;font-size:11px;color:#C4C4C4;background:#ECECEC;
    padding:5px 14px;border-radius:7px;text-align:center;
    max-width:240px;margin:0 auto;font-weight:500;
    border:1px solid rgba(43,43,43,0.06);
  }
  .showcase__chrome-badges{display:flex;gap:6px;margin-left:auto;}
  .showcase__chrome-badge{
    font-size:9px;font-weight:700;color:#2B2B2B;
    background:rgba(43,43,43,0.08);border:1px solid rgba(43,43,43,0.16);
    padding:3px 8px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;
  }

  /* Image */
  .showcase__img-wrap{position:relative;background:#F1F1F1;min-height:360px;display:block;}
  .showcase__img{width:100%;height:auto;display:block;object-fit:cover;}

  /* Bottom fade for depth */
  .showcase__frame-fade{
    position:absolute;bottom:0;left:0;right:0;height:80px;
    background:linear-gradient(to top,rgba(248,248,248,0.7) 0%,transparent 100%);
    pointer-events:none;z-index:2;
  }

  /* Placeholder (shown when image not yet provided) */
  .showcase__placeholder{
    width:100%;min-height:420px;background:#F1F1F1;
    display:flex;align-items:center;justify-content:center;
  }
  .showcase__placeholder-inner{
    width:100%;padding:24px;display:flex;flex-direction:column;gap:18px;
  }
  .showcase__mini-header{}
  .showcase__mini-title{font-size:17px;font-weight:800;color:#2B2B2B;letter-spacing:-0.02em;margin-bottom:4px;}
  .showcase__mini-sub{font-size:12px;color:#A8A8A8;}
  .showcase__mini-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
  .showcase__mini-metric{background:#ECECEC;border:1px solid rgba(43,43,43,0.07);border-radius:10px;padding:12px 14px;}
  .showcase__mini-metric-label{font-size:9px;color:#A8A8A8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;}
  .showcase__mini-metric-value{font-size:22px;font-weight:800;letter-spacing:-0.03em;line-height:1;}
  .showcase__mini-health{display:flex;align-items:center;gap:18px;background:#ECECEC;border:1px solid rgba(43,43,43,0.07);border-radius:12px;padding:16px 20px;}
  .showcase__mini-health-ring{position:relative;display:flex;align-items:center;justify-content:center;}
  .showcase__mini-health-score{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .showcase__mini-chart{background:#ECECEC;border:1px solid rgba(43,43,43,0.07);border-radius:12px;padding:16px 20px;}
  .showcase__mini-chart-label{font-size:10px;font-weight:700;color:#A8A8A8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;}
  .showcase__mini-bars{display:flex;align-items:flex-end;gap:4px;height:56px;}
  .showcase__mini-bar{flex:1;border-radius:3px 3px 0 0;min-height:6px;}
  .showcase__placeholder-hint{font-size:11px;color:#C4C4C4;text-align:center;font-style:italic;padding:4px 0;}

  /* Floating pills on visual */
  @keyframes showcaseFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .showcase__float{position:absolute;z-index:10;}
  .showcase__float--tl{top:-16px;left:-16px;animation:showcaseFloat 5s ease-in-out infinite;}
  .showcase__float--br{bottom:-16px;right:-12px;animation:showcaseFloat 5s ease-in-out 2.5s infinite;}
  @media(max-width:600px){.showcase__float{display:none;}}
  .showcase__float-card{
    display:flex;align-items:center;gap:10px;
    background:rgba(248,248,248,0.94);backdrop-filter:blur(18px);
    border:1px solid rgba(43,43,43,0.12);border-radius:10px;
    padding:10px 14px;box-shadow:0 8px 28px rgba(43,43,43,0.14);
    white-space:nowrap;
  }
  .showcase__float-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .showcase__float-title{font-size:10px;color:#A8A8A8;font-weight:600;margin-bottom:1px;}
  .showcase__float-val{font-size:12px;font-weight:700;}

  /* Logos */
  .logos{position:relative;z-index:1;padding:52px 24px;border-top:1px solid rgba(43,43,43,0.06);border-bottom:1px solid rgba(43,43,43,0.06);overflow:hidden;}
  .logos__label{text-align:center;font-size:10px;font-weight:700;color:#C4C4C4;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:26px;}
  .logos__wrap{position:relative;mask-image:linear-gradient(90deg,transparent 0%,black 14%,black 86%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,black 14%,black 86%,transparent 100%);}
  @keyframes scrollLogos{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
  .logos__track{display:flex;gap:52px;animation:scrollLogos 26s linear infinite;width:max-content;}
  .logos:hover .logos__track{animation-play-state:paused;}
  .logos__item{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;color:#C4C4C4;white-space:nowrap;padding:6px 14px;border-radius:7px;transition:all 0.2s;cursor:default;}
  .logos__item:hover{color:#898989;background:rgba(43,43,43,0.03);}
  .logos__dot{width:5px;height:5px;border-radius:50%;background:#2B2B2B;opacity:0.4;}

  /* Stats */
  .stats{position:relative;z-index:1;padding:80px 24px;}
  .stats__inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.06);border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(43,43,43,0.08);}
  @media(max-width:640px){.stats__inner{grid-template-columns:repeat(2,1fr);}}
  .stat-card{padding:42px 28px;background:#F1F1F1;text-align:center;transition:background 0.22s,transform 0.22s;position:relative;overflow:hidden;}
  .stat-card:hover{background:#ECECEC;transform:translateY(-2px);}
  .stat-card__value{font-size:42px;font-weight:900;letter-spacing:-0.045em;margin-bottom:7px;background:linear-gradient(135deg,#2B2B2B 0%,#5C5C5C 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;}
  .stat-card__label{font-size:12px;color:#A8A8A8;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;}

  /* Section commons */
  .section-wrap{max-width:1100px;margin:0 auto;padding:0 24px;}
  .section-head{text-align:center;margin-bottom:64px;}
  .eyebrow{display:inline-flex;align-items:center;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.14em;color:#5C5C5C;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);padding:5px 14px;border-radius:24px;margin-bottom:20px;}
  .eyebrow--center{display:block;text-align:center;width:fit-content;margin:0 auto 20px;}
  .section-title{font-size:clamp(32px,4.5vw,50px);font-weight:900;letter-spacing:-0.04em;line-height:1.06;color:#2B2B2B;margin-bottom:18px;}
  .section-title-muted{color:#C4C4C4;}
  .section-sub{font-size:16px;color:#898989;line-height:1.7;max-width:580px;margin:0 auto;}

  /* Features */
  .features{position:relative;z-index:1;padding:120px 0;}
  .features__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.06);border-radius:20px;overflow:hidden;}
  @media(max-width:900px){.features__grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:540px){.features__grid{grid-template-columns:1fr;}}
  .feat-card{padding:34px 30px;background:#F1F1F1;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);opacity:0;transform:translateY(18px);position:relative;overflow:hidden;}
  .feat-card--in{opacity:1;transform:translateY(0);}
  .feat-card:hover{background:#ECECEC;transform:translateY(-4px);z-index:2;}
  .feat-card__glow{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#5C5C5C,transparent);opacity:0;transition:opacity 0.22s;}
  .feat-card:hover .feat-card__glow{opacity:0.5;}
  .feat-card__icon{width:38px;height:38px;border-radius:10px;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);display:flex;align-items:center;justify-content:center;color:#5C5C5C;margin-bottom:16px;transition:all 0.22s;}
  .feat-card:hover .feat-card__icon{background:rgba(43,43,43,0.12);transform:scale(1.06);}
  .feat-card__badge{display:inline-block;font-size:10px;font-weight:700;color:#5C5C5C;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);padding:3px 9px;border-radius:20px;margin-bottom:10px;letter-spacing:0.04em;}
  .feat-card__title{font-size:15px;font-weight:800;color:#2B2B2B;letter-spacing:-0.02em;margin-bottom:9px;}
  .feat-card__desc{font-size:13px;color:#898989;line-height:1.7;}

  /* How */
  .how{position:relative;z-index:1;padding:120px 0;border-top:1px solid rgba(43,43,43,0.06);}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;}
  @media(max-width:768px){.steps{grid-template-columns:1fr;gap:32px;}}
  .step{opacity:0;transform:translateY(28px);transition:all 0.7s cubic-bezier(0.16,1,0.3,1);}
  .step--in{opacity:1;transform:translateY(0);}
  .step__num{font-size:52px;font-weight:900;letter-spacing:-0.05em;color:#E8E8E8;line-height:1;margin-bottom:18px;font-variant-numeric:tabular-nums;transition:color 0.22s;}
  .step:hover .step__num{color:#2B2B2B;opacity:0.35;}
  .step__title{font-size:17px;font-weight:800;color:#2B2B2B;letter-spacing:-0.02em;margin-bottom:10px;}
  .step__desc{font-size:14px;color:#898989;line-height:1.7;}

  /* Testimonials */
  .testimonials{position:relative;z-index:1;padding:120px 0;border-top:1px solid rgba(43,43,43,0.06);}
  .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  @media(max-width:768px){.testi-grid{grid-template-columns:1fr;}}
  .testi{background:#F1F1F1;border:1px solid rgba(43,43,43,0.08);border-radius:16px;padding:30px;cursor:pointer;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden;}
  .testi:hover{background:#ECECEC;transform:translateY(-4px);box-shadow:0 16px 48px rgba(43,43,43,0.10);}
  .testi--active{background:#ECECEC;border-color:rgba(43,43,43,0.18);}
  .testi__glow{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#5C5C5C,transparent);opacity:0;transition:opacity 0.22s;}
  .testi--active .testi__glow{opacity:0.6;}
  .testi__stars{font-size:13px;color:#898989;letter-spacing:2px;margin-bottom:14px;opacity:0.85;}
  .testi__quote{font-size:14px;color:#898989;line-height:1.8;margin-bottom:22px;font-style:italic;}
  .testi__author{display:flex;gap:12px;align-items:center;}
  .testi__avatar{width:38px;height:38px;border-radius:50%;background:rgba(43,43,43,0.06);border:1px solid rgba(43,43,43,0.14);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#5C5C5C;flex-shrink:0;}
  .testi__name{font-size:13px;font-weight:800;color:#2B2B2B;}
  .testi__role{font-size:12px;color:#A8A8A8;margin-top:2px;}
  .testi__inst{font-size:11px;color:#C4C4C4;margin-top:1px;}
  .testi-dots{display:flex;gap:8px;justify-content:center;margin-top:36px;}
  @keyframes pulseDot2{0%,100%{box-shadow:0 0 8px rgba(92,92,92,0.3)}50%{box-shadow:0 0 16px rgba(92,92,92,0.55)}}
  .dot{width:7px;height:7px;border-radius:50%;background:#E8E8E8;border:none;cursor:pointer;transition:all 0.22s;padding:0;}
  .dot:hover{background:#C4C4C4;transform:scale(1.2);}
  .dot--active{background:#5C5C5C;transform:scale(1.3);animation:pulseDot2 2s ease-in-out infinite;}

  /* CTA */
  .cta{position:relative;z-index:1;padding:130px 24px;text-align:center;border-top:1px solid rgba(43,43,43,0.06);overflow:hidden;}
  .cta__inner{position:relative;max-width:700px;margin:0 auto;}
  @keyframes glowPulse{0%,100%{opacity:0.8;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}
  .cta__glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(43,43,43,0.06) 0%,transparent 70%);pointer-events:none;z-index:-1;animation:glowPulse 4s ease-in-out infinite;}
  .cta__title{font-size:clamp(34px,5vw,54px);font-weight:900;letter-spacing:-0.04em;line-height:1.06;color:#2B2B2B;margin-bottom:18px;}
  .cta__sub{font-size:16px;color:#898989;line-height:1.7;max-width:540px;margin:0 auto 44px;}
  .cta__actions{display:flex;flex-direction:column;align-items:center;gap:22px;}
  .cta__checks{display:flex;gap:22px;flex-wrap:wrap;justify-content:center;}
  .cta__check{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:#A8A8A8;font-weight:500;}
  .cta__check svg{color:#2B2B2B;}

  /* Responsive */
  @media(max-width:600px){
    .hero{padding:100px 16px 60px;}
    .float-card--left,.float-card--right{display:none;}
    .cta{padding:80px 16px;}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
  }
`;

export default Home;
