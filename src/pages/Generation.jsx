import React, {useState, useCallback, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGenStore} from "../store/generativeStore";
import {Navigation} from "./components/navigation";
import {useAuthStore} from "../store/authStore";
import {
  Settings,
  Clock,
  Coffee,
  Zap,
  BookOpen,
  Users,
  Calendar,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  GraduationCap,
  FlaskConical,
  Sun,
  Moon,
  School,
} from "lucide-react";

// ─── Tokens ────────────────────────────────────────────────────────────────────
const tk = {
  bg0: "#F7F7F8",
  bg1: "#FFFFFF",
  bg2: "#F0F0F2",
  bg3: "#E6E6EA",
  border: "rgba(0,0,0,0.07)",
  borderHov: "rgba(0,0,0,0.14)",
  borderAccent: "rgba(79,110,247,0.3)",
  text1: "#1A1A2E",
  text2: "#6B6B80",
  text3: "#9898A8",
  accent: "#4F6EF7",
  accentHov: "#3A58E0",
  accentSubtle: "rgba(79,110,247,0.08)",
  accentBorder: "rgba(79,110,247,0.22)",
  violet: "#7C3AED",
  violetSubtle: "rgba(124,58,237,0.08)",
  violetBorder: "rgba(124,58,237,0.2)",
  success: "#16A34A",
  successSubtle: "rgba(22,163,74,0.08)",
  successBorder: "rgba(22,163,74,0.2)",
  warning: "#D97706",
  warningSubtle: "rgba(217,119,6,0.08)",
  warningBorder: "rgba(217,119,6,0.2)",
  danger: "#DC2626",
  dangerSubtle: "rgba(220,38,38,0.08)",
  dangerBorder: "rgba(220,38,38,0.2)",
  amber: "#F59E0B",
  amberSubtle: "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.2)",
};

