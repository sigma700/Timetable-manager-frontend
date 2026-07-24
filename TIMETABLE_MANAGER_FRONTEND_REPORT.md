# TIMETABLE_MANAGER_FRONTEND_REPORT.md

## Executive summary
This repository is a Vite + React frontend for "Protiba / Timetable Manager" — an automated timetable generator. The app is already scaffolded with routing, pages for auth and timetable generation, a small component library (Flowbite + Tailwind), and Zustand-based state. The current codebase is close to a public marketing + functional frontend but lacks a structured design system, a typed API client, analytics/admin UI, and documented developer flows. This report gives a complete audit and a prescriptive implementation plan for a professional Analytics & Admin Dashboard (school-scoped and platform-scoped) that will integrate with the backend endpoints you provided.

---

1) Repository overview

### What this is
- A Vite + React single-page application for the Timetable Manager product (marketing pages, auth, timetable generation UI, and user pages). It targets browsers and uses TailwindCSS + Flowbite React for UI primitives.

### Stack
- **Language(s):** JavaScript (JSX) primarily. Some dev tooling entries reference TypeScript types/devDeps, but the codebase uses .jsx files.
- **Framework / runtime:** React (react 19.x) on Vite (vite 7.x).
- **Notable libraries (from package.json):**
  - react 19.1.0, react-dom 19.1.0
  - vite 7.1.7, @vitejs/plugin-react
  - tailwindcss 4.1.11, @tailwindcss/vite plugin
  - flowbite-react 0.11.9 (UI primitives)
  - zustand 5.0.6 (state management)
  - react-router-dom 7.6.3 (routing)
  - framer-motion / motion (animations)
  - react-feather / react-icons (icons)

### How it's organized
Top-level (annotated)

```
.gitignore
.vscode/                         editor configs
.flowbite-react/                 flowbite patch/config
package.json                     project manifest & deps
package-lock.json
vite.config.js                   vite + plugin definitions (tailwindcss, flowbite plugin)
index.html
public/                          static assets (served by Vite)
src/                             main application source
  App.jsx                         route declarations, layout, route guards
  main.jsx                        React entry
  index.css, App.css              global styles (tailwind + custom)
  assets/                         images and static assets
  pages/                          route pages (SignUp, Login, Home, MainPg, Generation, Timetables, etc.)
    components/                   shared UI components used by pages (footer, navigation, spinner, timetable, etc.)
  store/                          zustand stores (authStore.js, generativeStore.js, subsidiary.js)
README.md
```

### How it fits together
- main.jsx mounts the React app; App.jsx wires RouterProvider and defines routes using react-router-dom's createBrowserRouter.
- Route-level route wrappers handle public-only vs. protected pages using the Zustand auth store (authStore).
- Pages use Flowbite/Tailwind primitives and internal components (navigation, footer, timetable) for UI.
- State is centralized per-domain using Zustand stores under src/store (authStore.js, generativeStore.js).

### How to run it (shortest path)
- From a fresh clone:
```
npm install
npm run dev
# dev server proxied to backend at http://localhost:4000 (package.json "proxy")
```
Notes:
- package.json contains a "postinstall": "flowbite-react patch" step.
- Vite + Tailwind + Flowbite plugins are declared in vite.config.js.

### Try asking
- Where is the API client code? (I see zustand stores but no centralized axios/fetch wrapper in src/store/authStore.js — is there an existing API utility?)
- The README claims TypeScript is used; the repo contains JSX files — do you want full TypeScript migration?
- Are there environment variables (API base URL, feature flags) documented or expected to be added (e.g., .env.local)?

---

2) Design system audit

### What exists now (evidence + notes)
- Styling system: TailwindCSS (v4) with Flowbite React components. There are index.css and App.css files for custom CSS.
- UI primitives: Flowbite components + custom components in src/pages/components (navigation, footer, timetable, spinner, notification).
- No centralized design tokens file (colors, typography tokens) found in the repo.
- No Storybook or component catalog currently.
- No explicit dark-mode system discovered in the top-level files; Tailwind dark mode could be enabled but no theme tokens were found.

