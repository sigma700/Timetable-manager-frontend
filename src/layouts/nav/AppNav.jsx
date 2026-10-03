// components/AppNav.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Link,
  NavLink,
  matchPath,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  HelpCircle,
  Home,
  LogOut,
  PanelLeft,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import protibaLogo from "/new-protiba-logo.png";
import { useAuthStore } from "../../store/authStore";
import { NAV_CSS, APP_NAV_CSS } from "./navStyles";

/* ─────────────────────────────────────────────────────────────────────────
   Navigation data: the single source of truth for desktop AND mobile.
   ───────────────────────────────────────────────────────────────────────── */

const ICON = { size: 17, strokeWidth: 1.75 };

const CREATE = { to: "/app/create", label: "Create Timetable", icon: Plus };

const PRIMARY = [
  { to: "/app", label: "Overview", icon: Home, end: true },
  { to: "/app/timetables", label: "Timetables", icon: CalendarDays },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/invite", label: "Invite Colleagues", icon: Users },
];

// "Settings" is a real grouping: both children live under /app/settings/.
// Help lives at /resources, so it stays a flat row.
const ACCOUNT = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { to: "/app/settings/account", label: "Account Settings" },
      { to: "/app/settings/preferences", label: "Timetable Preferences" },
    ],
  },
  { to: "/resources", label: "Help & User Guide", icon: HelpCircle },
];

// Desktop dropdown: same destinations, flattened.
const MENU_LINKS = ACCOUNT.flatMap((item) => item.children ?? [item]);

// Used to label the mobile trigger with the current page.
const ALL_ROUTES = [CREATE, ...PRIMARY, ...MENU_LINKS];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const MOBILE_QUERY = "(max-width: 900px)";

const isRouteActive = (pathname, { to, end }) =>
  Boolean(matchPath({ path: to, end: Boolean(end) }, pathname));

/* ─────────────────────────────────────────────────────────────────────────
   Mobile drawer primitives
   ───────────────────────────────────────────────────────────────────────── */

function DrawerLink({ to, label, icon: Icon, end, sub, onNavigate }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          [
            "pn-d__row",
            sub && "pn-d__row--sub",
            isActive && "pn-d__row--active",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        {Icon && <Icon {...ICON} className="pn-d__icon" aria-hidden="true" />}
        <span className="pn-d__label">{label}</span>
      </NavLink>
    </li>
  );
}

