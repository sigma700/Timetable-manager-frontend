import React, {useState, useEffect, useRef, useMemo} from "react";
import {useAuthStore} from "../store/authStore";
import {Link} from "react-router-dom";

import HoverDevCards from "./components/gridOPtions";
import {Navigation} from "./components/navigation";
import {useTimetable} from "../hooks/useTimetable";

// ─── Subject color palette ────────────────────────────────────────────────────
const SUBJECT_COLORS = [
  "#EA580C",
  "#DC2626",
  "#2563EB",
  "#16A34A",
  "#0D9488",
  "#7C3AED",
  "#D97706",
  "#059669",
  "#4F46E5",
  "#DB2777",
  "#9333EA",
  "#0891B2",
  "#B45309",
  "#B91C1C",
  "#E11D48",
  "#6D28D9",
  "#0369A1",
  "#0F766E",
  "#B45309",
  "#92400E",
  "#78350F",
  "#44403C",
];

function getSubjectColor(name) {
  if (!name) return "#2B2B2B";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[index];
}

// ─── Animation hook ───────────────────────────────────────────────────────────
function useStaggeredReveal(count, delay = 60) {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    const timers = Array.from({length: count}, (_, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), 120 + i * delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [count, delay]);
  return (i) => visible.includes(i);
}

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({label, value, sub, subColor = "#2B2B2B", icon, delay}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E8",
        borderRadius: 14,
        padding: "18px 20px",
        transition:
          "border-color 0.2s, background 0.2s, transform 0.2s, opacity 0.38s, transform 0.38s",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        cursor: "default",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F8F8F8";
        e.currentTarget.style.borderColor = "#D0D0D0";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#FFFFFF";
        e.currentTarget.style.borderColor = "#E8E8E8";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#898989",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span style={{fontSize: 16, color: "#898989"}}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 500,
          color: "#2B2B2B",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{fontSize: 11, color: subColor, letterSpacing: "0.2px"}}>
        {sub}
      </div>
    </div>
  );
}

// ─── Action card ─────────────────────────────────────────────────────────────
function ActionCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  badge,
  to,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      style={{
        background: hovered ? "#F8F8F8" : "#FFFFFF",
        border: hovered ? "1px solid #D0D0D0" : "1px solid #E8E8E8",
        borderRadius: 14,
        padding: "20px 18px",
        cursor: "pointer",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: "100%",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.04)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontSize: 10,
            fontWeight: 500,
            background: "#E8E8E8",
            color: "#2B2B2B",
            border: "1px solid #D0D0D0",
            padding: "2px 8px",
            borderRadius: 20,
            letterSpacing: "0.3px",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </span>
      )}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
          transition: "transform 0.2s",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#2B2B2B",
            marginBottom: 5,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div style={{fontSize: 12, color: "#898989", lineHeight: 1.6}}>
          {description}
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link
      to={to}
      style={{textDecoration: "none", color: "inherit", display: "block"}}
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

