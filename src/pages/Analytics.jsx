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
} from "lucide-react";

import {
  useAnalyticsOverview,
  useSubjectDistribution,
  useTeacherWorkload,
  useTimetableHealth,
} from "../hooks/useAnalytics.js";
import {useRecentActivity} from "../hooks/useActivity.js";
// import MetricCard from "./components/ui/metricCard.jsx";
import HealthScoreCard from "./components/ui/HealthScoreCard.jsx";
import Table from "./components/ui/Table.jsx";
import Badge, {HealthBadge} from "./components/ui/Badge.jsx";
import {MetricGridSkeleton} from "./components/ui/Skeleton.jsx";
import EmptyState from "./components/ui/EmptyState.jsx";
import Footer from "./components/footer.jsx";

// ─────────────────────────────────────────────
// DESIGN TOKENS – semantic colors preserved
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
// MOTION VARIANTS
// ─────────────────────────────────────────────
const fadeUp = {
  hidden: {opacity: 0, y: 16},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.35, ease: [0.16, 1, 0.3, 1]},
  },
};

const stagger = {
  hidden: {},
  show: {transition: {staggerChildren: 0.07}},
};

const tabContent = {
  hidden: {opacity: 0, y: 10},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.28, ease: [0.16, 1, 0.3, 1]},
  },
  exit: {opacity: 0, y: -6, transition: {duration: 0.18}},
};

// ─────────────────────────────────────────────
// COUNT-UP HOOK
// ─────────────────────────────────────────────
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
};

// ─────────────────────────────────────────────
// ANIMATED METRIC CARD
// ─────────────────────────────────────────────
const AnimatedMetricCard = memo(({label, value, Icon, color, description}) => {
  const numericValue = typeof value === "number" ? value : null;
  const animated = useCountUp(numericValue ?? 0);

  const colorMap = {
    primary: {
      bg: "rgba(11,105,255,0.08)",
      text: "#0b69ff",
      border: "rgba(11,105,255,0.15)",
    },
    accent: {
      bg: "rgba(124,58,237,0.08)",
      text: "#7c3aed",
      border: "rgba(124,58,237,0.15)",
    },
    success: {
      bg: "rgba(16,185,129,0.08)",
      text: "#10b981",
      border: "rgba(16,185,129,0.15)",
    },
    warning: {
      bg: "rgba(245,158,11,0.08)",
      text: "#f59e0b",
      border: "rgba(245,158,11,0.15)",
    },
    danger: {
      bg: "rgba(239,68,68,0.08)",
      text: "#ef4444",
      border: "rgba(239,68,68,0.15)",
    },
  };
  const c = colorMap[color] ?? colorMap.primary;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{y: -2, transition: {duration: 0.2}}}
      className="card group cursor-default select-none"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{background: c.bg, border: `1px solid ${c.border}`}}
        >
          {Icon && <Icon size={16} strokeWidth={1.8} style={{color: c.text}} />}
        </div>
        <TrendingUp
          size={12}
          className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{color: "#898989"}}
        />
      </div>

      <p
        className="text-xs font-medium uppercase tracking-wide mb-1"
        style={{color: "#898989", letterSpacing: "0.06em"}}
      >
        {label}
      </p>

      <p
        className="text-3xl font-bold tabular-nums leading-none mb-1"
        style={{color: "#2B2B2B"}}
      >
        {numericValue !== null ? animated : (value ?? "—")}
      </p>

      {description && (
        <p className="text-xs mt-1" style={{color: "#898989"}}>
          {description}
        </p>
      )}
    </motion.div>
  );
});

