import React, {useState, useEffect} from "react";
import {useAuthStore} from "../store/authStore";
import {useNavigate, Link} from "react-router-dom";
import {Navigation} from "./components/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────
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
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── Helper: user-friendly error messages ──────────────────────────────────
const getUserFriendlyError = (errorMessage) => {
  if (!errorMessage) return null;
  const lower = errorMessage.toLowerCase();
  // Network / technical errors – hide from user
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("unexpected token") ||
    lower.includes("json") ||
    lower.includes("syntaxerror") ||
    lower.includes("internal server error") ||
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503") ||
    lower.includes("504") ||
    lower.includes("econnrefused") ||
    lower.includes("timeout") ||
    lower.includes("aborted")
  ) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }
  // Otherwise return the original message (user-facing server error)
  return errorMessage;
};

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const trustBadges = [
  {icon: <Icons.Shield />, text: "SSL Encrypted"},
  {icon: <Icons.Shield />, text: "GDPR Compliant"},
  {icon: <Icons.Shield />, text: "No Credit Card"},
];

// ─── Carousel Images ──────────────────────────────────────────────────────────
const loginImages = [
  {
    src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop",
    alt: "Timetable dashboard preview",
    title: "Welcome back.",
    subtitle: "Continue building smarter timetables for your institution.",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
    alt: "Class schedule overview",
    title: "All your schedules, one place.",
    subtitle: "Instantly access every timetable, teacher, and room.",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
    alt: "Teacher allocation view",
    title: "Stay in sync, always.",
    subtitle: "Real‑time updates keep your entire team aligned.",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const {logIn, isLoading, error, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % loginImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", {replace: true});
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
    } catch {}
  };

  // ─── Field helpers ─────────────────────────────────────────────────────
  const getFieldState = (name) => {
    const value = {email, password}[name];
    return value && value.length > 0;
  };

  const fieldClass = (name) =>
    `li-field ${focused === name ? "li-field--focused" : ""} ${
      getFieldState(name) ? "li-field--filled" : ""
    }`;

  // ─── Navigation props ──────────────────────────────────────────────────
  const userName = "Guest";
  const institutionName = "Protiba";
  const notificationCount = 0;
  const handleLogout = () => {};

  return (
    <>
      <style>{css}</style>
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />
      <div className="li-root">
        {/* ── Left panel ── */}
        <div className="li-left">
          <div className="li-left__inner">
            {/* Carousel */}
            <div className="li-carousel">
              <div className="li-carousel__viewport">
                <div
                  className="li-carousel__track"
                  style={{transform: `translateX(-${currentSlide * 100}%)`}}
                >
                  {loginImages.map((img, idx) => (
                    <div key={idx} className="li-carousel__slide">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="li-carousel__img"
                      />
                      <div className="li-carousel__overlay">
                        <h2 className="li-carousel__title">{img.title}</h2>
                        <p className="li-carousel__subtitle">{img.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="li-carousel__dots">
                {loginImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`li-carousel__dot ${
                      idx === currentSlide ? "li-carousel__dot--active" : ""
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="li-trust">
              {trustBadges.map((b) => (
                <div key={b.text} className="li-trust__badge">
                  {b.icon}
                  {b.text}
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

            {/* ── Display error only if it's user-friendly ── */}
            {error && (
              <div className="li-error">
                <span>{getUserFriendlyError(error)}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="li-form" noValidate>
              {/* Email */}
              <div className={fieldClass("email")}>
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
              <div className={fieldClass("password")}>
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
                  {rememberMe && <Icons.Check />}
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

// ─── CSS ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F8F8F8;
    --surface: #FFFFFF;
    --surface-2: #F5F5F5;
    --surface-3: #F1F1F1;
    --border: rgba(43,43,43,0.06);
    --border-focus: rgba(124,58,237,0.45);
    --text: #2B2B2B;
    --text-2: #6E6E6E;
    --text-3: #858585;
    --text-4: #9A9A9A;
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
    padding-top: 68px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    -webkit-font-smoothing: antialiased;
  }

  @media (max-width: 860px) {
    .li-root {
      grid-template-columns: 1fr;
      min-height: auto;
      padding-top: 68px;
    }
  }

  /* ── Left panel ── */
  .li-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 100%;
  }
  .li-left::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -80px;
    width: 500px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .li-left::after {
    content: '';
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 350px;
    height: 350px;
    background: radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .li-left__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 48px 32px;
    gap: 24px;
  }
  @media (max-width: 860px) {
    .li-left__inner {
      padding: 24px 20px 16px;
      min-height: 50vh;
      gap: 16px;
    }
    .li-left {
      border-right: none;
      border-bottom: 1px solid var(--border);
      min-height: 0;
    }
  }

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

  /* ─── Carousel ─── */
  .li-carousel {
    flex: 1;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 240px;
  }
  .li-carousel__viewport {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .li-carousel__track {
    display: flex;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .li-carousel__slide {
    flex: 0 0 100%;
    position: relative;
    height: 100%;
    min-height: 200px;
  }
  .li-carousel__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .li-carousel__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
    color: #fff;
    pointer-events: none;
  }
  .li-carousel__title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    line-height: 1.2;
  }
  .li-carousel__subtitle {
    font-size: 13px;
    font-weight: 400;
    opacity: 0.9;
    line-height: 1.5;
  }
  @media (max-width: 860px) {
    .li-carousel__title {
      font-size: 18px;
    }
    .li-carousel__subtitle {
      font-size: 12px;
    }
  }

  .li-carousel__dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 10px 0;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .li-carousel__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-4);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all var(--t);
  }
  .li-carousel__dot--active {
    background: var(--accent);
    transform: scale(1.3);
    box-shadow: 0 0 8px var(--accent-glow);
  }

  /* ── Trust ── */
  .li-trust {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: auto;
    flex-shrink: 0;
  }
  .li-trust__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* ── Right panel ── */
  .li-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    overflow-y: auto;
  }
  @media (max-width: 860px) {
    .li-right {
      padding: 32px 20px;
    }
  }
  .li-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: formIn 0.6s ease both;
  }
  @keyframes formIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .li-form-header {
    margin-bottom: 28px;
  }
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
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color var(--t);
  }
  .li-link:hover {
    color: #6d28d9;
  }
  .li-link--sm {
    font-size: 12px;
    margin-left: auto;
  }

  .li-error {
    background: rgba(244,63,94,0.07);
    border: 1px solid rgba(244,63,94,0.2);
    border-radius: var(--radius);
    padding: 11px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 20px;
  }

  .li-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Fields ── */
  .li-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .li-field__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .li-field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color var(--t);
  }
  .li-field--focused .li-field__label {
    color: var(--accent);
  }
  .li-field__req {
    color: var(--red);
    font-size: 11px;
  }
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
  .li-field__input::placeholder {
    color: var(--text-4);
  }
  .li-field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }
  .li-field__input--pw {
    padding-right: 44px;
  }
  .li-field__control {
    position: relative;
  }
  .li-field__toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-4);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color var(--t);
  }
  .li-field__toggle:hover {
    color: var(--text-2);
  }

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
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--border);
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all var(--t);
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
  .li-btn-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .li-btn-submit--loading {
    pointer-events: none;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .li-footer-note {
    font-size: 11px;
    color: var(--text-3);
    text-align: center;
    margin-top: 20px;
    line-height: 1.5;
  }
`;

export default Login;
