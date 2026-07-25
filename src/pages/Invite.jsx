import React, {useState, useEffect, useRef} from "react";
import {useAuthStore} from "../store/authStore";
import Navigation from "./components/navigation";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const tk = {
  bg0: "#09090C",
  bg1: "#0F1015",
  bg2: "#14151C",
  bg3: "#1A1B25",
  bg4: "#1F2130",
  border: "rgba(255,255,255,0.06)",
  borderHov: "rgba(255,255,255,0.12)",
  borderAccent: "rgba(79,110,247,0.36)",
  borderAmber: "rgba(245,158,11,0.28)",
  text1: "#EDEEF5",
  text2: "#8B90AA",
  text3: "#52566A",
  accent: "#4F6EF7",
  accentHov: "#3D5CE8",
  accentSubtle: "rgba(79,110,247,0.09)",
  amber: "#F59E0B",
  amberHov: "#D97706",
  amberSubtle: "rgba(245,158,11,0.08)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.08)",
  successBorder: "rgba(34,197,94,0.22)",
  violet: "#8B5CF6",
  violetSubtle: "rgba(139,92,246,0.09)",
  violetBorder: "rgba(139,92,246,0.26)",
  danger: "#E24B4A",
  dangerSubtle: "rgba(226,75,74,0.08)",
  dangerBorder: "rgba(226,75,74,0.2)",
};

const REFERRAL_LINK = "https://protiba.onrender.com/home";

const TIERS = [
  {
    ref: 1,
    reward: "3 months free",
    sub: "Refer before the timer ends. Otherwise: 1 month free Premium.",
    color: tk.amber,
    bg: tk.amberSubtle,
    border: tk.borderAmber,
  },
  {
    ref: 3,
    reward: "2 months free + case study feature",
    sub: "Your institution published to 800+ schools in the Protiba network.",
    color: tk.accent,
    bg: tk.accentSubtle,
    border: tk.borderAccent,
  },
  {
    ref: 5,
    reward: "Priority support + onboarding call",
    sub: "Direct line to our engineering team, any time.",
    color: tk.success,
    bg: tk.successSubtle,
    border: tk.successBorder,
  },
  {
    ref: 10,
    reward: "Co-build a feature with us",
    sub: "Your institution's name in the changelog, permanently.",
    color: tk.violet,
    bg: tk.violetSubtle,
    border: tk.violetBorder,
  },
];

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

// ─── Countdown ────────────────────────────────────────────────────────────────

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

// ─── Icons ────────────────────────────────────────────────────────────────────

const Svg = ({
  size = 15,
  strokeWidth = 1.8,
  children,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const CheckIcon = ({size = 11, color = tk.success}) => (
  <Svg size={size} strokeWidth={2.5} color={color}>
    <polyline points="20 6 9 17 4 12" />
  </Svg>
);

const ArrowRight = ({size = 13}) => (
  <Svg size={size} strokeWidth={2.2}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);

const SendIcon = ({size = 13}) => (
  <Svg size={size} strokeWidth={2.2}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Svg>
);

const CopyIcon = ({size = 14, color = tk.text3}) => (
  <Svg size={size} strokeWidth={1.8} color={color}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Svg>
);

const StarIcon = ({size = 15}) => (
  <Svg size={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const GlobeIcon = ({size = 15}) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const UsersIcon = ({size = 15}) => (
  <Svg size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const CodeIcon = ({size = 15}) => (
  <Svg size={size}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </Svg>
);

const PlusIcon = ({size = 12}) => (
  <Svg size={size} strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const XIcon = ({size = 12}) => (
  <Svg size={size} strokeWidth={2.5}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

const ClockIcon = ({size = 14}) => (
  <Svg size={size} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);

const MailIcon = ({size = 14}) => (
  <Svg size={size} strokeWidth={1.8}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </Svg>
);

const WhatsAppIcon = ({size = 14}) => (
  <Svg size={size} strokeWidth={1.7}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

const LinkIcon = ({size = 14}) => (
  <Svg size={size} strokeWidth={1.8}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

const tierIcons = [<StarIcon />, <GlobeIcon />, <UsersIcon />, <CodeIcon />];

// ─── Panel ────────────────────────────────────────────────────────────────────

function Panel({title, right, children, style = {}}) {
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
      {(title || right) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
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
                margin: 0,
              }}
            >
              {title}
            </p>
          )}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── FocusInput ───────────────────────────────────────────────────────────────

function FocusInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  style = {},
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
        border: `1px solid ${focused ? tk.borderAccent : tk.border}`,
        borderRadius: 9,
        padding: "10px 13px",
        fontSize: 13,
        color: tk.text1,
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.18s, background 0.18s",
        ...style,
      }}
    />
  );
}

function FocusTextarea({value, onChange, placeholder, rows = 3}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: focused ? "rgba(79,110,247,0.04)" : tk.bg2,
        border: `1px solid ${focused ? tk.borderAccent : tk.border}`,
        borderRadius: 9,
        padding: "10px 13px",
        fontSize: 13,
        color: tk.text1,
        outline: "none",
        resize: "none",
        fontFamily: "inherit",
        transition: "border-color 0.18s, background 0.18s",
      }}
    />
  );
}

