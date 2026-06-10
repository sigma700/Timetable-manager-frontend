import React, {useState, useRef, useEffect} from "react";

// ─── useInView ────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {threshold},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Reveal = ({children, delay = 0, className = "", style = {}}) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Location: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1.5C6.51 1.5 4.5 3.51 4.5 6c0 3.75 4.5 10.5 4.5 10.5S13.5 9.75 13.5 6c0-2.49-2.01-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3.5 3h3l1.5 3.75-1.75 1.25a9 9 0 0 0 3.75 3.75L11.25 10 15 11.5V14.5a1.5 1.5 0 0 1-1.5 1.5C6.272 16 2 11.728 2 5A1.5 1.5 0 0 1 3.5 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="4"
        width="14"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2 5.5l7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 5.5V9l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14 2L9 14l-2-4-4-2 11-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14 2L7 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  LinkedIn: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M4 6.5V11.5M4 4.5V4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7.5 11.5V9c0-1.38.5-2.5 2-2.5S11 7.62 11 9v2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M7.5 6.5V11.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Twitter: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2.5l5 6L2 13.5h1.5l4.25-4.8 3.25 4.8H14L8.75 7 13.5 2.5H12L7.5 6.9 4.5 2.5H2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9 14V8.5h2l.5-2H9V5c0-.55.25-1 1-1h1.5V2.25C11.15 2.1 10.45 2 9.75 2 7.75 2 6.5 3.15 6.5 5.5V6.5H4.5v2H6.5V14H9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
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
      className="spin"
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
};

// ─── Contact Info Items ───────────────────────────────────────────────────────
const contactItems = [
  {
    Icon: Icons.Location,
    label: "Location",
    value: "Kimathi Street, Nyeri\nBoma Nyeri, Kenya",
    accent: "#7c3aed",
  },
  {
    Icon: Icons.Phone,
    label: "Phone",
    value: "+254 792 624 342",
    accent: "#0ea5e9",
  },
  {
    Icon: Icons.Mail,
    label: "Email",
    value: "allankirimi65@gmail.com",
    accent: "#10b981",
  },
  {
    Icon: Icons.Clock,
    label: "Hours",
    value: "Mon–Fri: 9AM – 6PM\nSat: 10AM – 4PM",
    accent: "#f59e0b",
  },
];

const socialLinks = [
  {
    Icon: Icons.LinkedIn,
    href: "https://www.linkedin.com/in/allan-kirimi-31ba92323",
    label: "LinkedIn",
  },
  {Icon: Icons.Twitter, href: "#", label: "Twitter"},
  {Icon: Icons.Instagram, href: "#", label: "Instagram"},
  {Icon: Icons.Facebook, href: "#", label: "Facebook"},
];

