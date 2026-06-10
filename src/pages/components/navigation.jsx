import React, {useState, useEffect, useRef, useCallback} from "react";
import {motion, AnimatePresence, MotionConfig} from "framer-motion";
import {Link, useLocation} from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════════
//  ICONS — Premium SVG iconography (self-contained, no external deps)
// ═══════════════════════════════════════════════════════════════════════════════
const Icons = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#navLogoGrad)" />
      <defs>
        <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M9 16L13.5 11L18.5 16L24 8.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="23" r="3.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  ),
  Dashboard: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="6" height="6" rx="2" />
      <rect x="10" y="2" width="6" height="6" rx="2" />
      <rect x="2" y="10" width="6" height="6" rx="2" />
      <rect x="10" y="10" width="6" height="6" rx="2" />
    </svg>
  ),
  Timetable: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="14" height="12" rx="2" />
      <path d="M6 1v3M12 1v3M2 7h14" />
      <path d="M5 11h2M5 13h2M9 11h2M9 13h2" strokeWidth="1.2" />
    </svg>
  ),
  Generate: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 2v4M9 12v4M2 9h4M12 9h4" />
      <circle cx="9" cy="9" r="2.5" />
    </svg>
  ),
  Institution: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 16V8l7-5 7 5v8" />
      <path d="M6 16V10h6v6" />
      <path d="M9 3v3" strokeWidth="1.2" />
    </svg>
  ),
  Analytics: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 14l4-5 3 2.5L14 6l2 3" />
      <path d="M2 16h14" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="2.5" />
      <path d="M14.5 9a5.5 5.5 0 00-.45-2.2l1.8-1.8-1.4-1.4-1.8 1.8A5.5 5.5 0 009 3.5V1.5H7v2a5.5 5.5 0 00-2.2.45l-1.8-1.8-1.4 1.4 1.8 1.8A5.5 5.5 0 003.5 9H1.5v2h2a5.5 5.5 0 00.45 2.2l-1.8 1.8 1.4 1.4 1.8-1.8A5.5 5.5 0 007 14.5v2h2v-2a5.5 5.5 0 002.2-.45l1.8 1.8 1.4-1.4-1.8-1.8A5.5 5.5 0 0014.5 9h2V9z" />
    </svg>
  ),
  Search: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="5.5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4.5l4 4 4-4" />
    </svg>
  ),
  Bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3a2 2 0 114 0 2 2 0 01-4 0z" strokeWidth="1.2" />
      <path d="M3 13.5V9a6 6 0 0112 0v4.5" />
      <path d="M6 13.5v.5a3 3 0 006 0v-.5" />
    </svg>
  ),
  User: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="5.5" r="3.5" />
      <path d="M2.5 15.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M3 6h14M3 10h14M3 14h10" />
    </svg>
  ),
  X: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  ),
  Classes: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="10" rx="2" />
      <path d="M6 7h4M6 10h4" strokeWidth="1.2" />
    </svg>
  ),
  Subjects: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3h10v10H3z" />
      <path d="M3 6h10M6 3v10" strokeWidth="1.2" />
    </svg>
  ),
  Departments: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  ),
  Teachers: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
    </svg>
  ),
  History: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5v4l2.5 1.5" />
    </svg>
  ),
  Export: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8M5 7l3 3 3-3" />
      <path d="M3 12v1a2 2 0 002 2h6a2 2 0 002-2v-1" />
    </svg>
  ),
  Account: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
    </svg>
  ),
  Preferences: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="2" />
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.2 4.2l1.4 1.4M10.4 10.4l1.4 1.4M4.2 11.8l1.4-1.4M10.4 5.6l1.4-1.4" />
    </svg>
  ),
  Notifications: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6a4 4 0 118 0c0 3 1.5 4 1.5 4H2.5S4 9 4 6z" />
      <path d="M7 13.5a1.5 1.5 0 002 0" />
    </svg>
  ),
  Security: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="10" height="8" rx="2" />
      <path d="M5 7V5a3 3 0 016 0v2" />
    </svg>
  ),
  Logout: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3H3v10h3" />
      <path d="M6 8h6M10 5l3 3-3 3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
