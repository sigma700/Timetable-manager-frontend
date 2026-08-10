import React, {useState, useRef, useEffect} from "react";
import {useAuthStore} from "../store/authStore";
import Navigation from "./components/navigation";

// ─── SVG Icons ──────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Building: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="15" y2="14" />
      <line x1="9" y1="6" x2="15" y2="6" />
    </svg>
  ),
  CreditCard: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg
      width="14"
      height="14"
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
  ),
  Spinner: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{animation: "spin 0.8s linear infinite"}}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  ),
  Monitor: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

// ─── Brand tokens ────────────────────────────────────────────────────────
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
  accent2: "#454545",
  green: "#22C55E",
  greenG: "rgba(34,197,94,0.08)",
  greenB: "rgba(34,197,94,0.18)",
  red: "#F87171",
  redG: "rgba(248,113,113,0.08)",
  redB: "rgba(248,113,113,0.18)",
  purple: "#8B5CF6",
  amber: "#F59E0B",
};

// ─── Global CSS ──────────────────────────────────────────────────────────
const globalCSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  html,body{
    overflow-x:hidden;
    width:100%;
    max-width:100vw;
    background:#F8F8F8;
  }

  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

  .as-page{
    font-family:'Inter',-apple-system,sans-serif;
    background:${C.bg};
    color:${C.text};
    min-height:100vh;
    padding-top:68px;
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;
    width:100%;
    max-width:100vw;
  }

  .as-container{
    width:100%;
    max-width:1000px;
    margin:0 auto;
    padding:0 16px 80px;
    overflow-x:hidden;
    box-sizing:border-box;
  }

  .as-header{
    padding-top:28px;
    margin-bottom:24px;
    animation:fadeIn .45s ease both;
    width:100%;
  }
  .as-header__label{
    font-size:11px;
    font-weight:600;
    text-transform:uppercase;
    letter-spacing:.07em;
    color:${C.text2};
    margin-bottom:6px;
  }
  .as-header__title{
    font-size:24px;
    font-weight:700;
    color:${C.text};
    letter-spacing:-.025em;
    margin-bottom:4px;
  }
  .as-header__sub{
    font-size:13px;
    color:${C.text3};
    line-height:1.5;
  }

  .as-layout{
    display:grid;
    grid-template-columns:minmax(170px,220px) minmax(0,1fr);
    gap:24px;
    align-items:start;
    width:100%;
  }

  .as-sidebar{
    position:sticky;
    top:84px;
    animation:fadeIn .45s ease .06s both;
    min-width:0;
  }
  .as-sidebar__inner{
    background:${C.bg1};
    border:1px solid ${C.border};
    border-radius:14px;
    padding:8px;
  }

  .as-nav{display:flex;flex-direction:column;gap:2px}
  .as-nav__item{
    display:flex;
    align-items:center;
    gap:10px;
    width:100%;
    padding:10px 14px;
    border-radius:10px;
    font-size:13px;
    font-weight:500;
    color:${C.text2};
    background:transparent;
    border:1px solid transparent;
    cursor:pointer;
    text-align:left;
    transition:background .18s ease,color .18s ease,border-color .18s ease;
    font-family:inherit;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .as-nav__item:hover{background:${C.bg2};color:${C.text}}
  .as-nav__item--active{
    background:rgba(43,43,43,.08);
    color:${C.text};
    font-weight:600;
    border-color:${C.border3};
  }
  .as-nav__icon{flex-shrink:0;opacity:.7;transition:opacity .18s;display:flex}
  .as-nav__item--active .as-nav__icon,.as-nav__item:hover .as-nav__icon{opacity:1}
  .as-nav__label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}
  .as-nav__badge{
    font-size:10px;
    color:${C.text3};
    background:${C.bg1};
    border:1px solid ${C.border};
    padding:2px 8px;
    border-radius:20px;
    margin-left:auto;
    flex-shrink:0;
  }

  .as-panel{animation:fadeIn .35s cubic-bezier(.16,1,.3,1) both;min-width:0;width:100%}

  .as-section{
    background:${C.bg1};
    border:1px solid ${C.border};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.02);
    margin-bottom:14px;
    width:100%;
    min-width:0;
  }
  .as-section__head{
    padding:14px 20px;
    border-bottom:1px solid ${C.border};
    background:${C.bg2};
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
  }
  .as-section__title{
    font-size:14px;
    font-weight:600;
    color:${C.text};
    letter-spacing:-.01em;
    word-break:break-word;
  }
  .as-section__sub{
    font-size:12px;
    color:${C.text3};
    margin-top:2px;
    word-break:break-word;
  }
  .as-section__badge{
    font-size:10px;
    font-weight:600;
    padding:3px 10px;
    border-radius:20px;
    text-transform:uppercase;
    letter-spacing:.04em;
    flex-shrink:0;
    white-space:nowrap;
  }
  .as-section__body{padding:20px;min-width:0}

  .as-field{display:flex;flex-direction:column;gap:5px;width:100%;min-width:0}
  .as-field__label{font-size:12px;font-weight:500;color:${C.text2}}
  .as-field__input{
    background:${C.bg1};
    border:1px solid ${C.border};
    border-radius:8px;
    padding:10px 13px;
    font-size:13px;
    color:${C.text};
    outline:none;
    width:100%;
    max-width:100%;
    min-width:0;
    transition:border-color .18s,box-shadow .18s;
    font-family:inherit;
  }
  .as-field__input:focus{border-color:${C.accent};box-shadow:0 0 0 3px rgba(43,43,43,.07)}
  .as-field__input::placeholder{color:${C.text4}}
  .as-field__input--readonly{background:${C.bg2};color:${C.text3};cursor:default}
  .as-field__hint{font-size:11px;color:${C.text3}}

  .as-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:12px;width:100%;min-width:0}
  .as-grid4{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(140px,100%),1fr));gap:12px;width:100%;min-width:0}

  .as-avatar-row{display:flex;align-items:center;gap:16px;margin-bottom:22px;flex-wrap:wrap}
  .as-avatar{
    width:56px;height:56px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,#2563EB,#7C3AED);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;font-weight:600;color:#fff;
    border:2px solid ${C.border};transition:border-color .2s;
  }
  .as-avatar:hover{border-color:${C.accent}}
  .as-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .as-badge{font-size:10px;font-weight:500;padding:2px 9px;border-radius:20px;border:1px solid;white-space:nowrap}
  .as-badge--active{background:${C.greenG};color:${C.green};border-color:${C.greenB}}
  .as-badge--plan{color:${C.text3};background:${C.bg1};border-color:${C.border}}

  .as-btn{
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    padding:9px 20px;border-radius:9px;font-size:13px;font-weight:600;
    cursor:pointer;transition:background .18s,transform .18s,box-shadow .18s,border-color .18s;
    font-family:inherit;border:none;white-space:nowrap;flex-shrink:0;
  }
  .as-btn--primary{background:${C.accent};color:#fff;border:1px solid ${C.accent}}
  .as-btn--primary:hover{background:${C.accent2};transform:translateY(-1px);box-shadow:0 4px 14px rgba(43,43,43,.2)}
  .as-btn--primary:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
  .as-btn--danger{background:transparent;color:${C.red};border:1px solid ${C.redG}}
  .as-btn--danger:hover{background:${C.redG};border-color:${C.redB}}
  .as-btn--danger-solid{background:${C.red};color:#fff;border:none}
  .as-btn--outline{background:transparent;color:${C.text2};border:1px solid ${C.border}}
  .as-btn--outline:hover{background:${C.bg2};color:${C.text}}

  .as-toggle{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 0;border-bottom:1px solid ${C.border};gap:14px;flex-wrap:wrap;
  }
  .as-toggle:last-child{border-bottom:none}
  .as-toggle__label{font-size:13px;font-weight:500;color:${C.text};margin-bottom:2px}
  .as-toggle__desc{font-size:12px;color:${C.text3};line-height:1.5}
  .as-toggle__switch{
    width:42px;height:24px;border-radius:12px;flex-shrink:0;
    background:${C.bg4};border:1px solid ${C.border};
    position:relative;cursor:pointer;transition:background .2s,border-color .2s;
  }
  .as-toggle__switch--on{background:${C.accent};border-color:${C.accent}}
  .as-toggle__knob{
    position:absolute;top:2px;left:2px;width:18px;height:18px;
    border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s;
  }
  .as-toggle__switch--on .as-toggle__knob{left:20px}

  .as-danger-row{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 0;border-bottom:1px solid ${C.border};gap:12px;flex-wrap:wrap;width:100%;
  }
  .as-danger-row:last-child{border-bottom:none}
  .as-danger-row__title{font-size:13px;font-weight:500;color:${C.text};margin-bottom:2px;word-break:break-word}
  .as-danger-row__desc{font-size:12px;color:${C.text3};word-break:break-word}

  .as-pw-strength{display:flex;align-items:center;gap:8px;margin-top:6px}
  .as-pw-bars{display:flex;gap:3px;flex:1;min-width:0}
  .as-pw-bar{flex:1;height:3px;border-radius:2px;background:${C.bg4};transition:background .25s}
  .as-pw-label{font-size:11px;font-weight:600;min-width:44px;text-align:right;flex-shrink:0}

  .as-session{
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 0;border-bottom:1px solid ${C.border};gap:12px;flex-wrap:wrap;width:100%;
  }
  .as-session:last-child{border-bottom:none}
  .as-session__icon{
    width:36px;height:36px;border-radius:10px;background:${C.bg2};
    border:1px solid ${C.border};display:flex;align-items:center;
    justify-content:center;flex-shrink:0;color:${C.text2};
  }
  .as-session__current{
    font-size:10px;font-weight:600;padding:2px 10px;border-radius:20px;
    background:${C.greenG};color:${C.green};border:1px solid ${C.greenB};flex-shrink:0;
  }

  .as-plan-card{
    background:rgba(43,43,43,.03);border:1px solid ${C.border2};
    border-radius:12px;padding:16px;margin-bottom:20px;
    display:flex;align-items:center;justify-content:space-between;
    gap:14px;flex-wrap:wrap;width:100%;
  }

  .as-billing-scroll{width:100%;min-width:0}
  .as-billing-row{
    display:grid;grid-template-columns:1.6fr .7fr .7fr;align-items:center;
    padding:10px 0;border-bottom:1px solid ${C.border};gap:6px;
  }
  .as-billing-row:last-child{border-bottom:none}
  .as-billing-head{color:${C.text3};font-size:10px;text-transform:uppercase;letter-spacing:.04em}
  .as-billing-feature{color:${C.text2};font-size:13px;word-break:break-word}
  .as-billing-val{font-size:13px;text-align:center}

  .as-toast{
    position:fixed;bottom:24px;right:24px;z-index:999;animation:toastIn .3s ease;
    display:flex;align-items:center;gap:10px;background:${C.bg1};
    border-radius:12px;padding:13px 18px;box-shadow:0 16px 40px rgba(0,0,0,.1);
    max-width:calc(100vw - 48px);
  }

  .as-confirm{
    background:${C.redG};border:1px solid ${C.redB};
    border-radius:12px;padding:18px;
  }
  .as-confirm__title{font-size:14px;font-weight:600;color:${C.red};margin-bottom:6px}
  .as-confirm__text{font-size:13px;color:${C.text3};line-height:1.6;margin-bottom:16px}

  textarea.as-field__input{resize:vertical;line-height:1.6;min-height:80px}

  @media(max-width:768px){
    .as-container{padding:0 12px 48px}
    .as-header{padding-top:22px;margin-bottom:18px}
    .as-header__title{font-size:20px}

    .as-layout{grid-template-columns:1fr;gap:14px;width:100%}
    .as-sidebar{position:static;top:auto}
    .as-sidebar__inner{background:${C.bg1};border:1px solid ${C.border};padding:6px;border-radius:14px}

    .as-nav{
      flex-direction:row;flex-wrap:wrap;gap:6px;
      width:100%;
    }
    .as-nav__item{
      flex:1 1 auto;width:auto;padding:9px 12px;border-radius:10px;
      font-size:11.5px;white-space:nowrap;border:1px solid transparent;
      justify-content:center;overflow:visible;
    }
    .as-nav__item--active{background:${C.accent};color:#fff;border-color:${C.accent}}
    .as-nav__item--active .as-nav__icon{color:#fff;opacity:1}
    .as-nav__badge{display:none}
    .as-nav__icon{display:flex}
    .as-nav__label{overflow:visible;white-space:nowrap;flex:none}

    .as-section__body{padding:14px}
    .as-section__head{padding:12px 14px}

    .as-grid2,.as-grid4{grid-template-columns:1fr}

    .as-btn--primary{width:100%}
    .as-plan-card .as-btn--primary{width:100%}

    .as-toast{left:12px;right:12px;bottom:12px;max-width:none}
    .as-avatar{width:48px;height:48px;font-size:18px}

    .as-danger-row{align-items:flex-start}
    .as-danger-row .as-btn{width:100%}
    .as-danger-row > div:first-child{width:100%}

    .as-billing-row{grid-template-columns:1.4fr .8fr .8fr;gap:4px}
    .as-billing-feature{font-size:12px}
    .as-billing-val{font-size:12px}
  }

  @media(max-width:420px){
    .as-container{padding:0 10px 40px}
    .as-header{padding-top:18px}
    .as-header__title{font-size:18px}
    .as-section__head{padding:10px 12px}
    .as-section__body{padding:10px 12px}
    .as-nav__item{padding:8px 8px;font-size:10.5px;gap:5px}
    .as-nav__icon svg{width:14px;height:14px}
    .as-billing-row{grid-template-columns:1.3fr .85fr .85fr}
    .as-billing-feature{font-size:11.5px}
    .as-billing-val{font-size:11.5px}
    .as-session__icon{width:32px;height:32px}
  }

  @media(prefers-reduced-motion:reduce){
    *{animation:none!important;transition:none!important}
  }
`;

// ─── Hooks ───────────────────────────────────────────────────────────────
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

// ─── Toast ────────────────────────────────────────────────────────────────
function Toast({message, type, onDone}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const ok = type === "success";
  return (
    <div
      className="as-toast"
      style={{border: `1px solid ${ok ? C.greenB : C.redB}`}}
    >
      <span style={{fontSize: 15, color: ok ? C.green : C.red}}>
        {ok ? <Icon.Check /> : <Icon.X />}
      </span>
      <span
        style={{fontSize: 13, color: ok ? C.green : C.red, fontWeight: 500}}
      >
        {message}
      </span>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────
function Field({label, hint, type = "text", readOnly, ...p}) {
  const [f, setF] = useState(false);
  return (
    <div className="as-field">
      {label && <label className="as-field__label">{label}</label>}
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
        className={`as-field__input ${readOnly ? "as-field__input--readonly" : ""}`}
        style={{
          borderColor: f && !readOnly ? C.accent : C.border,
          boxShadow: f && !readOnly ? `0 0 0 3px rgba(43,43,43,.07)` : "none",
          cursor: readOnly ? "default" : "text",
        }}
      />
      {hint && <p className="as-field__hint">{hint}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────
function Toggle({checked, onChange, label, description}) {
  return (
    <div className="as-toggle">
      <div style={{flex: 1, minWidth: 0}}>
        <div className="as-toggle__label">{label}</div>
        {description && <div className="as-toggle__desc">{description}</div>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`as-toggle__switch ${checked ? "as-toggle__switch--on" : ""}`}
      >
        <div className="as-toggle__knob" />
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  badge,
  badgeColor = C.text,
  badgeBg = "rgba(43,43,43,.06)",
  children,
  delay = 0,
}) {
  const [ref, iv] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: iv ? 1 : 0,
        transform: iv ? "translateY(0)" : "translateY(12px)",
        transition: `opacity .4s ease ${delay}s, transform .4s ease ${delay}s`,
      }}
    >
      <div className="as-section">
        <div className="as-section__head">
          <div style={{flex: 1, minWidth: 0}}>
            <div className="as-section__title">{title}</div>
            {subtitle && <div className="as-section__sub">{subtitle}</div>}
          </div>
          {badge && (
            <span
              className="as-section__badge"
              style={{
                color: badgeColor,
                background: badgeBg,
                border: `1px solid ${badgeColor}44`,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="as-section__body">{children}</div>
      </div>
    </div>
  );
}

// ─── DangerRow ────────────────────────────────────────────────────────────
function DangerRow({title, description, actionLabel, onAction, loading}) {
  const [h, sH] = useState(false);
  return (
    <div className="as-danger-row">
      <div style={{flex: 1, minWidth: 0}}>
        <div className="as-danger-row__title">{title}</div>
        <div className="as-danger-row__desc">{description}</div>
      </div>
      <button
        onClick={onAction}
        disabled={loading}
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        className="as-btn as-btn--danger"
        style={{
          background: h ? C.redG : "transparent",
          borderColor: h ? C.redB : C.redG,
          opacity: loading ? 0.5 : 1,
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// ─── AvatarSection ────────────────────────────────────────────────────────
function AvatarSection({name, email}) {
  const [h, sH] = useState(false);
  const ini = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";
  return (
    <div className="as-avatar-row">
      <div
        className="as-avatar"
        onMouseEnter={() => sH(true)}
        onMouseLeave={() => sH(false)}
        style={{borderColor: h ? C.accent : C.border}}
      >
        {h ? <span style={{fontSize: 10}}>Edit</span> : ini}
      </div>
      <div style={{minWidth: 0}}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.text,
            marginBottom: 2,
            wordBreak: "break-word",
          }}
        >
          {name || "Your Name"}
        </div>
        <div style={{fontSize: 12, color: C.text3, wordBreak: "break-word"}}>
          {email || "your@email.com"}
        </div>
        <div className="as-badges">
          <span className="as-badge as-badge--active">Active</span>
          <span className="as-badge as-badge--plan">Free plan</span>
        </div>
      </div>
    </div>
  );
}

// ─── SaveButton ───────────────────────────────────────────────────────────
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
        className="as-btn as-btn--primary"
        style={{
          background: h ? C.accent2 : C.accent,
          transform: h && !loading ? "translateY(-1px)" : "none",
          boxShadow: h && !loading ? "0 4px 14px rgba(43,43,43,.2)" : "none",
        }}
      >
        {loading ? (
          <>
            <Icon.Spinner /> Saving...
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

// ─── SidebarNav ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id: "profile", label: "Profile", icon: Icon.User},
  {id: "security", label: "Security", icon: Icon.Lock},
  {id: "notifications", label: "Notifications", icon: Icon.Bell},
  {id: "institution", label: "Institution", icon: Icon.Building},
  {id: "billing", label: "Billing", icon: Icon.CreditCard, badge: "Free"},
  {id: "danger", label: "Danger zone", icon: Icon.AlertTriangle},
];

// No auto-scroll here: switching tabs must not move the viewport.
// The content sticks exactly where the user already is.
function SidebarNav({active, onChange}) {
  return (
    <nav className="as-nav">
      {NAV_ITEMS.map((item) => {
        const on = active === item.id;
        return (
          <button
            key={item.id}
            data-id={item.id}
            onClick={() => onChange(item.id)}
            className={`as-nav__item ${on ? "as-nav__item--active" : ""}`}
          >
            <span className="as-nav__icon">
              <item.icon />
            </span>
            <span className="as-nav__label">{item.label}</span>
            {item.badge && <span className="as-nav__badge">{item.badge}</span>}
          </button>
        );
      })}
    </nav>
  );
}

// ─── ProfilePanel ─────────────────────────────────────────────────────────
function ProfilePanel({user, onSave}) {
  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";
  const [f, sF] = useState({
    name: userName,
    email: user?.email ?? "",
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
    <div className="as-panel">
      <Section
        title="Personal information"
        subtitle="Your name and contact details"
      >
        <AvatarSection name={f.name} email={f.email} />
        <div className="as-grid2">
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
            className="as-field__label"
            style={{marginBottom: 6, display: "block"}}
          >
            Bio
          </label>
          <textarea
            value={f.bio}
            onChange={(e) => sF((p) => ({...p, bio: e.target.value}))}
            placeholder="Brief description of your role..."
            rows={3}
            className="as-field__input"
          />
        </div>
        <SaveButton loading={ld} onClick={save} />
      </Section>
    </div>
  );
}

// ─── SecurityPanel ────────────────────────────────────────────────────────
function SecurityPanel({onSave, onError}) {
  const [f, sF] = useState({current: "", next: "", confirm: ""});
  const [ld, sLd] = useState(false);
  const [sc, setSC] = useState(false);
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
      className="as-panel"
      style={{display: "flex", flexDirection: "column", gap: 14}}
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
              placeholder="Enter current password"
              style={{paddingRight: 52}}
            />
            <button
              onClick={() => setSC(!sc)}
              style={{
                position: "absolute",
                right: 12,
                top: 32,
                background: "none",
                border: "none",
                color: C.text3,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
              }}
            >
              {sc ? "Hide" : "Show"}
            </button>
          </div>
          <div style={{position: "relative"}}>
            <Field
              label="New password"
              type="text"
              value={f.next}
              onChange={(e) => sF((p) => ({...p, next: e.target.value}))}
              placeholder="Create new password"
            />
          </div>
          {f.next && (
            <div className="as-pw-strength">
              <div className="as-pw-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="as-pw-bar"
                    style={{background: i <= str ? strColor : C.bg4}}
                  />
                ))}
              </div>
              <span className="as-pw-label" style={{color: strColor}}>
                {strLabel}
              </span>
            </div>
          )}
          <Field
            label="Confirm new password"
            type="password"
            value={f.confirm}
            onChange={(e) => sF((p) => ({...p, confirm: e.target.value}))}
            placeholder="Re-enter new password"
          />
        </div>
        <SaveButton loading={ld} onClick={save} label="Update password" />
      </Section>
      <Section
        title="Two-factor authentication"
        subtitle="Add a second layer of security"
        badge="Recommended"
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
          <button className="as-btn as-btn--outline">Enable 2FA</button>
        </div>
      </Section>
      <Section
        title="Active sessions"
        subtitle="Devices signed into your account"
      >
        {[
          {
            device: "Chrome on Windows",
            location: "Nyeri, Kenya",
            current: true,
            time: "Now",
            icon: Icon.Monitor,
          },
          {
            device: "Safari on iPhone",
            location: "Nairobi, Kenya",
            current: false,
            time: "2 days ago",
            icon: Icon.Phone,
          },
        ].map((s, i) => (
          <div key={i} className="as-session">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: 1,
                minWidth: 0,
              }}
            >
              <div className="as-session__icon">
                <s.icon />
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
              <span className="as-session__current">Current</span>
            ) : (
              <button
                className="as-btn as-btn--danger"
                style={{padding: "5px 12px", fontSize: 11}}
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

// ─── NotificationsPanel ───────────────────────────────────────────────────
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
      className="as-panel"
      style={{display: "flex", flexDirection: "column", gap: 14}}
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

// ─── InstitutionPanel ─────────────────────────────────────────────────────
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
      className="as-panel"
      style={{display: "flex", flexDirection: "column", gap: 14}}
    >
      <Section
        title="Institution details"
        subtitle="Your school's core identity"
      >
        <div className="as-grid2">
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
      >
        <div className="as-grid4">
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

// ─── BillingPanel ─────────────────────────────────────────────────────────
const BILLING_ROWS = [
  {feature: "Timetables", free: "3", pro: "Unlimited"},
  {feature: "Institutions", free: "1", pro: "Unlimited"},
  {feature: "Teachers / schedule", free: "15", pro: "Unlimited"},
  {feature: "Export formats", free: "PDF", pro: "PDF, Excel, iCal"},
  {feature: "Priority support", free: "—", pro: "✓"},
  {feature: "Conflict AI optimizer", free: "Basic", pro: "Advanced"},
];

function BillingPanel() {
  return (
    <div className="as-panel">
      <Section
        title="Current plan"
        subtitle="Manage your subscription"
        badge="Free"
        badgeColor={C.green}
        badgeBg={C.greenG}
      >
        <div className="as-plan-card">
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
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
          <button className="as-btn as-btn--primary">Upgrade to Pro</button>
        </div>
        <div className="as-billing-scroll">
          <div
            className="as-billing-row"
            style={{paddingTop: 0, borderBottom: `1px solid ${C.border}`}}
          >
            <span />
            <span className="as-billing-head as-billing-val">Free</span>
            <span
              className="as-billing-head as-billing-val"
              style={{color: C.text}}
            >
              Pro
            </span>
          </div>
          {BILLING_ROWS.map((r, i) => (
            <div key={i} className="as-billing-row">
              <span className="as-billing-feature">{r.feature}</span>
              <span className="as-billing-val" style={{color: C.text3}}>
                {r.free}
              </span>
              <span
                className="as-billing-val"
                style={{color: C.text, fontWeight: 500}}
              >
                {r.pro}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── DangerPanel ──────────────────────────────────────────────────────────
function DangerPanel({onError}) {
  const [cd, sCd] = useState(false);
  return (
    <div className="as-panel">
      <Section
        title="Danger zone"
        subtitle="Irreversible actions , proceed with caution"
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
            <div className="as-confirm">
              <div className="as-confirm__title">Are you absolutely sure?</div>
              <p className="as-confirm__text">
                This will permanently delete your account and all associated
                data. There is no undo.
              </p>
              <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="as-btn as-btn--danger-solid"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => sCd(false)}
                  className="as-btn as-btn--outline"
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

// ─── Main Component ───────────────────────────────────────────────────────
const AccountSettings = () => {
  const {user, isLoading: authLoading} = useAuthStore();
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [hRef, hIv] = useInView(0.1);

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";
  const institutionName = user?.institutionName || "Your Institution";

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
        <div
          style={{
            width: 36,
            height: 36,
            border: `2.5px solid ${C.border}`,
            borderTopColor: C.accent,
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <style>{globalCSS}</style>
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={3}
        onLogout={handleLogout}
      />
      <main className="as-page">
        <div className="as-container">
          {/* Header */}
          <div ref={hRef} className="as-header">
            <div className="as-header__label">Account</div>
            <h1 className="as-header__title">Settings</h1>
            <p className="as-header__sub">
              Manage your profile, security, and institution preferences.
            </p>
          </div>

          {/* Layout */}
          <div className="as-layout">
            <div
              className="as-sidebar"
              style={{
                opacity: hIv ? 1 : 0,
                transform: hIv ? "translateY(0)" : "translateY(12px)",
                transition: "opacity .45s ease .08s, transform .45s ease .08s",
              }}
            >
              <div className="as-sidebar__inner">
                <SidebarNav active={tab} onChange={setTab} />
              </div>
            </div>
            {/* No key={tab} here on purpose — remounting the panel on every
               tab switch was part of what nudged the page to jump. Content
               now stays exactly where the user left it. */}
            <div style={{minWidth: 0, width: "100%"}}>{PANELS[tab]}</div>
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
