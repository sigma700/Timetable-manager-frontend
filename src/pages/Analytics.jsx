import {useState, useEffect, useRef, memo} from "react";
import {motion, AnimatePresence} from "framer-motion";
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
import {
  Users,
  BookOpen,
  School,
  ClipboardList,
  GraduationCap,
  Activity,
  ShieldCheck,
  TriangleAlert,
  CircleAlert,
  BarChart3,
  TrendingUp,
  Sparkles,
  Clock3,
  CalendarDays,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Layers,
} from "lucide-react";
import {Link} from "react-router-dom";

import {
  useAnalyticsOverview,
  useSubjectDistribution,
  useTeacherWorkload,
  useTimetableHealth,
} from "../hooks/useAnalytics.js";
import {useRecentActivity} from "../hooks/useActivity.js";
import HealthScoreCard from "./components/ui/HealthScoreCard.jsx";
import Table from "./components/ui/Table.jsx";
import Badge, {HealthBadge} from "./components/ui/Badge.jsx";
import {MetricGridSkeleton} from "./components/ui/Skeleton.jsx";
import EmptyState from "./components/ui/EmptyState.jsx";
import Footer from "./components/footer.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */
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

const TK = {
  bg: "#F8F8F8",
  surface: "#FFFFFF",
  border: "#E8E8E8",
  text: "#2B2B2B",
  muted: "#898989",
  subtle: "#A0A0A0",
  primary: "#0b69ff",
  accent: "#7c3aed",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOTION VARIANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: {opacity: 0, y: 20},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.4, ease: [0.16, 1, 0.3, 1]},
  },
};

const stagger = {
  hidden: {},
  show: {transition: {staggerChildren: 0.06}},
};

const tabContent = {
  hidden: {opacity: 0, y: 12},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.3, ease: [0.16, 1, 0.3, 1]},
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {duration: 0.2, ease: [0.16, 1, 0.3, 1]},
  },
};

