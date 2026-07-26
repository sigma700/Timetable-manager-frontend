import React, {useState, useEffect, useRef} from "react";
import {useAuthStore} from "../store/authStore";
import {useSubStore} from "../store/subsidiary";
import Navigation from "./components/navigation";

// ─── Tokens (light theme, semantic colors preserved) ──────────────────────────
const tk = {
  bg0: "#F8F8F8",
  bg1: "#FFFFFF",
  bg2: "#F0F0F0",
  bg3: "#E8E8E8",
  bg4: "#DCDCDC",
  border: "rgba(0,0,0,0.06)",
  borderHov: "rgba(0,0,0,0.12)",
  borderAccent: "rgba(79,110,247,0.28)",
  text1: "#2B2B2B",
  text2: "#898989",
  text3: "#A0A0A0",
  accent: "#4F6EF7",
  accentHov: "#3D5CE8",
  accentGlow: "rgba(79,110,247,0.06)",
  accentSubtle: "rgba(79,110,247,0.06)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.06)",
  successBorder: "rgba(34,197,94,0.18)",
  error: "#F87171",
  errorSubtle: "rgba(248,113,113,0.06)",
  errorBorder: "rgba(248,113,113,0.18)",
};

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({
  d,
  size = 18,
  strokeWidth = 1.8,
  children,
  viewBox = "0 0 24 24",
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d ? <path d={d} /> : children}
  </svg>
);

const PhoneIcon = ({size = 18}) => (
  <Icon size={size}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.6 19.79 19.79 0 0 1 1.59 4.1 2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Icon>
);

const MailIcon = ({size = 18}) => (
  <Icon size={size}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </Icon>
);

const VideoIcon = ({size = 14}) => (
  <Icon size={size}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Icon>
);