### Observed components & UI patterns
- Cards, tables, forms, buttons appear across pages (page source sizes indicate fully realized UI pages).
- Shared components found: spinner.jsx, footer.jsx, navigation.jsx, timetable.jsx, notification.jsx, animatedHamb.jsx, animatedText.jsx.
- Patterns: pages contain mixed layout + business logic (likely large pages that will benefit from refactor into smaller components).

### Design inconsistencies and gaps
- No design token source (colors, font stack, spacing scale) — current style uses Tailwind utility classes directly.
- No typography scale or systemized spacing tokens beyond Tailwind utility usage.
- No centralized color palette or accessible color checks (contrast).
- No documented component API, stories, or visual regressions tests.
- Type mismatch: package.json lists TypeScript dev dependencies while files are JS — either TypeScript migration needed or devDeps pruned.

### Recommendation summary (quick)
- Build a small design tokens file (tailwind.config.js + tokens JSON) and component library (atoms/molecules) in src/components/ui to ensure consistent usage and reusability across analytics/admin dashboard.
- Add Storybook for component previews and design QA.

---

3) Architecture recommendations

### Folder structure (recommended)
```
src/
  api/                          # axios instance, typed API helpers, hooks
    index.js                    # axios base instance (baseURL, interceptors)
    analytics.js                # wrapper functions for analytics endpoints
    admin.js                    # admin endpoints
  components/                   # reusable design system components (atoms/molecules)
    ui/                         # visual primitives: Button, Card, Table, Badge, Input, Modal
    layout/                     # Sidebar, Header, Footer
  pages/
    analytics/                   # Analytics dashboard pages
    admin/                       # School admin pages
    platform/                    # Super admin pages
    auth/                        # Login, Signup, Verify
  routes/                       # route definitions (grouped)
  hooks/                        # custom hooks (useAuth, usePagination)
  stores/                       # zustand stores (auth, ui, filters)
  services/                     # business logic / adapters
  styles/                       # tailwind config and design-tokens
  utils/                        # helpers (date, format, constants)
```

### State management
- Keep Zustand for lightweight UI state and session/auth state (good fit).
- Introduce React Query (TanStack Query) for server state (data fetching, cache, pagination, retries). React Query + Axios is strongly recommended — use React Query for analytics lists, activity feed, audit logs.
- Keep zustand for auth, UI toggles (sidebar collapsed), and ephemeral client-only state.

### API layer pattern
- Add a single axios instance (src/api/index.js) with:
  - baseURL from environment (VITE_API_BASE_URL)
  - interceptors for attaching auth tokens and refreshing tokens
  - centralized error handling
- Create small API wrapper functions per backend feature (analytics, admin, audit, core).
- Create React Query hooks (e.g., useAnalyticsOverview, useTeachersAnalytics) that use axios wrappers.

### Routing
- Continue with react-router-dom v7 (current dependency). Keep route groups and protect routes with a small auth wrapper component.
- Centralize route definitions in src/routes and lazy-load heavy pages via React.lazy & Suspense for code-splitting.

### Component hierarchy per dashboard
- Global layout: Shell -> Sidebar (collapsible) + Topbar (search, date-range, user menu) + Content area.
- Analytics pages: OverviewCardGrid, ChartsPanel, TablePanel, FiltersPanel.
- Admin pages: SchoolCard, UsersTable, TeachersTable, ActivityFeed, HealthCard.
- Audit viewer: AuditToolbar (filters), AuditTable (virtualized list), AuditDetailsDrawer.

### Chart library
- Recommendation: Recharts for quick integration and customizability OR Chart.js (via react-chartjs-2) for polished charts.
  - Recharts is simpler for React and fits dashboard needs (bar, pie, line, stacked).
  - For advanced visuals and interactions (brush, zoom), consider Apache ECharts (echarts-for-react) or Visx for custom visuals.
- For time-series small-multiples and high-performance visuals, use lightweight charting + memoization.

### Accessibility, performance, and testing
- Use aria roles on tables/forms. Add keyboard shortcuts (inspired by Linear) for navigation.
- Add react-virtualized or react-window for very long lists (audit logs, activity feed).
- Add unit tests for API wrappers and critical components. Introduce E2E testing (Cypress) for critical user flows.

---

4) Page and component plan (per dashboard section)

