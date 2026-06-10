import React, {useState, useRef, useEffect} from "react";
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
  Mail: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect
        x="2"
        y="4.5"
        width="18"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2 8l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
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
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 7A5 5 0 1 1 7 2a5 5 0 0 1 3.54 1.46L12 5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2v3h-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10l5 5 7-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Back: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M12 7.5H3M6.5 4L3 7.5 6.5 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── OTP Input ────────────────────────────────────────────────────────────────
const OtpInput = ({value, onChange, hasError, isSuccess}) => {
  const inputsRef = useRef([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = val;
    const newCode = next.join("").replace(/ /g, "");
    onChange(newCode);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace") {
      if (!digits[idx] && idx > 0) {
        const next = [...digits];
        next[idx - 1] = "";
        onChange(next.join("").replace(/ /g, ""));
        inputsRef.current[idx - 1]?.focus();
      } else {
        const next = [...digits];
        next[idx] = "";
        onChange(next.join("").replace(/ /g, ""));
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div className="vf-otp">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d === " " ? "" : d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`vf-otp__cell ${d && d !== " " ? "vf-otp__cell--filled" : ""} ${hasError ? "vf-otp__cell--error" : ""} ${isSuccess ? "vf-otp__cell--success" : ""}`}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

// ─── Countdown Timer ──────────────────────────────────────────────────────────
const useCountdown = (initial = 60) => {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) {
      setActive(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, active]);

  const reset = () => {
    setSeconds(initial);
    setActive(true);
  };
  return {seconds, canResend: !active, reset};
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const Verif = () => {
  const [code, setCode] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [justResent, setJustResent] = useState(false);
  const {verify, isLoading, error} = useAuthStore();
  const navigate = useNavigate();
  const {seconds, canResend, reset} = useCountdown(60);

  const isComplete = code.replace(/\D/g, "").length === 6;
  const isSuccess = false; // flip to true post-verify if you want a success state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    try {
      await verify(code);
      navigate("/home");
    } catch {}
  };

  const handleResend = () => {
    if (!canResend) return;
    setResendCount((c) => c + 1);
    setJustResent(true);
    setCode("");
    reset();
    setTimeout(() => setJustResent(false), 3000);
  };

  const progress = ((6 - (6 - code.replace(/\D/g, "").length)) / 6) * 100;

  return (
    <>
      <style>{css}</style>
      <div className="vf-root">
        {/* ── Left panel ── */}
        <div className="vf-left">
          <div className="vf-left__inner">
            <Link to="/" className="vf-logo">
              <Icons.Logo />
              <span>Protiba</span>
            </Link>

            <div className="vf-left__hero">
              <div className="vf-eyebrow">
                <span className="vf-eyebrow__dot" />
                Identity Verification
              </div>
              <h1 className="vf-left__title">
                One last step
                <br />
                <span className="vf-left__title-accent">
                  to secure your account.
                </span>
              </h1>
              <p className="vf-left__sub">
                We sent a 6-digit verification code to your email address. This
                ensures only you can access your institution's scheduling data.
              </p>
            </div>

            {/* Security context card */}
            <div className="vf-security-card">
              <div className="vf-security-card__icon">
                <Icons.Shield />
              </div>
              <div>
                <div className="vf-security-card__title">Why we verify</div>
                <div className="vf-security-card__body">
                  Your account manages sensitive institutional data — student
                  schedules, faculty allocations, and room assignments. Email
                  verification prevents unauthorized access.
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="vf-steps">
              {[
                {label: "Account created", done: true},
                {label: "Email verification", done: false, active: true},
                {label: "Set up institution", done: false},
              ].map((step, i) => (
                <div
                  key={i}
                  className={`vf-step ${step.done ? "vf-step--done" : ""} ${step.active ? "vf-step--active" : ""}`}
                >
                  <div className="vf-step__dot">
                    {step.done ? <Icons.Check /> : <span>{i + 1}</span>}
                  </div>
                  <span className="vf-step__label">{step.label}</span>
                </div>
              ))}
            </div>

            <div className="vf-trust">
              {[
                "SSL encrypted",
                "GDPR compliant",
                "No credit card required",
              ].map((b) => (
                <div key={b} className="vf-trust__badge">
                  <Icons.Shield />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="vf-right">
          <div className="vf-form-wrap">
            {/* Header */}
            <div className="vf-form-header">
              <div className="vf-mail-icon">
                <Icons.Mail />
                {/* Animated ring */}
                <div className="vf-mail-icon__ring" />
              </div>
              <h2 className="vf-form-header__title">Check your email</h2>
              <p className="vf-form-header__sub">
                Enter the 6-digit code we sent to verify your identity. The code
                expires in <strong>10 minutes</strong>.
              </p>
            </div>

            {/* Progress bar (fills as digits entered) */}
            <div className="vf-progress">
              <div className="vf-progress__track">
                <div
                  className="vf-progress__fill"
                  style={{width: `${progress}%`}}
                />
              </div>
              <span className="vf-progress__label">
                {code.replace(/\D/g, "").length}/6 digits entered
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="vf-error">
                <span>{error}</span>
              </div>
            )}

            {/* Just resent confirmation */}
            {justResent && (
              <div className="vf-success-banner">
                <Icons.Check />
                <span>New code sent — check your inbox.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="vf-form">
              <OtpInput
                value={code}
                onChange={setCode}
                hasError={!!error}
                isSuccess={isSuccess}
              />

              <button
                type="submit"
                className={`vf-btn-submit ${isLoading ? "vf-btn-submit--loading" : ""} ${!isComplete ? "vf-btn-submit--incomplete" : ""}`}
                disabled={isLoading || !isComplete}
              >
                {isLoading ? (
                  <>
                    <Icons.Loader /> Verifying…
                  </>
                ) : (
                  <>
                    Verify & Continue <Icons.Arrow />
                  </>
                )}
              </button>
            </form>

            {/* Resend section */}
            <div className="vf-resend">
              <p className="vf-resend__label">Didn't receive it?</p>
              {canResend ? (
                <button
                  type="button"
                  className="vf-resend__btn vf-resend__btn--active"
                  onClick={handleResend}
                >
                  <Icons.Refresh /> Resend code
                  {resendCount > 0 && (
                    <span className="vf-resend__count">({resendCount})</span>
                  )}
                </button>
              ) : (
                <div className="vf-resend__timer">
                  <div className="vf-resend__timer-ring">
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="var(--border)"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="var(--accent-light)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 6}`}
                        strokeDashoffset={`${2 * Math.PI * 6 * (seconds / 60)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 8 8)"
                        style={{transition: "stroke-dashoffset 1s linear"}}
                      />
                    </svg>
                  </div>
                  Resend available in <strong>{seconds}s</strong>
                </div>
              )}
            </div>

            {/* Back link */}
            <div className="vf-back">
              <Link to="/login" className="vf-back__link">
                <Icons.Back /> Back to sign in
              </Link>
            </div>

            <p className="vf-footer-note">
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
    --green-glow: rgba(16,185,129,0.12);
    --red: #f43f5e;
    --radius: 10px;
    --radius-lg: 14px;
    --font: 'Inter', -apple-system, sans-serif;
    --t: 180ms cubic-bezier(0.4,0,0.2,1);
  }

  .vf-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    -webkit-font-smoothing: antialiased;
  }
  @media (max-width: 860px) {
    .vf-root { grid-template-columns: 1fr; }
    .vf-left { display: none; }
  }

  /* ── Left ── */
  .vf-left {
    position: relative;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .vf-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .vf-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 350px; height: 350px;
    background: radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .vf-left__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 48px;
    gap: 36px;
  }

  .vf-logo {
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

  .vf-eyebrow {
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
  .vf-eyebrow__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

  .vf-left__hero { flex: 1; }
  .vf-left__title {
    font-size: clamp(26px, 2.8vw, 36px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 14px;
  }
  .vf-left__title-accent {
    background: linear-gradient(135deg, var(--accent-light) 0%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .vf-left__sub {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 340px;
  }

  /* Security card */
  .vf-security-card {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
  }
  .vf-security-card__icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: var(--accent-glow);
    border: 1px solid rgba(124,58,237,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--accent-light);
  }
  .vf-security-card__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }
  .vf-security-card__body {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.6;
  }

  /* Steps */
  .vf-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .vf-steps::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 18px;
    bottom: 18px;
    width: 1px;
    background: var(--border);
  }
  .vf-step {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    position: relative;
    z-index: 1;
  }
  .vf-step__dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 700;
    color: var(--text-3);
    transition: all var(--t);
  }
  .vf-step--done .vf-step__dot {
    background: var(--green);
    border-color: var(--green);
    color: #fff;
  }
  .vf-step--done .vf-step__dot svg { width: 11px; height: 11px; }
  .vf-step--active .vf-step__dot {
    background: var(--accent-glow);
    border-color: var(--accent-light);
    color: var(--accent-light);
    box-shadow: 0 0 10px rgba(124,58,237,0.25);
  }
  .vf-step__label {
    font-size: 13px;
    color: var(--text-3);
    font-weight: 500;
    transition: color var(--t);
  }
  .vf-step--done .vf-step__label { color: var(--text-2); }
  .vf-step--active .vf-step__label { color: var(--text); font-weight: 600; }

  /* Trust */
  .vf-trust { display: flex; flex-direction: column; gap: 8px; }
  .vf-trust__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* ── Right ── */
  .vf-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    overflow-y: auto;
  }
  .vf-form-wrap {
    width: 100%;
    max-width: 420px;
    animation: formIn 0.6s ease both;
  }
  @keyframes formIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* Mail icon */
  .vf-mail-icon {
    width: 56px; height: 56px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-light);
    margin-bottom: 20px;
    position: relative;
  }
  .vf-mail-icon__ring {
    position: absolute;
    inset: -6px;
    border-radius: 22px;
    border: 1px solid rgba(124,58,237,0.15);
    animation: ringPulse 2.5s ease-in-out infinite;
  }
  @keyframes ringPulse {
    0%,100% { opacity: 0; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.04); }
  }

  .vf-form-header { margin-bottom: 24px; }
  .vf-form-header__title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 8px;
  }
  .vf-form-header__sub {
    font-size: 13px;
    color: var(--text-3);
    line-height: 1.65;
  }
  .vf-form-header__sub strong { color: var(--text-2); font-weight: 600; }

  /* Progress */
  .vf-progress {
    margin-bottom: 20px;
  }
  .vf-progress__track {
    height: 2px;
    background: var(--surface-3);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 6px;
  }
  .vf-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%);
    border-radius: 2px;
    transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .vf-progress__label {
    font-size: 11px;
    color: var(--text-3);
    font-weight: 500;
  }

  /* Error */
  .vf-error {
    background: rgba(244,63,94,0.07);
    border: 1px solid rgba(244,63,94,0.2);
    border-radius: var(--radius);
    padding: 11px 14px;
    font-size: 13px;
    color: #f87171;
    margin-bottom: 16px;
  }

  /* Success banner */
  .vf-success-banner {
    background: var(--green-glow);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: var(--radius);
    padding: 10px 14px;
    font-size: 13px;
    color: var(--green);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: formIn 0.3s ease both;
  }
  .vf-success-banner svg { flex-shrink: 0; }

  /* ── OTP ── */
  .vf-form { display: flex; flex-direction: column; gap: 20px; }

  .vf-otp {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .vf-otp__cell {
    width: 52px;
    height: 60px;
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 22px;
    font-weight: 700;
    font-family: var(--font);
    color: var(--text);
    text-align: center;
    outline: none;
    transition: border-color var(--t), background var(--t), box-shadow var(--t), transform var(--t);
    -webkit-appearance: none;
    caret-color: var(--accent-light);
  }
  .vf-otp__cell:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
    transform: translateY(-2px);
  }
  .vf-otp__cell--filled {
    border-color: rgba(124,58,237,0.3);
    background: var(--surface-3);
  }
  .vf-otp__cell--error {
    border-color: rgba(244,63,94,0.4) !important;
    background: rgba(244,63,94,0.05) !important;
    animation: shake 0.4s ease;
  }
  .vf-otp__cell--success {
    border-color: rgba(16,185,129,0.4) !important;
    background: var(--green-glow) !important;
    color: var(--green) !important;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }
  @media (max-width: 400px) {
    .vf-otp__cell { width: 42px; height: 52px; font-size: 18px; }
    .vf-otp { gap: 7px; }
  }

  /* Submit */
  .vf-btn-submit {
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
  }
  .vf-btn-submit:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }
  .vf-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }
  .vf-btn-submit--incomplete { opacity: 0.45; }
  .vf-btn-submit--loading { pointer-events: none; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Resend */
  .vf-resend {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .vf-resend__label { font-size: 13px; color: var(--text-3); }
  .vf-resend__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 9px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font);
    color: var(--text-2);
    cursor: not-allowed;
    transition: all var(--t);
  }
  .vf-resend__btn--active {
    cursor: pointer;
    color: var(--accent-light);
    border-color: rgba(124,58,237,0.2);
    background: var(--accent-glow);
  }
  .vf-resend__btn--active:hover {
    background: rgba(124,58,237,0.2);
    transform: translateY(-1px);
  }
  .vf-resend__count { font-size: 11px; color: var(--text-3); }
  .vf-resend__timer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-3);
    font-weight: 500;
  }
  .vf-resend__timer strong { color: var(--text-2); }
  .vf-resend__timer-ring { display: flex; align-items: center; }

  /* Back */
  .vf-back {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  .vf-back__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-3);
    text-decoration: none;
    transition: color var(--t);
    font-weight: 500;
  }
  .vf-back__link:hover { color: var(--text-2); }

  /* Footer */
  .vf-footer-note {
    font-size: 11px;
    color: var(--text-3);
    text-align: center;
    margin-top: 20px;
    line-height: 1.5;
  }
`;

export default Verif;
