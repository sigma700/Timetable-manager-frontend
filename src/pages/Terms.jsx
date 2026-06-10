import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";

// ─── Data ─────────────────────────────────────────────────────────────────────

const sections = [
  {
    id: "introduction",
    num: "01",
    icon: "ti-info-circle",
    title: "Introduction",
    body: [
      {
        type: "p",
        content:
          "Welcome to Protiba. These Terms and Conditions govern your use of our academic scheduling platform and all related services. By accessing or using Protiba, you agree to be bound by these terms in their entirety.",
      },
      {
        type: "p",
        content:
          "Protiba is designed exclusively for educational institutions — schools, colleges, universities, and training organisations. Use of this platform outside that context may result in account termination.",
      },
    ],
  },
  {
    id: "registration",
    num: "02",
    icon: "ti-user-circle",
    title: "Account Registration",
    body: [
      {
        type: "list",
        items: [
          "You must provide accurate, complete, and current information during registration.",
          "You are solely responsible for maintaining the confidentiality of your login credentials.",
          "You must be at least 13 years of age to use our services. Institution administrators must be 18 or older.",
          "Each account is licensed to a single institution. Multi-campus deployments require an enterprise plan.",
          "We reserve the right to suspend or permanently terminate accounts that violate these terms.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    num: "03",
    icon: "ti-ban",
    title: "Acceptable Use",
    body: [
      {
        type: "p",
        content:
          "You agree not to engage in any of the following prohibited activities:",
      },
      {
        type: "list",
        items: [
          "Use the platform for any illegal, fraudulent, or unauthorised purpose.",
          "Attempt to reverse-engineer, decompile, or modify any part of the Protiba service.",
          "Transmit malware, viruses, or any malicious code.",
          "Attempt to gain unauthorised access to any account, system, or network.",
          "Use the service in a manner that infringes upon the intellectual property rights of others.",
          "Resell, sublicense, or commercially exploit any part of the platform without written authorisation.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    num: "04",
    icon: "ti-lock",
    title: "Data Privacy & Security",
    body: [
      {
        type: "p",
        content:
          "We take data protection seriously. All institutional data — including timetables, teacher records, room assignments, and student group configurations — is stored with AES-256 encryption at rest and TLS 1.3 in transit.",
      },
      {
        type: "p",
        content:
          "We are GDPR-compliant and do not sell, rent, or share your data with third parties for advertising purposes. Data is processed solely to provide and improve the Protiba service. For full details, refer to our Privacy Policy.",
      },
    ],
  },
  {
    id: "ip",
    num: "05",
    icon: "ti-shield",
    title: "Intellectual Property",
    body: [
      {
        type: "p",
        content:
          "The Protiba platform — including its scheduling engine, user interface, branding, and all underlying code — is protected by intellectual property laws and remains the exclusive property of Protiba.",
      },
      {
        type: "p",
        content:
          "You retain full ownership of all institutional data you input into the platform. By using Protiba, you grant us a limited, non-exclusive licence to store, process, and display that data solely for the purpose of providing the service.",
      },
    ],
  },
  {
    id: "liability",
    num: "06",
    icon: "ti-scale",
    title: "Limitation of Liability",
    body: [
      {
        type: "p",
        content:
          'Protiba is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or entirely secure.',
      },
      {
        type: "p",
        content:
          "To the maximum extent permitted by law, Protiba shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of data, scheduling errors, or business interruption — arising from your use of the service.",
      },
    ],
  },
  {
    id: "changes",
    num: "07",
    icon: "ti-refresh",
    title: "Service Changes & Termination",
    body: [
      {
        type: "p",
        content:
          "We reserve the right to modify, suspend, or discontinue any feature or aspect of the Protiba service at any time, with or without notice. Material changes will be communicated via the platform or registered email address.",
      },
      {
        type: "p",
        content:
          "We may terminate or suspend your account immediately, without prior notice, for conduct that we reasonably believe violates these Terms or is harmful to other users, Protiba, or third parties.",
      },
    ],
  },
  {
    id: "governing-law",
    num: "08",
    icon: "ti-building-bank",
    title: "Governing Law",
    body: [
      {
        type: "p",
        content:
          "These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the relevant territory.",
      },
    ],
  },
  {
    id: "updates",
    num: "09",
    icon: "ti-edit",
    title: "Updates to These Terms",
    body: [
      {
        type: "p",
        content:
          "We may revise these Terms from time to time. When we make significant changes, we will notify you through the platform dashboard or via the email address associated with your account. Your continued use of Protiba after changes take effect constitutes your acceptance of the revised terms.",
      },
    ],
  },
  {
    id: "contact",
    num: "10",
    icon: "ti-mail",
    title: "Contact Information",
    body: [
      {
        type: "p",
        content:
          "If you have any questions, concerns, or requests regarding these Terms and Conditions, please reach out to our team:",
      },
      {
        type: "contact",
        email: "legal@protiba.app",
        support: "support@protiba.app",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Terms = () => {
  const [active, setActive] = useState("introduction");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
  };

  return (
    <>
      <style>{css}</style>
      <Helmet>
        <title>Terms & Conditions — Protiba</title>
        <meta
          name="description"
          content="Protiba terms and conditions governing use of the academic scheduling platform."
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </Helmet>

      <div className="tc-root">
        <div className="tc-ambient" aria-hidden="true">
          <div className="tc-ambient__orb" />
          <div className="tc-ambient__grid" />
        </div>

        {/* Nav */}
        <nav className={`tc-nav ${scrolled ? "tc-nav--scrolled" : ""}`}>
          <div className="tc-nav__inner">
            <Link to="/" className="tc-nav__logo">
              <div className="tc-logo-mark">
                <i className="ti ti-calendar-event" aria-hidden="true" />
              </div>
              Protiba
            </Link>
            <div className="tc-nav__links">
              <Link to="/login" className="tc-nav__link">
                Sign in
              </Link>
              <Link to="/signup" className="tc-nav__cta">
                Get started{" "}
                <i className="ti ti-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="tc-header">
          <div className="tc-header__inner">
            <Link to="/" className="tc-back">
              <i className="ti ti-arrow-left" aria-hidden="true" /> Back to home
            </Link>
            <div className="tc-eyebrow">
              <span className="tc-eyebrow__dot" />
              Legal
            </div>
            <h1 className="tc-header__title">Terms &amp; Conditions</h1>
            <p className="tc-header__sub">
              These terms govern your use of the Protiba academic scheduling
              platform. Please read them carefully before using the service.
            </p>
            <div className="tc-header__meta">
              <span className="tc-meta__badge">
                <i className="ti ti-shield-check" aria-hidden="true" />
                Last updated:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="tc-meta__badge">
                <i className="ti ti-lock" aria-hidden="true" /> GDPR compliant
              </span>
              <span className="tc-meta__badge">
                <i className="ti ti-certificate" aria-hidden="true" /> SSL
                encrypted
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="tc-body">
          <div className="tc-body__inner">
            {/* TOC */}
            <aside className="tc-toc">
              <div className="tc-toc__sticky">
                <p className="tc-toc__title">On this page</p>
                <nav className="tc-toc__nav">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      className={`tc-toc__item ${active === s.id ? "tc-toc__item--active" : ""}`}
                      onClick={() => scrollTo(s.id)}
                    >
                      <span className="tc-toc__num">{s.num}</span>
                      <span className="tc-toc__label">{s.title}</span>
                    </button>
                  ))}
                </nav>
                <div className="tc-toc__actions">
                  <Link to="/signup" className="tc-toc__cta">
                    Create account{" "}
                    <i className="ti ti-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <main className="tc-content">
              {sections.map((sec, idx) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="tc-section"
                  style={{animationDelay: `${idx * 0.04}s`}}
                >
                  <div className="tc-section__header">
                    <div className="tc-section__icon">
                      <i className={`ti ${sec.icon}`} aria-hidden="true" />
                    </div>
                    <div className="tc-section__title-wrap">
                      <span className="tc-section__num">{sec.num}</span>
                      <h2 className="tc-section__title">{sec.title}</h2>
                    </div>
                  </div>
                  <div className="tc-section__body">
                    {sec.body.map((block, bi) => {
                      if (block.type === "p")
                        return (
                          <p key={bi} className="tc-section__p">
                            {block.content}
                          </p>
                        );
                      if (block.type === "list")
                        return (
                          <ul key={bi} className="tc-section__list">
                            {block.items.map((item, ii) => (
                              <li key={ii} className="tc-section__li">
                                <span
                                  className="tc-section__li-dot"
                                  aria-hidden="true"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      if (block.type === "contact")
                        return (
                          <div key={bi} className="tc-contact">
                            <div className="tc-contact__row">
                              <i className="ti ti-mail" aria-hidden="true" />
                              <span className="tc-contact__label">
                                Legal enquiries
                              </span>
                              <a
                                href={`mailto:${block.email}`}
                                className="tc-contact__link"
                              >
                                {block.email}
                              </a>
                            </div>
                            <div className="tc-contact__row">
                              <i className="ti ti-headset" aria-hidden="true" />
                              <span className="tc-contact__label">
                                General support
                              </span>
                              <a
                                href={`mailto:${block.support}`}
                                className="tc-contact__link"
                              >
                                {block.support}
                              </a>
                            </div>
                          </div>
                        );
                      return null;
                    })}
                  </div>
                </section>
              ))}

              <div className="tc-acceptance">
                <div className="tc-acceptance__icon">
                  <i className="ti ti-shield-check" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="tc-acceptance__title">Acceptance of Terms</h3>
                  <p className="tc-acceptance__body">
                    By creating an account or using Protiba, you acknowledge
                    that you have read, understood, and agree to be bound by
                    these Terms and Conditions and our Privacy Policy.
                  </p>
                </div>
              </div>

              <div className="tc-cta-row">
                <Link to="/signup" className="tc-btn-primary">
                  Create your free account{" "}
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                </Link>
                <Link to="/login" className="tc-btn-ghost">
                  Sign in
                </Link>
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="tc-footer">
          <div className="tc-footer__inner">
            <Link
              to="/"
              className="tc-nav__logo"
              style={{textDecoration: "none"}}
            >
              <div className="tc-logo-mark">
                <i className="ti ti-calendar-event" aria-hidden="true" />
              </div>
              <span
                style={{color: "var(--tc-text)", fontWeight: 700, fontSize: 15}}
              >
                Protiba
              </span>
            </Link>
            <p className="tc-footer__note">
              © {new Date().getFullYear()} Protiba. All rights reserved.
              Academic scheduling, automated.
            </p>
            <div className="tc-footer__links">
              <Link to="/login" className="tc-footer__link">
                Sign in
              </Link>
              <Link to="/signup" className="tc-footer__link">
                Sign up
              </Link>
              <a href="mailto:support@protiba.app" className="tc-footer__link">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --tc-bg: #08080b;
    --tc-s1: #0f0f14;
    --tc-s2: #14141a;
    --tc-s3: #1a1a22;
    --tc-b1: rgba(255,255,255,0.06);
    --tc-b2: rgba(255,255,255,0.1);
    --tc-text: #f0f0f5;
    --tc-text2: #8888a0;
    --tc-text3: #44445a;
    --tc-acc: #5b4cf5;
    --tc-acc2: #4a3de0;
    --tc-accl: #8b82f8;
    --tc-accbg: rgba(91,76,245,0.1);
    --tc-accborder: rgba(91,76,245,0.2);
    --tc-font: 'Inter', -apple-system, sans-serif;
  }

  .tc-root {
    font-family: var(--tc-font);
    background: var(--tc-bg);
    color: var(--tc-text);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    position: relative;
  }

  /* Ambient */
  .tc-ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .tc-ambient__orb {
    position: absolute; top: -200px; left: -150px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(91,76,245,0.08) 0%, transparent 70%);
    filter: blur(80px);
  }
  .tc-ambient__grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 70%);
  }

  /* Nav */
  .tc-nav {
    position: sticky; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 32px;
    border-bottom: 1px solid transparent;
    transition: background 0.2s, border-color 0.2s, backdrop-filter 0.2s;
  }
  .tc-nav--scrolled {
    background: rgba(8,8,11,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom-color: var(--tc-b1);
  }
  .tc-nav__inner {
    max-width: 1080px; margin: 0 auto;
    height: 60px; display: flex; align-items: center; justify-content: space-between;
  }
  .tc-nav__logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none; font-size: 16px; font-weight: 700;
    color: var(--tc-text); letter-spacing: -0.02em;
  }
  .tc-logo-mark {
    width: 28px; height: 28px; border-radius: 8px;
    background: var(--tc-acc); display: flex; align-items: center; justify-content: center;
  }
  .tc-logo-mark i { font-size: 14px; color: #fff; }
  .tc-nav__links { display: flex; align-items: center; gap: 8px; }
  .tc-nav__link {
    font-size: 13px; font-weight: 500; color: var(--tc-text2);
    text-decoration: none; padding: 6px 14px; border-radius: 8px;
    transition: color 0.15s, background 0.15s;
  }
  .tc-nav__link:hover { color: var(--tc-text); background: rgba(255,255,255,0.05); }
  .tc-nav__cta {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 600; color: #fff;
    background: var(--tc-acc); text-decoration: none;
    padding: 7px 16px; border-radius: 8px;
    box-shadow: 0 2px 12px rgba(91,76,245,0.35);
    transition: all 0.15s;
  }
  .tc-nav__cta:hover { background: var(--tc-acc2); box-shadow: 0 4px 20px rgba(91,76,245,0.5); transform: translateY(-1px); }
  .tc-nav__cta i { font-size: 13px; }

  /* Header */
  .tc-header {
    position: relative; z-index: 1;
    padding: 80px 32px 56px;
    border-bottom: 1px solid var(--tc-b1);
    overflow: hidden;
  }
  .tc-header::before {
    content: ''; position: absolute; top: -120px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(91,76,245,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .tc-header__inner {
    max-width: 1080px; margin: 0 auto;
    animation: tc-reveal 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes tc-reveal { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

  .tc-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--tc-text3); text-decoration: none;
    margin-bottom: 28px; transition: color 0.15s;
  }
  .tc-back:hover { color: var(--tc-text2); }
  .tc-back i { font-size: 14px; }

  .tc-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--tc-accl); background: var(--tc-accbg);
    border: 1px solid var(--tc-accborder);
    padding: 5px 14px; border-radius: 20px; margin-bottom: 20px;
  }
  .tc-eyebrow__dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--tc-accl);
    animation: tc-pulse 2s ease-in-out infinite;
  }
  @keyframes tc-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .tc-header__title {
    font-size: clamp(32px, 4.5vw, 52px);
    font-weight: 900; letter-spacing: -0.04em; line-height: 1.05;
    color: var(--tc-text); margin-bottom: 16px;
  }
  .tc-header__sub {
    font-size: 16px; color: var(--tc-text2); line-height: 1.75;
    max-width: 520px; margin-bottom: 28px;
  }
  .tc-header__meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .tc-meta__badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 500; color: var(--tc-text3);
    background: var(--tc-s2); border: 1px solid var(--tc-b1);
    padding: 5px 12px; border-radius: 20px;
  }
  .tc-meta__badge i { font-size: 13px; color: var(--tc-accl); }

  /* Body */
  .tc-body { position: relative; z-index: 1; padding: 0 32px; }
  .tc-body__inner {
    max-width: 1080px; margin: 0 auto;
    display: grid; grid-template-columns: 200px 1fr;
    gap: 56px; padding-top: 52px; padding-bottom: 80px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .tc-body__inner { grid-template-columns: 1fr; }
    .tc-toc { display: none; }
  }

  /* TOC */
  .tc-toc__sticky { position: sticky; top: 76px; }
  .tc-toc__title {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--tc-text3);
    margin-bottom: 10px; padding-left: 10px;
  }
  .tc-toc__nav { display: flex; flex-direction: column; gap: 1px; margin-bottom: 20px; }
  .tc-toc__item {
    display: flex; align-items: center; gap: 9px;
    background: none; border: none; cursor: pointer;
    padding: 7px 10px; border-radius: 8px; text-align: left; width: 100%;
    font-family: var(--tc-font);
    transition: background 0.15s;
  }
  .tc-toc__item:hover { background: rgba(255,255,255,0.04); }
  .tc-toc__item--active { background: var(--tc-accbg); }
  .tc-toc__num {
    font-size: 10px; font-weight: 700; color: var(--tc-text3);
    min-width: 18px; letter-spacing: 0.05em; transition: color 0.15s;
  }
  .tc-toc__item--active .tc-toc__num { color: var(--tc-accl); }
  .tc-toc__label {
    font-size: 12px; font-weight: 500; color: var(--tc-text3);
    transition: color 0.15s; line-height: 1.3;
  }
  .tc-toc__item--active .tc-toc__label { color: var(--tc-accl); }
  .tc-toc__actions { padding-left: 10px; }
  .tc-toc__cta {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 600; color: var(--tc-accl);
    text-decoration: none; background: var(--tc-accbg);
    border: 1px solid var(--tc-accborder);
    padding: 8px 14px; border-radius: 8px; transition: all 0.15s;
  }
  .tc-toc__cta:hover { background: rgba(91,76,245,0.18); }
  .tc-toc__cta i { font-size: 13px; }

  /* Sections */
  .tc-section {
    padding: 36px 0; border-bottom: 1px solid var(--tc-b1);
    scroll-margin-top: 84px;
    opacity: 0;
    animation: tc-reveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .tc-section:first-child { padding-top: 0; }
  .tc-section:last-child { border-bottom: none; }

  .tc-section__header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
  .tc-section__icon {
    width: 32px; height: 32px; flex-shrink: 0; border-radius: 9px;
    background: var(--tc-accbg); border: 1px solid var(--tc-accborder);
    display: flex; align-items: center; justify-content: center;
    color: var(--tc-accl); margin-top: 2px;
  }
  .tc-section__icon i { font-size: 15px; }
  .tc-section__title-wrap { display: flex; align-items: baseline; gap: 9px; }
  .tc-section__num { font-size: 10px; font-weight: 700; color: var(--tc-text3); letter-spacing: 0.06em; }
  .tc-section__title { font-size: 17px; font-weight: 800; color: var(--tc-text); letter-spacing: -0.025em; }
  .tc-section__body { padding-left: 46px; }

  .tc-section__p { font-size: 14px; color: var(--tc-text2); line-height: 1.8; margin-bottom: 12px; }
  .tc-section__p:last-child { margin-bottom: 0; }
  .tc-section__list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .tc-section__li { display: flex; gap: 11px; align-items: flex-start; font-size: 14px; color: var(--tc-text2); line-height: 1.7; }
  .tc-section__li-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--tc-accl); flex-shrink: 0; margin-top: 9px; opacity: 0.6; }

  /* Contact */
  .tc-contact { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
  .tc-contact__row {
    display: flex; align-items: center; gap: 11px;
    background: var(--tc-s2); border: 1px solid var(--tc-b1);
    border-radius: 10px; padding: 11px 14px; flex-wrap: wrap;
  }
  .tc-contact__row i { font-size: 15px; color: var(--tc-accl); flex-shrink: 0; }
  .tc-contact__label { font-size: 12px; font-weight: 500; color: var(--tc-text3); min-width: 110px; }
  .tc-contact__link { font-size: 13px; font-weight: 600; color: var(--tc-accl); text-decoration: none; transition: color 0.15s; }
  .tc-contact__link:hover { color: #a89ff8; }

  /* Acceptance */
  .tc-acceptance {
    display: flex; gap: 14px; align-items: flex-start;
    background: var(--tc-s2); border: 1px solid var(--tc-accborder);
    border-radius: 14px; padding: 22px 26px; margin-top: 44px;
    position: relative; overflow: hidden;
  }
  .tc-acceptance::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(91,76,245,0.05) 0%, transparent 55%);
    pointer-events: none;
  }
  .tc-acceptance__icon {
    width: 34px; height: 34px; flex-shrink: 0; border-radius: 9px;
    background: var(--tc-accbg); border: 1px solid var(--tc-accborder);
    display: flex; align-items: center; justify-content: center;
    color: var(--tc-accl); margin-top: 1px;
  }
  .tc-acceptance__icon i { font-size: 15px; }
  .tc-acceptance__title { font-size: 14px; font-weight: 800; color: var(--tc-text); margin-bottom: 5px; letter-spacing: -0.02em; }
  .tc-acceptance__body { font-size: 13px; color: var(--tc-text2); line-height: 1.7; }

  /* CTA row */
  .tc-cta-row { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; }
  .tc-btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 600; color: #fff;
    background: var(--tc-acc); text-decoration: none;
    padding: 11px 20px; border-radius: 10px;
    box-shadow: 0 3px 14px rgba(91,76,245,0.35); transition: all 0.15s;
  }
  .tc-btn-primary:hover { background: var(--tc-acc2); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(91,76,245,0.48); }
  .tc-btn-primary i { font-size: 13px; }
  .tc-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 500; color: var(--tc-text2);
    background: rgba(255,255,255,0.04); border: 1px solid var(--tc-b2);
    text-decoration: none; padding: 11px 20px; border-radius: 10px;
    transition: all 0.15s;
  }
  .tc-btn-ghost:hover { color: var(--tc-text); background: rgba(255,255,255,0.07); transform: translateY(-1px); }

  /* Footer */
  .tc-footer { position: relative; z-index: 1; border-top: 1px solid var(--tc-b1); padding: 32px; }
  .tc-footer__inner {
    max-width: 1080px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
  }
  .tc-footer__note { font-size: 12px; color: var(--tc-text3); }
  .tc-footer__links { display: flex; gap: 18px; }
  .tc-footer__link { font-size: 12px; font-weight: 500; color: var(--tc-text3); text-decoration: none; transition: color 0.15s; }
  .tc-footer__link:hover { color: var(--tc-text2); }

  @media (max-width: 600px) {
    .tc-section__body { padding-left: 0; }
    .tc-cta-row { flex-direction: column; }
    .tc-footer__inner { flex-direction: column; align-items: flex-start; gap: 10px; }
  }
`;

export default Terms;
