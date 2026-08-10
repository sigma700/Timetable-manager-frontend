import React, {useState, useEffect, useRef, useCallback} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useAuthStore} from "../store/authStore";
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
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  XCircle,
  Info,
  Pencil,
  X,
  Save,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
  Download,
  FileText,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {getTimetable} from "../api/timetable";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const tk = {
  bg0: "#F8F8F8",
  bg1: "#FFFFFF",
  bg2: "#F0F0F0",
  bg3: "#E8E8E8",
  bg4: "#DCDCDC",
  border: "rgba(0,0,0,0.06)",
  borderHov: "rgba(0,0,0,0.12)",
  borderAccent: "rgba(79,110,247,0.28)",
  text1: "#2B2B2B",
  text2: "#898989",
  text3: "#A0A0A0",
  accent: "#4F6EF7",
  accentHov: "#3D5CE8",
  accentSubtle: "rgba(79,110,247,0.08)",
  accentBorder: "rgba(79,110,247,0.2)",
  violet: "#8B5CF6",
  violetSubtle: "rgba(139,92,246,0.08)",
  violetBorder: "rgba(139,92,246,0.2)",
  amber: "#F59E0B",
  amberSubtle: "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.2)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.08)",
  successBorder: "rgba(34,197,94,0.2)",
  danger: "#F87171",
  dangerSubtle: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.2)",
  teal: "#2DD4BF",
  tealSubtle: "rgba(45,212,191,0.08)",
  tealBorder: "rgba(45,212,191,0.2)",
};

// ─── Subject colour palette ────────────────────────────────────────────────────
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

// ─── Hooks ─────────────────────────────────────────────────────────────────────
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(t) {
  if (!t || typeof t !== "string") return "";
  try {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    if (isNaN(hour)) return t;
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  } catch {
    return t;
  }
}
function getPeriodDuration(p) {
  if (!p?.startTime || !p?.endTime) return 0;
  return (
    (new Date(`2000-01-01T${p.endTime}`) -
      new Date(`2000-01-01T${p.startTime}`)) /
    60000
  );
}
function isDoublePeriod(p, cfg) {
  if (!p?.startTime || !p?.endTime) return false;
  return getPeriodDuration(p) > (cfg?.periodDuration || 40);
}
function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

const LOAD_STEPS = [
  {icon: <BookOpen size={16} />, label: "Collecting timetable data"},
  {icon: <Users size={16} />, label: "Analyzing teacher assignments"},
  {icon: <Calendar size={16} />, label: "Organizing subjects"},
  {icon: <AlertTriangle size={16} />, label: "Resolving scheduling conflicts"},
  {icon: <Zap size={16} />, label: "Optimizing schedule layout"},
  {icon: <CheckCircle size={16} />, label: "Finalizing timetable"},
];

