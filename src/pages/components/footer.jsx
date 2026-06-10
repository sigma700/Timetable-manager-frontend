import React, {useState} from "react";
import {Link} from "react-router-dom";

// ─── Social icon wrapper ──────────────────────────────────────────────────────
function SocialLink({href, label, children, external = true}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered
          ? "rgba(251,191,36,0.12)"
          : "rgba(255,255,255,0.04)",
        border: `0.5px solid ${hovered ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}`,
        color: hovered ? "#fbbf24" : "#64748b",
        transition: "all 0.18s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

// ─── Footer nav link ──────────────────────────────────────────────────────────
function FooterLink({to, children}) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={to}
        style={{
          fontSize: 13,
          color: hovered ? "#e2e8f0" : "#64748b",
          textDecoration: "none",
          transition: "color 0.15s",
          display: "flex",
          alignItems: "center",
          gap: 6,
          lineHeight: 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <span style={{fontSize: 10, color: "#f59e0b", marginLeft: -2}}>
            ›
          </span>
        )}
        {children}
      </Link>
    </li>
  );
}

// ─── Bottom bar link ──────────────────────────────────────────────────────────
function LegalLink({to, children}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        fontSize: 12,
        color: hovered ? "#94a3b8" : "#475569",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0d1420 0%, #080d16 100%)",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 200,
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "56px 24px 0",
          position: "relative",
        }}
      >
        {/* ── Main grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "40px 48px",
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div style={{gridColumn: "span 2", minWidth: 0}}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {/* Logo mark */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  flexShrink: 0,
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: "-0.3px",
                  background: "linear-gradient(120deg, #fbbf24, #d97706)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Protiba
              </span>
            </Link>

            <p
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.75,
                maxWidth: 320,
                marginBottom: 24,
              }}
            >
              Intelligent scheduling for educational institutions. Eliminate
              conflicts and build optimized timetables in minutes, not days.
            </p>

            {/* Status pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(16,185,129,0.08)",
                border: "0.5px solid rgba(16,185,129,0.2)",
                borderRadius: 20,
                padding: "5px 12px",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#10b981",
                  fontWeight: 500,
                  letterSpacing: "0.2px",
                }}
              >
                All systems operational
              </span>
            </div>

            {/* Social links */}
            <div style={{display: "flex", gap: 8}}>
              <SocialLink href="#" label="Twitter / X">
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://github.com/sigma700" label="GitHub">
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/in/allan-kirimi-31ba92323/"
                label="LinkedIn"
              >
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: 18,
              }}
            >
              Product
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 13,
              }}
            >
              <FooterLink to="/home/demo">Demo</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/home/manual">Documentation</FooterLink>
              <FooterLink to="/home/story">Our story</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: 18,
              }}
            >
              Contact
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <li>
                <a
                  href="mailto:allankirimi65@gmail.com"
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 9,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e2e8f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#64748b")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    style={{flexShrink: 0, marginTop: 1}}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  allankirimi65@gmail.com
                </a>
              </li>
              <li>
                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 9,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    style={{flexShrink: 0, marginTop: 1}}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Nyeri, Kenya
                </div>
              </li>
            </ul>

            {/* CTA */}
            <div style={{marginTop: 28}}>
              <Link
                to="/home/demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 16px",
                  background: "rgba(245,158,11,0.1)",
                  border: "0.5px solid rgba(245,158,11,0.3)",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#fbbf24",
                  textDecoration: "none",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245,158,11,0.16)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(245,158,11,0.1)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Try a free demo →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.05)",
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
            marginBottom: 0,
          }}
        >
          {[
            "Conflict-free scheduling",
            "Multi-institution support",
            "Automated generation",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "#334155",
              }}
            >
              <span style={{color: "#10b981", fontSize: 12}}>✓</span>
              {item}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.04)",
            padding: "18px 0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{fontSize: 12, color: "#334155", margin: 0}}>
            © {year} Protiba. All rights reserved.
          </p>
          <div style={{display: "flex", alignItems: "center", gap: 20}}>
            <LegalLink to="/privacy">Privacy policy</LegalLink>
            <LegalLink to="/terms">Terms of service</LegalLink>
            <LegalLink to="/cookies">Cookies</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