const ArrowRight = ({size = 14}) => (
  <Icon size={size} strokeWidth={2}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

const Check = ({size = 11, color = tk.success}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDown = ({size = 14}) => (
  <Icon size={size} strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

const ShieldIcon = ({size = 13}) => (
  <Icon size={size} strokeWidth={1.6}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Icon>
);

const ClockIcon = ({size = 13}) => (
  <Icon size={size} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const UsersIcon = ({size = 13}) => (
  <Icon size={size} strokeWidth={1.6}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({label, error, children}) {
  return (
    <div style={{marginBottom: 18}}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: tk.text2,
          marginBottom: 7,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{fontSize: 11, color: tk.error, marginTop: 5, lineHeight: 1.4}}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  hasError,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: focused ? "rgba(79,110,247,0.04)" : tk.bg2,
        border: `1px solid ${hasError ? tk.errorBorder : focused ? tk.borderAccent : tk.border}`,
        borderRadius: 10,
        padding: "11px 14px",
        fontSize: 14,
        color: tk.text1,
        outline: "none",
        transition: "border-color 0.18s, background 0.18s",
        fontFamily: "inherit",
      }}
    />
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({num, label, delay}) {
  const [ref, inView] = useInView(0.3);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          background: tk.bg2,
          border: `1px solid ${tk.border}`,
          borderRadius: 12,
          minWidth: 100,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: tk.text1,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 5,
          }}
        >
          {num}
        </div>
        <div
          style={{
            fontSize: 11,
            color: tk.text3,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Contact card ─────────────────────────────────────────────────────────────
function ContactCard({icon, iconBg, iconColor, label, value, href}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "15px 18px",
        background: hov ? tk.bg3 : tk.bg2,
        border: `1px solid ${hov ? tk.borderHov : tk.border}`,
        borderRadius: 12,
        marginBottom: 10,
        textDecoration: "none",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
        transform: hov ? "translateX(3px)" : "translateX(0)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "transform 0.2s",
          transform: hov ? "scale(1.08)" : "scale(1)",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: tk.text3,
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{fontSize: 13, fontWeight: 600, color: tk.text1}}>
          {value}
        </div>
      </div>
    </a>
  );
}

// ─── Benefit row ──────────────────────────────────────────────────────────────
function BenefitRow({title, desc, isLast, delay}) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "13px 0",
        borderBottom: isLast ? "none" : `1px solid ${tk.border}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-8px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          flexShrink: 0,
          marginTop: 1,
          background: tk.successSubtle,
          border: `1px solid ${tk.successBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check />
      </div>
      <div>
        <span style={{fontSize: 13, fontWeight: 600, color: tk.text1}}>
          {title}
        </span>
        <span style={{fontSize: 13, color: tk.text2, lineHeight: 1.6}}>
          {" "}
          {desc}
        </span>
      </div>
    </div>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({title, children, style = {}}) {
  return (
    <div
      style={{
        background: tk.bg1,
        border: `1px solid ${tk.border}`,
        borderRadius: 16,
        padding: 28,
        ...style,
      }}
    >
      {title && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: tk.text3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Demo = () => {
  const {user, isLoading: authLoading} = useAuthStore();
  const {bookSess, isLoading, error} = useSubStore();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [schName, setSchName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [heroRef, heroInView] = useInView(0.05);
  const [formRef, formInView] = useInView(0.05);
  const [leftRef, leftInView] = useInView(0.05);

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {method: "POST", credentials: "include"},
      );
      if (res.ok) window.location.href = "/login";
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const benefits = [
    {
      title: "Live timetable generation.",
      desc: "Watch Protiba resolve 600+ constraints in real time. Rooms, teachers, periods, and clashes handled automatically.",
    },
    {
      title: "Tailored to your institution.",
      desc: "We configure a demo with your actual structure: departments, subjects, and staffing model.",
    },
    {
      title: "Direct Q&A with founders.",
      desc: "No sales scripts. Talk directly with the engineers who built the product.",
    },
    {
      title: "Conflict detection showcase.",
      desc: "See how Protiba surfaces double-bookings, overloaded teachers, and policy violations instantly.",
    },
    {
      title: "Implementation and pricing walkthrough.",
      desc: "Get a clear timeline and a quote scoped to your institution size.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookSess(fullName, email, schName, date, time);
    setIsSubmitted(true);
  };

  const firstName = user?.firstName || "there";

  if (authLoading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div
          style={{
            background: tk.bg0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `2px solid ${tk.accentSubtle}`,
              borderTopColor: tk.accent,
              animation: "spin 0.75s linear infinite",
            }}
          />
          <span style={{fontSize: 13, color: tk.text3}}>Loading</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }

        * { box-sizing: border-box; }

        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }

        .demo-select option { background: #FFFFFF; color: #2B2B2B; }

        @media (max-width: 860px) {
          .demo-main-grid { grid-template-columns: 1fr !important; }
          .demo-hero { padding: 56px 20px 48px !important; }
          .demo-stats-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .demo-stat-chip { min-width: 0 !important; flex: none !important; width: 100% !important; }
          .demo-footer-strip { flex-direction: column !important; gap: 6px !important; text-align: center; }
          .demo-main-wrap { padding: 36px 20px 64px !important; }
          .demo-grid-two { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 480px) {
          .demo-hero { padding: 48px 16px 40px !important; }
          .demo-main-wrap { padding: 28px 16px 56px !important; }
          .demo-eyebrow { font-size: 11px !important; }
          .demo-hero-title { font-size: clamp(26px, 7vw, 40px) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Navigation
        userName={userName}
        institutionName="Protiba"
        notificationCount={3}
        onLogout={handleLogout}
      />

      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          color: tk.text1,
          fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
          paddingTop: 64,
        }}
      >
        {/* Ambient glows removed */}
        <div
          style={{
            position: "fixed",
            top: -200,
            left: -100,
            width: 600,
            height: 600,
            background: "transparent",
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
            background: "transparent",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Hero */}
        <div
          ref={heroRef}
          className="demo-hero"
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "80px 48px 64px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="demo-eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 500,
              color: tk.accent,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              background: tk.accentSubtle,
              border: `1px solid ${tk.borderAccent}`,
              borderRadius: 20,
              padding: "5px 13px",
              marginBottom: 24,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: tk.accent,
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            30-minute live session
          </div>

          <h1
            className="demo-hero-title"
            style={{
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: tk.text1,
              marginBottom: 18,
              maxWidth: 620,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s",
            }}
          >
            {firstName !== "there" ? (
              <>
                {firstName}, see your timetable
                <br />
                generate itself.
              </>
            ) : (
              <>
                See your timetable
                <br />
                generate itself.
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.72,
              color: tk.text2,
              maxWidth: 500,
              marginBottom: 44,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.16s, transform 0.55s ease 0.16s",
            }}
          >
            Book a session and watch Protiba process your institution's
            constraints (subjects, rooms, teachers, periods) and produce a
            conflict-free schedule in under a minute.
          </p>

          {/* Stats */}
          <div
            className="demo-stats-row"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              opacity: heroInView ? 1 : 0,
              transition: "opacity 0.55s ease 0.24s",
            }}
          >
            {[
              {n: "500+", l: "Demos conducted"},
              {n: "98%", l: "Satisfaction rate"},
              {n: "<24h", l: "Confirmation"},
              {n: "60s", l: "Generation time"},
            ].map((st, i) => (
              <div
                key={i}
                className="demo-stat-chip"
                style={{
                  padding: "14px 18px",
                  background: tk.bg2,
                  border: `1px solid ${tk.border}`,
                  borderRadius: 12,
                  minWidth: 108,
                }}
              >
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 600,
                    color: tk.text1,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {st.n}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: tk.text3,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {st.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1120,
            margin: "0 auto",
          }}
        />

        {/* Main grid */}
        <div
          className="demo-main-wrap"
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "56px 48px 80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="demo-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.08fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* Left column */}
            <div
              ref={leftRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <Panel title="Contact us directly">
                <ContactCard
                  icon={<PhoneIcon />}
                  iconBg="rgba(59,130,246,0.12)"
                  iconColor="#3B82F6"
                  label="Call us"
                  value="(+254) 792 624 342"
                  href="tel:+254792624342"
                />
                <ContactCard
                  icon={<MailIcon />}
                  iconBg="rgba(139,92,246,0.12)"
                  iconColor="#8B5CF6"
                  label="Email us"
                  value="allankirimi65@gmail.com"
                  href="mailto:allankirimi65@gmail.com"
                />
              </Panel>

              <Panel title="What happens in the demo">
                {benefits.map((b, i) => (
                  <BenefitRow
                    key={i}
                    title={b.title}
                    desc={b.desc}
                    isLast={i === benefits.length - 1}
                    delay={i * 70}
                  />
                ))}
              </Panel>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  paddingTop: 4,
                }}
              >
                {[
                  {Icon: ShieldIcon, label: "Data encrypted at rest"},
                  {Icon: ClockIcon, label: "Confirmed within 24h"},
                  {Icon: UsersIcon, label: "Bring up to 3 colleagues"},
                ].map(({Icon, label}) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      color: tk.text3,
                      background: tk.bg2,
                      border: `1px solid ${tk.border}`,
                      borderRadius: 20,
                      padding: "5px 12px",
                    }}
                  >
                    <Icon /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column – form */}
            <div
              ref={formRef}
              style={{
                background: tk.bg1,
                border: `1px solid ${tk.border}`,
                borderRadius: 18,
                padding: 36,
                position: "relative",
                overflow: "hidden",
                opacity: formInView ? 1 : 0,
                transform: formInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${tk.borderAccent}, transparent)`,
                }}
              />

              {isSubmitted ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "32px 16px",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: tk.successSubtle,
                      border: `1px solid ${tk.successBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 22,
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: tk.text1,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                    }}
                  >
                    Demo confirmed
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: tk.text2,
                      lineHeight: 1.7,
                      marginBottom: 28,
                      maxWidth: 320,
                    }}
                  >
                    A Google Meet link and calendar invite are on their way to{" "}
                    <strong style={{color: tk.text1, fontWeight: 500}}>
                      {email}
                    </strong>
                    . We will see you there.
                  </p>
                  <div
                    style={{
                      background: tk.bg2,
                      border: `1px solid ${tk.borderAccent}`,
                      borderRadius: 12,
                      padding: "16px 20px",
                      marginBottom: 24,
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tk.text3,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 14,
                      }}
                    >
                      Your booking
                    </p>
                    {[
                      ["Name", fullName],
                      ["Institution", schName],
                      ["Date", date],
                      ["Time", time],
                    ].map(([k, v], i, arr) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 13,
                          paddingBottom: i < arr.length - 1 ? 10 : 0,
                          marginBottom: i < arr.length - 1 ? 10 : 0,
                          borderBottom:
                            i < arr.length - 1
                              ? `1px solid ${tk.border}`
                              : "none",
                        }}
                      >
                        <span style={{color: tk.text3}}>{k}</span>
                        <span style={{color: tk.text1, fontWeight: 500}}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setEmail("");
                      setSchName("");
                      setDate("");
                      setTime("");
                    }}
                    style={{
                      padding: "10px 22px",
                      background: tk.bg3,
                      color: tk.text1,
                      border: `1px solid ${tk.border}`,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = tk.borderHov)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = tk.border)
                    }
                  >
                    Book another session
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: tk.text1,
                      letterSpacing: "-0.02em",
                      marginBottom: 6,
                    }}
                  >
                    Book your session
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: tk.text3,
                      marginBottom: 28,
                      lineHeight: 1.55,
                    }}
                  >
                    30 minutes. No deck, no sales pitch. A live walkthrough
                    built around your institution.
                  </p>

                  {error && (
                    <div
                      style={{
                        fontSize: 13,
                        color: tk.error,
                        background: tk.errorSubtle,
                        border: `1px solid ${tk.errorBorder}`,
                        borderRadius: 9,
                        padding: "10px 14px",
                        marginBottom: 20,
                        lineHeight: 1.5,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Field label="Full name">
                      <TextInput
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </Field>
                    <Field label="Work email">
                      <TextInput
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@institution.edu"
                      />
                    </Field>
                    <Field label="Institution name">
                      <TextInput
                        required
                        value={schName}
                        onChange={(e) => setSchName(e.target.value)}
                        placeholder="School, college, or university"
                      />
                    </Field>

                    <div
                      className="demo-grid-two"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <Field label="Date">
                        <TextInput
                          required
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </Field>
                      <Field label="Time">
                        <div style={{position: "relative"}}>
                          <select
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="demo-select"
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              background: tk.bg2,
                              border: `1px solid ${tk.border}`,
                              borderRadius: 10,
                              padding: "11px 36px 11px 14px",
                              fontSize: 14,
                              color: time ? tk.text1 : tk.text3,
                              outline: "none",
                              appearance: "none",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "border-color 0.18s",
                            }}
                            onFocus={(e) =>
                              (e.currentTarget.style.borderColor =
                                tk.borderAccent)
                            }
                            onBlur={(e) =>
                              (e.currentTarget.style.borderColor = tk.border)
                            }
                          >
                            <option value="">Pick a slot</option>
                            {timeSlots.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <span
                            style={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                              pointerEvents: "none",
                              color: tk.text3,
                            }}
                          >
                            <ChevronDown />
                          </span>
                        </div>
                      </Field>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      onMouseEnter={() => setBtnHov(true)}
                      onMouseLeave={() => setBtnHov(false)}
                      style={{
                        width: "100%",
                        padding: "13px 24px",
                        background: btnHov ? tk.accentHov : tk.accent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 24,
                        fontFamily: "inherit",
                        letterSpacing: "-0.01em",
                        opacity: isLoading ? 0.65 : 1,
                        transform:
                          btnHov && !isLoading
                            ? "translateY(-1px)"
                            : "translateY(0)",
                        boxShadow:
                          btnHov && !isLoading
                            ? "0 8px 24px rgba(79,110,247,0.32)"
                            : "0 2px 8px rgba(79,110,247,0.16)",
                        transition:
                          "background 0.18s, transform 0.18s, box-shadow 0.18s, opacity 0.18s",
                      }}
                    >
                      {isLoading ? "Scheduling..." : "Confirm session"}
                      {!isLoading && <ArrowRight />}
                    </button>
                  </form>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginTop: 16,
                      padding: "12px 14px",
                      background: tk.bg2,
                      borderRadius: 10,
                      border: `1px solid ${tk.border}`,
                    }}
                  >
                    <span
                      style={{color: tk.text3, flexShrink: 0, marginTop: 1}}
                    >
                      <VideoIcon />
                    </span>
                    <span
                      style={{fontSize: 12, color: tk.text3, lineHeight: 1.6}}
                    >
                      Google Meet link sent immediately after booking. No
                      software to install. Bring up to 3 colleagues to the same
                      session.
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 11,
                      color: tk.text3,
                      marginTop: 14,
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    By booking you agree to our privacy policy. We will not
                    share your data with third parties.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1120,
            margin: "0 auto",
          }}
        />
      </div>
    </>
  );
};

export default Demo;