Below are proposed pages, routes, required components and data sources mapped to the backend endpoints you supplied.

### Common components across pages (reusable)
- Shell/Layout (Sidebar, Topbar, ContentContainer)
- MetricCard (title, value, trend)
- Table (sortable, paginated)
- FilterBar (date range, select, search)
- Loading / Empty / Error UIs
- DataTable with server-side pagination (React Query + virtualized)

### Analytics Dashboard
- Route: /analytics (or /home/analytics)
- Pages:
  - AnalyticsOverview (GET /api/analytics/overview)
    - Components: OverviewCards (totalTeachers, subjects, classes, timetables), TimetableHealthCard, RecentActivityWidget
    - Props/state: filters (date range, schoolId), query data
    - Loading: skeleton cards; Error: inline retry and message
  - TeacherWorkload (subpage or section) (GET /api/analytics/teachers)
    - Components: WorkloadTable, WorkloadChart (bar/stacked)
    - Props: pagination, sort, date-range
    - Loading/Error states: spinner, error banner
  - SubjectDistribution (GET /api/analytics/subjects)
    - Components: PieChart/BarChart, SubjectTable
    - State: selectedSubject, filters
    - Loading/Error: skeleton chart, retry
  - Health (GET /api/analytics/health)
    - Components: HealthScoreCard (score 0-100), IssuesList (category breakdown)
    - Props: dateRange, scope (school or class)
    - Loading/Error: placeholder score, message

### Activity Feed
- Route: /activity
- Pages:
  - ActivityFeed (GET /api/activity, GET /api/activity/recent, GET /api/activity/summary)
    - Components: EventList (infinite scroll or paginate), EventFilters (category, user), SummaryCards (counts)
    - Data source: /api/activity with server-side pagination and /api/activity/recent for dashboard widget
    - Loading/Error: skeleton list, toasts on failure

### School Admin Dashboard
- Route: /admin/school/:schoolId
- Pages:
  - SchoolOverview (GET /api/admin/school/overview)
    - Components: SchoolSnapshotCard, HealthCard
  - Users (GET /api/admin/school/users)
    - Components: UsersTable (invite button, role change)
  - Teachers (GET /api/admin/school/teachers)
    - Components: TeachersTable, TeacherWorkload (reuse analytics teacher component)
  - Activity (GET /api/admin/school/activity)
    - Components: ActivityFeed scoped to school
  - Health (GET /api/admin/school/health)
    - Components: Health indicators
  - Loading/Error states: per-panel; global error banner when overview fails.

### Super Admin (Platform Level)
- Route: /admin/platform
- Pages:
  - PlatformOverview (GET /api/admin/platform/overview)
    - Components: PlatformMetricsCards, PlatformHealthCard
  - SchoolsTable (GET /api/admin/platform/schools, GET /api/admin/platform/schools/:schoolId)
    - Server-side pagination, per-school quick metrics
  - Users (GET /api/admin/platform/users)
  - Activity (GET /api/admin/platform/activity)
  - Loading/Error: skeletons and toasts

### Audit Log Viewer (Super Admin Only)
- Route: /admin/audit
- Pages:
  - AuditList (GET /api/audit, GET /api/audit/recent)
    - Components: AuditToolbar (search, date range, action filter), AuditVirtualizedTable, AuditDetailsDrawer
    - Data shape: timestamp, userId, userName, action, category, ip, userAgent, payload
  - AuditUser (GET /api/audit/user/:userId)
  - AuditSchool (GET /api/audit/school/:schoolId)
  - Loading/Error: skeleton rows, fallback message

### Core Timetable Pages (existing)
- Routes exist (generation/timetables) — reuse for admin to preview timetables.
- Data sources: POST /api/gen-table, GET /api/getTable/:timetableId, PUT /api/updateTable/:timetableId, DELETE /api/delTable/:timetableId

### Auth pages
- Routes: /signUp, /logIn, /verify (repo currently has these)
- Data sources: POST /api/create-account, POST /api/login/:school, POST /api/verify, GET /api/check-Auth
- Protect admin routes by role check (admin vs school_admin vs teacher)

