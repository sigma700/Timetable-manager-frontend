import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import clsx from "clsx";
import useUiStore from "../../../store/uiStore.js";
/**
 * Shell — the outer dashboard layout wrapper.
 * Wraps every authenticated page with sidebar + topbar.
 *
 * @param {ReactNode} children  - Page content
 * @param {Object}    user      - Authenticated user object
 * @param {Function}  onLogout  - Logout handler
 */
const Shell = ({children, user, onLogout}) => {
  const {sidebarCollapsed} = useUiStore();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar user={user} />
      <Topbar user={user} onLogout={onLogout} />

      <main
        className={clsx(
          "pt-16 min-h-screen transition-all duration-200",
          sidebarCollapsed ? "pl-16" : "pl-64",
        )}
      >
        <div className="p-6 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Shell;
