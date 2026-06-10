import React, {useState, useEffect} from "react";

const tokens = {
  surface0: "#0A0B0D",
  surface1: "#111318",
  surface2: "#181B22",
  surface3: "#1E222C",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",
  text1: "#F0F2F7",
  text2: "#8B8FA8",
  text3: "#5A5E72",
  accent: "#4F6EF7",
  accentSubtle: "rgba(79,110,247,0.12)",
  accentBorder: "rgba(79,110,247,0.3)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.10)",
  amber: "#F59E0B",
  amberSubtle: "rgba(245,158,11,0.10)",
  amberBorder: "rgba(245,158,11,0.28)",
};

const REFERRAL_LINK = "https://protiba.onrender.com/home";

const TIERS = [
  {
    ref: 1,
    reward: "3 months free — if you refer before the timer ends",
    sub: "Otherwise: 1 month free Premium",
    color: tokens.amber,
    bg: tokens.amberSubtle,
    border: tokens.amberBorder,
  },
  {
    ref: 3,
    reward: "2 months free + your institution in our case studies",
    sub: "Published to 800+ schools in the Protiba network",
    color: tokens.accent,
    bg: tokens.accentSubtle,
    border: tokens.accentBorder,
  },
  {
    ref: 5,
    reward: "Priority support + dedicated onboarding call",
    sub: "Direct line to our engineering team, any time",
    color: tokens.success,
    bg: tokens.successSubtle,
    border: "rgba(34,197,94,0.25)",
  },
  {
    ref: 10,
    reward: "Co-build a feature — your roadmap input ships",
    sub: "Your institution's name in the changelog forever",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.28)",
  },
];

function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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

