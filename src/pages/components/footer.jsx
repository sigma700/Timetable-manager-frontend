import React, {useState, useRef} from "react";
import {Link} from "react-router-dom";

// ── Brand tokens (unchanged) ─────────────────────────────────────────────────
const C = {
  bg: "#F8F8F8",
  bg1: "#F5F5F5",
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
  green: "#16A34A",
  blue: "#2563EB",
  purple: "#7C3AED",
  teal: "#0D9488",
};

// ── Dot for column headings ──────────────────────────────────────────────────
const ColumnDot = ({color}) => (
  <span
    style={{
      display: "inline-block",
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: color,
      marginRight: 6,
      verticalAlign: "middle",
      opacity: 0.5,
    }}
  />
);

// ── Newsletter form (simulated subscribe – replace with Resend later) ─────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const timeoutRef = useRef(null);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // TODO: Replace with real Resend API call when ready
  const fakeSubscribe = (value) =>
    new Promise((resolve, reject) => {
      timeoutRef.current = setTimeout(() => {
        if (value.toLowerCase() === "taken@example.com") {
          reject(new Error("That email is already subscribed."));
        } else {
          resolve();
        }
      }, 1400);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Please enter an email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      await fakeSubscribe(email);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to subscribe. Please try again.");
    }
  };

  const isSuccess = status === "success";
  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: "flex",
        gap: 8,
        width: "100%",
        maxWidth: 360,
        position: "relative",
      }}
    >
      <div style={{position: "relative", flex: 1}}>
        <input
          type="email"
          value={isSuccess ? "" : email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          disabled={isLoading || isSuccess}
          placeholder={isSuccess ? "Subscribed ✓" : "you@school.edu"}
          aria-label="Email address"
          aria-invalid={isError}
          aria-describedby={isError ? "newsletter-error" : undefined}
          style={{
            width: "100%",
            height: 42,
            padding: "0 14px",
            fontSize: 14,
            color: isSuccess ? C.green : C.text,
            fontWeight: isSuccess ? 600 : 400,
            background: isSuccess
              ? "rgba(22,163,74,0.06)"
              : "rgba(255,255,255,0.9)",
            border: `1px solid ${isError ? "rgba(220,38,38,0.4)" : C.border2}`,
            borderRadius: 10,
            outline: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            transition: "border-color 0.15s, background 0.15s",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isSuccess}
        style={{
          height: 42,
          padding: "0 18px",
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: isLoading || isSuccess ? "default" : "pointer",
          whiteSpace: "nowrap",
          background: isSuccess ? C.green : C.accent,
          opacity: isLoading ? 0.85 : 1,
          boxShadow: isSuccess
            ? `0 2px 8px rgba(22,163,74,0.25)`
            : `0 2px 8px rgba(43,43,43,0.2)`,
          transition: "transform 0.12s, box-shadow 0.12s",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          if (isLoading || isSuccess) return;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 4px 12px rgba(43,43,43,0.25)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 2px 8px rgba(43,43,43,0.2)`;
        }}
      >
        {isLoading ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
            Joining…
          </>
        ) : isSuccess ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Subscribed
          </>
        ) : (
          "Subscribe"
        )}
      </button>

      {isError && (
        <p
          id="newsletter-error"
          role="alert"
          style={{
            position: "absolute",
            bottom: -22,
            left: 0,
            fontSize: 12,
            color: "#DC2626",
            margin: 0,
          }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}

// ── Social link (restrained) ──────────────────────────────────────────────────
function SocialLink({href, label, children, external = true, color}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered ? `${color}14` : "transparent",
        color: hovered ? color : C.text3,
        transition: "background 0.15s, color 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

// ── Footer link (simple, clean) ───────────────────────────────────────────────
function FooterLink({to, children}) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={to}
        style={{
          fontSize: 13,
          color: hovered ? C.text : C.text2,
          textDecoration: "none",
          transition: "color 0.15s",
          display: "block",
          lineHeight: 1.6,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    </li>
  );
}

// ── Trust badge (subtle) ──────────────────────────────────────────────────────
function TrustBadge({icon, label}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        background: C.bg2,
        border: `1px solid ${C.border}`,
        color: C.text3,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span style={{display: "flex", color: C.text2}}>{icon}</span>
      {label}
    </div>
  );
}

// ── Simple SVG trust icons ───────────────────────────────────────────────────
const trustIcons = {
  enterprise: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"
      />
    </svg>
  ),
  ai: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4l2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1m11.4-11.4l2.1-2.1"
      />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  ),
  secure: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l8 3.5v5.3c0 5-3.4 8.9-8 10.2-4.6-1.3-8-5.2-8-10.2V5.5L12 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  ),
  uptime: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.2 2" />
    </svg>
  ),
  privacy: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10.5V7a4 4 0 018 0v3.5"
      />
    </svg>
  ),
};

// ── Main Footer ────────────────────────────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "rgba(248,248,248,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.border}`,
        marginTop: "auto",
        padding: "80px 24px 32px",
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div style={{maxWidth: 960, margin: "0 auto"}}>
        {/* ── Newsletter ── */}
        <div
          style={{
            padding: "40px 36px",
            borderRadius: 16,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)",
            border: `1px solid ${C.border2}`,
            marginBottom: 48,
            boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.green,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: C.text3,
              }}
            >
              Newsletter
            </span>
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.4px",
              color: C.text,
              margin: "0 0 8px",
            }}
          >
            Stay informed
          </h2>
          <p
            style={{
              fontSize: 14,
              color: C.text2,
              lineHeight: 1.7,
              marginBottom: 20,
              maxWidth: 400,
            }}
          >
            Product updates, tips, and insights for school administrators , a
            few emails a month, no spam.
          </p>
          <NewsletterForm />
        </div>

        {/* ── Link columns (only pages that exist in navigation) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "48px 40px",
            marginBottom: 48,
          }}
        >
          {/* Product */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 16,
              }}
            >
              <ColumnDot color={C.green} />
              Product
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <FooterLink to="/home/demo">Demo</FooterLink>
              <FooterLink to="/home/pricing">Pricing</FooterLink>
              <FooterLink to="/home/manual">Documentation</FooterLink>
              <FooterLink to="/home/story">Our story</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 16,
              }}
            >
              <ColumnDot color={C.blue} />
              Contact
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <li>
                <a
                  href="mailto:allankirimi65@gmail.com"
                  style={{
                    fontSize: 13,
                    color: C.text2,
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.text2)}
                >
                  allankirimi65@gmail.com
                </a>
              </li>
              <li style={{fontSize: 13, color: C.text2}}>Nyeri, Kenya</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.text,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 16,
              }}
            >
              <ColumnDot color={C.purple} />
              Legal
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/cookies">Cookies</FooterLink>
            </ul>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "24px 0",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <TrustBadge icon={trustIcons.enterprise} label="Enterprise ready" />
          <TrustBadge icon={trustIcons.ai} label="AI powered" />
          <TrustBadge icon={trustIcons.secure} label="Secure by design" />
          <TrustBadge icon={trustIcons.uptime} label="99.9% uptime" />
          <TrustBadge icon={trustIcons.privacy} label="Privacy first" />
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            padding: "20px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{fontSize: 12, color: C.text3, margin: 0}}>
            © {year} Protiba. All rights reserved.
          </p>
          <div style={{display: "flex", gap: 20}}>
            <Link
              to="/privacy"
              style={{fontSize: 12, color: C.text3, textDecoration: "none"}}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              style={{fontSize: 12, color: C.text3, textDecoration: "none"}}
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              style={{fontSize: 12, color: C.text3, textDecoration: "none"}}
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
