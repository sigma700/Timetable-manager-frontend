// Navigation.jsx
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
  Menu,
  X,
  History as HistoryIcon,
  Download,
  UserCircle2,
  SlidersHorizontal,
  BellRing,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Command,
} from "lucide-react";

// Import the logo - make sure this path matches your actual logo file location
import protibaLogo from "/new-protiba-logo.png";

/* ═════════════════════════════════════════════════════════════════════════
   ICONS
   ═════════════════════════════════════════════════════════════════════════ */
const Icons = {
  Dashboard: (p) => <LayoutDashboard {...p} />,
  Timetable: (p) => <CalendarDays {...p} />,
  Generate: (p) => <Sparkles {...p} />,
  Analytics: (p) => <BarChart3 {...p} />,
  Pricing: (p) => <DollarSign {...p} />,
  Story: (p) => <BookOpen {...p} />,
  History: (p) => <HistoryIcon {...p} />,
  Export: (p) => <Download {...p} />,
  Account: (p) => <UserCircle2 {...p} />,
  Preferences: (p) => <SlidersHorizontal {...p} />,
  Notifications: (p) => <BellRing {...p} />,
  Security: (p) => <ShieldCheck {...p} />,
};

/* ═════════════════════════════════════════════════════════════════════════
   NAV DATA
   ═════════════════════════════════════════════════════════════════════════ */
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
        desc: "Every schedule in one place",
      },
      {
        label: "Generated",
        path: "/timetables/generated",
        icon: Icons.Generate,
        desc: "AI-built drafts, ready to review",
      },
      {
        label: "Exports",
        path: "/timetables/exports",
        icon: Icons.Export,
        desc: "PDF, CSV and print bundles",
      },
      {
        label: "History",
        path: "/timetables/history",
        icon: Icons.History,
        desc: "Track every revision",
      },
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

/* ═════════════════════════════════════════════════════════════════════════
   HELPERS
   ═════════════════════════════════════════════════════════════════════════ */
const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

const isRouteActive = (currentPath, navPath, children = null) => {
  if (currentPath === navPath) return true;
  if (children && children.some((c) => currentPath === c.path)) return true;
  return false;
};

const getInitials = (name) =>
  !name || typeof name !== "string"
    ? "?"
    : name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

const spring = {type: "spring", stiffness: 420, damping: 34, mass: 0.8};

/* ═════════════════════════════════════════════════════════════════════════
   MAGNETIC WRAPPER
   ═════════════════════════════════════════════════════════════════════════ */
const Magnetic = ({children, strength = 8, className, ...rest}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({x: 0, y: 0});

  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - (r.left + r.width / 2)) / r.width) * strength,
      y: ((e.clientY - (r.top + r.height / 2)) / r.height) * strength,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({x: 0, y: 0})}
      animate={{x: pos.x, y: pos.y}}
      transition={spring}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   MOBILE NAV ITEM
   ═════════════════════════════════════════════════════════════════════════ */