const ArrowRight = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5A5E72"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function Invite() {
  const [emails, setEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const countdown = useCountdown(47 * 3600 + 23 * 60 + 9);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
  });

  const copyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const addEmail = () => setEmails((e) => [...e, ""]);
  const removeEmail = (i) => setEmails((e) => e.filter((_, idx) => idx !== i));
  const updateEmail = (i, v) =>
    setEmails((e) => {
      const n = [...e];
      n[i] = v;
      return n;
    });

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const st = {
    root: {
      minHeight: "100vh",
      background: tokens.surface0,
      color: tokens.text1,
      fontFamily: "'Inter',system-ui,sans-serif",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px",
      height: 56,
      background: "rgba(10,11,13,0.9)",
      borderBottom: `1px solid ${tokens.border}`,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "-.01em",
    },
    dot: {width: 7, height: 7, borderRadius: "50%", background: tokens.accent},
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      color: tokens.text3,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: tokens.success,
    },
    hero: {maxWidth: 1080, margin: "0 auto", padding: "64px 40px 40px"},
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: 11,
      fontWeight: 500,
      color: tokens.amber,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      marginBottom: 20,
      background: tokens.amberSubtle,
      border: `1px solid ${tokens.amberBorder}`,
      borderRadius: 20,
      padding: "4px 12px",
    },
    h1: {
      fontSize: "clamp(28px,4.2vw,46px)",
      fontWeight: 600,
      lineHeight: 1.06,
      letterSpacing: "-.03em",
      marginBottom: 16,
      maxWidth: 600,
    },
    sub: {
      fontSize: 16,
      lineHeight: 1.65,
      color: tokens.text2,
      maxWidth: 500,
      marginBottom: 40,
    },
    statsRow: {display: "flex", gap: 32, flexWrap: "wrap"},
    stat: {display: "flex", flexDirection: "column", gap: 2},
    statNum: {fontSize: 21, fontWeight: 600, letterSpacing: "-.03em"},
    statLabel: {
      fontSize: 11,
      color: tokens.text3,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      marginTop: 2,
    },
    divider: {
      height: 1,
      background: tokens.border,
      maxWidth: 1080,
      margin: "0 auto",
    },
    main: {
      maxWidth: 1080,
      margin: "0 auto",
      padding: "52px 40px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1.08fr",
      gap: 40,
      alignItems: "start",
    },
    panel: {
      background: tokens.surface1,
      border: `1px solid ${tokens.border}`,
      borderRadius: 14,
      padding: 28,
    },
    panelLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: tokens.text3,
      letterSpacing: ".07em",
      textTransform: "uppercase",
      marginBottom: 20,
    },
    linkBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "13px 16px",
      background: tokens.surface2,
      border: `1px dashed rgba(255,255,255,0.12)`,
      borderRadius: 10,
      cursor: "pointer",
      marginBottom: 16,
    },
    linkText: {
      fontSize: 13,
      color: tokens.text2,
      fontFamily: "monospace",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: 240,
    },
    shareGrid: {display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8},
    shareBtn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
      padding: "12px 8px",
      background: tokens.surface2,
      border: `1px solid ${tokens.border}`,
      borderRadius: 9,
      cursor: "pointer",
      color: tokens.text1,
      fontSize: 12,
      fontWeight: 500,
      fontFamily: "inherit",
    },
    tierCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "16px 0",
      borderBottom: `1px solid ${tokens.border}`,
    },
    iconBox: (bg, border) => ({
      width: 36,
      height: 36,
      borderRadius: 9,
      background: bg,
      border: `1px solid ${border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginTop: 2,
    }),
    tierTitle: {
      fontSize: 13,
      fontWeight: 600,
      color: tokens.text1,
      marginBottom: 2,
    },
    tierSub: {fontSize: 12, color: tokens.text3, lineHeight: 1.5},
    bonusBox: {
      marginTop: 16,
      padding: "13px 15px",
      background: tokens.surface2,
      border: `1px solid ${tokens.amberBorder}`,
      borderRadius: 10,
    },
    bonusLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: tokens.amber,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      marginBottom: 5,
    },
    bonusText: {fontSize: 13, color: "#D4A820", lineHeight: 1.55},
    formCard: {
      background: tokens.surface1,
      border: `1px solid ${tokens.border}`,
      borderRadius: 14,
      padding: 32,
    },
    formTitle: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: "-.02em",
      marginBottom: 6,
    },
    formSub: {
      fontSize: 13,
      color: tokens.text3,
      marginBottom: 28,
      lineHeight: 1.55,
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 500,
      color: tokens.text2,
      marginBottom: 7,
      letterSpacing: ".02em",
    },
    input: {
      width: "100%",
      background: tokens.surface2,
      border: `1px solid ${tokens.border}`,
      borderRadius: 9,
      padding: "10px 13px",
      fontSize: 13,
      color: tokens.text1,
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    textarea: {
      width: "100%",
      background: tokens.surface2,
      border: `1px solid ${tokens.border}`,
      borderRadius: 9,
      padding: "10px 13px",
      fontSize: 13,
      color: tokens.text1,
      outline: "none",
      resize: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    addBtn: {
      fontSize: 12,
      color: tokens.accent,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: 0,
      marginTop: 8,
    },
    removeBtn: {
      width: 32,
      height: 36,
      background: "rgba(226,75,74,0.1)",
      border: "1px solid rgba(226,75,74,0.2)",
      borderRadius: 8,
      color: "#E24B4A",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    submitBtn: {
      width: "100%",
      padding: "12px 24px",
      background: tokens.accent,
      color: "#fff",
      border: "none",
      borderRadius: 9,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 24,
      fontFamily: "inherit",
      letterSpacing: "-.01em",
    },
    howItWorks: {
      marginTop: 18,
      padding: "13px 15px",
      background: tokens.surface2,
      border: `1px solid ${tokens.border}`,
      borderRadius: 10,
    },
    howLabel: {
      fontSize: 11,
      fontWeight: 600,
      color: tokens.text3,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      marginBottom: 10,
    },
    howStep: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      color: tokens.text2,
      marginBottom: 8,
    },
    stepNum: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: tokens.accentSubtle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 600,
      color: tokens.accent,
      flexShrink: 0,
    },
    stepCheck: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: tokens.successSubtle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    successWrap: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "40px 16px",
    },
    successIcon: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      background: tokens.successSubtle,
      border: "1px solid rgba(34,197,94,0.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 22,
    },
    successTitle: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: "-.02em",
      marginBottom: 9,
    },
    successBody: {
      fontSize: 14,
      color: tokens.text2,
      lineHeight: 1.65,
      marginBottom: 22,
      maxWidth: 320,
    },
    bonusRemind: {
      background: tokens.surface2,
      border: `1px solid ${tokens.amberBorder}`,
      borderRadius: 11,
      padding: "14px 18px",
      marginBottom: 20,
      width: "100%",
      textAlign: "left",
    },
    resetBtn: {
      padding: "9px 20px",
      background: tokens.surface3,
      color: tokens.text1,
      border: `1px solid ${tokens.border}`,
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    footer: {
      maxWidth: 1080,
      margin: "0 auto",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
    },
    footerText: {fontSize: 11, color: "#3A3E52"},
  };

  const StarIcon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
  const GlobeIcon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
  const UsersIcon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  const CodeIcon = () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
  const tierIcons = [<StarIcon />, <GlobeIcon />, <UsersIcon />, <CodeIcon />];

  return (
    <div style={st.root}>
      <nav style={st.nav}>
        <div style={st.brand}>
          <div style={st.dot} />
          Protiba
        </div>
        <div style={st.navRight}>
          <div style={st.statusDot} />
          Referral programme active
        </div>
      </nav>

      <div style={{...st.hero, ...fadeIn(0)}}>
        <div style={st.eyebrow}>
          <StarIcon />
          Limited-time referral rewards
        </div>
        <h1 style={st.h1}>
          Every colleague you bring in
          <br />
          earns you real value.
        </h1>
        <p style={st.sub}>
          Share your link. When a school signs up and runs their first
          timetable, your account upgrades automatically — no redemption codes,
          no waiting.
        </p>
        <div style={st.statsRow}>
          {[
            {n: "2,500+", l: "Successful invites"},
            {n: "85%", l: "Acceptance rate"},
            {n: "1,200+", l: "Active referrers"},
            {n: countdown, l: "Until deal expires"},
          ].map((s, i) => (
            <div key={i} style={st.stat}>
              <span style={st.statNum}>{s.n}</span>
              <span style={st.statLabel}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={st.divider} />

      <div style={{...st.main, ...fadeIn(120)}}>
        <div style={{display: "flex", flexDirection: "column", gap: 14}}>
          {/* Referral link */}
          <div style={st.panel}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <p style={{...st.panelLabel, marginBottom: 0}}>
                Your referral link
              </p>
              <span
                style={{
                  fontSize: 11,
                  color: tokens.success,
                  opacity: copied ? 1 : 0,
                  transition: "opacity .3s",
                }}
              >
                Copied!
              </span>
            </div>
            <div style={st.linkBox} onClick={copyLink}>
              <span style={st.linkText}>{REFERRAL_LINK}</span>
              <CopyIcon />
            </div>
            <div style={st.shareGrid}>
              {[
                {
                  label: "Email",
                  action: () =>
                    window.open(
                      `mailto:?subject=Try Protiba — school timetabling that actually works&body=Hey,%0A%0AI've been using Protiba. Here's my link: ${REFERRAL_LINK}`,
                    ),
                },
                {
                  label: "WhatsApp",
                  action: () =>
                    window.open(
                      `https://wa.me/?text=I use Protiba to automate our timetable. Worth a look: ${REFERRAL_LINK}`,
                    ),
                },
                {label: "Copy link", action: copyLink},
              ].map((btn, i) => (
                <button key={i} style={st.shareBtn} onClick={btn.action}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiers */}
          <div style={st.panel}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <p style={{...st.panelLabel, marginBottom: 0}}>Reward tiers</p>
              <span
                style={{fontSize: 12, color: tokens.accent, fontWeight: 500}}
              >
                0 of 10 referrals
              </span>
            </div>

            {TIERS.map((t, i) => (
              <div
                key={i}
                style={{
                  ...st.tierCard,
                  borderBottom:
                    i < TIERS.length - 1
                      ? `1px solid ${tokens.border}`
                      : "none",
                  opacity: i > 0 ? 0.45 : 1,
                  paddingTop: i === 0 ? 0 : 14,
                }}
              >
                <div style={{...st.iconBox(t.bg, t.border), color: t.color}}>
                  {tierIcons[i]}
                </div>
                <div>
                  <div style={{...st.tierTitle}}>{t.reward}</div>
                  <div style={st.tierSub}>{t.sub}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: t.color,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {t.ref} referral{t.ref > 1 ? "s" : ""} needed
                  </div>
                </div>
              </div>
            ))}

            <div style={st.bonusBox}>
              <div style={st.bonusLabel}>⚡ Bonus deal — active now</div>
              <div style={st.bonusText}>
                Refer your first school{" "}
                <strong style={{color: "#FBBF24"}}>
                  before the timer runs out
                </strong>{" "}
                and get 3 months free instead of 1. No minimum after that.
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={st.formCard}>
          {sent ? (
            <div style={st.successWrap}>
              <div style={st.successIcon}>
                <CheckIcon size={24} />
              </div>
              <h2 style={st.successTitle}>Invitations sent</h2>
              <p style={st.successBody}>
                Each recipient got your personal link. Once they run their first
                timetable, your reward unlocks automatically.
              </p>
              <div style={st.bonusRemind}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: tokens.amber,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  ⚡ Don't forget your bonus window
                </div>
                <div style={{fontSize: 13, color: "#D4A820", lineHeight: 1.55}}>
                  Your first successful referral — if it converts before the
                  timer hits zero — earns{" "}
                  <strong style={{color: "#FBBF24"}}>3 months free</strong>{" "}
                  instead of 1.
                </div>
              </div>
              <button
                style={st.resetBtn}
                onClick={() => {
                  setSent(false);
                  setEmails([""]);
                  setMessage("");
                }}
              >
                Send more invites
              </button>
            </div>
          ) : (
            <>
              <h2 style={st.formTitle}>Send invitations</h2>
              <p style={st.formSub}>
                Each address gets a personalised invite with your referral link
                attached automatically.
              </p>
              <form onSubmit={handleSend}>
                <div style={{marginBottom: 18}}>
                  <label style={st.label}>Email addresses</label>
                  {emails.map((email, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(i, e.target.value)}
                        placeholder="colleague@school.edu"
                        style={st.input}
                      />
                      {emails.length > 1 && (
                        <button
                          type="button"
                          style={st.removeBtn}
                          onClick={() => removeEmail(i)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" style={st.addBtn} onClick={addEmail}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add another address
                  </button>
                </div>
                <div style={{marginBottom: 4}}>
                  <label style={st.label}>Personal note (optional)</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add context — mention which problem Protiba solved for you."
                    style={st.textarea}
                  />
                </div>
                <button type="submit" style={st.submitBtn}>
                  Send invitations <SendIcon />
                </button>
              </form>
              <div style={st.howItWorks}>
                <div style={st.howLabel}>How it works</div>
                <div style={st.howStep}>
                  <div style={st.stepNum}>1</div> They click your link and
                  create an account
                </div>
                <div style={st.howStep}>
                  <div style={st.stepNum}>2</div> Their institution runs its
                  first timetable
                </div>
                <div style={{...st.howStep, marginBottom: 0}}>
                  <div style={st.stepCheck}>
                    <CheckIcon size={10} />
                  </div>
                  <span style={{color: tokens.text1, fontWeight: 500}}>
                    Your reward unlocks instantly
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={st.divider} />
      <div style={st.footer}>
        <span style={st.footerText}>
          © 2025 Protiba. Academic scheduling infrastructure.
        </span>
        <span style={st.footerText}>Kenya · protiba.com</span>
      </div>
    </div>
  );
}
