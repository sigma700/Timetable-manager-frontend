import React, {useState, useEffect, useRef} from "react";
import {useAuthStore} from "../store/authStore";
import {useGenStore} from "../store/generativeStore";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";

import Notification from "./components/notification";
import {Navigation} from "./components/navigation";

// ─── Design tokens ────────────────────────────────────────────────────────────
const t = {
  surface: "rgba(255,255,255,0.03)",
  surfaceHov: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.07)",
  borderHov: "rgba(99,102,241,0.35)",
  accent: "#6366f1",
  accentMid: "#818cf8",
  muted: "#64748b",
  dimmed: "#334155",
  text: "#e2e8f0",
  textSub: "#94a3b8",
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const steps = [
  {id: 1, label: "Institution"},
  {id: 2, label: "Subjects"},
  {id: 3, label: "Classes"},
  {id: 4, label: "Teachers"},
];

function StepIndicator({current}) {
  return (
    <div
      style={{display: "flex", alignItems: "center", gap: 0, marginBottom: 36}}
    >
      {steps.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done
                    ? t.accent
                    : active
                      ? "rgba(99,102,241,0.2)"
                      : t.surface,
                  border: `0.5px solid ${done || active ? t.accent : t.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 500,
                  color: done ? "#fff" : active ? t.accentMid : t.muted,
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : step.id}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: active ? t.accentMid : done ? t.textSub : t.dimmed,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  margin: "0 4px",
                  marginBottom: 20,
                  background: done ? t.accent : t.border,
                  transition: "background 0.3s",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Primitive: Input ─────────────────────────────────────────────────────────
const Input = ({label, hint, type = "text", ...props}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: t.textSub,
            letterSpacing: "0.2px",
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={{
          background: focused ? "rgba(255,255,255,0.05)" : t.surface,
          border: `0.5px solid ${focused ? t.accent : t.border}`,
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          color: t.text,
          outline: "none",
          width: "100%",
          transition: "all 0.18s",
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px rgba(99,102,241,0.12)` : "none",
          ...(props.style || {}),
        }}
        placeholder={props.placeholder}
      />
      {hint && <p style={{fontSize: 11, color: t.muted, margin: 0}}>{hint}</p>}
    </div>
  );
};