// ─── ShareButton ──────────────────────────────────────────────────────────────

function ShareBtn({icon, label, onClick}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "12px 8px",
        background: hov ? tk.bg3 : tk.bg2,
        border: `1px solid ${hov ? tk.borderHov : tk.border}`,
        borderRadius: 10,
        cursor: "pointer",
        color: hov ? tk.text1 : tk.text2,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "inherit",
        transition: "all 0.18s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── TierCard ─────────────────────────────────────────────────────────────────

function TierCard({tier, icon, index, isActive, totalReferrals}) {
  const unlocked = totalReferrals >= tier.ref;
  const isCurrent = index === 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "15px 0",
        borderBottom:
          index < TIERS.length - 1 ? `1px solid ${tk.border}` : "none",
        opacity: isActive ? 1 : 0.4,
        transition: "opacity 0.2s",
        paddingTop: index === 0 ? 0 : 15,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          flexShrink: 0,
          marginTop: 2,
          background: tier.bg,
          border: `1px solid ${tier.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tier.color,
        }}
      >
        {icon}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: tk.text1,
            marginBottom: 3,
          }}
        >
          {tier.reward}
        </div>
        <div style={{fontSize: 12, color: tk.text3, lineHeight: 1.55}}>
          {tier.sub}
        </div>
        <div
          style={{
            fontSize: 11,
            color: tier.color,
            fontWeight: 600,
            marginTop: 5,
          }}
        >
          {tier.ref} referral{tier.ref > 1 ? "s" : ""} needed
        </div>
      </div>
      {unlocked && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            flexShrink: 0,
            background: tk.successSubtle,
            border: `1px solid ${tk.successBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <CheckIcon size={10} />
        </div>
      )}
    </div>
  );
}

