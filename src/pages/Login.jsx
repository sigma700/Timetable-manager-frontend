import React, {useState} from "react";
import {useAuthStore} from "../store/authStore";
import {useNavigate, Link} from "react-router-dom";

// ─── Icons (same set as SignUp) ───────────────────────────────────────────────
const Icons = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#7c3aed" />
      <path
        d="M8 16L12.5 11L17 16L22 9"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="23" r="3.5" fill="#a78bfa" />
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1.5 9C3 5.5 5.8 3.5 9 3.5s6 2 7.5 5.5c-1.5 3.5-4.3 5.5-7.5 5.5S3 12.5 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 2l14 14M7.5 7.6A2.5 2.5 0 0 0 11.4 11.5M4.5 4.6C2.8 5.8 1.8 7.3 1.5 9c1.5 3.5 4.3 5.5 7.5 5.5 1.4 0 2.8-.4 4-.9M6 3C7 3.3 8 3.5 9 3.5c3.2 0 6 2 7.5 5.5a10 10 0 0 1-2 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Mail: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1.5"
        y="3"
        width="12"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1.5 5l6 4 6-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="2.5"
        y="6.5"
        width="10"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  Arrow: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Loader: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{animation: "spin 0.75s linear infinite"}}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      <path
        d="M8 2A6 6 0 0 1 14 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5L2 3.5V7c0 2.8 2.1 4.8 5 5.5 2.9-.7 5-2.7 5-5.5V3.5L7 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 7l2 2 3-3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1v2M7 11v2M1 7h2M11 7h2M3.05 3.05l1.42 1.42M9.54 9.54l1.41 1.41M3.05 10.95l1.42-1.41M9.54 4.46l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Left-panel feature list ──────────────────────────────────────────────────