// ─── Kenyan default config ──────────────────────────────────────────────────────
const KENYAN_DEFAULTS = {
  name: "",
  school: "", // Added school field
  periodsPerDay: 9,
  periodDuration: 40,
  startTime: "08:00",
  maxTeacherPeriods: 30,
  breaks: [
    {name: "Tea Break", afterPeriod: 4, duration: 15},
    {name: "Lunch Break", afterPeriod: 7, duration: 40},
  ],
  doublePeriods: [],
  subjectWeeklyFrequency: [],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ─── Input component ──────────────────────────────────────────────────────────
function Input({
  label,
  helper,
  value,
  onChange,
  type = "text",
  min,
  max,
  placeholder,
  suffix,
  required = false,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 5}}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: tk.text2,
            letterSpacing: "0.01em",
          }}
        >
          {label}
          {required && <span style={{color: tk.danger, marginLeft: 2}}>*</span>}
        </label>
      )}
      {helper && (
        <p style={{fontSize: 11, color: tk.text3, marginTop: -2}}>{helper}</p>
      )}
      <div
        style={{position: "relative", display: "flex", alignItems: "center"}}
      >
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(
              type === "number" ? Number(e.target.value) : e.target.value,
            )
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: suffix ? "10px 40px 10px 12px" : "10px 12px",
            fontSize: 13,
            color: tk.text1,
            background: tk.bg1,
            fontFamily: "inherit",
            border: `1px solid ${focused ? tk.accent : tk.border}`,
            borderRadius: 9,
            outline: "none",
            transition: "border-color 0.15s",
            boxShadow: focused ? `0 0 0 3px ${tk.accentSubtle}` : "none",
          }}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 12,
              fontSize: 12,
              color: tk.text3,
              pointerEvents: "none",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section card ──────────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  subtitle,
  children,
  collapsible = false,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: tk.bg1,
        border: `1px solid ${tk.border}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          borderBottom: open ? `1px solid ${tk.border}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: collapsible ? "pointer" : "default",
        }}
        onClick={() => collapsible && setOpen((o) => !o)}
      >
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: tk.accentSubtle,
              border: `1px solid ${tk.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tk.accent,
            }}
          >
            {icon}
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: tk.text1,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </p>
            {subtitle && (
              <p style={{fontSize: 11, color: tk.text3, marginTop: 1}}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {collapsible &&
          (open ? (
            <ChevronUp size={16} color={tk.text3} />
          ) : (
            <ChevronDown size={16} color={tk.text3} />
          ))}
      </div>
      {open && <div style={{padding: "20px 22px"}}>{children}</div>}
    </div>
  );
}

// ─── Tag/pill toggle ───────────────────────────────────────────────────────────
function TagToggle({label, active, onClick, color = "accent"}) {
  const colors = {
    accent: {bg: tk.accentSubtle, border: tk.accentBorder, text: tk.accent},
    violet: {bg: tk.violetSubtle, border: tk.violetBorder, text: tk.violet},
    amber: {bg: tk.amberSubtle, border: tk.amberBorder, text: tk.amber},
  };
  const c = active
    ? colors[color]
    : {bg: "transparent", border: tk.border, text: tk.text3};
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── Break editor ──────────────────────────────────────────────────────────────
function BreakEditor({breaks, onChange, maxPeriod}) {
  const add = () =>
    onChange([...breaks, {name: "Break", afterPeriod: 4, duration: 15}]);
  const remove = (i) => onChange(breaks.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const next = [...breaks];
    next[i] = {...next[i], [field]: val};
    onChange(next);
  };
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
      {breaks.map((brk, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto auto",
            gap: 10,
            alignItems: "end",
            padding: "14px 16px",
            background: tk.bg0,
            border: `1px solid ${tk.border}`,
            borderRadius: 10,
          }}
        >
          <Input
            label="Break name"
            value={brk.name}
            onChange={(v) => update(i, "name", v)}
            placeholder="e.g. Tea Break"
          />
          <Input
            label="After period"
            type="number"
            value={brk.afterPeriod}
            onChange={(v) => update(i, "afterPeriod", v)}
            min={1}
            max={maxPeriod}
            suffix="th"
          />
          <Input
            label="Duration"
            type="number"
            value={brk.duration}
            onChange={(v) => update(i, "duration", v)}
            min={5}
            max={120}
            suffix="min"
          />
          <button
            onClick={() => remove(i)}
            style={{
              padding: "10px",
              background: tk.dangerSubtle,
              border: `1px solid ${tk.dangerBorder}`,
              borderRadius: 9,
              cursor: "pointer",
              color: tk.danger,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 17,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{
          padding: "10px 16px",
          background: "transparent",
          border: `1px dashed ${tk.border}`,
          borderRadius: 10,
          cursor: "pointer",
          color: tk.text3,
          fontSize: 13,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 7,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tk.accent;
          e.currentTarget.style.color = tk.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = tk.border;
          e.currentTarget.style.color = tk.text3;
        }}
      >
        <Plus size={14} /> Add break
      </button>
    </div>
  );
}

// ─── Double period editor ──────────────────────────────────────────────────────
function DoublePeriodEditor({doubles, onChange, maxPeriod}) {
  const add = () => onChange([...doubles, {day: "Monday", period: 1}]);
  const remove = (i) => onChange(doubles.filter((_, idx) => idx !== i));
  const update = (i, field, val) => {
    const next = [...doubles];
    next[i] = {...next[i], [field]: val};
    onChange(next);
  };
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
      {doubles.map((dp, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: 10,
            alignItems: "end",
            padding: "14px 16px",
            background: tk.bg0,
            border: `1px solid ${tk.border}`,
            borderRadius: 10,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: tk.text2,
                display: "block",
                marginBottom: 5,
              }}
            >
              Day
            </label>
            <div style={{position: "relative"}}>
              <select
                value={dp.day}
                onChange={(e) => update(i, "day", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 28px 10px 12px",
                  fontSize: 13,
                  color: tk.text1,
                  background: tk.bg1,
                  border: `1px solid ${tk.border}`,
                  borderRadius: 9,
                  outline: "none",
                  fontFamily: "inherit",
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: tk.text3,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
          <Input
            label="Starting period"
            type="number"
            value={dp.period}
            onChange={(v) => update(i, "period", v)}
            min={1}
            max={maxPeriod - 1}
          />
          <button
            onClick={() => remove(i)}
            style={{
              padding: "10px",
              background: tk.dangerSubtle,
              border: `1px solid ${tk.dangerBorder}`,
              borderRadius: 9,
              cursor: "pointer",
              color: tk.danger,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 17,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{
          padding: "10px 16px",
          background: "transparent",
          border: `1px dashed ${tk.border}`,
          borderRadius: 10,
          cursor: "pointer",
          color: tk.text3,
          fontSize: 13,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 7,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tk.violet;
          e.currentTarget.style.color = tk.violet;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = tk.border;
          e.currentTarget.style.color = tk.text3;
        }}
      >
        <Plus size={14} /> Add double period
      </button>
    </div>
  );
}

// ─── Weekly frequency editor ───────────────────────────────────────────────────
function FrequencyEditor({items, onChange, subjects}) {
  const added = new Set(items.map((i) => i.subject));
  const add = (subjectId) => {
    if (!subjectId || added.has(subjectId)) return;
    onChange([...items, {subject: subjectId, requiredPeriods: 4}]);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, val) => {
    const next = [...items];
    next[i] = {...next[i], requiredPeriods: val};
    onChange(next);
  };
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
      {items.map((item, i) => {
        const subj = subjects.find(
          (s) => s._id === item.subject || s._id?.toString() === item.subject,
        );
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 10,
              alignItems: "center",
              padding: "12px 16px",
              background: tk.bg0,
              border: `1px solid ${tk.border}`,
              borderRadius: 10,
            }}
          >
            <div style={{display: "flex", alignItems: "center", gap: 9}}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: tk.accent,
                  flexShrink: 0,
                }}
              />
              <span style={{fontSize: 13, fontWeight: 500, color: tk.text1}}>
                {subj?.name ?? item.subject}
              </span>
            </div>
            <Input
              type="number"
              value={item.requiredPeriods}
              onChange={(v) => update(i, v)}
              min={1}
              max={10}
              suffix="x/wk"
            />
            <button
              onClick={() => remove(i)}
              style={{
                padding: "8px",
                background: tk.dangerSubtle,
                border: `1px solid ${tk.dangerBorder}`,
                borderRadius: 8,
                cursor: "pointer",
                color: tk.danger,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
      {subjects.length > 0 && (
        <div style={{position: "relative"}}>
          <select
            defaultValue=""
            onChange={(e) => {
              add(e.target.value);
              e.target.value = "";
            }}
            style={{
              width: "100%",
              padding: "10px 28px 10px 12px",
              fontSize: 13,
              color: tk.text2,
              background: "transparent",
              border: `1px dashed ${tk.border}`,
              borderRadius: 10,
              outline: "none",
              fontFamily: "inherit",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            <option value="">+ Set weekly frequency for a subject...</option>
            {subjects
              .filter((s) => !added.has(s._id?.toString() ?? s._id))
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>
          <ChevronDown
            size={13}
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
      )}
    </div>
  );
}

// ─── Preset cards ──────────────────────────────────────────────────────────────
const PRESETS = [
  {
    id: "standard",
    label: "Standard Day",
    icon: <Clock size={16} />,
    desc: "8 periods · 40 min · Tea + Lunch break",
    color: "accent",
    config: {
      periodsPerDay: 8,
      periodDuration: 40,
      startTime: "08:00",
      breaks: [
        {name: "Tea Break", afterPeriod: 4, duration: 15},
        {name: "Lunch Break", afterPeriod: 6, duration: 40},
      ],
      doublePeriods: [],
    },
  },
  {
    id: "boarding",
    label: "Boarding School",
    icon: <Moon size={16} />,
    desc: "9 periods · 35 min · Three breaks",
    color: "violet",
    config: {
      periodsPerDay: 9,
      periodDuration: 35,
      startTime: "07:30",
      breaks: [
        {name: "Morning Break", afterPeriod: 3, duration: 15},
        {name: "Lunch", afterPeriod: 6, duration: 45},
        {name: "Afternoon Break", afterPeriod: 8, duration: 10},
      ],
      doublePeriods: [],
    },
  },
  {
    id: "examprep",
    label: "Exam Prep",
    icon: <GraduationCap size={16} />,
    desc: "10 periods · 35 min · Extended schedule",
    color: "amber",
    config: {
      periodsPerDay: 10,
      periodDuration: 35,
      startTime: "08:00",
      breaks: [
        {name: "Tea Break", afterPeriod: 4, duration: 15},
        {name: "Lunch Break", afterPeriod: 7, duration: 40},
      ],
      doublePeriods: [],
    },
  },
];

// ─── Main component ────────────────────────────────────────────────────────────
const Generation = () => {
  const navigate = useNavigate();
  const {generateTabel, isLoading, idOfSchool, relValue} = useGenStore();
  const {user} = useAuthStore();

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";
  const institutionName = user?.institutionName || "Your Institution";

  const [cfg, setCfg] = useState({...KENYAN_DEFAULTS});
  const [subjects, setSubjects] = useState([]); // populated from school if available
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const set = useCallback(
    (field, value) => setCfg((prev) => ({...prev, [field]: value})),
    [],
  );

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setCfg((prev) => ({...prev, ...preset.config}));
  };

  const validate = () => {
    if (!cfg.name.trim()) return "Please enter a timetable name.";
    if (!cfg.school && !idOfSchool) {
      return "Please enter a School ID or ensure your account is linked to a school.";
    }
    if (cfg.periodsPerDay < 1) return "Periods per day must be at least 1.";
    if (cfg.periodDuration < 10)
      return "Period duration must be at least 10 minutes.";
    if (!cfg.startTime) return "Please set a start time.";
    for (const brk of cfg.breaks) {
      if (brk.afterPeriod > cfg.periodsPerDay)
        return `Break "${brk.name}" is set after period ${brk.afterPeriod} but you only have ${cfg.periodsPerDay} periods.`;
    }
    return null;
  };

  const handleGenerate = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      const config = {
        periodsPerDay: cfg.periodsPerDay,
        periodDuration: cfg.periodDuration,
        startTime: cfg.startTime,
        breaks: cfg.breaks,
        doublePeriods: cfg.doublePeriods,
        maxTeacherPeriods: cfg.maxTeacherPeriods,
      };
      const constraints = {
        subjectWeeklyFrequency: cfg.subjectWeeklyFrequency,
      };

      // Use the school ID from form or from store
      const schoolId = cfg.school || idOfSchool;

      const data = await generateTabel(
        cfg.name.trim(),
        config,
        constraints,
        schoolId,
      );
      if (data?.success || data?.data) {
        setSuccess(true);
        setTimeout(() => navigate("/home/timetables"), 1200);
      } else {
        setError(
          data?.message || "Generation failed. Please check your school data.",
        );
      }
    } catch (e) {
      setError(e.message || "An error occurred during generation.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch {}
  };

  // Auto-fill school ID from store if available
  useEffect(() => {
    if (idOfSchool && !cfg.school) {
      setCfg((prev) => ({...prev, school: idOfSchool}));
    }
  }, [idOfSchool]);

  // Computed preview
  const totalMins =
    cfg.breaks.reduce((s, b) => s + b.duration, 0) +
    cfg.periodsPerDay * cfg.periodDuration;
  const endHour = cfg.startTime
    ? (() => {
        const [h, m] = cfg.startTime.split(":").map(Number);
        const end = h * 60 + m + totalMins;
        return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
      })()
    : "";

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .gen-anim{animation:fadeIn 0.4s ease forwards;}
        @media(max-width:768px){
          .gen-grid{grid-template-columns:1fr!important;}
          .gen-main{padding:0 16px 80px!important;}
        }
      `}</style>

      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={0}
        onLogout={handleLogout}
      />

      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          paddingTop: 64,
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        {/* Hero */}
        <div
          style={{maxWidth: 960, margin: "0 auto", padding: "52px 24px 36px"}}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              fontWeight: 600,
              color: tk.accent,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              background: tk.accentSubtle,
              border: `1px solid ${tk.accentBorder}`,
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: 18,
            }}
          >
            <Zap size={12} /> Timetable Generator
          </div>
          <h1
            style={{
              fontSize: "clamp(24px,3.5vw,36px)",
              fontWeight: 700,
              color: tk.text1,
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            Configure your timetable
          </h1>
          <p
            style={{
              fontSize: 14,
              color: tk.text2,
              lineHeight: 1.7,
              maxWidth: 580,
            }}
          >
            Set up your institution's schedule. Protiba will generate a
            conflict-free, Kenyan curriculum-compliant timetable automatically.
          </p>
        </div>

        <div
          className="gen-main"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px 80px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Presets */}
          <div
            style={{
              background: tk.bg1,
              border: `1px solid ${tk.border}`,
              borderRadius: 14,
              padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: tk.text2,
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Quick start presets
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 10,
              }}
            >
              {PRESETS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 11,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    border: `1px solid ${activePreset === p.id ? tk.accent : tk.border}`,
                    background:
                      activePreset === p.id ? tk.accentSubtle : tk.bg0,
                  }}
                  onMouseEnter={(e) => {
                    if (activePreset !== p.id) {
                      e.currentTarget.style.borderColor = tk.borderHov;
                      e.currentTarget.style.background = tk.bg2;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activePreset !== p.id) {
                      e.currentTarget.style.borderColor = tk.border;
                      e.currentTarget.style.background = tk.bg0;
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        color: activePreset === p.id ? tk.accent : tk.text3,
                      }}
                    >
                      {p.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: activePreset === p.id ? tk.accent : tk.text1,
                      }}
                    >
                      {p.label}
                    </span>
                    {activePreset === p.id && (
                      <CheckCircle
                        size={13}
                        color={tk.accent}
                        style={{marginLeft: "auto"}}
                      />
                    )}
                  </div>
                  <p style={{fontSize: 12, color: tk.text3}}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Institution & Timetable Name - Combined Section */}
          <Section
            icon={<School size={15} />}
            title="Institution & Timetable"
            subtitle="Name your timetable and link it to your school"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Input
                label="Timetable Name"
                value={cfg.name}
                onChange={(v) => set("name", v)}
                placeholder="e.g. Term 1 2026 — Form 2"
                required
                helper="This appears on all generated reports and exports"
              />
              <Input
                label="School ID"
                value={cfg.school}
                onChange={(v) => set("school", v)}
                placeholder={idOfSchool || "Enter school ID or auto-filled"}
                helper="Auto-filled if you're logged into a school account"
              />
            </div>
            {idOfSchool && !cfg.school && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: tk.successSubtle,
                  border: `1px solid ${tk.successBorder}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircle size={14} color={tk.success} />
                <span style={{fontSize: 12, color: tk.success}}>
                  Auto-linked to your school account (ID: {idOfSchool})
                </span>
              </div>
            )}
            {!idOfSchool && !cfg.school && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: tk.warningSubtle,
                  border: `1px solid ${tk.warningBorder}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={14} color={tk.warning} />
                <span style={{fontSize: 12, color: tk.warning}}>
                  No school linked. Please enter a School ID or create a school
                  first.
                </span>
              </div>
            )}
          </Section>

          {/* Timing */}
          <Section
            icon={<Clock size={15} />}
            title="Schedule Timing"
            subtitle="Configure periods, durations, and start time"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: 14,
              }}
            >
              <Input
                label="Periods per day"
                type="number"
                value={cfg.periodsPerDay}
                onChange={(v) => set("periodsPerDay", v)}
                min={1}
                max={14}
                required
              />
              <Input
                label="Period duration"
                type="number"
                value={cfg.periodDuration}
                onChange={(v) => set("periodDuration", v)}
                min={10}
                max={120}
                suffix="min"
                required
              />
              <Input
                label="Start time"
                type="time"
                value={cfg.startTime}
                onChange={(v) => set("startTime", v)}
                required
              />
              <Input
                label="Max teacher load"
                helper="TSC guideline: 30"
                type="number"
                value={cfg.maxTeacherPeriods}
                onChange={(v) => set("maxTeacherPeriods", v)}
                min={10}
                max={40}
                suffix="periods/wk"
              />
            </div>

            {/* Schedule preview */}
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background: tk.bg0,
                border: `1px solid ${tk.border}`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 6}}>
                <Sun size={13} color={tk.amber} />
                <span style={{fontSize: 12, color: tk.text2, fontWeight: 500}}>
                  Start:{" "}
                  <strong style={{color: tk.text1}}>{cfg.startTime}</strong>
                </span>
              </div>
              <div style={{width: 1, height: 16, background: tk.border}} />
              <div style={{display: "flex", alignItems: "center", gap: 6}}>
                <Moon size={13} color={tk.violet} />
                <span style={{fontSize: 12, color: tk.text2, fontWeight: 500}}>
                  End: <strong style={{color: tk.text1}}>{endHour}</strong>
                </span>
              </div>
              <div style={{width: 1, height: 16, background: tk.border}} />
              <span style={{fontSize: 12, color: tk.text3}}>
                {cfg.periodsPerDay} teaching periods ·{" "}
                {cfg.breaks.reduce((s, b) => s + b.duration, 0)} min breaks
              </span>
            </div>
          </Section>

          {/* Breaks */}
          <Section
            icon={<Coffee size={15} />}
            title="Breaks"
            subtitle="Tea break, lunch, and any other intervals"
            collapsible
            defaultOpen
          >
            <BreakEditor
              breaks={cfg.breaks}
              onChange={(v) => set("breaks", v)}
              maxPeriod={cfg.periodsPerDay}
            />
          </Section>

          {/* Double periods */}
          <Section
            icon={<FlaskConical size={15} />}
            title="Double Periods"
            subtitle="Lab sessions for Sciences — scheduled in morning slots automatically"
            collapsible
            defaultOpen={false}
          >
            <div
              style={{
                padding: "10px 14px",
                background: tk.accentSubtle,
                border: `1px solid ${tk.accentBorder}`,
                borderRadius: 9,
                marginBottom: 14,
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
              }}
            >
              <AlertCircle
                size={13}
                color={tk.accent}
                style={{flexShrink: 0, marginTop: 1}}
              />
              <p style={{fontSize: 12, color: tk.accent, lineHeight: 1.6}}>
                Science doubles (Physics, Chemistry, Biology) are automatically
                placed in morning slots. Define additional doubles for other
                subjects here.
              </p>
            </div>
            <DoublePeriodEditor
              doubles={cfg.doublePeriods}
              onChange={(v) => set("doublePeriods", v)}
              maxPeriod={cfg.periodsPerDay}
            />
          </Section>

          {/* Subject frequency */}
          <Section
            icon={<Calendar size={15} />}
            title="Subject Weekly Frequency"
            subtitle="Override how many times per week a subject appears — Kiswahili defaults to 5"
            collapsible
            defaultOpen={false}
          >
            <div
              style={{
                padding: "10px 14px",
                background: tk.successSubtle,
                border: `1px solid ${tk.successBorder}`,
                borderRadius: 9,
                marginBottom: 14,
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
              }}
            >
              <CheckCircle
                size={13}
                color={tk.success}
                style={{flexShrink: 0, marginTop: 1}}
              />
              <p style={{fontSize: 12, color: tk.success, lineHeight: 1.6}}>
                Kiswahili is automatically set to 5x per week (KCSE
                requirement). Science subjects default to 4x per week for lab
                coverage.
              </p>
            </div>
            <FrequencyEditor
              items={cfg.subjectWeeklyFrequency}
              onChange={(v) => set("subjectWeeklyFrequency", v)}
              subjects={subjects}
            />
          </Section>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "14px 16px",
                background: tk.dangerSubtle,
                border: `1px solid ${tk.dangerBorder}`,
                borderRadius: 11,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <AlertCircle
                size={16}
                color={tk.danger}
                style={{flexShrink: 0, marginTop: 1}}
              />
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: tk.danger,
                    marginBottom: 3,
                  }}
                >
                  Cannot generate timetable
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: tk.danger,
                    opacity: 0.85,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Generate button */}
          <div
            style={{display: "flex", justifyContent: "flex-end", paddingTop: 4}}
          >
            <button
              onClick={handleGenerate}
              disabled={isLoading || success}
              style={{
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "inherit",
                cursor: isLoading || success ? "default" : "pointer",
                background: success
                  ? "#16A34A"
                  : isLoading
                    ? "rgba(79,110,247,0.7)"
                    : tk.accent,
                border: "none",
                borderRadius: 11,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 9,
                boxShadow:
                  isLoading || success
                    ? "none"
                    : `0 4px 16px rgba(79,110,247,0.35)`,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !success)
                  e.currentTarget.style.background = tk.accentHov;
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !success)
                  e.currentTarget.style.background = tk.accent;
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={15}
                    style={{animation: "spin 0.7s linear infinite"}}
                  />{" "}
                  Generating...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={15} /> Timetable ready!
                </>
              ) : (
                <>
                  Generate timetable <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Generation;