### Props & State examples (one archetype)
- Component: TeachersTable
  - Props: schoolId, page, pageSize, filters
  - State: selectedTeacher, sorting, selectedRows
  - Data: useQuery('teachers', () => api.getSchoolTeachers(schoolId, { page, pageSize, filters }))
  - UI states: loading skeleton for rows; error row with retry button; empty state with CTA to invite teachers.

---

5) Design specification (recommended)

### Color palette (recommended visual identity — premium & corporate)
- Primary: #0b69ff (blue-600) — primary action
- Primary (dark): #063b9e (blue-800)
- Accent: #7c3aed (violet-600) — accents and highlights
- Neutral-900 (bg dark): #0b1220
- Neutral-700: #1f2937
- Neutral-300 (muted text): #9aa4b2
- Surface / Card background: #0f1724 (dark) / #ffffff (light)
- Success: #10b981 (green-500)
- Warning: #f59e0b (amber-500)
- Danger: #ef4444 (red-500)
Notes: Tailwind's palette can be extended in tailwind.config.js. Ensure WCAG AA contrast for text and controls.

### Typography
- Primary font-stack: Inter, system UI stack. (Use Inter for professional crisp UI)
- Sizes (desktop):
  - Headline / H1: 28px / 700
  - H2: 20px / 600
  - H3: 16px / 600
  - Body: 14px / 400
  - Small: 12px / 400
- Line heights:
  - body: 1.4
  - headings: 1.2
Use a consistent scale (4px or 8px increments). Configure in tailwind.config.js under theme.fontSize and lineHeight.

### Spacing system
- 4px baseline grid
- Spacing scale (Tailwind-friendly): 0, 4, 8, 12, 16, 24, 32, 40, 48, 64 (map to spacing tokens: xs, sm, md, lg, xl, etc.)

### Components (specs)
- Card: surface with subtle shadow (shadow-sm), padding md, border-radius 8px, background from surface token
- MetricCard: title (uppercase small), value (large bold), delta indicator (chip)
- Table: compact rows, zebra optional, column-resizable, sortable header, sticky header, row height 48px
- Badges: small rounded with background per semantic color
- Chart container: card with header controls (time range, export), responsive aspect ratio
- Sidebar: width 260px desktop, collapsible to 72px, icons-only
- Topbar: height 64px, search input, date picker, user avatar with menu
- Responsive breakpoints: use Tailwind defaults or define: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px. Admin dashboard should have responsive collapse patterns for small screens (sidebar collapses to top drawer).

### Accessibility
- High-contrast text on metric cards
- Keyboard focus states on interactive elements (outline ring)
- Table rows navigable via keyboard; aria labels for filters and charts

### Design deliverables to produce before development
- Tailwind design tokens file (colors, fonts, spacing)
- Component library with docs (Storybook)
- Basic Figma / design kit or clear component specs in markdown

---

6) Implementation roadmap (phased)

### Phase 0 — Prep (1 week)
- Add tailwind.config.js and central design tokens (if missing)
- Create axios instance (src/api/index.js)
- Add environment variables document (.env.example)
- Add React Query (tanstack/react-query) and set up QueryClient provider
- Add Storybook (optional but recommended)

### Phase 1 — Shell & Auth (1–2 weeks)
- Build Shell: Sidebar, Topbar, Layout
- Hook up auth store (Zustand) with axios + React Query integration
- Add role-based route guard and global error handling
Complexity: Low → Medium

### Phase 2 — Core Admin & Timetable Integration (2–3 weeks)
- Implement School Admin overview and Users table
- Timetable preview and update flows (reuse existing pages)
- Pagination, server-side filters
Complexity: Medium

### Phase 3 — Analytics Dashboard & Charts (2–3 weeks)
- Implement Analytics Overview, Teacher workload, Subject distribution charts
- Implement Timetable Health scoring and issues breakdown UI
- Add chart interactions and export options
Complexity: Medium → High (charts + data transforms)

### Phase 4 — Activity Feed & Audit (2–3 weeks)
- Activity feed with filters, recent widget
- Audit Log Viewer with virtualized table, filtering by user/school, details drawer
Complexity: High (performance + large datasets)

### Phase 5 — Platform Admin & Polishing (1–2 weeks)
- Platform-level dashboards, schools list, mass actions
- Accessibility polish, responsive adjustments, tests
Complexity: Medium

