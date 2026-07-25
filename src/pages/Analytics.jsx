import {useState, lazy, Suspense, useMemo, useCallback} from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {motion, AnimatePresence} from "framer-motion";

// Lucide icons – no emojis
import {
  Users,
  BookOpen,
  School,
  ClipboardList,
  Clock,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  TriangleAlert,
  CircleAlert,
  BarChart3,
  PieChartIcon,
  Activity,
  Sparkles,
  Database,
  GraduationCap,
  UserRoundCheck,
  AlertCircle,
  Inbox,
} from "lucide-react";

// hooks – unchanged
import {
  useAnalyticsOverview,
  useSubjectDistribution,
  useTeacherWorkload,
  useTimetableHealth,
} from "../hooks/useAnalytics";
import {useRecentActivity} from "../hooks/useActivity";

// ----------------------------------------------------------------------
// Design tokens – consistent spacing, shadows, radii
// ----------------------------------------------------------------------
const cardClasses =
  "bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200";

const motionContainer = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
    transition: {staggerChildren: 0.05, delayChildren: 0.1},
  },
};

const motionItem = {
  hidden: {opacity: 0, y: 12},
  show: {opacity: 1, y: 0, transition: {duration: 0.35, ease: "easeOut"}},
};

// ----------------------------------------------------------------------
// Chart colors – more refined palette
// ----------------------------------------------------------------------
const CHART_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#4f46e5",
  "#be185d",
];

// ----------------------------------------------------------------------
// Custom tooltip (premium)
// ----------------------------------------------------------------------
const ChartTooltip = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-lg p-3 text-xs">
      {label && (
        <p className="text-[var(--color-muted)] mb-1 font-medium">{label}</p>
      )}
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="font-semibold"
          style={{color: entry.color}}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// Section Header with Lucide icon
// ----------------------------------------------------------------------
const SectionHeader = ({title, subtitle, icon: Icon}) => (
  <motion.div variants={motionItem} className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      {Icon && (
        <div className="p-2 rounded-lg bg-[var(--color-border)]">
          <Icon
            className="w-5 h-5 text-[var(--color-text)]"
            strokeWidth={1.5}
          />
        </div>
      )}
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
        {title}
      </h2>
    </div>
    {subtitle && (
      <p className="text-sm text-[var(--color-muted)] ml-11">{subtitle}</p>
    )}
  </motion.div>
);

