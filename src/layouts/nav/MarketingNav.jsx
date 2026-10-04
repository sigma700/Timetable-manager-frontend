import React, {useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Link, NavLink, useLocation} from "react-router-dom";
import {BookOpen, House, Mail, PanelLeft, Sparkles, Workflow, X} from "lucide-react";
import protibaLogo from "/new-protiba-logo.png";
import { useAuthStore } from "../../store/authStore";
import { deriveStage, homeForStage, STAGE } from "../../routes/stage";
import {APP_NAV_CSS, NAV_CSS} from "./navStyles";

// Only pages that really exist. "Pricing" is deliberately absent until real
// plans exist — a nav item that leads nowhere is worse than no item.
const LINKS = [
  {to: "/", label: "Home", end: true, icon: House},
  {to: "/#how-it-works", label: "How It Works", hash: true, icon: Workflow},
  {to: "/#features", label: "Features", hash: true, icon: Sparkles},
  {to: "/our-story", label: "Our Story", icon: BookOpen},
  {to: "/resources", label: "Resources", icon: BookOpen},
  {to: "/contact", label: "Contact", icon: Mail},
];
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const MOBILE_QUERY = "(max-width: 900px)";
const ICON_PROPS = {size: 17, strokeWidth: 1.75, "aria-hidden": "true"};

/**
 * Public site navigation. The call-to-action reflects the visitor's real
 * state: signed-out visitors are invited to set up a school; anyone already
 * signed in is taken to wherever they left off (verify, onboarding or app).
 *
 * Styling comes from the shared NAV_CSS only. The app drawer styles
 * (APP_NAV_CSS) are intentionally not loaded here.
 */
export default function MarketingNav({ minimal = false }) {
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const sheetRef = useRef(null);
  const wasDrawerOpen = useRef(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const stage = deriveStage({ isAuthenticated, user });
  const signedIn = stage !== STAGE.SIGNED_OUT;

  const closeDrawer = useCallback(() => setDrawer(false), []);

  // Close the drawer whenever the route or hash changes.
  useEffect(() => {
    setDrawer(false);
  }, [location.pathname, location.hash]);

  // Match the authenticated navigation drawer's scroll and keyboard behavior.
  useEffect(() => {
    if (!drawer) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key !== "Tab" || !sheetRef.current) return;
      const nodes = [...sheetRef.current.querySelectorAll(FOCUSABLE)].filter(
        (node) =>
          node.getClientRects().length > 0 &&
          getComputedStyle(node).visibility !== "hidden",
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
    };
  }, [drawer, closeDrawer]);

  useEffect(() => {
    if (drawer) {
      wasDrawerOpen.current = true;
      return;
    }
    if (wasDrawerOpen.current) {
      wasDrawerOpen.current = false;
      triggerRef.current?.focus({preventScroll: true});
    }
  }, [drawer]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => {
      if (!event.matches) closeDrawer();
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [closeDrawer]);

  const cta = signedIn
    ? {
        to: homeForStage(stage),
        label: stage === STAGE.READY ? "Open Protiba" : "Continue Setup",
      }
    : { to: "/signup", label: "Set Up Your School" };

  const navLinkClass = ({ isActive }) =>
    `pn__link${isActive ? " pn__link--active" : ""}`;

  const drawerEl = (
    <div className="pn-d" data-open={drawer ? "true" : "false"}>
      <div
        className="pn-d__backdrop"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        id="pn-drawer"
        ref={sheetRef}
        className="pn-d__sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="pn-d__head">
          <h2 className="pn-d__title">
            <span className="pn-d__mark" aria-hidden="true">
              <PanelLeft size={15} strokeWidth={1.75} />
            </span>
            Menu
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="pn-d__close"
            aria-label="Close navigation"
            onClick={closeDrawer}
          >
            <span className="pn-d__close-ui">
              <X size={16} strokeWidth={1.9} />
            </span>
          </button>
        </div>

        <div className="pn-d__body">
          <Link
            to={cta.to}
            className="pn-d__create"
            onClick={closeDrawer}
          >
            {cta.label}
          </Link>
          {!minimal && (
            <nav className="pn-d__nav" aria-label="Protiba">
              <div className="pn-d__section">
                <h3 className="pn-d__section-label">Explore Protiba</h3>
                <ul className="pn-d__list">
                  {LINKS.map((item) => {
                    const active =
                      !item.hash &&
                      location.pathname === item.to &&
                      (item.end ? location.pathname === "/" : true);
                    return (
                      <li key={item.to}>
                        {item.hash ? (
                          <Link
                            to={item.to}
                            onClick={closeDrawer}
                            className="pn-d__row"
                          >
                            {React.createElement(item.icon, {
                              ...ICON_PROPS,
                              className: "pn-d__icon",
                            })}
                            <span className="pn-d__label">{item.label}</span>
                          </Link>
                        ) : (
                          <NavLink
                            to={item.to}
                            end={item.end}
                            onClick={closeDrawer}
                            aria-current={active ? "page" : undefined}
                            className={`pn-d__row${active ? " pn-d__row--active" : ""}`}
                          >
                            {React.createElement(item.icon, {
                              ...ICON_PROPS,
                              className: "pn-d__icon",
                            })}
                            <span className="pn-d__label">{item.label}</span>
                          </NavLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          )}
        </div>

        {!signedIn && (
          <div className="pn-d__foot pn-d__foot--marketing">
            <span className="pn-d__signin-prompt">Already have an account?</span>
            <Link
              to="/login"
              className="pn-d__signout"
              onClick={closeDrawer}
            >
              Sign In
            </Link>
          </div>
        )}
      </aside>
    </div>
  );

  return (
    <header className="pn">
      <style>{NAV_CSS}{APP_NAV_CSS}</style>
      <nav className="pn__inner" aria-label="Main">
        <Link to="/" className="pn__logo" aria-label="Protiba home">
          <img src={protibaLogo} alt="Protiba" />
        </Link>

        {!minimal && (
          <div className="pn__links">
            {LINKS.map((l) =>
              l.hash ? (
                <Link key={l.to} to={l.to} className="pn__link">
                  {l.label}
                </Link>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={navLinkClass}
                >
                  {l.label}
                </NavLink>
              ),
            )}
          </div>
        )}

        <div className="pn__actions">
          {!signedIn && (
            <Link to="/login" className="pn__btn pn__btn--ghost">
              Sign In
            </Link>
          )}
          <Link to={cta.to} className="pn__btn pn__btn--primary">
            {cta.label}
          </Link>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="pn__trigger"
          aria-haspopup="dialog"
          aria-expanded={drawer}
          aria-controls="pn-drawer"
          aria-label={drawer ? "Close menu" : "Open menu"}
          onClick={() => setDrawer(true)}
        >
          <PanelLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span className="pn__trigger-label">Menu</span>
        </button>
      </nav>

      {typeof document !== "undefined" &&
        createPortal(drawerEl, document.body)}
    </header>
  );
}