// ─── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen({
  userName,
  institutionName,
  notificationCount,
  onLogout,
}) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const s = setInterval(
      () => setStep((p) => Math.min(p + 1, LOAD_STEPS.length - 1)),
      600,
    );
    const p = setInterval(() => setProgress((p) => Math.min(p + 2, 95)), 80);
    return () => {
      clearInterval(s);
      clearInterval(p);
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
          fontFamily: "'Inter',system-ui,sans-serif",
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
              const done = i < step,
                active = i === step;
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
                background: `linear-gradient(90deg,${tk.accent},${tk.violet})`,
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

// ─── State screen ──────────────────────────────────────────────────────────────
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
          fontFamily: "'Inter',system-ui,sans-serif",
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

// ─── KPI Card ──────────────────────────────────────────────────────────────────
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
        transition: `opacity 0.5s ease ${delay}ms,transform 0.5s ease ${delay}ms`,
        cursor: "default",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = tk.borderHov;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = tk.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
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

// ─── Class selector ────────────────────────────────────────────────────────────
function ClassSelector({timetables, selected, onChange}) {
  return (
    <div style={{display: "flex", gap: 7, flexWrap: "wrap"}}>
      {timetables.map((t, i) => {
        const name = t.name?.replace("Timetable for ", "") ?? `Class ${i + 1}`;
        const active = t.name === selected;
        return (
          <button
            key={t.name}
            onClick={() => onChange(t.name)}
            style={{
              padding: "7px 16px",
              background: active ? tk.accent : "transparent",
              border: `1px solid ${active ? tk.accent : tk.border}`,
              borderRadius: 9,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? "#fff" : tk.text2,
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
  );
}

// ─── Slot Edit Modal ───────────────────────────────────────────────────────────
function SlotEditModal({
  slot,
  onClose,
  onSave,
  timetableId,
  classIndex,
  dayIndex,
  periodIndex,
  allSubjects,
  allTeachers,
}) {
  const [selectedSubject, setSelectedSubject] = useState(slot?.subject ?? null);
  const [selectedTeacher, setSelectedTeacher] = useState(slot?.teacher ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef(null);

  // Filter teachers to those who teach the selected subject
  const eligibleTeachers = selectedSubject
    ? allTeachers.filter((t) =>
        t.subjects?.some(
          (s) =>
            s._id === selectedSubject._id || s.name === selectedSubject.name,
        ),
      )
    : allTeachers;

  // Close on overlay click
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset teacher when subject changes and current teacher no longer eligible
  useEffect(() => {
    if (selectedTeacher && selectedSubject) {
      const stillEligible = eligibleTeachers.some(
        (t) => t._id === selectedTeacher._id || t.name === selectedTeacher.name,
      );
      if (!stillEligible) setSelectedTeacher(null);
    }
  }, [selectedSubject]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/timetable/${timetableId}/slot`,
        {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          credentials: "include",
          body: JSON.stringify({
            classIndex,
            dayIndex,
            periodIndex,
            subject: selectedSubject
              ? {_id: selectedSubject._id, name: selectedSubject.name}
              : null,
            teacher: selectedTeacher
              ? {_id: selectedTeacher._id, name: selectedTeacher.name}
              : null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setSuccess(true);
      setTimeout(() => {
        onSave(data.data);
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isBreak = slot?.isBreak;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <div
        style={{
          background: tk.bg1,
          borderRadius: 18,
          width: "100%",
          maxWidth: 460,
          border: `1px solid ${tk.border}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.14),0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
          animation: "slideUp 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: `1px solid ${tk.border}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: tk.accentSubtle,
                  border: `1px solid ${tk.accentBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: tk.accent,
                }}
              >
                <Pencil size={13} />
              </div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: tk.text1,
                  letterSpacing: "-0.02em",
                }}
              >
                Edit Slot
              </h3>
            </div>
            <p style={{fontSize: 12, color: tk.text3, lineHeight: 1.5}}>
              {slot?.startTime && slot?.endTime
                ? `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`
                : "Select period details"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${tk.border}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tk.text3,
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tk.bg2;
              e.currentTarget.style.color = tk.text1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = tk.text3;
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{padding: "20px 24px"}}>
          {isBreak ? (
            <div
              style={{
                padding: "16px",
                background: tk.amberSubtle,
                border: `1px solid ${tk.amberBorder}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Coffee size={16} color={tk.amber} />
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: tk.amber,
                    marginBottom: 2,
                  }}
                >
                  Break Period
                </p>
                <p style={{fontSize: 12, color: tk.text3}}>
                  Break slots cannot be edited. They are fixed by your timetable
                  configuration.
                </p>
              </div>
            </div>
          ) : (
            <div style={{display: "flex", flexDirection: "column", gap: 18}}>
              {/* Current values preview */}
              {(slot?.subject || slot?.teacher) && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: tk.bg2,
                    borderRadius: 10,
                    border: `1px solid ${tk.border}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: tk.text3,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    Current
                  </p>
                  <div style={{display: "flex", gap: 14, flexWrap: "wrap"}}>
                    {slot.subject && (
                      <div
                        style={{display: "flex", alignItems: "center", gap: 6}}
                      >
                        <BookOpen size={12} color={tk.accent} />
                        <span
                          style={{
                            fontSize: 12,
                            color: tk.text2,
                            fontWeight: 500,
                          }}
                        >
                          {slot.subject.name}
                        </span>
                      </div>
                    )}
                    {slot.teacher && (
                      <div
                        style={{display: "flex", alignItems: "center", gap: 6}}
                      >
                        <Users size={12} color={tk.violet} />
                        <span
                          style={{
                            fontSize: 12,
                            color: tk.text2,
                            fontWeight: 500,
                          }}
                        >
                          {slot.teacher.name}
                        </span>
                      </div>
                    )}
                    {!slot.teacher && slot.subject && (
                      <div
                        style={{display: "flex", alignItems: "center", gap: 6}}
                      >
                        <AlertTriangle size={12} color={tk.danger} />
                        <span
                          style={{
                            fontSize: 12,
                            color: tk.danger,
                            fontWeight: 500,
                          }}
                        >
                          No teacher assigned
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Subject select */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: tk.text2,
                    display: "block",
                    marginBottom: 7,
                    letterSpacing: "0.01em",
                  }}
                >
                  Subject
                </label>
                <div style={{position: "relative"}}>
                  <select
                    value={selectedSubject?._id ?? ""}
                    onChange={(e) => {
                      const found = allSubjects.find(
                        (s) => s._id === e.target.value,
                      );
                      setSelectedSubject(found || null);
                      setError(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 12px",
                      fontSize: 13,
                      color: tk.text1,
                      background: tk.bg1,
                      border: `1px solid ${tk.border}`,
                      borderRadius: 10,
                      outline: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      appearance: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = tk.accent)}
                    onBlur={(e) => (e.target.style.borderColor = tk.border)}
                  >
                    <option value="">Select a subject...</option>
                    {allSubjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: tk.text3,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Teacher select */}
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: tk.text2,
                    display: "block",
                    marginBottom: 7,
                    letterSpacing: "0.01em",
                  }}
                >
                  Teacher
                  {selectedSubject && eligibleTeachers.length === 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: tk.danger,
                        fontWeight: 400,
                        marginLeft: 8,
                      }}
                    >
                      No teachers available for this subject
                    </span>
                  )}
                </label>
                <div style={{position: "relative"}}>
                  <select
                    value={selectedTeacher?._id ?? ""}
                    onChange={(e) => {
                      const found = eligibleTeachers.find(
                        (t) => t._id === e.target.value,
                      );
                      setSelectedTeacher(found || null);
                      setError(null);
                    }}
                    disabled={!selectedSubject || eligibleTeachers.length === 0}
                    style={{
                      width: "100%",
                      padding: "10px 36px 10px 12px",
                      fontSize: 13,
                      color: !selectedSubject ? tk.text3 : tk.text1,
                      background: !selectedSubject ? tk.bg2 : tk.bg1,
                      border: `1px solid ${tk.border}`,
                      borderRadius: 10,
                      outline: "none",
                      cursor: !selectedSubject ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      appearance: "none",
                      transition: "border-color 0.15s,background 0.15s",
                      opacity: !selectedSubject ? 0.6 : 1,
                    }}
                    onFocus={(e) => {
                      if (selectedSubject)
                        e.target.style.borderColor = tk.accent;
                    }}
                    onBlur={(e) => (e.target.style.borderColor = tk.border)}
                  >
                    <option value="">Select a teacher...</option>
                    {eligibleTeachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: tk.text3,
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {selectedSubject && eligibleTeachers.length > 0 && (
                  <p style={{fontSize: 11, color: tk.text3, marginTop: 5}}>
                    {eligibleTeachers.length} teacher
                    {eligibleTeachers.length !== 1 ? "s" : ""} available for{" "}
                    {selectedSubject.name}
                  </p>
                )}
              </div>

              {/* Clear option */}
              {(selectedSubject || selectedTeacher) && (
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    setSelectedTeacher(null);
                    setError(null);
                  }}
                  style={{
                    fontSize: 12,
                    color: tk.text3,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    fontFamily: "inherit",
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tk.danger;
                    e.currentTarget.style.textDecorationColor = tk.danger;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = tk.text3;
                    e.currentTarget.style.textDecorationColor = "transparent";
                  }}
                >
                  Clear slot
                </button>
              )}

              {/* Error state */}
              {error && (
                <div
                  style={{
                    padding: "11px 14px",
                    background: tk.dangerSubtle,
                    border: `1px solid ${tk.dangerBorder}`,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 9,
                  }}
                >
                  <AlertCircle
                    size={14}
                    color={tk.danger}
                    style={{flexShrink: 0, marginTop: 1}}
                  />
                  <p style={{fontSize: 12, color: tk.danger, lineHeight: 1.5}}>
                    {error}
                  </p>
                </div>
              )}

              {/* Success state */}
              {success && (
                <div
                  style={{
                    padding: "11px 14px",
                    background: tk.successSubtle,
                    border: `1px solid ${tk.successBorder}`,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <CheckCircle size={14} color={tk.success} />
                  <p style={{fontSize: 12, color: tk.success, fontWeight: 500}}>
                    Slot updated successfully
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isBreak && (
          <div
            style={{
              padding: "14px 24px",
              borderTop: `1px solid ${tk.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              background: tk.bg0,
            }}
          >
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 500,
                color: tk.text2,
                background: "transparent",
                border: `1px solid ${tk.border}`,
                borderRadius: 9,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tk.borderHov;
                e.currentTarget.style.color = tk.text1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tk.border;
                e.currentTarget.style.color = tk.text2;
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || success}
              style={{
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: success
                  ? tk.success
                  : saving
                    ? "rgba(79,110,247,0.7)"
                    : tk.accent,
                border: "none",
                borderRadius: 9,
                cursor: saving || success ? "default" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 7,
                boxShadow:
                  saving || success
                    ? "none"
                    : `0 2px 10px rgba(79,110,247,0.3)`,
              }}
              onMouseEnter={(e) => {
                if (!saving && !success)
                  e.currentTarget.style.background = tk.accentHov;
              }}
              onMouseLeave={(e) => {
                if (!saving && !success)
                  e.currentTarget.style.background = tk.accent;
              }}
            >
              {saving ? (
                <>
                  <Loader2
                    size={13}
                    style={{animation: "spin 0.7s linear infinite"}}
                  />{" "}
                  Saving...
                </>
              ) : success ? (
                <>
                  <Check size={13} /> Saved
                </>
              ) : (
                <>
                  <Save size={13} /> Save changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Desktop Timetable ─────────────────────────────────────────────────────────
function DesktopTimetable({
  timetable,
  timetableId,
  classIndex,
  allSubjects,
  allTeachers,
  onSlotUpdated,
}) {
  const [hovCell, setHovCell] = useState(null);
  const [editSlot, setEditSlot] = useState(null); // { period, dayIndex, periodIndex }
  const todayIdx = getTodayIndex();
  const days = timetable.schedule || [];
  const periods = days[0]?.periods || [];
  const config = timetable.config;

  const handleCellClick = (period, dayIdx, periodIdx) => {
    if (period?.isBreak) return; // breaks are not editable
    setEditSlot({period, dayIndex: dayIdx, periodIndex: periodIdx});
  };

  return (
    <>
      {editSlot && (
        <SlotEditModal
          slot={editSlot.period}
          timetableId={timetableId}
          classIndex={classIndex}
          dayIndex={editSlot.dayIndex}
          periodIndex={editSlot.periodIndex}
          allSubjects={allSubjects}
          allTeachers={allTeachers}
          onClose={() => setEditSlot(null)}
          onSave={(updatedSlot) => {
            onSlotUpdated();
            setEditSlot(null);
          }}
        />
      )}
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
                        di < days.length - 1
                          ? `1px solid ${tk.border}`
                          : "none",
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
                        onClick={() => handleCellClick(period, di, pi)}
                        style={{
                          padding: 0,
                          background: isHov && !isBreak ? tk.bg3 : bg,
                          borderBottom: `1px solid ${tk.border}`,
                          borderRight:
                            di < days.length - 1
                              ? `1px solid ${tk.border}`
                              : "none",
                          borderLeft: borderL,
                          transition: "background 0.15s",
                          verticalAlign: "top",
                          minWidth: 140,
                          cursor: isBreak ? "default" : "pointer",
                          position: "relative",
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
                              {/* Edit hint on hover */}
                              {isHov && (
                                <div
                                  style={{
                                    marginTop: 7,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    fontSize: 10,
                                    color: tk.accent,
                                    fontWeight: 500,
                                  }}
                                >
                                  <Pencil size={10} /> Click to edit
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              <span style={{fontSize: 11, color: tk.text3}}>
                                Free period
                              </span>
                              {isHov && (
                                <div
                                  style={{
                                    marginTop: 5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    fontSize: 10,
                                    color: tk.accent,
                                    fontWeight: 500,
                                  }}
                                >
                                  <Pencil size={10} /> Click to assign
                                </div>
                              )}
                            </div>
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
    </>
  );
}

// ─── Mobile Timetable ──────────────────────────────────────────────────────────
function MobileTimetable({
  timetable,
  timetableId,
  classIndex,
  allSubjects,
  allTeachers,
  onSlotUpdated,
}) {
  const days = timetable.schedule || [];
  const todayIdx = Math.min(getTodayIndex(), days.length - 1);
  const [dayIdx, setDayIdx] = useState(todayIdx >= 0 ? todayIdx : 0);
  const [editSlot, setEditSlot] = useState(null);
  const config = timetable.config;
  const day = days[dayIdx];
  if (!day) return null;

  return (
    <>
      {editSlot && (
        <SlotEditModal
          slot={editSlot.period}
          timetableId={timetableId}
          classIndex={classIndex}
          dayIndex={editSlot.dayIndex}
          periodIndex={editSlot.periodIndex}
          allSubjects={allSubjects}
          allTeachers={allTeachers}
          onClose={() => setEditSlot(null)}
          onSave={() => {
            onSlotUpdated();
            setEditSlot(null);
          }}
        />
      )}
      <div>
        {/* Day tabs */}
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
            const active = i === dayIdx,
              isToday = i === todayIdx;
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

        {/* Period cards */}
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
                onClick={() => {
                  if (!isBreak)
                    setEditSlot({period, dayIndex: dayIdx, periodIndex: idx});
                }}
                style={{
                  background: isBreak ? tk.amberSubtle : tk.bg1,
                  border: `1px solid ${isBreak ? tk.amberBorder : dp ? tk.violetBorder : tk.border}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  borderLeft: `3px solid ${isBreak ? tk.amber : dp ? tk.violet : subColor?.text || tk.border}`,
                  cursor: isBreak ? "default" : "pointer",
                  transition: "all 0.15s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isBreak) {
                    e.currentTarget.style.borderColor = tk.accentBorder;
                    e.currentTarget.style.boxShadow = `0 2px 12px rgba(79,110,247,0.1)`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isBreak
                    ? tk.amberBorder
                    : dp
                      ? tk.violetBorder
                      : tk.border;
                  e.currentTarget.style.boxShadow = "none";
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
                    {formatTime(period.startTime)} –{" "}
                    {formatTime(period.endTime)}
                  </span>
                  <div style={{display: "flex", gap: 6, alignItems: "center"}}>
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
                    {!isBreak && <Pencil size={12} color={tk.text3} />}
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
                      style={{
                        fontSize: 12,
                        color: tk.text3,
                        marginLeft: "auto",
                      }}
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
                  <span style={{fontSize: 13, color: tk.text3}}>
                    Free period — tap to assign
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Insight card ──────────────────────────────────────────────────────────────
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
        transition: `opacity 0.5s ease ${delay}ms,transform 0.5s ease ${delay}ms`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
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
  const doublePeriods = [],
    subjectCount = {},
    teacherPeriods = {};
  let totalBreaks = 0;
  schedule.forEach((day) => {
    let dayLessons = 0;
    day.periods?.forEach((p) => {
      if (p.isBreak) {
        totalBreaks++;
        return;
      }
      if (isDoublePeriod(p, config)) doublePeriods.push(p);
      if (p.subject) {
        subjectCount[p.subject.name] = (subjectCount[p.subject.name] || 0) + 1;
        dayLessons++;
      }
      if (p.teacher) {
        teacherPeriods[p.teacher.name] =
          (teacherPeriods[p.teacher.name] || 0) + 1;
      }
    });
  });
  const topSubject = Object.entries(subjectCount).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topTeacher = Object.entries(teacherPeriods).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const dayLoads = schedule.map((d) => ({
    day: d.day,
    count: d.periods?.filter((p) => !p.isBreak && p.subject).length || 0,
  }));
  const busiestDay = dayLoads.sort((a, b) => b.count - a.count)[0];
  return [
    topSubject && {
      icon: <BookOpen size={13} />,
      label: "Most taught subject",
      value: `${topSubject[0]} - ${topSubject[1]} lessons`,
      color: {bg: tk.accentSubtle, border: tk.accentBorder, text: tk.accent},
    },
    topTeacher && {
      icon: <Award size={13} />,
      label: "Busiest teacher",
      value: `${topTeacher[0]} - ${topTeacher[1]} periods`,
      color: {bg: tk.violetSubtle, border: tk.violetBorder, text: tk.violet},
    },
    busiestDay && {
      icon: <TrendingUp size={13} />,
      label: "Busiest day",
      value: `${busiestDay.day} - ${busiestDay.count} lessons`,
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

// ─── Health check ──────────────────────────────────────────────────────────────
function buildHealthIssues(timetables) {
  const issues = [];
  timetables.forEach((tt) => {
    const className = tt.name?.replace("Timetable for ", "") ?? tt.name;
    (tt.schedule || []).forEach((day) => {
      (day.periods || []).forEach((p, pi) => {
        if (p.isBreak) return;
        if (p.subject && !p.teacher) {
          issues.push({
            className,
            day: day.day,
            period: pi + 1,
            time: `${formatTime(p.startTime)} – ${formatTime(p.endTime)}`,
            subject: p.subject.name,
            type: "unassigned_teacher",
          });
        }
        if (!p.subject && !p.isBreak) {
          issues.push({
            className,
            day: day.day,
            period: pi + 1,
            time: `${formatTime(p.startTime)} – ${formatTime(p.endTime)}`,
            subject: null,
            type: "empty_slot",
          });
        }
      });
    });
  });
  return issues;
}

// ─── PDF download ───────────────────────────────────────────────────────────────
function generateTimetablePDF(timetable, institutionName) {
  const className =
    timetable.name?.replace("Timetable for ", "") ?? timetable.name;
  const days = timetable.schedule || [];
  const periods = days[0]?.periods || [];
  const config = timetable.config || {};

  const cellStyle = `
    border: 1px solid #e5e7eb;
    padding: 8px 10px;
    font-size: 12px;
    vertical-align: top;
    min-width: 120px;
    word-break: break-word;
  `;
  const headerStyle = `
    border: 1px solid #e5e7eb;
    padding: 10px 12px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: #f3f4f6;
    color: #374151;
    text-align: center;
  `;
  const timeStyle = `
    border: 1px solid #e5e7eb;
    padding: 10px 12px;
    font-size: 11px;
    font-weight: 600;
    background: #f9fafb;
    color: #6b7280;
    white-space: nowrap;
    vertical-align: middle;
    min-width: 110px;
  `;

  const rows = periods
    .map((_, pi) => {
      const refP = days[0]?.periods?.[pi];
      const timeLabel = refP
        ? `${formatTime(refP.startTime)} – ${formatTime(refP.endTime)}`
        : `Period ${pi + 1}`;

      const cells = days
        .map((day) => {
          const p = day.periods?.[pi];
          if (!p) return `<td style="${cellStyle}"></td>`;
          if (p.isBreak) {
            return `<td style="${cellStyle} background:#fffbeb; text-align:center; color:#b45309; font-weight:600;">${p.name || "Break"}</td>`;
          }
          const isDouble = isDoublePeriod(p, config);
          const warnTag = p.warning
            ? `<div style="color:#ef4444;font-size:10px;margin-top:4px;">⚠ ${p.warning}</div>`
            : "";
          const noTeacher =
            p.subject && !p.teacher
              ? `<div style="color:#ef4444;font-size:10px;margin-top:4px;">⚠ No teacher assigned</div>`
              : "";
          const doubleBadge = isDouble
            ? `<span style="display:inline-block;background:#ede9fe;color:#7c3aed;font-size:9px;font-weight:700;border-radius:3px;padding:1px 5px;margin-bottom:3px;text-transform:uppercase;">Double</span><br/>`
            : "";
          const subject = p.subject
            ? `<strong style="color:#1f2937;">${p.subject.name}</strong><br/><span style="color:#6b7280;font-size:11px;">${p.teacher?.name || "<em style='color:#ef4444'>Unassigned</em>"}</span>${noTeacher}${warnTag}`
            : `<span style="color:#9ca3af;font-size:11px;">Free period</span>`;
          return `<td style="${cellStyle} ${isDouble ? "background:#faf5ff;" : ""}">${doubleBadge}${subject}</td>`;
        })
        .join("");

      return `<tr><td style="${timeStyle}">${timeLabel}</td>${cells}</tr>`;
    })
    .join("");

  const dayHeaders = days
    .map((d) => `<th style="${headerStyle}">${d.day}</th>`)
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${className} Timetable – ${institutionName}</title>
  <style>
    @page { size: A4 landscape; margin: 18mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #4f6ef7; }
    .header-left h1 { font-size: 20px; font-weight: 800; color: #1f2937; letter-spacing: -0.02em; }
    .header-left p { font-size: 12px; color: #6b7280; margin-top: 3px; }
    .header-right { text-align: right; font-size: 11px; color: #9ca3af; }
    .header-right strong { color: #4f6ef7; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-family: inherit; }
    .legend { margin-top: 16px; display: flex; gap: 18px; font-size: 10px; color: #6b7280; }
    .legend-item { display: flex; align-items: center; gap: 5px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 2px; }
    .footer { margin-top: 20px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${className}</h1>
      <p>${institutionName} – Generated by Protiba</p>
    </div>
    <div class="header-right">
      <strong>Protiba</strong><br/>
      Printed ${new Date().toLocaleDateString("en-GB", {day: "2-digit", month: "long", year: "numeric"})}
    </div>
  </div>
  <table>
    <thead><tr><th style="${headerStyle} text-align:left;">Time</th>${dayHeaders}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#ede9fe;border:1px solid #ddd6fe;"></div> Double period</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fffbeb;border:1px solid #fde68a;"></div> Break</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fef2f2;border:1px solid #fecaca;"></div> Unassigned / Warning</div>
  </div>
  <div class="footer">Protiba Academic Scheduling Infrastructure</div>
</body>
</html>`;

  const w = window.open("", "_blank", "width=1100,height=750");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.onload = () => {
    setTimeout(() => {
      w.focus();
      w.print();
    }, 350);
  };
}

// ─── Download button component ──────────────────────────────────────────────────
function DownloadButton({timetables, institutionName}) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = (tt) => {
    setDownloading(tt.name);
    setTimeout(() => {
      generateTimetablePDF(tt, institutionName);
      setDownloading(null);
      setOpen(false);
    }, 200);
  };

  const handleDownloadAll = () => {
    timetables.forEach((tt, i) => {
      setTimeout(() => generateTimetablePDF(tt, institutionName), i * 800);
    });
    setOpen(false);
  };

  return (
    <div ref={ref} style={{position: "relative"}}>
      <button
        onClick={() =>
          timetables.length === 1
            ? handleDownload(timetables[0])
            : setOpen((o) => !o)
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 16px",
          background: tk.accent,
          color: "#fff",
          border: "none",
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: `0 2px 10px rgba(79,110,247,0.3)`,
          transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = tk.accentHov;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 6px 18px rgba(79,110,247,0.35)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = tk.accent;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 2px 10px rgba(79,110,247,0.3)`;
        }}
      >
        <Download size={14} />
        Download PDF
        {timetables.length > 1 && (
          <ChevronDown
            size={13}
            style={{
              opacity: 0.75,
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          />
        )}
      </button>

      {open && timetables.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 999,
            background: tk.bg1,
            border: `1px solid ${tk.border}`,
            borderRadius: 12,
            overflow: "hidden",
            minWidth: 220,
            boxShadow:
              "0 12px 36px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
            animation: "dropIn 0.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: `1px solid ${tk.border}`,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: tk.text3,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Download timetable
            </p>
          </div>
          {timetables.map((tt) => {
            const name = tt.name?.replace("Timetable for ", "") ?? tt.name;
            const isThis = downloading === tt.name;
            return (
              <button
                key={tt.name}
                onClick={() => handleDownload(tt)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = tk.bg2)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {isThis ? (
                  <Loader2
                    size={14}
                    color={tk.accent}
                    style={{animation: "spin 0.7s linear infinite"}}
                  />
                ) : (
                  <FileText size={14} color={tk.text3} />
                )}
                <span style={{fontSize: 13, color: tk.text1, fontWeight: 500}}>
                  {name}
                </span>
                <ChevronRight
                  size={13}
                  color={tk.text3}
                  style={{marginLeft: "auto"}}
                />
              </button>
            );
          })}
          <div style={{padding: "8px", borderTop: `1px solid ${tk.border}`}}>
            <button
              onClick={handleDownloadAll}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                width: "100%",
                padding: "9px 14px",
                background: tk.accentSubtle,
                border: `1px solid ${tk.accentBorder}`,
                borderRadius: 8,
                color: tk.accent,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(79,110,247,0.14)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = tk.accentSubtle)
              }
            >
              <Download size={13} /> Download all ({timetables.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Health banner ──────────────────────────────────────────────────────────────
function HealthBanner({issues, onDismiss}) {
  const [expanded, setExpanded] = useState(false);
  if (!issues || issues.length === 0) return null;

  const unassigned = issues.filter((i) => i.type === "unassigned_teacher");
  const empty = issues.filter((i) => i.type === "empty_slot");

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 48px 20px",
        position: "relative",
        zIndex: 1,
        animation: "slideDown 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
      className="tt-metrics"
    >
      <div
        style={{
          background: tk.dangerSubtle,
          border: `1px solid ${tk.dangerBorder}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Banner header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            cursor: "pointer",
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: "rgba(248,113,113,0.15)",
              border: `1px solid ${tk.dangerBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tk.danger,
            }}
          >
            <ShieldAlert size={16} />
          </div>
          <div style={{flex: 1}}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#991b1b",
                marginBottom: 1,
              }}
            >
              {issues.length} slot{issues.length !== 1 ? "s" : ""} need
              attention
            </p>
            <p style={{fontSize: 12, color: "#b91c1c"}}>
              {unassigned.length > 0 &&
                `${unassigned.length} unassigned teacher${unassigned.length !== 1 ? "s" : ""}`}
              {unassigned.length > 0 && empty.length > 0 && " · "}
              {empty.length > 0 &&
                `${empty.length} empty slot${empty.length !== 1 ? "s" : ""}`}{" "}
              — click to review
            </p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <ChevronDown
              size={15}
              color="#b91c1c"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "none",
                background: "rgba(248,113,113,0.15)",
                color: "#b91c1c",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(248,113,113,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(248,113,113,0.15)")
              }
              title="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Expanded issue list */}
        {expanded && (
          <div
            style={{
              borderTop: `1px solid ${tk.dangerBorder}`,
              maxHeight: 260,
              overflowY: "auto",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {issues.map((issue, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 18px",
                  borderBottom:
                    i < issues.length - 1
                      ? `1px solid rgba(248,113,113,0.12)`
                      : "none",
                }}
              >
                <AlertTriangle
                  size={12}
                  color={tk.danger}
                  style={{flexShrink: 0}}
                />
                <div style={{flex: 1}}>
                  <span
                    style={{fontSize: 12, fontWeight: 600, color: "#991b1b"}}
                  >
                    {issue.className}
                  </span>
                  <span style={{fontSize: 12, color: "#b91c1c"}}>
                    {" "}
                    · {issue.day}, Period {issue.period} ({issue.time}) ·{" "}
                    {issue.type === "unassigned_teacher"
                      ? `${issue.subject} — no teacher assigned`
                      : "Empty slot"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background:
                      issue.type === "unassigned_teacher"
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(248,113,113,0.15)",
                    color:
                      issue.type === "unassigned_teacher"
                        ? tk.amber
                        : tk.danger,
                    border: `1px solid ${issue.type === "unassigned_teacher" ? tk.amberBorder : tk.dangerBorder}`,
                  }}
                >
                  {issue.type === "unassigned_teacher" ? "No Teacher" : "Empty"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const Timetables = () => {
  const {user, isLoading: authLoading, requiredData} = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: gottenTable,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["timetable", requiredData],
    queryFn: () => getTimetable(requiredData),
    enabled: !!requiredData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Fetch school subjects and teachers for the edit modal
  const [allSubjects, setAllSubjects] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  useEffect(() => {
    if (!gottenTable) return;
    const base = import.meta.env.VITE_BACKEND_URL;
    const opts = {
      method: "GET",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
    };
    Promise.all([
      fetch(`${base}/api/analytics/subjects`, opts).then((r) => r.json()),
      fetch(`${base}/api/analytics/teachers`, opts).then((r) => r.json()),
    ])
      .then(([subRes, tchRes]) => {
        if (subRes?.data?.subjects) {
          setAllSubjects(
            subRes.data.subjects.map((s) => ({
              _id: s.subjectId,
              name: s.subjectName,
            })),
          );
        }
        if (tchRes?.data?.teachers) {
          setAllTeachers(
            tchRes.data.teachers.map((t) => ({
              _id: t.teacherId,
              name: t.teacherName,
              subjects: t.subjects?.map((name) => ({name})) ?? [],
            })),
          );
        }
      })
      .catch(() => {});
  }, [gottenTable]);

  const error = queryError ? queryError.message || "Unknown error" : null;
  const [selectedClass, setSelectedClass] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mounted, setMounted] = useState(false);
  const [healthDismissed, setHealthDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);
  const heroInView = mounted;

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
      console.error(err);
    }
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    if (gottenTable?.timetables?.length > 0 && !selectedClass)
      setSelectedClass(gottenTable.timetables[0].name);
  }, [gottenTable, selectedClass]);

  const navProps = {
    userName,
    institutionName,
    notificationCount,
    onLogout: handleLogout,
  };

  if (authLoading)
    return (
      <StateScreen
        icon={<RefreshCw size={22} />}
        title="Authenticating"
        body="Verifying your session..."
        {...navProps}
      />
    );
  if (isLoading) return <LoadingScreen {...navProps} />;
  if (error)
    return (
      <StateScreen
        icon={<XCircle size={22} />}
        title="Something went wrong"
        body={`We could not load your timetable. ${error}`}
        action={{label: "Try again", fn: () => window.location.reload()}}
        {...navProps}
      />
    );
  if (!gottenTable)
    return (
      <StateScreen
        icon={<Calendar size={22} />}
        title="No timetable yet"
        body="Generate your first timetable to see it here."
        action={{
          label: "Generate timetable",
          fn: () => (window.location.href = "/home/create-table"),
        }}
        {...navProps}
      />
    );
  if (
    !gottenTable.timetables ||
    !Array.isArray(gottenTable.timetables) ||
    gottenTable.timetables.length === 0
  )
    return (
      <StateScreen
        icon={<Info size={22} />}
        title="No classes found"
        body="Your timetable was generated but contains no class data."
        action={{
          label: "Reconfigure",
          fn: () => (window.location.href = "/setup"),
        }}
        {...navProps}
      />
    );
  if (!selectedClass)
    return (
      <StateScreen
        icon={<RefreshCw size={22} />}
        title="Initializing"
        body="Setting up your timetable view..."
        {...navProps}
      />
    );

  const {timetables} = gottenTable;
  const selectedTimetable =
    timetables.find((t) => t.name === selectedClass) || timetables[0];
  const classIndex = timetables.findIndex((t) => t.name === selectedClass);
  const timetableId = gottenTable._id;
  const schedule = selectedTimetable.schedule || [];
  const config = selectedTimetable.config || {};
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
  const healthIssues = buildHealthIssues(timetables);

  // After a slot is saved, refetch to get fresh data
  const handleSlotUpdated = () => {
    queryClient.invalidateQueries({queryKey: ["timetable", requiredData]});
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:2px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.9}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(max-width:767px){
          .tt-desktop{display:none!important;}
          .tt-mobile{display:block!important;}
          .tt-hero{padding:48px 20px 36px!important;}
          .tt-metrics{padding:0 20px 36px!important;}
          .tt-section{padding:0 20px 36px!important;}
        }
        @media(min-width:768px){
          .tt-mobile{display:none!important;}
          .tt-desktop{display:block!important;}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
        }
      `}</style>

      <Navigation {...navProps} />

      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          color: tk.text1,
          paddingTop: 64,
          fontFamily: "'Inter','SF Pro Text',system-ui,sans-serif",
        }}
      >
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
              transition: "opacity 0.5s ease,transform 0.5s ease",
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
            />
            AI Generated Schedule
          </div>
          <h1
            style={{
              fontSize: "clamp(26px,4vw,42px)",
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: tk.text1,
              marginBottom: 12,
              maxWidth: 600,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.55s ease 0.08s,transform 0.55s ease 0.08s",
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
              transition: "opacity 0.55s ease 0.16s,transform 0.55s ease 0.16s",
            }}
          >
            Optimized timetables for {institutionName}. Click any slot to edit
            subject and teacher assignments.
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
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
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

        {/* Health Banner */}
        {!healthDismissed && (
          <HealthBanner
            issues={healthIssues}
            onDismiss={() => setHealthDismissed(true)}
          />
        )}

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
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              {/* Download button */}
              <DownloadButton
                timetables={timetables}
                institutionName={institutionName}
              />
              {/* Edit hint */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: tk.text3,
                  background: tk.bg2,
                  border: `1px solid ${tk.border}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                }}
              >
                <Pencil size={11} /> Click any slot to edit
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
              <DesktopTimetable
                timetable={selectedTimetable}
                timetableId={timetableId}
                classIndex={classIndex}
                allSubjects={allSubjects}
                allTeachers={allTeachers}
                onSlotUpdated={handleSlotUpdated}
              />
            </div>
            <div className="tt-mobile" style={{padding: "20px 16px"}}>
              <MobileTimetable
                timetable={selectedTimetable}
                timetableId={timetableId}
                classIndex={classIndex}
                allSubjects={allSubjects}
                allTeachers={allTeachers}
                onSlotUpdated={handleSlotUpdated}
              />
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
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 12,
              }}
            >
              {insights.map((ins, i) => (
                <InsightCard key={i} {...ins} delay={i * 60} />
              ))}
            </div>
          </div>
        )}

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