// ----------------------------------------------------------------------
// Premium Metric Card
// ----------------------------------------------------------------------
const MetricCard = ({label, value, icon: Icon, color, trend, description}) => {
  const colorMap = {
    primary: "bg-blue-50 text-blue-600",
    accent: "bg-purple-50 text-purple-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-red-50 text-red-600",
    neutral: "bg-gray-100 text-gray-600",
  };

  return (
    <motion.div
      variants={motionItem}
      whileHover={{y: -2, transition: {duration: 0.2}}}
      className={`${cardClasses} flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`p-2.5 rounded-xl ${colorMap[color] || colorMap.neutral}`}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              trend > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          {value}
        </p>
        {description && (
          <p className="text-xs text-[var(--color-muted)] mt-1">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Hero Health Score Ring (animated)
// ----------------------------------------------------------------------
const HealthScoreRing = ({data, loading}) => {
  const score = data?.healthScore ?? 0;
  const category = data?.category ?? "Unknown";
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  const categoryConfig = {
    Excellent: {color: "#059669", bg: "bg-emerald-50 text-emerald-700"},
    Good: {color: "#2563eb", bg: "bg-blue-50 text-blue-700"},
    Fair: {color: "#d97706", bg: "bg-amber-50 text-amber-700"},
    Poor: {color: "#dc2626", bg: "bg-red-50 text-red-700"},
  };

  const {color, bg} = categoryConfig[category] || categoryConfig.Fair;

  if (loading) {
    return (
      <div className={cardClasses}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-36 h-36 rounded-full bg-[var(--color-border)]" />
          <div className="h-4 w-24 rounded bg-[var(--color-border)]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={motionItem}
      className={`${cardClasses} flex flex-col items-center text-center`}
    >
      <div className="relative mb-4">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{strokeDashoffset: circumference}}
            animate={{strokeDashoffset: offset}}
            transition={{duration: 1.5, ease: "easeOut"}}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold tabular-nums text-[var(--color-text)]"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.5}}
          >
            {score}
          </motion.span>
          <span className="text-sm text-[var(--color-muted)]">/100</span>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${bg}`}>
        {category}
      </span>
      <p className="text-xs text-[var(--color-muted)] mt-2 max-w-[200px]">
        {score >= 80
          ? "Your timetable is well balanced."
          : score >= 60
            ? "Some areas need attention."
            : "Significant improvements needed."}
      </p>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Activity feed item
// ----------------------------------------------------------------------
const ActivityItem = ({activity}) => {
  const eventName = activity.event?.replace(/_/g, " ");
  const variantColors = {
    AUTH: "bg-blue-100 text-blue-600",
    INSTITUTION: "bg-purple-100 text-purple-600",
    TEACHER: "bg-indigo-100 text-indigo-600",
    SUBJECT: "bg-emerald-100 text-emerald-600",
    CLASS: "bg-amber-100 text-amber-600",
    TIMETABLE: "bg-gray-100 text-gray-600",
  };

  const badgeClass =
    variantColors[activity.eventCategory] || variantColors.TIMETABLE;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <motion.div
      variants={motionItem}
      className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-xl hover:bg-[var(--color-hover)] transition-colors"
    >
      <div className="relative flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow" />
        <div className="absolute left-1/2 top-full w-px h-5 bg-[var(--color-border)] -translate-x-1/2 hidden last:hidden" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text)] truncate">
          {eventName}
        </p>
        <p className="text-xs text-[var(--color-muted)] truncate">
          {activity.userId?.firstName} {activity.userId?.lastName}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`px-2 py-0.5 text-xs rounded-full ${badgeClass}`}>
          {activity.eventCategory}
        </span>
        <span className="text-xs text-[var(--color-muted)] tabular-nums w-10 text-right">
          {timeAgo(activity.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Responsive table that becomes stacked cards on mobile
// ----------------------------------------------------------------------
const ResponsiveTable = ({
  columns,
  data,
  loading,
  emptyTitle,
  emptyMessage,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-4 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
          >
            <div className="h-10 w-10 rounded-full bg-[var(--color-border)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-[var(--color-border)]" />
              <div className="h-3 w-1/4 rounded bg-[var(--color-border)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div variants={motionItem} className={cardClasses}>
        <div className="flex flex-col items-center text-center py-8">
          <div className="p-4 rounded-full bg-[var(--color-border)] mb-4">
            <Inbox className="w-8 h-8 text-[var(--color-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
            {emptyTitle}
          </h3>
          <p className="text-sm text-[var(--color-muted)] max-w-md">
            {emptyMessage}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={motionItem}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-[var(--color-hover)] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-[var(--color-text)]"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, i) => (
          <motion.div
            key={i}
            variants={motionItem}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-sm text-[var(--color-text)] font-medium">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Lazy-loaded chart wrappers with motion
// ----------------------------------------------------------------------
const MotionBarChart = motion(
  lazy(() =>
    Promise.resolve({
      default: ({data, dataKey, name, color, layout, height}) => (
        <ResponsiveContainer width="100%" height={height || 280}>
          <BarChart
            data={data}
            layout={layout}
            margin={{
              top: 5,
              right: 20,
              left: layout === "vertical" ? 0 : -15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={layout !== "vertical"}
              horizontal={layout === "vertical"}
            />
            {layout === "vertical" ? (
              <>
                <XAxis
                  type="number"
                  tick={{fontSize: 11, fill: "var(--color-muted)"}}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="teacherName"
                  type="category"
                  tick={{fontSize: 11, fill: "var(--color-muted)"}}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="subjectName"
                  tick={{fontSize: 11, fill: "var(--color-muted)"}}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{fontSize: 11, fill: "var(--color-muted)"}}
                  tickLine={false}
                  axisLine={false}
                />
              </>
            )}
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey={dataKey}
              name={name}
              fill={color}
              radius={layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              maxBarSize={layout === "vertical" ? 24 : 40}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    }),
  ),
);

const MotionPieChart = motion(
  lazy(() =>
    Promise.resolve({
      default: ({data, dataKey, nameKey}) => (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-[var(--color-muted)]">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    }),
  ),
);

// ----------------------------------------------------------------------
// Main Analytics Page
// ----------------------------------------------------------------------
const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // unchanged hooks
  const {data: overview, isLoading: overviewLoading} = useAnalyticsOverview();
  const {data: teacherData, isLoading: teacherLoading} = useTeacherWorkload();
  const {data: subjectData, isLoading: subjectLoading} =
    useSubjectDistribution();
  const {data: healthData, isLoading: healthLoading} = useTimetableHealth();
  const {data: recentActivity, isLoading: activityLoading} =
    useRecentActivity(8);

  const tabs = useMemo(
    () => [
      {id: "overview", label: "Overview", icon: BarChart3},
      {id: "teachers", label: "Teachers", icon: GraduationCap},
      {id: "subjects", label: "Subjects", icon: BookOpen},
      {id: "health", label: "Health", icon: ShieldCheck},
    ],
    [],
  );

  const tabContent = useMemo(() => {
    return {
      overview: (
        <motion.div
          key="overview"
          initial={{opacity: 0, y: 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          transition={{duration: 0.2}}
          className="space-y-8"
        >
          {/* Metric Cards */}
          {overviewLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-32 rounded-2xl bg-[var(--color-border)]"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <MetricCard
                label="Total Teachers"
                value={overview?.totalTeachers ?? "—"}
                icon={Users}
                color="primary"
                description="Active educators"
              />
              <MetricCard
                label="Total Subjects"
                value={overview?.totalSubjects ?? "—"}
                icon={BookOpen}
                color="accent"
              />
              <MetricCard
                label="Total Classes"
                value={overview?.totalClasses ?? "—"}
                icon={School}
                color="success"
              />
              <MetricCard
                label="Total Timetables"
                value={overview?.totalTimetables ?? "—"}
                icon={ClipboardList}
                color="warning"
              />
            </motion.div>
          )}

          {/* Health + Activity row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <HealthScoreRing data={healthData} loading={healthLoading} />

            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-2"
            >
              <div className={cardClasses}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-border)]">
                      <Activity className="w-5 h-5 text-[var(--color-text)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        Recent Activity
                      </h3>
                      <p className="text-xs text-[var(--color-muted)]">
                        Latest platform events
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">
                    Last 8 events
                  </span>
                </div>

                {activityLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 animate-pulse"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-[var(--color-border)]" />
                          <div className="h-3 w-1/2 rounded bg-[var(--color-border)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !recentActivity || recentActivity.length === 0 ? (
                  <motion.div
                    variants={motionItem}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="p-3 rounded-full bg-[var(--color-border)] mb-3">
                      <Inbox className="w-6 h-6 text-[var(--color-muted)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      No recent activity
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      Events will appear here as your institution uses the
                      platform.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-1">
                    {recentActivity.map((activity, i) => (
                      <ActivityItem
                        key={activity._id || i}
                        activity={activity}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Subject Allocation Chart */}
          {!subjectLoading && subjectData?.subjects?.length > 0 && (
            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
            >
              <div className={cardClasses}>
                <SectionHeader
                  title="Subject Allocation"
                  subtitle="Periods assigned per subject"
                  icon={BarChart3}
                />
                <Suspense
                  fallback={
                    <div className="h-64 animate-pulse rounded-xl bg-[var(--color-border)]" />
                  }
                >
                  <MotionBarChart
                    variants={motionItem}
                    data={subjectData.subjects.slice(0, 10)}
                    dataKey="periodsAssigned"
                    name="Periods"
                    color={CHART_COLORS[0]}
                    height={260}
                  />
                </Suspense>
              </div>
            </motion.div>
          )}
        </motion.div>
      ),

      teachers: (
        <motion.div
          key="teachers"
          initial={{opacity: 0, y: 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          className="space-y-8"
        >
          {!teacherLoading && teacherData && (
            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              <MetricCard
                label="Total Teachers"
                value={teacherData.totalTeachers}
                icon={Users}
                color="primary"
              />
              <MetricCard
                label="Periods Per Day"
                value={teacherData.periodsPerDay}
                icon={Clock}
                color="accent"
                description="Daily workload target"
              />
              <MetricCard
                label="Max Weekly Periods"
                value={teacherData.maxPeriodsPerWeek}
                icon={CalendarDays}
                color="success"
              />
            </motion.div>
          )}

          {!teacherLoading && teacherData?.teachers?.length > 0 && (
            <motion.div variants={motionItem}>
              <div className={cardClasses}>
                <SectionHeader
                  title="Teacher Utilization"
                  subtitle="Weekly period load per teacher"
                  icon={BarChart3}
                />
                <Suspense
                  fallback={
                    <div className="h-64 animate-pulse rounded-xl bg-[var(--color-border)]" />
                  }
                >
                  <MotionBarChart
                    data={teacherData.teachers}
                    dataKey="weeklyLoad"
                    name="Weekly Periods"
                    color="#2563eb"
                    layout="vertical"
                    height={300}
                  />
                </Suspense>
              </div>
            </motion.div>
          )}

          <div>
            <SectionHeader
              title="Workload Breakdown"
              subtitle="Detailed period assignments per teacher"
              icon={ClipboardList}
            />
            <ResponsiveTable
              columns={[
                {key: "teacherName", label: "Teacher"},
                {
                  key: "weeklyLoad",
                  label: "Weekly Load",
                  render: (val) => (
                    <span className="tabular-nums font-medium">{val}</span>
                  ),
                },
                {
                  key: "dailyLoad",
                  label: "Daily Avg",
                  render: (val) => (
                    <span className="text-[var(--color-muted)]">{val}</span>
                  ),
                },
                {
                  key: "utilizationPercent",
                  label: "Utilization",
                  render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(val, 100)}%`,
                            background:
                              val > 80
                                ? "#ef4444"
                                : val > 60
                                  ? "#f59e0b"
                                  : "#10b981",
                          }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{val}%</span>
                    </div>
                  ),
                },
                {
                  key: "subjectCount",
                  label: "Subjects",
                  render: (val) => (
                    <span className="text-[var(--color-muted)]">{val}</span>
                  ),
                },
                {
                  key: "classCount",
                  label: "Classes",
                  render: (val) => (
                    <span className="text-[var(--color-muted)]">{val}</span>
                  ),
                },
              ]}
              data={teacherData?.teachers ?? []}
              loading={teacherLoading}
              emptyTitle="No teachers found"
              emptyMessage="Add teachers to your school to see workload analytics."
            />
          </div>
        </motion.div>
      ),

      subjects: (
        <motion.div
          key="subjects"
          initial={{opacity: 0, y: 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          className="space-y-8"
        >
          {!subjectLoading && subjectData && (
            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              <MetricCard
                label="Total Subjects"
                value={subjectData.totalSubjects}
                icon={BookOpen}
                color="primary"
              />
              <MetricCard
                label="Total Periods"
                value={subjectData.totalPeriods}
                icon={Database}
                color="accent"
              />
              <MetricCard
                label="Avg Periods / Subject"
                value={
                  subjectData.totalSubjects > 0
                    ? Math.round(
                        subjectData.totalPeriods / subjectData.totalSubjects,
                      )
                    : "—"
                }
                icon={Sparkles}
                color="success"
              />
            </motion.div>
          )}

          {!subjectLoading && subjectData?.subjects?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <motion.div variants={motionItem}>
                <div className={cardClasses}>
                  <SectionHeader
                    title="Subject Distribution"
                    subtitle="Proportional period allocation"
                    icon={PieChartIcon}
                  />
                  <Suspense
                    fallback={
                      <div className="h-64 animate-pulse rounded-xl bg-[var(--color-border)]" />
                    }
                  >
                    <MotionPieChart
                      data={subjectData.subjects}
                      dataKey="periodsAssigned"
                      nameKey="subjectName"
                    />
                  </Suspense>
                </div>
              </motion.div>
              <motion.div variants={motionItem}>
                <div className={cardClasses}>
                  <SectionHeader
                    title="Periods Per Subject"
                    subtitle="Total assigned periods"
                    icon={BarChart3}
                  />
                  <Suspense
                    fallback={
                      <div className="h-64 animate-pulse rounded-xl bg-[var(--color-border)]" />
                    }
                  >
                    <MotionBarChart
                      data={subjectData.subjects}
                      dataKey="periodsAssigned"
                      name="Periods"
                      color={CHART_COLORS[2]}
                      height={280}
                    >
                      {subjectData.subjects.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </MotionBarChart>
                  </Suspense>
                </div>
              </motion.div>
            </div>
          )}

          <div>
            <SectionHeader
              title="Subject Breakdown"
              subtitle="Detailed allocation per subject"
              icon={BookOpen}
            />
            <ResponsiveTable
              columns={[
                {key: "subjectName", label: "Subject"},
                {
                  key: "periodsAssigned",
                  label: "Periods",
                  render: (val) => <span className="font-medium">{val}</span>,
                },
                {
                  key: "allocationPercent",
                  label: "Allocation",
                  render: (val) => (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{width: `${Math.min(val, 100)}%`}}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{val}%</span>
                    </div>
                  ),
                },
                {
                  key: "classCount",
                  label: "Classes",
                  render: (val) => (
                    <span className="text-[var(--color-muted)]">{val}</span>
                  ),
                },
                {
                  key: "dailyAverage",
                  label: "Daily Avg",
                  render: (val) => (
                    <span className="text-[var(--color-muted)]">{val}</span>
                  ),
                },
              ]}
              data={subjectData?.subjects ?? []}
              loading={subjectLoading}
              emptyTitle="No subjects found"
              emptyMessage="Add subjects to your school to see distribution analytics."
            />
          </div>
        </motion.div>
      ),

      health: (
        <motion.div
          key="health"
          initial={{opacity: 0, y: 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -8}}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <HealthScoreRing data={healthData} loading={healthLoading} />

            {!healthLoading && healthData && (
              <motion.div
                variants={motionContainer}
                initial="hidden"
                animate="show"
                className="lg:col-span-2"
              >
                <div className={cardClasses}>
                  <SectionHeader
                    title="Score Breakdown"
                    subtitle="How the health score is calculated"
                    icon={AlertCircle}
                  />

                  <div className="space-y-5">
                    {[
                      {
                        label: "Warning Penalty",
                        value: healthData.breakdown?.warningPenalty ?? 0,
                        max: 40,
                        color: "#f59e0b",
                        description:
                          "Periods where generator had to compromise",
                      },
                      {
                        label: "Empty Slot Penalty",
                        value: healthData.breakdown?.emptySlotPenalty ?? 0,
                        max: 30,
                        color: "#ef4444",
                        description: "Periods with no subject assigned",
                      },
                      {
                        label: "No Teacher Penalty",
                        value: healthData.breakdown?.noTeacherPenalty ?? 0,
                        max: 20,
                        color: "#f59e0b",
                        description: "Periods with subject but no teacher",
                      },
                      {
                        label: "Coverage Gap Penalty",
                        value: healthData.breakdown?.coverageGapPenalty ?? 0,
                        max: 10,
                        color: "#3b82f6",
                        description: "Classes with entire days unscheduled",
                      },
                    ].map((item) => (
                      <motion.div key={item.label} variants={motionItem}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-sm font-medium text-[var(--color-text)]">
                              {item.label}
                            </span>
                            <p className="text-xs text-[var(--color-muted)]">
                              {item.description}
                            </p>
                          </div>
                          <span
                            className="text-sm font-bold tabular-nums"
                            style={{
                              color: item.value > 0 ? item.color : "#10b981",
                            }}
                          >
                            -{item.value}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{width: 0}}
                            animate={{
                              width: `${(item.value / item.max) * 100}%`,
                            }}
                            transition={{duration: 0.8, ease: "easeOut"}}
                            style={{background: item.color}}
                          />
                        </div>
                        <p className="text-xs text-[var(--color-muted)] mt-0.5">
                          Max penalty: {item.max} points
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      Final Health Score
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          healthData.category === "Excellent"
                            ? "bg-emerald-50 text-emerald-700"
                            : healthData.category === "Good"
                              ? "bg-blue-50 text-blue-700"
                              : healthData.category === "Fair"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                        }`}
                      >
                        {healthData.category}
                      </span>
                      <span className="text-2xl font-bold tabular-nums text-[var(--color-text)]">
                        {healthData.healthScore}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {!healthLoading && healthData && (
            <motion.div
              variants={motionContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-5"
            >
              {[
                {
                  label: "Warnings",
                  value: healthData.issues?.warnings ?? 0,
                  color: "warning",
                  icon: TriangleAlert,
                },
                {
                  label: "Empty Slots",
                  value: healthData.issues?.emptySlots ?? 0,
                  color: "danger",
                  icon: CircleAlert,
                },
                {
                  label: "No Teacher",
                  value: healthData.issues?.unassignedTeachers ?? 0,
                  color: "warning",
                  icon: UserRoundCheck,
                },
                {
                  label: "Coverage Gaps",
                  value: healthData.issues?.coverageGaps ?? 0,
                  color: "danger",
                  icon: Inbox,
                },
              ].map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  color={item.value === 0 ? "success" : item.color}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      ),
    };
  }, [
    overview,
    overviewLoading,
    teacherData,
    teacherLoading,
    subjectData,
    subjectLoading,
    healthData,
    healthLoading,
    recentActivity,
    activityLoading,
  ]);

  return (
    <div className="pb-16">
      {/* Page header */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, ease: "easeOut"}}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Analytics
        </h1>
        <p className="mt-1.5 text-base text-[var(--color-muted)]">
          Institution performance and timetable insights
        </p>
      </motion.div>

      {/* Tabs with animated underline */}
      <div className="flex gap-0 border-b border-[var(--color-border)] mb-8 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-lg ${
              activeTab === tab.id
                ? "text-primary"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{type: "spring", stiffness: 500, damping: 30}}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">{tabContent[activeTab]}</AnimatePresence>
    </div>
  );
};

export default Analytics;
