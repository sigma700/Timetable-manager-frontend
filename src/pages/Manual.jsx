import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link} from "react-router-dom";
import {useAuthStore} from "../store/authStore";
import Footer from "./components/footer";
import Navigation from "./components/navigation";
import {
  User,
  LayoutDashboard,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Clock3,
  Users,
  CheckCheck,
} from "lucide-react";

// ─── Hooks ────────────────────────────────────────────────────────────────────

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

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, {passive: true});
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

// ─── Counter ──────────────────────────────────────────────────────────────────

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

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 2,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #a78bfa, #f472b6)",
          transition: "width 0.1s linear",
          borderRadius: "0 1px 1px 0",
        }}
      />
    </div>
  );
}

// ─── Visual Mockups ───────────────────────────────────────────────────────────

const GlassCard = ({children, style = {}}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "0.5px solid rgba(255,255,255,0.09)",
      borderRadius: 12,
      padding: "20px",
      backdropFilter: "blur(12px)",
      boxShadow:
        "0 8px 32px rgba(0,0,0,0.2), inset 0 0.5px 0 rgba(255,255,255,0.07)",
      ...style,
    }}
  >
    {children}
  </div>
);

const MockupLabel = ({children}) => (
  <div
    style={{
      fontSize: 10,
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      marginBottom: 12,
      fontWeight: 500,
    }}
  >
    {children}
  </div>
);

