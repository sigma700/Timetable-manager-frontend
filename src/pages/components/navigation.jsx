import React, {useState, useEffect, useRef, useCallback} from "react";
import {motion, AnimatePresence, MotionConfig} from "framer-motion";
import {Link, useLocation} from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  BarChart3,
  DollarSign,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Layers,
  BookMarked,
  Grid2x2,
  Users,
  History as HistoryIcon,
  Download,
  UserCircle2,
  SlidersHorizontal,
  BellRing,
  ShieldCheck,
  LogOut,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
//  ICONS — lucide-react, mapped to the same keys used throughout this file
// ═══════════════════════════════════════════════════════════════════════════════
const Icons = {
  Logo: () => (
    <img
      src="/new-protiba-logo.png"
      alt="Protiba"
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  ),
  Dashboard: (props) => (
    <LayoutDashboard size={18} strokeWidth={1.8} {...props} />
  ),
  Timetable: (props) => <CalendarDays size={18} strokeWidth={1.8} {...props} />,
  Generate: (props) => <Sparkles size={18} strokeWidth={1.8} {...props} />,
  Institution: (props) => <BookMarked size={18} strokeWidth={1.8} {...props} />,
  Analytics: (props) => <BarChart3 size={18} strokeWidth={1.8} {...props} />,
  Pricing: (props) => <DollarSign size={18} strokeWidth={1.8} {...props} />,
  Story: (props) => <BookOpen size={18} strokeWidth={1.8} {...props} />,
  Search: (props) => <Search size={16} strokeWidth={1.8} {...props} />,
  ChevronDown: (props) => (
    <ChevronDown size={12} strokeWidth={2.2} {...props} />
  ),
  Bell: (props) => <Bell size={18} strokeWidth={1.8} {...props} />,
  User: (props) => <UserIcon size={18} strokeWidth={1.8} {...props} />,
  Menu: (props) => <Menu size={20} strokeWidth={1.8} {...props} />,
  X: (props) => <X size={20} strokeWidth={1.8} {...props} />,
  Classes: (props) => <Layers size={16} strokeWidth={1.7} {...props} />,
  Subjects: (props) => <BookMarked size={16} strokeWidth={1.7} {...props} />,
  Departments: (props) => <Grid2x2 size={16} strokeWidth={1.7} {...props} />,
  Teachers: (props) => <Users size={16} strokeWidth={1.7} {...props} />,
  History: (props) => <HistoryIcon size={16} strokeWidth={1.7} {...props} />,
  Export: (props) => <Download size={16} strokeWidth={1.7} {...props} />,
  Account: (props) => <UserCircle2 size={16} strokeWidth={1.7} {...props} />,
  Preferences: (props) => (
    <SlidersHorizontal size={16} strokeWidth={1.7} {...props} />
  ),
  Notifications: (props) => <BellRing size={16} strokeWidth={1.7} {...props} />,
  Security: (props) => <ShieldCheck size={16} strokeWidth={1.7} {...props} />,
  Logout: (props) => <LogOut size={16} strokeWidth={1.7} {...props} />,
  ArrowRight: (props) => <ChevronRight size={14} strokeWidth={2} {...props} />,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  COLOR HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

// ═══════════════════════════════════════════════════════════════════════════════
//  NAVIGATION DATA — Hierarchical route structure, each item carries its own accent
// ═══════════════════════════════════════════════════════════════════════════════
const navStructure = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/home",
    icon: Icons.Dashboard,
    children: null,
    color: "#2563EB",
  },
  {
    id: "timetables",
    label: "Timetables",
    path: "/timetables",
    icon: Icons.Timetable,
    color: "#7C3AED",
    children: [
      {
        label: "All Timetables",
        path: "/home/timetables",
        icon: Icons.Timetable,
      },
      {label: "Generated", path: "/timetables/generated", icon: Icons.History},
      {label: "Exports", path: "/timetables/exports", icon: Icons.Export},
      {label: "History", path: "/timetables/history", icon: Icons.History},
    ],
  },
  {
    id: "generate",
    label: "Generate",
    path: "/home/create-table",
    icon: Icons.Generate,
    children: null,
    highlight: true,
    color: "#EA580C",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: Icons.Analytics,
    children: null,
    color: "#0D9488",
  },
  {
    id: "pricing",
    label: "Pricing",
    path: "/home/pricing",
    icon: Icons.Pricing,
    children: null,
    color: "#DB2777",
  },
  {
    id: "story",
    label: "Our Story",
    path: "/home/story",
    icon: Icons.Story,
    children: null,
    color: "#16A34A",
  },
];

