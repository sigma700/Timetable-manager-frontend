import React, {useState, useEffect} from "react";
import {useAuthStore} from "../store/authStore";
import {useNavigate, Link} from "react-router-dom";

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
  User: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle
        cx="7.5"
        cy="4.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M2 13c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5"
        stroke="currentColor"
        strokeWidth="1.2"
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
};

// ─── Password Strength ────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return {score: 0, label: "", color: "transparent"};
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    {label: "", color: "transparent"},
    {label: "Weak", color: "#f43f5e"},
    {label: "Fair", color: "#f59e0b"},
    {label: "Good", color: "#3b82f6"},
    {label: "Strong", color: "#10b981"},
  ];
  return {score, ...map[score]};
};

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const trustBadges = [
  "SSL encrypted",
  "GDPR compliant",
  "No credit card required",
];

// ─── Social Proof ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    text: "Saved our admin team three full weeks every semester.",
    author: "St. Mary's Academy",
    role: "Nairobi",
  },
  {
    text: "Zero conflicts in our first generated timetable. Remarkable.",
    author: "Greenfield College",
    role: "Mombasa",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const {signUp, isLoading, error, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();
  const strength = getStrength(password);

  useEffect(() => {
    const t = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", {replace: true});
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) return;
    try {
      await signUp(email, password, firstName, lastName);
    } catch {}
  };

  // Safe field state checker (no eval)
  const getFieldState = (name) => {
    const value = {firstName, lastName, email, password}[name];
    return value && value.length > 0;
  };

  const fieldClass = (name) =>
    `su-field ${focused === name ? "su-field--focused" : ""} ${
      getFieldState(name) ? "su-field--filled" : ""
    }`;

  return (
    <>
      <style>{css}</style>
      <div className="su-root">
        {/* ── Left panel ── */}
        <div className="su-left">
          <div className="su-left__inner">
            {/* Logo */}
            <Link to="/" className="su-logo">
              <Icons.Logo />
              <span>Protiba</span>
            </Link>

            {/* Heading */}
            <div className="su-left__hero">
              <div className="su-eyebrow">
                <span className="su-eyebrow__dot" />
                Free to get started
              </div>
              <h1 className="su-left__title">
                Your institution's
                <br />
                <span className="su-left__title-accent">
                  schedule, automated.
                </span>
              </h1>
              <p className="su-left__sub">
                Join hundreds of schools already saving weeks of administrative
                work every semester.
              </p>
            </div>

            {/* Testimonial carousel - FIXED */}
            <div className="su-testimonial">
              <div
                className="su-testimonial__track"
                style={{transform: `translateY(-${testimonialIdx * 100}%)`}}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="su-testimonial__item">
                    <p className="su-testimonial__text">"{t.text}"</p>
                    <div className="su-testimonial__author">
                      <span className="su-testimonial__name">{t.author}</span>
                      <span className="su-testimonial__role">{t.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="su-testimonial__dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`su-testimonial__dot ${
                      i === testimonialIdx ? "su-testimonial__dot--active" : ""
                    }`}
                    onClick={() => setTestimonialIdx(i)}
                  />
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="su-trust">
              {trustBadges.map((b) => (
                <div key={b} className="su-trust__badge">
                  <Icons.Shield />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="su-right">
          <div className="su-form-wrap">
            <div className="su-form-header">
              <h2 className="su-form-header__title">Create your account</h2>
              <p className="su-form-header__sub">
                Already have one?{" "}
                <Link to="/login" className="su-link">
                  Sign in instead <Icons.Arrow />
                </Link>
              </p>
            </div>

            {error && (
              <div className="su-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="su-form">
              {/* Name row */}
              <div className="su-form__row">
                <div className={fieldClass("firstName")}>
                  <label className="su-field__label">
                    <Icons.User /> First Name{" "}
                    <span className="su-field__req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocused("firstName")}
                    onBlur={() => setFocused(null)}
                    className="su-field__input"
                  />
                </div>
                <div className={fieldClass("lastName")}>
                  <label className="su-field__label">
                    Last Name <span className="su-field__req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocused("lastName")}
                    onBlur={() => setFocused(null)}
                    className="su-field__input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className={fieldClass("email")}>
                <label className="su-field__label">
                  <Icons.Mail /> Email Address{" "}
                  <span className="su-field__req">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@institution.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="su-field__input"
                />
              </div>

              {/* Password */}
              <div className={fieldClass("password")}>
                <label className="su-field__label">
                  <Icons.Lock /> Password{" "}
                  <span className="su-field__req">*</span>
                </label>
                <div className="su-field__control">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="su-field__input su-field__input--pw"
                  />
                  <button
                    type="button"
                    className="su-field__toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
                {/* Strength meter */}
                {password && (
                  <div className="su-strength">
                    <div className="su-strength__bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="su-strength__bar"
                          style={{
                            background:
                              i <= strength.score ? strength.color : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="su-strength__label"
                      style={{color: strength.color}}
                    >
                      {strength.label}
                    </span>
                  </div>
                )}
                <div className="su-pw-rules">
                  {[
                    {label: "8+ characters", met: password.length >= 8},
                    {label: "Uppercase", met: /[A-Z]/.test(password)},
                    {label: "Number", met: /[0-9]/.test(password)},
                    {label: "Symbol", met: /[^A-Za-z0-9]/.test(password)},
                  ].map((r) => (
                    <span
                      key={r.label}
                      className={`su-pw-rule ${r.met ? "su-pw-rule--met" : ""}`}
                    >
                      <Icons.Check /> {r.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Terms and conditions - FIXED: fully clickable checkbox */}
              <label
                className="su-terms"
                onClick={() => setAgreeToTerms((prev) => !prev)}
              >
                <div
                  className={`su-checkbox ${
                    agreeToTerms ? "su-checkbox--checked" : ""
                  }`}
                >
                  {agreeToTerms && <Icons.Check />}
                </div>
                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="su-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    terms and conditions
                  </Link>
                </span>
              </label>

              {/* Submit button - enabled only when terms are accepted */}
              <button
                type="submit"
                className={`su-btn-submit ${
                  isLoading ? "su-btn-submit--loading" : ""
                }`}
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <Icons.Loader /> Creating account…
                  </>
                ) : (
                  <>
                    Create Account <Icons.Arrow />
                  </>
                )}
              </button>
            </form>

            <p className="su-footer-note">
              Protected by industry-standard encryption. We never sell your
              data.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Styles (FIXED: carousel and checkbox) ───────────────────────────────────
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

  .su-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    -webkit-font-smoothing: antialiased;
  }
  @media (max-width: 860px) {
    .su-root { grid-template-columns: 1fr; }
    .su-left { display: none; }
  }

  /* ── Left ── */
  .su-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .su-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .su-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .su-left__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 48px;
    gap: 40px;
  }
  .su-logo {
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
  .su-eyebrow {
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
  .su-eyebrow__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  .su-left__hero { flex: 1; }
  .su-left__title {
    font-size: clamp(26px, 2.8vw, 36px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 14px;
  }
  .su-left__title-accent {
    background: linear-gradient(135deg, var(--accent-light) 0%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .su-left__sub {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 340px;
  }

  /* ── Testimonial Carousel - FIXED ── */
  .su-testimonial {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    overflow: hidden;
    position: relative;
    height: 120px;
  }
  .su-testimonial__track {
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .su-testimonial__item {
    flex: 0 0 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .su-testimonial__text {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.65;
    font-style: italic;
    margin-bottom: 10px;
  }
  .su-testimonial__author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
  }
  .su-testimonial__name { font-size: 12px; font-weight: 600; color: var(--text); }
  .su-testimonial__role { font-size: 11px; color: var(--text-3); }
  .su-testimonial__dots { position: absolute; bottom: 14px; left: 24px; display: flex; gap: 5px; }
  .su-testimonial__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--border);
    border: none;
    cursor: pointer;
    transition: background var(--t), transform var(--t);
    padding: 0;
  }
  .su-testimonial__dot--active { background: var(--accent-light); transform: scale(1.3); }

  /* ── Trust ── */
  .su-trust { display: flex; flex-direction: column; gap: 8px; }
  .su-trust__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* ── Right ── */
  .su-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    overflow-y: auto;
  }
  .su-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: formIn 0.6s ease both;
  }
  @keyframes formIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .su-form-header { margin-bottom: 28px; }
  .su-form-header__title { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; color: var(--text); margin-bottom: 6px; }
  .su-form-header__sub { font-size: 13px; color: var(--text-3); display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }

  .su-link {
    color: var(--accent-light);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color var(--t);
  }
  .su-link:hover { color: #c4b5fd; }

  /* ── Error ── */
  .su-error {
    background: rgba(244,63,94,0.07);
    border: 1px solid rgba(244,63,94,0.2);
    border-radius: var(--radius);
    padding: 11px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 20px;
  }

  /* ── Form ── */
  .su-form { display: flex; flex-direction: column; gap: 14px; }
  .su-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── Fields ── */
  .su-field { display: flex; flex-direction: column; gap: 5px; }
  .su-field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color var(--t);
  }
  .su-field--focused .su-field__label { color: var(--accent-light); }
  .su-field__req { color: var(--red); font-size: 11px; }
  .su-field__input {
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
  .su-field__input::placeholder { color: var(--text-3); }
  .su-field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }
  .su-field__input--pw { padding-right: 44px; }
  .su-field__control { position: relative; }
  .su-field__toggle {
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
  .su-field__toggle:hover { color: var(--text-2); }

  /* ── Password Strength ── */
  .su-strength {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .su-strength__bars { display: flex; gap: 4px; flex: 1; }
  .su-strength__bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--surface-3);
    transition: background 0.3s ease;
  }
  .su-strength__label { font-size: 11px; font-weight: 600; min-width: 44px; text-align: right; transition: color 0.3s ease; }

  .su-pw-rules {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .su-pw-rule {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 500;
    color: var(--text-3);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 3px 7px;
    transition: all var(--t);
  }
  .su-pw-rule--met {
    color: var(--green);
    background: rgba(16,185,129,0.07);
    border-color: rgba(16,185,129,0.2);
  }

  /* ── Custom Checkbox - FIXED ── */
  .su-terms {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.5;
    user-select: none;
  }
  .su-checkbox {
    width: 18px; height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--border);
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all var(--t);
    color: #fff;
  }
  .su-checkbox--checked {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 10px var(--accent-glow);
  }
  .su-terms .su-link {
    position: relative;
    z-index: 2;
  }

  /* ── Submit Button ── */
  .su-btn-submit {
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
  .su-btn-submit:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }
  .su-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }
  .su-btn-submit--loading { pointer-events: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Footer note ── */
  .su-footer-note {
    font-size: 11px;
    color: var(--text-3);
    text-align: center;
    margin-top: 20px;
    line-height: 1.5;
  }
`;

export default SignUp;