const Visual1 = () => (
  <GlassCard style={{width: "100%"}}>
    <MockupLabel>Sign up</MockupLabel>
    {[
      {label: "Full name", value: "Nyeri High School", done: true},
      {label: "Institution email", value: "", done: false},
      {label: "Password", value: "", done: false},
    ].map((f, i) => (
      <div
        key={i}
        style={{
          background:
            i === 0 ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
          border: `0.5px solid ${i === 0 ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 7,
          padding: "9px 12px",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{fontSize: 12, color: i === 0 ? "#94a3b8" : "#334155"}}>
          {i === 0 ? f.value : f.label}
        </span>
        {f.done && <CheckCircle2 size={13} color="#10b981" />}
      </div>
    ))}
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))",
        borderRadius: 7,
        padding: "9px",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#fff",
        marginTop: 8,
        boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
      }}
    >
      Create account →
    </div>
    <div style={{textAlign: "center", marginTop: 10}}>
      <span
        style={{
          fontSize: 10,
          background: "rgba(16,185,129,0.08)",
          color: "#10b981",
          border: "0.5px solid rgba(16,185,129,0.2)",
          padding: "3px 10px",
          borderRadius: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <CheckCircle2 size={10} /> Email verified
      </span>
    </div>
  </GlassCard>
);

const Visual2 = () => (
  <GlassCard style={{width: "100%"}}>
    <MockupLabel>Dashboard</MockupLabel>
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7}}>
      {[
        {
          label: "Create timetable",
          icon: <LayoutDashboard size={14} />,
          active: true,
        },
        {
          label: "User manual",
          icon: <GraduationCap size={14} />,
          active: false,
        },
        {label: "Schedule demo", icon: <Clock3 size={14} />, active: false},
        {label: "Invite others", icon: <Users size={14} />, active: false},
      ].map((card, i) => (
        <div
          key={i}
          style={{
            background: card.active
              ? "rgba(99,102,241,0.12)"
              : "rgba(255,255,255,0.02)",
            border: `0.5px solid ${card.active ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 8,
            padding: "12px 10px",
            boxShadow: card.active ? "0 4px 12px rgba(99,102,241,0.1)" : "none",
          }}
        >
          <div
            style={{
              color: card.active ? "#818cf8" : "#475569",
              marginBottom: 6,
            }}
          >
            {card.icon}
          </div>
          <div
            style={{
              fontSize: 11,
              color: card.active ? "#a5b4fc" : "#475569",
              fontWeight: 500,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  </GlassCard>
);

const Visual3 = () => (
  <GlassCard style={{width: "100%"}}>
    <MockupLabel>Institution config</MockupLabel>
    {[
      {label: "School name", value: "Nyeri High School"},
      {label: "Subjects", value: "Math, English, Bio…"},
      {label: "Classes", value: "Form 1A–4C · 12 groups"},
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
          <CheckCircle2 size={12} color="#10b981" />
        </div>
      </div>
    ))}
    <div style={{marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4}}>
      {["Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A"].map((c) => (
        <span
          key={c}
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
  </GlassCard>
);

const Visual4 = () => (
  <GlassCard style={{width: "100%"}}>
    <MockupLabel>Teacher config</MockupLabel>
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
            fontWeight: 600,
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
        <CheckCircle2 size={12} color="#10b981" />
      </div>
    ))}
  </GlassCard>
);

const Visual5 = () => (
  <GlassCard style={{width: "100%"}}>
    <MockupLabel>Generated schedule</MockupLabel>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "36px repeat(5, 1fr)",
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
      ["9:20", "Brk", "Brk", "Chem", "Brk", "Brk"],
      ["10:00", "Phy", "Bio", "Eng", "Chem", "Math"],
    ].map((row, ri) => (
      <div
        key={ri}
        style={{
          display: "grid",
          gridTemplateColumns: "36px repeat(5,1fr)",
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
                cell === "Brk"
                  ? "rgba(234,179,8,0.08)"
                  : "rgba(99,102,241,0.12)",
              color: cell === "Brk" ? "#fbbf24" : "#a5b4fc",
              border: `0.5px solid ${cell === "Brk" ? "rgba(234,179,8,0.15)" : "rgba(99,102,241,0.2)"}`,
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    ))}
    <div
      style={{marginTop: 10, display: "flex", gap: 7, justifyContent: "center"}}
    >
      {["Download PDF", "Share link"].map((btn, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            padding: "4px 10px",
            borderRadius: 6,
            fontWeight: 500,
            background: i === 0 ? "rgba(99,102,241,0.15)" : "transparent",
            border: `0.5px solid ${i === 0 ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)"}`,
            color: i === 0 ? "#a5b4fc" : "#64748b",
          }}
        >
          {btn}
        </div>
      ))}
    </div>
  </GlassCard>
);

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({step, index, total, isActive}) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  const IconComponent = step.IconComponent;

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
      }}
    >
      {/* Chapter label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ease ${index * 0.12 + 0.15}s`,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: step.accentColor,
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: 500,
            background: step.iconBg,
            padding: "3px 12px",
            borderRadius: 20,
            border: `0.5px solid ${step.borderColor}`,
          }}
        >
          Chapter {step.number}
        </span>
      </div>

      {/* Desktop: 3-column alternating */}
      <div
        className="step-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 72px 1fr",
          gap: 0,
          alignItems: "start",
        }}
      >
        {/* Content card */}
        <div
          style={{
            gridColumn: isEven ? 1 : 3,
            gridRow: 1,
            padding: "0 20px",
          }}
        >
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered
                ? "rgba(255,255,255,0.045)"
                : "rgba(255,255,255,0.025)",
              border: `0.5px solid ${hovered ? step.borderColor : "rgba(255,255,255,0.07)"}`,
              borderRadius: 16,
              padding: "28px",
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "translateY(-5px)" : "translateY(0)",
              boxShadow: hovered
                ? `0 20px 48px rgba(0,0,0,0.25), 0 0 0 0.5px ${step.borderColor}`
                : "0 4px 16px rgba(0,0,0,0.1)",
              cursor: "default",
            }}
          >
            {/* Icon + eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: step.iconBg,
                  border: `0.5px solid ${step.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: step.accentColor,
                  flexShrink: 0,
                  transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                  transform: hovered ? "scale(1.12) rotate(-5deg)" : "scale(1)",
                  boxShadow: hovered
                    ? `0 4px 12px ${step.accentColor}30`
                    : "none",
                }}
              >
                <IconComponent size={16} strokeWidth={1.5} />
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
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              {step.description}
            </p>

            <div style={{display: "flex", flexDirection: "column", gap: 9}}>
              {step.details.map((detail, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity 0.4s ease ${index * 0.12 + i * 0.08 + 0.25}s, transform 0.4s ease ${index * 0.12 + i * 0.08 + 0.25}s`,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      flexShrink: 0,
                      marginTop: 1,
                      background: step.iconBg,
                      border: `0.5px solid ${step.borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCheck
                      size={10}
                      color={step.accentColor}
                      strokeWidth={2}
                    />
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
            paddingTop: 28,
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: step.iconBg,
              border: `1.5px solid ${step.accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 600,
              color: step.accentColor,
              boxShadow: `0 0 0 4px rgba(0,0,0,0.4), 0 0 24px ${step.accentColor}35`,
              transition: "all 0.3s",
              transform: hovered ? "scale(1.15)" : "scale(1)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {step.number}
          </div>
        </div>

        {/* Visual panel */}
        <div
          style={{
            gridColumn: isEven ? 3 : 1,
            gridRow: 1,
            padding: "0 20px",
          }}
        >
          <div
            style={{
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "translateY(-3px)" : "translateY(0)",
            }}
          >
            {step.visual}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FaqItem({question, answer, index}) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView(0.1);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.45s ease ${index * 0.07}s, transform 0.45s ease ${index * 0.07}s`,
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: open ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
          border: `0.5px solid ${open ? "rgba(99,102,241,0.28)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 12,
          padding: "18px 20px",
          cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: open ? "0 4px 20px rgba(99,102,241,0.08)" : "none",
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
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: open
                ? "rgba(99,102,241,0.15)"
                : "rgba(255,255,255,0.04)",
              border: `0.5px solid ${open ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.08)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.25s ease",
              transform: open ? "rotate(45deg)" : "rotate(0)",
            }}
          >
            <ChevronRight
              size={13}
              color={open ? "#818cf8" : "#475569"}
              style={{
                transform: open ? "rotate(45deg)" : "rotate(0)",
                transition: "transform 0.25s",
              }}
            />
          </div>
        </div>

        <div
          ref={contentRef}
          style={{
            overflow: "hidden",
            maxHeight: height,
            transition: "max-height 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.8,
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection({user}) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "0 24px 96px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(99,102,241,0.06)",
          border: "0.5px solid rgba(99,102,241,0.22)",
          borderRadius: 24,
          padding: "clamp(40px, 6vw, 72px) clamp(28px, 5vw, 64px)",
          textAlign: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Ambient glow inside card */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 40,
          }}
        >
          {[
            {Icon: ShieldCheck, label: "No credit card"},
            {Icon: Clock3, label: "10-min setup"},
            {Icon: Sparkles, label: "Conflict-free"},
          ].map(({Icon, label}) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "#64748b",
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <Icon size={12} color="#6366f1" strokeWidth={1.5} />
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#6366f1",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: 16,
          }}
        >
          Ready to begin?
        </div>

        <h2
          style={{
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 500,
            color: "#f1f5f9",
            marginBottom: 14,
            letterSpacing: "-0.4px",
            lineHeight: 1.2,
          }}
        >
          Your first timetable is{" "}
          <span
            style={{
              background: "linear-gradient(120deg, #818cf8, #c084fc, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            10 minutes away
          </span>
        </h2>

        <p
          style={{
            fontSize: 15,
            color: "#64748b",
            lineHeight: 1.8,
            maxWidth: 440,
            margin: "0 auto 40px",
          }}
        >
          Join schools, colleges, and training institutions already running on
          Protiba. Free to start — no credit card needed.
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
            to={user ? "/dashboard" : "/signup"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              background: "rgba(99,102,241,0.85)",
              color: "#fff",
              textDecoration: "none",
              border: "0.5px solid rgba(99,102,241,0.5)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
              transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(99,102,241,0.35)";
              e.currentTarget.style.background = "rgba(99,102,241,0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(99,102,241,0.25)";
              e.currentTarget.style.background = "rgba(99,102,241,0.85)";
            }}
          >
            {user ? "Go to dashboard" : "Create free account"}
            <ChevronRight size={15} />
          </Link>
          {!user && (
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                background: "transparent",
                color: "#94a3b8",
                textDecoration: "none",
                border: "0.5px solid rgba(255,255,255,0.09)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                e.currentTarget.style.color = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const UserManual = () => {
  const {user} = useAuthStore();
  const [heroRef, heroInView] = useInView(0.1);

  const steps = [
    {
      number: 1,
      IconComponent: User,
      title: "Create your account",
      description:
        "Sign up in under 2 minutes. Verify your institutional email and you're ready to build your first schedule.",
      details: [
        "Navigate to the Sign Up page and enter your details",
        "Verify your email through the link sent to your inbox",
        "You're in — no credit card, no onboarding call required",
      ],
      accentColor: "#60a5fa",
      iconBg: "rgba(96,165,250,0.1)",
      borderColor: "rgba(96,165,250,0.28)",
      visual: <Visual1 />,
    },
    {
      number: 2,
      IconComponent: LayoutDashboard,
      title: "Open the dashboard",
      description:
        "Your command centre. Every action you need is one click away — create, edit, export, and share timetables.",
      details: [
        "Log in and land on your personal dashboard",
        // Fixed: escaped inner double quotes
        'Click "Create Timetable" from the quick actions panel',
        "Choose AI-assisted generation for an optimized result",
      ],
      accentColor: "#a78bfa",
      iconBg: "rgba(167,139,250,0.1)",
      borderColor: "rgba(167,139,250,0.28)",
      visual: <Visual2 />,
    },
    {
      number: 3,
      IconComponent: Building2,
      title: "Configure your institution",
      description:
        "Tell Protiba about your school — subjects, class levels, and section labels. This takes under 3 minutes.",
      details: [
        "Enter your institution name and the subjects offered",
        "Set the class type (Form, Grade, or Class) and level range",
        "Add section labels (A, B, C…) and watch classes generate live",
      ],
      accentColor: "#34d399",
      iconBg: "rgba(52,211,153,0.1)",
      borderColor: "rgba(52,211,153,0.28)",
      visual: <Visual3 />,
    },
    {
      number: 4,
      IconComponent: GraduationCap,
      title: "Add your teachers",
      description:
        "Assign subjects and classes to each teacher. Protiba tracks all constraints and prevents double-booking automatically.",
      details: [
        "Add each teacher's name from the Teachers section",
        "Use the multi-select dropdowns to assign subjects and classes",
        "Add as many teachers as needed — no limit",
      ],
      accentColor: "#f59e0b",
      iconBg: "rgba(245,158,11,0.1)",
      borderColor: "rgba(245,158,11,0.28)",
      visual: <Visual4 />,
    },
    {
      number: 5,
      IconComponent: Sparkles,
      title: "Generate and share",
      description:
        "Hit generate. Protiba's algorithm resolves all conflicts and returns a complete, balanced timetable in seconds.",
      details: [
        "Review the generated schedule in the full timetable viewer",
        "Export as PDF or share a live link with staff and students",
        "Make adjustments at any time — regenerate instantly",
      ],
      accentColor: "#f472b6",
      iconBg: "rgba(244,114,182,0.1)",
      borderColor: "rgba(244,114,182,0.28)",
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
        @keyframes pulse-glow { 0%,100%{opacity:.35} 50%{opacity:.75} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }

        @media (max-width: 768px) {
          .step-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
          }
          .step-content-card { padding: 0 !important; order: 2; }
          .step-timeline-node { order: 1; padding-top: 0 !important; padding-bottom: 16px; flex-direction: row !important; gap: 12px; justify-content: flex-start !important; }
          .step-visual-panel { padding: 0 !important; order: 3; margin-top: 16px; }
          .timeline-center-line { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <ScrollProgressBar />

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

      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(72px, 10vw, 104px) 24px clamp(48px, 7vw, 72px)",
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
            gap: 8,
            background: "rgba(99,102,241,0.09)",
            border: "0.5px solid rgba(99,102,241,0.28)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 28,
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.55s cubic-bezier(0.22,1,0.36,1)",
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
              letterSpacing: "0.4px",
            }}
          >
            Complete platform guide
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5.5vw, 56px)",
            fontWeight: 500,
            color: "#f1f5f9",
            letterSpacing: "-0.6px",
            lineHeight: 1.12,
            marginBottom: 18,
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(18px)",
            transition: "all 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s",
          }}
        >
          From setup to schedule{" "}
          <span
            style={{
              background:
                "linear-gradient(120deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
            }}
          >
            in 5 steps
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#64748b",
            lineHeight: 1.8,
            maxWidth: 500,
            margin: "0 auto 44px",
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(18px)",
            transition: "all 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        >
          Protiba generates conflict-free, optimized timetables automatically.
          Here's exactly how to get your institution's first schedule live.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 10,
            opacity: heroInView ? 1 : 0,
            transition: "opacity 0.55s ease 0.32s",
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
                background: "rgba(255,255,255,0.025)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "16px 28px",
                minWidth: 120,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#f1f5f9",
                  lineHeight: 1,
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  marginTop: 5,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline steps ────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px 96px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{textAlign: "center", marginBottom: 56}}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 10,
            }}
          >
            How it works
          </div>
          <div
            style={{
              width: 48,
              height: "0.5px",
              margin: "0 auto",
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
            }}
          />
        </div>

        <div style={{position: "relative"}}>
          {/* Timeline spine */}
          <div
            className="timeline-center-line"
            style={{
              position: "absolute",
              left: "50%",
              top: 28,
              bottom: 28,
              width: "0.5px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.2) 8%, rgba(99,102,241,0.2) 92%, transparent 100%)",
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
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

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <CTASection user={user} />

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px 96px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{textAlign: "center", marginBottom: 40}}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 14,
            }}
          >
            Common questions
          </div>
          <h2
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 500,
              color: "#f1f5f9",
              letterSpacing: "-0.3px",
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

      {/* ── Footer strip ─────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px, 4vw, 32px)",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          {Icon: CheckCircle2, label: "Conflict-free scheduling"},
          {Icon: Sparkles, label: "Automated generation"},
          {Icon: Users, label: "Multi-institution support"},
        ].map(({Icon, label}) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              color: "#334155",
            }}
          >
            <Icon size={13} color="#10b981" strokeWidth={1.5} />
            {label}
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserManual;