const settingsStructure = [
  {
    label: "Account",
    path: "/settings/account",
    icon: Icons.Account,
    color: "#2563EB",
  },
  {
    label: "Preferences",
    path: "/settings/preferences",
    icon: Icons.Preferences,
    color: "#7C3AED",
  },
  {
    label: "Notifications",
    path: "/settings/notifications",
    icon: Icons.Notifications,
    color: "#EA580C",
  },
  {
    label: "Security",
    path: "/settings/security",
    icon: Icons.Security,
    color: "#0D9488",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  UTILITY — Check if a route is active (supports parent routes)
// ═══════════════════════════════════════════════════════════════════════════════
const isRouteActive = (currentPath, navPath, children = null) => {
  if (currentPath === navPath) return true;
  if (children && children.some((child) => currentPath === child.path))
    return true;
  return false;
};

const isParentActive = (currentPath, navPath) => {
  return currentPath.startsWith(navPath) && navPath !== "/dashboard";
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MOBILE NAV ITEM — Expandable with children
// ═══════════════════════════════════════════════════════════════════════════════
const MobileNavItem = ({item, currentPath, index, onNavigate}) => {
  const [expanded, setExpanded] = useState(
    isRouteActive(currentPath, item.path, item.children),
  );

  const hasChildren = item.children && item.children.length > 0;
  const isActive = isRouteActive(currentPath, item.path, item.children);
  const accent = item.color || "#2B2B2B";

  return (
    <motion.div
      initial={{opacity: 0, x: -20}}
      animate={{opacity: 1, x: 0}}
      transition={{delay: 0.2 + index * 0.05, duration: 0.3}}
    >
      {hasChildren ? (
        <div className="nav-mobile-group">
          <button
            className="nav-mobile-group__trigger"
            style={
              isActive
                ? {background: hexToRgba(accent, 0.1), color: accent}
                : undefined
            }
            onClick={() => setExpanded(!expanded)}
          >
            <item.icon />
            <span>{item.label}</span>
            <motion.span
              className="nav-mobile-group__chevron"
              animate={{rotate: expanded ? 90 : 0}}
              transition={{duration: 0.2}}
            >
              <Icons.ArrowRight />
            </motion.span>
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="nav-mobile-group__children"
                initial={{height: 0, opacity: 0}}
                animate={{height: "auto", opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="nav-mobile-sublink"
                    style={
                      currentPath === child.path
                        ? {background: hexToRgba(accent, 0.08), color: accent}
                        : undefined
                    }
                    onClick={onNavigate}
                  >
                    <child.icon />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          to={item.path}
          className={`nav-mobile-link ${item.highlight ? "nav-mobile-link--highlight" : ""}`}
          style={
            isActive
              ? {background: hexToRgba(accent, 0.1), color: accent}
              : item.highlight
                ? {
                    background: hexToRgba(accent, 0.08),
                    border: `0.5px solid ${hexToRgba(accent, 0.3)}`,
                    color: accent,
                  }
                : undefined
          }
          onClick={onNavigate}
        >
          <item.icon />
          <span>{item.label}</span>
        </Link>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN NAVIGATION COMPONENT — Top bar + mobile panel
// ═══════════════════════════════════════════════════════════════════════════════
export const Navigation = ({
  userName = "Admin User",
  institutionName = "St. Mary's Academy",
  notificationCount = 3,
  onLogout = () => {},
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveDropdown(null);
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDropdown = useCallback((id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      <style>{navStyles}</style>

      {/* TOP NAVIGATION BAR */}
      <header
        className={`nav-header ${scrolled ? "nav-header--scrolled" : ""}`}
      >
        <div className="nav-header__inner">
          {/* Brand */}
          <Link to="/" className="nav-logo">
            <Icons.Logo />
            <span className="nav-logo__text">Protiba</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-desktop" ref={dropdownRef}>
            {navStructure.map((item) => {
              const active = isRouteActive(
                currentPath,
                item.path,
                item.children,
              );
              const parentActive = isParentActive(currentPath, item.path);
              const accent = item.color || "#2B2B2B";
              const linkStyle = active
                ? {background: hexToRgba(accent, 0.12), color: accent}
                : item.highlight
                  ? {
                      background: hexToRgba(accent, 0.08),
                      border: `0.5px solid ${hexToRgba(accent, 0.3)}`,
                      color: accent,
                    }
                  : parentActive
                    ? {color: "#2B2B2B"}
                    : undefined;

              return (
                <div key={item.id} className="nav-item-wrapper">
                  {item.children ? (
                    <div className="nav-dropdown-container">
                      <button
                        className="nav-link"
                        style={linkStyle}
                        onClick={() => toggleDropdown(item.id)}
                        aria-expanded={activeDropdown === item.id}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                        <motion.span
                          className="nav-link__chevron"
                          animate={{
                            rotate: activeDropdown === item.id ? 180 : 0,
                          }}
                          transition={{duration: 0.2}}
                        >
                          <Icons.ChevronDown />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div
                            className="nav-dropdown"
                            initial={{opacity: 0, y: 8, scale: 0.96}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, y: 8, scale: 0.96}}
                            transition={{
                              duration: 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            <div className="nav-dropdown__header">
                              <span className="nav-dropdown__label">
                                {item.label}
                              </span>
                            </div>
                            {item.children.map((child) => {
                              const childActive = currentPath === child.path;
                              return (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className="nav-dropdown__item"
                                  style={
                                    childActive
                                      ? {
                                          background: hexToRgba(accent, 0.08),
                                          color: accent,
                                        }
                                      : undefined
                                  }
                                >
                                  <span className="nav-dropdown__icon">
                                    <child.icon />
                                  </span>
                                  <span className="nav-dropdown__text">
                                    {child.label}
                                  </span>
                                  {childActive && (
                                    <motion.span
                                      className="nav-dropdown__indicator"
                                      style={{background: accent}}
                                      layoutId="dropdownIndicator"
                                      transition={{duration: 0.2}}
                                    />
                                  )}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to={item.path} className="nav-link" style={linkStyle}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="nav-actions">
            <div className="nav-search-wrapper" ref={searchRef}>
              <button
                className="nav-action-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Icons.Search />
                <span className="nav-search-shortcut">⌘K</span>
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="nav-search-overlay"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onClick={() => setSearchOpen(false)}
                  >
                    <motion.div
                      className="nav-search-modal"
                      initial={{opacity: 0, y: -20, scale: 0.96}}
                      animate={{opacity: 1, y: 0, scale: 1}}
                      exit={{opacity: 0, y: -20, scale: 0.96}}
                      transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="nav-search-input-wrapper">
                        <Icons.Search />
                        <input
                          type="text"
                          placeholder="Search timetables, teachers, classes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="nav-search-input"
                        />
                        <span className="nav-search-esc">ESC</span>
                      </div>
                      <div className="nav-search-hints">
                        <span>Try: "Math 101", "Dr. Smith", "Spring 2026"</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="nav-action-btn nav-action-btn--badge"
              aria-label="Notifications"
            >
              <Icons.Bell />
              {notificationCount > 0 && (
                <span className="nav-badge">{notificationCount}</span>
              )}
            </button>

            <div className="nav-user-wrapper" ref={userMenuRef}>
              <button
                className="nav-user-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <div className="nav-user-avatar">{getInitials(userName)}</div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{userName}</span>
                  <span className="nav-user-institution">
                    {institutionName}
                  </span>
                </div>
                <motion.span
                  className="nav-user-chevron"
                  animate={{rotate: userMenuOpen ? 180 : 0}}
                  transition={{duration: 0.2}}
                >
                  <Icons.ChevronDown />
                </motion.span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="nav-user-dropdown"
                    initial={{opacity: 0, y: 8, scale: 0.96}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 8, scale: 0.96}}
                    transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                  >
                    <div className="nav-user-dropdown__header">
                      <div className="nav-user-avatar nav-user-avatar--large">
                        {getInitials(userName)}
                      </div>
                      <div>
                        <div className="nav-user-dropdown__name">
                          {userName}
                        </div>
                        <div className="nav-user-dropdown__institution">
                          {institutionName}
                        </div>
                      </div>
                    </div>
                    <div className="nav-user-dropdown__divider" />
                    {settingsStructure.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="nav-user-dropdown__item"
                      >
                        <span style={{color: item.color}}>
                          <item.icon />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <div className="nav-user-dropdown__divider" />
                    <button
                      className="nav-user-dropdown__item nav-user-dropdown__item--danger"
                      onClick={onLogout}
                    >
                      <Icons.Logout />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <MotionConfig transition={{duration: 0.3, ease: "easeInOut"}}>
                <motion.div animate={mobileOpen ? "open" : "closed"}>
                  <motion.span
                    className="nav-mobile-bar"
                    variants={{
                      open: {rotate: 45, y: 6},
                      closed: {rotate: 0, y: 0},
                    }}
                  />
                  <motion.span
                    className="nav-mobile-bar"
                    variants={{
                      open: {opacity: 0, scaleX: 0},
                      closed: {opacity: 1, scaleX: 1},
                    }}
                  />
                  <motion.span
                    className="nav-mobile-bar"
                    variants={{
                      open: {rotate: -45, y: -6},
                      closed: {rotate: 0, y: 0},
                    }}
                  />
                </motion.div>
              </MotionConfig>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION PANEL */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="nav-mobile-backdrop"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="nav-mobile-panel"
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            >
              <div className="nav-mobile-panel__header">
                <Link
                  to="/dashboard"
                  className="nav-logo"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icons.Logo />
                  <span className="nav-logo__text">Protiba</span>
                </Link>
              </div>

              <div className="nav-mobile-user">
                <div className="nav-user-avatar nav-user-avatar--large">
                  {getInitials(userName)}
                </div>
                <div>
                  <div className="nav-mobile-user__name">{userName}</div>
                  <div className="nav-mobile-user__institution">
                    {institutionName}
                  </div>
                </div>
              </div>

              <nav className="nav-mobile-nav">
                {navStructure.map((item, idx) => (
                  <MobileNavItem
                    key={item.id}
                    item={item}
                    currentPath={currentPath}
                    index={idx}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              <div className="nav-mobile-section">
                <span className="nav-mobile-section__label">Settings</span>
                {settingsStructure.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.4 + idx * 0.05, duration: 0.3}}
                  >
                    <Link
                      to={item.path}
                      className="nav-mobile-link"
                      style={
                        currentPath === item.path
                          ? {
                              background: hexToRgba(item.color, 0.1),
                              color: item.color,
                            }
                          : undefined
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="nav-mobile-footer">
                <button className="nav-mobile-logout" onClick={onLogout}>
                  <Icons.Logout />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const navStyles = `
  :root {
    --nav-bg: rgba(248,248,248,0.75);
    --nav-bg-solid: #FFFFFF;
    --nav-border: rgba(43,43,43,0.08);
    --nav-border-2: rgba(43,43,43,0.14);
    --nav-text: #2B2B2B;
    --nav-text-2: #898989;
    --nav-text-3: #A8A8A8;
    --nav-accent: #2B2B2B;
    --nav-accent-light: #5C5C5C;
    --nav-accent-glow: rgba(43,43,43,0.06);
    --nav-red: #DC2626;
    --nav-radius: 10px;
    --nav-transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(248,248,248,0.75);
    backdrop-filter: blur(18px) saturate(1.4);
    -webkit-backdrop-filter: blur(18px) saturate(1.4);
    border-bottom: 1px solid transparent;
    transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  }
  .nav-header--scrolled {
    background: rgba(255,255,255,0.9);
    border-bottom-color: var(--nav-border);
    box-shadow: 0 4px 30px rgba(43,43,43,0.06);
  }
  .nav-header__inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 18px;
    font-weight: 800;
    color: var(--nav-text);
    letter-spacing: -0.03em;
    flex-shrink: 0;
    transition: opacity 0.2s;
  }
  .nav-logo:hover { opacity: 0.85; }
  .nav-logo__text {
    background: linear-gradient(135deg, #2B2B2B 0%, #2563EB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nav-desktop {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }
  .nav-item-wrapper { position: relative; }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--nav-text-2);
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-link:hover {
    background: rgba(43,43,43,0.05);
    color: var(--nav-text);
  }
  .nav-link__chevron {
    display: inline-flex;
    transition: transform 0.2s;
  }
  .nav-dropdown-container { position: relative; }
  .nav-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 200px;
    background: var(--nav-bg-solid);
    border: 0.5px solid var(--nav-border);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(43,43,43,0.10);
    backdrop-filter: blur(12px);
    overflow: hidden;
    z-index: 101;
  }
  .nav-dropdown__header {
    padding: 10px 16px;
    border-bottom: 0.5px solid var(--nav-border);
  }
  .nav-dropdown__label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--nav-text-3);
  }
  .nav-dropdown__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--nav-text-2);
    text-decoration: none;
    transition: all var(--nav-transition);
    position: relative;
  }
  .nav-dropdown__item:hover {
    background: rgba(43,43,43,0.04);
    color: var(--nav-text);
  }
  .nav-dropdown__indicator {
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    border-radius: 2px;
  }
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: var(--nav-text-2);
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 10px;
    transition: all var(--nav-transition);
    position: relative;
  }
  .nav-action-btn:hover {
    background: rgba(43,43,43,0.05);
    color: var(--nav-text);
  }
  .nav-search-shortcut {
    font-size: 11px;
    color: var(--nav-text-3);
    background: rgba(43,43,43,0.05);
    padding: 2px 6px;
    border-radius: 6px;
    border: 0.5px solid var(--nav-border);
  }
  .nav-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #DC2626;
    color: white;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 10px;
    line-height: 1;
  }
  .nav-search-overlay {
    position: fixed;
    inset: 0;
    background: rgba(43,43,43,0.25);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
  }
  .nav-search-modal {
    width: 90%;
    max-width: 560px;
    background: #FFFFFF;
    border: 0.5px solid var(--nav-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 32px 64px rgba(43,43,43,0.18);
  }
  .nav-search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 0.5px solid var(--nav-border);
    background: rgba(43,43,43,0.02);
  }
  .nav-search-input {
    flex: 1;
    background: transparent;
    border: none;
    font-size: 15px;
    color: var(--nav-text);
    outline: none;
  }
  .nav-search-esc {
    font-size: 11px;
    color: var(--nav-text-3);
    background: rgba(43,43,43,0.05);
    padding: 3px 8px;
    border-radius: 8px;
  }
  .nav-search-hints {
    padding: 10px 20px;
    font-size: 12px;
    color: var(--nav-text-3);
    border-top: 0.5px solid var(--nav-border);
  }
  .nav-user-wrapper { position: relative; }
  .nav-user-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-user-trigger:hover {
    background: rgba(43,43,43,0.05);
  }
  .nav-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }
  .nav-user-avatar--large {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  .nav-user-info {
    text-align: left;
  }
  .nav-user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--nav-text);
    display: block;
    line-height: 1.3;
  }
  .nav-user-institution {
    font-size: 10px;
    color: var(--nav-text-3);
  }
  .nav-user-chevron {
    display: inline-flex;
    transition: transform 0.2s;
  }
  .nav-user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 280px;
    background: var(--nav-bg-solid);
    border: 0.5px solid var(--nav-border);
    border-radius: 14px;
    box-shadow: 0 20px 40px rgba(43,43,43,0.12);
    backdrop-filter: blur(12px);
    overflow: hidden;
    z-index: 101;
  }
  .nav-user-dropdown__header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    border-bottom: 0.5px solid var(--nav-border);
  }
  .nav-user-dropdown__name {
    font-size: 14px;
    font-weight: 600;
    color: var(--nav-text);
  }
  .nav-user-dropdown__institution {
    font-size: 11px;
    color: var(--nav-text-3);
  }
  .nav-user-dropdown__divider {
    height: 0.5px;
    background: var(--nav-border);
    margin: 4px 0;
  }
  .nav-user-dropdown__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--nav-text-2);
    text-decoration: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-user-dropdown__item:hover {
    background: rgba(43,43,43,0.04);
    color: var(--nav-text);
  }
  .nav-user-dropdown__item--danger {
    color: #DC2626;
  }
  .nav-user-dropdown__item--danger:hover {
    background: rgba(220,38,38,0.08);
    color: #DC2626;
  }
  .nav-mobile-toggle {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 4px;
    color: var(--nav-text);
  }
  .nav-mobile-bar {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--nav-text);
    margin: 4px 0;
    border-radius: 2px;
  }
  .nav-mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(43,43,43,0.2);
    backdrop-filter: blur(4px);
    z-index: 150;
  }
  .nav-mobile-panel {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background: var(--nav-bg-solid);
    border-right: 0.5px solid var(--nav-border);
    z-index: 151;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .nav-mobile-panel__header {
    padding: 20px;
    border-bottom: 0.5px solid var(--nav-border);
  }
  .nav-mobile-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-bottom: 0.5px solid var(--nav-border);
  }
  .nav-mobile-user__name {
    font-size: 14px;
    font-weight: 600;
    color: var(--nav-text);
  }
  .nav-mobile-user__institution {
    font-size: 11px;
    color: var(--nav-text-3);
  }
  .nav-mobile-nav {
    flex: 1;
    padding: 12px;
  }
  .nav-mobile-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--nav-text-2);
    text-decoration: none;
    transition: all var(--nav-transition);
  }
  .nav-mobile-group { margin-bottom: 4px; }
  .nav-mobile-group__trigger {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--nav-text-2);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-mobile-group__chevron {
    margin-left: auto;
    display: inline-flex;
    transition: transform 0.2s;
  }
  .nav-mobile-group__children {
    padding-left: 32px;
    overflow: hidden;
  }
  .nav-mobile-sublink {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--nav-text-3);
    text-decoration: none;
    transition: all var(--nav-transition);
  }
  .nav-mobile-section {
    padding: 12px;
    border-top: 0.5px solid var(--nav-border);
    margin-top: 12px;
  }
  .nav-mobile-section__label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--nav-text-3);
    padding: 8px 12px;
    display: block;
  }
  .nav-mobile-footer {
    padding: 16px;
    border-top: 0.5px solid var(--nav-border);
  }
  .nav-mobile-logout {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #DC2626;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-mobile-logout:hover {
    background: rgba(220,38,38,0.08);
  }
  @media (max-width: 860px) {
    .nav-desktop { display: none; }
    .nav-mobile-toggle { display: block; }
    .nav-user-info { display: none; }
    .nav-search-shortcut { display: none; }
    .nav-user-trigger { padding: 6px; }
  }
`;

export default Navigation;