// ─── Timetable cell (colored) ──────────────────────────────────────────────
function TimetableCell({period, isDouble, color}) {
  const [hovered, setHovered] = useState(false);
  if (!period) return <div style={{height: 34}} />;

  const isBreak = period.isBreak;
  const hasSubject = !isBreak && period.subject;
  const isFree = !isBreak && !period.subject;

  // Determine styles based on cell type
  let bg, borderColor, textColor;

  if (isBreak) {
    bg = hovered ? "#E8E8E8" : "#F0F0F0";
    textColor = "#2B2B2B";
    borderColor = "#E8E8E8";
  } else if (isFree) {
    bg = hovered ? "#F0F0F0" : "#F8F8F8";
    textColor = "#898989";
    borderColor = "#E8E8E8";
  } else if (hasSubject && color) {
    // Subject cell with a color
    bg = hovered ? `${color}30` : `${color}20`;
    textColor = color;
    borderColor = hovered ? `${color}60` : `${color}40`;
  } else {
    // Fallback for subject without color (should not happen)
    bg = hovered ? "#E8E8E8" : "#FFFFFF";
    textColor = "#2B2B2B";
    borderColor = "#E8E8E8";
  }

  const label =
    period.subject?.name?.substring(0, 4) || (isBreak ? "Break" : "");

  // Double period: override left border color
  const leftBorderColor =
    isDouble && hasSubject && color ? color : isDouble ? "#2B2B2B" : "none";

  return (
    <div
      style={{
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 500,
        color: textColor,
        background: bg,
        cursor: "default",
        transition: "background 0.15s, transform 0.15s, border-color 0.15s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        borderLeft: isDouble ? `2px solid ${leftBorderColor}` : "none",
        borderRadius: isDouble ? "0 6px 6px 0" : 6,
        border: `1px solid ${borderColor}`,
        borderLeftColor: isDouble ? leftBorderColor : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${period.subject?.name || (isBreak ? "Break" : "Free")}${
        period.startTime ? ` · ${period.startTime}` : ""
      }`}
    >
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          padding: "0 4px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyTimetableState() {
  return (
    <div style={{padding: "56px 24px", textAlign: "center"}}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "#E8E8E8",
          border: "1px solid #D0D0D0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 22,
          color: "#2B2B2B",
        }}
      >
        📅
      </div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "#2B2B2B",
          marginBottom: 8,
        }}
      >
        No timetables yet
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#898989",
          marginBottom: 24,
          lineHeight: 1.7,
          maxWidth: 280,
          margin: "0 auto 24px",
        }}
      >
        Generate your first optimized schedule from your institution's
        constraints and configuration.
      </p>
      <Link
        to="/home/create-table"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 20px",
          background: "#2B2B2B",
          border: "1px solid #2B2B2B",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          color: "#FFFFFF",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1F1F1F";
          e.currentTarget.style.borderColor = "#1F1F1F";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#2B2B2B";
          e.currentTarget.style.borderColor = "#2B2B2B";
        }}
      >
        <span>Generate timetable</span>
        <span style={{fontSize: 15}}>→</span>
      </Link>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({
  label,
  color = "#2B2B2B",
  bg = "#E8E8E8",
  border = "#D0D0D0",
}) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        color,
        background: bg,
        border: `1px solid ${border}`,
        padding: "3px 10px",
        borderRadius: 20,
        letterSpacing: "0.3px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const MainPg = () => {
  const {user, logout, isLoading: authLoading} = useAuthStore();

  const [timetableId, setTimetableId] = useState(() =>
    localStorage.getItem("currentTimetableId"),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setTimetableId(localStorage.getItem("currentTimetableId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const {
    data: timetableData,
    isLoading: timetableLoading,
    isError,
    error: timetableError,
  } = useTimetable(timetableId);

  useEffect(() => {
    if (isError && timetableId) {
      localStorage.removeItem("currentTimetableId");
      setTimetableId(null);
    }
  }, [isError, timetableId]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [pageReady, setPageReady] = useState(false);
  const isVisible = useStaggeredReveal(8, 55);

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";
  const institutionName = "St. Mary's Academy";
  const notificationCount = 3;

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (timetableData?.timetables?.length > 0 && !selectedClass) {
      setSelectedClass(timetableData.timetables[0].name);
    }
  }, [timetableData, selectedClass]);

  const isDoublePeriod = (period) => {
    if (!period?.startTime || !period?.endTime) return false;
    const start = new Date(`2000-01-01T${period.startTime}`);
    const end = new Date(`2000-01-01T${period.endTime}`);
    return (end - start) / 60000 > 40;
  };

  const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "";
    try {
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours, 10);
      if (isNaN(hour)) return timeStr;
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${
        hour >= 12 ? "PM" : "AM"
      }`;
    } catch {
      return timeStr;
    }
  };

  const selectedTimetable =
    timetableData?.timetables?.find((t) => t.name === selectedClass) ||
    timetableData?.timetables?.[0];

  // ─── Build color map for subjects ────────────────────────────────────────
  const subjectColorMap = useMemo(() => {
    if (!selectedTimetable) return {};
    const map = {};
    selectedTimetable.schedule?.forEach((day) => {
      day.periods?.forEach((period) => {
        if (period?.subject?.name) {
          if (!map[period.subject.name]) {
            map[period.subject.name] = getSubjectColor(period.subject.name);
          }
        }
      });
    });
    return map;
  }, [selectedTimetable]);

  const timetableCount = timetableData?.timetables?.length || 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const reveal = (i, extra = {}) => ({
    opacity: isVisible(i) ? 1 : 0,
    transform: isVisible(i) ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    ...extra,
  });

  if (authLoading) {
    return (
      <div
        style={{
          background: "#F8F8F8",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="main-loading-spinner" />
      </div>
    );
  }

  if (timetableLoading) {
    return (
      <div
        style={{
          background: "#F8F8F8",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="main-loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .main-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #E8E8E8;
            border-top-color: #2B2B2B;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      <main
        style={{
          minHeight: "100vh",
          background: "#F8F8F8",
          color: "#2B2B2B",
          overflowX: "hidden",
          position: "relative",
          paddingTop: "68px",
        }}
      >
        {/* Ambient glows removed – replaced with light empty space */}
        <div
          style={{
            position: "fixed",
            top: -300,
            left: -300,
            width: 700,
            height: 700,
            background: "transparent",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: -200,
            right: -200,
            width: 500,
            height: 500,
            background: "transparent",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px 64px",
          }}
        >
          {/* ── Welcome ── */}
          <div style={{...reveal(0), marginBottom: 40}}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#2B2B2B",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 8,
                  }}
                >
                  Operations dashboard
                </div>
                <h1
                  style={{
                    fontSize: 30,
                    fontWeight: 500,
                    color: "#2B2B2B",
                    lineHeight: 1.2,
                    marginBottom: 6,
                    letterSpacing: "-0.4px",
                  }}
                >
                  {getGreeting()},{" "}
                  <span style={{color: "#2B2B2B"}}>{user?.firstName}</span>
                </h1>
                <p style={{fontSize: 14, color: "#898989", lineHeight: 1.6}}>
                  {timetableCount > 0
                    ? `${timetableCount} active schedule${
                        timetableCount > 1 ? "s" : ""
                      } · All systems operational`
                    : "Your institution scheduling workspace is ready."}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <StatusBadge label="● Operational" />
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              ...reveal(0),
              height: "1px",
              background: "#E8E8E8",
              marginBottom: 36,
            }}
          />

          {/* ── Metrics row ── */}
          <div style={{...reveal(1), marginBottom: 36}}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#898989",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 14,
              }}
            >
              Institution overview
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 10,
              }}
            >
              <MetricCard
                label="Schedules"
                value={timetableCount || "—"}
                sub={
                  timetableCount
                    ? `${timetableCount} class group${
                        timetableCount > 1 ? "s" : ""
                      }`
                    : "None generated"
                }
                icon="📋"
                delay={180}
              />
              <MetricCard
                label="Periods scheduled"
                value={timetableCount > 0 ? "47" : "—"}
                sub="Across active tables"
                icon="🕐"
                delay={230}
              />
              <MetricCard
                label="Teachers assigned"
                value={timetableCount > 0 ? "12" : "—"}
                sub="All conflicts resolved"
                subColor="#2B2B2B"
                icon="👥"
                delay={280}
              />
              <MetricCard
                label="Conflicts"
                value={timetableCount > 0 ? "0" : "—"}
                sub="No issues detected"
                subColor="#2B2B2B"
                icon="✓"
                delay={330}
              />
            </div>
          </div>

          {/* ── Section: Quick actions ── */}
          <div style={{...reveal(2), marginBottom: 36}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#898989",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Quick actions
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                borderRadius: 16,
                padding: "4px",
                overflow: "hidden",
              }}
            >
              <HoverDevCards />
            </div>
          </div>

          {/* ── CTA: View timetables ── */}
          <div style={{...reveal(3), marginBottom: 36}}>
            <Link
              to="/home/timetables"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                style={{
                  background: "#2B2B2B",
                  border: "1px solid #2B2B2B",
                  borderRadius: 14,
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1F1F1F";
                  e.currentTarget.style.borderColor = "#1F1F1F";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#2B2B2B";
                  e.currentTarget.style.borderColor = "#2B2B2B";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{display: "flex", alignItems: "center", gap: 14}}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#2B2B2B",
                      flexShrink: 0,
                    }}
                  >
                    📅
                  </div>
                  <div>
                    <div
                      style={{fontSize: 15, fontWeight: 500, color: "#FFFFFF"}}
                    >
                      Full schedule view
                    </div>
                    <div style={{fontSize: 12, color: "#D0D0D0", marginTop: 2}}>
                      Detailed timetables with export, print, and sharing
                      options
                    </div>
                  </div>
                </div>
                <div style={{fontSize: 20, color: "#FFFFFF", flexShrink: 0}}>
                  →
                </div>
              </div>
            </Link>
          </div>

          {/* ── Timetable preview section ── */}
          <div style={reveal(4)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#898989",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Schedule preview
              </div>
              {timetableCount > 0 && (
                <Link
                  to="/home/timetables"
                  style={{
                    fontSize: 12,
                    color: "#2B2B2B",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#898989")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#2B2B2B")
                  }
                >
                  Full view →
                </Link>
              )}
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {timetableCount > 0 ? (
                <>
                  {/* Tab bar */}
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                      padding: "12px 16px",
                      borderBottom: "1px solid #E8E8E8",
                      overflowX: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    {(timetableData?.timetables || []).map((tt) => {
                      const isActive = selectedClass === tt.name;
                      const label = tt.name
                        .replace("Timetable for ", "")
                        .replace("timetable for ", "");
                      return (
                        <button
                          key={tt.name}
                          onClick={() => setSelectedClass(tt.name)}
                          style={{
                            whiteSpace: "nowrap",
                            padding: "6px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            border: "none",
                            outline: "none",
                            transition: "all 0.18s",
                            marginRight: 4,
                            background: isActive ? "#E8E8E8" : "transparent",
                            color: isActive ? "#2B2B2B" : "#898989",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = "#F0F0F0";
                              e.currentTarget.style.color = "#2B2B2B";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#898989";
                            }
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Timetable grid */}
                  <div style={{padding: "16px 16px 0", overflowX: "auto"}}>
                    <div style={{minWidth: 480}}>
                      {/* Days header */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "60px repeat(5, 1fr)",
                          gap: 3,
                          marginBottom: 6,
                        }}
                      >
                        <div />
                        {(selectedTimetable?.schedule?.slice(0, 5) || []).map(
                          (day) => (
                            <div
                              key={day.day}
                              style={{
                                textAlign: "center",
                                fontSize: 11,
                                fontWeight: 500,
                                color: "#898989",
                                padding: "2px 0",
                                textTransform: "uppercase",
                                letterSpacing: "0.4px",
                              }}
                            >
                              {day.day.substring(0, 3)}
                            </div>
                          ),
                        )}
                        {Array.from({
                          length: Math.max(
                            0,
                            5 - (selectedTimetable?.schedule?.length || 0),
                          ),
                        }).map((_, i) => (
                          <div key={`filler-h-${i}`} />
                        ))}
                      </div>

                      {/* Period rows */}
                      {(
                        selectedTimetable?.schedule?.[0]?.periods?.slice(
                          0,
                          6,
                        ) || []
                      ).map((_, periodIdx) => (
                        <div
                          key={`row-${periodIdx}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "60px repeat(5, 1fr)",
                            gap: 3,
                            marginBottom: 3,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: "#898989",
                              display: "flex",
                              alignItems: "center",
                              paddingRight: 8,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatTime(
                              selectedTimetable.schedule[0].periods[periodIdx]
                                ?.startTime,
                            )}
                          </div>
                          {(selectedTimetable?.schedule?.slice(0, 5) || []).map(
                            (day) => {
                              const period = day.periods?.[periodIdx];
                              const color = period?.subject?.name
                                ? subjectColorMap[period.subject.name]
                                : undefined;
                              return (
                                <TimetableCell
                                  key={`${day.day}-${periodIdx}`}
                                  period={period}
                                  isDouble={isDoublePeriod(period)}
                                  color={color}
                                />
                              );
                            },
                          )}
                          {Array.from({
                            length: Math.max(
                              0,
                              5 - (selectedTimetable?.schedule?.length || 0),
                            ),
                          }).map((_, i) => (
                            <div key={`filler-${i}`} style={{height: 34}} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "12px 16px",
                      borderTop: "1px solid #E8E8E8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 12,
                    }}
                  >
                    <div
                      style={{display: "flex", alignItems: "center", gap: 16}}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          color: "#898989",
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            background: "#2B2B2B",
                            display: "inline-block",
                          }}
                        />
                        Subject
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          color: "#898989",
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            background: "#D0D0D0",
                            display: "inline-block",
                          }}
                        />
                        Break
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          color: "#898989",
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            borderLeft: "2px solid #2B2B2B",
                            background: "transparent",
                            display: "inline-block",
                          }}
                        />
                        Double period
                      </span>
                    </div>
                    <Link
                      to="/home/timetables"
                      style={{
                        fontSize: 12,
                        color: "#2B2B2B",
                        textDecoration: "none",
                      }}
                    >
                      View full timetable →
                    </Link>
                  </div>
                </>
              ) : (
                <EmptyTimetableState />
              )}
            </div>
          </div>

          {/* ── Footer trust strip ── */}
          <div
            style={{
              ...reveal(5),
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid #E8E8E8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {[
                "Conflict-free scheduling",
                "Automated generation",
                "Multi-institution support",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "#898989",
                  }}
                >
                  <span style={{color: "#2B2B2B", fontSize: 12}}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainPg;