### Reusable components
- MetricCard, Table, FilterBar, DateRangePicker, Modal, Badge, ChartWrapper, EmptyState, Pagination controls.

### Estimated effort (rough)
- Analytics Overview: Medium
- Teacher Workload: Medium
- Subject Distribution: Medium
- Audit Viewer: High
- Activity Feed: Medium
- School Admin CRUD (users/teachers): Medium

---

7) Gaps & Risks (must-fix before work starts)

### Immediate repo gaps
- No centralized API client — pages/stores likely call fetch/axios inline (create one).
- No React Query / server-state caching — add it before scaling analytics pages.
- No design tokens or component library — will cause inconsistent UI across dashboards.
- Type mismatch: package.json lists TypeScript dev dependencies while codebase is JavaScript (.jsx). Decide whether to convert to TypeScript (recommended for large dashboards) or remove TypeScript configs.
- No documentation for environment variables (VITE_API_BASE_URL, auth secrets).
- No storybook / visual regression or testing infra.
- Potentially large pages with mixed markup + logic — will need decomposition.

### Security & data risks
- Role-based access not enforced on frontend alone; ensure backend checks role for platform-level endpoints. Frontend must check roles to hide UI but not rely on it for enforcement.
- Audit logs and sensitive data must be paginated/virtualized to avoid client OOM.

### Performance risks
- Audit logs and activity feeds may be very large — must implement server-side pagination, React Query cursors, and virtualization in the UI.
- Charts rendering many series could be slow — memoize and use efficient libraries.

### Dependencies to install (recommended)
- axios
- @tanstack/react-query
- react-query-devtools (dev)
- recharts (or chart.js + react-chartjs-2)
- react-window / react-virtualized
- clsx
- date-fns (for date handling)
- react-use (optional utilities)
- cypress (E2E, optional)
- storybook (optional)

### Operational notes
- Use environment variables via Vite: VITE_API_BASE_URL, VITE_ENV
- Add feature flags for analytics (e.g., showAnalytics boolean) to allow staged rollout.

---

8) Implementation checklist & acceptance criteria

Before merging each feature, ensure:
- React Query hooks cover fetching + caching + error handling
- Axios instance handles auth token attach and refresh if required
- UI follows tokenized design system (colors, spacing, typography)
- All pages display loading skeletons and proper empty/error states
- Role-based visibility: UI elements hidden unless role present; sensitive endpoints show fallback messages when access denied.
- Audit viewer supports filters: action type, userId, schoolId, date range; results export (CSV) button.
- Chart interactions: time-range selector, export to PNG/CSV for data
- Unit tests for API wrappers and critical components; E2E happy-path for login -> generate timetable -> view analytics.

---

Appendix: Evidence & repo notes (where items were found)
- package.json (dependencies & scripts): package.json in repo root
- Vite config (plugins: tailwindcss, flowbite-react): vite.config.js
- Routing & route guards: src/App.jsx (createBrowserRouter, ProtectedRoute, PublicOnlyRoute)
- Pages folder and components structure: src/pages/* and src/pages/components/*
- Zustand stores directory: src/store/ (authStore.js, generativeStore.js, subsidiary.js)
- The README mentions React and TypeScript but repository code is JavaScript JSX (README.md vs package.json mismatch).

---

Actionable next steps (for developer implementing dashboard)
1. Add src/api/index.js (axios instance) and src/api/*.js wrappers for endpoints (analytics, admin, audit, core).
2. Install React Query and wrap the app in QueryClientProvider.
3. Create a minimal tailwind.config.js + design-tokens and a lightweight component library in src/components/ui with MetricCard, Table, and Modal.
4. Implement shell layout (sidebar/topbar) and wire auth (Zustand) so role checks are centralized.
5. Implement AnalyticsOverview page (GET /api/analytics/overview) and a small ChartPanel (Recharts) to visualize teacher workload and subject distribution.
6. Implement Audit viewer with virtualized table and server-side pagination.
7. Add tests and document env variables.

---

Contact / ownership
- This report was prepared as a complete specification and implementation roadmap for the Timetable Manager frontend analytics & admin dashboard. Use this document as the single source of truth when converting UI mocks into components and wiring API integrations.

End of report.
