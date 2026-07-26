import React, {useState, useRef, useEffect} from "react";
import {useAuthStore} from "../store/authStore";
import Navigation from "./components/navigation";

// ─── Brand tokens (light, premium) ────────────────────────────────────────────
const C = {
  bg: "#F8F8F8",
  bg1: "#FFFFFF",
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
  accentL: "#5C5C5C",
  green: "#22C55E",
  greenG: "rgba(34,197,94,0.08)",
  greenB: "rgba(34,197,94,0.18)",
  red: "#F87171",
  redG: "rgba(248,113,113,0.08)",
  redB: "rgba(248,113,113,0.18)",
  purple: "#8B5CF6",
  purpleG: "rgba(139,92,246,0.08)",
  purpleB: "rgba(139,92,246,0.18)",
  amber: "#F59E0B",
  amberG: "rgba(245,158,11,0.08)",
  amberB: "rgba(245,158,11,0.18)",
};

// ─── CSS (light theme, same structure) ────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideInToast { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes panelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .acct-spinner {
    width: 36px; height: 36px;
    border: 2.5px solid ${C.border};
    border-top-color: ${C.accent};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .acct-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    align-items: start;
  }
  .acct-sidebar {
    position: sticky;
    top: 80px;
  }

  .acct-nav { display: flex; flex-direction: column; gap: 2px; }
  .acct-nav-badge-hide { }

  .fg2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 14px; }
  .fg4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 14px; }

  .sec-body { padding: 22px; }

  .toast-pos { position: fixed; bottom: 28px; right: 28px; z-index: 999; animation: slideInToast 0.3s ease; }

  .panel-in { animation: panelIn 0.28s ease both; }

  .billing-scroll { overflow-x: auto; }
  .billing-inner  { min-width: 420px; }

  @media (max-width: 860px) {
    .acct-layout { grid-template-columns: 170px 1fr; gap: 16px; }
  }

  @media (max-width: 640px) {
    .acct-layout { grid-template-columns: 1fr; gap: 14px; }
    .acct-sidebar { position: static; top: unset; }
    .acct-nav {
      flex-direction: row !important;
      overflow-x: auto;
      gap: 6px !important;
      padding-bottom: 2px;
      scrollbar-width: none;
    }
    .acct-nav::-webkit-scrollbar { display: none; }
    .acct-nav-item {
      flex-shrink: 0 !important;
      width: auto !important;
      padding: 7px 12px !important;
      white-space: nowrap;
    }
    .acct-nav-badge-hide { display: none !important; }
    .sec-body { padding: 14px !important; }
    .fg2, .fg4 { grid-template-columns: 1fr !important; }
    .toast-pos { bottom: 12px; right: 12px; left: 12px; }
    .av-row { flex-wrap: wrap; }
  }

  @media (max-width: 380px) {
    .sec-body { padding: 10px !important; }
    .acct-nav-item { padding: 6px 10px !important; font-size: 12px !important; }
  }
