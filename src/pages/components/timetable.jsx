import React, {useState, useEffect} from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
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

// ─── Subject colour palette ───────────────────────────────────────────────────
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

// ─── Class Selector ───────────────────────────────────────────────────────────
const ClassSelector = ({timetables, selected, onChange}) => (
  <div
    style={{
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 8,
      marginBottom: 20,
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
            transition: "all 0.18s",
            flexShrink: 0,
          }}
        >
          {name}
        </button>
      );
    })}
  </div>
);

// ─── Desktop Timetable ────────────────────────────────────────────────────────
const DesktopTimetable = ({timetable}) => {
  const [hovCell, setHovCell] = useState(null);
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
            {days.map((day) => (
              <th
                key={day.day}
                style={{
                  padding: "12px 16px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: tk.text2,
                  background: tk.bg2,
                  borderBottom: `1px solid ${tk.border}`,
                  textAlign: "center",
                  minWidth: 140,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                {day.day}
              </th>
            ))}
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
                  const dp = isDoublePeriod(period, config);
                  const isBreak = period?.isBreak;
                  const hasWarn = period?.warning;
                  const subColor = period?.subject
                    ? getSubjectColor(period.subject.name)
                    : null;
                  let bg = tk.bg1;
                  let borderL = `1px solid ${tk.border}`;
                  if (isBreak) bg = tk.amberSubtle;
                  if (hasWarn) bg = tk.dangerSubtle;
                  if (dp) bg = tk.violetSubtle;

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
                                ⚠ {period.warning}
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
};

// ─── Mobile Day View ──────────────────────────────────────────────────────────
const MobileTimetable = ({timetable}) => {
  const days = timetable.schedule || [];
  const [dayIdx, setDayIdx] = useState(0);
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
          return (
            <button
              key={d.day}
              onClick={() => setDayIdx(i)}
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                background: active ? tk.accent : "transparent",
                border: `1px solid ${active ? tk.accent : tk.border}`,
                borderRadius: 9,
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? "#fff" : tk.text2,
                cursor: "pointer",
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
                      ⚠ {period.warning}
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
};

// ─── Main Timetable Component ─────────────────────────────────────────────────
const Timetable = ({timetableResponse}) => {
  if (!timetableResponse) {
    return (
      <div style={{padding: "16px", color: tk.danger}}>
        Error: No timetable response received
      </div>
    );
  }
  if (!timetableResponse.success) {
    return (
      <div style={{padding: "16px", color: tk.danger}}>
        Error: {timetableResponse.message || "Failed to generate timetable"}
      </div>
    );
  }
  if (!timetableResponse.data) {
    return (
      <div style={{padding: "16px", color: tk.text2}}>
        No timetable data available
      </div>
    );
  }
  if (
    !timetableResponse.data.timetables ||
    !Array.isArray(timetableResponse.data.timetables)
  ) {
    return (
      <div style={{padding: "16px", color: tk.text2}}>
        Timetable structure is invalid
      </div>
    );
  }

  const {timetables} = timetableResponse.data;
  if (timetables.length === 0) {
    return (
      <div style={{padding: "16px", color: tk.text2}}>
        No timetables generated
      </div>
    );
  }

  const [selectedClass, setSelectedClass] = useState(timetables[0].name);
  const selectedTimetable =
    timetables.find((t) => t.name === selectedClass) || timetables[0];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={{padding: "20px 0"}}>
      <div style={{marginBottom: 20}}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: tk.text1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {timetables.length > 1
            ? "Select a class"
            : selectedTimetable.name.replace("Timetable for ", "")}
        </h2>
      </div>

      {timetables.length > 1 && (
        <ClassSelector
          timetables={timetables}
          selected={selectedClass}
          onChange={setSelectedClass}
        />
      )}

      <div
        style={{
          background: tk.bg1,
          border: `1px solid ${tk.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {isMobile ? (
          <div style={{padding: "20px 16px"}}>
            <MobileTimetable timetable={selectedTimetable} />
          </div>
        ) : (
          <DesktopTimetable timetable={selectedTimetable} />
        )}
      </div>
    </div>
  );
};

export default Timetable;
