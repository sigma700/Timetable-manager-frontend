import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {useAuthStore} from "../store/authStore";

// ─── Intersection observer hook for scroll reveals ────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      {threshold},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({target, suffix = "", duration = 1800}) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({step, index, total}) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 60px 1fr",
          gap: 0,
          alignItems: "center",
          marginBottom: 0,
        }}
      >
        {/* Left content — alternates sides */}
        <div
          style={{gridColumn: isEven ? 1 : 3, gridRow: 1, padding: "0 24px"}}
        >
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.025)",
              border: `0.5px solid ${hovered ? step.borderColor : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16,
              padding: "28px 28px",
              transition: "all 0.25s ease",
              transform: hovered ? "translateY(-4px)" : "translateY(0)",
              cursor: "default",
            }}
          >
            {/* Step eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: step.iconBg,
                  border: `0.5px solid ${step.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1)",
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: step.accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Step {step.number} of {total}
              </span>
            </div>

            <h2
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#f1f5f9",
                marginBottom: 8,
                lineHeight: 1.3,
                letterSpacing: "-0.2px",
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.75,
                marginBottom: 18,
              }}
            >
              {step.description}
            </p>

            {/* Details */}
            <div style={{display: "flex", flexDirection: "column", gap: 9}}>
              {step.details.map((detail, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-8px)",
                    transition: `opacity 0.4s ease ${index * 0.1 + i * 0.07 + 0.2}s, transform 0.4s ease ${index * 0.1 + i * 0.07 + 0.2}s`,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: step.iconBg,
                      border: `0.5px solid ${step.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: step.accentColor,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </div>
                  <span
                    style={{fontSize: 13, color: "#94a3b8", lineHeight: 1.6}}
                  >
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: timeline node */}
        <div
          style={{
            gridColumn: 2,
            gridRow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: step.iconBg,
              border: `2px solid ${step.accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 500,
              color: step.accentColor,
              boxShadow: `0 0 20px ${step.accentColor}30`,
              transition: "all 0.3s",
              transform: hovered ? "scale(1.12)" : "scale(1)",
              zIndex: 2,
              position: "relative",
            }}
          >
            {step.number}
          </div>
        </div>

        {/* Right visual panel */}
        <div
          style={{gridColumn: isEven ? 3 : 1, gridRow: 1, padding: "0 24px"}}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Visual mockup specific to each step */}
            {step.visual}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({question, answer, index}) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`,
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: open
            ? "rgba(99,102,241,0.07)"
            : "rgba(255,255,255,0.025)",
          border: `0.5px solid ${open ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 12,
          padding: "18px 20px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#e2e8f0",
              lineHeight: 1.4,
            }}
          >
            {question}
          </span>
          <span
            style={{
              fontSize: 18,
              color: open ? "#818cf8" : "#475569",
              transition: "transform 0.2s, color 0.2s",
              transform: open ? "rotate(45deg)" : "rotate(0)",
              flexShrink: 0,
            }}
          >
            +
          </span>
        </div>
        {open && (
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.75,
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {answer}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Inline UI mockup visuals ─────────────────────────────────────────────────

const Visual1 = () => (
  <div style={{width: "100%"}}>
    <div
      style={{
        fontSize: 11,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 10,
      }}
    >
      Sign up form
    </div>
    {["Full name", "Institution email", "Password"].map((f, i) => (
      <div
        key={i}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 7,
          padding: "9px 12px",
          marginBottom: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{fontSize: 12, color: i === 0 ? "#94a3b8" : "#334155"}}>
          {i === 0 ? "Nyeri High School" : f}
        </span>
        {i === 0 && <span style={{fontSize: 10, color: "#10b981"}}>✓</span>}
      </div>
    ))}
    <div
      style={{
        background: "rgba(99,102,241,0.7)",
        borderRadius: 7,
        padding: "9px",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#fff",
        marginTop: 4,
      }}
    >
      Create account →
    </div>
    <div style={{textAlign: "center", marginTop: 10}}>
      <span
        style={{
          fontSize: 10,
          background: "rgba(16,185,129,0.1)",
          color: "#10b981",
          border: "0.5px solid rgba(16,185,129,0.25)",
          padding: "3px 10px",
          borderRadius: 20,
        }}
      >
        ✓ Email verified
      </span>
    </div>
  </div>
);

const Visual2 = () => (
  <div style={{width: "100%"}}>
    <div
      style={{
        fontSize: 11,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 10,
      }}
    >
      Dashboard
    </div>
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7}}>
      {[
        {
          label: "Create timetable",
          color: "rgba(99,102,241,0.15)",
          border: "rgba(99,102,241,0.3)",
          icon: "＋",
          active: true,
        },
        {
          label: "User manual",
          color: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.07)",
          icon: "📖",
        },
        {
          label: "Schedule demo",
          color: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.07)",
          icon: "🎥",
        },
        {
          label: "Invite others",
          color: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.07)",
          icon: "👥",
        },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            background: card.color,
            border: `0.5px solid ${card.border}`,
            borderRadius: 8,
            padding: "12px 10px",
          }}
        >
          <div style={{fontSize: 16, marginBottom: 5}}>{card.icon}</div>
          <div
            style={{
              fontSize: 11,
              color: card.active ? "#a5b4fc" : "#64748b",
              fontWeight: 500,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Visual3 = () => (
  <div style={{width: "100%"}}>
    <div
      style={{
        fontSize: 11,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 10,
      }}
    >
      Institution config
    </div>
    {[
      {label: "School name", value: "Nyeri High School", done: true},
      {label: "Subjects", value: "Math, English, Bio…", done: true},
      {label: "Classes", value: "Form 1A–4C · 12 groups", done: true},
    ].map((row, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <span style={{fontSize: 11, color: "#475569"}}>{row.label}</span>
        <div style={{display: "flex", alignItems: "center", gap: 6}}>
          <span style={{fontSize: 11, color: "#94a3b8"}}>{row.value}</span>
          <span style={{color: "#10b981", fontSize: 12}}>✓</span>
        </div>
      </div>
    ))}
    <div style={{marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4}}>
      {["Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A"].map((c, i) => (
        <span
          key={i}
          style={{
            fontSize: 10,
            background: "rgba(99,102,241,0.1)",
            border: "0.5px solid rgba(99,102,241,0.25)",
            color: "#a5b4fc",
            padding: "2px 8px",
            borderRadius: 20,
          }}
        >
          {c}
        </span>
      ))}
      <span style={{fontSize: 10, color: "#475569", padding: "2px 6px"}}>
        +7 more
      </span>
    </div>
  </div>
);

const Visual4 = () => (
  <div style={{width: "100%"}}>
    <div
      style={{
        fontSize: 11,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 10,
      }}
    >
      Teacher config
    </div>
    {[
      {name: "Mr. Kamau", subjects: "Math, Physics", classes: "Form 3A, 4B"},
      {name: "Ms. Wanjiru", subjects: "English, CRE", classes: "Form 1A, 2A"},
      {name: "Mr. Omondi", subjects: "Biology", classes: "Form 2B, 3A"},
    ].map((t, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 0",
          borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.15)",
            border: "0.5px solid rgba(139,92,246,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 500,
            color: "#a78bfa",
            flexShrink: 0,
          }}
        >
          {t.name.split(" ")[1][0]}
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 11, fontWeight: 500, color: "#e2e8f0"}}>
            {t.name}
          </div>
          <div style={{fontSize: 10, color: "#475569", marginTop: 1}}>
            {t.subjects} · {t.classes}
          </div>
        </div>
        <span style={{fontSize: 10, color: "#10b981"}}>✓</span>
      </div>
    ))}
  </div>
);

