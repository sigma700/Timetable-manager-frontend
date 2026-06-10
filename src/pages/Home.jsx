import React, {useEffect, useRef, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {useAuthStore} from "../store/authStore";
import {Navigation} from "./components/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Logo: () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M10 18L15.5 12L21.5 18L28.5 9.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28.5" cy="26.5" r="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8h9M9 4.5l3.5 3.5L9 11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10 2.5L3.5 10.5h6l-1.5 5 6.5-8h-6L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5L2.5 4.5v6c0 3.5 2.8 6.2 6.5 7 3.7-.8 6.5-3.5 6.5-7v-6L9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 9l2.5 2.5L13 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Layers: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 11.5l7 3.5 7-3.5M2 8l7 3.5L16 8M9 1.5L2 5l7 3.5L16 5 9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 5.5v4l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 15.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 5c1.7.4 3 2 3 3.5M16.5 15.5c0-2.2-1.2-4.2-3-5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Chart: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 13.5l4-5 3.5 3L14 6l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 16.5h15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M3.5 6.5h15M3.5 11h15M3.5 15.5h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  X: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M5.5 5.5l11 11M16.5 5.5l-11 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2.5l9 5.5-9 5.5V2.5z" fill="currentColor" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1v3M8 12v3M1 8h3M12 8h3M3.05 3.05l2.12 2.12M10.83 10.83l2.12 2.12M3.05 12.95l2.12-2.12M10.83 5.17l2.12-2.12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="3"
        y="7"
        width="10"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 7V5a3 3 0 016 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 8h13M8 1.5c2 2 2.5 4 2.5 6.5S10 12.5 8 14.5M8 1.5C6 3.5 5.5 5.5 5.5 8S6 12.5 8 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
};

// ─── Data (stats, features, testimonials, trustLogos) unchanged ─────────────
const stats = [
  {value: "94%", label: "Conflict reduction"},
  {value: "3x", label: "Faster generation"},
  {value: "500+", label: "Institutions served"},
  {value: "40h", label: "Saved per semester"},
];

const features = [
  {
    icon: Icons.Zap,
    title: "Automated generation",
    desc: "Feed in constraints once. Get a fully optimized timetable in minutes — not weeks.",
    highlight: "2.3s avg generation",
  },
  {
    icon: Icons.Shield,
    title: "Zero conflicts",
    desc: "Our constraint engine resolves teacher, room, and class clashes before they reach you.",
    highlight: "100% clash-free",
  },
  {
    icon: Icons.Layers,
    title: "Multi-institution scale",
    desc: "Designed for primary schools through universities. One platform, any scale.",
    highlight: "Unlimited campuses",
  },
  {
    icon: Icons.Clock,
    title: "Real-time updates",
    desc: "Push last-minute changes instantly. Every stakeholder stays in sync.",
    highlight: "Instant sync",
  },
  {
    icon: Icons.Users,
    title: "Team collaboration",
    desc: "Admins, department heads, and teachers all work from a single source of truth.",
    highlight: "Role-based access",
  },
  {
    icon: Icons.Chart,
    title: "Operational insights",
    desc: "Track utilization, identify bottlenecks, and plan ahead with built-in analytics.",
    highlight: "Live dashboards",
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

// ─── Timetable Preview (unchanged) ──────────────────────────────────────────
const TimetablePreview = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const periods = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];

  const cells = {
    "0-0": {
      label: "Math 101",
      color: "#8b5cf6",
      light: "rgba(139,92,246,0.12)",
    },
    "0-2": {label: "Physics", color: "#06b6d4", light: "rgba(6,182,212,0.12)"},
    "0-4": {label: "English", color: "#10b981", light: "rgba(16,185,129,0.12)"},
    "1-1": {
      label: "Chemistry",
      color: "#f59e0b",
      light: "rgba(245,158,11,0.12)",
    },
    "1-3": {
      label: "Math 101",
      color: "#8b5cf6",
      light: "rgba(139,92,246,0.12)",
    },
    "2-0": {label: "Biology", color: "#ef4444", light: "rgba(239,68,68,0.12)"},
    "2-2": {label: "Physics", color: "#06b6d4", light: "rgba(6,182,212,0.12)"},
    "2-4": {label: "History", color: "#8b5cf6", light: "rgba(139,92,246,0.12)"},
    "3-1": {label: "English", color: "#10b981", light: "rgba(16,185,129,0.12)"},
    "3-3": {
      label: "Chemistry",
      color: "#f59e0b",
      light: "rgba(245,158,11,0.12)",
    },
    "4-0": {
      label: "Math 101",
      color: "#8b5cf6",
      light: "rgba(139,92,246,0.12)",
    },
    "4-2": {label: "History", color: "#8b5cf6", light: "rgba(139,92,246,0.12)"},
    "4-4": {label: "Biology", color: "#ef4444", light: "rgba(239,68,68,0.12)"},
  };

  return (
    <div className="tt-preview">
      <div className="tt-preview__toolbar">
        <div className="tt-preview__toolbar-left">
          <span className="tt-preview__toolbar-title">
            Spring Semester 2026
          </span>
          <span className="tt-preview__toolbar-badge">Published</span>
        </div>
        <div className="tt-preview__toolbar-right">
          <span className="tt-preview__toolbar-action">Export</span>
          <span className="tt-preview__toolbar-action">Share</span>
        </div>
      </div>
      <div className="tt-preview__header">
        <div className="tt-preview__header-cell tt-preview__time-col" />
        {days.map((d) => (
          <div key={d} className="tt-preview__header-cell">
            {d}
          </div>
        ))}
      </div>
      {periods.map((period, pi) => (
        <div key={period} className="tt-preview__row">
          <div className="tt-preview__time">{period}</div>
          {days.map((_, di) => {
            const cell = cells[`${di}-${pi}`];
            return (
              <div
                key={di}
                className={`tt-preview__cell ${cell ? "tt-preview__cell--filled" : ""}`}
                style={
                  cell
                    ? {background: cell.light, borderColor: cell.color + "30"}
                    : {}
                }
              >
                {cell && <span style={{color: cell.color}}>{cell.label}</span>}
              </div>
            );
          })}
        </div>
      ))}
      <div className="tt-preview__status">
        <span className="tt-preview__badge tt-preview__badge--green">
          <Icons.Check /> 0 conflicts detected
        </span>
        <span className="tt-preview__badge">
          <Icons.Sparkle /> Generated in 2.3s
        </span>
        <span className="tt-preview__badge">
          <Icons.Users /> 47 teachers assigned
        </span>
      </div>
    </div>
  );
};

