import React, {useState, useEffect, useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import {useAuthStore} from "../store/authStore";
// import {getTable} from "../api/timetable";
import {Navigation} from "./components/navigation";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Layers,
  Coffee,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  BarChart2,
  Zap,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import {getTimetable} from "../api/timetable";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const tk = {
  bg0: "#09090C",
  bg1: "#0F1015",
  bg2: "#14151C",
  bg3: "#1A1B25",
  bg4: "#1F2130",
  border: "rgba(255,255,255,0.06)",
  borderHov: "rgba(255,255,255,0.12)",
  borderAccent: "rgba(79,110,247,0.36)",
  text1: "#EDEEF5",
  text2: "#8B90AA",
  text3: "#52566A",
  accent: "#4F6EF7",
  accentHov: "#3D5CE8",
  accentSubtle: "rgba(79,110,247,0.09)",
  accentBorder: "rgba(79,110,247,0.28)",
  violet: "#8B5CF6",
  violetSubtle: "rgba(139,92,246,0.09)",
  violetBorder: "rgba(139,92,246,0.26)",
  amber: "#F59E0B",
  amberSubtle: "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.26)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.08)",
  successBorder: "rgba(34,197,94,0.22)",
  danger: "#F87171",
  dangerSubtle: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.22)",
  teal: "#2DD4BF",
  tealSubtle: "rgba(45,212,191,0.08)",
  tealBorder: "rgba(45,212,191,0.22)",
};

// ─── Subject color palette ────────────────────────────────────────────────────
const SUBJECT_PALETTE = [
  {
    bg: "rgba(79,110,247,0.12)",
    border: "rgba(79,110,247,0.28)",
    text: "#818cf8",
  },
  {
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.28)",
    text: "#a78bfa",
  },
  {
    bg: "rgba(45,212,191,0.10)",
    border: "rgba(45,212,191,0.24)",
    text: "#2dd4bf",
  },
  {bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.24)", text: "#4ade80"},
  {
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.24)",
    text: "#fbbf24",
  },
  {
    bg: "rgba(236,72,153,0.10)",
    border: "rgba(236,72,153,0.24)",
    text: "#f472b6",
  },
  {
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.24)",
    text: "#60a5fa",
  },
  {bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.24)", text: "#f87171"},
];