function DrawerGroup({ item, open, active, onToggle, onNavigate }) {
  const Icon = item.icon;
  const subId = `pn-sub-${item.id}`;

  return (
    <li
      className="pn-d__group"
      data-open={open ? "true" : "false"}
      data-active={active ? "true" : "false"}
    >
      <button
        type="button"
        className="pn-d__row"
        aria-expanded={open}
        aria-controls={subId}
        onClick={onToggle}
      >
        <Icon {...ICON} className="pn-d__icon" aria-hidden="true" />
        <span className="pn-d__label">{item.label}</span>
        <ChevronDown
          size={15}
          strokeWidth={1.9}
          className="pn-d__chev"
          aria-hidden="true"
        />
      </button>

      <div id={subId} className="pn-d__sub">
        <div className="pn-d__sub-clip">
          <ul className="pn-d__sub-list">
            {item.children.map((child) => (
              <DrawerLink
                key={child.to}
                {...child}
                sub
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   AppNav
   ───────────────────────────────────────────────────────────────────────── */

export default function AppNav() {
  const [drawer, setDrawer] = useState(false); // mobile drawer
  const [menu, setMenu] = useState(false); // desktop user dropdown
  const [groups, setGroups] = useState({ settings: true }); // nested sections

  const menuRef = useRef(null);
  const userBtnRef = useRef(null);
  const triggerRef = useRef(null);
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const wasDrawerOpen = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const closeDrawer = useCallback(() => setDrawer(false), []);

  // Close everything on route change; open the group that owns the new route.
  useEffect(() => {
    setDrawer(false);
    setMenu(false);
    setGroups((g) => {
      const next = { ...g };
      ACCOUNT.forEach((item) => {
        if (
          item.children?.some((c) => isRouteActive(location.pathname, c))
        ) {
          next[item.id] = true;
        }
      });
      return next;
    });
  }, [location.pathname]);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  // If the viewport grows past the mobile breakpoint, drop the drawer.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => {
      if (!e.matches) setDrawer(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Escape closes the drawer or the dropdown.
  useEffect(() => {
    if (!drawer && !menu) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (drawer) {
        setDrawer(false);
      } else if (menu) {
        setMenu(false);
        userBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer, menu]);

  // Click-away for the desktop dropdown.
  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  // Focus: into the drawer on open, back to the trigger on close.
  useEffect(() => {
    if (drawer) {
      wasDrawerOpen.current = true;
      const id = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    if (wasDrawerOpen.current) {
      wasDrawerOpen.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [drawer]);

  // Keep Tab inside the open drawer.
  const trapFocus = (e) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const nodes = [...sheetRef.current.querySelectorAll(FOCUSABLE)].filter(
      (n) =>
        n.getClientRects().length > 0 &&
        getComputedStyle(n).visibility !== "hidden",
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

  const handleLogout = async () => {
    setDrawer(false);
    setMenu(false);
    await logout();
    navigate("/", { replace: true });
  };

  const toggleGroup = (id) =>
    setGroups((g) => ({ ...g, [id]: !g[id] }));

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Account";
  const initial = (user?.firstName || "A").charAt(0).toUpperCase();
  const institution = user?.institutionName;

  const currentRoute = ALL_ROUTES.find((r) =>
    isRouteActive(location.pathname, r),
  );
  const currentLabel = currentRoute?.label ?? "Menu";

  const CreateIcon = CREATE.icon;

  /* ── Mobile drawer (portaled: the header's backdrop-filter would otherwise
        become the containing block for position: fixed) ─────────────────── */
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
        onKeyDown={trapFocus}
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
          <NavLink
            to={CREATE.to}
            onClick={closeDrawer}
            className="pn-d__create"
          >
            <CreateIcon size={16} strokeWidth={2.2} aria-hidden="true" />
            {CREATE.label}
          </NavLink>

          <nav className="pn-d__nav" aria-label="Protiba">
            <div className="pn-d__section">
              <h3 className="pn-d__section-label">Workspace</h3>
              <ul className="pn-d__list">
                {PRIMARY.map((item) => (
                  <DrawerLink key={item.to} {...item} onNavigate={closeDrawer} />
                ))}
              </ul>
            </div>

            <div className="pn-d__section">
              <h3 className="pn-d__section-label">Account</h3>
              <ul className="pn-d__list">
                {ACCOUNT.map((item) =>
                  item.children ? (
                    <DrawerGroup
                      key={item.id}
                      item={item}
                      open={Boolean(groups[item.id])}
                      active={item.children.some((c) =>
                        isRouteActive(location.pathname, c),
                      )}
                      onToggle={() => toggleGroup(item.id)}
                      onNavigate={closeDrawer}
                    />
                  ) : (
                    <DrawerLink
                      key={item.to}
                      {...item}
                      onNavigate={closeDrawer}
                    />
                  ),
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div className="pn-d__foot">
          <div className="pn-d__user">
            <span className="pn-d__avatar" aria-hidden="true">
              {initial}
            </span>
            <div className="pn-d__who">
              <span className="pn-d__name">{name}</span>
              {institution && (
                <span className="pn-d__school">{institution}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="pn-d__signout"
            onClick={handleLogout}
          >
            <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <header className="pn">
      <style>
        {NAV_CSS}
        {APP_NAV_CSS}
      </style>

      <nav className="pn__inner" aria-label="Protiba">
        <Link to="/app" className="pn__logo" aria-label="Protiba overview">
          <img src={protibaLogo} alt="Protiba" />
        </Link>

        {/* Desktop center links */}
        <div className="pn__links">
          {PRIMARY.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `pn__link${isActive ? " pn__link--active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="pn__actions">
          <Link to={CREATE.to} className="pn__btn pn__btn--primary">
            <Plus size={14} strokeWidth={2.4} />
            {CREATE.label}
          </Link>

          <div className="pn__user" ref={menuRef}>
            <button
              ref={userBtnRef}
              type="button"
              className="pn__userbtn"
              aria-haspopup="menu"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              <span className="pn__avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="pn__username">
                <span className="pn__uname">{name}</span>
                {institution && (
                  <span className="pn__school">{institution}</span>
                )}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.9}
                className="pn__chev"
                aria-hidden="true"
              />
            </button>

            {menu && (
              <div className="pn__menu" role="menu">
                {MENU_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    role="menuitem"
                    to={l.to}
                    className="pn__menuitem"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pn__menusep" role="separator" />
                <button
                  role="menuitem"
                  type="button"
                  className="pn__menuitem"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile trigger: shows where you are, opens the drawer */}
        <button
          ref={triggerRef}
          type="button"
          className="pn__trigger"
          aria-haspopup="dialog"
          aria-expanded={drawer}
          aria-controls="pn-drawer"
          aria-label={
            currentRoute
              ? `Open menu. Current page: ${currentLabel}`
              : "Open menu"
          }
          onClick={() => setDrawer(true)}
        >
          <PanelLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          <span className="pn__trigger-label">{currentLabel}</span>
        </button>
      </nav>

      {typeof document !== "undefined" &&
        createPortal(drawerEl, document.body)}
    </header>
  );
}