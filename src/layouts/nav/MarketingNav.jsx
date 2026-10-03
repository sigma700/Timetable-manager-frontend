import React, {useEffect, useState} from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import protibaLogo from "/new-protiba-logo.png";
import {useAuthStore} from "../../store/authStore";
import {deriveStage, homeForStage, STAGE} from "../../routes/stage";
import {NAV_CSS} from "./navStyles";

// Only pages that really exist. "Pricing" is deliberately absent until real
// plans exist — a nav item that leads nowhere is worse than no item.
const LINKS = [
  {to: "/", label: "Home", end: true},
  {to: "/#how-it-works", label: "How It Works", hash: true},
  {to: "/#features", label: "Features", hash: true},
  {to: "/our-story", label: "Our Story"},
  {to: "/resources", label: "Resources"},
  {to: "/contact", label: "Contact"},
];

/**
 * Public site navigation. The call-to-action reflects the visitor's real
 * state: signed-out visitors are invited to set up a school; anyone already
 * signed in is taken to wherever they left off (verify, onboarding or app).
 */
export default function MarketingNav({minimal = false}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const stage = deriveStage({isAuthenticated, user});
  const signedIn = stage !== STAGE.SIGNED_OUT;

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  const cta = signedIn
    ? {to: homeForStage(stage), label: stage === STAGE.READY ? "Open Protiba" : "Continue Setup"}
    : {to: "/signup", label: "Set Up Your School"};

  return (
    <header className="pn">
      <style>{NAV_CSS}</style>
      <nav className="pn__inner" aria-label="Main">
        <Link to="/" className="pn__logo" aria-label="Protiba home">
          <img src={protibaLogo} alt="Protiba" />
        </Link>

        {!minimal && (
          <div className="pn__links">
            {LINKS.map((l) =>
              l.hash ? (
                <Link key={l.to} to={l.to} className="pn__link">{l.label}</Link>
              ) : (
                <NavLink key={l.to} to={l.to} end={l.end}
                  className={({isActive}) => `pn__link${isActive ? " pn__link--active" : ""}`}>
                  {l.label}
                </NavLink>
              ),
            )}
          </div>
        )}

        <div className="pn__actions">
          {!signedIn && <Link to="/login" className="pn__btn pn__btn--ghost">Sign In</Link>}
          <Link to={cta.to} className="pn__btn pn__btn--primary">{cta.label}</Link>
        </div>

        <button type="button" className="pn__burger" aria-expanded={open} aria-controls="pn-panel"
          onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div id="pn-panel" className="pn__panel">
          {!minimal && LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="pn__link">{l.label}</Link>
          ))}
          <Link to={cta.to} className="pn__btn pn__btn--primary">{cta.label}</Link>
          {!signedIn && <Link to="/login" className="pn__btn pn__btn--ghost">Sign In</Link>}
        </div>
      )}
    </header>
  );
}