// ─── HowItWorks ───────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <div
      style={{
        marginTop: 20,
        padding: "14px 16px",
        background: tk.bg2,
        border: `1px solid ${tk.border}`,
        borderRadius: 11,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: tk.text3,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        How it works
      </p>
      {[
        {step: "1", text: "They click your link and create an account"},
        {step: "2", text: "Their institution runs its first timetable"},
      ].map(({step, text}) => (
        <div
          key={step}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: tk.text2,
            marginBottom: 9,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              flexShrink: 0,
              background: tk.accentSubtle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: tk.accent,
            }}
          >
            {step}
          </div>
          {text}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: tk.text1,
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            flexShrink: 0,
            background: tk.successSubtle,
            border: `1px solid ${tk.successBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckIcon size={10} />
        </div>
        Your reward unlocks instantly
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Invite() {
  const {user, isLoading: authLoading} = useAuthStore();
  const [emails, setEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitHov, setSubmitHov] = useState(false);

  const countdown = useCountdown(47 * 3600 + 23 * 60 + 9);

  const [heroRef, heroInView] = useInView(0.05);
  const [leftRef, leftInView] = useInView(0.05);
  const [formRef, formInView] = useInView(0.05);

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const handleLogout = async () => {
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
      console.error("Logout error", err);
    }
  };

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
            gap: 14,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `2px solid ${tk.accentSubtle}`,
              borderTopColor: tk.accent,
              animation: "spin 0.75s linear infinite",
            }}
          />
          <span style={{fontSize: 12, color: tk.text3}}>Loading</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes ticker { 0%{opacity:.7} 50%{opacity:1} 100%{opacity:.7} }

        * { box-sizing: border-box; }

        .invite-select option { background: #14151C; color: #EDEEF5; }

        @media (max-width: 860px) {
          .invite-main-grid { grid-template-columns: 1fr !important; }
          .invite-hero { padding: 52px 20px 44px !important; }
          .invite-stats-row { gap: 12px !important; }
          .invite-stat-chip {
            flex: 1 1 0 !important;
            min-width: 100px !important;
          }
          .invite-stat-chip.countdown-chip {
            flex-basis: 100% !important;
            min-width: 100% !important;
          }
          .invite-main-wrap { padding: 32px 20px 64px !important; }
          .invite-footer { flex-direction: column !important; gap: 6px !important; text-align: center; }
        }

        @media (max-width: 480px) {
          .invite-hero { padding: 44px 16px 36px !important; }
          .invite-main-wrap { padding: 24px 16px 52px !important; }
          .invite-share-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
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
        {/* Ambient glows */}
        <div
          style={{
            position: "fixed",
            top: -200,
            left: -100,
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 65%)",
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
              "radial-gradient(circle, rgba(79,110,247,0.04) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          className="invite-hero"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "72px 40px 52px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 500,
              color: tk.amber,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              background: tk.amberSubtle,
              border: `1px solid ${tk.borderAmber}`,
              borderRadius: 20,
              padding: "5px 13px",
              marginBottom: 22,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <StarIcon size={12} />
            Limited-time referral rewards
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(28px, 4.2vw, 46px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: tk.text1,
              marginBottom: 16,
              maxWidth: 580,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s",
            }}
          >
            Every colleague you bring in
            <br />
            earns you real value.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: tk.text2,
              maxWidth: 480,
              marginBottom: 40,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.16s, transform 0.55s ease 0.16s",
            }}
          >
            Share your link. When a school signs up and runs their first
            timetable, your account upgrades automatically. No redemption codes,
            no waiting.
          </p>

          {/* Stats */}
          <div
            className="invite-stats-row"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              opacity: heroInView ? 1 : 0,
              transition: "opacity 0.55s ease 0.24s",
            }}
          >
            {[
              {n: "2,500+", l: "Successful invites", countdown: false},
              {n: "85%", l: "Acceptance rate", countdown: false},
              {n: "1,200+", l: "Active referrers", countdown: false},
              {n: countdown, l: "Until deal expires", countdown: true},
            ].map((s, i) => (
              <div
                key={i}
                className={`invite-stat-chip${s.countdown ? " countdown-chip" : ""}`}
                style={{
                  padding: "14px 18px",
                  background: s.countdown ? tk.amberSubtle : tk.bg2,
                  border: `1px solid ${s.countdown ? tk.borderAmber : tk.border}`,
                  borderRadius: 12,
                  minWidth: 100,
                  animation: s.countdown
                    ? "ticker 2s ease-in-out infinite"
                    : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: s.countdown ? tk.amber : tk.text1,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: s.countdown ? tk.amber : tk.text3,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    opacity: s.countdown ? 0.75 : 1,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1080,
            margin: "0 auto",
          }}
        />

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div
          className="invite-main-wrap"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "48px 40px 80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="invite-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.08fr",
              gap: 36,
              alignItems: "start",
            }}
          >
            {/* ── Left column ───────────────────────────────────────────────── */}
            <div
              ref={leftRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              {/* Referral link */}
              <Panel
                title="Your referral link"
                right={
                  <span
                    style={{
                      fontSize: 11,
                      color: tk.success,
                      opacity: copied ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    Copied
                  </span>
                }
              >
                {/* Link box */}
                <div
                  onClick={copyLink}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: tk.bg2,
                    border: `1px solid ${tk.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    marginBottom: 14,
                    transition: "border-color 0.18s, background 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tk.borderHov;
                    e.currentTarget.style.background = tk.bg3;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tk.border;
                    e.currentTarget.style.background = tk.bg2;
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: tk.text2,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 220,
                    }}
                  >
                    {REFERRAL_LINK}
                  </span>
                  <CopyIcon color={copied ? tk.success : tk.text3} />
                </div>

                {/* Share buttons */}
                <div
                  className="invite-share-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  <ShareBtn
                    icon={<MailIcon />}
                    label="Email"
                    onClick={() =>
                      window.open(
                        `mailto:?subject=Try Protiba&body=I use Protiba to automate our timetable. Worth a look: ${REFERRAL_LINK}`,
                      )
                    }
                  />
                  <ShareBtn
                    icon={<WhatsAppIcon />}
                    label="WhatsApp"
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=I use Protiba to automate our timetable. Here is my link: ${REFERRAL_LINK}`,
                      )
                    }
                  />
                  <ShareBtn
                    icon={<LinkIcon />}
                    label="Copy link"
                    onClick={copyLink}
                  />
                </div>
              </Panel>

              {/* Reward tiers */}
              <Panel
                title="Reward tiers"
                right={
                  <span
                    style={{fontSize: 12, color: tk.accent, fontWeight: 500}}
                  >
                    0 of 10 referrals
                  </span>
                }
              >
                {TIERS.map((t, i) => (
                  <TierCard
                    key={i}
                    tier={t}
                    icon={tierIcons[i]}
                    index={i}
                    isActive={i === 0}
                    totalReferrals={0}
                  />
                ))}

                {/* Bonus deal — no emoji, icon instead */}
                <div
                  style={{
                    marginTop: 16,
                    padding: "13px 15px",
                    background: tk.amberSubtle,
                    border: `1px solid ${tk.borderAmber}`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 6,
                    }}
                  >
                    <ClockIcon size={12} color={tk.amber} />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: tk.amber,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                      }}
                    >
                      Bonus deal active now
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#D4A820",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Refer your first school before the timer runs out and get{" "}
                    <strong style={{color: "#FBBF24"}}>3 months free</strong>{" "}
                    instead of 1. No minimum after that.
                  </p>
                </div>
              </Panel>
            </div>

            {/* ── Right column — form ───────────────────────────────────────── */}
            <div
              ref={formRef}
              style={{
                background: tk.bg1,
                border: `1px solid ${tk.border}`,
                borderRadius: 18,
                padding: 32,
                position: "relative",
                overflow: "hidden",
                opacity: formInView ? 1 : 0,
                transform: formInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${tk.borderAmber}, transparent)`,
                }}
              />

              {sent ? (
                /* ── Success ─────────────────────────────────────────────── */
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
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      background: tk.successSubtle,
                      border: `1px solid ${tk.successBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <CheckIcon size={24} />
                  </div>

                  <h2
                    style={{
                      fontSize: 19,
                      fontWeight: 600,
                      color: tk.text1,
                      letterSpacing: "-0.02em",
                      marginBottom: 9,
                    }}
                  >
                    Invitations sent
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: tk.text2,
                      lineHeight: 1.7,
                      marginBottom: 24,
                      maxWidth: 310,
                    }}
                  >
                    Each recipient got your personal link. Once they run their
                    first timetable, your reward unlocks automatically.
                  </p>

                  {/* Bonus reminder */}
                  <div
                    style={{
                      background: tk.amberSubtle,
                      border: `1px solid ${tk.borderAmber}`,
                      borderRadius: 11,
                      padding: "14px 16px",
                      marginBottom: 22,
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 7,
                      }}
                    >
                      <ClockIcon size={12} color={tk.amber} />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: tk.amber,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                        }}
                      >
                        Bonus window still open
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#D4A820",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      Your first successful referral earns{" "}
                      <strong style={{color: "#FBBF24"}}>3 months free</strong>{" "}
                      instead of 1 — if it converts before the timer hits zero.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSent(false);
                      setEmails([""]);
                      setMessage("");
                    }}
                    style={{
                      padding: "9px 22px",
                      background: tk.bg3,
                      color: tk.text1,
                      border: `1px solid ${tk.border}`,
                      borderRadius: 9,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "border-color 0.18s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = tk.borderHov)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = tk.border)
                    }
                  >
                    Send more invites
                  </button>
                </div>
              ) : (
                /* ── Form ─────────────────────────────────────────────────── */
                <>
                  <h2
                    style={{
                      fontSize: 19,
                      fontWeight: 600,
                      color: tk.text1,
                      letterSpacing: "-0.02em",
                      marginBottom: 6,
                    }}
                  >
                    Send invitations
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: tk.text3,
                      marginBottom: 26,
                      lineHeight: 1.55,
                    }}
                  >
                    Each address gets a personalised invite with your referral
                    link attached automatically.
                  </p>

                  <form onSubmit={handleSend}>
                    <div style={{marginBottom: 18}}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 500,
                          color: tk.text2,
                          marginBottom: 8,
                          letterSpacing: "0.02em",
                        }}
                      >
                        Email addresses
                      </label>

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
                          <FocusInput
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(i, e.target.value)}
                            placeholder="colleague@school.edu"
                          />
                          {emails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmail(i)}
                              style={{
                                width: 32,
                                height: 36,
                                flexShrink: 0,
                                background: tk.dangerSubtle,
                                border: `1px solid ${tk.dangerBorder}`,
                                borderRadius: 8,
                                color: tk.danger,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background 0.18s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  "rgba(226,75,74,0.14)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  tk.dangerSubtle)
                              }
                            >
                              <XIcon />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEmail}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: tk.accent,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          padding: 0,
                          marginTop: 4,
                          transition: "color 0.18s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = tk.accentHov)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = tk.accent)
                        }
                      >
                        <PlusIcon />
                        Add another address
                      </button>
                    </div>

                    <div style={{marginBottom: 4}}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 500,
                          color: tk.text2,
                          marginBottom: 8,
                          letterSpacing: "0.02em",
                        }}
                      >
                        Personal note (optional)
                      </label>
                      <FocusTextarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add context. Mention which problem Protiba solved for you."
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => setSubmitHov(true)}
                      onMouseLeave={() => setSubmitHov(false)}
                      style={{
                        width: "100%",
                        padding: "12px 24px",
                        background: submitHov ? tk.accentHov : tk.accent,
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
                        marginTop: 22,
                        fontFamily: "inherit",
                        letterSpacing: "-0.01em",
                        transform: submitHov
                          ? "translateY(-1px)"
                          : "translateY(0)",
                        boxShadow: submitHov
                          ? "0 8px 24px rgba(79,110,247,0.3)"
                          : "0 2px 8px rgba(79,110,247,0.14)",
                        transition:
                          "background 0.18s, transform 0.18s, box-shadow 0.18s",
                      }}
                    >
                      Send invitations
                      <SendIcon />
                    </button>
                  </form>

                  <HowItWorks />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1080,
            margin: "0 auto",
          }}
        />

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div
          className="invite-footer"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "22px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{fontSize: 11, color: tk.text3}}>
            2025 Protiba. Academic scheduling infrastructure.
          </span>
          <span style={{fontSize: 11, color: tk.text3}}>
            Kenya · protiba.com
          </span>
        </div>
      </div>
    </>
  );
}
