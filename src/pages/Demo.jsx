import React, {useState, useEffect, useRef} from "react";
import {useAuthStore} from "../store/authStore";
import {useSubStore} from "../store/subsidiary";
import Navigation from "./components/navigation";

// ─── Design tokens ──────────────────────────────────────────────────────────
const tokens = {
  surface0: "#0A0B0D",
  surface1: "#111318",
  surface2: "#181B22",
  surface3: "#1E222C",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  text1: "#F0F2F7",
  text2: "#8B8FA8",
  text3: "#5A5E72",
  accent: "#4F6EF7",
  accentSubtle: "rgba(79,110,247,0.12)",
  accentBorder: "rgba(79,110,247,0.35)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.10)",
};

// ─── Inline styles (updated to work with fixed navbar) ──────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: tokens.surface0,
    color: tokens.text1,
    fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
    paddingTop: "68px", // space for fixed navbar
  },
  hero: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "88px 48px 64px",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 500,
    color: tokens.accent,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 24,
    background: tokens.accentSubtle,
    border: `1px solid ${tokens.accentBorder}`,
    borderRadius: 20,
    padding: "5px 12px",
  },
  heroTitle: {
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 600,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: tokens.text1,
    marginBottom: 20,
    maxWidth: 640,
  },
  heroSub: {
    fontSize: 17,
    lineHeight: 1.65,
    color: tokens.text2,
    maxWidth: 520,
    marginBottom: 48,
  },
  statsRow: {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: 600,
    color: tokens.text1,
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontSize: 12,
    color: tokens.text3,
    fontWeight: 500,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    background: tokens.border,
    maxWidth: 1120,
    margin: "0 auto",
  },
  main: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "64px 48px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    gap: 48,
    alignItems: "start",
  },
  panel: {
    background: tokens.surface1,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    padding: 32,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: tokens.text2,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  contactCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    background: tokens.surface2,
    border: `1px solid ${tokens.border}`,
    borderRadius: 12,
    marginBottom: 12,
    textDecoration: "none",
    transition: "border-color 0.2s, background 0.2s",
    cursor: "pointer",
  },
  iconBox: (color) => ({
    width: 40,
    height: 40,
    borderRadius: 10,
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
  contactTitle: {
    fontSize: 12,
    color: tokens.text3,
    fontWeight: 500,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.text1,
  },
  benefitRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 0",
    borderBottom: `1px solid ${tokens.border}`,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    background: tokens.successSubtle,
    border: `1px solid rgba(34,197,94,0.25)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  benefitText: {
    fontSize: 14,
    color: tokens.text2,
    lineHeight: 1.5,
  },
  benefitStrong: {
    color: tokens.text1,
    fontWeight: 500,
  },
  formCard: {
    background: tokens.surface1,
    border: `1px solid ${tokens.border}`,
    borderRadius: 16,
    padding: 36,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: tokens.text1,
    letterSpacing: "-0.02em",
    marginBottom: 6,
  },
  formSub: {
    fontSize: 13,
    color: tokens.text3,
    marginBottom: 32,
    lineHeight: 1.5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: tokens.text2,
    marginBottom: 7,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    background: tokens.surface2,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: tokens.text1,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  selectWrap: {
    position: "relative",
  },
  select: {
    width: "100%",
    background: tokens.surface2,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 14,
    color: tokens.text1,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  chevron: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: tokens.text3,
  },
  submitBtn: {
    width: "100%",
    padding: "13px 24px",
    background: tokens.accent,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background 0.2s, transform 0.1s",
    marginTop: 28,
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
  },
  formNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 16,
    padding: "12px 14px",
    background: tokens.surface2,
    borderRadius: 10,
    border: `1px solid ${tokens.border}`,
  },
  noteText: {
    fontSize: 12,
    color: tokens.text3,
    lineHeight: 1.55,
  },
  successState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "40px 16px",
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: tokens.successSubtle,
    border: `1px solid rgba(34,197,94,0.25)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: tokens.text1,
    letterSpacing: "-0.02em",
    marginBottom: 10,
  },
  successBody: {
    fontSize: 14,
    color: tokens.text2,
    lineHeight: 1.65,
    marginBottom: 28,
    maxWidth: 340,
  },
  resetBtn: {
    padding: "10px 22px",
    background: tokens.surface3,
    color: tokens.text1,
    border: `1px solid ${tokens.border}`,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmCard: {
    background: tokens.surface2,
    border: `1px solid ${tokens.accentBorder}`,
    borderRadius: 12,
    padding: "16px 20px",
    marginTop: 24,
    textAlign: "left",
    width: "100%",
  },
  confirmLabel: {
    fontSize: 11,
    color: tokens.text3,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  confirmRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottom: `1px solid ${tokens.border}`,
  },
  confirmKey: {
    color: tokens.text3,
  },
  confirmVal: {
    color: tokens.text1,
    fontWeight: 500,
  },
};

// ─── Micro-components (icons) ───────────────────────────────────────────────
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.6 19.79 19.79 0 0 1 1.59 4.1 2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const VideoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const ArrowRight = ({size = 14}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = ({size = 11, color = tokens.success}) => (
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

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Hook: focus styles ──────────────────────────────────────────────────────
function useFocusStyle(base) {
  const [focused, setFocused] = useState(false);
  return {
    style: {
      ...base,
      borderColor: focused ? tokens.accent : tokens.border,
      background: focused ? "rgba(79,110,247,0.04)" : tokens.surface2,
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}

// ─── Field Components ────────────────────────────────────────────────────────
function Field({label, children}) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({value, onChange, placeholder, type = "text", required}) {
  const focus = useFocusStyle(s.input);
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...focus}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const Demo = () => {
  const {user, isLoading: authLoading, logout, checkAuth} = useAuthStore();
  const {bookSess, isLoading, error} = useSubStore();

  const [date, setSelectedDate] = useState("");
  const [time, setSelectedTime] = useState("");
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schName, setInstitution] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Navigation props
  const userName = user || "Guest";
  const institutionName = "St. Mary's Academy";
  const notificationCount = 3;

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
        window.location.href = "/login";
      }
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
      title: "Live timetable generation",
      desc: "Watch Protiba resolve 600+ constraints in real time — rooms, teachers, periods, and clashes handled automatically.",
    },
    {
      title: "Tailored to your institution",
      desc: "We configure a demo with your actual structure: departments, subjects, and staffing model.",
    },
    {
      title: "Direct Q&A with founders",
      desc: "No sales scripts. Talk directly with the engineers who built the product.",
    },
    {
      title: "Conflict detection showcase",
      desc: "See how Protiba surfaces double-bookings, overloaded teachers, and policy violations instantly.",
    },
    {
      title: "Implementation & pricing walkthrough",
      desc: "Get a clear timeline and a quote scoped to your institution size.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookSess(fullName, email, schName, date, time);
    setIsSubmitted(true);
  };

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  });

  const firstName = user ? user.split(" ")[0] : "there";

  if (authLoading) {
    return (
      <div
        style={{
          background: tokens.surface0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="demo-loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          .demo-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(79,110,247,0.2);
            border-top-color: #4F6EF7;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
        `}
      </style>

      {/* Navigation component – replaces old nav bar */}
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      <div style={s.root}>
        {/* ── Hero ── */}
        <div style={s.hero}>
          <div style={fadeIn(0)}>
            <div style={s.eyebrow}>
              <VideoIcon />
              30-minute live session
            </div>
          </div>

          <div style={fadeIn(80)}>
            <h1 style={s.heroTitle}>
              {firstName}, see your timetable generate itself.
            </h1>
          </div>

          <div style={fadeIn(140)}>
            <p style={s.heroSub}>
              Book a session and watch Protiba process your institution's
              constraints — subjects, rooms, teachers, periods — and produce a
              conflict-free schedule in under a minute.
            </p>
          </div>

          <div style={{...s.statsRow, ...fadeIn(200)}}>
            {[
              {n: "500+", l: "Demos conducted"},
              {n: "98%", l: "Satisfaction rate"},
              {n: "<24 h", l: "Confirmation time"},
              {n: "60 sec", l: "Avg. generation time"},
            ].map((st, i) => (
              <div key={i} style={s.stat}>
                <span style={s.statNum}>{st.n}</span>
                <span style={s.statLabel}>{st.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.divider} />

        {/* ── Main content ── */}
        <div style={{...s.main, ...fadeIn(260)}}>
          {/* Left column */}
          <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            {/* Contact */}
            <div style={s.panel}>
              <p style={s.panelTitle}>Contact us directly</p>

              {[
                {
                  id: "phone",
                  icon: <PhoneIcon />,
                  color: "rgba(59,130,246,0.15)",
                  iconColor: "#3B82F6",
                  label: "Call us",
                  value: "(+254) 792 624 342",
                  href: "tel:+254792624342",
                },
                {
                  id: "email",
                  icon: <MailIcon />,
                  color: "rgba(139,92,246,0.15)",
                  iconColor: "#8B5CF6",
                  label: "Email us",
                  value: "allankirimi65@gmail.com",
                  href: "mailto:allankirimi65@gmail.com",
                },
              ].map((c) => (
                <a
                  key={c.id}
                  href={c.href}
                  style={{
                    ...s.contactCard,
                    borderColor:
                      hoveredContact === c.id
                        ? tokens.borderHover
                        : tokens.border,
                    background:
                      hoveredContact === c.id
                        ? tokens.surface3
                        : tokens.surface2,
                  }}
                  onMouseEnter={() => setHoveredContact(c.id)}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  <div style={{...s.iconBox(c.color), color: c.iconColor}}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={s.contactTitle}>{c.label}</div>
                    <div style={s.contactValue}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Benefits */}
            <div style={s.panel}>
              <p style={s.panelTitle}>What happens in the demo</p>
              {benefits.map((b, i) => (
                <div
                  key={i}
                  style={{
                    ...s.benefitRow,
                    borderBottom:
                      i < benefits.length - 1
                        ? `1px solid ${tokens.border}`
                        : "none",
                    paddingTop: i === 0 ? 0 : 12,
                  }}
                >
                  <div style={s.checkBox}>
                    <CheckIcon />
                  </div>
                  <div style={s.benefitText}>
                    <span style={s.benefitStrong}>{b.title} — </span>
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — form */}
          <div style={s.formCard}>
            {isSubmitted ? (
              <div style={s.successState}>
                <div style={s.successIcon}>
                  <CheckIcon size={26} color={tokens.success} />
                </div>
                <h2 style={s.successTitle}>Demo confirmed</h2>
                <p style={s.successBody}>
                  A Google Meet link and calendar invite are on their way to{" "}
                  <strong style={{color: tokens.text1}}>{email}</strong>. We'll
                  see you there.
                </p>

                {/* Confirmation card */}
                <div style={s.confirmCard}>
                  <div style={s.confirmLabel}>Your booking</div>
                  {[
                    ["Name", fullName],
                    ["Institution", schName],
                    ["Date", date],
                    ["Time", time],
                  ].map(([k, v], i) => (
                    <div
                      key={i}
                      style={{
                        ...s.confirmRow,
                        borderBottom:
                          i < 3 ? `1px solid ${tokens.border}` : "none",
                        marginBottom: i < 3 ? 8 : 0,
                        paddingBottom: i < 3 ? 8 : 0,
                      }}
                    >
                      <span style={s.confirmKey}>{k}</span>
                      <span style={s.confirmVal}>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setInstitution("");
                    setSelectedDate("");
                    setSelectedTime("");
                  }}
                  style={s.resetBtn}
                >
                  Book another session
                </button>
              </div>
            ) : (
              <>
                <h2 style={s.formTitle}>Book your session</h2>
                <p style={s.formSub}>
                  30 minutes. No deck, no sales pitch — just a live product
                  walkthrough built around your institution.
                </p>

                {error && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#F87171",
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 20,
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
                      onChange={(e) => setName(e.target.value)}
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
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="School, college, or university"
                    />
                  </Field>

                  <div style={s.gridTwo}>
                    <Field label="Date">
                      <div style={{position: "relative"}}>
                        <TextInput
                          required
                          type="date"
                          value={date}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    </Field>

                    <Field label="Time">
                      <div style={s.selectWrap}>
                        <select
                          required
                          value={time}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          style={s.select}
                        >
                          <option value="">Pick a slot</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span style={s.chevron}>
                          <ChevronDown />
                        </span>
                      </div>
                    </Field>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      ...s.submitBtn,
                      background: btnHover ? "#3D5CE8" : tokens.accent,
                      transform: btnHover
                        ? "translateY(-1px)"
                        : "translateY(0)",
                      boxShadow: btnHover
                        ? "0 8px 24px rgba(79,110,247,0.35)"
                        : "none",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                  >
                    {isLoading ? "Scheduling…" : "Confirm session"}
                    {!isLoading && <ArrowRight />}
                  </button>
                </form>

                <div style={s.formNote}>
                  <span
                    style={{color: tokens.text3, flexShrink: 0, marginTop: 1}}
                  >
                    <VideoIcon />
                  </span>
                  <span style={s.noteText}>
                    Google Meet link sent immediately after booking. No software
                    to install. Invite up to 3 colleagues to the same session.
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 11,
                    color: tokens.text3,
                    marginTop: 14,
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  By booking, you agree to our privacy policy. We will not share
                  your data with third parties.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Footer rule ── */}
        <div style={{...s.divider, marginBottom: 0}} />
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "24px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{fontSize: 12, color: tokens.text3}}>
            © 2025 Protiba. Academic scheduling infrastructure.
          </span>
          <span style={{fontSize: 12, color: tokens.text3}}>
            Kenya · protiba.com
          </span>
        </div>
      </div>
    </>
  );
};

export default Demo;
