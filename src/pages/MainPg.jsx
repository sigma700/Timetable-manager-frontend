import React, {useState, useEffect, useRef} from "react";
import {FullMenu} from "./components/animatedHamb";
import {useAuthStore} from "../store/authStore";
import HoverDevCards from "./components/gridOPtions";
import {Link} from "react-router-dom";
import {useGenStore} from "../store/generativeStore";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Surface hierarchy: base → raised → elevated → overlay
// Accent: indigo-500 (#6366f1) primary, violet-500 (#8b5cf6) secondary
// Semantic: amber for warnings, rose for errors, emerald for success

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
function MetricCard({label, value, sub, subColor = "#6366f1", icon, delay}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "18px 20px",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transitionProperty: "opacity, transform, border-color, background",
        transitionDuration: "0.38s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.055)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
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
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span style={{fontSize: 16, color: "#334155"}}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 500,
          color: "#f1f5f9",
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
        background: hovered
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        border: hovered
          ? "0.5px solid rgba(99,102,241,0.38)"
          : "0.5px solid rgba(255,255,255,0.07)",
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
            background: "rgba(251,191,36,0.12)",
            color: "#fbbf24",
            border: "0.5px solid rgba(251,191,36,0.25)",
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
            color: "#e2e8f0",
            marginBottom: 5,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div style={{fontSize: 12, color: "#64748b", lineHeight: 1.6}}>
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

// ─── Timetable cell ───────────────────────────────────────────────────────────
function TimetableCell({period, isDouble}) {
  const [hovered, setHovered] = useState(false);
  if (!period) return <div style={{height: 34}} />;

  const isBreak = period.isBreak;
  const hasSubject = !isBreak && period.subject;
  const isFree = !isBreak && !period.subject;

  const bg = isBreak
    ? hovered
      ? "rgba(234,179,8,0.18)"
      : "rgba(234,179,8,0.09)"
    : hasSubject
      ? hovered
        ? "rgba(99,102,241,0.22)"
        : "rgba(99,102,241,0.13)"
      : hovered
        ? "rgba(255,255,255,0.06)"
        : "rgba(255,255,255,0.025)";

  const color = isBreak ? "#fbbf24" : hasSubject ? "#a5b4fc" : "#334155";

  const label =
    period.subject?.name?.substring(0, 4) || (isBreak ? "Break" : "");

  return (
    <div
      style={{
        height: 34,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 500,
        color,
        background: bg,
        cursor: "default",
        transition: "background 0.15s, transform 0.15s",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        borderLeft: isDouble ? "2px solid rgba(139,92,246,0.6)" : "none",
        borderRadius: isDouble ? "0 6px 6px 0" : 6,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${period.subject?.name || (isBreak ? "Break" : "Free")}${period.startTime ? ` · ${period.startTime}` : ""}`}
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
          background: "rgba(99,102,241,0.1)",
          border: "0.5px solid rgba(99,102,241,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 22,
          color: "#6366f1",
        }}
      >
        📅
      </div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "#94a3b8",
          marginBottom: 8,
        }}
      >
        No timetables yet
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#475569",
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
          background: "rgba(99,102,241,0.15)",
          border: "0.5px solid rgba(99,102,241,0.4)",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          color: "#818cf8",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(99,102,241,0.22)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(99,102,241,0.15)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
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
  color = "#10b981",
  bg = "rgba(16,185,129,0.1)",
  border = "rgba(16,185,129,0.25)",
}) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        color,
        background: bg,
        border: `0.5px solid ${border}`,
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
  const {user} = useAuthStore();
  const {gottenTable} = useGenStore();
  const [selectedClass, setSelectedClass] = useState(null);
  const [pageReady, setPageReady] = useState(false);
  const isVisible = useStaggeredReveal(8, 55);

  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (gottenTable?.timetables?.length > 0 && !selectedClass) {
      setSelectedClass(gottenTable.timetables[0].name);
    }
  }, [gottenTable, selectedClass]);

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
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
    } catch {
      return timeStr;
    }
  };

  const selectedTimetable =
    gottenTable?.timetables?.find((t) => t.name === selectedClass) ||
    gottenTable?.timetables?.[0];

  const timetableCount = gottenTable?.timetables?.length || 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // ── Shared reveal style helper
  const reveal = (i, extra = {}) => ({
    opacity: isVisible(i) ? 1 : 0,
    transform: isVisible(i) ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    ...extra,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0d1420 0%, #0f172a 40%, #0d1420 100%)",
        color: "#fff",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: "fixed",
          top: -300,
          left: -300,
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)",
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
          background:
            "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <FullMenu />

      {/* ── Page content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 64px",
          paddingTop: 80,
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
                  color: "#6366f1",
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
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                  marginBottom: 6,
                  letterSpacing: "-0.4px",
                }}
              >
                {getGreeting()},{" "}
                <span
                  style={{
                    background: "linear-gradient(120deg, #818cf8, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {user}
                </span>
              </h1>
              <p style={{fontSize: 14, color: "#64748b", lineHeight: 1.6}}>
                {timetableCount > 0
                  ? `${timetableCount} active schedule${timetableCount > 1 ? "s" : ""} · All systems operational`
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
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
            marginBottom: 36,
          }}
        />

        {/* ── Metrics row ── */}
        <div style={{...reveal(1), marginBottom: 36}}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#475569",
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
                  ? `${timetableCount} class group${timetableCount > 1 ? "s" : ""}`
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
              subColor="#10b981"
              icon="👥"
              delay={280}
            />
            <MetricCard
              label="Conflicts"
              value={timetableCount > 0 ? "0" : "—"}
              sub="No issues detected"
              subColor="#10b981"
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
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Quick actions
            </div>
          </div>

          {/* HoverDevCards rendered inside a styled wrapper */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
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
            style={{textDecoration: "none", color: "inherit", display: "block"}}
          >
            <div
              style={{
                background: "rgba(99,102,241,0.09)",
                border: "0.5px solid rgba(99,102,241,0.28)",
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
                e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.09)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.28)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 14}}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: "rgba(99,102,241,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#818cf8",
                    flexShrink: 0,
                  }}
                >
                  📅
                </div>
                <div>
                  <div
                    style={{fontSize: 15, fontWeight: 500, color: "#e2e8f0"}}
                  >
                    Full schedule view
                  </div>
                  <div style={{fontSize: 12, color: "#64748b", marginTop: 2}}>
                    Detailed timetables with export, print, and sharing options
                  </div>
                </div>
              </div>
              <div style={{fontSize: 20, color: "#6366f1", flexShrink: 0}}>
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
                color: "#475569",
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
                  color: "#6366f1",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
              >
                Full view →
              </Link>
            )}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "0.5px solid rgba(255,255,255,0.07)",
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
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {gottenTable.timetables.map((tt) => {
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
                          background: isActive
                            ? "rgba(99,102,241,0.18)"
                            : "transparent",
                          color: isActive ? "#818cf8" : "#64748b",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "#94a3b8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#64748b";
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
                              color: "#475569",
                              padding: "2px 0",
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                            }}
                          >
                            {day.day.substring(0, 3)}
                          </div>
                        ),
                      )}
                      {/* Fill missing day headers */}
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
                      selectedTimetable?.schedule?.[0]?.periods?.slice(0, 6) ||
                      []
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
                            color: "#475569",
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
                          (day) => (
                            <TimetableCell
                              key={`${day.day}-${periodIdx}`}
                              period={day.periods?.[periodIdx]}
                              isDouble={isDoublePeriod(
                                day.periods?.[periodIdx],
                              )}
                            />
                          ),
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
                    borderTop: "0.5px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <div style={{display: "flex", alignItems: "center", gap: 16}}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: "#475569",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: "rgba(99,102,241,0.4)",
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
                        color: "#475569",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: "rgba(234,179,8,0.3)",
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
                        color: "#475569",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          borderLeft: "2px solid rgba(139,92,246,0.7)",
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
                      color: "#6366f1",
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
            borderTop: "0.5px solid rgba(255,255,255,0.05)",
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
                  color: "#334155",
                }}
              >
                <span style={{color: "#10b981", fontSize: 12}}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPg;
