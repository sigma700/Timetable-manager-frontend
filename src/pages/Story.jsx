import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 4L6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6v4l2.5 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Conflict: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3L17 15H3L10 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 9v3M10 13.5v.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="11"
        width="3"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8.5"
        y="7"
        width="3"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="3"
        width="3"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#7c3aed" />
      <path
        d="M7 14L11 10L15 14L19 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="20" r="3" fill="#a78bfa" />
    </svg>
  ),
};

// ─── useInView hook ───────────────────────────────────────────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {threshold},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
const Reveal = ({children, delay = 0, className = ""}) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const currentDate = new Date();
const currentMonth = currentDate.toLocaleString("default", {month: "long"});
const currentYear = currentDate.getFullYear();

const timelineData = [
  {
    month: "June",
    year: 2024,
    title: "The Spark",
    description:
      "After witnessing the struggles of school administrators during timetable creation season, the concept for Protiba was born. Research into the complexities of educational scheduling began.",
  },
  {
    month: "July",
    year: 2024,
    title: "Algorithm Development",
    description:
      "Dedicated to designing the core scheduling algorithm that would become the foundation. Countless hours perfecting the conflict resolution system.",
  },
  {
    month: "August",
    year: 2024,
    title: "Prototyping",
    description:
      "First interactive prototypes created, focusing on making complex scheduling intuitive and accessible for educators of all technical abilities.",
  },
  {
    month: "September",
    year: 2024,
    title: "Frontend Build",
    description:
      "React application built with a focus on performance and user experience — dashboard and timetable visualization components took shape.",
  },
  {
    month: "October",
    year: 2024,
    title: "Backend Integration",
    description:
      "API and database architecture developed to handle complex scheduling operations. User authentication and data persistence implemented.",
  },
  {
    month: "November",
    year: 2024,
    title: "Testing & Feedback",
    description:
      "Extensive testing with sample data from real schools. Feedback from educators drove crucial improvements to the algorithm.",
  },
  {
    month: currentMonth,
    year: currentYear,
    title: "Launch",
    description:
      "Final polish, performance optimization, and deployment. Getting ready to share Protiba with institutions around the world.",
  },
];

const problems = [
  "Manual timetable creation consumes weeks of administrator time each semester",
  "Scheduling conflicts cause downstream disruption for teachers and students",
  "Last-minute changes cascade into operational chaos with no fast resolution",
  "Physical and human resources are routinely underutilized",
];

const features = [
  {
    icon: Icon.Clock,
    title: "Automated Scheduling",
    description:
      "Optimal timetables generated in minutes. What used to take weeks now takes seconds.",
  },
  {
    icon: Icon.Conflict,
    title: "Conflict Resolution",
    description:
      "The engine detects and eliminates scheduling conflicts before they reach the timetable.",
  },
  {
    icon: Icon.Chart,
    title: "Resource Optimization",
    description:
      "Classrooms, teachers, and facilities are allocated for maximum institutional efficiency.",
  },
];