// ─── Primitive: Select dropdown ───────────────────────────────────────────────
function Select({
  label,
  value,
  placeholder,
  options,
  onSelect,
  isOpen,
  onToggle,
  emptyMsg,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onToggle]);

  return (
    <div style={{position: "relative"}} ref={ref}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: t.textSub,
            display: "block",
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <div
        onClick={onToggle}
        style={{
          background: isOpen ? "rgba(255,255,255,0.05)" : t.surface,
          border: `0.5px solid ${isOpen ? t.accent : t.border}`,
          borderRadius: 8,
          padding: "10px 13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          fontSize: 13,
          color: value ? t.text : t.muted,
          transition: "all 0.18s",
          userSelect: "none",
          boxShadow: isOpen ? `0 0 0 3px rgba(99,102,241,0.12)` : "none",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "calc(100% - 20px)",
          }}
        >
          {value || placeholder}
        </span>
        <motion.span
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.2}}
          style={{fontSize: 10, color: t.muted, flexShrink: 0}}
        >
          ▾
        </motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -6, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -6, scale: 0.98}}
            transition={{duration: 0.15}}
            style={{
              position: "absolute",
              zIndex: 50,
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#0f172a",
              border: `0.5px solid ${t.border}`,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {options.length > 0 ? (
              options.map((opt, i) => {
                const isSelected = Array.isArray(value)
                  ? value.includes(opt)
                  : value === opt;
                return (
                  <div
                    key={i}
                    onClick={() => onSelect(opt)}
                    style={{
                      padding: "9px 13px",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: isSelected
                        ? "rgba(99,102,241,0.15)"
                        : "transparent",
                      color: isSelected ? t.accentMid : t.text,
                      transition: "background 0.12s",
                      borderBottom:
                        i < options.length - 1
                          ? `0.5px solid ${t.border}`
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <span style={{fontSize: 12, color: t.accent}}>✓</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{padding: "12px 13px", fontSize: 12, color: t.muted}}>
                {emptyMsg}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section card (FIXED: overflow visible) ───────────────────────────────────
function SectionCard({step, title, subtitle, children, active}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: "easeOut"}}
      style={{
        background: t.surface,
        border: `0.5px solid ${active ? "rgba(99,102,241,0.25)" : t.border}`,
        borderRadius: 14,
        overflow: "visible", // ✅ allow dropdowns to expand outside
        transition: "border-color 0.3s",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `0.5px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
            border: `0.5px solid rgba(99,102,241,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 500,
            color: t.accentMid,
            flexShrink: 0,
          }}
        >
          {step}
        </div>
        <div>
          <div style={{fontSize: 13, fontWeight: 500, color: t.text}}>
            {title}
          </div>
          {subtitle && (
            <div style={{fontSize: 11, color: t.muted, marginTop: 1}}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{padding: "20px"}}>{children}</div>
    </motion.div>
  );
}

// ─── Teacher row ──────────────────────────────────────────────────────────────
function TeacherRow({
  teacher,
  index,
  dropdownsOpen,
  toggleDropdown,
  handleTeacherChange,
  handleSubjectSelect,
  handleClassSelect,
  subjectOptions,
  classOptions,
  onRemove,
  canRemove,
}) {
  const subjectValue = teacher.subjects
    ? teacher.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const classValue = teacher.classes
    ? teacher.classes
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{opacity: 0, y: 8}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -8, scale: 0.98}}
      transition={{duration: 0.25}}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `0.5px solid ${t.border}`,
        borderRadius: 10,
        padding: "16px",
        overflow: "visible", // ensure dropdown not clipped inside row
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
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(139,92,246,0.15)",
              border: "0.5px solid rgba(139,92,246,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 500,
              color: "#a78bfa",
            }}
          >
            {index + 1}
          </div>
          <span style={{fontSize: 12, fontWeight: 500, color: t.textSub}}>
            {teacher.name || `Teacher ${index + 1}`}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 11,
              color: "#f87171",
              cursor: "pointer",
              padding: "3px 8px",
              borderRadius: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Remove
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        <Input
          label="Name"
          value={teacher.name}
          onChange={(e) => handleTeacherChange(index, "name", e.target.value)}
          placeholder="Mr. Smith"
          required
        />
        <Select
          label="Subjects"
          value={subjectValue.join(", ") || ""}
          placeholder="Select subjects"
          options={subjectOptions}
          isOpen={dropdownsOpen.subject[index]}
          onToggle={() => toggleDropdown("subject", index)}
          onSelect={(s) => handleSubjectSelect(index, s)}
          emptyMsg="Define subjects above first"
        />
        <Select
          label="Classes"
          value={classValue.join(", ") || ""}
          placeholder="Select classes"
          options={classOptions}
          isOpen={dropdownsOpen.class[index]}
          onToggle={() => toggleDropdown("class", index)}
          onSelect={(c) => handleClassSelect(index, c)}
          emptyMsg="Define classes above first"
        />
      </div>
    </motion.div>
  );
}

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitButton({isLoading}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileTap={{scale: 0.98}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "13px",
        background: isLoading
          ? "rgba(99,102,241,0.3)"
          : hovered
            ? "rgba(99,102,241,0.95)"
            : "rgba(99,102,241,0.85)",
        border: `0.5px solid ${
          isLoading ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.6)"
        }`,
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        color: isLoading ? "rgba(255,255,255,0.5)" : "#fff",
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transform: hovered && !isLoading ? "translateY(-1px)" : "translateY(0)",
        boxShadow:
          hovered && !isLoading ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
        letterSpacing: "0.2px",
      }}
    >
      {isLoading ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{animation: "spin 1s linear infinite"}}
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Generating timetable…
        </>
      ) : (
        <>
          Generate timetable
          <span style={{fontSize: 16}}>→</span>
        </>
      )}
    </motion.button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const Create = () => {
  const {user, isLoading: authLoading, logout} = useAuthStore();
  const [formData, setFormData] = useState({
    schoolName: "",
    subjectName: "",
    minLevel: "",
    maxLevel: "",
    classTypes: "",
    classLabels: "",
    teachers: [{name: "", subjects: "", classes: ""}],
  });

  const [dropdownsOpen, setDropdownsOpen] = useState({
    classType: false,
    subject: [false],
    class: [false],
  });

  const [localError, setLocalError] = useState(null);
  const {listName, listSubs, listClasses, listTichs, isLoading, error} =
    useGenStore();
  const navigate = useNavigate();

  // User data for Navigation
  const userName = user || "Guest";
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
    if (error) {
      setLocalError(error);
      const t = setTimeout(() => setLocalError(null), 8000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Derive current step for progress bar
  const currentStep = (() => {
    if (formData.teachers.some((t) => t.name)) return 4;
    if (formData.classTypes && formData.minLevel) return 3;
    if (formData.subjectName) return 2;
    return 1;
  })();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleTeacherChange = (index, field, value) => {
    const updated = [...formData.teachers];
    updated[index][field] = value;
    setFormData((prev) => ({...prev, teachers: updated}));
  };

  const addTeacher = () => {
    setFormData((prev) => ({
      ...prev,
      teachers: [...prev.teachers, {name: "", subjects: "", classes: ""}],
    }));
    setDropdownsOpen((prev) => ({
      ...prev,
      subject: [...prev.subject, false],
      class: [...prev.class, false],
    }));
  };

  const removeTeacher = (index) => {
    if (formData.teachers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        teachers: prev.teachers.filter((_, i) => i !== index),
      }));
      setDropdownsOpen((prev) => ({
        ...prev,
        subject: prev.subject.filter((_, i) => i !== index),
        class: prev.class.filter((_, i) => i !== index),
      }));
    }
  };

  const toggleDropdown = (type, index = null) => {
    if (type === "classType") {
      setDropdownsOpen((prev) => ({
        ...prev,
        classType: !prev.classType,
        subject: prev.subject.map(() => false),
        class: prev.class.map(() => false),
      }));
    } else if (type === "subject") {
      setDropdownsOpen((prev) => {
        const s = [...prev.subject];
        s[index] = !s[index];
        const c = [...prev.class];
        c[index] = false;
        return {...prev, subject: s, class: c, classType: false};
      });
    } else {
      setDropdownsOpen((prev) => {
        const c = [...prev.class];
        c[index] = !c[index];
        const s = [...prev.subject];
        s[index] = false;
        return {...prev, class: c, subject: s, classType: false};
      });
    }
  };

  const handleClassTypeSelect = (type) => {
    setFormData((prev) => ({...prev, classTypes: type}));
    setDropdownsOpen((prev) => ({...prev, classType: false}));
  };

  const handleSubjectSelect = (index, subject) => {
    const arr = formData.teachers[index].subjects
      ? formData.teachers[index].subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const updated = arr.includes(subject)
      ? arr.filter((s) => s !== subject).join(", ")
      : [...arr, subject].join(", ");
    handleTeacherChange(index, "subjects", updated);
  };

  const handleClassSelect = (index, cls) => {
    const arr = formData.teachers[index].classes
      ? formData.teachers[index].classes
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];
    const updated = arr.includes(cls)
      ? arr.filter((c) => c !== cls).join(", ")
      : [...arr, cls].join(", ");
    handleTeacherChange(index, "classes", updated);
  };

  const generateClassOptions = () => {
    const options = [];
    const min = parseInt(formData.minLevel) || 0;
    const max = parseInt(formData.maxLevel) || 0;
    const labels = formData.classLabels
      .split(",")
      .map((l) => l.trim().toUpperCase())
      .filter(Boolean);
    if (min && max && min <= max && formData.classTypes) {
      for (let level = min; level <= max; level++) {
        if (labels.length > 0)
          labels.forEach((label) =>
            options.push(`${formData.classTypes} ${level}${label}`),
          );
        else options.push(`${formData.classTypes} ${level}`);
      }
    }
    return options;
  };

  const subjectOptions = formData.subjectName
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const classOptions = generateClassOptions();
  const classTypeOptions = ["Grade", "Class", "Form"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLocalError(null);
      if (!formData.schoolName.trim())
        throw new Error("School name is required");
      if (!formData.minLevel || !formData.maxLevel)
        throw new Error("Class levels are required");
      const schoolData = await listName(formData.schoolName);
      const schoolId = schoolData.data._id;
      const subjectsArray = formData.subjectName
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await listSubs(subjectsArray, schoolId);
      await listClasses(
        formData.minLevel.toString(),
        formData.maxLevel.toString(),
        formData.classTypes,
        formData.classLabels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        schoolId,
      );
      await Promise.all(
        formData.teachers.map((teacher) =>
          listTichs(
            teacher.name,
            teacher.subjects
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            teacher.classes
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean),
            schoolId,
          ),
        ),
      );
      navigate("/home/gentable");
    } catch (err) {
      console.error("Submission failed:", err);
      setLocalError(err.message);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          background: "#0d1420",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="create-loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          .create-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(99,102,241,0.2);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
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
          background:
            "linear-gradient(160deg, #0d1420 0%, #0f172a 50%, #0d1420 100%)",
          color: "#fff",
          overflowX: "hidden",
          position: "relative",
          paddingTop: "68px",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: -200,
            left: -200,
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            margin: "0 auto",
            padding: "0 24px 64px",
          }}
        >
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            style={{marginBottom: 32}}
          >
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
              New schedule
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "#f1f5f9",
                letterSpacing: "-0.3px",
                marginBottom: 6,
              }}
            >
              Configure timetable
            </h1>
            <p style={{fontSize: 13, color: t.muted, lineHeight: 1.7}}>
              Define your institution's structure and Protiba will generate an
              optimized, conflict-free schedule automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.15}}
          >
            <StepIndicator current={currentStep} />
          </motion.div>

          <AnimatePresence>
            {localError && (
              <motion.div
                initial={{opacity: 0, y: -8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                style={{marginBottom: 20}}
              >
                <Notification
                  message={localError}
                  type="error"
                  duration={8000}
                  onClose={() => setLocalError(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            style={{display: "flex", flexDirection: "column", gap: 12}}
          >
            {/* Section 1: Institution */}
            <SectionCard
              step={1}
              title="Institution"
              subtitle="Your school's identity"
              active={currentStep === 1}
            >
              <Input
                label="School name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="e.g. Nyeri High School"
                required
              />
            </SectionCard>

            {/* Section 2: Subjects */}
            <SectionCard
              step={2}
              title="Subjects"
              subtitle="Curriculum offered at your institution"
              active={currentStep === 2}
            >
              <Input
                label="Subjects taught"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="Mathematics, English, Biology, Chemistry"
                hint="Separate subjects with commas"
              />
            </SectionCard>

            {/* Section 3: Classes */}
            <SectionCard
              step={3}
              title="Classes"
              subtitle="Define the class structure and groupings"
              active={currentStep === 3}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 12,
                }}
              >
                <Select
                  label="Class type"
                  value={formData.classTypes}
                  placeholder="Select type"
                  options={classTypeOptions}
                  isOpen={dropdownsOpen.classType}
                  onToggle={() => toggleDropdown("classType")}
                  onSelect={handleClassTypeSelect}
                  emptyMsg=""
                />
                <Input
                  label="Min level"
                  name="minLevel"
                  type="number"
                  value={formData.minLevel}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
                <Input
                  label="Max level"
                  name="maxLevel"
                  type="number"
                  value={formData.maxLevel}
                  onChange={handleChange}
                  placeholder="6"
                  required
                />
                <div style={{gridColumn: "span 1"}}>
                  <Input
                    label="Section labels"
                    name="classLabels"
                    value={formData.classLabels}
                    onChange={handleChange}
                    placeholder="A, B, C"
                    hint="Optional — converted to uppercase"
                  />
                </div>
              </div>

              {classOptions.length > 0 && (
                <div style={{marginTop: 16}}>
                  <div
                    style={{
                      fontSize: 11,
                      color: t.muted,
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Generated classes · {classOptions.length} total
                  </div>
                  <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                    {classOptions.slice(0, 12).map((cls, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          background: "rgba(99,102,241,0.1)",
                          border: "0.5px solid rgba(99,102,241,0.25)",
                          color: "#a5b4fc",
                          padding: "3px 10px",
                          borderRadius: 20,
                        }}
                      >
                        {cls}
                      </span>
                    ))}
                    {classOptions.length > 12 && (
                      <span
                        style={{
                          fontSize: 11,
                          color: t.muted,
                          padding: "3px 10px",
                        }}
                      >
                        +{classOptions.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Section 4: Teachers */}
            <SectionCard
              step={4}
              title="Teachers"
              subtitle="Assign subjects and classes to each teacher"
              active={currentStep === 4}
            >
              <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                <AnimatePresence>
                  {formData.teachers.map((teacher, index) => (
                    <TeacherRow
                      key={index}
                      teacher={teacher}
                      index={index}
                      dropdownsOpen={dropdownsOpen}
                      toggleDropdown={toggleDropdown}
                      handleTeacherChange={handleTeacherChange}
                      handleSubjectSelect={handleSubjectSelect}
                      handleClassSelect={handleClassSelect}
                      subjectOptions={subjectOptions}
                      classOptions={classOptions}
                      onRemove={() => removeTeacher(index)}
                      canRemove={formData.teachers.length > 1}
                    />
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={addTeacher}
                  style={{
                    background: "transparent",
                    border: `0.5px dashed ${t.border}`,
                    borderRadius: 10,
                    padding: "11px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: t.muted,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                    e.currentTarget.style.color = t.accentMid;
                    e.currentTarget.style.background = "rgba(99,102,241,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = t.border;
                    e.currentTarget.style.color = t.muted;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{fontSize: 16, lineHeight: 1}}>+</span>
                  Add teacher
                </button>
              </div>
            </SectionCard>

            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.3}}
              style={{marginTop: 8}}
            >
              <SubmitButton isLoading={isLoading} />
              <p
                style={{
                  fontSize: 11,
                  color: t.dimmed,
                  textAlign: "center",
                  marginTop: 12,
                  lineHeight: 1.6,
                }}
              >
                Protiba will automatically resolve conflicts and generate an
                optimized schedule.
              </p>
            </motion.div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Create;
