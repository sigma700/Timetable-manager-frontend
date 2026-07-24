import useUiStore from "../../store/uiStore.js";
import {RoleBadge} from "../ui/Badge.jsx";
import clsx from "clsx";

const Topbar = ({user, onLogout}) => {
  const {isDark, toggleDark, sidebarCollapsed} = useUiStore();

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 z-30 h-16",
        "flex items-center justify-between px-6",
        "bg-[var(--color-surface)] border-b border-brand-border",
        "transition-all duration-200",
        sidebarCollapsed ? "left-16" : "left-64",
      )}
    >
      {/* Left — page context (empty, filled by page title via portal or prop) */}
      <div />

      {/* Right — actions */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-[var(--color-hover)] hover:text-[var(--color-text)] transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-brand-border" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text)] leading-none mb-1">
                {user.firstName} {user.lastName}
              </p>
              <RoleBadge role={user.accountType} />
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
          </div>
        )}

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs text-muted hover:text-danger transition-colors px-2 py-1 rounded hover:bg-danger/10"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