//  NAVIGATION DATA — Hierarchical route structure
// ═══════════════════════════════════════════════════════════════════════════════
const navStructure = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/home",
    icon: Icons.Dashboard,
    children: null,
  },
  {
    id: "timetables",
    label: "Timetables",
    path: "/timetables",
    icon: Icons.Timetable,
    children: [
      {label: "All Timetables", path: "/timetables", icon: Icons.Timetable},
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
  },
  {
    id: "institution",
    label: "Institution",
    path: "/institution",
    icon: Icons.Institution,
    children: [
      {label: "Classes", path: "/institution/classes", icon: Icons.Classes},
      {label: "Subjects", path: "/institution/subjects", icon: Icons.Subjects},
      {
        label: "Departments",
        path: "/institution/departments",
        icon: Icons.Departments,
      },
      {label: "Teachers", path: "/institution/teachers", icon: Icons.Teachers},
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: Icons.Analytics,
    children: null,
  },
];

const settingsStructure = [
  {label: "Account", path: "/settings/account", icon: Icons.Account},
  {
    label: "Preferences",
    path: "/settings/preferences",
    icon: Icons.Preferences,
  },
  {
    label: "Notifications",
    path: "/settings/notifications",
    icon: Icons.Notifications,
  },
  {label: "Security", path: "/settings/security", icon: Icons.Security},
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
  return name
    .split(" ")
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

  return (
    <motion.div
      initial={{opacity: 0, x: -20}}
      animate={{opacity: 1, x: 0}}
      transition={{delay: 0.2 + index * 0.05, duration: 0.3}}
    >
      {hasChildren ? (
        <div className="nav-mobile-group">
          <button
            className={`nav-mobile-group__trigger ${isActive ? "nav-mobile-group__trigger--active" : ""}`}
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
                    className={`nav-mobile-sublink ${currentPath === child.path ? "nav-mobile-sublink--active" : ""}`}
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
          className={`nav-mobile-link ${isActive ? "nav-mobile-link--active" : ""} ${item.highlight ? "nav-mobile-link--highlight" : ""}`}
          onClick={onNavigate}
        >
          <item.icon />
          <span>{item.label}</span>
          {item.highlight && (
            <span className="nav-mobile-link__badge">New</span>
          )}
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
          <Link to="/dashboard" className="nav-logo">
            <Icons.Logo />
            <span className="nav-logo__text">Protiba</span>
          </Link>

          <nav className="nav-desktop" ref={dropdownRef}>
            {navStructure.map((item) => (
              <div key={item.id} className="nav-item-wrapper">
                {item.children ? (
                  <div className="nav-dropdown-container">
                    <button
                      className={`nav-link ${isRouteActive(currentPath, item.path, item.children) ? "nav-link--active" : ""} ${isParentActive(currentPath, item.path) ? "nav-link--parent-active" : ""}`}
                      onClick={() => toggleDropdown(item.id)}
                      aria-expanded={activeDropdown === item.id}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                      <motion.span
                        className="nav-link__chevron"
                        animate={{rotate: activeDropdown === item.id ? 180 : 0}}
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
                          transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                        >
                          <div className="nav-dropdown__header">
                            <span className="nav-dropdown__label">
                              {item.label}
                            </span>
                          </div>
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`nav-dropdown__item ${currentPath === child.path ? "nav-dropdown__item--active" : ""}`}
                            >
                              <span className="nav-dropdown__icon">
                                <child.icon />
                              </span>
                              <span className="nav-dropdown__text">
                                {child.label}
                              </span>
                              {currentPath === child.path && (
                                <motion.span
                                  className="nav-dropdown__indicator"
                                  layoutId="dropdownIndicator"
                                  transition={{duration: 0.2}}
                                />
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link ${isRouteActive(currentPath, item.path) ? "nav-link--active" : ""} ${item.highlight ? "nav-link--highlight" : ""}`}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="nav-link__badge">New</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

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
                    <Link
                      to="/settings/account"
                      className="nav-user-dropdown__item"
                    >
                      <Icons.Account />
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      to="/settings/preferences"
                      className="nav-user-dropdown__item"
                    >
                      <Icons.Preferences />
                      <span>Preferences</span>
                    </Link>
                    <Link
                      to="/settings/notifications"
                      className="nav-user-dropdown__item"
                    >
                      <Icons.Notifications />
                      <span>Notifications</span>
                    </Link>
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
                      className={`nav-mobile-link ${currentPath === item.path ? "nav-mobile-link--active" : ""}`}
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

// ═══════════════════════════════════════════════════════════════════════════════
//  STYLES — Main Navigation (navStyles)
// ═══════════════════════════════════════════════════════════════════════════════
const navStyles = `
  :root {
    --nav-bg: rgba(3,3,5,0.8);
    --nav-bg-solid: #0a0a0f;
    --nav-border: rgba(255,255,255,0.07);
    --nav-border-2: rgba(255,255,255,0.12);
    --nav-text: #f0f0f5;
    --nav-text-2: #9ca3af;
    --nav-text-3: #6b7280;
    --nav-accent: #7c3aed;
    --nav-accent-light: #a78bfa;
    --nav-accent-glow: rgba(124,58,237,0.12);
    --nav-red: #f43f5e;
    --nav-radius: 10px;
    --nav-transition: 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
  }
  .nav-header--scrolled {
    background: rgba(3,3,5,0.85);
    backdrop-filter: blur(20px) saturate(1.5);
    border-bottom-color: var(--nav-border);
    box-shadow: 0 4px 30px rgba(0,0,0,0.3);
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
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
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
    background: rgba(255,255,255,0.04);
    color: var(--nav-text);
  }
  .nav-link--active {
    background: rgba(124,58,237,0.1);
    color: var(--nav-text);
  }
  .nav-link--highlight {
    background: rgba(124,58,237,0.08);
    border: 0.5px solid rgba(124,58,237,0.3);
  }
  .nav-link__badge {
    font-size: 10px;
    font-weight: 700;
    color: #fbbf24;
    background: rgba(251,191,36,0.12);
    border: 0.5px solid rgba(251,191,36,0.3);
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 0.3px;
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
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
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
    background: rgba(255,255,255,0.04);
    color: var(--nav-text);
  }
  .nav-dropdown__item--active {
    background: rgba(124,58,237,0.08);
    color: var(--nav-accent-light);
  }
  .nav-dropdown__indicator {
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: var(--nav-accent);
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
    background: rgba(255,255,255,0.04);
    color: var(--nav-text);
  }
  .nav-search-shortcut {
    font-size: 11px;
    color: var(--nav-text-3);
    background: rgba(255,255,255,0.05);
    padding: 2px 6px;
    border-radius: 6px;
    border: 0.5px solid var(--nav-border);
  }
  .nav-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #ef4444;
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
    background: rgba(0,0,0,0.6);
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
    background: #0f0f14;
    border: 0.5px solid var(--nav-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 32px 64px rgba(0,0,0,0.5);
  }
  .nav-search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 0.5px solid var(--nav-border);
    background: rgba(255,255,255,0.02);
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
    background: rgba(255,255,255,0.05);
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
    background: rgba(255,255,255,0.04);
  }
  .nav-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #6366f1);
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
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
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
    background: rgba(255,255,255,0.04);
    color: var(--nav-text);
  }
  .nav-user-dropdown__item--danger {
    color: #f87171;
  }
  .nav-user-dropdown__item--danger:hover {
    background: rgba(248,113,113,0.08);
    color: #f87171;
  }
  .nav-mobile-toggle {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 4px;
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
    background: rgba(0,0,0,0.5);
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
  .nav-mobile-link--active {
    background: rgba(124,58,237,0.1);
    color: var(--nav-text);
  }
  .nav-mobile-link--highlight {
    background: rgba(124,58,237,0.08);
  }
  .nav-mobile-link__badge {
    font-size: 10px;
    font-weight: 700;
    color: #fbbf24;
    background: rgba(251,191,36,0.12);
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: auto;
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
  .nav-mobile-group__trigger--active {
    background: rgba(124,58,237,0.1);
    color: var(--nav-text);
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
  .nav-mobile-sublink--active {
    background: rgba(124,58,237,0.08);
    color: var(--nav-accent-light);
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
    color: #f87171;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--nav-transition);
  }
  .nav-mobile-logout:hover {
    background: rgba(248,113,113,0.08);
  }
  @media (max-width: 860px) {
    .nav-desktop { display: none; }
    .nav-mobile-toggle { display: block; }
    .nav-user-info { display: none; }
    .nav-search-shortcut { display: none; }
    .nav-user-trigger { padding: 6px; }
  }
`;

export default Navigation; // optional default export