const Visual5 = () => (
  <div style={{width: "100%"}}>
    <div
      style={{
        fontSize: 11,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 10,
      }}
    >
      Generated schedule
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px repeat(5, 1fr)",
        gap: 2,
        marginBottom: 6,
      }}
    >
      <div />
      {["M", "T", "W", "T", "F"].map((d, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            fontSize: 10,
            color: "#475569",
            fontWeight: 500,
          }}
        >
          {d}
        </div>
      ))}
    </div>
    {[
      ["8:00", "Math", "Eng", "Phy", "Math", "Bio"],
      ["8:40", "Eng", "Math", "Bio", "Eng", "Phy"],
      ["9:20", "⏸", "⏸", "Chem", "⏸", "⏸"],
      ["10:00", "Phy", "Bio", "Eng", "Chem", "Math"],
    ].map((row, ri) => (
      <div
        key={ri}
        style={{
          display: "grid",
          gridTemplateColumns: "40px repeat(5,1fr)",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "#334155",
            display: "flex",
            alignItems: "center",
          }}
        >
          {row[0]}
        </div>
        {row.slice(1).map((cell, ci) => (
          <div
            key={ci}
            style={{
              height: 22,
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                cell === "⏸" ? "rgba(234,179,8,0.1)" : "rgba(99,102,241,0.15)",
              color: cell === "⏸" ? "#fbbf24" : "#a5b4fc",
            }}
          >
            {cell === "⏸" ? "Brk" : cell}
          </div>
        ))}
      </div>
    ))}
    <div
      style={{marginTop: 10, display: "flex", gap: 8, justifyContent: "center"}}
    >
      {["Download PDF", "Share link"].map((btn, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            padding: "4px 10px",
            borderRadius: 6,
            fontWeight: 500,
            background: i === 0 ? "rgba(99,102,241,0.2)" : "transparent",
            border: `0.5px solid ${i === 0 ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: i === 0 ? "#a5b4fc" : "#64748b",
          }}
        >
          {btn}
        </div>
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const UserManual = () => {
  const {user} = useAuthStore();
  const [heroRef, heroInView] = useInView(0.1);

  const steps = [
    {
      number: 1,
      icon: "👤",
      title: "Create your account",
      description:
        "Sign up in under 2 minutes. Verify your institutional email and you're ready to build your first schedule.",
      details: [
        "Navigate to the Sign Up page and enter your details",
        "Verify your email through the link sent to your inbox",
        "You're in — no credit card, no onboarding call required",
      ],
      accentColor: "#60a5fa",
      iconBg: "rgba(96,165,250,0.12)",
      borderColor: "rgba(96,165,250,0.3)",
      visual: <Visual1 />,
    },
    {
      number: 2,
      icon: "🏠",
      title: "Open the dashboard",
      description:
        "Your command centre. Every action you need is one click away — create, edit, export, and share timetables.",
      details: [
        "Log in and land on your personal dashboard",
        'Click "Create Timetable" from the quick actions panel',
        "Choose AI-assisted generation for an optimized result",
      ],
      accentColor: "#a78bfa",
      iconBg: "rgba(167,139,250,0.12)",
      borderColor: "rgba(167,139,250,0.3)",
      visual: <Visual2 />,
    },
    {
      number: 3,
      icon: "🏫",
      title: "Configure your institution",
      description:
        "Tell Protiba about your school — subjects, class levels, and section labels. This takes under 3 minutes.",
      details: [
        "Enter your institution name and the subjects offered",
        "Set the class type (Form, Grade, or Class) and level range",
        "Add section labels (A, B, C…) and watch classes generate live",
      ],
      accentColor: "#34d399",
      iconBg: "rgba(52,211,153,0.12)",
      borderColor: "rgba(52,211,153,0.3)",
      visual: <Visual3 />,
    },
    {
      number: 4,
      icon: "👩‍🏫",
      title: "Add your teachers",
      description:
        "Assign subjects and classes to each teacher. Protiba tracks all constraints and prevents double-booking automatically.",
      details: [
        "Add each teacher's name from the Teachers section",
        "Use the multi-select dropdowns to assign subjects and classes",
        "Add as many teachers as needed — no limit",
      ],
      accentColor: "#f59e0b",
      iconBg: "rgba(245,158,11,0.12)",
      borderColor: "rgba(245,158,11,0.3)",
      visual: <Visual4 />,
    },
    {
      number: 5,
      icon: "✨",
      title: "Generate and share",
      description:
        "Hit generate. Protiba's algorithm resolves all conflicts and returns a complete, balanced timetable in seconds.",
      details: [
        "Review the generated schedule in the full timetable viewer",
        "Export as PDF or share a live link with staff and students",
        "Make adjustments at any time — regenerate instantly",
      ],
      accentColor: "#f472b6",
      iconBg: "rgba(244,114,182,0.12)",
      borderColor: "rgba(244,114,182,0.3)",
      visual: <Visual5 />,
    },
  ];

  const faqs = [
    {
      question: "How long does it take to create a timetable?",
      answer:
        "Most institutions complete setup in under 10 minutes. The algorithm generates the final schedule in seconds — not hours.",
    },
    {
      question: "Can I edit the timetable after it's generated?",
      answer:
        "Yes. Every element is editable at any time. Changes trigger an instant re-optimization to keep the schedule conflict-free.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Protiba is fully responsive. Configure, generate, and share timetables from any device without installing anything.",
    },
    {
      question: "What happens if teachers have conflicting constraints?",
      answer:
        "The algorithm detects and flags all conflicts before generation. You'll always know exactly what to fix.",
    },
    {
      question: "Can multiple admins use the same account?",
      answer:
        "Yes. Institutions can invite team members with role-based access control — view, edit, or admin permissions.",
    },
    {
      question: "Is my institution's data private?",
      answer:
        "Absolutely. Your data is encrypted at rest and in transit. We never share or sell institutional data.",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0d1420 0%, #0f172a 50%, #0d1420 100%)",
        color: "#fff",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes pulse-glow { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:2px}
      `}</style>

      {/* Ambient glows */}
      <div
        style={{
          position: "fixed",
          top: -300,
          left: -200,
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -100,
          right: -100,
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top nav ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(16px)",
          background: "rgba(13,20,32,0.8)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "14px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              P
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                background: "linear-gradient(120deg,#fbbf24,#d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Protiba
            </span>
          </Link>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <Link
              to="/login"
              style={{
                fontSize: 13,
                color: "#64748b",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#fff",
                textDecoration: "none",
                padding: "7px 16px",
                borderRadius: 8,
                background: "rgba(99,102,241,0.85)",
                border: "0.5px solid rgba(99,102,241,0.5)",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.95)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.85)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div
        ref={heroRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(99,102,241,0.1)",
            border: "0.5px solid rgba(99,102,241,0.3)",
            borderRadius: 20,
            padding: "5px 14px",
            marginBottom: 24,
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#6366f1",
              animation: "pulse-glow 2s infinite",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#818cf8",
              letterSpacing: "0.3px",
            }}
          >
            Complete platform guide
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 500,
            color: "#f1f5f9",
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
            marginBottom: 16,
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s ease 0.1s",
          }}
        >
          From setup to schedule{" "}
          <span
            style={{
              background: "linear-gradient(120deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            in 5 steps
          </span>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#64748b",
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 auto 40px",
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s ease 0.2s",
          }}
        >
          Protiba generates conflict-free, optimized timetables automatically.
          Here's exactly how to get your institution's first schedule live.
        </p>

        {/* Social proof stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            opacity: heroInView ? 1 : 0,
            transition: "opacity 0.5s ease 0.3s",
          }}
        >
          {[
            {value: 500, suffix: "+", label: "Institutions"},
            {value: 10, suffix: " min", label: "Avg. setup time"},
            {value: 100, suffix: "%", label: "Conflict-free"},
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "14px 24px",
                minWidth: 110,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#f1f5f9",
                  lineHeight: 1,
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#475569",
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline steps ── */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section header */}
        <div style={{textAlign: "center", marginBottom: 48}}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 8,
            }}
          >
            How it works
          </div>
          <div
            style={{
              width: 40,
              height: "0.5px",
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Vertical timeline line */}
        <div style={{position: "relative"}}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 22,
              bottom: 22,
              width: "0.5px",
              background:
                "linear-gradient(180deg, transparent, rgba(99,102,241,0.25) 10%, rgba(99,102,241,0.25) 90%, transparent)",
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              position: "relative",
              zIndex: 1,
            }}
          >
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                total={steps.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {(() => {
          const [ref, inView] = useInView(0.2);
          return (
            <div
              ref={ref}
              style={{
                background: "rgba(99,102,241,0.07)",
                border: "0.5px solid rgba(99,102,241,0.25)",
                borderRadius: 20,
                padding: "48px 40px",
                textAlign: "center",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.5s ease",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#6366f1",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: 12,
                }}
              >
                Ready to begin?
              </div>
              <h2
                style={{
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "#f1f5f9",
                  marginBottom: 10,
                  letterSpacing: "-0.3px",
                }}
              >
                Your first timetable is 10 minutes away
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  marginBottom: 32,
                  maxWidth: 420,
                  margin: "0 auto 32px",
                  lineHeight: 1.75,
                }}
              >
                Join schools, colleges, and training institutions already
                running on Protiba. Free to start — no credit card needed.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/signup"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    background: "rgba(99,102,241,0.9)",
                    color: "#fff",
                    textDecoration: "none",
                    border: "0.5px solid rgba(99,102,241,0.6)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(99,102,241,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Create free account →
                </Link>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    background: "transparent",
                    color: "#94a3b8",
                    textDecoration: "none",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.16)";
                    e.currentTarget.style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── FAQ ── */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{textAlign: "center", marginBottom: 36}}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 10,
            }}
          >
            Common questions
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#f1f5f9",
              letterSpacing: "-0.2px",
            }}
          >
            Frequently asked
          </h2>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          "Conflict-free scheduling",
          "Automated generation",
          "Multi-institution support",
        ].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#334155",
            }}
          >
            <span style={{color: "#10b981"}}>✓</span> {item}
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserManual;