// ─── Scroll Reveal Hook ──────────────────────────────────────────────────────
const useScrollReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {threshold: 0.1, rootMargin: "0px 0px -50px 0px"},
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({value, label, delay}) => {
  const [ref, isVisible] = useScrollReveal();
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isVisible) return;
    const numericPart = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffixStr = value.match(/[^0-9]*$/)?.[0] || "";

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numericPart);
      setDisplayValue(prefix + current + suffixStr);
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="hp-stat">
      <div className="hp-stat__value">{displayValue}</div>
      <div className="hp-stat__label">{label}</div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const Home = () => {
  const {user, isLoading: authLoading, logout} = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const heroRef = useRef(null);

  // Get user data for Navigation component
  const userName = user?.fullName || "Margaret Wanjiku";
  const institutionName = user?.institution || "St. Mary's Academy";
  const notificationCount = user?.unreadNotifications ?? 3;

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        // Optionally reset store state (you may need a logout action in store)
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  // Show loading while auth is initializing (optional)
  if (authLoading) {
    return (
      <div
        style={{
          background: "#030305",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="hp-loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <Helmet>
        <title>Protiba — Academic Scheduling, Automated</title>
        <meta
          name="description"
          content="Protiba automates school timetable generation for institutions of any size. Zero conflicts, instant updates, built for educators."
        />
      </Helmet>

      {/* ── Integrated Navigation (replaces original hp-nav) ── */}
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      {/* Main content – add top padding to account for fixed header (approx 68px) */}
      <div className="hp-root" style={{paddingTop: "68px"}}>
        {/* ── Ambient background ── */}
        <div className="hp-ambient" aria-hidden="true">
          <div
            className="hp-ambient__cursor-light"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              opacity: heroRef.current ? 0.4 : 0,
            }}
          />
          <div className="hp-ambient__orb hp-ambient__orb--1" />
          <div className="hp-ambient__orb hp-ambient__orb--2" />
          <div className="hp-ambient__orb hp-ambient__orb--3" />
          <div className="hp-ambient__orb hp-ambient__orb--4" />
          <div className="hp-ambient__grid" />
          <div className="hp-ambient__grain" />
        </div>

        {/* ── Hero (unchanged except removed original nav) ── */}
        <section
          className="hp-hero"
          ref={heroRef}
          onMouseMove={handleMouseMove}
        >
          <div className="hp-hero__inner">
            <div className="hp-badge hp-anim hp-anim--1">
              <span className="hp-badge__dot" />
              <span>Now serving 500+ institutions across East Africa</span>
              <Icons.ArrowUpRight />
            </div>

            <h1 className="hp-hero__title hp-anim hp-anim--2">
              Academic scheduling,
              <br />
              <span className="hp-hero__title-accent">finally automated.</span>
            </h1>

            <p className="hp-hero__sub hp-anim hp-anim--3">
              Protiba eliminates weeks of manual timetabling. Feed in your
              constraints — teachers, rooms, classes — and receive a
              conflict-free schedule in minutes. Built for schools, colleges,
              and universities.
            </p>

            <div className="hp-hero__actions hp-anim hp-anim--4">
              <Link to="/signup" className="hp-btn-primary">
                Start for free
                <Icons.Arrow />
              </Link>
              <Link to="/login" className="hp-btn-ghost">
                <Icons.Play /> Watch demo
              </Link>
            </div>

            <div className="hp-hero__proof hp-anim hp-anim--5">
              <div className="hp-hero__avatars">
                {["MW", "DO", "AS", "FK", "RN"].map((initials, i) => (
                  <div
                    key={initials}
                    className="hp-hero__avatar"
                    style={{zIndex: 5 - i, marginLeft: i === 0 ? 0 : -10}}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="hp-hero__proof-text">
                Trusted by <strong>500+ administrators</strong> this semester
              </p>
            </div>

            <div className="hp-hero__trust hp-anim hp-anim--5">
              <span className="hp-hero__trust-item">
                <Icons.Lock /> SOC 2 Compliant
              </span>
              <span className="hp-hero__trust-divider" />
              <span className="hp-hero__trust-item">
                <Icons.Globe /> 99.9% Uptime
              </span>
              <span className="hp-hero__trust-divider" />
              <span className="hp-hero__trust-item">
                <Icons.Shield /> GDPR Ready
              </span>
            </div>

            <div className="hp-hero__preview hp-anim hp-anim--6">
              <div className="hp-hero__preview-chrome">
                <div className="hp-chrome__bar">
                  <div className="hp-chrome__dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="hp-chrome__address">
                    protiba.app / timetable
                  </div>
                  <div className="hp-chrome__actions">
                    <span className="hp-chrome__pill">Live</span>
                    <span className="hp-chrome__pill hp-chrome__pill--purple">
                      Pro
                    </span>
                  </div>
                </div>
                <TimetablePreview />
              </div>
              <div className="hp-hero__float hp-hero__float--1">
                <div className="hp-float-card">
                  <div className="hp-float-card__icon">
                    <Icons.Check />
                  </div>
                  <div className="hp-float-card__text">
                    <div className="hp-float-card__title">Auto-resolved</div>
                    <div className="hp-float-card__sub">3 room conflicts</div>
                  </div>
                </div>
              </div>
              <div className="hp-hero__float hp-hero__float--2">
                <div className="hp-float-card">
                  <div className="hp-float-card__icon hp-float-card__icon--purple">
                    <Icons.Zap />
                  </div>
                  <div className="hp-float-card__text">
                    <div className="hp-float-card__title">Optimized</div>
                    <div className="hp-float-card__sub">
                      97% room utilization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust logos ── */}
        <section className="hp-logos">
          <p className="hp-logos__label">Trusted by leading institutions</p>
          <div className="hp-logos__track-wrapper">
            <div className="hp-logos__track">
              {[...trustLogos, ...trustLogos, ...trustLogos].map((name, i) => (
                <div key={i} className="hp-logos__item">
                  <div className="hp-logos__item-inner">
                    <span className="hp-logos__item-dot" />
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="hp-stats">
          <div className="hp-stats__inner">
            {stats.map((s, i) => (
              <AnimatedCounter
                key={s.label}
                value={s.value}
                label={s.label}
                delay={i * 200}
              />
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="hp-features" id="features">
          <div className="hp-section">
            <div className="hp-section__header">
              <div className="hp-eyebrow">Platform capabilities</div>
              <h2 className="hp-section__title">
                Everything your institution needs.
                <br />
                <span className="hp-section__title-muted">
                  Nothing it doesn't.
                </span>
              </h2>
              <p className="hp-section__sub">
                Protiba is built around the real operational complexity of
                academic institutions — from small schools to multi-campus
                universities.
              </p>
            </div>

            <div className="hp-features__grid">
              {features.map((feat, i) => {
                const [ref, isVisible] = useScrollReveal();
                return (
                  <div
                    key={feat.title}
                    ref={ref}
                    className={`hp-feature-card ${isVisible ? "hp-feature-card--visible" : ""}`}
                    style={{transitionDelay: `${i * 0.08}s`}}
                  >
                    <div className="hp-feature-card__glow" />
                    <div className="hp-feature-card__icon">
                      <feat.icon />
                    </div>
                    <div className="hp-feature-card__highlight">
                      {feat.highlight}
                    </div>
                    <h3 className="hp-feature-card__title">{feat.title}</h3>
                    <p className="hp-feature-card__desc">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="hp-how" id="how-it-works">
          <div className="hp-section">
            <div className="hp-section__header">
              <div className="hp-eyebrow">How it works</div>
              <h2 className="hp-section__title">
                From constraints to schedule
                <br />
                <span className="hp-section__title-muted">in three steps.</span>
              </h2>
            </div>

            <div className="hp-steps">
              {[
                {
                  n: "01",
                  title: "Configure your institution",
                  desc: "Enter your teachers, rooms, subjects, and class groups. Set availability windows, preferences, and hard constraints.",
                },
                {
                  n: "02",
                  title: "Let the engine run",
                  desc: "Our constraint-satisfaction algorithm generates thousands of valid permutations and selects the optimal schedule automatically.",
                },
                {
                  n: "03",
                  title: "Publish and manage",
                  desc: "Review, fine-tune, and publish with one click. Push updates in real time. All stakeholders see changes instantly.",
                },
              ].map((step, i) => {
                const [ref, isVisible] = useScrollReveal();
                return (
                  <div
                    key={step.n}
                    ref={ref}
                    className={`hp-step ${isVisible ? "hp-step--visible" : ""}`}
                    style={{transitionDelay: `${i * 0.15}s`}}
                  >
                    <div className="hp-step__connector" aria-hidden="true" />
                    <div className="hp-step__num">{step.n}</div>
                    <div className="hp-step__body">
                      <h3 className="hp-step__title">{step.title}</h3>
                      <p className="hp-step__desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="hp-testimonials" id="testimonials">
          <div className="hp-section">
            <div className="hp-section__header">
              <div className="hp-eyebrow">From the field</div>
              <h2 className="hp-section__title">
                Real results from
                <br />
                <span className="hp-section__title-muted">
                  real institutions.
                </span>
              </h2>
            </div>

            <div className="hp-testimonials__grid">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`hp-testimonial ${i === activeTestimonial ? "hp-testimonial--active" : ""}`}
                  onClick={() => setActiveTestimonial(i)}
                >
                  <div className="hp-testimonial__glow" />
                  <div className="hp-testimonial__stars">★★★★★</div>
                  <p className="hp-testimonial__quote">"{t.quote}"</p>
                  <div className="hp-testimonial__author">
                    <div className="hp-testimonial__avatar">{t.initials}</div>
                    <div>
                      <div className="hp-testimonial__name">{t.name}</div>
                      <div className="hp-testimonial__role">{t.role}</div>
                      <div className="hp-testimonial__inst">
                        {t.institution}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hp-testimonials__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`hp-dot ${i === activeTestimonial ? "hp-dot--active" : ""}`}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hp-cta">
          <div className="hp-cta__inner">
            <div className="hp-cta__glow" aria-hidden="true" />
            <div className="hp-cta__glow-2" aria-hidden="true" />
            <div className="hp-eyebrow hp-eyebrow--center">
              Start today — it's free
            </div>
            <h2 className="hp-cta__title">
              Your institution deserves
              <br />a better way to schedule.
            </h2>
            <p className="hp-cta__sub">
              Join 500+ schools and universities that have reclaimed weeks of
              administrative time every semester.
            </p>
            <div className="hp-cta__actions">
              <Link to="/signup" className="hp-btn-primary hp-btn-primary--lg">
                Create your free account
                <Icons.Arrow />
              </Link>
              <div className="hp-cta__checks">
                {[
                  "No credit card required",
                  "Setup in under 10 minutes",
                  "Cancel anytime",
                ].map((c) => (
                  <span key={c} className="hp-cta__check">
                    <Icons.Check /> {c}
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

// ─── CSS (unchanged from original, but note: `.hp-root` now has padding-top inline)
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700;800;900&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  :root {
    --bg: #030305;
    --bg-elevated: #08080c;
    --surface: #0c0c14;
    --surface-2: #11111a;
    --surface-3: #161622;
    --surface-4: #1c1c2e;
    --border: rgba(255,255,255,0.04);
    --border-2: rgba(255,255,255,0.08);
    --border-3: rgba(255,255,255,0.12);
    --text: #f8f8fc;
    --text-2: #9ca3af;
    --text-3: #6b7280;
    --text-4: #4b5563;
    --accent: #7c3aed;
    --accent-2: #6d28d9;
    --accent-light: #a78bfa;
    --accent-glow: rgba(124,58,237,0.12);
    --accent-glow-strong: rgba(124,58,237,0.25);
    --green: #10b981;
    --green-light: #34d399;
    --radius: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --t: 250ms cubic-bezier(0.4,0,0.2,1);
    --t-slow: 400ms cubic-bezier(0.16,1,0.3,1);
    --max-w: 1140px;
  }

  html { scroll-behavior: smooth; }

  .hp-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  /* ── Ambient background ── */
  .hp-ambient {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  
  .hp-ambient__cursor-light {
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 60%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: opacity 0.5s ease;
    filter: blur(40px);
  }
  
  .hp-ambient__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
  }
  .hp-ambient__orb--1 {
    width: 800px; height: 800px;
    top: -250px; left: -200px;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    animation: floatA 20s ease-in-out infinite;
  }
  .hp-ambient__orb--2 {
    width: 600px; height: 600px;
    top: 30%; right: -150px;
    background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%);
    animation: floatB 26s ease-in-out infinite;
  }
  .hp-ambient__orb--3 {
    width: 500px; height: 500px;
    bottom: 15%; left: 15%;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    animation: floatA 22s ease-in-out infinite reverse;
  }
  .hp-ambient__orb--4 {
    width: 400px; height: 400px;
    bottom: 40%; right: 20%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    animation: floatB 18s ease-in-out infinite reverse;
  }
  
  @keyframes floatA { 
    0%,100%{transform:translate(0,0)} 
    33%{transform:translate(40px,-30px)} 
    66%{transform:translate(-30px,40px)} 
  }
  @keyframes floatB { 
    0%,100%{transform:translate(0,0)} 
    50%{transform:translate(-50px,30px)} 
  }

  .hp-ambient__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 70%);
  }
  
  .hp-ambient__grain {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
    pointer-events: none;
  }

  /* ── Nav ── */
  .hp-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 24px;
    transition: background var(--t), border-color var(--t), backdrop-filter var(--t), box-shadow var(--t);
    border-bottom: 1px solid transparent;
  }
  .hp-nav--scrolled {
    background: rgba(3,3,5,0.8);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    border-bottom-color: var(--border-2);
    box-shadow: 0 4px 30px rgba(0,0,0,0.3);
  }
  .hp-nav__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    height: 68px;
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .hp-nav__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    flex-shrink: 0;
    transition: opacity var(--t);
  }
  .hp-nav__logo:hover { opacity: 0.8; }
  .hp-nav__links {
    display: flex;
    gap: 4px;
    margin-left: 16px;
    flex: 1;
  }
  .hp-nav__link {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-3);
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 10px;
    transition: color var(--t), background var(--t);
    position: relative;
  }
  .hp-nav__link:hover { 
    color: var(--text-2); 
    background: rgba(255,255,255,0.04); 
  }
  .hp-nav__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hp-nav__signin {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-3);
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 10px;
    transition: color var(--t), background var(--t);
  }
  .hp-nav__signin:hover { 
    color: var(--text-2); 
    background: rgba(255,255,255,0.04); 
  }
  .hp-nav__cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    text-decoration: none;
    padding: 8px 18px;
    border-radius: 10px;
    transition: all var(--t);
    box-shadow: 0 2px 16px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    letter-spacing: -0.01em;
    border: 1px solid rgba(124,58,237,0.3);
  }
  .hp-nav__cta:hover { 
    box-shadow: 0 4px 24px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.15); 
    transform: translateY(-1px); 
    border-color: rgba(124,58,237,0.5);
  }
  .hp-nav__cta--full { 
    width: 100%; 
    justify-content: center; 
    padding: 14px 24px; 
  }
  .hp-nav__burger {
    display: none;
    background: none;
    border: none;
    color: var(--text-3);
    cursor: pointer;
    padding: 8px;
    margin-left: auto;
    border-radius: 10px;
    transition: color var(--t), background var(--t);
  }
  .hp-nav__burger:hover { 
    color: var(--text-2); 
    background: rgba(255,255,255,0.04); 
  }
  .hp-nav__mobile {
    padding: 20px 0 24px;
    border-top: 1px solid var(--border-2);
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: slideDown 0.3s ease;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hp-nav__mobile-link {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-3);
    text-decoration: none;
    padding: 12px 4px;
    transition: color var(--t);
    border-radius: 8px;
  }
  .hp-nav__mobile-link:hover { 
    color: var(--text-2); 
    background: rgba(255,255,255,0.03);
  }
  .hp-nav__mobile-actions { 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
    margin-top: 16px; 
  }

  @media (max-width: 768px) {
    .hp-nav__links { display: none; }
    .hp-nav__actions { display: none; }
    .hp-nav__burger { display: flex; }
  }

  /* ── Animations ── */
  .hp-anim {
    opacity: 0;
    transform: translateY(30px);
    animation: revealUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .hp-anim--1 { animation-delay: 0.08s; }
  .hp-anim--2 { animation-delay: 0.18s; }
  .hp-anim--3 { animation-delay: 0.30s; }
  .hp-anim--4 { animation-delay: 0.42s; }
  .hp-anim--5 { animation-delay: 0.54s; }
  .hp-anim--6 { animation-delay: 0.70s; }
  
  @keyframes revealUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Hero ── */
  .hp-hero {
    position: relative;
    z-index: 1;
    padding: 180px 24px 100px;
    text-align: center;
    overflow: hidden;
  }
  .hp-hero__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent-light);
    background: rgba(124,58,237,0.08);
    border: 1px solid rgba(124,58,237,0.2);
    padding: 7px 16px 7px 12px;
    border-radius: 24px;
    margin-bottom: 32px;
    letter-spacing: 0.01em;
    cursor: default;
    transition: all var(--t);
    backdrop-filter: blur(10px);
  }
  .hp-badge:hover { 
    background: rgba(124,58,237,0.12); 
    border-color: rgba(124,58,237,0.4); 
    transform: translateY(-1px);
  }
  .hp-badge__dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 10px var(--accent-light), 0 0 20px rgba(167,139,250,0.3);
    animation: pulse 2.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse { 
    0%,100%{opacity:1;transform:scale(1)} 
    50%{opacity:0.5;transform:scale(0.8)} 
  }

  .hp-hero__title {
    font-size: clamp(44px, 6.5vw, 76px);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.95;
    color: var(--text);
    margin-bottom: 24px;
  }
  .hp-hero__title-accent {
    background: linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 30%, #6366f1 60%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 200%;
    animation: gradientShift 6s ease infinite;
  }
  @keyframes gradientShift {
    0%,100%{background-position:0% 50%}
    50%{background-position:100% 50%}
  }
  .hp-hero__sub {
    font-size: clamp(17px, 2.2vw, 20px);
    color: var(--text-2);
    line-height: 1.7;
    max-width: 640px;
    margin-bottom: 40px;
    font-weight: 400;
  }
  .hp-hero__actions {
    display: flex;
    gap: 14px;
    margin-bottom: 48px;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Buttons */
  .hp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    font-family: var(--font);
    color: #fff;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    text-decoration: none;
    padding: 14px 28px;
    border-radius: var(--radius);
    border: 1px solid rgba(124,58,237,0.4);
    cursor: pointer;
    transition: all var(--t);
    box-shadow: 0 4px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    letter-spacing: -0.01em;
    position: relative;
    overflow: hidden;
  }
  .hp-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity var(--t);
  }
  .hp-btn-primary:hover {
    box-shadow: 0 8px 40px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
    transform: translateY(-2px);
    border-color: rgba(124,58,237,0.6);
  }
  .hp-btn-primary:hover::before { opacity: 1; }
  .hp-btn-primary--lg {
    font-size: 16px;
    padding: 16px 32px;
  }
  .hp-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-2);
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-3);
    text-decoration: none;
    padding: 14px 28px;
    border-radius: var(--radius);
    transition: all var(--t);
    backdrop-filter: blur(10px);
  }
  .hp-btn-ghost:hover { 
    color: var(--text); 
    background: rgba(255,255,255,0.06); 
    border-color: var(--border-3); 
    transform: translateY(-2px); 
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  /* Social proof */
  .hp-hero__proof {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .hp-hero__avatars { display: flex; }
  .hp-hero__avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 100%);
    border: 2.5px solid var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent-light);
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }
  .hp-hero__proof-text {
    font-size: 14px;
    color: var(--text-4);
    font-weight: 500;
  }
  .hp-hero__proof-text strong { 
    color: var(--text-2); 
    font-weight: 600; 
  }

  /* Trust indicators */
  .hp-hero__trust {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 60px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hp-hero__trust-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-4);
    letter-spacing: 0.02em;
  }
  .hp-hero__trust-item svg {
    color: var(--green-light);
    width: 14px;
    height: 14px;
  }
  .hp-hero__trust-divider {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border-3);
  }

  /* ── Timetable preview ── */
  .hp-hero__preview {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    position: relative;
    perspective: 1200px;
  }
  .hp-hero__preview-chrome {
    background: var(--surface);
    border: 1px solid var(--border-2);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.06),
      0 32px 100px rgba(0,0,0,0.7),
      0 0 80px rgba(124,58,237,0.06);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    transform-style: preserve-3d;
  }
  .hp-hero__preview:hover .hp-hero__preview-chrome {
    transform: rotateX(2deg) rotateY(-1deg) translateY(-4px);
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.1),
      0 48px 120px rgba(0,0,0,0.8),
      0 0 100px rgba(124,58,237,0.1);
  }
  .hp-chrome__bar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
  }
  .hp-chrome__dots { display: flex; gap: 8px; }
  .hp-chrome__dots span {
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--surface-4);
  }
  .hp-chrome__dots span:first-child { background: #ef4444; opacity: 0.7; }
  .hp-chrome__dots span:nth-child(2) { background: #f59e0b; opacity: 0.7; }
  .hp-chrome__dots span:last-child { background: #10b981; opacity: 0.7; }
  .hp-chrome__address {
    flex: 1;
    font-size: 12px;
    color: var(--text-4);
    background: var(--surface-3);
    padding: 6px 16px;
    border-radius: 8px;
    text-align: center;
    max-width: 280px;
    margin: 0 auto;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 1px solid var(--border);
  }
  .hp-chrome__actions { 
    display: flex; 
    gap: 8px; 
    margin-left: auto; 
  }
  .hp-chrome__pill {
    font-size: 10px;
    font-weight: 700;
    color: var(--green);
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .hp-chrome__pill--purple {
    color: var(--accent-light);
    background: rgba(124,58,237,0.1);
    border-color: rgba(124,58,237,0.25);
  }

  /* Floating cards */
  .hp-hero__float {
    position: absolute;
    z-index: 10;
    animation: floatCard 5s ease-in-out infinite;
  }
  .hp-hero__float--1 {
    top: 15%;
    left: -60px;
    animation-delay: 0s;
  }
  .hp-hero__float--2 {
    bottom: 20%;
    right: -50px;
    animation-delay: 2.5s;
  }
  @keyframes floatCard {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-12px)}
  }
  .hp-float-card {
    background: rgba(12,12,20,0.85);
    backdrop-filter: blur(16px) saturate(1.5);
    border: 1px solid var(--border-2);
    border-radius: var(--radius);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    transition: transform var(--t), box-shadow var(--t);
  }
  .hp-float-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }
  .hp-float-card__icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    flex-shrink: 0;
  }
  .hp-float-card__icon--purple {
    background: rgba(124,58,237,0.12);
    border-color: rgba(124,58,237,0.25);
    color: var(--accent-light);
  }
  .hp-float-card__text { display: flex; flex-direction: column; }
  .hp-float-card__title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.01em;
  }
  .hp-float-card__sub {
    font-size: 11px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* Timetable table */
  .tt-preview {
    padding: 20px;
    overflow-x: auto;
  }
  .tt-preview__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .tt-preview__toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tt-preview__toolbar-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.01em;
  }
  .tt-preview__toolbar-badge {
    font-size: 10px;
    font-weight: 700;
    color: var(--green);
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    padding: 3px 8px;
    border-radius: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .tt-preview__toolbar-right {
    display: flex;
    gap: 8px;
  }
  .tt-preview__toolbar-action {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    background: var(--surface-3);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all var(--t);
  }
  .tt-preview__toolbar-action:hover {
    color: var(--text-2);
    background: var(--surface-4);
    border-color: var(--border-2);
  }
  .tt-preview__header,
  .tt-preview__row {
    display: grid;
    grid-template-columns: 56px repeat(5, 1fr);
    gap: 5px;
    margin-bottom: 5px;
  }
  .tt-preview__header-cell {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-4);
    text-align: center;
    padding: 8px 4px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .tt-preview__time {
    font-size: 11px;
    color: var(--text-4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    font-weight: 600;
  }
  .tt-preview__cell {
    height: 44px;
    border-radius: 8px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--t);
    background: var(--surface-2);
    position: relative;
    overflow: hidden;
  }
  .tt-preview__cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
    opacity: 0;
    transition: opacity var(--t);
  }
  .tt-preview__cell:hover::before { opacity: 1; }
  .tt-preview__cell:hover { 
    transform: scale(1.04); 
    z-index: 2; 
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    border-color: var(--border-3);
  }
  .tt-preview__cell--filled {
    border-width: 1.5px;
  }
  .tt-preview__cell span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: -0.01em;
    padding: 0 8px;
    text-align: center;
    line-height: 1.3;
  }
  .tt-preview__status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .tt-preview__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    background: var(--surface-3);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: 20px;
  }
  .tt-preview__badge svg {
    width: 12px;
    height: 12px;
  }
  .tt-preview__badge--green {
    color: var(--green);
    background: rgba(16,185,129,0.08);
    border-color: rgba(16,185,129,0.2);
  }

  /* ── Logos ── */
  .hp-logos {
    position: relative;
    z-index: 1;
    padding: 56px 24px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    background: linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.02) 50%, transparent 100%);
  }
  .hp-logos__label {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-4);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 28px;
  }
  .hp-logos__track-wrapper {
    position: relative;
    mask-image: linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%);
  }
  .hp-logos__track {
    display: flex;
    gap: 56px;
    animation: scrollLogos 25s linear infinite;
    width: max-content;
  }
  .hp-logos:hover .hp-logos__track { animation-play-state: paused; }
  @keyframes scrollLogos { 
    from{transform:translateX(0)} 
    to{transform:translateX(-33.333%)} 
  }
  .hp-logos__item {
    flex-shrink: 0;
    transition: opacity var(--t);
  }
  .hp-logos__item-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-4);
    white-space: nowrap;
    letter-spacing: -0.01em;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all var(--t);
  }
  .hp-logos__item:hover .hp-logos__item-inner { 
    color: var(--text-3); 
    background: rgba(255,255,255,0.03);
  }
  .hp-logos__item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.5;
  }

  /* ── Stats ── */
  .hp-stats {
    position: relative;
    z-index: 1;
    padding: 80px 24px;
  }
  .hp-stats__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  }
  @media (max-width: 640px) {
    .hp-stats__inner { grid-template-columns: repeat(2, 1fr); }
  }
  .hp-stat {
    padding: 44px 32px;
    background: var(--surface);
    text-align: center;
    transition: background var(--t), transform var(--t);
    position: relative;
    overflow: hidden;
  }
  .hp-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124,58,237,0.03) 0%, transparent 50%);
    opacity: 0;
    transition: opacity var(--t);
  }
  .hp-stat:hover { 
    background: var(--surface-2); 
    transform: translateY(-2px);
  }
  .hp-stat:hover::before { opacity: 1; }
  .hp-stat__value {
    font-size: 44px;
    font-weight: 900;
    letter-spacing: -0.04em;
    color: var(--text);
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--text) 0%, var(--accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  .hp-stat__label {
    font-size: 13px;
    color: var(--text-3);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── Sections ── */
  .hp-section {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 24px;
  }
  .hp-section__header {
    text-align: center;
    margin-bottom: 72px;
  }
  .hp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--accent-light);
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    padding: 6px 16px;
    border-radius: 24px;
    margin-bottom: 24px;
  }
  .hp-eyebrow--center { 
    display: block; 
    text-align: center; 
    width: fit-content; 
    margin: 0 auto 24px; 
  }
  .hp-section__title {
    font-size: clamp(34px, 4.5vw, 52px);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: var(--text);
    margin-bottom: 20px;
  }
  .hp-section__title-muted { 
    color: var(--text-4); 
  }
  .hp-section__sub {
    font-size: 17px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto;
    font-weight: 400;
  }

  /* ── Features ── */
  .hp-features {
    position: relative;
    z-index: 1;
    padding: 120px 0;
  }
  .hp-features__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.3);
  }
  @media (max-width: 900px) {
    .hp-features__grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .hp-features__grid { grid-template-columns: 1fr; }
  }
  .hp-feature-card {
    padding: 36px 32px;
    background: var(--surface);
    transition: all var(--t-slow);
    opacity: 0;
    transform: translateY(20px);
    position: relative;
    overflow: hidden;
  }
  .hp-feature-card--visible {
    opacity: 1;
    transform: translateY(0);
  }
  .hp-feature-card:hover { 
    background: var(--surface-2); 
    transform: translateY(-4px);
    z-index: 2;
  }
  .hp-feature-card__glow {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent-light) 50%, transparent 100%);
    opacity: 0;
    transition: opacity var(--t);
  }
  .hp-feature-card:hover .hp-feature-card__glow { opacity: 0.5; }
  .hp-feature-card__icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-light);
    margin-bottom: 20px;
    transition: all var(--t);
  }
  .hp-feature-card:hover .hp-feature-card__icon {
    background: var(--accent-glow-strong);
    border-color: rgba(124,58,237,0.4);
    transform: scale(1.05);
  }
  .hp-feature-card__highlight {
    font-size: 11px;
    font-weight: 700;
    color: var(--accent-light);
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    padding: 3px 10px;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 12px;
    letter-spacing: 0.04em;
  }
  .hp-feature-card__title {
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  .hp-feature-card__desc {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    font-weight: 400;
  }

  /* ── How it works ── */
  .hp-how {
    position: relative;
    z-index: 1;
    padding: 120px 0;
    border-top: 1px solid var(--border);
  }
  .hp-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    position: relative;
    margin-top: 16px;
  }
  @media (max-width: 768px) {
    .hp-steps { grid-template-columns: 1fr; gap: 0; }
  }
  .hp-step {
    padding: 0 48px 0 0;
    position: relative;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .hp-step--visible {
    opacity: 1;
    transform: translateY(0);
  }
  .hp-step:last-child { padding-right: 0; }
  .hp-step__connector {
    display: none;
  }
  .hp-step__num {
    font-size: 56px;
    font-weight: 900;
    letter-spacing: -0.05em;
    color: var(--surface-3);
    line-height: 1;
    margin-bottom: 20px;
    font-variant-numeric: tabular-nums;
    transition: color var(--t);
  }
  .hp-step:hover .hp-step__num {
    color: var(--accent);
    opacity: 0.3;
  }
  .hp-step__title {
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .hp-step__desc {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.7;
    font-weight: 400;
  }
  @media (max-width: 768px) {
    .hp-step {
      padding: 0 0 40px 60px;
      position: relative;
      border-left: 1px solid var(--border);
    }
    .hp-step__num {
      position: absolute;
      left: -20px;
      font-size: 32px;
      background: var(--bg);
      padding: 4px 0;
    }
  }

  /* ── Testimonials ── */
  .hp-testimonials {
    position: relative;
    z-index: 1;
    padding: 120px 0;
    border-top: 1px solid var(--border);
  }
  .hp-testimonials__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 768px) {
    .hp-testimonials__grid { grid-template-columns: 1fr; }
  }
  .hp-testimonial {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    cursor: pointer;
    transition: all var(--t-slow);
    position: relative;
    overflow: hidden;
  }
  .hp-testimonial::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    border: 1px solid transparent;
    transition: border-color var(--t);
    pointer-events: none;
  }
  .hp-testimonial:hover { 
    background: var(--surface-2); 
    transform: translateY(-4px); 
    box-shadow: 0 16px 48px rgba(0,0,0,0.5); 
  }
  .hp-testimonial--active::before { 
    border-color: rgba(124,58,237,0.3); 
  }
  .hp-testimonial--active { 
    background: var(--surface-2); 
  }
  .hp-testimonial__glow {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent-light) 50%, transparent 100%);
    opacity: 0;
    transition: opacity var(--t);
  }
  .hp-testimonial--active .hp-testimonial__glow { opacity: 0.6; }
  .hp-testimonial__stars {
    font-size: 13px;
    color: #f59e0b;
    letter-spacing: 2px;
    margin-bottom: 16px;
    opacity: 0.8;
  }
  .hp-testimonial__quote {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.8;
    margin-bottom: 24px;
    font-weight: 400;
    font-style: italic;
  }
  .hp-testimonial__author { 
    display: flex; 
    gap: 14px; 
    align-items: center; 
  }
  .hp-testimonial__avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: var(--accent-light);
    flex-shrink: 0;
    transition: all var(--t);
  }
  .hp-testimonial:hover .hp-testimonial__avatar {
    border-color: rgba(124,58,237,0.5);
    transform: scale(1.05);
  }
  .hp-testimonial__name { 
    font-size: 14px; 
    font-weight: 800; 
    color: var(--text); 
    letter-spacing: -0.01em; 
  }
  .hp-testimonial__role { 
    font-size: 13px; 
    color: var(--text-3); 
    margin-top: 2px; 
    font-weight: 500;
  }
  .hp-testimonial__inst { 
    font-size: 12px; 
    color: var(--text-4); 
    margin-top: 2px; 
    font-weight: 500;
  }
  .hp-testimonials__dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 40px;
  }
  .hp-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--surface-3);
    border: none;
    cursor: pointer;
    transition: all var(--t);
    padding: 0;
  }
  .hp-dot:hover { 
    background: var(--text-4); 
    transform: scale(1.2); 
  }
  .hp-dot--active { 
    background: var(--accent-light); 
    transform: scale(1.3); 
    box-shadow: 0 0 12px rgba(167,139,250,0.4);
  }

  /* ── CTA ── */
  .hp-cta {
    position: relative;
    z-index: 1;
    padding: 140px 24px;
    text-align: center;
    border-top: 1px solid var(--border);
    overflow: hidden;
  }
  .hp-cta__inner { 
    position: relative; 
    max-width: 720px; 
    margin: 0 auto; 
  }
  .hp-cta__glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
    animation: glowPulse 4s ease-in-out infinite;
  }
  .hp-cta__glow-2 {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 500px; height: 300px;
    background: radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
    animation: glowPulse 4s ease-in-out infinite reverse;
  }
  @keyframes glowPulse {
    0%,100%{opacity:0.8; transform:translate(-50%,-50%) scale(1)}
    50%{opacity:1; transform:translate(-50%,-50%) scale(1.1)}
  }
  .hp-cta__title {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: var(--text);
    margin-bottom: 20px;
  }
  .hp-cta__sub {
    font-size: 17px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto 48px;
    font-weight: 400;
  }
  .hp-cta__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  .hp-cta__checks {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hp-cta__check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-3);
    font-weight: 500;
  }
  .hp-cta__check svg { 
    color: var(--green); 
    width: 14px; 
    height: 14px; 
  }

  /* ── Footer ── */
  .hp-footer {
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--border);
    padding: 80px 24px 48px;
  }
  .hp-footer__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    gap: 80px;
    margin-bottom: 56px;
    flex-wrap: wrap;
  }
  .hp-footer__brand { 
    max-width: 260px; 
  }
  .hp-footer__tagline { 
    font-size: 14px; 
    color: var(--text-3); 
    margin-top: 16px; 
    line-height: 1.6; 
    font-weight: 400;
  }
  .hp-footer__social {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .hp-footer__social-link {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-3);
    text-decoration: none;
    transition: all var(--t);
  }
  .hp-footer__social-link:hover {
    color: var(--text-2);
    background: var(--surface-3);
    border-color: var(--border-2);
    transform: translateY(-2px);
  }
  .hp-footer__links { 
    display: flex; 
    gap: 80px; 
    flex: 1; 
    flex-wrap: wrap; 
  }
  .hp-footer__col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .hp-footer__col-title {
    font-size: 12px;
    font-weight: 800;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
  .hp-footer__col a {
    font-size: 14px;
    color: var(--text-3);
    text-decoration: none;
    transition: all var(--t);
    font-weight: 500;
  }
  .hp-footer__col a:hover { 
    color: var(--text-2); 
    transform: translateX(2px);
  }
  .hp-footer__bottom {
    max-width: var(--max-w);
    margin: 0 auto;
    padding-top: 28px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 13px;
    color: var(--text-4);
    font-weight: 500;
  }
  .hp-footer__bottom-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--green);
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.15);
    padding: 5px 12px;
    border-radius: 20px;
  }
  .hp-footer__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 2s ease-in-out infinite;
  }
`;

export default Home;