const subjectColorMap = {};
let colorIdx = 0;
function getSubjectColor(name) {
  if (!name) return SUBJECT_PALETTE[0];
  if (!subjectColorMap[name]) {
    subjectColorMap[name] = SUBJECT_PALETTE[colorIdx % SUBJECT_PALETTE.length];
    colorIdx++;
  }
  return subjectColorMap[name];
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      {threshold},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useAnimatedCount(target, inView, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || !target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "";
  try {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    if (isNaN(hour)) return timeStr;
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  } catch {
    return timeStr;
  }
}

function getPeriodDuration(period) {
  if (!period?.startTime || !period?.endTime) return 0;
  const start = new Date(`2000-01-01T${period.startTime}`);
  const end = new Date(`2000-01-01T${period.endTime}`);
  return (end - start) / (1000 * 60);
}

function isDoublePeriod(period, config) {
  if (!period?.startTime || !period?.endTime) return false;
  return getPeriodDuration(period) > (config?.periodDuration || 40);
}

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_FULL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// ─── Loading screen ───────────────────────────────────────────────────────────
const LOAD_STEPS = [
  {icon: <BookOpen size={16} />, label: "Collecting timetable data"},
  {icon: <Users size={16} />, label: "Analyzing teacher assignments"},
  {icon: <Calendar size={16} />, label: "Organizing subjects"},
  {icon: <AlertTriangle size={16} />, label: "Resolving scheduling conflicts"},
  {icon: <Zap size={16} />, label: "Optimizing schedule layout"},
  {icon: <CheckCircle size={16} />, label: "Finalizing timetable"},
];

function LoadingScreen({
  userName,
  institutionName,
  notificationCount,
  onLogout,
}) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(
      () => setStep((s) => Math.min(s + 1, LOAD_STEPS.length - 1)),
      600,
    );
    const progTimer = setInterval(
      () => setProgress((p) => Math.min(p + 2, 95)),
      80,
    );
    return () => {
      clearInterval(stepTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <>
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={onLogout}
      />
      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              margin: "0 auto 24px",
              background: tk.accentSubtle,
              border: `1px solid ${tk.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tk.accent,
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: tk.text1,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Building your timetable
          </h2>
          <p
            style={{
              fontSize: 13,
              color: tk.text3,
              marginBottom: 36,
              lineHeight: 1.6,
            }}
          >
            Protiba's scheduling engine is processing your institution's data.
          </p>
          <div style={{marginBottom: 32, textAlign: "left"}}>
            {LOAD_STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 0",
                    borderBottom:
                      i < LOAD_STEPS.length - 1
                        ? `1px solid ${tk.border}`
                        : "none",
                    opacity: done ? 0.45 : active ? 1 : 0.2,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: done
                        ? tk.successSubtle
                        : active
                          ? tk.accentSubtle
                          : tk.bg2,
                      border: `1px solid ${done ? tk.successBorder : active ? tk.accentBorder : tk.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: done ? tk.success : active ? tk.accent : tk.text3,
                      transition: "all 0.3s",
                    }}
                  >
                    {done ? <CheckCircle size={14} /> : s.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: active ? tk.text1 : tk.text2,
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              height: 3,
              background: tk.bg3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${tk.accent}, ${tk.violet})`,
                borderRadius: 2,
                transition: "width 0.08s linear",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 11,
              color: tk.text3,
              marginTop: 10,
              letterSpacing: "0.04em",
            }}
          >
            {progress}% complete
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Error / Empty states ─────────────────────────────────────────────────────
function StateScreen({
  icon,
  title,
  body,
  action,
  userName,
  institutionName,
  notificationCount,
  onLogout,
}) {
  return (
    <>
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={onLogout}
      />
      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{textAlign: "center", maxWidth: 360, padding: "0 24px"}}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              margin: "0 auto 22px",
              background: tk.bg2,
              border: `1px solid ${tk.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tk.text3,
            }}
          >
            {icon}
          </div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: tk.text1,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: tk.text3,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {body}
          </p>
          {action && (
            <button
              onClick={action.fn}
              style={{
                padding: "10px 22px",
                background: tk.accent,
                color: "#fff",
                border: "none",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <RefreshCw size={13} /> {action.label}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({icon, value, label, color, delay}) {
  const [ref, inView] = useInView(0.2);
  const count = useAnimatedCount(
    typeof value === "number" ? value : null,
    inView,
  );
  return (
    <div
      ref={ref}
      style={{
        background: tk.bg1,
        border: `1px solid ${tk.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = tk.borderHov;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = tk.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          marginBottom: 14,
          background: color.bg,
          border: `1px solid ${color.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color.text,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: tk.text1,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 5,
        }}
      >
        {typeof value === "number" ? count : value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: tk.text3,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Class Selector ───────────────────────────────────────────────────────────
function ClassSelector({timetables, selected, onChange}) {
  const scrollRef = useRef(null);
  return (
    <div style={{position: "relative"}}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {timetables.map((t) => {
          const name = t.name.replace("Timetable for ", "");
          const active = selected === t.name;
          return (
            <button
              key={t.name}
              onClick={() => onChange(t.name)}
              style={{
                whiteSpace: "nowrap",
                padding: "8px 16px",
                background: active ? tk.accentSubtle : "transparent",
                border: `1px solid ${active ? tk.accentBorder : tk.border}`,
                borderRadius: 9,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? tk.accent : tk.text2,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.18s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.borderColor = tk.borderHov;
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.borderColor = tk.border;
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Desktop Timetable ────────────────────────────────────────────────────────
function DesktopTimetable({timetable}) {
  const [hovCell, setHovCell] = useState(null);
  const todayIdx = getTodayIndex();
  const days = timetable.schedule || [];
  const periods = days[0]?.periods || [];
  const config = timetable.config;

  return (
    <div style={{overflowX: "auto", borderRadius: 14}}>
      <table
        style={{width: "100%", borderCollapse: "separate", borderSpacing: 0}}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px 16px",
                fontSize: 10,
                fontWeight: 600,
                color: tk.text3,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                background: tk.bg2,
                borderBottom: `1px solid ${tk.border}`,
                borderRight: `1px solid ${tk.border}`,
                textAlign: "left",
                minWidth: 110,
                position: "sticky",
                left: 0,
                zIndex: 2,
                borderRadius: "14px 0 0 0",
              }}
            >
              Time
            </th>
            {days.map((day, di) => {
              const isToday = di === todayIdx;
              return (
                <th
                  key={day.day}
                  style={{
                    padding: "12px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: isToday ? tk.accent : tk.text2,
                    background: isToday ? tk.accentSubtle : tk.bg2,
                    borderBottom: `1px solid ${tk.border}`,
                    borderRight:
                      di < days.length - 1 ? `1px solid ${tk.border}` : "none",
                    textAlign: "center",
                    minWidth: 140,
                    whiteSpace: "nowrap",
                    borderTop: isToday
                      ? `2px solid ${tk.accent}`
                      : "2px solid transparent",
                    letterSpacing: "0.02em",
                    borderRadius: di === days.length - 1 ? "0 14px 0 0" : 0,
                  }}
                >
                  {day.day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {periods.map((_, pi) => {
            const refPeriod = days[0]?.periods?.[pi];
            const timeLabel = refPeriod
              ? `${formatTime(refPeriod.startTime)} – ${formatTime(refPeriod.endTime)}`
              : `Period ${pi + 1}`;
            return (
              <tr key={`row-${pi}`}>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: 11,
                    color: tk.text3,
                    background: tk.bg2,
                    borderBottom: `1px solid ${tk.border}`,
                    borderRight: `1px solid ${tk.border}`,
                    fontVariantNumeric: "tabular-nums",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {timeLabel}
                </td>
                {days.map((day, di) => {
                  const period = day.periods?.[pi];
                  const cellKey = `${di}-${pi}`;
                  const isHov = hovCell === cellKey;
                  const isToday = di === todayIdx;
                  const dp = isDoublePeriod(period, config);
                  const isBreak = period?.isBreak;
                  const hasWarn = period?.warning;
                  const subColor = period?.subject
                    ? getSubjectColor(period.subject.name)
                    : null;
                  let bg = isToday ? "rgba(79,110,247,0.03)" : tk.bg1;
                  let borderL = isToday
                    ? `2px solid ${tk.accentBorder}`
                    : `1px solid ${tk.border}`;
                  if (isBreak) bg = tk.amberSubtle;
                  if (hasWarn) bg = tk.dangerSubtle;
                  if (dp)
                    bg = isToday ? "rgba(139,92,246,0.1)" : tk.violetSubtle;
                  return (
                    <td
                      key={cellKey}
                      onMouseEnter={() => setHovCell(cellKey)}
                      onMouseLeave={() => setHovCell(null)}
                      style={{
                        padding: 0,
                        background: isHov ? tk.bg3 : bg,
                        borderBottom: `1px solid ${tk.border}`,
                        borderRight:
                          di < days.length - 1
                            ? `1px solid ${tk.border}`
                            : "none",
                        borderLeft: borderL,
                        transition: "background 0.15s",
                        verticalAlign: "top",
                        minWidth: 140,
                      }}
                    >
                      <div style={{padding: "10px 12px"}}>
                        {isBreak ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Coffee size={12} color={tk.amber} />
                            <span
                              style={{
                                fontSize: 12,
                                color: tk.amber,
                                fontWeight: 500,
                              }}
                            >
                              {period.name || "Break"}
                            </span>
                          </div>
                        ) : period?.subject ? (
                          <>
                            {dp && (
                              <span
                                style={{
                                  display: "inline-block",
                                  marginBottom: 5,
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: tk.violet,
                                  background: tk.violetSubtle,
                                  border: `1px solid ${tk.violetBorder}`,
                                  borderRadius: 4,
                                  padding: "2px 7px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                }}
                              >
                                Double
                              </span>
                            )}
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: subColor?.text || tk.text1,
                                marginBottom: 3,
                                lineHeight: 1.3,
                              }}
                            >
                              {period.subject.name}
                            </div>
                            <div style={{fontSize: 11, color: tk.text3}}>
                              {period.teacher?.name || "Unassigned"}
                            </div>
                            {hasWarn && (
                              <div
                                style={{
                                  marginTop: 5,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  fontSize: 10,
                                  color: tk.danger,
                                }}
                              >
                                <AlertTriangle size={10} />
                                {period.warning}
                              </div>
                            )}
                          </>
                        ) : (
                          <span style={{fontSize: 11, color: tk.bg4}}>—</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Mobile Day View ──────────────────────────────────────────────────────────
function MobileTimetable({timetable}) {
  const days = timetable.schedule || [];
  const todayIdx = Math.min(getTodayIndex(), days.length - 1);
  const [dayIdx, setDayIdx] = useState(todayIdx >= 0 ? todayIdx : 0);
  const config = timetable.config;
  const day = days[dayIdx];
  if (!day) return null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 20,
          scrollbarWidth: "none",
        }}
      >
        {days.map((d, i) => {
          const active = i === dayIdx;
          const isToday = i === todayIdx;
          return (
            <button
              key={d.day}
              onClick={() => setDayIdx(i)}
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                background: active
                  ? tk.accent
                  : isToday
                    ? tk.accentSubtle
                    : "transparent",
                border: `1px solid ${active ? tk.accent : isToday ? tk.accentBorder : tk.border}`,
                borderRadius: 9,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? "#fff" : isToday ? tk.accent : tk.text2,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.18s",
              }}
            >
              {d.day.slice(0, 3)}
            </button>
          );
        })}
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 10}}>
        {day.periods?.map((period, idx) => {
          const dp = isDoublePeriod(period, config);
          const isBreak = period?.isBreak;
          const subColor = period?.subject
            ? getSubjectColor(period.subject.name)
            : null;
          return (
            <div
              key={idx}
              style={{
                background: isBreak ? tk.amberSubtle : tk.bg1,
                border: `1px solid ${isBreak ? tk.amberBorder : dp ? tk.violetBorder : tk.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                borderLeft: `3px solid ${isBreak ? tk.amber : dp ? tk.violet : subColor?.text || tk.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isBreak || period?.subject ? 8 : 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: tk.text3,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatTime(period.startTime)} – {formatTime(period.endTime)}
                </span>
                <div style={{display: "flex", gap: 6}}>
                  {dp && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: tk.violet,
                        background: tk.violetSubtle,
                        border: `1px solid ${tk.violetBorder}`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Double
                    </span>
                  )}
                  {isBreak && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: tk.amber,
                        background: tk.amberSubtle,
                        border: `1px solid ${tk.amberBorder}`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Break
                    </span>
                  )}
                </div>
              </div>
              {isBreak ? (
                <div style={{display: "flex", alignItems: "center", gap: 7}}>
                  <Coffee size={14} color={tk.amber} />
                  <span
                    style={{fontSize: 14, fontWeight: 500, color: tk.amber}}
                  >
                    {period.name || "Break"}
                  </span>
                  <span
                    style={{fontSize: 12, color: tk.text3, marginLeft: "auto"}}
                  >
                    {period.duration} min
                  </span>
                </div>
              ) : period?.subject ? (
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: subColor?.text || tk.text1,
                      marginBottom: 4,
                    }}
                  >
                    {period.subject.name}
                  </div>
                  <div style={{fontSize: 12, color: tk.text3}}>
                    {period.teacher?.name || "Unassigned"}
                  </div>
                  {period.warning && (
                    <div
                      style={{
                        marginTop: 7,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: tk.danger,
                      }}
                    >
                      <AlertTriangle size={11} />
                      {period.warning}
                    </div>
                  )}
                </div>
              ) : (
                <span style={{fontSize: 13, color: tk.text3}}>Free period</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Insights ─────────────────────────────────────────────────────────────────
function InsightCard({icon, label, value, color, delay}) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        background: tk.bg1,
        border: `1px solid ${tk.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: color.bg,
            border: `1px solid ${color.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color.text,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: 11,
            color: tk.text3,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: tk.text1,
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function buildInsights(timetable) {
  const {schedule, config} = timetable;
  if (!schedule) return [];

  const doublePeriods = [];
  const subjectCount = {};
  const teacherPeriods = {};
  const dayLengths = {};
  let totalBreaks = 0;

  schedule.forEach((day) => {
    let dayPeriods = 0;
    day.periods?.forEach((p) => {
      if (p.isBreak) {
        totalBreaks++;
        return;
      }
      if (isDoublePeriod(p, config) && p.subject)
        doublePeriods.push({day: day.day, ...p});
      if (p.subject?.name)
        subjectCount[p.subject.name] = (subjectCount[p.subject.name] || 0) + 1;
      if (p.teacher?.name)
        teacherPeriods[p.teacher.name] =
          (teacherPeriods[p.teacher.name] || 0) + 1;
      dayPeriods++;
    });
    dayLengths[day.day] = dayPeriods;
  });

  const topSubject = Object.entries(subjectCount).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const busiestTeacher = Object.entries(teacherPeriods).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const busiestDay = Object.entries(dayLengths).sort((a, b) => b[1] - a[1])[0];

  return [
    topSubject && {
      icon: <Award size={13} />,
      label: "Most taught subject",
      value: `${topSubject[0]} - ${topSubject[1]} periods`,
      color: {bg: tk.accentSubtle, border: tk.accentBorder, text: tk.accent},
    },
    busiestTeacher && {
      icon: <Users size={13} />,
      label: "Highest workload teacher",
      value: `${busiestTeacher[0]} - ${busiestTeacher[1]} periods/week`,
      color: {bg: tk.violetSubtle, border: tk.violetBorder, text: tk.violet},
    },
    busiestDay && {
      icon: <TrendingUp size={13} />,
      label: "Busiest day",
      value: `${busiestDay[0]} - ${busiestDay[1]} lessons`,
      color: {bg: tk.tealSubtle, border: tk.tealBorder, text: tk.teal},
    },
    {
      icon: <Layers size={13} />,
      label: "Double periods",
      value:
        doublePeriods.length > 0
          ? `${doublePeriods.length} scheduled`
          : "None this week",
      color: {bg: tk.amberSubtle, border: tk.amberBorder, text: tk.amber},
    },
    {
      icon: <Coffee size={13} />,
      label: "Break sessions",
      value: `${totalBreaks} across the week`,
      color: {bg: tk.successSubtle, border: tk.successBorder, text: tk.success},
    },
  ].filter(Boolean);
}

// ────────────────────────────────────────────────────────────────────────────────
// MAIN TIMETABLES COMPONENT
// ────────────────────────────────────────────────────────────────────────────────
const Timetables = () => {
  const {user, isLoading: authLoading, requiredData} = useAuthStore();

  // ═══ React Query data fetching (replaces useGenStore) ═══
  const {
    data: gottenTable,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["timetable", requiredData],
    queryFn: () => getTimetable(requiredData),
    enabled: !!requiredData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const error = queryError ? queryError.message || "Unknown error" : null;

  const [selectedClass, setSelectedClass] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);
  const heroInView = mounted;
  const metricsInView = mounted;

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";
  const institutionName = user?.institutionName || "Your Institution";
  const notificationCount = 3;

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {method: "POST", credentials: "include"},
      );
      if (res.ok) window.location.href = "/login";
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-select first timetable when data arrives
  useEffect(() => {
    if (gottenTable?.timetables?.length > 0 && !selectedClass) {
      setSelectedClass(gottenTable.timetables[0].name);
    }
  }, [gottenTable, selectedClass]);

  const navProps = {
    userName,
    institutionName,
    notificationCount,
    onLogout: handleLogout,
  };

  // ── Auth loading ──
  if (authLoading) {
    return (
      <StateScreen
        icon={<RefreshCw size={22} />}
        title="Authenticating"
        body="Verifying your session..."
        {...navProps}
      />
    );
  }

  // ── Data loading ──
  if (isLoading) return <LoadingScreen {...navProps} />;

  // ── Error ──
  if (error) {
    return (
      <StateScreen
        icon={<XCircle size={22} />}
        title="Something went wrong"
        body={`We could not load your timetable. ${error}`}
        action={{label: "Try again", fn: () => window.location.reload()}}
        {...navProps}
      />
    );
  }

  // ── No data ──
  if (!gottenTable) {
    return (
      <StateScreen
        icon={<Calendar size={22} />}
        title="No timetable yet"
        body="Generate your first timetable to see it here."
        action={{
          label: "Generate timetable",
          fn: () => (window.location.href = "/generate"),
        }}
        {...navProps}
      />
    );
  }

  // ── Empty timetable list ──
  if (
    !gottenTable.timetables ||
    !Array.isArray(gottenTable.timetables) ||
    gottenTable.timetables.length === 0
  ) {
    return (
      <StateScreen
        icon={<Info size={22} />}
        title="No classes found"
        body="Your timetable was generated but contains no class data. Please check your configuration."
        action={{
          label: "Reconfigure",
          fn: () => (window.location.href = "/setup"),
        }}
        {...navProps}
      />
    );
  }

  // ── Waiting for class selection ──
  if (!selectedClass) {
    return (
      <StateScreen
        icon={<RefreshCw size={22} />}
        title="Initializing"
        body="Setting up your timetable view..."
        {...navProps}
      />
    );
  }

  const {timetables} = gottenTable;
  const selectedTimetable =
    timetables.find((t) => t.name === selectedClass) || timetables[0];
  const schedule = selectedTimetable.schedule || [];
  const config = selectedTimetable.config || {};

  // Compute KPIs
  const allPeriods = schedule.flatMap((d) => d.periods || []);
  const lessons = allPeriods.filter((p) => !p.isBreak && p.subject).length;
  const breaks = allPeriods.filter((p) => p.isBreak).length;
  const doubles = allPeriods.filter(
    (p) => isDoublePeriod(p, config) && !p.isBreak,
  ).length;
  const subjects = new Set(
    allPeriods.filter((p) => p.subject).map((p) => p.subject.name),
  ).size;
  const teachers = new Set(
    allPeriods.filter((p) => p.teacher).map((p) => p.teacher.name),
  ).size;
  const insights = buildInsights(selectedTimetable);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,110,247,0.25); border-radius: 2px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }

        @media (max-width: 767px) {
          .tt-desktop { display: none !important; }
          .tt-mobile { display: block !important; }
          .tt-hero { padding: 48px 20px 36px !important; }
          .tt-metrics { padding: 0 20px 36px !important; }
          .tt-section { padding: 0 20px 36px !important; }
          .tt-footer { padding: 18px 20px !important; flex-direction: column !important; gap: 6px !important; text-align: center; }
        }
        @media (min-width: 768px) {
          .tt-mobile { display: none !important; }
          .tt-desktop { display: block !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Navigation {...navProps} />

      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          color: tk.text1,
          paddingTop: 64,
          fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
        }}
      >
        {/* Ambient */}
        <div
          style={{
            position: "fixed",
            top: -200,
            left: -100,
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(79,110,247,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Hero */}
        <div
          className="tt-hero"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "64px 48px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              fontWeight: 500,
              color: tk.accent,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              background: tk.accentSubtle,
              border: `1px solid ${tk.accentBorder}`,
              borderRadius: 20,
              padding: "5px 13px",
              marginBottom: 20,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: tk.accent,
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />{" "}
            AI Generated Schedule
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 42px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: tk.text1,
              marginBottom: 12,
              maxWidth: 600,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s",
            }}
          >
            {user?.firstName ? `${user.firstName}'s ` : ""}Timetables
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: tk.text2,
              maxWidth: 500,
              marginBottom: 0,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.55s ease 0.16s, transform 0.55s ease 0.16s",
            }}
          >
            Optimized timetables for {institutionName}. Conflict-free scheduling
            powered by Protiba's scheduling intelligence engine.
          </p>
        </div>

        {/* KPI Cards */}
        <div
          className="tt-metrics"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <KpiCard
              icon={<BookOpen size={15} />}
              value={subjects}
              label="Subjects"
              color={{
                bg: tk.accentSubtle,
                border: tk.accentBorder,
                text: tk.accent,
              }}
              delay={0}
            />
            <KpiCard
              icon={<Users size={15} />}
              value={teachers}
              label="Teachers"
              color={{
                bg: tk.violetSubtle,
                border: tk.violetBorder,
                text: tk.violet,
              }}
              delay={60}
            />
            <KpiCard
              icon={<Calendar size={15} />}
              value={schedule.length}
              label="Days"
              color={{bg: tk.tealSubtle, border: tk.tealBorder, text: tk.teal}}
              delay={120}
            />
            <KpiCard
              icon={<Clock size={15} />}
              value={lessons}
              label="Weekly Lessons"
              color={{
                bg: tk.successSubtle,
                border: tk.successBorder,
                text: tk.success,
              }}
              delay={180}
            />
            <KpiCard
              icon={<Layers size={15} />}
              value={doubles}
              label="Double Periods"
              color={{
                bg: tk.violetSubtle,
                border: tk.violetBorder,
                text: tk.violet,
              }}
              delay={240}
            />
            <KpiCard
              icon={<Coffee size={15} />}
              value={breaks}
              label="Break Sessions"
              color={{
                bg: tk.amberSubtle,
                border: tk.amberBorder,
                text: tk.amber,
              }}
              delay={300}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        />

        {/* Timetable */}
        <div
          className="tt-section"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: tk.text3,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Timetable
              </p>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: tk.text1,
                  letterSpacing: "-0.02em",
                }}
              >
                {timetables.length > 1
                  ? "Select a class"
                  : selectedTimetable.name.replace("Timetable for ", "")}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 11,
                color: tk.success,
                background: tk.successSubtle,
                border: `1px solid ${tk.successBorder}`,
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <CheckCircle size={12} /> Conflict-free
            </div>
          </div>
          {timetables.length > 1 && (
            <div style={{marginBottom: 24}}>
              <ClassSelector
                timetables={timetables}
                selected={selectedClass}
                onChange={setSelectedClass}
              />
            </div>
          )}
          <div
            style={{
              background: tk.bg1,
              border: `1px solid ${tk.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div className="tt-desktop">
              <DesktopTimetable timetable={selectedTimetable} />
            </div>
            <div className="tt-mobile" style={{padding: "20px 16px"}}>
              <MobileTimetable timetable={selectedTimetable} />
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div
            className="tt-section"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 48px 48px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: tk.text3,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Scheduling Insights
            </p>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: tk.text1,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              This week at a glance
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {insights.map((ins, i) => (
                <InsightCard key={i} {...ins} delay={i * 60} />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        />
      </div>
    </>
  );
};

export default Timetables;