const stats = [
  {value: "24/7", label: "Support available"},
  {value: "<1h", label: "Response time"},
  {value: "100%", label: "Satisfaction rate"},
  {value: "500+", label: "Institutions served"},
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Contacts = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [focused, setFocused] = useState(null);

  const handleChange = (e) =>
    setForm((p) => ({...p, [e.target.name]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("sent");
  };

  const fieldClass = (name) =>
    `c-field ${focused === name ? "c-field--focused" : ""} ${form[name] ? "c-field--filled" : ""}`;

  return (
    <>
      <style>{css}</style>
      <div className="contacts-root">
        {/* ── Header ── */}
        <header className="contacts-header">
          <div className="contacts-header__glow" />
          <div className="contacts-header__inner">
            <Reveal>
              <div className="eyebrow">
                <span className="eyebrow__dot" />
                Get in Touch
              </div>
              <h1 className="contacts-header__title">
                We're here
                <br />
                <span className="contacts-header__title-accent">
                  when you need us.
                </span>
              </h1>
              <p className="contacts-header__sub">
                Questions about scheduling, onboarding your institution, or just
                exploring what Protiba can do — we respond fast and with genuine
                care.
              </p>
            </Reveal>

            {/* Stats bar */}
            <Reveal delay={150}>
              <div className="stats-bar">
                {stats.map((s, i) => (
                  <div key={i} className="stats-bar__item">
                    <span className="stats-bar__value">{s.value}</span>
                    <span className="stats-bar__label">{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="contacts-body">
          <div className="contacts-grid">
            {/* ── Left: Info Panel ── */}
            <Reveal className="info-panel">
              <div className="info-panel__section">
                <p className="info-panel__heading">Contact details</p>
                <div className="contact-items">
                  {contactItems.map(({Icon, label, value, accent}, i) => (
                    <Reveal key={label} delay={i * 70}>
                      <div
                        className="contact-item"
                        style={{"--accent": accent}}
                      >
                        <div className="contact-item__icon">
                          <Icon />
                        </div>
                        <div className="contact-item__body">
                          <span className="contact-item__label">{label}</span>
                          <span className="contact-item__value">{value}</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <div className="info-panel__divider" />

              <div className="info-panel__section">
                <p className="info-panel__heading">Follow us</p>
                <div className="social-links">
                  {socialLinks.map(({Icon, href, label}) => (
                    <a
                      key={label}
                      href={href}
                      className="social-link"
                      title={label}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              <div className="info-panel__divider" />

              <div className="info-panel__section">
                <div className="response-badge">
                  <div className="response-badge__pulse" />
                  <div>
                    <p className="response-badge__title">
                      Average response time
                    </p>
                    <p className="response-badge__value">
                      Under 1 hour on business days
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Right: Form ── */}
            <Reveal delay={100} className="form-panel">
              {status === "sent" ? (
                <div className="form-success">
                  <div className="form-success__icon">
                    <Icons.Check />
                  </div>
                  <h3 className="form-success__title">Message received</h3>
                  <p className="form-success__body">
                    Thanks for reaching out. We'll get back to you within one
                    business day.
                  </p>
                  <button
                    className="btn-ghost-sm"
                    onClick={() => {
                      setStatus("idle");
                      setForm({name: "", email: "", subject: "", message: ""});
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-panel__header">
                    <h2 className="form-panel__title">Send a message</h2>
                    <p className="form-panel__sub">
                      We read every message personally.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="c-form">
                    <div className="c-form__row">
                      <div className={fieldClass("name")}>
                        <label className="c-field__label">
                          Full Name <span className="c-field__req">*</span>
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={form.name}
                          onChange={handleChange}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          className="c-field__input"
                        />
                      </div>
                      <div className={fieldClass("email")}>
                        <label className="c-field__label">
                          Email Address <span className="c-field__req">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="you@institution.edu"
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          className="c-field__input"
                        />
                      </div>
                    </div>

                    <div className={fieldClass("subject")}>
                      <label className="c-field__label">
                        Subject <span className="c-field__req">*</span>
                      </label>
                      <input
                        name="subject"
                        type="text"
                        required
                        placeholder="What is this regarding?"
                        value={form.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused("subject")}
                        onBlur={() => setFocused(null)}
                        className="c-field__input"
                      />
                    </div>

                    <div className={fieldClass("message")}>
                      <label className="c-field__label">
                        Message <span className="c-field__req">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        placeholder="Describe how we can help your institution…"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className="c-field__input c-field__textarea"
                      />
                      <span className="c-field__count">
                        {form.message.length} chars
                      </span>
                    </div>

                    <button
                      type="submit"
                      className={`btn-send ${status === "loading" ? "btn-send--loading" : ""}`}
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <>
                          <Icons.Loader /> Sending…
                        </>
                      ) : (
                        <>
                          <Icons.Send /> Send Message
                        </>
                      )}
                    </button>

                    <p className="form-footnote">
                      By submitting, you agree to our privacy policy. We never
                      share your data.
                    </p>
                  </form>
                </>
              )}
            </Reveal>
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
    --radius: 10px;
    --radius-lg: 16px;
    --font: 'Inter', -apple-system, sans-serif;
    --t: 180ms cubic-bezier(0.4,0,0.2,1);
  }

  .contacts-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .contacts-header {
    position: relative;
    overflow: hidden;
    padding: 80px 48px 64px;
    border-bottom: 1px solid var(--border);
  }
  .contacts-header__glow {
    position: absolute;
    top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .contacts-header__inner {
    position: relative;
    max-width: 960px;
    margin: 0 auto;
  }
  .eyebrow {
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
    padding: 5px 13px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  .eyebrow__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  .contacts-header__title {
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .contacts-header__title-accent {
    background: linear-gradient(135deg, var(--accent-light) 0%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .contacts-header__sub {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 520px;
    margin-bottom: 40px;
  }

  /* ── Stats Bar ── */
  .stats-bar {
    display: inline-flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .stats-bar__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 28px;
    border-right: 1px solid var(--border);
  }
  .stats-bar__item:last-child { border-right: none; }
  .stats-bar__value { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; }
  .stats-bar__label { font-size: 11px; color: var(--text-3); font-weight: 500; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }

  /* ── Body ── */
  .contacts-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 56px 48px 80px;
  }
  .contacts-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 860px) { .contacts-grid { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .contacts-body, .contacts-header { padding-left: 20px; padding-right: 20px; } }

  /* ── Info Panel ── */
  .info-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    position: sticky;
    top: 24px;
  }
  .info-panel__heading {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--text-3);
    margin-bottom: 16px;
  }
  .info-panel__divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }
  .info-panel__section {}

  /* ── Contact Items ── */
  .contact-items { display: flex; flex-direction: column; gap: 8px; }
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border-radius: var(--radius);
    border: 1px solid transparent;
    transition: background var(--t), border-color var(--t);
    cursor: default;
  }
  .contact-item:hover {
    background: var(--surface-2);
    border-color: var(--border);
  }
  .contact-item__icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-light);
    flex-shrink: 0;
    /* Fallback for browsers without color-mix */
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.22);
  }
  .contact-item__body { display: flex; flex-direction: column; gap: 2px; }
  .contact-item__label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-3); }
  .contact-item__value { font-size: 13px; font-weight: 500; color: var(--text-2); white-space: pre-line; line-height: 1.5; }

  /* ── Social Links ── */
  .social-links { display: flex; gap: 8px; }
  .social-link {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    text-decoration: none;
    transition: all var(--t);
  }
  .social-link:hover {
    background: var(--surface-3);
    border-color: var(--border-focus);
    color: var(--accent-light);
    transform: translateY(-2px);
  }

  /* ── Response Badge ── */
  .response-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: rgba(16,185,129,0.06);
    border: 1px solid rgba(16,185,129,0.15);
    border-radius: var(--radius);
  }
  .response-badge__pulse {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 0 rgba(16,185,129,0.4);
    animation: ripple 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes ripple {
    0%  { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
    70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
    100%{ box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  }
  .response-badge__title { font-size: 11px; font-weight: 600; color: var(--green); text-transform: uppercase; letter-spacing: 0.06em; }
  .response-badge__value { font-size: 12px; color: var(--text-2); margin-top: 1px; }

  /* ── Form Panel ── */
  .form-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
  }
  .form-panel__header { margin-bottom: 28px; }
  .form-panel__title { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 5px; }
  .form-panel__sub { font-size: 13px; color: var(--text-3); }

  /* ── Form Fields ── */
  .c-form { display: flex; flex-direction: column; gap: 16px; }
  .c-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 540px) { .c-form__row { grid-template-columns: 1fr; } }

  .c-field { display: flex; flex-direction: column; gap: 6px; position: relative; }
  .c-field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    display: flex;
    align-items: center;
    gap: 3px;
    transition: color var(--t);
  }
  .c-field--focused .c-field__label { color: var(--accent-light); }
  .c-field__req { color: #f43f5e; font-size: 11px; }
  .c-field__input {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 13px;
    font-size: 14px;
    font-family: var(--font);
    color: var(--text);
    outline: none;
    transition: border-color var(--t), background var(--t), box-shadow var(--t);
    -webkit-appearance: none;
    resize: none;
  }
  .c-field__input::placeholder { color: var(--text-3); }
  .c-field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
  }
  .c-field__textarea { min-height: 120px; }
  .c-field__count {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-size: 10px;
    color: var(--text-3);
    pointer-events: none;
  }

  /* ── Send Button ── */
  .btn-send {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    padding: 13px 24px;
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    transition: all var(--t);
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    margin-top: 4px;
  }
  .btn-send:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }
  .btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-send--loading { pointer-events: none; }
  .spin { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .form-footnote { font-size: 11px; color: var(--text-3); text-align: center; line-height: 1.5; }

  /* ── Success State ── */
  .form-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 48px 24px;
    gap: 12px;
  }
  .form-success__icon {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    margin-bottom: 8px;
    animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes scaleIn { from{transform:scale(0)} to{transform:scale(1)} }
  .form-success__title { font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .form-success__body { font-size: 14px; color: var(--text-2); line-height: 1.6; max-width: 320px; }
  .btn-ghost-sm {
    margin-top: 8px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    font-family: var(--font);
    transition: all var(--t);
  }
  .btn-ghost-sm:hover { border-color: rgba(255,255,255,0.12); color: var(--text); }
`;

export default Contacts;