const MobileNavItem = ({item, currentPath, index, onNavigate}) => {
  const [expanded, setExpanded] = useState(
    isRouteActive(currentPath, item.path, item.children),
  );
  const hasChildren = !!(item.children && item.children.length);
  const active = isRouteActive(currentPath, item.path, item.children);
  const accent = item.color || "#2B2B2B";
  const Icon = item.icon;

  return (
    <motion.div
      className="nav-mobile-group"
      initial={{opacity: 0, x: -18}}
      animate={{opacity: 1, x: 0}}
      transition={{delay: 0.05 + index * 0.045, ...spring}}
    >
      {hasChildren ? (
        <>
          <button
            className={`nav-mobile-group__trigger${active ? " is-active" : ""}`}
            style={
              active
                ? {background: hexToRgba(accent, 0.1), color: accent}
                : undefined
            }
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <span
              className="nav-mobile-icon"
              style={{
                background: hexToRgba(accent, active ? 0.16 : 0.07),
                color: accent,
              }}
            >
              <Icon size={17} strokeWidth={2} />
            </span>
            {item.label}
            <motion.span
              className="nav-mobile-group__chevron"
              animate={{rotate: expanded ? 180 : 0}}
              transition={spring}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                className="nav-mobile-group__children"
                initial={{height: 0, opacity: 0}}
                animate={{height: "auto", opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.28, ease: [0.4, 0, 0.2, 1]}}
              >
                {item.children.map((child) => {
                  const CIcon = child.icon;
                  const childActive = currentPath === child.path;
                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={onNavigate}
                      className={`nav-mobile-sublink${childActive ? " is-active" : ""}`}
                      style={
                        childActive
                          ? {color: accent, background: hexToRgba(accent, 0.08)}
                          : undefined
                      }
                    >
                      <span
                        className="nav-mobile-sublink__dot"
                        style={{background: accent}}
                      />
                      <CIcon size={15} strokeWidth={2} />
                      {child.label}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          to={item.path}
          onClick={onNavigate}
          className={`nav-mobile-link${active ? " is-active" : ""}`}
          style={
            active
              ? {background: hexToRgba(accent, 0.1), color: accent}
              : undefined
          }
        >
          <span
            className="nav-mobile-icon"
            style={{
              background: hexToRgba(accent, active ? 0.16 : 0.07),
              color: accent,
            }}
          >
            <Icon size={17} strokeWidth={2} />
          </span>
          {item.label}
          {item.highlight && <span className="nav-mobile-pill">New</span>}
          <ChevronRight size={16} className="nav-mobile-link__arrow" />
        </Link>
      )}
    </motion.div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ═════════════════════════════════════════════════════════════════════════ */
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
  const [hovered, setHovered] = useState(null);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveDropdown(null);
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openDropdown = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setActiveDropdown(id);
  }, []);
  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <style>{navStyles}</style>

      {/* ── TOP BAR ── */}
      <header
        className={`nav-header${scrolled ? " nav-header--scrolled" : ""}`}
      >
        <div className="nav-header__sheen" aria-hidden="true" />
        <div className="nav-header__inner">
          {/* Brand logo - same for desktop and mobile */}
          <Link to="/" className="nav-logo" aria-label="Protiba home">
            <img
              src={protibaLogo}
              alt="Protiba Logo"
              className="nav-logo__image"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" onMouseLeave={() => setHovered(null)}>
            {navStructure.map((item) => {
              const active = isRouteActive(
                currentPath,
                item.path,
                item.children,
              );
              const accent = item.color || "#2B2B2B";
              const Icon = item.icon;
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="nav-item-wrapper"
                  ref={isOpen ? dropdownRef : undefined}
                  onMouseEnter={() => {
                    setHovered(item.id);
                    if (item.children) openDropdown(item.id);
                  }}
                  onMouseLeave={() => item.children && scheduleClose()}
                >
                  <AnimatePresence>
                    {hovered === item.id && !active && (
                      <motion.span
                        layoutId="nav-halo"
                        className="nav-halo"
                        style={{background: hexToRgba(accent, 0.09)}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={spring}
                      />
                    )}
                  </AnimatePresence>

                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="nav-active-pill"
                      style={{
                        background: hexToRgba(accent, 0.12),
                        boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.22)}`,
                      }}
                      transition={spring}
                    />
                  )}

                  {item.children ? (
                    <button
                      type="button"
                      className={`nav-link${active ? " is-active" : ""}`}
                      style={active ? {color: accent} : undefined}
                      onClick={() =>
                        isOpen ? setActiveDropdown(null) : openDropdown(item.id)
                      }
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <Icon
                        size={16}
                        strokeWidth={2.1}
                        className="nav-link__icon"
                      />
                      <span className="nav-link__label">{item.label}</span>
                      <motion.span
                        className="nav-link__chevron"
                        animate={{rotate: isOpen ? 180 : 0}}
                        transition={spring}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-link${active ? " is-active" : ""}${item.highlight ? " nav-link--highlight" : ""}`}
                      style={
                        active
                          ? {color: accent}
                          : item.highlight
                            ? {
                                color: accent,
                                background: hexToRgba(accent, 0.07),
                                boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.22)}`,
                              }
                            : undefined
                      }
                    >
                      <Icon
                        size={16}
                        strokeWidth={2.1}
                        className="nav-link__icon"
                      />
                      <span className="nav-link__label">{item.label}</span>
                      {item.highlight && (
                        <span className="nav-link__shine" aria-hidden="true" />
                      )}
                    </Link>
                  )}

                  {item.children && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="nav-dropdown"
                          initial={{opacity: 0, y: 10, scale: 0.97}}
                          animate={{opacity: 1, y: 0, scale: 1}}
                          exit={{opacity: 0, y: 6, scale: 0.98}}
                          transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                          onMouseEnter={() => openDropdown(item.id)}
                          onMouseLeave={scheduleClose}
                        >
                          <div
                            className="nav-dropdown__glow"
                            style={{background: hexToRgba(accent, 0.16)}}
                          />
                          <div className="nav-dropdown__header">
                            <span className="nav-dropdown__label">
                              {item.label}
                            </span>
                            <span className="nav-dropdown__count">
                              {item.children.length}
                            </span>
                          </div>

                          <div className="nav-dropdown__list">
                            {item.children.map((child, i) => {
                              const CIcon = child.icon;
                              const childActive = currentPath === child.path;
                              return (
                                <motion.div
                                  key={child.path}
                                  initial={{opacity: 0, x: -8}}
                                  animate={{opacity: 1, x: 0}}
                                  transition={{
                                    delay: 0.03 + i * 0.035,
                                    duration: 0.25,
                                  }}
                                >
                                  <Link
                                    to={child.path}
                                    className={`nav-dropdown__item${childActive ? " is-active" : ""}`}
                                  >
                                    {childActive && (
                                      <span
                                        className="nav-dropdown__indicator"
                                        style={{background: accent}}
                                      />
                                    )}
                                    <span
                                      className="nav-dropdown__icon"
                                      style={{
                                        background: hexToRgba(
                                          accent,
                                          childActive ? 0.16 : 0.08,
                                        ),
                                        color: accent,
                                      }}
                                    >
                                      <CIcon size={16} strokeWidth={2} />
                                    </span>
                                    <span className="nav-dropdown__copy">
                                      <span
                                        className="nav-dropdown__title"
                                        style={
                                          childActive
                                            ? {color: accent}
                                            : undefined
                                        }
                                      >
                                        {child.label}
                                      </span>
                                      {child.desc && (
                                        <span className="nav-dropdown__desc">
                                          {child.desc}
                                        </span>
                                      )}
                                    </span>
                                    <ArrowRight
                                      size={14}
                                      className="nav-dropdown__arrow"
                                    />
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="nav-actions">
            <div ref={searchRef}>
              <Magnetic>
                <button
                  className="nav-action-btn nav-action-btn--search"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search size={17} strokeWidth={2.1} />
                  <span className="nav-search-shortcut">
                    <Command size={10} strokeWidth={2.6} />K
                  </span>
                </button>
              </Magnetic>
            </div>

            <Magnetic>
              <button
                className="nav-action-btn"
                aria-label={`Notifications (${notificationCount})`}
              >
                <Bell size={17} strokeWidth={2.1} />
                {notificationCount > 0 && (
                  <span className="nav-badge">
                    <span className="nav-badge__ping" />
                    {notificationCount}
                  </span>
                )}
              </button>
            </Magnetic>

            <div className="nav-user-wrapper" ref={userMenuRef}>
              <button
                className={`nav-user-trigger${userMenuOpen ? " is-open" : ""}`}
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-label="Account menu"
              >
                <span className="nav-user-avatar">{getInitials(userName)}</span>
                <span className="nav-user-info">
                  <span className="nav-user-name">{userName}</span>
                  <span className="nav-user-institution">
                    {institutionName}
                  </span>
                </span>
                <motion.span
                  className="nav-user-chevron"
                  animate={{rotate: userMenuOpen ? 180 : 0}}
                  transition={spring}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="nav-user-dropdown"
                    initial={{opacity: 0, y: 10, scale: 0.97}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 6, scale: 0.98}}
                    transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                  >
                    <div className="nav-user-dropdown__header">
                      <span className="nav-user-avatar nav-user-avatar--large">
                        {getInitials(userName)}
                      </span>
                      <span className="nav-user-dropdown__meta">
                        <span className="nav-user-dropdown__name">
                          {userName}
                        </span>
                        <span className="nav-user-dropdown__institution">
                          {institutionName}
                        </span>
                      </span>
                    </div>

                    <div className="nav-user-dropdown__body">
                      {settingsStructure.map((s, i) => {
                        const SIcon = s.icon;
                        return (
                          <motion.div
                            key={s.path}
                            initial={{opacity: 0, x: -6}}
                            animate={{opacity: 1, x: 0}}
                            transition={{
                              delay: 0.03 + i * 0.03,
                              duration: 0.22,
                            }}
                          >
                            <Link
                              to={s.path}
                              className="nav-user-dropdown__item"
                            >
                              <span
                                className="nav-dropdown__icon"
                                style={{
                                  background: hexToRgba(s.color, 0.08),
                                  color: s.color,
                                }}
                              >
                                <SIcon size={15} strokeWidth={2} />
                              </span>
                              {s.label}
                              <ArrowRight
                                size={13}
                                className="nav-dropdown__arrow"
                              />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="nav-user-dropdown__divider" />
                    <button
                      className="nav-user-dropdown__item nav-user-dropdown__item--danger"
                      onClick={onLogout}
                    >
                      <span className="nav-dropdown__icon nav-dropdown__icon--danger">
                        <LogOut size={15} strokeWidth={2} />
                      </span>
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile-only buttons */}
            <button
              className="nav-action-btn nav-mobile-only"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={2.1} />
            </button>

            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{rotate: -90, opacity: 0}}
                    animate={{rotate: 0, opacity: 1}}
                    exit={{rotate: 90, opacity: 0}}
                    transition={{duration: 0.18}}
                    className="nav-mobile-toggle__icon"
                  >
                    <X size={20} strokeWidth={2.2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{rotate: 90, opacity: 0}}
                    animate={{rotate: 0, opacity: 1}}
                    exit={{rotate: -90, opacity: 0}}
                    transition={{duration: 0.18}}
                    className="nav-mobile-toggle__icon"
                  >
                    <Menu size={20} strokeWidth={2.2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
        <motion.div
          className="nav-header__line"
          initial={false}
          animate={{scaleX: scrolled ? 1 : 0}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        />
      </header>

      {/* ── COMMAND PALETTE ── */}
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
              initial={{opacity: 0, y: -18, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: -10, scale: 0.98}}
              transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-search-input-wrapper">
                <Search size={18} strokeWidth={2.1} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  placeholder="Search timetables, teachers, classes..."
                  className="nav-search-input"
                />
                <span className="nav-search-esc">ESC</span>
              </div>
              <div className="nav-search-quick">
                {navStructure.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="nav-search-quick__item"
                      onClick={() => setSearchOpen(false)}
                    >
                      <span
                        className="nav-dropdown__icon"
                        style={{
                          background: hexToRgba(item.color, 0.09),
                          color: item.color,
                        }}
                      >
                        <Icon size={15} strokeWidth={2} />
                      </span>
                      {item.label}
                      <ArrowRight size={13} className="nav-dropdown__arrow" />
                    </Link>
                  );
                })}
              </div>
              <div className="nav-search-hints">
                Try "Math 101", "Dr. Smith", "Spring 2026"
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE SIDEBAR ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="nav-mobile-backdrop"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="nav-mobile-panel"
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
            >
              {/* Mobile header with logo - using same imported logo */}
              <div className="nav-mobile-header">
                <Link
                  to="/"
                  className="nav-logo"
                  aria-label="Protiba home"
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src={protibaLogo}
                    alt="Protiba Logo"
                    className="nav-logo__image"
                    style={{height: "32px"}}
                  />
                </Link>
                <button
                  className="nav-mobile-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={2.2} />
                </button>
              </div>

              <div className="nav-mobile-user">
                <span className="nav-user-avatar nav-user-avatar--large">
                  {getInitials(userName)}
                </span>
                <span className="nav-mobile-user__meta">
                  <span className="nav-mobile-user__name">{userName}</span>
                  <span className="nav-mobile-user__institution">
                    {institutionName}
                  </span>
                </span>
              </div>

              <div className="nav-mobile-scroll">
                <nav className="nav-mobile-nav">
                  {navStructure.map((item, idx) => (
                    <MobileNavItem
                      key={item.id}
                      item={item}
                      index={idx}
                      currentPath={currentPath}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </nav>

                <div className="nav-mobile-section">
                  <span className="nav-mobile-section__label">Settings</span>
                  {settingsStructure.map((s, idx) => {
                    const SIcon = s.icon;
                    return (
                      <motion.div
                        key={s.path}
                        initial={{opacity: 0, x: -14}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.28 + idx * 0.04, ...spring}}
                      >
                        <Link
                          to={s.path}
                          onClick={() => setMobileOpen(false)}
                          className="nav-mobile-link"
                        >
                          <span
                            className="nav-mobile-icon"
                            style={{
                              background: hexToRgba(s.color, 0.07),
                              color: s.color,
                            }}
                          >
                            <SIcon size={17} strokeWidth={2} />
                          </span>
                          {s.label}
                          <ChevronRight
                            size={16}
                            className="nav-mobile-link__arrow"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="nav-mobile-footer">
                <Link
                  to="/home/create-table"
                  className="nav-mobile-cta"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles size={16} strokeWidth={2.2} />
                  Generate a timetable
                  <ArrowRight size={16} />
                </Link>
                <button className="nav-mobile-logout" onClick={onLogout}>
                  <LogOut size={17} strokeWidth={2} />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

/* ═════════════════════════════════════════════════════════════════════════
   STYLES
   ═════════════════════════════════════════════════════════════════════════ */
const navStyles = `
  .nav-header, .nav-header * { box-sizing: border-box; }
  .nav-header {
    --nav-bg: rgba(250,250,249,0.72);
    --nav-border: rgba(28,28,30,0.07);
    --nav-text: #14141A;
    --nav-text-2: #6B6B76;
    --nav-text-3: #A0A0AC;
    --nav-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --nav-transition: 260ms var(--nav-ease);
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    font-family: ui-sans-serif, -apple-system, "SF Pro Display", "Inter", system-ui, sans-serif;
    font-feature-settings: "cv02","cv03","ss01";
    background: var(--nav-bg);
    backdrop-filter: blur(22px) saturate(1.8);
    transition: background var(--nav-transition), box-shadow var(--nav-transition), height var(--nav-transition);
  }
  .nav-header__sheen {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0));
    opacity: .8;
  }
  .nav-header--scrolled {
    background: rgba(255,255,255,0.88);
    box-shadow: 0 1px 0 rgba(28,28,30,0.05), 0 12px 40px -18px rgba(20,20,26,0.28);
  }
  .nav-header__line {
    height: 1px; transform-origin: 50% 50%;
    background: linear-gradient(90deg, transparent, rgba(28,28,30,0.12) 20%, rgba(28,28,30,0.12) 80%, transparent);
  }
  .nav-header__inner {
    position: relative; max-width: 1440px; margin: 0 auto;
    padding: 0 clamp(14px, 3vw, 28px);
    height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px;
  }
  .nav-header--scrolled .nav-header__inner { height: 64px; }

  /* Brand - logo visible on all screens */
  .nav-logo {
    display: flex; align-items: center; text-decoration: none;
    flex-shrink: 0;
  }
  .nav-logo__image {
    height: 38px;
    width: auto;
    max-width: none;
    object-fit: contain;
    display: block;
    transition: transform 420ms var(--nav-ease), opacity var(--nav-transition);
  }
  .nav-logo:hover .nav-logo__image { 
    transform: scale(1.05); 
    opacity: 0.9;
  }

  /* Desktop nav */
  .nav-desktop { display: flex; align-items: center; gap: 2px; flex: 1; justify-content: center; }
  .nav-item-wrapper { position: relative; }
  .nav-halo, .nav-active-pill { position: absolute; inset: 0; border-radius: 12px; z-index: 0; }
  .nav-link {
    position: relative; z-index: 1; overflow: hidden;
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 14px; border-radius: 12px;
    font-size: 13.5px; font-weight: 550; letter-spacing: -0.012em;
    color: var(--nav-text-2); text-decoration: none;
    background: transparent; border: none; cursor: pointer; white-space: nowrap;
    transition: color var(--nav-transition), transform 200ms var(--nav-ease);
  }
  .nav-link:hover { color: var(--nav-text); }
  .nav-link:active { transform: scale(0.97); }
  .nav-link.is-active { font-weight: 650; }
  .nav-link__icon { transition: transform 320ms var(--nav-ease); }
  .nav-link:hover .nav-link__icon { transform: translateY(-1.5px) scale(1.08); }
  .nav-link__label { position: relative; }
  .nav-link__label::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1.5px; border-radius: 2px;
    background: currentColor; transform: scaleX(0); transform-origin: right;
    transition: transform 340ms var(--nav-ease);
  }
  .nav-link:hover .nav-link__label::after { transform: scaleX(1); transform-origin: left; }
  .nav-link__chevron { display: inline-flex; opacity: .6; }
  .nav-link--highlight .nav-link__shine {
    position: absolute; inset: 0;
    background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.85) 50%, transparent 65%);
    transform: translateX(-120%);
    animation: navShine 4.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes navShine { 0%,70% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }

  /* Dropdown */
  .nav-dropdown {
    position: absolute; top: calc(100% + 10px); left: 50%; translate: -50% 0;
    min-width: 300px; padding: 6px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(24px) saturate(1.6);
    border-radius: 18px; overflow: hidden; z-index: 101;
    box-shadow: 0 0 0 1px rgba(28,28,30,0.06), 0 30px 60px -20px rgba(20,20,26,0.28), inset 0 1px 0 rgba(255,255,255,0.9);
  }
  .nav-dropdown__glow { position: absolute; top: -60px; left: 50%; translate: -50% 0; width: 180px; height: 120px; filter: blur(46px); opacity: .7; pointer-events: none; }
  .nav-dropdown__header { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 8px 12px 10px; }
  .nav-dropdown__label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: var(--nav-text-3); }
  .nav-dropdown__count { font-size: 10.5px; font-weight: 600; color: var(--nav-text-3); background: rgba(28,28,30,0.05); padding: 2px 7px; border-radius: 20px; }
  .nav-dropdown__list { position: relative; display: flex; flex-direction: column; gap: 2px; }
  .nav-dropdown__item {
    position: relative; display: flex; align-items: center; gap: 11px;
    padding: 9px 11px; border-radius: 12px; text-decoration: none;
    color: var(--nav-text-2); transition: background var(--nav-transition), transform 220ms var(--nav-ease);
  }
  .nav-dropdown__item:hover { background: rgba(28,28,30,0.045); transform: translateX(3px); }
  .nav-dropdown__indicator { position: absolute; left: 2px; top: 12px; bottom: 12px; width: 2.5px; border-radius: 3px; }
  .nav-dropdown__icon {
    width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0;
    transition: transform 320ms var(--nav-ease);
  }
  .nav-dropdown__item:hover .nav-dropdown__icon,
  .nav-user-dropdown__item:hover .nav-dropdown__icon { transform: scale(1.08) rotate(-4deg); }
  .nav-dropdown__icon--danger { background: rgba(220,38,38,0.09); color: #DC2626; }
  .nav-dropdown__copy { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .nav-dropdown__title { font-size: 13px; font-weight: 600; color: var(--nav-text); letter-spacing: -0.012em; }
  .nav-dropdown__desc { font-size: 11.5px; color: var(--nav-text-3); letter-spacing: -0.005em; }
  .nav-dropdown__arrow { margin-left: auto; opacity: 0; transform: translateX(-6px); transition: all 260ms var(--nav-ease); color: var(--nav-text-3); flex-shrink: 0; }
  .nav-dropdown__item:hover .nav-dropdown__arrow,
  .nav-user-dropdown__item:hover .nav-dropdown__arrow,
  .nav-search-quick__item:hover .nav-dropdown__arrow { opacity: 1; transform: translateX(0); }

  /* Actions */
  .nav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .nav-action-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    background: transparent; border: none; color: var(--nav-text-2); cursor: pointer;
    padding: 9px 10px; border-radius: 12px; position: relative;
    transition: background var(--nav-transition), color var(--nav-transition), transform 200ms var(--nav-ease);
  }
  .nav-action-btn:hover { background: rgba(28,28,30,0.05); color: var(--nav-text); }
  .nav-action-btn:active { transform: scale(0.94); }
  .nav-search-shortcut {
    display: inline-flex; align-items: center; gap: 1px;
    font-size: 10.5px; font-weight: 600; color: var(--nav-text-3);
    background: rgba(28,28,30,0.045); padding: 3px 6px; border-radius: 7px;
    box-shadow: inset 0 0 0 1px rgba(28,28,30,0.06);
  }
  .nav-badge {
    position: absolute; top: 3px; right: 3px; min-width: 16px; height: 16px; padding: 0 4px;
    display: grid; place-items: center; background: #DC2626; color: #fff;
    font-size: 9.5px; font-weight: 700; border-radius: 10px; line-height: 1;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.9);
  }
  .nav-badge__ping { position: absolute; inset: 0; border-radius: 10px; background: #DC2626; animation: navPing 2.4s ease-out infinite; }
  @keyframes navPing { 0% { transform: scale(1); opacity: .55; } 70%,100% { transform: scale(2.1); opacity: 0; } }

  /* User */
  .nav-user-wrapper { position: relative; }
  .nav-user-trigger {
    display: flex; align-items: center; gap: 10px; background: transparent; border: none;
    padding: 5px 10px 5px 5px; border-radius: 999px; cursor: pointer;
    transition: background var(--nav-transition), box-shadow var(--nav-transition);
  }
  .nav-user-trigger:hover, .nav-user-trigger.is-open { background: rgba(28,28,30,0.05); box-shadow: inset 0 0 0 1px rgba(28,28,30,0.07); }
  .nav-user-avatar {
    width: 32px; height: 32px; border-radius: 999px; display: grid; place-items: center; flex-shrink: 0;
    background: linear-gradient(140deg, #2563EB, #7C3AED);
    font-size: 11.5px; font-weight: 700; color: #fff; letter-spacing: -0.01em;
    box-shadow: 0 4px 12px -4px rgba(124,58,237,0.65), inset 0 1px 0 rgba(255,255,255,0.3);
    transition: transform 320ms var(--nav-ease);
  }
  .nav-user-trigger:hover .nav-user-avatar { transform: scale(1.06); }
  .nav-user-avatar--large { width: 44px; height: 44px; font-size: 15px; border-radius: 14px; }
  .nav-user-info { display: flex; flex-direction: column; text-align: left; line-height: 1.25; }
  .nav-user-name { font-size: 12.5px; font-weight: 650; color: var(--nav-text); letter-spacing: -0.012em; }
  .nav-user-institution { font-size: 10.5px; color: var(--nav-text-3); letter-spacing: -0.004em; }
  .nav-user-chevron { display: inline-flex; color: var(--nav-text-3); }
  .nav-user-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0; width: 288px; padding: 6px;
    background: rgba(255,255,255,0.94); backdrop-filter: blur(24px) saturate(1.6);
    border-radius: 18px; overflow: hidden; z-index: 101;
    box-shadow: 0 0 0 1px rgba(28,28,30,0.06), 0 30px 60px -20px rgba(20,20,26,0.28), inset 0 1px 0 rgba(255,255,255,0.9);
  }
  .nav-user-dropdown__header { display: flex; align-items: center; gap: 12px; padding: 12px 12px 14px; }
  .nav-user-dropdown__meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .nav-user-dropdown__name { font-size: 13.5px; font-weight: 650; color: var(--nav-text); letter-spacing: -0.015em; }
  .nav-user-dropdown__institution { font-size: 11px; color: var(--nav-text-3); }
  .nav-user-dropdown__body { display: flex; flex-direction: column; gap: 2px; }
  .nav-user-dropdown__divider { height: 1px; background: rgba(28,28,30,0.06); margin: 6px 8px; }
  .nav-user-dropdown__item {
    display: flex; align-items: center; gap: 11px; padding: 8px 11px; border-radius: 12px;
    font-size: 13px; font-weight: 550; color: var(--nav-text); text-decoration: none;
    background: transparent; border: none; width: 100%; text-align: left; cursor: pointer;
    transition: background var(--nav-transition), transform 220ms var(--nav-ease);
  }
  .nav-user-dropdown__item:hover { background: rgba(28,28,30,0.045); transform: translateX(3px); }
  .nav-user-dropdown__item--danger { color: #DC2626; }
  .nav-user-dropdown__item--danger:hover { background: rgba(220,38,38,0.07); }

  /* Command palette */
  .nav-search-overlay {
    position: fixed; inset: 0; background: rgba(20,20,26,0.32);
    backdrop-filter: blur(10px); z-index: 200;
    display: flex; align-items: flex-start; justify-content: center; padding: 14vh 16px 0;
  }
  .nav-search-modal {
    width: 100%; max-width: 560px; padding: 6px;
    background: rgba(255,255,255,0.97); border-radius: 20px; overflow: hidden;
    font-family: ui-sans-serif, -apple-system, "SF Pro Display", "Inter", system-ui, sans-serif;
    box-shadow: 0 0 0 1px rgba(28,28,30,0.06), 0 40px 90px -24px rgba(20,20,26,0.45);
  }
  .nav-search-input-wrapper { display: flex; align-items: center; gap: 12px; padding: 14px 14px; color: #6B6B76; }
  .nav-search-input { flex: 1; background: transparent; border: none; font-size: 15.5px; color: #14141A; outline: none; letter-spacing: -0.015em; font-family: inherit; }
  .nav-search-input::placeholder { color: #A0A0AC; }
  .nav-search-esc { font-size: 10.5px; font-weight: 600; color: #A0A0AC; background: rgba(28,28,30,0.05); padding: 4px 8px; border-radius: 7px; }
  .nav-search-quick { display: flex; flex-direction: column; gap: 2px; padding: 4px 0; border-top: 1px solid rgba(28,28,30,0.06); }
  .nav-search-quick__item {
    display: flex; align-items: center; gap: 11px; padding: 9px 11px; border-radius: 12px;
    font-size: 13px; font-weight: 550; color: #14141A; text-decoration: none;
    transition: background 220ms var(--nav-ease);
  }
  .nav-search-quick__item:hover { background: rgba(28,28,30,0.045); }
  .nav-search-hints { padding: 10px 14px; font-size: 11.5px; color: #A0A0AC; border-top: 1px solid rgba(28,28,30,0.06); }

  /* Mobile sidebar */
  .nav-mobile-only { display: none; }
  .nav-mobile-toggle {
    display: none; background: rgba(28,28,30,0.045); border: none; cursor: pointer;
    width: 40px; height: 40px; border-radius: 12px; color: #14141A;
    align-items: center; justify-content: center; margin-left: 2px;
    transition: background 220ms var(--nav-ease), transform 200ms var(--nav-ease);
  }
  .nav-mobile-toggle:active { transform: scale(0.92); }
  .nav-mobile-toggle__icon { display: grid; place-items: center; }
  .nav-mobile-backdrop { 
    position: fixed; inset: 0; background: rgba(20,20,26,0.5); 
    backdrop-filter: blur(6px); z-index: 150; 
  }
  .nav-mobile-panel {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 151;
    width: min(85vw, 320px); display: flex; flex-direction: column;
    background: #FFFFFF;
    box-shadow: 8px 0 40px rgba(20,20,26,0.25);
    font-family: ui-sans-serif, -apple-system, "SF Pro Display", "Inter", system-ui, sans-serif;
  }
  .nav-mobile-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px 12px; flex-shrink: 0;
    border-bottom: 1px solid rgba(28,28,30,0.06);
    min-height: 56px;
  }
  .nav-mobile-close {
    width: 34px; height: 34px; border-radius: 999px; border: none; flex-shrink: 0;
    background: rgba(28,28,30,0.05); color: #6B6B76; display: grid; place-items: center; cursor: pointer;
    transition: background 180ms var(--nav-ease);
  }
  .nav-mobile-close:hover { background: rgba(28,28,30,0.1); }
  .nav-mobile-user { 
    display: flex; align-items: center; gap: 12px; 
    padding: 16px 18px; flex-shrink: 0;
    border-bottom: 1px solid rgba(28,28,30,0.06);
  }
  .nav-mobile-user__meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .nav-mobile-user__name { font-size: 15px; font-weight: 650; color: #14141A; letter-spacing: -0.02em; }
  .nav-mobile-user__institution { font-size: 12px; color: #A0A0AC; }
  .nav-mobile-scroll { 
    overflow-y: auto; overscroll-behavior: contain; 
    -webkit-overflow-scrolling: touch; padding: 0 10px; flex: 1;
  }
  .nav-mobile-nav { display: flex; flex-direction: column; gap: 2px; padding-top: 6px; }
  .nav-mobile-icon { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; flex-shrink: 0; }
  .nav-mobile-link, .nav-mobile-group__trigger {
    display: flex; align-items: center; gap: 12px; width: 100%;
    padding: 9px 10px; border-radius: 14px; min-height: 52px;
    font-size: 15px; font-weight: 550; letter-spacing: -0.015em;
    color: #14141A; text-decoration: none; background: transparent; border: none;
    cursor: pointer; font-family: inherit;
    transition: background 200ms var(--nav-ease), transform 180ms var(--nav-ease);
  }
  .nav-mobile-link:active, .nav-mobile-group__trigger:active { transform: scale(0.985); background: rgba(28,28,30,0.05); }
  .nav-mobile-link__arrow { margin-left: auto; color: #C4C4CE; }
  .nav-mobile-pill { margin-left: auto; font-size: 10.5px; font-weight: 700; color: #EA580C; background: rgba(234,88,12,0.1); padding: 3px 8px; border-radius: 20px; }
  .nav-mobile-group__chevron { margin-left: auto; display: inline-flex; color: #A0A0AC; }
  .nav-mobile-group__children { padding-left: 22px; overflow: hidden; }
  .nav-mobile-sublink {
    position: relative; display: flex; align-items: center; gap: 10px;
    padding: 11px 12px 11px 16px; border-radius: 12px; min-height: 44px;
    font-size: 13.5px; font-weight: 500; color: #6B6B76; text-decoration: none;
  }
  .nav-mobile-sublink__dot { position: absolute; left: 4px; width: 5px; height: 5px; border-radius: 999px; opacity: .45; }
  .nav-mobile-sublink.is-active .nav-mobile-sublink__dot { opacity: 1; }
  .nav-mobile-section { padding: 6px 0 10px; margin-top: 8px; border-top: 1px solid rgba(28,28,30,0.06); }
  .nav-mobile-section__label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #A0A0AC; padding: 12px 12px 6px; }
  
  /* Mobile footer */
  .nav-mobile-footer { 
    padding: 14px 16px; flex-shrink: 0;
    border-top: 1px solid rgba(28,28,30,0.06); 
    display: flex; flex-direction: column; gap: 10px; 
  }
  .nav-mobile-cta {
    display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 50px;
    border-radius: 14px; font-size: 14px; font-weight: 600; letter-spacing: -0.015em;
    color: #fff; text-decoration: none;
    background: linear-gradient(135deg, #0b69ff 0%, #7c3aed 100%);
    box-shadow: 0 8px 24px -8px rgba(11,105,255,0.5), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: transform 180ms var(--nav-ease), box-shadow 180ms var(--nav-ease);
  }
  .nav-mobile-cta:active { 
    transform: scale(0.97); 
    box-shadow: 0 4px 12px -4px rgba(11,105,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .nav-mobile-logout {
    display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 46px;
    border-radius: 14px; font-size: 14px; font-weight: 600; color: #DC2626;
    background: rgba(220,38,38,0.06); border: none; cursor: pointer; font-family: inherit;
    transition: background 180ms var(--nav-ease);
  }
  .nav-mobile-logout:active { background: rgba(220,38,38,0.12); }

  @media (max-width: 900px) {
    .nav-desktop { display: none; }
    .nav-mobile-toggle { display: inline-flex; }
    .nav-mobile-only { display: inline-flex; }
    .nav-user-info, .nav-action-btn--search, .nav-user-chevron { display: none; }
    .nav-user-trigger { padding: 4px; }
    .nav-header__inner, .nav-header--scrolled .nav-header__inner { height: 62px; }
    
    /* Ensure logo stays visible on mobile */
    .nav-logo {
      display: flex !important;
      flex-shrink: 0;
    }
    .nav-logo__image {
      height: 30px;
      max-width: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-header *, .nav-mobile-panel * { animation: none !important; transition-duration: 1ms !important; }
  }
`;

export default Navigation;
