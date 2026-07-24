import {useState} from "react";
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

// import {useRecentActivity} from "../../hooks/useActivity.js";
// import MetricCard from "../../components/ui/MetricCard.jsx";
// import HealthScoreCard from "../../components/ui/HealthScoreCard.jsx";
// import Table from "../../components/ui/Table.jsx";
// import Badge, {HealthBadge} from "../../components/ui/Badge.jsx";
// import {MetricGridSkeleton} from "../../components/ui/Skeleton.jsx";
// import EmptyState from "../../components/ui/EmptyState.jsx";
import {
  useAnalyticsOverview,
  useSubjectDistribution,
  useTeacherWorkload,
  useTimetableHealth,
} from "../hooks/useAnalytics.js";
import {useRecentActivity} from "../hooks/useActivity.js";
import MetricCard from "./components/ui/metricCard.jsx";
import HealthScoreCard from "./components/ui/HealthScoreCard.jsx";
import Table from "./components/ui/Table.jsx";
import Badge, {HealthBadge} from "./components/ui/Badge.jsx";
import {MetricGridSkeleton} from "./components/ui/Skeleton.jsx";
import EmptyState from "./components/ui/EmptyState.jsx";

// ─────────────────────────────────────────────
// CHART COLORS
// ─────────────────────────────────────────────
const CHART_COLORS = [
  "#0b69ff",
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
];

