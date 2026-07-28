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
  {icon: <Icons.Shield />, text: "SSL Encrypted"},
  {icon: <Icons.Shield />, text: "GDPR Compliant"},
  {icon: <Icons.Shield />, text: "No Credit Card"},
];

// ─── Timetable Image Carousel ──────────────────────────────────────────────
// Replace these URLs with your actual images
const timetableImages = [
  {
    src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop",
    alt: "Timetable dashboard preview",
    title: "Your institution's schedule, automated.",
    subtitle:
      "Join hundreds of schools already saving weeks of administrative work every semester.",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
    alt: "Class schedule overview",
    title: "Conflict-free timetables in minutes.",
    subtitle:
      "Our constraint engine resolves teacher, room, and class clashes automatically.",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
    alt: "Teacher allocation view",
    title: "Real-time sync for your team.",
    subtitle: "Push last-minute changes instantly. Everyone stays in sync.",
  },
];

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

// ─── Main ─────────────────────────────────────────────────────────────────────
const SignUp = () => {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Validation state
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const {signUp, isLoading, error, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();
  const strength = getStrength(password);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % timetableImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", {replace: true});
    }
  }, [isAuthenticated, navigate]);

  // ─── Validation functions ──────────────────────────────────────────────
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(value))
          error = "Include at least one uppercase letter";
        else if (!/[0-9]/.test(value)) error = "Include at least one number";
        else if (!/[^A-Za-z0-9]/.test(value))
          error = "Include at least one symbol";
        break;
      case "terms":
        if (!value) error = "You must agree to the terms";
        break;
      default:
        break;
    }
    return error;
  };

  const handleFieldChange = (name, value) => {
    const setters = {
      firstName: setFirstName,
      lastName: setLastName,
      email: setEmail,
      password: setPassword,
    };
    setters[name]?.(value);

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({...prev, [name]: error}));
    }
  };

  const handleFieldBlur = (name, value) => {
    setTouched((prev) => ({...prev, [name]: true}));
    const error = validateField(name, value);
    setErrors((prev) => ({...prev, [name]: error}));
  };

  const validateForm = () => {
    const fields = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      terms: agreeToTerms,
    };
    const newErrors = {};
    let hasError = false;
    Object.keys(fields).forEach((key) => {
      const error = validateField(key, fields[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });
    setErrors(newErrors);
    const allTouched = {};
    Object.keys(fields).forEach((key) => (allTouched[key] = true));
    setTouched(allTouched);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signUp(email, password, firstName, lastName);
    } catch {}
  };

  // ─── Field state helpers ──────────────────────────────────────────────
  const getFieldState = (name) => {
    const value = {firstName, lastName, email, password}[name];
    return value && value.length > 0;
  };

  const fieldClass = (name) =>
    `su-field ${focused === name ? "su-field--focused" : ""} ${
      getFieldState(name) ? "su-field--filled" : ""
    } ${touched[name] && errors[name] ? "su-field--error" : ""}`;

  // ─── Navigation props ──────────────────────────────────────────────────
  const userName = "Guest";
  const institutionName = "Protiba";
  const notificationCount = 0;
  const handleLogout = () => {};

  // ─── Filter error for display ──────────────────────────────────────────
  const displayError = error ? getUserFriendlyError(error) : null;

  return (
    <>
      <style>{css}</style>
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />
      <div className="su-root">
        {/* ── Left panel ── */}
        <div className="su-left">
          <div className="su-left__inner">
            {/* Carousel - full remaining space */}
            <div className="su-carousel">
              <div className="su-carousel__viewport">
                <div
                  className="su-carousel__track"
                  style={{transform: `translateX(-${currentSlide * 100}%)`}}
                >
                  {timetableImages.map((img, idx) => (
                    <div key={idx} className="su-carousel__slide">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="su-carousel__img"
                      />
                      <div className="su-carousel__overlay">
                        <h2 className="su-carousel__title">{img.title}</h2>
                        <p className="su-carousel__subtitle">{img.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="su-carousel__dots">
                {timetableImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`su-carousel__dot ${
                      idx === currentSlide ? "su-carousel__dot--active" : ""
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="su-trust">
              {trustBadges.map((b) => (
                <div key={b.text} className="su-trust__badge">
                  {b.icon}
                  {b.text}
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

            {/* ── Display error only if it's a user-facing message ── */}
            {displayError && (
              <div className="su-error">
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="su-form" noValidate>
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
                    onChange={(e) =>
                      handleFieldChange("firstName", e.target.value)
                    }
                    onFocus={() => setFocused("firstName")}
                    onBlur={(e) => {
                      setFocused(null);
                      handleFieldBlur("firstName", e.target.value);
                    }}
                    className="su-field__input"
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="su-field__error">{errors.firstName}</div>
                  )}
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
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value)
                    }
                    onFocus={() => setFocused("lastName")}
                    onBlur={(e) => {
                      setFocused(null);
                      handleFieldBlur("lastName", e.target.value);
                    }}
                    className="su-field__input"
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="su-field__error">{errors.lastName}</div>
                  )}
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
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={(e) => {
                    setFocused(null);
                    handleFieldBlur("email", e.target.value);
                  }}
                  className="su-field__input"
                />
                {touched.email && errors.email && (
                  <div className="su-field__error">{errors.email}</div>
                )}
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
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    onFocus={() => setFocused("password")}
                    onBlur={(e) => {
                      setFocused(null);
                      handleFieldBlur("password", e.target.value);
                    }}
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
                {touched.password && errors.password && (
                  <div className="su-field__error">{errors.password}</div>
                )}
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

              {/* Terms */}
              <div className="su-terms-wrapper">
                <label
                  className="su-terms"
                  onClick={() => {
                    const newVal = !agreeToTerms;
                    setAgreeToTerms(newVal);
                    handleFieldChange("terms", newVal);
                  }}
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
                {touched.terms && errors.terms && (
                  <div className="su-field__error">{errors.terms}</div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`su-btn-submit ${
                  isLoading ? "su-btn-submit--loading" : ""
                }`}
                disabled={isLoading}
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

  .su-root {
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
    .su-root {
      grid-template-columns: 1fr;
      min-height: auto;
      padding-top: 68px;
    }
  }

  /* ── Left ── */
  .su-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 100%;
  }
  .su-left::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -80px;
    width: 500px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .su-left::after {
    content: '';
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 350px;
    height: 350px;
    background: radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .su-left__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 48px 32px;
    gap: 24px;
  }
  @media (max-width: 860px) {
    .su-left__inner {
      padding: 24px 20px 16px;
      min-height: 50vh;
      gap: 16px;
    }
    .su-left {
      border-right: none;
      border-bottom: 1px solid var(--border);
      min-height: 0;
    }
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

  /* ─── Carousel ─── */
  .su-carousel {
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
  .su-carousel__viewport {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .su-carousel__track {
    display: flex;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .su-carousel__slide {
    flex: 0 0 100%;
    position: relative;
    height: 100%;
    min-height: 200px;
  }
  .su-carousel__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .su-carousel__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
    color: #fff;
    pointer-events: none;
  }
  .su-carousel__title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    line-height: 1.2;
  }
  .su-carousel__subtitle {
    font-size: 13px;
    font-weight: 400;
    opacity: 0.9;
    line-height: 1.5;
  }
  @media (max-width: 860px) {
    .su-carousel__title {
      font-size: 18px;
    }
    .su-carousel__subtitle {
      font-size: 12px;
    }
  }

  .su-carousel__dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 10px 0;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .su-carousel__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-4);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all var(--t);
  }
  .su-carousel__dot--active {
    background: var(--accent);
    transform: scale(1.3);
    box-shadow: 0 0 8px var(--accent-glow);
  }

  /* ── Trust ── */
  .su-trust {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: auto;
    flex-shrink: 0;
  }
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
  @media (max-width: 860px) {
    .su-right {
      padding: 32px 20px;
    }
  }
  .su-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: formIn 0.6s ease both;
  }
  @keyframes formIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .su-form-header {
    margin-bottom: 28px;
  }
  .su-form-header__title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 6px;
  }
  .su-form-header__sub {
    font-size: 13px;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .su-link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color var(--t);
  }
  .su-link:hover {
    color: #6d28d9;
  }

  .su-error {
    background: rgba(244,63,94,0.07);
    border: 1px solid rgba(244,63,94,0.2);
    border-radius: var(--radius);
    padding: 11px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 20px;
  }

  .su-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .su-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 480px) {
    .su-form__row {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  .su-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .su-field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color var(--t);
  }
  .su-field--focused .su-field__label {
    color: var(--accent);
  }
  .su-field__req {
    color: var(--red);
    font-size: 11px;
  }
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
  .su-field__input::placeholder {
    color: var(--text-4);
  }
  .su-field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }
  .su-field--error .su-field__input {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(244,63,94,0.12);
  }
  .su-field__input--pw {
    padding-right: 44px;
  }
  .su-field__control {
    position: relative;
  }
  .su-field__toggle {
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
  .su-field__toggle:hover {
    color: var(--text-2);
  }
  .su-field__error {
    font-size: 11px;
    color: var(--red);
    margin-top: 2px;
    font-weight: 500;
  }

  .su-strength {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .su-strength__bars {
    display: flex;
    gap: 4px;
    flex: 1;
  }
  .su-strength__bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--surface-3);
    transition: background 0.3s ease;
  }
  .su-strength__label {
    font-size: 11px;
    font-weight: 600;
    min-width: 44px;
    text-align: right;
    transition: color 0.3s ease;
  }

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

  .su-terms-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
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
    width: 18px;
    height: 18px;
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
  .su-btn-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .su-btn-submit--loading {
    pointer-events: none;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .su-footer-note {
    font-size: 11px;
    color: var(--text-3);
    text-align: center;
    margin-top: 20px;
    line-height: 1.5;
  }
`;

export default SignUp;