const cardHover = {
  rest: {y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.02)"},
  hover: {
    y: -2,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    transition: {duration: 0.2, ease: [0.16, 1, 0.3, 1]},
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   COUNT-UP HOOK
   ═══════════════════════════════════════════════════════════════════════════ */
const useCountUp = (target, duration = 1000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== "number" || target < 0) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED METRIC CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const AnimatedMetricCard = memo(({label, value, Icon, color, description}) => {
  const numericValue = typeof value === "number" ? value : null;
  const animated = useCountUp(numericValue ?? 0);

  const colorMap = {
    primary: {
      bg: "rgba(11,105,255,0.08)",
      text: TK.primary,
      border: "rgba(11,105,255,0.15)",
    },
    accent: {
      bg: "rgba(124,58,237,0.08)",
      text: TK.accent,
      border: "rgba(124,58,237,0.15)",
    },
    success: {
      bg: "rgba(16,185,129,0.08)",
      text: TK.success,
      border: "rgba(16,185,129,0.15)",
    },
    warning: {
      bg: "rgba(245,158,11,0.08)",
      text: TK.warning,
      border: "rgba(245,158,11,0.15)",
    },
    danger: {
      bg: "rgba(239,68,68,0.08)",
      text: TK.danger,
      border: "rgba(239,68,68,0.15)",
    },
  };
  const c = colorMap[color] ?? colorMap.primary;

  return (
    <motion.div
      variants={fadeUp}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="analytics-card group"
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="analytics-card__icon"
          style={{background: c.bg, border: `1px solid ${c.border}`}}
        >
          {Icon && <Icon size={16} strokeWidth={1.8} style={{color: c.text}} />}
        </div>
        <TrendingUp size={13} className="analytics-card__trend" />
      </div>
      <p className="analytics-card__label">{label}</p>
      <p className="analytics-card__value">
        {numericValue !== null ? animated : (value ?? "—")}
      </p>
      {description && <p className="analytics-card__desc">{description}</p>}
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM CHART TOOLTIP
   ═══════════════════════════════════════════════════════════════════════════ */
const PremiumTooltip = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tooltip">
      {label && <p className="analytics-tooltip__label">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="analytics-tooltip__row">
          <div
            className="analytics-tooltip__dot"
            style={{background: entry.color}}
          />
          <p className="analytics-tooltip__name">
            {entry.name}:{" "}
            <span style={{color: entry.color}}>{entry.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════════════ */
const SectionHeader = ({title, subtitle, action}) => (
  <div className="analytics-section-header">
    <div>
      <h2 className="analytics-section-header__title">{title}</h2>
      {subtitle && <p className="analytics-section-header__sub">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVITY FEED
   ═══════════════════════════════════════════════════════════════════════════ */
const categoryConfig = {
  AUTH: {color: "#3b82f6", label: "Auth"},
  INSTITUTION: {color: "#7c3aed", label: "Institution"},
  TEACHER: {color: "#0b69ff", label: "Teacher"},
  SUBJECT: {color: "#10b981", label: "Subject"},
  CLASS: {color: "#f59e0b", label: "Class"},
  TIMETABLE: {color: "#9aa4b2", label: "Timetable"},
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

const ActivityTimeline = ({activities, loading}) => {
  if (loading) {
    return (
      <div className="analytics-activity-skeleton">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="analytics-activity-skeleton__row">
            <div className="analytics-activity-skeleton__dot" />
            <div className="analytics-activity-skeleton__lines">
              <div className="analytics-activity-skeleton__line analytics-activity-skeleton__line--w60" />
              <div className="analytics-activity-skeleton__line analytics-activity-skeleton__line--w40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="analytics-empty-state">
        <Activity size={32} className="analytics-empty-state__icon" />
        <p className="analytics-empty-state__title">No activity yet</p>
        <p className="analytics-empty-state__desc">
          Events appear here as your institution uses the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-timeline">
      <div className="analytics-timeline__line" />
      <div className="analytics-timeline__items">
        {activities.map((activity, i) => {
          const cfg = categoryConfig[activity.eventCategory] ?? {
            color: "#9aa4b2",
            label: activity.eventCategory,
          };
          return (
            <motion.div
              key={activity._id || i}
              initial={{opacity: 0, x: -10}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: i * 0.04, duration: 0.28}}
              className="analytics-timeline__item"
            >
              <div
                className="analytics-timeline__node"
                style={{borderColor: cfg.color}}
              >
                <div
                  className="analytics-timeline__node-inner"
                  style={{background: cfg.color}}
                />
              </div>
              <div className="analytics-timeline__content">
                <div className="analytics-timeline__header">
                  <p className="analytics-timeline__event">
                    {activity.event?.replace(/_/g, " ")}
                  </p>
                  <span className="analytics-timeline__time">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
                <div className="analytics-timeline__meta">
                  {(activity.userId?.firstName ||
                    activity.userId?.lastName) && (
                    <span className="analytics-timeline__user">
                      {activity.userId?.firstName} {activity.userId?.lastName}
                    </span>
                  )}
                  <span
                    className="analytics-timeline__badge"
                    style={{
                      background: `${cfg.color}18`,
                      color: cfg.color,
                      border: `1px solid ${cfg.color}30`,
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM HEALTH RING
   ═══════════════════════════════════════════════════════════════════════════ */
const PremiumHealthCard = ({data, loading}) => {
  const animatedScore = useCountUp(data?.healthScore ?? 0, 1400);

  const scoreColor = (s) => {
    if (s >= 80) return TK.success;
    if (s >= 60) return "#3b82f6";
    if (s >= 40) return TK.warning;
    return TK.danger;
  };

  const categoryConfig2 = {
    Excellent: {
      bg: "rgba(16,185,129,0.1)",
      text: TK.success,
      border: "rgba(16,185,129,0.2)",
    },
    Good: {
      bg: "rgba(59,130,246,0.1)",
      text: "#3b82f6",
      border: "rgba(59,130,246,0.2)",
    },
    "Needs Attention": {
      bg: "rgba(245,158,11,0.1)",
      text: TK.warning,
      border: "rgba(245,158,11,0.2)",
    },
    Critical: {
      bg: "rgba(239,68,68,0.1)",
      text: TK.danger,
      border: "rgba(239,68,68,0.2)",
    },
  };
  const cat = categoryConfig2[data?.category] ?? categoryConfig2.Good;

  if (loading) {
    return (
      <div className="analytics-card analytics-health-card--loading">
        <div className="analytics-health-card__skeleton-ring" />
        <div className="analytics-health-card__skeleton-label" />
      </div>
    );
  }

  if (!data) return null;

  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const filled = (Math.max(0, Math.min(animatedScore, 100)) / 100) * circ;
  const color = scoreColor(animatedScore);

  const issues = [
    {
      label: "Warnings",
      value: data.issues?.warnings ?? 0,
      icon: TriangleAlert,
      color: TK.warning,
    },
    {
      label: "Empty slots",
      value: data.issues?.emptySlots ?? 0,
      icon: CircleAlert,
      color: TK.danger,
    },
    {
      label: "No teacher",
      value: data.issues?.unassignedTeachers ?? 0,
      icon: Users,
      color: TK.warning,
    },
    {
      label: "Gap days",
      value: data.issues?.coverageGaps ?? 0,
      icon: CalendarDays,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="analytics-card analytics-health-card">
      <div className="analytics-health-card__header">
        <div>
          <p className="analytics-health-card__label">Timetable Health</p>
          <p className="analytics-health-card__name">{data.timetableName}</p>
        </div>
        <span
          className="analytics-health-card__badge"
          style={{
            background: cat.bg,
            color: cat.text,
            border: `1px solid ${cat.border}`,
          }}
        >
          {data.category}
        </span>
      </div>

      <div className="analytics-health-card__ring-wrapper">
        <div className="analytics-health-card__ring">
          <svg viewBox="0 0 128 128" className="analytics-health-card__svg">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#E8E8E8"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circ}`}
              className="analytics-health-card__progress"
            />
          </svg>
          <div
            className="analytics-health-card__glow"
            style={{
              background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
            }}
          />
          <div className="analytics-health-card__score">
            <span
              className="analytics-health-card__score-value"
              style={{color}}
            >
              {animatedScore}
            </span>
            <span className="analytics-health-card__score-total">/ 100</span>
          </div>
        </div>
      </div>

      <div className="analytics-health-card__issues">
        {issues.map(({label, value, icon: Icon, color: ic}) => (
          <div
            key={label}
            className="analytics-health-card__issue"
            style={{
              background: value > 0 ? `${ic}0d` : "rgba(16,185,129,0.06)",
              borderColor: value > 0 ? `${ic}22` : "rgba(16,185,129,0.15)",
            }}
          >
            <div className="analytics-health-card__issue-header">
              <Icon size={12} style={{color: value > 0 ? ic : TK.success}} />
              <span className="analytics-health-card__issue-label">
                {label}
              </span>
            </div>
            <p
              className="analytics-health-card__issue-value"
              style={{color: value > 0 ? ic : TK.success}}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TEACHER MOBILE CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const TeacherCard = ({teacher}) => (
  <motion.div
    variants={fadeUp}
    className="analytics-card analytics-teacher-card"
  >
    <div className="analytics-teacher-card__header">
      <div className="analytics-teacher-card__avatar">
        {teacher.teacherName?.[0]?.toUpperCase()}
      </div>
      <div className="analytics-teacher-card__info">
        <p className="analytics-teacher-card__name">{teacher.teacherName}</p>
        <p className="analytics-teacher-card__meta">
          {teacher.subjectCount} subjects &middot; {teacher.classCount} classes
        </p>
      </div>
      <span
        className="analytics-teacher-card__percent"
        style={{
          background:
            teacher.utilizationPercent > 80
              ? "rgba(239,68,68,0.1)"
              : teacher.utilizationPercent > 60
                ? "rgba(245,158,11,0.1)"
                : "rgba(16,185,129,0.1)",
          color:
            teacher.utilizationPercent > 80
              ? TK.danger
              : teacher.utilizationPercent > 60
                ? TK.warning
                : TK.success,
        }}
      >
        {teacher.utilizationPercent}%
      </span>
    </div>
    <div className="analytics-teacher-card__stats">
      {[
        {label: "Weekly periods", value: teacher.weeklyLoad},
        {label: "Daily average", value: teacher.dailyLoad},
      ].map(({label, value}) => (
        <div key={label} className="analytics-teacher-card__stat">
          <p className="analytics-teacher-card__stat-label">{label}</p>
          <p className="analytics-teacher-card__stat-value">{value}</p>
        </div>
      ))}
    </div>
    <div className="analytics-teacher-card__bar-wrapper">
      <div className="analytics-teacher-card__bar-header">
        <span>Utilization</span>
        <span>
          {teacher.weeklyLoad} /{" "}
          {teacher.weeklyLoad > 0
            ? Math.round(
                teacher.weeklyLoad / (teacher.utilizationPercent / 100),
              )
            : "—"}{" "}
          periods
        </span>
      </div>
      <div className="analytics-teacher-card__bar-track">
        <motion.div
          initial={{width: 0}}
          animate={{width: `${Math.min(teacher.utilizationPercent, 100)}%`}}
          transition={{duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
          className="analytics-teacher-card__bar-fill"
          style={{
            background:
              teacher.utilizationPercent > 80
                ? TK.danger
                : teacher.utilizationPercent > 60
                  ? TK.warning
                  : TK.success,
          }}
        />
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE COLUMNS
   ═══════════════════════════════════════════════════════════════════════════ */
const teacherColumns = [
  {
    key: "teacherName",
    label: "Teacher",
    render: (val) => (
      <div className="analytics-table__user-cell">
        <div className="analytics-table__user-avatar">
          {val?.[0]?.toUpperCase()}
        </div>
        <span>{val}</span>
      </div>
    ),
  },
  {
    key: "weeklyLoad",
    label: "Weekly",
    render: (v) => <span className="analytics-table__number">{v}</span>,
  },
  {
    key: "dailyLoad",
    label: "Daily Avg",
    render: (v) => <span className="analytics-table__muted">{v}</span>,
  },
  {
    key: "utilizationPercent",
    label: "Utilization",
    render: (val) => (
      <div className="analytics-table__progress">
        <div className="analytics-table__progress-track">
          <div
            className="analytics-table__progress-fill"
            style={{
              width: `${Math.min(val, 100)}%`,
              background:
                val > 80 ? TK.danger : val > 60 ? TK.warning : TK.success,
            }}
          />
        </div>
        <span>{val}%</span>
      </div>
    ),
  },
  {
    key: "subjectCount",
    label: "Subjects",
    render: (v) => <span className="analytics-table__muted">{v}</span>,
  },
  {
    key: "classCount",
    label: "Classes",
    render: (v) => <span className="analytics-table__muted">{v}</span>,
  },
];

const subjectColumns = [
  {
    key: "subjectName",
    label: "Subject",
    render: (v) => <span className="analytics-table__text">{v}</span>,
  },
  {
    key: "periodsAssigned",
    label: "Periods",
    render: (v) => <span className="analytics-table__number">{v}</span>,
  },
  {
    key: "allocationPercent",
    label: "Share",
    render: (val) => (
      <div className="analytics-table__progress">
        <div className="analytics-table__progress-track">
          <div
            className="analytics-table__progress-fill"
            style={{width: `${Math.min(val, 100)}%`, background: TK.primary}}
          />
        </div>
        <span>{val}%</span>
      </div>
    ),
  },
  {
    key: "classCount",
    label: "Classes",
    render: (v) => <span className="analytics-table__muted">{v}</span>,
  },
  {
    key: "dailyAverage",
    label: "Daily Avg",
    render: (v) => <span className="analytics-table__muted">{v}</span>,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PENALTY BAR
   ═══════════════════════════════════════════════════════════════════════════ */
const PenaltyBar = ({label, description, value, max, color}) => (
  <div className="analytics-penalty">
    <div className="analytics-penalty__header">
      <div>
        <p className="analytics-penalty__label">{label}</p>
        <p className="analytics-penalty__desc">{description}</p>
      </div>
      <span
        className="analytics-penalty__value"
        style={{color: value > 0 ? color : TK.success}}
      >
        -{value}
      </span>
    </div>
    <div className="analytics-penalty__track">
      <motion.div
        initial={{width: 0}}
        animate={{width: `${Math.min((value / max) * 100, 100)}%`}}
        transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
        className="analytics-penalty__fill"
        style={{background: color}}
      />
    </div>
    <p className="analytics-penalty__max">Max deduction: {max} pts</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   ERROR BANNER
   ═══════════════════════════════════════════════════════════════════════════ */
const ErrorBanner = ({messages, onRetry}) => {
  if (!messages || messages.length === 0) return null;
  return (
    <motion.div
      initial={{opacity: 0, y: -12}}
      animate={{opacity: 1, y: 0}}
      className="analytics-error-banner"
    >
      <AlertCircle size={20} className="analytics-error-banner__icon" />
      <div className="analytics-error-banner__body">
        <p className="analytics-error-banner__title">
          Unable to load some analytics data
        </p>
        <ul className="analytics-error-banner__list">
          {messages.map((msg, i) => (
            <li key={i} className="analytics-error-banner__item">
              {msg}
            </li>
          ))}
        </ul>
        <button onClick={onRetry} className="analytics-error-banner__btn">
          <RefreshCw size={13} /> Retry loading data
        </button>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TABS CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */
const TABS = [
  {id: "overview", label: "Overview", Icon: BarChart3},
  {id: "teachers", label: "Teachers", Icon: GraduationCap},
  {id: "subjects", label: "Subjects", Icon: BookOpen},
  {id: "health", label: "Health", Icon: ShieldCheck},
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useAnalyticsOverview();
  const {
    data: teacherData,
    isLoading: teacherLoading,
    refetch: refetchTeachers,
  } = useTeacherWorkload();
  const {
    data: subjectData,
    isLoading: subjectLoading,
    refetch: refetchSubjects,
  } = useSubjectDistribution();
  const {
    data: healthData,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useTimetableHealth();
  const {data: recentActivity, isLoading: activityLoading} =
    useRecentActivity(8);

  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const allDone =
      !overviewLoading && !teacherLoading && !subjectLoading && !healthLoading;
    if (!allDone) {
      setErrorMessages([]);
      return;
    }
    const errors = [];
    if (!overview) errors.push("Overview data could not be loaded.");
    if (!teacherData) errors.push("Teacher workload data is unavailable.");
    if (!subjectData) errors.push("Subject distribution data is unavailable.");
    if (!healthData) errors.push("Timetable health score is unavailable.");
    const allMissing = !overview && !teacherData && !subjectData && !healthData;
    if (allMissing) {
      setErrorMessages([
        "No analytics data could be loaded. Generate a timetable first to see your analytics.",
      ]);
    } else if (errors.length > 0) {
      setErrorMessages(errors);
    } else {
      setErrorMessages([]);
    }
  }, [
    overview,
    teacherData,
    subjectData,
    healthData,
    overviewLoading,
    teacherLoading,
    subjectLoading,
    healthLoading,
  ]);

  const handleRetry = () => {
    refetchOverview();
    refetchTeachers();
    refetchSubjects();
    refetchHealth();
    setErrorMessages([]);
  };

  const hasNoTimetables =
    !overviewLoading &&
    overview &&
    (overview.totalTimetables === 0 || overview.totalTimetables === undefined);

  return (
    <>
      <style>{analyticsCSS}</style>
      <div className="analytics-page">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: -12}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.35}}
          className="analytics-header"
        >
          <div className="analytics-header__badge">
            <Sparkles size={12} /> Analytics
          </div>
          <h1 className="analytics-header__title">Institution Overview</h1>
          <p className="analytics-header__sub">
            Performance insights and timetable health for your school.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="analytics-tabs">
          {TABS.map(({id, label, Icon}) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`analytics-tab ${activeTab === id ? "analytics-tab--active" : ""}`}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        <ErrorBanner messages={errorMessages} onRetry={handleRetry} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="analytics-grid analytics-grid--overview">
                {overviewLoading ? (
                  <MetricGridSkeleton count={4} />
                ) : overview ? (
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="analytics-metrics"
                  >
                    <AnimatedMetricCard
                      label="Teachers"
                      value={overview?.totalTeachers ?? 0}
                      Icon={Users}
                      color="primary"
                      description="Registered staff"
                    />
                    <AnimatedMetricCard
                      label="Subjects"
                      value={overview?.totalSubjects ?? 0}
                      Icon={BookOpen}
                      color="accent"
                      description="Active subjects"
                    />
                    <AnimatedMetricCard
                      label="Classes"
                      value={overview?.totalClasses ?? 0}
                      Icon={School}
                      color="success"
                      description="Class groups"
                    />
                    <AnimatedMetricCard
                      label="Timetables"
                      value={overview?.totalTimetables ?? 0}
                      Icon={ClipboardList}
                      color="warning"
                      description="Generated schedules"
                    />
                  </motion.div>
                ) : (
                  <div className="analytics-card analytics-empty-card">
                    <BarChart3
                      size={36}
                      style={{color: "#D0D0D0", marginBottom: 16}}
                    />
                    <p style={{fontSize: 15, fontWeight: 500, color: TK.muted}}>
                      Overview data not available
                    </p>
                    <p style={{fontSize: 13, color: TK.muted, marginTop: 6}}>
                      Generate a timetable to start seeing overview statistics.
                    </p>
                  </div>
                )}

                <div
                  className={`analytics-health-row ${isMobile ? "analytics-health-row--mobile" : ""}`}
                >
                  <PremiumHealthCard
                    data={healthData}
                    loading={healthLoading}
                  />
                  <div className="analytics-card analytics-activity-card">
                    <SectionHeader
                      title="Recent Activity"
                      subtitle="Live event stream from your institution"
                      action={
                        <div className="analytics-live-badge">
                          <div className="analytics-live-badge__dot" />
                          Live
                        </div>
                      }
                    />
                    <ActivityTimeline
                      activities={recentActivity}
                      loading={activityLoading}
                    />
                  </div>
                </div>

                {!subjectLoading && subjectData?.subjects?.length > 0 && (
                  <div className="analytics-card">
                    <SectionHeader
                      title="Subject Allocation"
                      subtitle="Periods distributed across subjects"
                    />
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={subjectData.subjects.slice(0, 10)}
                        margin={{top: 4, right: 8, left: -24, bottom: 0}}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#E8E8E8"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="subjectName"
                          tick={{fontSize: 11, fill: TK.muted}}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{fontSize: 11, fill: TK.muted}}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={<PremiumTooltip />}
                          cursor={{fill: "rgba(11,105,255,0.04)"}}
                        />
                        <Bar
                          dataKey="periodsAssigned"
                          name="Periods"
                          fill={TK.primary}
                          radius={[5, 5, 0, 0]}
                          maxBarSize={44}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* ── Teachers ── */}
            {activeTab === "teachers" && (
              <div className="analytics-grid analytics-grid--teachers">
                {!teacherLoading && teacherData && (
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="analytics-metrics analytics-metrics--3col"
                  >
                    <AnimatedMetricCard
                      label="Total Teachers"
                      value={teacherData.totalTeachers}
                      Icon={Users}
                      color="primary"
                    />
                    <AnimatedMetricCard
                      label="Periods Per Day"
                      value={teacherData.periodsPerDay}
                      Icon={Clock3}
                      color="accent"
                    />
                    <AnimatedMetricCard
                      label="Max Weekly Load"
                      value={teacherData.maxPeriodsPerWeek}
                      Icon={CalendarDays}
                      color="success"
                    />
                  </motion.div>
                )}

                {!teacherLoading && teacherData?.teachers?.length > 0 && (
                  <div className="analytics-card">
                    <SectionHeader
                      title="Weekly Load"
                      subtitle="Periods assigned per teacher this week"
                    />
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(200, teacherData.teachers.length * 36)}
                    >
                      <BarChart
                        data={teacherData.teachers}
                        layout="vertical"
                        margin={{top: 4, right: 16, left: 0, bottom: 4}}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#E8E8E8"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{fontSize: 11, fill: TK.muted}}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          dataKey="teacherName"
                          type="category"
                          tick={{fontSize: 11, fill: TK.muted}}
                          tickLine={false}
                          axisLine={false}
                          width={96}
                        />
                        <Tooltip
                          content={<PremiumTooltip />}
                          cursor={{fill: "rgba(11,105,255,0.04)"}}
                        />
                        <Bar
                          dataKey="weeklyLoad"
                          name="Weekly Periods"
                          fill={TK.primary}
                          radius={[0, 5, 5, 0]}
                          maxBarSize={22}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div>
                  <SectionHeader
                    title="Workload Breakdown"
                    subtitle="Period assignments and utilization per teacher"
                  />
                  {isMobile ? (
                    <motion.div
                      variants={stagger}
                      initial="hidden"
                      animate="show"
                      className="analytics-mobile-cards"
                    >
                      {teacherLoading
                        ? Array.from({length: 4}).map((_, i) => (
                            <div
                              key={i}
                              className="analytics-card analytics-skeleton-card"
                              style={{height: 150}}
                            />
                          ))
                        : (teacherData?.teachers ?? []).map((t) => (
                            <TeacherCard key={t.teacherId} teacher={t} />
                          ))}
                      {!teacherLoading &&
                        (!teacherData?.teachers ||
                          teacherData.teachers.length === 0) && (
                          <div className="analytics-card analytics-empty-card">
                            <GraduationCap
                              size={36}
                              style={{color: "#D0D0D0", marginBottom: 16}}
                            />
                            <p
                              style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color: TK.muted,
                              }}
                            >
                              No teachers found
                            </p>
                            <p
                              style={{
                                fontSize: 13,
                                color: TK.muted,
                                marginTop: 6,
                              }}
                            >
                              Add teachers to see workload analytics.
                            </p>
                          </div>
                        )}
                    </motion.div>
                  ) : (
                    <Table
                      columns={teacherColumns}
                      data={teacherData?.teachers ?? []}
                      loading={teacherLoading}
                      emptyTitle="No teachers found"
                      emptyMessage="Add teachers to your school to see workload analytics."
                    />
                  )}
                </div>
              </div>
            )}

            {/* ── Subjects ── */}
            {activeTab === "subjects" && (
              <div className="analytics-grid analytics-grid--subjects">
                {!subjectLoading && subjectData && (
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="analytics-metrics analytics-metrics--3col"
                  >
                    <AnimatedMetricCard
                      label="Total Subjects"
                      value={subjectData.totalSubjects}
                      Icon={BookOpen}
                      color="primary"
                    />
                    <AnimatedMetricCard
                      label="Total Periods"
                      value={subjectData.totalPeriods}
                      Icon={Clock3}
                      color="accent"
                    />
                    <AnimatedMetricCard
                      label="Avg Periods / Subject"
                      value={
                        subjectData.totalSubjects > 0
                          ? Math.round(
                              subjectData.totalPeriods /
                                subjectData.totalSubjects,
                            )
                          : 0
                      }
                      Icon={BarChart3}
                      color="success"
                    />
                  </motion.div>
                )}

                {!subjectLoading && subjectData?.subjects?.length > 0 && (
                  <div
                    className={`analytics-charts-row ${isMobile ? "analytics-charts-row--mobile" : ""}`}
                  >
                    <div className="analytics-card">
                      <SectionHeader
                        title="Distribution"
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
                            outerRadius={96}
                            innerRadius={52}
                            paddingAngle={2}
                          >
                            {subjectData.subjects.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<PremiumTooltip />} />
                          <Legend
                            iconType="circle"
                            iconSize={7}
                            formatter={(v) => (
                              <span style={{fontSize: 11, color: TK.muted}}>
                                {v}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="analytics-card">
                      <SectionHeader
                        title="Periods Per Subject"
                        subtitle="Total assigned periods"
                      />
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                          data={subjectData.subjects}
                          margin={{top: 4, right: 8, left: -24, bottom: 0}}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E8E8E8"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="subjectName"
                            tick={{fontSize: 10, fill: TK.muted}}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tick={{fontSize: 11, fill: TK.muted}}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            content={<PremiumTooltip />}
                            cursor={{fill: "rgba(11,105,255,0.04)"}}
                          />
                          <Bar
                            dataKey="periodsAssigned"
                            name="Periods"
                            radius={[5, 5, 0, 0]}
                            maxBarSize={36}
                          >
                            {subjectData.subjects.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

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
                    emptyMessage="Add subjects to see distribution analytics."
                  />
                </div>
              </div>
            )}

            {/* ── Health ── */}
            {activeTab === "health" && (
              <div className="analytics-grid analytics-grid--health">
                <div
                  className={`analytics-health-row ${isMobile ? "analytics-health-row--mobile" : ""}`}
                >
                  <PremiumHealthCard
                    data={healthData}
                    loading={healthLoading}
                  />
                  {!healthLoading && healthData && (
                    <div className="analytics-card">
                      <SectionHeader
                        title="Score Breakdown"
                        subtitle="How each issue affects the overall health score"
                      />
                      <div className="analytics-penalty-list">
                        {[
                          {
                            label: "Warning Penalty",
                            value: healthData.breakdown?.warningPenalty ?? 0,
                            max: 40,
                            color: TK.warning,
                            description:
                              "Periods where generator had to compromise",
                          },
                          {
                            label: "Empty Slot Penalty",
                            value: healthData.breakdown?.emptySlotPenalty ?? 0,
                            max: 30,
                            color: TK.danger,
                            description: "Periods with no subject assigned",
                          },
                          {
                            label: "No Teacher Penalty",
                            value: healthData.breakdown?.noTeacherPenalty ?? 0,
                            max: 20,
                            color: TK.warning,
                            description:
                              "Periods with a subject but no teacher",
                          },
                          {
                            label: "Coverage Gap",
                            value:
                              healthData.breakdown?.coverageGapPenalty ?? 0,
                            max: 10,
                            color: "#3b82f6",
                            description: "Classes with full days unscheduled",
                          },
                        ].map((item) => (
                          <PenaltyBar key={item.label} {...item} />
                        ))}
                      </div>
                      <div className="analytics-final-score">
                        <span className="analytics-final-score__label">
                          Final Score
                        </span>
                        <div className="analytics-final-score__right">
                          <span
                            className="analytics-final-score__badge"
                            style={{
                              background:
                                healthData.healthScore >= 80
                                  ? "rgba(16,185,129,0.1)"
                                  : healthData.healthScore >= 60
                                    ? "rgba(59,130,246,0.1)"
                                    : "rgba(245,158,11,0.1)",
                              color:
                                healthData.healthScore >= 80
                                  ? TK.success
                                  : healthData.healthScore >= 60
                                    ? "#3b82f6"
                                    : TK.warning,
                            }}
                          >
                            {healthData.category}
                          </span>
                          <span className="analytics-final-score__value">
                            {healthData.healthScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {!healthLoading && !healthData && (
                    <div
                      className="analytics-card analytics-empty-card"
                      style={{minHeight: 280}}
                    >
                      <ShieldCheck
                        size={36}
                        style={{color: "#D0D0D0", marginBottom: 16}}
                      />
                      <p
                        style={{fontSize: 15, fontWeight: 500, color: TK.muted}}
                      >
                        Health score not available
                      </p>
                      <p style={{fontSize: 13, color: TK.muted, marginTop: 6}}>
                        Generate a timetable to see health metrics.
                      </p>
                    </div>
                  )}
                </div>

                {!healthLoading && healthData && (
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="analytics-issues-grid"
                  >
                    {[
                      {
                        label: "Warnings",
                        value: healthData.issues?.warnings ?? 0,
                        Icon: TriangleAlert,
                        color: TK.warning,
                      },
                      {
                        label: "Empty Slots",
                        value: healthData.issues?.emptySlots ?? 0,
                        Icon: CircleAlert,
                        color: TK.danger,
                      },
                      {
                        label: "Unassigned Teachers",
                        value: healthData.issues?.unassignedTeachers ?? 0,
                        Icon: Users,
                        color: TK.warning,
                      },
                      {
                        label: "Coverage Gaps",
                        value: healthData.issues?.coverageGaps ?? 0,
                        Icon: CalendarDays,
                        color: "#3b82f6",
                      },
                    ].map(({label, value, Icon, color}) => (
                      <motion.div
                        key={label}
                        variants={fadeUp}
                        className="analytics-card analytics-issue-card"
                        style={{
                          borderColor:
                            value > 0 ? `${color}30` : "rgba(16,185,129,0.2)",
                        }}
                      >
                        <div
                          className="analytics-issue-card__icon"
                          style={{
                            background:
                              value > 0 ? `${color}12` : "rgba(16,185,129,0.1)",
                          }}
                        >
                          <Icon
                            size={16}
                            style={{color: value > 0 ? color : TK.success}}
                          />
                        </div>
                        <p className="analytics-issue-card__label">{label}</p>
                        <p
                          className="analytics-issue-card__value"
                          style={{color: value > 0 ? color : TK.success}}
                        >
                          {value}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA when no timetables */}
        {hasNoTimetables && (
          <div className="analytics-cta-section">
            <div className="analytics-cta-card">
              <Layers size={40} style={{color: TK.primary, marginBottom: 16}} />
              <h3 className="analytics-cta-card__title">No timetables yet</h3>
              <p className="analytics-cta-card__desc">
                Generate your first timetable to start seeing analytics and
                insights.
              </p>
              <Link to="/home/create-table" className="analytics-cta-card__btn">
                Start creating <ChevronRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════════════════════════ */
const analyticsCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .analytics-page, .analytics-page * { box-sizing: border-box; }
  .analytics-page {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #F8F8F8;
    color: #2B2B2B;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 64px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Header ── */
  .analytics-header { margin-bottom: 32px; }
  .analytics-header__badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
    color: #0b69ff; background: rgba(11,105,255,0.08); border: 1px solid rgba(11,105,255,0.15);
    border-radius: 20px; padding: 5px 13px; margin-bottom: 14px;
  }
  .analytics-header__title {
    font-size: clamp(22px, 4vw, 28px); font-weight: 700;
    letter-spacing: -0.025em; color: #2B2B2B; margin-bottom: 6px;
  }
  .analytics-header__sub { font-size: 14px; color: #898989; }

  /* ── Tabs ── */
  .analytics-tabs {
    display: flex; gap: 2px; margin-bottom: 28px;
    border-bottom: 1px solid #E8E8E8; overflow-x: auto;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .analytics-tabs::-webkit-scrollbar { display: none; }
  .analytics-tab {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 18px; font-size: 13.5px; font-weight: 500;
    color: #898989; background: transparent; border: none;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    cursor: pointer; white-space: nowrap; transition: all 0.2s ease;
    font-family: inherit; letter-spacing: -0.01em;
  }
  .analytics-tab:hover { color: #2B2B2B; }
  .analytics-tab--active { color: #0b69ff; border-bottom-color: #0b69ff; font-weight: 600; }

  /* ── Grids ── */
  .analytics-grid { display: flex; flex-direction: column; gap: 24px; }

  /* ── Metrics ── */
  .analytics-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }
  .analytics-metrics--3col { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }

  /* ── Cards ── */
  .analytics-card {
    background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 16px;
    padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .analytics-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
  .analytics-card__icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .analytics-card__trend {
    margin-top: 4px; color: #898989;
    opacity: 0; transition: opacity 0.2s ease;
  }
  .analytics-card:hover .analytics-card__trend { opacity: 1; }
  .analytics-card__label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em; color: #898989; margin-bottom: 6px;
  }
  .analytics-card__value {
    font-size: 30px; font-weight: 700; color: #2B2B2B;
    line-height: 1; font-variant-numeric: tabular-nums; margin-bottom: 6px;
  }
  .analytics-card__desc { font-size: 12px; color: #898989; }

  /* ── Empty Card ── */
  .analytics-empty-card {
    text-align: center; padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 200px;
  }

  /* ── Health Row ── */
  .analytics-health-row { display: grid; grid-template-columns: 1fr 2fr; gap: 14px; }
  .analytics-health-row--mobile { grid-template-columns: 1fr; }

  /* ── Charts Row ── */
  .analytics-charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .analytics-charts-row--mobile { grid-template-columns: 1fr; }

  /* ── Issues Grid ── */
  .analytics-issues-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
  }
  .analytics-issue-card { text-align: center; }
  .analytics-issue-card__icon {
    width: 40px; height: 40px; border-radius: 10px; margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .analytics-issue-card__label { font-size: 12px; color: #898989; margin-bottom: 6px; font-weight: 500; }
  .analytics-issue-card__value { font-size: 28px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; }

  /* ── Section Header ── */
  .analytics-section-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; }
  .analytics-section-header__title { font-size: 15px; font-weight: 600; color: #2B2B2B; margin-bottom: 3px; letter-spacing: -0.015em; }
  .analytics-section-header__sub { font-size: 12.5px; color: #898989; }

  /* ── Live Badge ── */
  .analytics-live-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11.5px; color: #898989; font-weight: 500;
  }
  .analytics-live-badge__dot {
    width: 7px; height: 7px; border-radius: 50%; background: #10b981;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* ── Tooltip ── */
  .analytics-tooltip {
    background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 10px;
    padding: 10px 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); font-size: 12px; min-width: 120px;
  }
  .analytics-tooltip__label { color: #898989; margin-bottom: 6px; font-size: 11px; }
  .analytics-tooltip__row { display: flex; align-items: center; gap: 8px; }
  .analytics-tooltip__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .analytics-tooltip__name { color: #2B2B2B; font-weight: 600; }

  /* ── Activity ── */
  .analytics-activity-skeleton { padding: 4px 0; }
  .analytics-activity-skeleton__row { display: flex; gap: 12px; padding: 8px 0; }
  .analytics-activity-skeleton__dot { width: 28px; height: 28px; border-radius: 50%; background: #E8E8E8; flex-shrink: 0; }
  .analytics-activity-skeleton__lines { flex: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
  .analytics-activity-skeleton__line { height: 8px; border-radius: 4px; background: #E8E8E8; }
  .analytics-activity-skeleton__line--w60 { width: 60%; }
  .analytics-activity-skeleton__line--w40 { width: 40%; }

  .analytics-empty-state { padding: 36px 0; text-align: center; }
  .analytics-empty-state__icon { color: #D0D0D0; margin: 0 auto 14px; display: block; }
  .analytics-empty-state__title { font-size: 14px; font-weight: 500; color: #898989; margin-bottom: 6px; }
  .analytics-empty-state__desc { font-size: 12px; color: #898989; line-height: 1.6; max-width: 280px; margin: 0 auto; }

  .analytics-timeline { position: relative; padding: 2px 0; }
  .analytics-timeline__line { position: absolute; left: 13px; top: 8px; bottom: 8px; width: 1.5px; background: #E8E8E8; z-index: 0; }
  .analytics-timeline__items { position: relative; z-index: 1; }
  .analytics-timeline__item { display: flex; gap: 12px; padding: 7px 0; }
  .analytics-timeline__node {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: #FFFFFF; border: 2px solid #3b82f6;
    display: flex; align-items: center; justify-content: center;
  }
  .analytics-timeline__node-inner { width: 8px; height: 8px; border-radius: 50%; }
  .analytics-timeline__content { flex: 1; min-width: 0; padding-top: 3px; }
  .analytics-timeline__header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .analytics-timeline__event { font-size: 12.5px; font-weight: 500; color: #2B2B2B; line-height: 1.35; }
  .analytics-timeline__time { font-size: 11px; color: #898989; white-space: nowrap; flex-shrink: 0; }
  .analytics-timeline__meta { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
  .analytics-timeline__user { font-size: 11px; color: #898989; }
  .analytics-timeline__badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px;
    letter-spacing: 0.02em;
  }

  /* ── Health Card ── */
  .analytics-health-card { display: flex; flex-direction: column; }
  .analytics-health-card--loading { min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
  .analytics-health-card__skeleton-ring { width: 140px; height: 140px; border-radius: 50%; background: #E8E8E8; animation: pulse 1.5s ease-in-out infinite; }
  .analytics-health-card__skeleton-label { width: 80px; height: 12px; border-radius: 6px; background: #E8E8E8; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .analytics-health-card__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 8px; }
  .analytics-health-card__label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #898989; margin-bottom: 3px; }
  .analytics-health-card__name { font-size: 12px; color: #898989; }
  .analytics-health-card__badge { font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 20px; white-space: nowrap; }
  .analytics-health-card__ring-wrapper { display: flex; justify-content: center; margin-bottom: 24px; }
  .analytics-health-card__ring { position: relative; width: 152px; height: 152px; }
  .analytics-health-card__svg { position: absolute; inset: 0; transform: rotate(-90deg); }
  .analytics-health-card__progress { transition: stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1); }
  .analytics-health-card__glow { position: absolute; inset: 12px; border-radius: 50%; }
  .analytics-health-card__score { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .analytics-health-card__score-value { font-size: 34px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
  .analytics-health-card__score-total { font-size: 11.5px; color: #898989; margin-top: 3px; }
  .analytics-health-card__issues { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto; }
  .analytics-health-card__issue { padding: 10px 12px; border-radius: 9px; border: 1px solid; }
  .analytics-health-card__issue-header { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
  .analytics-health-card__issue-label { font-size: 10.5px; color: #898989; font-weight: 500; }
  .analytics-health-card__issue-value { font-size: 19px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; }

  /* ── Teacher Card ── */
  .analytics-teacher-card { padding: 18px; }
  .analytics-teacher-card__header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .analytics-teacher-card__avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: rgba(11,105,255,0.1); border: 1px solid rgba(11,105,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #0b69ff;
  }
  .analytics-teacher-card__info { flex: 1; min-width: 0; }
  .analytics-teacher-card__name { font-size: 14px; font-weight: 600; color: #2B2B2B; }
  .analytics-teacher-card__meta { font-size: 11px; color: #898989; margin-top: 2px; }
  .analytics-teacher-card__percent {
    font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 20px; flex-shrink: 0;
  }
  .analytics-teacher-card__stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .analytics-teacher-card__stat { padding: 10px 12px; border-radius: 8px; background: #F8F8F8; border: 1px solid #E8E8E8; }
  .analytics-teacher-card__stat-label { font-size: 10.5px; color: #898989; margin-bottom: 3px; }
  .analytics-teacher-card__stat-value { font-size: 18px; font-weight: 700; color: #2B2B2B; line-height: 1; }
  .analytics-teacher-card__bar-wrapper { font-size: 11px; }
  .analytics-teacher-card__bar-header { display: flex; justify-content: space-between; margin-bottom: 5px; color: #898989; }
  .analytics-teacher-card__bar-track { height: 6px; border-radius: 3px; background: #E8E8E8; overflow: hidden; }
  .analytics-teacher-card__bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }

  /* ── Table ── */
  .analytics-table__user-cell { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #2B2B2B; }
  .analytics-table__user-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: rgba(11,105,255,0.1); border: 1px solid rgba(11,105,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #0b69ff;
  }
  .analytics-table__number { font-weight: 600; color: #2B2B2B; font-variant-numeric: tabular-nums; }
  .analytics-table__muted { color: #898989; font-variant-numeric: tabular-nums; }
  .analytics-table__text { font-weight: 500; color: #2B2B2B; }
  .analytics-table__progress { display: flex; align-items: center; gap: 8px; }
  .analytics-table__progress-track { width: 64px; height: 5px; border-radius: 3px; background: #E8E8E8; overflow: hidden; }
  .analytics-table__progress-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }

  /* ── Penalty ── */
  .analytics-penalty-list { display: flex; flex-direction: column; gap: 18px; }
  .analytics-penalty__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
  .analytics-penalty__label { font-size: 13.5px; font-weight: 600; color: #2B2B2B; }
  .analytics-penalty__desc { font-size: 11.5px; color: #898989; margin-top: 2px; }
  .analytics-penalty__value { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; min-width: 36px; text-align: right; }
  .analytics-penalty__track { height: 6px; border-radius: 3px; background: #E8E8E8; overflow: hidden; }
  .analytics-penalty__fill { height: 100%; border-radius: 3px; }
  .analytics-penalty__max { font-size: 11px; color: #898989; margin-top: 5px; }

  /* ── Final Score ── */
  .analytics-final-score {
    margin-top: 24px; padding-top: 20px; border-top: 1px solid #E8E8E8;
    display: flex; align-items: center; justify-content: space-between;
  }
  .analytics-final-score__label { font-size: 15px; font-weight: 600; color: #2B2B2B; }
  .analytics-final-score__right { display: flex; align-items: center; gap: 12px; }
  .analytics-final-score__badge { font-size: 11px; font-weight: 600; padding: 4px 11px; border-radius: 20px; border: 1px solid; }
  .analytics-final-score__value { font-size: 30px; font-weight: 800; color: #2B2B2B; font-variant-numeric: tabular-nums; }

  /* ── Error Banner ── */
  .analytics-error-banner {
    background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.15);
    border-radius: 14px; padding: 18px 22px; margin-bottom: 24px;
    display: flex; align-items: flex-start; gap: 14px;
  }
  .analytics-error-banner__icon { color: #f59e0b; flex-shrink: 0; margin-top: 1px; }
  .analytics-error-banner__body { flex: 1; }
  .analytics-error-banner__title { font-size: 14px; font-weight: 600; color: #92400e; margin-bottom: 8px; }
  .analytics-error-banner__list { list-style: none; padding: 0; margin: 0 0 14px 0; }
  .analytics-error-banner__item {
    font-size: 12.5px; color: #a16207; margin-bottom: 4px; padding-left: 14px;
    position: relative; line-height: 1.5;
  }
  .analytics-error-banner__item::before {
    content: ''; position: absolute; left: 0; top: 8px;
    width: 5px; height: 5px; border-radius: 50%; background: #f59e0b;
  }
  .analytics-error-banner__btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 9px;
    border: 1px solid rgba(245,158,11,0.25); background: rgba(245,158,11,0.08);
    color: #92400e; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s ease; font-family: inherit;
  }
  .analytics-error-banner__btn:hover { background: rgba(245,158,11,0.15); }

  /* ── CTA Section ── */
  .analytics-cta-section { margin-top: 56px; padding-top: 36px; border-top: 1px solid #E8E8E8; text-align: center; }
  .analytics-cta-card {
    max-width: 480px; margin: 0 auto;
    background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 18px;
    padding: 40px 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .analytics-cta-card__title { font-size: 19px; font-weight: 700; color: #2B2B2B; margin-bottom: 8px; letter-spacing: -0.02em; }
  .analytics-cta-card__desc { font-size: 13.5px; color: #898989; margin-bottom: 24px; line-height: 1.6; }
  .analytics-cta-card__btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 26px; border-radius: 10px;
    font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none;
    background: #2B2B2B; border: 1px solid #2B2B2B;
    transition: all 0.2s ease;
  }
  .analytics-cta-card__btn:hover { background: #1F1F1F; border-color: #1F1F1F; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }

  /* ── Mobile Cards ── */
  .analytics-mobile-cards { display: flex; flex-direction: column; gap: 12px; }

  /* ── Skeleton Card ── */
  .analytics-skeleton-card { animation: pulse 1.5s ease-in-out infinite; background: #E8E8E8; border: none; }

  @media (max-width: 767px) {
    .analytics-page { padding: 24px 16px 48px; }
    .analytics-card { padding: 18px; border-radius: 14px; }
    .analytics-card__value { font-size: 26px; }
    .analytics-card__icon { width: 34px; height: 34px; border-radius: 9px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .analytics-page *, .analytics-page *::before, .analytics-page *::after {
      animation: none !important; transition: none !important;
    }
  }
`;

export default Analytics;
