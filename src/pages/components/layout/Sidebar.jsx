import {NavLink} from "react-router-dom";
import clsx from "clsx";
import useUiStore from "../../../store/uiStore";
// import useUiStore from "../../store/uiStore.js";

// ─────────────────────────────────────────────
// NAV ITEMS PER ROLE
// ─────────────────────────────────────────────
const navItems = {
  admin: [
    {label: "Platform Overview", path: "/admin/platform", icon: "🌐"},
    {label: "Schools", path: "/admin/platform/schools", icon: "🏫"},
    {label: "Users", path: "/admin/platform/users", icon: "👥"},
    {label: "Platform Activity", path: "/admin/platform/activity", icon: "📡"},
    {label: "System Health", path: "/admin/platform/health", icon: "💚"},
    {label: "─", path: null, divider: true},
    {label: "Analytics", path: "/analytics", icon: "📊"},
    {label: "Teacher Workload", path: "/analytics/teachers", icon: "👨‍🏫"},
    {label: "Subject Distribution", path: "/analytics/subjects", icon: "📚"},
    {label: "Timetable Health", path: "/analytics/health", icon: "🩺"},
    {label: "─", path: null, divider: true},
    {label: "Activity Feed", path: "/activity", icon: "🔔"},
    {label: "Audit Logs", path: "/audit", icon: "🔐"},
  ],
  school_admin: [
    {label: "School Overview", path: "/admin/school", icon: "🏫"},
    {label: "Users", path: "/admin/school/users", icon: "👥"},
    {label: "Teachers", path: "/admin/school/teachers", icon: "👨‍🏫"},
    {label: "Activity", path: "/admin/school/activity", icon: "🔔"},
    {label: "Health", path: "/admin/school/health", icon: "💚"},
    {label: "─", path: null, divider: true},
    {label: "Analytics", path: "/analytics", icon: "📊"},
    {label: "Teacher Workload", path: "/analytics/teachers", icon: "👨‍🏫"},
    {label: "Subject Distribution", path: "/analytics/subjects", icon: "📚"},
  ],
  teacher: [{label: "Analytics", path: "/analytics", icon: "📊"}],
};

const Sidebar = ({user}) => {
  const {sidebarCollapsed, toggleSidebar} = useUiStore();
  const role = user?.accountType || "teacher";
  const items = navItems[role] || navItems.teacher;

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full z-40 flex flex-col",
        "bg-[var(--color-surface)] border-r border-brand-border",
        "transition-all duration-200 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-brand-border shrink-0">
        <span className="text-primary font-bold text-lg">
          {sidebarCollapsed ? "TM" : "Timetable Manager"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {items.map((item, i) => {
          if (item.divider) {
            return (
              <div key={i} className="my-2 border-t border-brand-border" />
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({isActive}) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-100",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted hover:bg-[var(--color-hover)] hover:text-[var(--color-text)]",
                )
              }
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-brand-border shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted hover:bg-[var(--color-hover)] hover:text-[var(--color-text)] transition-colors"
        >
          <span>{sidebarCollapsed ? "→" : "←"}</span>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