// ─────────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────────
const ChartTooltip = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      {label && (
        <p style={{color: "var(--color-muted)", marginBottom: 6}}>{label}</p>
      )}
      {payload.map((entry) => (
        <p key={entry.name} style={{color: entry.color, fontWeight: 600}}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────
const SectionHeader = ({title, subtitle}) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold text-[var(--color-text)]">
      {title}
    </h2>
    {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
  </div>
);

// ─────────────────────────────────────────────
// ACTIVITY EVENT BADGE
// ─────────────────────────────────────────────
const eventVariant = (category) => {
  const map = {
    AUTH: "info",
    INSTITUTION: "accent",
    TEACHER: "primary",
    SUBJECT: "success",
    CLASS: "warning",
    TIMETABLE: "neutral",
  };
  return map[category] ?? "neutral";
};

const formatTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─────────────────────────────────────────────
// TEACHER WORKLOAD TABLE COLUMNS
// ─────────────────────────────────────────────
const teacherColumns = [
  {key: "teacherName", label: "Teacher"},
  {
    key: "weeklyLoad",
    label: "Weekly Periods",
    render: (val) => (
      <span className="tabular-nums font-medium text-[var(--color-text)]">
        {val}
      </span>
    ),
  },
  {
    key: "dailyLoad",
    label: "Daily Avg",
    render: (val) => <span className="tabular-nums text-muted">{val}</span>,
  },
  {
    key: "utilizationPercent",
    label: "Utilization",
    render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 rounded-full bg-brand-border overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(val, 100)}%`,
              background:
                val > 80 ? "#ef4444" : val > 60 ? "#f59e0b" : "#10b981",
            }}
          />
        </div>
        <span className="text-xs tabular-nums text-muted">{val}%</span>
      </div>
    ),
  },
  {
    key: "subjectCount",
    label: "Subjects",
    render: (val) => <span className="text-muted tabular-nums">{val}</span>,
  },
  {
    key: "classCount",
    label: "Classes",
    render: (val) => <span className="text-muted tabular-nums">{val}</span>,
  },
];

// ─────────────────────────────────────────────
// SUBJECT TABLE COLUMNS
// ─────────────────────────────────────────────
const subjectColumns = [
  {key: "subjectName", label: "Subject"},
  {
    key: "periodsAssigned",
    label: "Periods",
    render: (val) => (
      <span className="tabular-nums font-medium text-[var(--color-text)]">
        {val}
      </span>
    ),
  },
  {
    key: "allocationPercent",
    label: "Allocation",
    render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 rounded-full bg-brand-border overflow-hidden">
          <div
            className="h-full rounded-full bg-primary"
            style={{width: `${Math.min(val, 100)}%`}}
          />
        </div>
        <span className="text-xs tabular-nums text-muted">{val}%</span>
      </div>
    ),
  },
  {
    key: "classCount",
    label: "Classes",
    render: (val) => <span className="text-muted tabular-nums">{val}</span>,
  },
  {
    key: "dailyAverage",
    label: "Daily Avg",
    render: (val) => <span className="text-muted tabular-nums">{val}</span>,
  },
];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const {data: overview, isLoading: overviewLoading} = useAnalyticsOverview();
  const {data: teacherData, isLoading: teacherLoading} = useTeacherWorkload();
  const {data: subjectData, isLoading: subjectLoading} =
    useSubjectDistribution();
  const {data: healthData, isLoading: healthLoading} = useTimetableHealth();
  const {data: recentActivity, isLoading: activityLoading} =
    useRecentActivity(8);

  const tabs = [
    {id: "overview", label: "Overview"},
    {id: "teachers", label: "Teachers"},
    {id: "subjects", label: "Subjects"},
    {id: "health", label: "Health"},
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Analytics
        </h1>
        <p className="text-sm text-muted mt-1">
          Institution performance and timetable insights
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-[var(--color-text)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Metric cards */}
          {overviewLoading ? (
            <MetricGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Teachers"
                value={overview?.totalTeachers ?? "—"}
                icon="👨‍🏫"
                color="primary"
              />
              <MetricCard
                label="Total Subjects"
                value={overview?.totalSubjects ?? "—"}
                icon="📚"
                color="accent"
              />
              <MetricCard
                label="Total Classes"
                value={overview?.totalClasses ?? "—"}
                icon="🏫"
                color="success"
              />
              <MetricCard
                label="Total Timetables"
                value={overview?.totalTimetables ?? "—"}
                icon="📋"
                color="warning"
              />
            </div>
          )}

          {/* Health + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Health score */}
            <HealthScoreCard data={healthData} loading={healthLoading} />

            {/* Recent activity */}
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Recent Activity
                </h3>
                <span className="text-xs text-muted">Last 8 events</span>
              </div>

              {activityLoading && (
                <div className="space-y-3">
                  {Array.from({length: 5}).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-pulse"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-border shrink-0" />
                      <div className="h-3 flex-1 rounded bg-brand-border" />
                      <div className="h-3 w-16 rounded bg-brand-border" />
                    </div>
                  ))}
                </div>
              )}

              {!activityLoading &&
                (!recentActivity || recentActivity.length === 0) && (
                  <EmptyState
                    title="No activity yet"
                    message="Events will appear here as your institution uses the platform."
                    icon="🔔"
                  />
                )}

              {!activityLoading && recentActivity?.length > 0 && (
                <div className="space-y-2">
                  {recentActivity.map((activity, i) => (
                    <div
                      key={activity._id || i}
                      className="flex items-center justify-between py-2 border-b border-brand-border last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[var(--color-text)] truncate">
                            {activity.event?.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {activity.userId?.firstName}{" "}
                            {activity.userId?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge
                          label={activity.eventCategory}
                          variant={eventVariant(activity.eventCategory)}
                          size="sm"
                        />
                        <span className="text-xs text-muted whitespace-nowrap">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject allocation chart */}
          {!subjectLoading && subjectData?.subjects?.length > 0 && (
            <div className="card">
              <SectionHeader
                title="Subject Allocation"
                subtitle="Periods assigned per subject across all classes"
              />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={subjectData.subjects.slice(0, 10)}
                  margin={{top: 4, right: 8, left: -20, bottom: 0}}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
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
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="periodsAssigned"
                    name="Periods"
                    fill="#0b69ff"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── TEACHERS TAB ── */}
      {activeTab === "teachers" && (
        <div className="space-y-6">
          {/* Summary cards */}
          {!teacherLoading && teacherData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total Teachers"
                value={teacherData.totalTeachers}
                icon="👨‍🏫"
                color="primary"
              />
              <MetricCard
                label="Periods Per Day"
                value={teacherData.periodsPerDay}
                icon="📅"
                color="accent"
              />
              <MetricCard
                label="Max Weekly Periods"
                value={teacherData.maxPeriodsPerWeek}
                icon="📊"
                color="success"
              />
            </div>
          )}

          {/* Utilization bar chart */}
          {!teacherLoading && teacherData?.teachers?.length > 0 && (
            <div className="card">
              <SectionHeader
                title="Teacher Utilization"
                subtitle="Weekly period load per teacher"
              />
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={teacherData.teachers}
                  margin={{top: 4, right: 8, left: -20, bottom: 0}}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    horizontal={false}
                  />
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
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="weeklyLoad"
                    name="Weekly Periods"
                    fill="#0b69ff"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Teacher workload table */}
          <div>
            <SectionHeader
              title="Workload Breakdown"
              subtitle="Detailed period assignments per teacher"
            />
            <Table
              columns={teacherColumns}
              data={teacherData?.teachers ?? []}
              loading={teacherLoading}
              emptyTitle="No teachers found"
              emptyMessage="Add teachers to your school to see workload analytics."
            />
          </div>
        </div>
      )}

      {/* ── SUBJECTS TAB ── */}
      {activeTab === "subjects" && (
        <div className="space-y-6">
          {/* Summary cards */}
          {!subjectLoading && subjectData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total Subjects"
                value={subjectData.totalSubjects}
                icon="📚"
                color="primary"
              />
              <MetricCard
                label="Total Periods"
                value={subjectData.totalPeriods}
                icon="🕐"
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
                icon="📊"
                color="success"
              />
            </div>
          )}

          {/* Pie chart */}
          {!subjectLoading && subjectData?.subjects?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card">
                <SectionHeader
                  title="Subject Distribution"
                  subtitle="Proportional period allocation"
                />
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={subjectData.subjects}
                      dataKey="periodsAssigned"
                      nameKey="subjectName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={2}
                    >
                      {subjectData.subjects.map((_, index) => (
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
                        <span
                          style={{fontSize: 11, color: "var(--color-muted)"}}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart */}
              <div className="card">
                <SectionHeader
                  title="Periods Per Subject"
                  subtitle="Total assigned periods"
                />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={subjectData.subjects}
                    margin={{top: 4, right: 8, left: -20, bottom: 0}}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="subjectName"
                      tick={{fontSize: 10, fill: "var(--color-muted)"}}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{fontSize: 11, fill: "var(--color-muted)"}}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="periodsAssigned"
                      name="Periods"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    >
                      {subjectData.subjects.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Subject table */}
          <div>
            <SectionHeader
              title="Subject Breakdown"
              subtitle="Detailed allocation per subject"
            />
            <Table
              columns={subjectColumns}
              data={subjectData?.subjects ?? []}
              loading={subjectLoading}
              emptyTitle="No subjects found"
              emptyMessage="Add subjects to your school to see distribution analytics."
            />
          </div>
        </div>
      )}

      {/* ── HEALTH TAB ── */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Score card */}
            <HealthScoreCard data={healthData} loading={healthLoading} />

            {/* Penalty breakdown */}
            {!healthLoading && healthData && (
              <div className="lg:col-span-2 card">
                <SectionHeader
                  title="Score Breakdown"
                  subtitle="How the health score is calculated"
                />

                {/* Penalty bars */}
                <div className="space-y-4">
                  {[
                    {
                      label: "Warning Penalty",
                      value: healthData.breakdown?.warningPenalty ?? 0,
                      max: 40,
                      color: "#f59e0b",
                      description: "Periods where generator had to compromise",
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
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-xs font-medium text-[var(--color-text)]">
                            {item.label}
                          </span>
                          <p className="text-xs text-muted">
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
                      <div className="w-full h-2 rounded-full bg-brand-border overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(item.value / item.max) * 100}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Max penalty: {item.max} points
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final score */}
                <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Final Health Score
                  </span>
                  <div className="flex items-center gap-3">
                    <HealthBadge category={healthData.category} />
                    <span className="text-2xl font-bold tabular-nums text-[var(--color-text)]">
                      {healthData.healthScore}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Issues summary */}
          {!healthLoading && healthData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Warnings",
                  value: healthData.issues?.warnings ?? 0,
                  color: "warning",
                  icon: "⚠️",
                },
                {
                  label: "Empty Slots",
                  value: healthData.issues?.emptySlots ?? 0,
                  color: "danger",
                  icon: "🕳️",
                },
                {
                  label: "No Teacher",
                  value: healthData.issues?.unassignedTeachers ?? 0,
                  color: "warning",
                  icon: "👤",
                },
                {
                  label: "Coverage Gaps",
                  value: healthData.issues?.coverageGaps ?? 0,
                  color: "danger",
                  icon: "📭",
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