// ─────────────────────────────────────────────
// PREMIUM CHART TOOLTIP
// ─────────────────────────────────────────────
const PremiumTooltip = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E8",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        fontSize: 12,
        minWidth: 120,
      }}
    >
      {label && (
        <p style={{color: "#898989", marginBottom: 6, fontSize: 11}}>{label}</p>
      )}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: entry.color,
            }}
          />
          <p style={{color: "#2B2B2B", fontWeight: 600}}>
            {entry.name}:{" "}
            <span style={{color: entry.color}}>{entry.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────
const SectionHeader = ({title, subtitle, action}) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#2B2B2B",
          marginBottom: 2,
        }}
      >
        {title}
      </h2>
      {subtitle && <p style={{fontSize: 12, color: "#898989"}}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─────────────────────────────────────────────
// ACTIVITY FEED – color badges preserved
// ─────────────────────────────────────────────
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
      <div className="space-y-4 py-2">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#E8E8E8",
                flexShrink: 0,
              }}
            />
            <div style={{flex: 1}}>
              <div
                style={{
                  height: 10,
                  width: "60%",
                  borderRadius: 6,
                  background: "#E8E8E8",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  height: 10,
                  width: "40%",
                  borderRadius: 6,
                  background: "#E8E8E8",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div style={{padding: "32px 0", textAlign: "center"}}>
        <Activity size={28} style={{color: "#D0D0D0", margin: "0 auto 12px"}} />
        <p style={{fontSize: 13, color: "#898989", fontWeight: 500}}>
          No activity yet
        </p>
        <p style={{fontSize: 12, color: "#898989", marginTop: 4}}>
          Events appear here as your institution uses the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        style={{
          position: "absolute",
          left: 13,
          top: 14,
          bottom: 14,
          width: 1,
          background: "#E8E8E8",
          zIndex: 0,
        }}
      />
      <div className="space-y-1">
        {activities.map((activity, i) => {
          const cfg = categoryConfig[activity.eventCategory] ?? {
            color: "#9aa4b2",
            label: activity.eventCategory,
          };
          return (
            <motion.div
              key={activity._id || i}
              initial={{opacity: 0, x: -8}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: i * 0.04, duration: 0.25}}
              className="flex gap-3 relative z-10"
              style={{padding: "6px 0"}}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "#FFFFFF",
                  border: `2px solid ${cfg.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: cfg.color,
                  }}
                />
              </div>
              <div style={{flex: 1, minWidth: 0, paddingTop: 4}}>
                <div className="flex items-center justify-between gap-2">
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#2B2B2B",
                      lineHeight: 1.3,
                    }}
                  >
                    {activity.event?.replace(/_/g, " ")}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#898989",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {(activity.userId?.firstName ||
                    activity.userId?.lastName) && (
                    <span style={{fontSize: 11, color: "#898989"}}>
                      {activity.userId?.firstName} {activity.userId?.lastName}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "1px 7px",
                      borderRadius: 20,
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

// ─────────────────────────────────────────────
// PREMIUM HEALTH RING – colors retained
// ─────────────────────────────────────────────
const PremiumHealthCard = ({data, loading}) => {
  const animatedScore = useCountUp(data?.healthScore ?? 0, 1200);

  const scoreColor = (s) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#3b82f6";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const categoryBg = (cat) => {
    const map = {
      Excellent: {
        bg: "rgba(16,185,129,0.1)",
        text: "#10b981",
        border: "rgba(16,185,129,0.2)",
      },
      Good: {
        bg: "rgba(59,130,246,0.1)",
        text: "#3b82f6",
        border: "rgba(59,130,246,0.2)",
      },
      "Needs Attention": {
        bg: "rgba(245,158,11,0.1)",
        text: "#f59e0b",
        border: "rgba(245,158,11,0.2)",
      },
      Critical: {
        bg: "rgba(239,68,68,0.1)",
        text: "#ef4444",
        border: "rgba(239,68,68,0.2)",
      },
    };
    return map[cat] ?? map.Good;
  };

  if (loading) {
    return (
      <div className="card" style={{minHeight: 280}}>
        <div className="animate-pulse flex flex-col items-center gap-4 py-6">
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "#E8E8E8",
            }}
          />
          <div
            style={{
              height: 12,
              width: 80,
              borderRadius: 6,
              background: "#E8E8E8",
            }}
          />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const filled = (animatedScore / 100) * circ;
  const color = scoreColor(animatedScore);
  const cat = categoryBg(data.category);

  const issues = [
    {
      label: "Warnings",
      value: data.issues?.warnings ?? 0,
      icon: TriangleAlert,
      color: "#f59e0b",
    },
    {
      label: "Empty slots",
      value: data.issues?.emptySlots ?? 0,
      icon: CircleAlert,
      color: "#ef4444",
    },
    {
      label: "No teacher",
      value: data.issues?.unassignedTeachers ?? 0,
      icon: Users,
      color: "#f59e0b",
    },
    {
      label: "Gap days",
      value: data.issues?.coverageGaps ?? 0,
      icon: CalendarDays,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#898989",
            }}
          >
            Timetable Health
          </p>
          <p style={{fontSize: 12, color: "#898989", marginTop: 2}}>
            {data.timetableName}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 20,
            background: cat.bg,
            color: cat.text,
            border: `1px solid ${cat.border}`,
          }}
        >
          {data.category}
        </span>
      </div>

      <div className="flex flex-col items-center mb-5">
        <div style={{position: "relative", width: 148, height: 148}}>
          <svg
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotate(-90deg)",
            }}
            viewBox="0 0 128 128"
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#E8E8E8"
              strokeWidth="9"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circ}`}
              style={{
                transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {animatedScore}
            </span>
            <span style={{fontSize: 11, color: "#898989", marginTop: 2}}>
              / 100
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: "auto",
        }}
      >
        {issues.map(({label, value, icon: Icon, color: ic}) => (
          <div
            key={label}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: value > 0 ? `${ic}0d` : "rgba(16,185,129,0.06)",
              border: `1px solid ${value > 0 ? `${ic}22` : "rgba(16,185,129,0.15)"}`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} style={{color: value > 0 ? ic : "#10b981"}} />
              <span style={{fontSize: 10, color: "#898989", fontWeight: 500}}>
                {label}
              </span>
            </div>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: value > 0 ? ic : "#10b981",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TEACHER MOBILE CARD
// ─────────────────────────────────────────────
const TeacherCard = ({teacher}) => (
  <motion.div variants={fadeUp} className="card" style={{padding: "16px"}}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(11,105,255,0.1)",
            border: "1px solid rgba(11,105,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#0b69ff",
          }}
        >
          {teacher.teacherName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{fontSize: 13, fontWeight: 600, color: "#2B2B2B"}}>
            {teacher.teacherName}
          </p>
          <p style={{fontSize: 11, color: "#898989"}}>
            {teacher.subjectCount} subjects · {teacher.classCount} classes
          </p>
        </div>
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 20,
          background:
            teacher.utilizationPercent > 80
              ? "rgba(239,68,68,0.1)"
              : teacher.utilizationPercent > 60
                ? "rgba(245,158,11,0.1)"
                : "rgba(16,185,129,0.1)",
          color:
            teacher.utilizationPercent > 80
              ? "#ef4444"
              : teacher.utilizationPercent > 60
                ? "#f59e0b"
                : "#10b981",
        }}
      >
        {teacher.utilizationPercent}%
      </span>
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        marginBottom: 12,
      }}
    >
      {[
        {label: "Weekly periods", value: teacher.weeklyLoad},
        {label: "Daily average", value: teacher.dailyLoad},
      ].map(({label, value}) => (
        <div
          key={label}
          style={{
            padding: "8px 10px",
            borderRadius: 7,
            background: "#F8F8F8",
            border: "1px solid #E8E8E8",
          }}
        >
          <p style={{fontSize: 10, color: "#898989", marginBottom: 2}}>
            {label}
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#2B2B2B",
              lineHeight: 1,
            }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
    <div>
      <div className="flex items-center justify-between mb-1">
        <span style={{fontSize: 11, color: "#898989"}}>Utilization</span>
        <span style={{fontSize: 11, color: "#898989"}}>
          {teacher.weeklyLoad} /{" "}
          {teacher.weeklyLoad > 0
            ? Math.round(
                teacher.weeklyLoad / (teacher.utilizationPercent / 100),
              )
            : "—"}{" "}
          periods
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: "#E8E8E8",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{width: 0}}
          animate={{width: `${Math.min(teacher.utilizationPercent, 100)}%`}}
          transition={{duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
          style={{
            height: "100%",
            borderRadius: 3,
            background:
              teacher.utilizationPercent > 80
                ? "#ef4444"
                : teacher.utilizationPercent > 60
                  ? "#f59e0b"
                  : "#10b981",
          }}
        />
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// DESKTOP TEACHER TABLE COLUMNS (colors kept)
// ─────────────────────────────────────────────
const teacherColumns = [
  {
    key: "teacherName",
    label: "Teacher",
    render: (val) => (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(11,105,255,0.1)",
            border: "1px solid rgba(11,105,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#0b69ff",
            flexShrink: 0,
          }}
        >
          {val?.[0]?.toUpperCase()}
        </div>
        <span style={{fontSize: 13, fontWeight: 500, color: "#2B2B2B"}}>
          {val}
        </span>
      </div>
    ),
  },
  {
    key: "weeklyLoad",
    label: "Weekly",
    render: (val) => (
      <span
        style={{
          fontWeight: 600,
          color: "#2B2B2B",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "dailyLoad",
    label: "Daily Avg",
    render: (val) => (
      <span style={{color: "#898989", fontVariantNumeric: "tabular-nums"}}>
        {val}
      </span>
    ),
  },
  {
    key: "utilizationPercent",
    label: "Utilization",
    render: (val) => (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 72,
            height: 5,
            borderRadius: 3,
            background: "#E8E8E8",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 3,
              width: `${Math.min(val, 100)}%`,
              background:
                val > 80 ? "#ef4444" : val > 60 ? "#f59e0b" : "#10b981",
              transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            color: "#898989",
            fontVariantNumeric: "tabular-nums",
            minWidth: 32,
          }}
        >
          {val}%
        </span>
      </div>
    ),
  },
  {
    key: "subjectCount",
    label: "Subjects",
    render: (val) => (
      <span style={{color: "#898989", fontVariantNumeric: "tabular-nums"}}>
        {val}
      </span>
    ),
  },
  {
    key: "classCount",
    label: "Classes",
    render: (val) => (
      <span style={{color: "#898989", fontVariantNumeric: "tabular-nums"}}>
        {val}
      </span>
    ),
  },
];

// ─────────────────────────────────────────────
// SUBJECT TABLE COLUMNS
// ─────────────────────────────────────────────
const subjectColumns = [
  {
    key: "subjectName",
    label: "Subject",
    render: (val) => (
      <span style={{fontWeight: 500, color: "#2B2B2B"}}>{val}</span>
    ),
  },
  {
    key: "periodsAssigned",
    label: "Periods",
    render: (val) => (
      <span
        style={{
          fontWeight: 600,
          color: "#2B2B2B",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {val}
      </span>
    ),
  },
  {
    key: "allocationPercent",
    label: "Share",
    render: (val) => (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 64,
            height: 5,
            borderRadius: 3,
            background: "#E8E8E8",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 3,
              width: `${Math.min(val, 100)}%`,
              background: "#0b69ff",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            color: "#898989",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {val}%
        </span>
      </div>
    ),
  },
  {
    key: "classCount",
    label: "Classes",
    render: (val) => (
      <span style={{color: "#898989", fontVariantNumeric: "tabular-nums"}}>
        {val}
      </span>
    ),
  },
  {
    key: "dailyAverage",
    label: "Daily Avg",
    render: (val) => (
      <span style={{color: "#898989", fontVariantNumeric: "tabular-nums"}}>
        {val}
      </span>
    ),
  },
];

// ─────────────────────────────────────────────
// PENALTY BAR
// ─────────────────────────────────────────────
const PenaltyBar = ({label, description, value, max, color}) => (
  <div>
    <div className="flex items-start justify-between mb-2">
      <div>
        <p style={{fontSize: 13, fontWeight: 500, color: "#2B2B2B"}}>{label}</p>
        <p style={{fontSize: 11, color: "#898989", marginTop: 1}}>
          {description}
        </p>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: value > 0 ? color : "#10b981",
          minWidth: 36,
          textAlign: "right",
        }}
      >
        -{value}
      </span>
    </div>
    <div
      style={{
        height: 6,
        borderRadius: 3,
        background: "#E8E8E8",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{width: 0}}
        animate={{width: `${(value / max) * 100}%`}}
        transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
        style={{height: "100%", borderRadius: 3, background: color}}
      />
    </div>
    <p style={{fontSize: 11, color: "#898989", marginTop: 4}}>
      Max deduction: {max} pts
    </p>
  </div>
);

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────
const TABS = [
  {id: "overview", label: "Overview", Icon: BarChart3},
  {id: "teachers", label: "Teachers", Icon: GraduationCap},
  {id: "subjects", label: "Subjects", Icon: BookOpen},
  {id: "health", label: "Health", Icon: ShieldCheck},
];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const {data: overview, isLoading: overviewLoading} = useAnalyticsOverview();
  const {data: teacherData, isLoading: teacherLoading} = useTeacherWorkload();
  const {data: subjectData, isLoading: subjectLoading} =
    useSubjectDistribution();
  const {data: healthData, isLoading: healthLoading} = useTimetableHealth();
  const {data: recentActivity, isLoading: activityLoading} =
    useRecentActivity(8);

  return (
    <div
      className="analytics-light mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8"
      style={{background: "#F8F8F8", minHeight: "100vh"}}
    >
      {/* Light theme override for cards and components */}
      <style>{`
        .analytics-light {
          --color-bg: #F8F8F8;
          --color-card: #FFFFFF;
          --color-text: #2B2B2B;
          --color-muted: #898989;
          --color-subtle: #A0A0A0;
          --color-border: #E8E8E8;
          --color-header-bg: #F0F0F0;
        }
        .analytics-light .card {
          background: var(--color-card);
          border: 1px solid var(--color-border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          border-radius: 16px;
          padding: 24px;
        }
        .analytics-light .card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .analytics-light .card .text-muted {
          color: var(--color-muted);
        }
        .analytics-light .card .text-subtle {
          color: var(--color-subtle);
        }
        .analytics-light .card .text-heading {
          color: var(--color-text);
        }
        .analytics-light .border-color-border {
          border-color: var(--color-border);
        }
        .analytics-light .bg-color-card {
          background-color: var(--color-card);
        }
        .analytics-light .bg-color-bg {
          background-color: var(--color-bg);
        }
        .analytics-light .text-color-text {
          color: var(--color-text);
        }
        .analytics-light .text-color-muted {
          color: var(--color-muted);
        }
      `}</style>

      {/* ── Page header ── */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        style={{marginBottom: 28}}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} style={{color: "#0b69ff"}} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#0b69ff",
            }}
          >
            Analytics
          </span>
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#2B2B2B",
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          Institution Overview
        </h1>
        <p style={{fontSize: 13, color: "#898989"}}>
          Performance insights and timetable health for your school.
        </p>
      </motion.div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 2,
          marginBottom: 28,
          borderBottom: "1px solid #E8E8E8",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map(({id, label, Icon}) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === id ? "#0b69ff" : "#898989",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeTab === id ? "#0b69ff" : "transparent"}`,
              marginBottom: -1,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            <Icon size={14} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContent}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div style={{display: "flex", flexDirection: "column", gap: 24}}>
              {overviewLoading ? (
                <MetricGridSkeleton count={4} />
              ) : (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  <AnimatedMetricCard
                    label="Teachers"
                    value={overview?.totalTeachers ?? "—"}
                    Icon={Users}
                    color="primary"
                    description="Registered staff"
                  />
                  <AnimatedMetricCard
                    label="Subjects"
                    value={overview?.totalSubjects ?? "—"}
                    Icon={BookOpen}
                    color="accent"
                    description="Active subjects"
                  />
                  <AnimatedMetricCard
                    label="Classes"
                    value={overview?.totalClasses ?? "—"}
                    Icon={School}
                    color="success"
                    description="Class groups"
                  />
                  <AnimatedMetricCard
                    label="Timetables"
                    value={overview?.totalTimetables ?? "—"}
                    Icon={ClipboardList}
                    color="warning"
                    description="Generated schedules"
                  />
                </motion.div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
                  gap: 12,
                }}
              >
                <PremiumHealthCard data={healthData} loading={healthLoading} />
                <div
                  className="card"
                  style={{display: "flex", flexDirection: "column"}}
                >
                  <SectionHeader
                    title="Recent Activity"
                    subtitle="Live event stream from your institution"
                    action={
                      <div
                        style={{display: "flex", alignItems: "center", gap: 4}}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#10b981",
                          }}
                          className="animate-pulse"
                        />
                        <span style={{fontSize: 11, color: "#898989"}}>
                          Live
                        </span>
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
                <div className="card">
                  <SectionHeader
                    title="Subject Allocation"
                    subtitle="Periods distributed across subjects"
                  />
                  <ResponsiveContainer width="100%" height={240}>
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
                        tick={{fontSize: 11, fill: "#898989"}}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{fontSize: 11, fill: "#898989"}}
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
                        fill="#0b69ff"
                        radius={[5, 5, 0, 0]}
                        maxBarSize={44}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Teachers Tab */}
          {activeTab === "teachers" && (
            <div style={{display: "flex", flexDirection: "column", gap: 20}}>
              {!teacherLoading && teacherData && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
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
                <div className="card">
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
                        tick={{fontSize: 11, fill: "#898989"}}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="teacherName"
                        type="category"
                        tick={{fontSize: 11, fill: "#898989"}}
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
                        fill="#0b69ff"
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
                    style={{display: "flex", flexDirection: "column", gap: 10}}
                  >
                    {teacherLoading
                      ? Array.from({length: 4}).map((_, i) => (
                          <div
                            key={i}
                            className="card animate-pulse"
                            style={{height: 140}}
                          />
                        ))
                      : (teacherData?.teachers ?? []).map((t) => (
                          <TeacherCard key={t.teacherId} teacher={t} />
                        ))}
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

          {/* Subjects Tab */}
          {activeTab === "subjects" && (
            <div style={{display: "flex", flexDirection: "column", gap: 20}}>
              {!subjectLoading && subjectData && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
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
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div className="card">
                    <SectionHeader
                      title="Distribution"
                      subtitle="Proportional period allocation"
                    />
                    <ResponsiveContainer width="100%" height={260}>
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
                          formatter={(val) => (
                            <span style={{fontSize: 11, color: "#898989"}}>
                              {val}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <SectionHeader
                      title="Periods Per Subject"
                      subtitle="Total assigned periods"
                    />
                    <ResponsiveContainer width="100%" height={260}>
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
                          tick={{fontSize: 10, fill: "#898989"}}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{fontSize: 11, fill: "#898989"}}
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
                  emptyMessage="Add subjects to your school to see distribution analytics."
                />
              </div>
            </div>
          )}

          {/* Health Tab */}
          {activeTab === "health" && (
            <div style={{display: "flex", flexDirection: "column", gap: 20}}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
                  gap: 12,
                }}
              >
                <PremiumHealthCard data={healthData} loading={healthLoading} />
                {!healthLoading && healthData && (
                  <div className="card">
                    <SectionHeader
                      title="Score Breakdown"
                      subtitle="How each issue affects the overall health score"
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                      }}
                    >
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
                          description: "Periods with a subject but no teacher",
                        },
                        {
                          label: "Coverage Gap",
                          value: healthData.breakdown?.coverageGapPenalty ?? 0,
                          max: 10,
                          color: "#3b82f6",
                          description: "Classes with full days unscheduled",
                        },
                      ].map((item) => (
                        <PenaltyBar key={item.label} {...item} />
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: 24,
                        paddingTop: 20,
                        borderTop: "1px solid #E8E8E8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#2B2B2B",
                        }}
                      >
                        Final Score
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 20,
                            background:
                              healthData.healthScore >= 80
                                ? "rgba(16,185,129,0.1)"
                                : healthData.healthScore >= 60
                                  ? "rgba(59,130,246,0.1)"
                                  : "rgba(245,158,11,0.1)",
                            color:
                              healthData.healthScore >= 80
                                ? "#10b981"
                                : healthData.healthScore >= 60
                                  ? "#3b82f6"
                                  : "#f59e0b",
                            border: `1px solid ${healthData.healthScore >= 80 ? "rgba(16,185,129,0.2)" : healthData.healthScore >= 60 ? "rgba(59,130,246,0.2)" : "rgba(245,158,11,0.2)"}`,
                          }}
                        >
                          {healthData.category}
                        </span>
                        <span
                          style={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: "#2B2B2B",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {healthData.healthScore}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!healthLoading && healthData && (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      label: "Warnings",
                      value: healthData.issues?.warnings ?? 0,
                      Icon: TriangleAlert,
                      color: "#f59e0b",
                    },
                    {
                      label: "Empty Slots",
                      value: healthData.issues?.emptySlots ?? 0,
                      Icon: CircleAlert,
                      color: "#ef4444",
                    },
                    {
                      label: "Unassigned Teachers",
                      value: healthData.issues?.unassignedTeachers ?? 0,
                      Icon: Users,
                      color: "#f59e0b",
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
                      className="card"
                      style={{
                        borderColor:
                          value > 0 ? `${color}30` : "rgba(16,185,129,0.2)",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          marginBottom: 12,
                          background:
                            value > 0 ? `${color}12` : "rgba(16,185,129,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          size={15}
                          style={{color: value > 0 ? color : "#10b981"}}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#898989",
                          marginBottom: 4,
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: value > 0 ? color : "#10b981",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
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
    </div>
  );
};

export default Analytics;
