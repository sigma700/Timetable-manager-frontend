import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {Navigation} from "./components/navigation";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
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
  accentL: "#5C5C5C",
  green: "#16A34A",
};

// ─── Data (unchanged) ─────────────────────────────────────────────────────────
const sections = [
  {
    id: "introduction",
    num: "01",
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

// ─── Simple SVG icons (replaces Tabler icon font dependency) ──────────────────
const Icons = {
  shieldCheck: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  certificate: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  mail: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  headset: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  arrowRight: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  arrowLeft: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  ),
  calendar: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

// ─── Section icon map ─────────────────────────────────────────────────────────
const sectionIcons = {
  introduction: Icons.shieldCheck,
  registration: (
    <svg
      width="15"
      height="15"
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
  "acceptable-use": (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  privacy: Icons.lock,
  ip: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  liability: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  changes: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  "governing-law": (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  updates: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  contact: Icons.mail,
};

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
      </Helmet>

      <div style={{background: C.bg, minHeight: "100vh"}}>
        <Navigation
          userName="Guest"
          institutionName="Protiba"
          notificationCount={0}
          onLogout={() => {}}
        />

        {/* Header */}
        <header
          style={{
            padding: "120px 32px 56px",
            borderBottom: `1px solid ${C.border}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: C.text3,
                textDecoration: "none",
                marginBottom: 28,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.text3)}
            >
              <span style={{display: "flex"}}>{Icons.arrowLeft}</span>
              Back to home
            </Link>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: C.text,
                background: C.bg2,
                border: `1px solid ${C.border2}`,
                padding: "5px 14px",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: C.text,
                  display: "inline-block",
                }}
              />
              Legal
            </div>

            <h1
              style={{
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Terms &amp; Conditions
            </h1>
            <p
              style={{
                fontSize: 16,
                color: C.text2,
                lineHeight: 1.75,
                maxWidth: 520,
                marginBottom: 28,
              }}
            >
              These terms govern your use of the Protiba academic scheduling
              platform. Please read them carefully before using the service.
            </p>
            <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
              {[
                {
                  icon: Icons.shieldCheck,
                  label: `Last updated: ${new Date().toLocaleDateString("en-GB", {day: "numeric", month: "long", year: "numeric"})}`,
                },
                {icon: Icons.lock, label: "GDPR compliant"},
                {icon: Icons.certificate, label: "SSL encrypted"},
              ].map((badge) => (
                <span
                  key={badge.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 12,
                    fontWeight: 500,
                    color: C.text3,
                    background: C.bg1,
                    border: `1px solid ${C.border}`,
                    padding: "5px 12px",
                    borderRadius: 20,
                  }}
                >
                  <span style={{display: "flex", color: C.text}}>
                    {badge.icon}
                  </span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Body */}
        <div style={{padding: "0 32px", position: "relative", zIndex: 1}}>
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 56,
              paddingTop: 52,
              paddingBottom: 80,
              alignItems: "start",
            }}
          >
            {/* TOC sidebar */}
            <aside
              style={{display: window.innerWidth < 860 ? "none" : "block"}}
            >
              <div style={{position: "sticky", top: 76}}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: C.text3,
                    marginBottom: 10,
                    paddingLeft: 10,
                  }}
                >
                  On this page
                </p>
                <nav
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    marginBottom: 20,
                  }}
                >
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        background: active === s.id ? C.bg2 : "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "7px 10px",
                        borderRadius: 8,
                        textAlign: "left",
                        width: "100%",
                        fontFamily: "'Inter', -apple-system, sans-serif",
                        transition: "background 0.15s",
                        color: active === s.id ? C.text : C.text3,
                      }}
                      onMouseEnter={(e) => {
                        if (active !== s.id)
                          e.currentTarget.style.background = C.bg2;
                      }}
                      onMouseLeave={(e) => {
                        if (active !== s.id)
                          e.currentTarget.style.background = "none";
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          minWidth: 18,
                          letterSpacing: "0.05em",
                          color: active === s.id ? C.text : C.text3,
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: 1.3,
                          color: active === s.id ? C.text : C.text3,
                        }}
                      >
                        {s.title}
                      </span>
                    </button>
                  ))}
                </nav>
                <div style={{paddingLeft: 10}}>
                  <Link
                    to="/signup"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      textDecoration: "none",
                      background: C.accent,
                      border: `1px solid ${C.accent}`,
                      padding: "8px 14px",
                      borderRadius: 8,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.accent2;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.accent;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Create account
                    <span style={{display: "flex"}}>{Icons.arrowRight}</span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content */}
            <main style={{minWidth: 0}}>
              {sections.map((sec, idx) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  style={{
                    padding: "36px 0",
                    borderBottom: `1px solid ${C.border}`,
                    scrollMarginTop: 84,
                    paddingTop: idx === 0 ? 0 : 36,
                    borderBottomWidth: idx === sections.length - 1 ? 0 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        borderRadius: 9,
                        background: C.bg2,
                        border: `1px solid ${C.border2}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: C.text,
                        marginTop: 2,
                      }}
                    >
                      {sectionIcons[sec.id] || Icons.shieldCheck}
                    </div>
                    <div
                      style={{display: "flex", alignItems: "baseline", gap: 9}}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.text3,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {sec.num}
                      </span>
                      <h2
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: C.text,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {sec.title}
                      </h2>
                    </div>
                  </div>
                  <div style={{paddingLeft: 46}}>
                    {sec.body.map((block, bi) => {
                      if (block.type === "p")
                        return (
                          <p
                            key={bi}
                            style={{
                              fontSize: 14,
                              color: C.text2,
                              lineHeight: 1.8,
                              marginBottom: 12,
                            }}
                          >
                            {block.content}
                          </p>
                        );
                      if (block.type === "list")
                        return (
                          <ul
                            key={bi}
                            style={{
                              listStyle: "none",
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            {block.items.map((item, ii) => (
                              <li
                                key={ii}
                                style={{
                                  display: "flex",
                                  gap: 11,
                                  alignItems: "flex-start",
                                  fontSize: 14,
                                  color: C.text2,
                                  lineHeight: 1.7,
                                }}
                              >
                                <span
                                  style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: C.text,
                                    flexShrink: 0,
                                    marginTop: 9,
                                    opacity: 0.5,
                                  }}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      if (block.type === "contact")
                        return (
                          <div
                            key={bi}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                              marginTop: 6,
                            }}
                          >
                            {[
                              {
                                icon: Icons.mail,
                                label: "Legal enquiries",
                                link: block.email,
                              },
                              {
                                icon: Icons.headset,
                                label: "General support",
                                link: block.support,
                              },
                            ].map((row, ri) => (
                              <div
                                key={ri}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 11,
                                  background: C.bg1,
                                  border: `1px solid ${C.border}`,
                                  borderRadius: 10,
                                  padding: "11px 14px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    color: C.text,
                                    flexShrink: 0,
                                  }}
                                >
                                  {row.icon}
                                </span>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: C.text3,
                                    minWidth: 110,
                                  }}
                                >
                                  {row.label}
                                </span>
                                <a
                                  href={`mailto:${row.link}`}
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: C.text,
                                    textDecoration: "none",
                                    transition: "color 0.15s",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = C.accentL)
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = C.text)
                                  }
                                >
                                  {row.link}
                                </a>
                              </div>
                            ))}
                          </div>
                        );
                      return null;
                    })}
                  </div>
                </section>
              ))}

              {/* Acceptance */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  background: C.bg2,
                  border: `1px solid ${C.border2}`,
                  borderRadius: 14,
                  padding: "22px 26px",
                  marginTop: 44,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    borderRadius: 9,
                    background: C.bg1,
                    border: `1px solid ${C.border2}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.text,
                    marginTop: 1,
                  }}
                >
                  {Icons.shieldCheck}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.text,
                      marginBottom: 5,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Acceptance of Terms
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: C.text2,
                      lineHeight: 1.7,
                    }}
                  >
                    By creating an account or using Protiba, you acknowledge
                    that you have read, understood, and agree to be bound by
                    these Terms and Conditions and our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* CTA row */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 28,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/signup"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: C.accent,
                    textDecoration: "none",
                    padding: "11px 20px",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(43,43,43,0.2)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.accent2;
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(43,43,43,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.accent;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(43,43,43,0.2)";
                  }}
                >
                  Create your free account
                  <span style={{display: "flex"}}>{Icons.arrowRight}</span>
                </Link>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.text2,
                    background: C.bg1,
                    border: `1px solid ${C.border2}`,
                    textDecoration: "none",
                    padding: "11px 20px",
                    borderRadius: 10,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = C.bg2;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.text2;
                    e.currentTarget.style.background = C.bg1;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Sign in
                </Link>
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <p style={{fontSize: 12, color: C.text3, margin: 0}}>
              © {new Date().getFullYear()} Protiba. All rights reserved.
            </p>
            <div style={{display: "flex", gap: 18}}>
              <Link
                to="/login"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.text3,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.text3)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.text3,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.text3)}
              >
                Sign up
              </Link>
              <a
                href="mailto:support@protiba.app"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.text3,
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.text3)}
              >
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @media (max-width: 860px) {
    .terms-toc { display: none !important; }
  }

  @media (max-width: 600px) {
    .terms-section-body { padding-left: 0 !important; }
  }
`;

export default Terms;