`;

// ─── Util hooks ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      {threshold},
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({message, type, onDone}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const ok = type === "success";
  return (
    <div
      className="toast-pos"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: C.bg1,
        border: `1px solid ${ok ? C.greenB : C.redB}`,
        borderRadius: 12,
        padding: "13px 18px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      }}
    >
      <span style={{fontSize: 16}}>{ok ? "✓" : "✕"}</span>
      <span
        style={{fontSize: 13, color: ok ? C.green : C.red, fontWeight: 500}}
      >
        {message}
      </span>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({label, hint, type = "text", readOnly, ...p}) {
  const [f, setF] = useState(false);
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
      {label && (
        <label style={{fontSize: 12, fontWeight: 500, color: C.text2}}>
          {label}
        </label>
      )}
      <input
        type={type}
        readOnly={readOnly}
        {...p}
        onFocus={(e) => {
          setF(true);
          p.onFocus?.(e);
        }}
        onBlur={(e) => {
          setF(false);
          p.onBlur?.(e);
        }}
        style={{
          background: readOnly ? C.bg2 : f ? "rgba(43,43,43,0.02)" : C.bg1,
          border: `1px solid ${f && !readOnly ? C.accent : C.border}`,
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          color: readOnly ? C.text3 : C.text,
          outline: "none",
          width: "100%",
          transition: "all 0.18s",
          boxShadow: f && !readOnly ? `0 0 0 3px rgba(43,43,43,0.08)` : "none",
          cursor: readOnly ? "default" : "text",
        }}
      />
      {hint && <p style={{fontSize: 11, color: C.text3, margin: 0}}>{hint}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({checked, onChange, label, description}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: `1px solid ${C.border}`,
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: C.text,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {description && (
          <div style={{fontSize: 12, color: C.text3, lineHeight: 1.5}}>
            {description}
          </div>
        )}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          flexShrink: 0,
          background: checked ? C.accent : C.bg4,
          border: `1px solid ${checked ? C.accent : C.border}`,
          position: "relative",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  badge,
  badgeColor = C.text,
  badgeBg = "rgba(43,43,43,0.06)",
  children,
  delay = 0,
}) {
  const [ref, iv] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: iv ? 1 : 0,
        transform: iv ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
      }}
    >
      <div
        style={{
          background: C.bg1,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            padding: "15px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: C.bg2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: 14, fontWeight: 500, color: C.text}}>
              {title}
            </div>
            {subtitle && (
              <div style={{fontSize: 12, color: C.text3, marginTop: 2}}>
                {subtitle}
              </div>
            )}
          </div>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: badgeColor,
                background: badgeBg,
                border: `1px solid ${badgeColor}44`,
                padding: "3px 10px",
                borderRadius: 20,
                letterSpacing: "0.3px",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="sec-body">{children}</div>
      </div>
    </div>
  );
}

// ─── DangerRow ────────────────────────────────────────────────────────────────
function DangerRow({title, description, actionLabel, onAction, loading}) {
  const [h, sH] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: `1px solid ${C.border}`,
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: C.text,
            marginBottom: 2,
          }}
        >
          {title}
        </div>
        <div style={{fontSize: 12, color: C.text3}}>{description}</div>
      </div>
      <button
        onClick={onAction}
        disabled={loading}
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        style={{
          padding: "7px 14px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 500,
          background: h ? C.redG : "transparent",
          border: `1px solid ${h ? C.redB : C.redG}`,
          color: C.red,
          cursor: "pointer",
          transition: "all 0.18s",
          flexShrink: 0,
          opacity: loading ? 0.5 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ─── AvatarSection ────────────────────────────────────────────────────────────
function AvatarSection({name, email}) {
  const [h, sH] = useState(false);
  const ini = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";
  return (
    <div
      className="av-row"
      style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 20}}
    >
      <div
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg, #2563EB, #7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 500,
          color: "#fff",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          border: `2px solid ${h ? C.accent : C.border}`,
          transition: "border-color 0.2s",
        }}
      >
        {h ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Edit
          </div>
        ) : (
          ini
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: C.text,
            marginBottom: 2,
          }}
        >
          {name || "Your Name"}
        </div>
        <div style={{fontSize: 12, color: C.text3}}>
          {email || "your@email.com"}
        </div>
        <div
          style={{
            marginTop: 7,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              background: C.greenG,
              color: C.green,
              border: `1px solid ${C.greenB}`,
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            ● Active
          </span>
          <span
            style={{
              fontSize: 10,
              color: C.text3,
              background: C.bg1,
              border: `1px solid ${C.border}`,
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            Free plan
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SaveButton ───────────────────────────────────────────────────────────────
function SaveButton({loading, onClick, label = "Save changes"}) {
  const [h, sH] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 18,
        paddingTop: 16,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <button
        onClick={onClick}
        disabled={loading}
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        style={{
          padding: "9px 22px",
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 500,
          background: h ? C.accent2 : C.accent,
          border: `1px solid ${C.accent}`,
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "all 0.18s",
          transform: h && !loading ? "translateY(-1px)" : "translateY(0)",
          boxShadow: h && !loading ? "0 4px 16px rgba(43,43,43,0.2)" : "none",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        {loading ? (
          <>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{animation: "spin 1s linear infinite"}}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Saving…
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

// ─── Nav items (emojis kept for simplicity; consider replacing with icons later) ──
const NAV = [
  {id: "profile", label: "Profile", icon: "👤"},
  {id: "security", label: "Security", icon: "🔒"},
  {id: "notifications", label: "Notifications", icon: "🔔"},
  {id: "institution", label: "Institution", icon: "🏫"},
  {id: "billing", label: "Billing", icon: "💳", badge: "Free"},
  {id: "danger", label: "Danger zone", icon: "⚠️"},
];

function SidebarNav({active, onChange}) {
  const barRef = useRef(null);
  useEffect(() => {
    const el = barRef.current?.querySelector(`[data-id="${active}"]`);
    el?.scrollIntoView({inline: "nearest", behavior: "smooth"});
  }, [active]);
  return (
    <nav className="acct-nav" ref={barRef}>
      {NAV.map((item) => {
        const on = active === item.id;
        return (
          <button
            key={item.id}
            data-id={item.id}
            onClick={() => onChange(item.id)}
            className="acct-nav-item"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 9,
              width: "100%",
              background: on ? "rgba(43,43,43,0.08)" : "transparent",
              border: `1px solid ${on ? C.border3 : "transparent"}`,
              color: on ? C.text : C.text3,
              fontSize: 13,
              fontWeight: on ? 500 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (!on) {
                e.currentTarget.style.background = C.bg2;
                e.currentTarget.style.color = C.text2;
              }
            }}
            onMouseLeave={(e) => {
              if (!on) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = C.text3;
              }
            }}
          >
            <span style={{display: "flex", alignItems: "center", gap: 8}}>
              <span style={{fontSize: 14}}>{item.icon}</span>
              {item.label}
            </span>
            {item.badge && (
              <span
                className="acct-nav-badge-hide"
                style={{
                  fontSize: 10,
                  color: C.text3,
                  background: C.bg1,
                  border: `1px solid ${C.border}`,
                  padding: "1px 7px",
                  borderRadius: 20,
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Panels (unchanged logic, only style tokens replaced) ─────────────────────

function ProfilePanel({user, onSave}) {
  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";
  const userEmail = user?.email ?? "";

  const [f, sF] = useState({
    name: userName,
    email: userEmail,
    institution: "",
    role: "",
    bio: "",
  });
  const [ld, sLd] = useState(false);
  const save = async () => {
    sLd(true);
    await new Promise((r) => setTimeout(r, 900));
    sLd(false);
    onSave("Profile updated");
  };
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Personal information"
        subtitle="Your name and contact details"
      >
        <AvatarSection name={f.name} email={f.email} />
        <div className="fg2">
          <Field
            label="Full name"
            value={f.name}
            onChange={(e) => sF((p) => ({...p, name: e.target.value}))}
            placeholder="Allan Kirimi"
          />
          <Field
            label="Email"
            type="email"
            value={f.email}
            onChange={(e) => sF((p) => ({...p, email: e.target.value}))}
            placeholder="allan@institution.ac.ke"
          />
          <Field
            label="Role / Title"
            value={f.role}
            onChange={(e) => sF((p) => ({...p, role: e.target.value}))}
            placeholder="Head of Academics"
          />
          <Field
            label="Institution"
            value={f.institution}
            onChange={(e) => sF((p) => ({...p, institution: e.target.value}))}
            placeholder="Nyeri High School"
          />
        </div>
        <div style={{marginTop: 14}}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: C.text2,
              display: "block",
              marginBottom: 6,
            }}
          >
            Bio
          </label>
          <textarea
            value={f.bio}
            onChange={(e) => sF((p) => ({...p, bio: e.target.value}))}
            placeholder="Brief description of your role…"
            rows={3}
            style={{
              background: C.bg1,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 13px",
              fontSize: 13,
              color: C.text,
              outline: "none",
              width: "100%",
              resize: "vertical",
              transition: "all 0.18s",
              lineHeight: 1.6,
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = C.accent;
              e.target.style.boxShadow = `0 0 0 3px rgba(43,43,43,0.08)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <SaveButton loading={ld} onClick={save} />
      </Section>
    </div>
  );
}