const features = [
  {
    title: "Conflict-free timetables",
    desc: "Our engine resolves room, teacher, and class clashes automatically.",
  },
  {
    title: "Instant schedule updates",
    desc: "Push changes to all stakeholders in a single click.",
  },
  {
    title: "Works for any institution",
    desc: "Primary schools to universities — fully configurable.",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {logIn, isLoading, error} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/home");
    } catch {}
  };

  const f = (name) => {
    const val = name === "email" ? email : password;
    return `li-field ${focused === name ? "li-field--focused" : ""} ${val ? "li-field--filled" : ""}`;
  };

  return (
    <>
      <style>{css}</style>
      <div className="li-root">
        {/* ── Left panel ── */}
        <div className="li-left">
          <div className="li-left__inner">
            {/* Logo */}
            <Link to="/" className="li-logo">
              <Icons.Logo />
              <span>Protiba</span>
            </Link>

            {/* Hero */}
            <div className="li-left__hero">
              <div className="li-eyebrow">
                <span className="li-eyebrow__dot" />
                Welcome back
              </div>
              <h1 className="li-left__title">
                Pick up right
                <br />
                <span className="li-left__title-accent">
                  where you left off.
                </span>
              </h1>
              <p className="li-left__sub">
                Your timetables, teachers, and rooms are waiting. Sign in to
                continue building smarter schedules.
              </p>
            </div>

            {/* Feature list */}
            <div className="li-features">
              {features.map((feat) => (
                <div key={feat.title} className="li-feature">
                  <div className="li-feature__icon">
                    <Icons.Sparkle />
                  </div>
                  <div>
                    <div className="li-feature__title">{feat.title}</div>
                    <div className="li-feature__desc">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust */}
            <div className="li-trust">
              {[
                "SSL encrypted",
                "GDPR compliant",
                "No credit card required",
              ].map((b) => (
                <div key={b} className="li-trust__badge">
                  <Icons.Shield />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="li-right">
          <div className="li-form-wrap">
            <div className="li-form-header">
              <h2 className="li-form-header__title">Sign in to your account</h2>
              <p className="li-form-header__sub">
                Don't have one?{" "}
                <Link to="/signup" className="li-link">
                  Create an account <Icons.Arrow />
                </Link>
              </p>
            </div>

            {error && (
              <div className="li-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="li-form">
              {/* Email */}
              <div className={f("email")}>
                <label className="li-field__label">
                  <Icons.Mail /> Email Address{" "}
                  <span className="li-field__req">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@institution.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="li-field__input"
                />
              </div>

              {/* Password */}
              <div className={f("password")}>
                <div className="li-field__label-row">
                  <label className="li-field__label">
                    <Icons.Lock /> Password{" "}
                    <span className="li-field__req">*</span>
                  </label>
                  <Link to="/forgot-password" className="li-link li-link--sm">
                    Forgot password?
                  </Link>
                </div>
                <div className="li-field__control">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="li-field__input li-field__input--pw"
                  />
                  <button
                    type="button"
                    className="li-field__toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="li-remember">
                <div
                  className={`li-checkbox ${rememberMe ? "li-checkbox--checked" : ""}`}
                  onClick={() => setRememberMe((s) => !s)}
                >
                  {rememberMe && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{display: "none"}}
                />
                <span>Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className={`li-btn-submit ${isLoading ? "li-btn-submit--loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.Loader /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In <Icons.Arrow />
                  </>
                )}
              </button>
            </form>

            <p className="li-footer-note">
              Protected by industry-standard encryption. We never sell your
              data.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d10;
    --surface: #131316;
    --surface-2: #1a1a1f;
    --surface-3: #212128;
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(124,58,237,0.45);
    --text: #f0f0f5;
    --text-2: #9898a8;
    --text-3: #55556a;
    --accent: #7c3aed;
    --accent-light: #a78bfa;
    --accent-glow: rgba(124,58,237,0.14);
    --green: #10b981;
    --red: #f43f5e;
    --radius: 10px;
    --radius-lg: 14px;
    --font: 'Inter', -apple-system, sans-serif;
    --t: 180ms cubic-bezier(0.4,0,0.2,1);
  }

  .li-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    -webkit-font-smoothing: antialiased;
  }
  @media (max-width: 860px) {
    .li-root { grid-template-columns: 1fr; }
    .li-left { display: none; }
  }

  /* ── Left ── */
  .li-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .li-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .li-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .li-left__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 48px;
    gap: 40px;
  }

  /* Logo */
  .li-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    width: fit-content;
  }

  /* Eyebrow */
  .li-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-light);
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    padding: 5px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
    width: fit-content;
  }
  .li-eyebrow__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

  .li-left__hero { flex: 1; }
  .li-left__title {
    font-size: clamp(26px, 2.8vw, 36px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 14px;
  }
  .li-left__title-accent {
    background: linear-gradient(135deg, var(--accent-light) 0%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .li-left__sub {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 340px;
  }

  /* ── Feature list ── */
  .li-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .li-feature {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .li-feature__icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--accent-light);
    margin-top: 1px;
  }
  .li-feature__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2px;
  }
  .li-feature__desc {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.55;
  }

  /* ── Trust ── */
  .li-trust { display: flex; flex-direction: column; gap: 8px; }
  .li-trust__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* ── Right ── */
  .li-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    overflow-y: auto;
  }
  .li-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: formIn 0.6s ease both;
  }
  @keyframes formIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .li-form-header { margin-bottom: 28px; }
  .li-form-header__title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 6px;
  }
  .li-form-header__sub {
    font-size: 13px;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .li-link {
    color: var(--accent-light);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color var(--t);
  }
  .li-link:hover { color: #c4b5fd; }
  .li-link--sm { font-size: 12px; margin-left: auto; }

  /* ── Error ── */
  .li-error {
    background: rgba(244,63,94,0.07);
    border: 1px solid rgba(244,63,94,0.2);
    border-radius: var(--radius);
    padding: 11px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 20px;
  }

  /* ── Form ── */
  .li-form { display: flex; flex-direction: column; gap: 14px; }

  /* ── Fields ── */
  .li-field { display: flex; flex-direction: column; gap: 5px; }
  .li-field__label-row {
    display: flex;
    align-items: center;
  }
  .li-field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color var(--t);
  }
  .li-field--focused .li-field__label { color: var(--accent-light); }
  .li-field__req { color: var(--red); font-size: 11px; }
  .li-field__input {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 12px;
    font-size: 14px;
    font-family: var(--font);
    color: var(--text);
    outline: none;
    width: 100%;
    transition: border-color var(--t), background var(--t), box-shadow var(--t);
    -webkit-appearance: none;
  }
  .li-field__input::placeholder { color: var(--text-3); }
  .li-field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }
  .li-field__input--pw { padding-right: 44px; }
  .li-field__control { position: relative; }
  .li-field__toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-3);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color var(--t);
  }
  .li-field__toggle:hover { color: var(--text-2); }

  /* ── Remember me ── */
  .li-remember {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-2);
    user-select: none;
  }
  .li-checkbox {
    width: 18px; height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--border);
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--t);
    cursor: pointer;
    color: #fff;
  }
  .li-checkbox--checked {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 10px var(--accent-glow);
  }

  /* ── Submit ── */
  .li-btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    padding: 13px;
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    transition: all var(--t);
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    margin-top: 4px;
  }
  .li-btn-submit:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }
  .li-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }
  .li-btn-submit--loading { pointer-events: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Footer note ── */
  .li-footer-note {
    font-size: 11px;
    color: var(--text-3);
    text-align: center;
    margin-top: 20px;
    line-height: 1.5;
  }
`;

export default Login;
