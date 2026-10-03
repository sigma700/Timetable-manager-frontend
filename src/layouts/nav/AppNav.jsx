import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import protibaLogo from "/new-protiba-logo.png";
import {useAuthStore} from "../../store/authStore";
import {NAV_CSS} from "./navStyles";

// Only destinations that exist and are wired to real endpoints.
// "School" (teachers / classes / rooms management) is intentionally not here:
// the backend can create those during setup but has no endpoints to list or
// edit them yet.
const LINKS = [
  {to: "/app", label: "Overview", end: true},
  {to: "/app/timetables", label: "Timetables"},
  {to: "/app/reports", label: "Reports"},
  {to: "/app/invite", label: "Invite Colleagues"},
];

export default function AppNav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => { setOpen(false); setMenu(false); }, [location.pathname]);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    const esc = (e) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [menu]);

  const handleLogout = async () => {
    await logout();
    navigate("/", {replace: true});
  };

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Account";
  const initial = (user?.firstName || "A").charAt(0).toUpperCase();

  return (
    <header className="pn">
      <style>{NAV_CSS}</style>
      <nav className="pn__inner" aria-label="Protiba">
        <Link to="/app" className="pn__logo" aria-label="Protiba overview">
          <img src={protibaLogo} alt="Protiba" />
        </Link>

        <div className="pn__links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({isActive}) => `pn__link${isActive ? " pn__link--active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="pn__actions">
          <Link to="/app/create" className="pn__btn pn__btn--primary">+ Create Timetable</Link>

          <div className="pn__user" ref={menuRef}>
            <button type="button" className="pn__userbtn" aria-haspopup="menu" aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}>
              <span className="pn__avatar" aria-hidden="true">{initial}</span>
              <span className="pn__username">
                {name}
                {user?.institutionName && <span className="pn__school">{user.institutionName}</span>}
              </span>
            </button>
            {menu && (
              <div className="pn__menu" role="menu">
                <Link role="menuitem" to="/app/settings/account" className="pn__menuitem">Account Settings</Link>
                <Link role="menuitem" to="/app/settings/preferences" className="pn__menuitem">Timetable Preferences</Link>
                <Link role="menuitem" to="/resources" className="pn__menuitem">Help &amp; User Guide</Link>
                <div className="pn__menusep" />
                <button role="menuitem" type="button" className="pn__menuitem" onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </div>
        </div>

        <button type="button" className="pn__burger" aria-expanded={open} aria-controls="pn-panel"
          onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div id="pn-panel" className="pn__panel">
          <Link to="/app/create" className="pn__btn pn__btn--primary">+ Create Timetable</Link>
          {LINKS.map((l) => <Link key={l.to} to={l.to} className="pn__link">{l.label}</Link>)}
          <Link to="/app/settings/account" className="pn__link">Account Settings</Link>
          <Link to="/app/settings/preferences" className="pn__link">Timetable Preferences</Link>
          <Link to="/resources" className="pn__link">Help &amp; User Guide</Link>
          <button type="button" className="pn__btn pn__btn--ghost" onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </header>
  );
}