const credits = [
  {
    name: "Robert Kirimi",
    role: "Emotional Support & Inspiration",
    description:
      "My father, whose unwavering belief and constant encouragement made this journey possible. His support sustained me through the hardest development phases.",
    initial: "RK",
  },
  {
    name: "Zeno Rocha",
    role: "Technical Inspiration",
    description:
      "One of the Resend developers whose work and dedication to developer experience shaped many aspects of Protiba's architecture and interface.",
    initial: "ZR",
  },
  {
    name: "Early Testers",
    role: "The Real Heroes",
    description:
      "To every educator and administrator who believed in Protiba early and provided the feedback that made it genuinely useful.",
    initial: "🙏",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Story = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, {passive: true});
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="story-root">
        {/* ── Nav ── */}
        <nav className="story-nav">
          <div className="story-nav__inner">
            <Link to="/" className="story-nav__logo">
              <Icon.Logo />
              <span>Protiba</span>
            </Link>
            <Link to="/" className="story-nav__back">
              <Icon.ChevronLeft />
              Back to Home
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="story-hero">
          <div
            className="story-hero__bg"
            style={{transform: `translateY(${scrollY * 0.3}px)`}}
          />
          <div className="story-hero__inner">
            <div className="story-hero__eyebrow">
              <span className="story-hero__dot" />
              Company Story
            </div>
            <h1 className="story-hero__title">
              Built for the people
              <br />
              <span className="story-hero__title-accent">
                who keep schools running.
              </span>
            </h1>
            <p className="story-hero__subtitle">
              Protiba started with a simple observation: the administrators who
              shape education were spending weeks on paperwork that software
              should handle in seconds.
            </p>
            <div className="story-hero__stats">
              {[
                ["2024", "Founded"],
                ["7", "Months to launch"],
                ["1", "Core engineer"],
                ["∞", "Schools to help"],
              ].map(([v, l]) => (
                <div key={l} className="hero-stat">
                  <span className="hero-stat__value">{v}</span>
                  <span className="hero-stat__label">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-hero__scroll-hint">
            <span>Scroll to explore</span>
            <div className="story-hero__scroll-line" />
          </div>
        </section>

        {/* ── Problem ── */}
        <section className="story-section">
          <div className="story-container story-container--split">
            <Reveal className="story-split__text">
              <div className="section-eyebrow">The Problem</div>
              <h2 className="section-title">
                Scheduling is broken.
                <br />
                We fixed it.
              </h2>
              <p className="section-body">
                Creating school timetables has always been a tedious,
                error-prone process that takes administrators away from what
                matters — supporting teachers and students.
              </p>
              <ul className="problem-list">
                {problems.map((p, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <li className="problem-item">
                      <span className="problem-item__icon">
                        <Icon.Check />
                      </span>
                      <span>{p}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150} className="story-split__visual">
              <div className="problem-visual">
                <div className="problem-visual__card problem-visual__card--1">
                  <div className="pvc__header">
                    <span className="pvc__dot pvc__dot--red" />
                    <span className="pvc__title">Manual Schedule — Week 3</span>
                  </div>
                  <div className="pvc__grid">
                    {Array.from({length: 20}).map((_, i) => (
                      <div
                        key={i}
                        className={`pvc__cell ${[2, 5, 9, 14, 17].includes(i) ? "pvc__cell--conflict" : "pvc__cell--filled"}`}
                      />
                    ))}
                  </div>
                  <p className="pvc__label">5 conflicts detected</p>
                </div>
                <div className="problem-visual__card problem-visual__card--2">
                  <div className="pvc__header">
                    <span className="pvc__dot pvc__dot--green" />
                    <span className="pvc__title">
                      Protiba — Generated in 4s
                    </span>
                  </div>
                  <div className="pvc__grid">
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="pvc__cell pvc__cell--ok" />
                    ))}
                  </div>
                  <p className="pvc__label pvc__label--green">Zero conflicts</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Solution ── */}
        <section className="story-section story-section--tinted">
          <div className="story-container">
            <Reveal className="section-centered">
              <div className="section-eyebrow">The Solution</div>
              <h2 className="section-title">
                Intelligence built for institutions.
              </h2>
              <p className="section-body section-body--centered">
                We built a scheduling engine that understands the real-world
                constraints of schools — and eliminates the manual work
                entirely.
              </p>
            </Reveal>

            <div className="feature-grid">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="feature-card">
                    <div className="feature-card__icon">
                      <f.icon />
                    </div>
                    <h3 className="feature-card__title">{f.title}</h3>
                    <p className="feature-card__desc">{f.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="story-section">
          <div className="story-container">
            <Reveal className="section-centered" style={{marginBottom: 56}}>
              <div className="section-eyebrow">The Journey</div>
              <h2 className="section-title">
                Seven months.
                <br />
                One mission.
              </h2>
            </Reveal>

            <div className="timeline">
              <div className="timeline__line" />
              {timelineData.map((m, i) => (
                <TimelineItem key={i} milestone={m} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Credits ── */}
        <section className="story-section story-section--tinted">
          <div className="story-container">
            <Reveal className="section-centered">
              <div className="section-eyebrow">Gratitude</div>
              <h2 className="section-title">None of this happens alone.</h2>
              <p className="section-body section-body--centered">
                Protiba exists because of people who believed before there was
                anything to believe in.
              </p>
            </Reveal>

            <div className="credits-grid">
              {credits.map((c, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="credit-card">
                    <div className="credit-card__avatar">{c.initial}</div>
                    <h3 className="credit-card__name">{c.name}</h3>
                    <p className="credit-card__role">{c.role}</p>
                    <p className="credit-card__desc">{c.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="story-cta">
          <div className="story-cta__inner">
            <Reveal>
              <div className="section-eyebrow section-eyebrow--center">
                Ready?
              </div>
              <h2 className="story-cta__title">
                Transform your institution's scheduling.
              </h2>
              <p className="story-cta__body">
                Join the educators who've taken weeks of manual work off their
                plate — permanently.
              </p>
              <div className="story-cta__actions">
                <Link to="/signup" className="btn-primary">
                  Get Started
                  <Icon.Arrow />
                </Link>
                <Link to="/" className="btn-ghost">
                  View Demo
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="story-cta__glow" />
        </section>

        {/* ── Footer ── */}
        <footer className="story-footer">
          <div className="story-footer__inner">
            <Link to="/" className="story-nav__logo">
              <Icon.Logo />
              <span>Protiba</span>
            </Link>
            <p className="story-footer__copy">
              © {currentYear} Protiba. All rights reserved.
            </p>
            <Link to="/" className="story-footer__link">
              Back to Home
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

// ─── Timeline Item ─────────────────────────────────────────────────────────────
const TimelineItem = ({milestone, index}) => {
  const [ref, inView] = useInView(0.2);
  const isRight = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`timeline__item ${isRight ? "timeline__item--right" : "timeline__item--left"}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${index * 80}ms, transform 0.55s ease ${index * 80}ms`,
      }}
    >
      <div className="timeline__content">
        <div className="timeline__month">
          {milestone.month} {milestone.year}
        </div>
        <h3 className="timeline__title">{milestone.title}</h3>
        <p className="timeline__desc">{milestone.description}</p>
      </div>
      <div className="timeline__node">
        <div className="timeline__node-inner">{index + 1}</div>
      </div>
      <div className="timeline__spacer" />
    </div>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d10;
    --surface: #131316;
    --surface-2: #1a1a1f;
    --surface-3: #212128;
    --border: rgba(255,255,255,0.07);
    --text: #f0f0f5;
    --text-2: #9898a8;
    --text-3: #55556a;
    --accent: #7c3aed;
    --accent-light: #a78bfa;
    --accent-glow: rgba(124,58,237,0.14);
    --amber: #f59e0b;
    --amber-dim: rgba(245,158,11,0.12);
    --green: #10b981;
    --red: #f43f5e;
    --radius: 10px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --font: 'Inter', -apple-system, sans-serif;
    --transition: 200ms cubic-bezier(0.4,0,0.2,1);
    --max-w: 960px;
  }

  .story-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── Nav ── */
  .story-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(13,13,16,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .story-nav__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .story-nav__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
  }
  .story-nav__back {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    transition: color var(--transition);
  }
  .story-nav__back:hover { color: var(--text); }

  /* ── Hero ── */
  .story-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 32px 80px;
    overflow: hidden;
  }
  .story-hero__bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 60%, rgba(245,158,11,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .story-hero__inner {
    position: relative;
    max-width: 720px;
    text-align: center;
    z-index: 1;
    animation: heroFadeIn 0.9s ease both;
  }
  @keyframes heroFadeIn {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .story-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-light);
    margin-bottom: 24px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    padding: 5px 14px;
    border-radius: 20px;
  }
  .story-hero__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .story-hero__title {
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--text);
    margin-bottom: 20px;
  }
  .story-hero__title-accent {
    background: linear-gradient(135deg, var(--accent-light) 0%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .story-hero__subtitle {
    font-size: 17px;
    color: var(--text-2);
    line-height: 1.65;
    max-width: 540px;
    margin: 0 auto 48px;
  }
  .story-hero__stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    overflow: hidden;
    animation: heroFadeIn 0.9s ease 0.2s both;
    display: inline-flex;
  }
  .hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 28px;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; }
  .hero-stat__value { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
  .hero-stat__label { font-size: 11px; color: var(--text-3); font-weight: 500; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
  .story-hero__scroll-hint {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0.35;
    animation: heroFadeIn 1s ease 0.8s both;
  }
  .story-hero__scroll-hint span { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-3); }
  .story-hero__scroll-line {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--text-3), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.6)} }

  /* ── Sections ── */
  .story-section { padding: 96px 32px; }
  .story-section--tinted { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .story-container { max-width: var(--max-w); margin: 0 auto; }
  .story-container--split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  @media (max-width: 760px) { .story-container--split { grid-template-columns: 1fr; gap: 40px; } }

  .section-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-light);
    margin-bottom: 14px;
  }
  .section-eyebrow--center { display: block; text-align: center; }
  .section-title {
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 16px;
  }
  .section-body {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .section-body--centered { text-align: center; max-width: 560px; margin: 0 auto 48px; }
  .section-centered { text-align: center; }

  /* ── Problem list ── */
  .problem-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .problem-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.55;
  }
  .problem-item__icon {
    width: 22px; height: 22px;
    border-radius: 6px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ── Problem Visual ── */
  .problem-visual { position: relative; }
  .problem-visual__card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    transition: transform 0.3s ease;
  }
  .problem-visual__card--1 { margin-bottom: 12px; }
  .problem-visual__card--2 { transform: translateX(16px); }
  .problem-visual__card:hover { transform: translateY(-3px); }
  .problem-visual__card--2:hover { transform: translateX(16px) translateY(-3px); }
  .pvc__header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .pvc__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .pvc__dot--red { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .pvc__dot--green { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .pvc__title { font-size: 12px; font-weight: 500; color: var(--text-2); }
  .pvc__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 10px; }
  .pvc__cell { height: 22px; border-radius: 4px; }
  .pvc__cell--filled { background: rgba(124,58,237,0.2); border: 1px solid rgba(124,58,237,0.2); }
  .pvc__cell--conflict { background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.35); animation: conflictPulse 2s ease infinite; }
  @keyframes conflictPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pvc__cell--ok { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.25); }
  .pvc__label { font-size: 11px; color: var(--text-3); }
  .pvc__label--green { color: var(--green); }

  /* ── Feature grid ── */
  .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 720px) { .feature-grid { grid-template-columns: 1fr; } }
  .feature-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 24px;
    transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
  }
  .feature-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
  .feature-card__icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-light);
    margin-bottom: 16px;
  }
  .feature-card__title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
  .feature-card__desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }

  /* ── Timeline ── */
  .timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 0;
  }
  .timeline__line {
    position: absolute;
    left: 50%;
    top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent);
    transform: translateX(-50%);
  }
  .timeline__item {
    display: grid;
    grid-template-columns: 1fr 40px 1fr;
    gap: 0;
    margin-bottom: 48px;
    align-items: center;
  }
  .timeline__item--right .timeline__content { grid-column: 1; grid-row: 1; text-align: right; padding-right: 32px; }
  .timeline__item--right .timeline__node { grid-column: 2; grid-row: 1; }
  .timeline__item--right .timeline__spacer { grid-column: 3; grid-row: 1; }
  .timeline__item--left .timeline__spacer { grid-column: 1; grid-row: 1; }
  .timeline__item--left .timeline__node { grid-column: 2; grid-row: 1; }
  .timeline__item--left .timeline__content { grid-column: 3; grid-row: 1; text-align: left; padding-left: 32px; }
  .timeline__node {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .timeline__node-inner {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--surface-2);
    border: 2px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--accent-light);
    box-shadow: 0 0 16px var(--accent-glow);
  }
  .timeline__month { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-light); margin-bottom: 6px; }
  .timeline__title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.01em; }
  .timeline__desc { font-size: 13px; color: var(--text-2); line-height: 1.65; }
  .timeline__content {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    transition: border-color var(--transition);
  }
  .timeline__content:hover { border-color: rgba(124,58,237,0.25); }
  @media (max-width: 640px) {
    .timeline__line { left: 16px; }
    .timeline__item { grid-template-columns: 32px 1fr; gap: 16px; }
    .timeline__item--right .timeline__content,
    .timeline__item--left .timeline__content { grid-column: 2; grid-row: 1; text-align: left; padding: 16px; }
    .timeline__item--right .timeline__node,
    .timeline__item--left .timeline__node { grid-column: 1; grid-row: 1; }
    .timeline__item--right .timeline__spacer,
    .timeline__item--left .timeline__spacer { display: none; }
  }

  /* ── Credits ── */
  .credits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 720px) { .credits-grid { grid-template-columns: 1fr; } }
  .credit-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 24px;
    transition: border-color var(--transition), transform var(--transition);
  }
  .credit-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-3px); }
  .credit-card__avatar {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    color: var(--accent-light);
    margin-bottom: 16px;
    letter-spacing: -0.03em;
  }
  .credit-card__name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .credit-card__role { font-size: 12px; font-weight: 500; color: var(--accent-light); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
  .credit-card__desc { font-size: 13px; color: var(--text-2); line-height: 1.65; }

  /* ── CTA ── */
  .story-cta {
    position: relative;
    padding: 120px 32px;
    text-align: center;
    overflow: hidden;
  }
  .story-cta__glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .story-cta__inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .story-cta__title {
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 16px;
    line-height: 1.1;
  }
  .story-cta__body { font-size: 16px; color: var(--text-2); line-height: 1.65; margin-bottom: 40px; }
  .story-cta__actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent);
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: var(--radius);
    transition: all var(--transition);
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    font-family: var(--font);
  }
  .btn-primary:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-2);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: var(--radius);
    transition: all var(--transition);
    font-family: var(--font);
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.14); color: var(--text); }

  /* ── Footer ── */
  .story-footer {
    border-top: 1px solid var(--border);
    padding: 24px 32px;
  }
  .story-footer__inner {
    max-width: var(--max-w);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  .story-footer__copy { font-size: 13px; color: var(--text-3); }
  .story-footer__link { font-size: 13px; color: var(--text-2); text-decoration: none; transition: color var(--transition); }
  .story-footer__link:hover { color: var(--accent-light); }

  @media (max-width: 480px) {
    .story-hero__stats { flex-wrap: wrap; }
    .hero-stat { padding: 14px 18px; }
    .story-section { padding: 64px 20px; }
    .story-cta { padding: 80px 20px; }
  }
`;

export default Story;