function SecurityPanel({onSave, onError}) {
  const [f, sF] = useState({current: "", next: "", confirm: ""});
  const [ld, sLd] = useState(false);
  const [sc, setSC] = useState(false);
  const [sn, setSN] = useState(false);
  const str = (() => {
    const p = f.next;
    if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strLabel = ["Weak", "Fair", "Good", "Strong"][str - 1] || "";
  const strColor =
    ["#F87171", "#F59E0B", "#22C55E", "#22C55E"][str - 1] || C.text3;
  const save = async () => {
    if (!f.current) return onError("Current password required");
    if (f.next !== f.confirm) return onError("Passwords do not match");
    if (str < 2) return onError("Password too weak");
    sLd(true);
    await new Promise((r) => setTimeout(r, 900));
    sLd(false);
    sF({current: "", next: "", confirm: ""});
    onSave("Password updated");
  };
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Change password"
        subtitle="Use a strong password you don't use elsewhere"
      >
        <div style={{display: "flex", flexDirection: "column", gap: 14}}>
          <div style={{position: "relative"}}>
            <Field
              label="Current password"
              type={sc ? "text" : "password"}
              value={f.current}
              onChange={(e) => sF((p) => ({...p, current: e.target.value}))}
              placeholder="••••••••"
            />
            <button
              onClick={() => setSC(!sc)}
              style={{
                position: "absolute",
                right: 10,
                top: 30,
                background: "none",
                border: "none",
                color: C.text3,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {sc ? "Hide" : "Show"}
            </button>
          </div>
          <div style={{position: "relative"}}>
            <Field
              label="New password"
              type={sn ? "text" : "password"}
              value={f.next}
              onChange={(e) => sF((p) => ({...p, next: e.target.value}))}
              placeholder="••••••••"
            />
            <button
              onClick={() => setSN(!sn)}
              style={{
                position: "absolute",
                right: 10,
                top: 30,
                background: "none",
                border: "none",
                color: C.text3,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {sn ? "Hide" : "Show"}
            </button>
          </div>
          {f.next && (
            <div>
              <div style={{display: "flex", gap: 4, marginBottom: 5}}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: i <= str ? strColor : C.bg4,
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
              <span style={{fontSize: 11, color: strColor}}>{strLabel}</span>
            </div>
          )}
          <Field
            label="Confirm new password"
            type="password"
            value={f.confirm}
            onChange={(e) => sF((p) => ({...p, confirm: e.target.value}))}
            placeholder="••••••••"
          />
        </div>
        <SaveButton loading={ld} onClick={save} label="Update password" />
      </Section>
      <Section
        title="Two-factor authentication"
        subtitle="Add a second layer of security"
        badge="Recommended"
        delay={0.06}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: C.text2,
              lineHeight: 1.7,
              flex: 1,
              minWidth: 200,
            }}
          >
            2FA adds a one-time code from your authenticator app. Highly
            recommended for admins.
          </div>
          <button
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(43,43,43,0.06)",
              border: `1px solid ${C.border3}`,
              color: C.text,
              cursor: "pointer",
              transition: "all 0.18s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(43,43,43,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(43,43,43,0.06)")
            }
          >
            Enable 2FA →
          </button>
        </div>
      </Section>
      <Section
        title="Active sessions"
        subtitle="Devices signed into your account"
        delay={0.1}
      >
        {[
          {
            device: "Chrome on Windows",
            location: "Nyeri, Kenya",
            current: true,
            time: "Now",
          },
          {
            device: "Safari on iPhone",
            location: "Nairobi, Kenya",
            current: false,
            time: "2 days ago",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i === 0 ? `1px solid ${C.border}` : "none",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: C.bg2,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                {s.device.includes("iPhone") ? "📱" : "💻"}
              </div>
              <div style={{minWidth: 0}}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.device}
                </div>
                <div style={{fontSize: 11, color: C.text3, marginTop: 1}}>
                  {s.location} · {s.time}
                </div>
              </div>
            </div>
            {s.current ? (
              <span
                style={{
                  fontSize: 10,
                  color: C.green,
                  background: C.greenG,
                  border: `1px solid ${C.greenB}`,
                  padding: "2px 10px",
                  borderRadius: 20,
                  flexShrink: 0,
                }}
              >
                Current
              </span>
            ) : (
              <button
                style={{
                  fontSize: 12,
                  color: C.red,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}

function NotificationsPanel({onSave}) {
  const [p, sP] = useState({
    emailConflicts: true,
    emailGenerated: true,
    emailUpdates: false,
    emailMarketing: false,
    browserAlerts: true,
  });
  const [ld, sLd] = useState(false);
  const toggle = (k) => sP((x) => ({...x, [k]: !x[k]}));
  const save = async () => {
    sLd(true);
    await new Promise((r) => setTimeout(r, 700));
    sLd(false);
    onSave("Preferences saved");
  };
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Email notifications"
        subtitle="Choose what Protiba emails you about"
      >
        <Toggle
          checked={p.emailConflicts}
          onChange={() => toggle("emailConflicts")}
          label="Scheduling conflicts"
          description="Alert when a timetable has unresolved conflicts"
        />
        <Toggle
          checked={p.emailGenerated}
          onChange={() => toggle("emailGenerated")}
          label="Timetable generated"
          description="Confirmation when a new schedule is ready"
        />
        <Toggle
          checked={p.emailUpdates}
          onChange={() => toggle("emailUpdates")}
          label="Product updates"
          description="New features, improvements, and changelogs"
        />
        <Toggle
          checked={p.emailMarketing}
          onChange={() => toggle("emailMarketing")}
          label="Tips and guides"
          description="Scheduling best practices"
        />
        <SaveButton loading={ld} onClick={save} />
      </Section>
      <Section
        title="Browser notifications"
        subtitle="Real-time alerts in your browser"
        delay={0.06}
      >
        <Toggle
          checked={p.browserAlerts}
          onChange={() => toggle("browserAlerts")}
          label="Push notifications"
          description="Get notified even when Protiba isn't active"
        />
      </Section>
    </div>
  );
}

function InstitutionPanel({onSave}) {
  const [f, sF] = useState({
    name: "",
    type: "",
    address: "",
    website: "",
    timezone: "Africa/Nairobi",
  });
  const [ld, sLd] = useState(false);
  const save = async () => {
    sLd(true);
    await new Promise((r) => setTimeout(r, 800));
    sLd(false);
    onSave("Institution settings saved");
  };
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Institution details"
        subtitle="Your school's core identity"
      >
        <div className="fg2">
          <Field
            label="Institution name"
            value={f.name}
            onChange={(e) => sF((p) => ({...p, name: e.target.value}))}
            placeholder="Nyeri High School"
          />
          <Field
            label="Type"
            value={f.type}
            onChange={(e) => sF((p) => ({...p, type: e.target.value}))}
            placeholder="Secondary School"
          />
          <Field
            label="Address"
            value={f.address}
            onChange={(e) => sF((p) => ({...p, address: e.target.value}))}
            placeholder="Nyeri, Kenya"
          />
          <Field
            label="Website"
            type="url"
            value={f.website}
            onChange={(e) => sF((p) => ({...p, website: e.target.value}))}
            placeholder="https://nyerihigh.ac.ke"
          />
          <Field
            label="Timezone"
            value={f.timezone}
            onChange={(e) => sF((p) => ({...p, timezone: e.target.value}))}
            placeholder="Africa/Nairobi"
          />
        </div>
        <SaveButton loading={ld} onClick={save} />
      </Section>
      <Section
        title="Schedule defaults"
        subtitle="Applied to all new timetables"
        badge="Global"
        delay={0.06}
      >
        <div className="fg4">
          <Field label="Start time" type="time" defaultValue="07:30" />
          <Field label="End time" type="time" defaultValue="17:00" />
          <Field label="Period (min)" type="number" defaultValue="40" />
          <Field label="Break (min)" type="number" defaultValue="20" />
        </div>
        <SaveButton loading={ld} onClick={save} label="Save defaults" />
      </Section>
    </div>
  );
}

function BillingPanel() {
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Current plan"
        subtitle="Manage your subscription"
        badge="Free"
        badgeColor={C.green}
        badgeBg={C.greenG}
      >
        <div
          style={{
            background: "rgba(43,43,43,0.04)",
            border: `1px solid ${C.border2}`,
            borderRadius: 12,
            padding: "16px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: C.text,
                marginBottom: 4,
              }}
            >
              Free plan
            </div>
            <div style={{fontSize: 13, color: C.text3}}>
              3 timetables · 1 institution · Community support
            </div>
          </div>
          <button
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 500,
              background: C.accent,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            Upgrade to Pro →
          </button>
        </div>
        <div className="billing-scroll">
          <div className="billing-inner">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "5px 0",
                fontSize: 11,
                color: C.text3,
                marginBottom: 4,
              }}
            >
              <span />
              <span
                style={{
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Free
              </span>
              <span
                style={{
                  textAlign: "center",
                  color: C.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                Pro
              </span>
            </div>
            {[
              {feature: "Timetables", free: "3", pro: "Unlimited"},
              {feature: "Institutions", free: "1", pro: "Unlimited"},
              {feature: "Teachers / schedule", free: "15", pro: "Unlimited"},
              {feature: "Export formats", free: "PDF", pro: "PDF, Excel, iCal"},
              {feature: "Priority support", free: "—", pro: "✓"},
              {
                feature: "Conflict AI optimizer",
                free: "Basic",
                pro: "Advanced",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  padding: "10px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13,
                }}
              >
                <span style={{color: C.text2}}>{r.feature}</span>
                <span style={{color: C.text3, textAlign: "center"}}>
                  {r.free}
                </span>
                <span
                  style={{color: C.text, textAlign: "center", fontWeight: 500}}
                >
                  {r.pro}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function DangerPanel({onError}) {
  const [cd, sCd] = useState(false);
  return (
    <div
      className="panel-in"
      style={{display: "flex", flexDirection: "column", gap: 12}}
    >
      <Section
        title="Danger zone"
        subtitle="Irreversible actions — proceed with caution"
        badge="Destructive"
        badgeColor={C.red}
        badgeBg={C.redG}
      >
        <DangerRow
          title="Export all data"
          description="Download a full export of your institution data and timetables"
          actionLabel="Request export"
          onAction={() => onError("Export requested — check your email")}
        />
        <DangerRow
          title="Reset all timetables"
          description="Delete all generated timetables. Settings are preserved."
          actionLabel="Reset timetables"
          onAction={() => onError("This cannot be undone")}
        />
        <div style={{paddingTop: 14}}>
          {!cd ? (
            <DangerRow
              title="Delete account"
              description="Permanently remove your account and all data."
              actionLabel="Delete account"
              onAction={() => sCd(true)}
            />
          ) : (
            <div
              style={{
                background: C.redG,
                border: `1px solid ${C.redB}`,
                borderRadius: 12,
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.red,
                  marginBottom: 6,
                }}
              >
                Are you absolutely sure?
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: C.text3,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                This will permanently delete your account and all associated
                data. There is no undo.
              </p>
              <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                <button
                  onClick={() => (window.location.href = "/login")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    background: C.red,
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => sCd(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    background: "transparent",
                    color: C.text3,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AccountSettings = () => {
  const {user, isLoading: authLoading} = useAuthStore();
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [hRef, hIv] = useInView(0.1);

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const handleLogout = async () => {
    try {
      const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (r.ok) window.location.href = "/login";
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (m, t = "success") => setToast({message: m, type: t});
  const showError = (m) => setToast({message: m, type: "error"});

  const PANELS = {
    profile: <ProfilePanel user={user} onSave={showToast} />,
    security: <SecurityPanel onSave={showToast} onError={showError} />,
    notifications: <NotificationsPanel onSave={showToast} />,
    institution: <InstitutionPanel onSave={showToast} />,
    billing: <BillingPanel />,
    danger: <DangerPanel onError={showToast} />,
  };

  if (authLoading)
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
        <div className="acct-spinner" />
      </div>
    );

  return (
    <>
      <style>{CSS}</style>

      <Navigation
        userName={userName}
        institutionName="St. Mary's Academy"
        notificationCount={3}
        onLogout={handleLogout}
      />

      <main
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          overflowX: "hidden",
          position: "relative",
          paddingTop: "68px",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1000,
            margin: "0 auto",
            padding: "0 20px 64px",
          }}
        >
          {/* Header */}
          <div
            ref={hRef}
            style={{
              marginBottom: 24,
              paddingTop: 28,
              opacity: hIv ? 1 : 0,
              transform: hIv ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.45s ease",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: 7,
              }}
            >
              Account
            </div>
            <h1
              style={{
                fontSize: "clamp(18px,5vw,24px)",
                fontWeight: 500,
                color: C.text,
                letterSpacing: "-0.3px",
                marginBottom: 4,
              }}
            >
              Settings
            </h1>
            <p style={{fontSize: 13, color: C.text3}}>
              Manage your profile, security, and institution preferences.
            </p>
          </div>

          {/* Layout */}
          <div className="acct-layout">
            <div
              className="acct-sidebar"
              style={{
                opacity: hIv ? 1 : 0,
                transform: hIv ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.45s ease 0.08s",
              }}
            >
              <div
                style={{
                  background: C.bg1,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "10px",
                }}
              >
                <SidebarNav active={tab} onChange={setTab} />
              </div>
            </div>

            <div style={{minWidth: 0}} key={tab}>
              {PANELS[tab]}
            </div>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}
      </main>
    </>
  );
};

export default AccountSettings;
