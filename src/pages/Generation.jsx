import React, {useState, useEffect, useRef} from "react";
import {useGenStore} from "../store/generativeStore";
import Timetable from "./components/timetable";
import {useAuthStore} from "../store/authStore";
import Navigation from "./components/navigation";

// ─── Micro Icons ────────────────────────────────────────────────────────────
const Icon = {
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 4.5V8l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  ),
  Periods: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M5.5 3.5V12.5M10.5 3.5V12.5M1.5 7.5H14.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  ),
  Duration: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M8 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  School: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L14 5.5V7H2V5.5L8 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <rect
        x="3.5"
        y="7"
        width="2.5"
        height="5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="6.75"
        y="7"
        width="2.5"
        height="5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="10"
        y="7"
        width="2.5"
        height="5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M1.5 12H14.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  ),
  Add: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 2V12M2 7H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Remove: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Chevron: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 5L7 9L11 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L9.2 6.8L14 8L9.2 9.2L8 14L6.8 9.2L2 8L6.8 6.8L8 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Warning: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L14.5 13H1.5L8 2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  ),
  Loader: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />
      <path
        d="M9 2A7 7 0 0 1 16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Animated Counter ─────────────────────────────────────────────────────
const StatPill = ({label, value, accent = false}) => (
  <div className={`stat-pill ${accent ? "stat-pill--accent" : ""}`}>
    <span className="stat-pill__value">{value}</span>
    <span className="stat-pill__label">{label}</span>
  </div>
);

// ─── Section Header ──────────────────────────────────────────────────────
const SectionHeader = ({title, description, action, actionLabel, count}) => (
  <div className="section-header">
    <div className="section-header__left">
      <div className="section-header__title-row">
        <h3 className="section-header__title">{title}</h3>
        {count > 0 && <span className="section-header__badge">{count}</span>}
      </div>
      {description && <p className="section-header__desc">{description}</p>}
    </div>
    {action && (
      <button type="button" onClick={action} className="btn-add">
        <Icon.Add />
        {actionLabel}
      </button>
    )}
  </div>
);

// ─── Premium Input ───────────────────────────────────────────────────────
const PremiumInput = ({
  label,
  icon: IconComp,
  type = "text",
  name,
  placeholder,
  required,
  min,
  max,
  value,
  onChange,
  hint,
}) => {
  const [focused, setFocused] = useState(false);
  const filled = value !== "" && value !== undefined;

  return (
    <div
      className={`field ${focused ? "field--focused" : ""} ${filled ? "field--filled" : ""}`}
    >
      <label className="field__label">
        {label}
        {required && <span className="field__required">*</span>}
      </label>
      <div className="field__control">
        {IconComp && (
          <span className="field__icon">
            <IconComp />
          </span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`field__input ${IconComp ? "field__input--padded" : ""}`}
        />
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
};

// ─── Premium Select ──────────────────────────────────────────────────────
const PremiumSelect = ({label, name, options, required, value, onChange}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`field ${focused ? "field--focused" : ""} ${value ? "field--filled" : ""}`}
    >
      <label className="field__label">
        {label}
        {required && <span className="field__required">*</span>}
      </label>
      <div className="field__control field__control--select">
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="field__select"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="field__chevron">
          <Icon.Chevron />
        </span>
      </div>
    </div>
  );
};

// ─── Progress Steps ───────────────────────────────────────────────────────
const steps = ["Basic Info", "Schedule Config", "Breaks", "Advanced"];
const ProgressBar = ({current}) => (
  <div className="progress-bar">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <div
          className={`progress-step ${i < current ? "progress-step--done" : i === current ? "progress-step--active" : ""}`}
        >
          <div className="progress-step__dot">
            {i < current ? <Icon.Check /> : <span>{i + 1}</span>}
          </div>
          <span className="progress-step__label">{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={`progress-connector ${i < current ? "progress-connector--done" : ""}`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Break Card ──────────────────────────────────────────────────────────
const BreakCard = ({breakItem, index, onChange, onRemove, maxPeriods}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div
      className={`card-item ${expanded ? "card-item--expanded" : ""}`}
      style={{"--delay": `${index * 60}ms`}}
    >
      <div className="card-item__header" onClick={() => setExpanded((e) => !e)}>
        <div className="card-item__header-left">
          <div className="card-item__index">{index + 1}</div>
          <span className="card-item__name">
            {breakItem.name || "Unnamed Break"}
          </span>
          {breakItem.afterPeriod && (
            <span className="card-item__meta">
              after period {breakItem.afterPeriod}
            </span>
          )}
          {breakItem.duration && (
            <span className="card-item__meta">{breakItem.duration} min</span>
          )}
        </div>
        <div className="card-item__actions">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(breakItem.id);
            }}
            className="btn-ghost-danger"
          >
            <Icon.Remove />
            Remove
          </button>
          <span
            className={`card-item__chevron ${expanded ? "card-item__chevron--open" : ""}`}
          >
            <Icon.Chevron />
          </span>
        </div>
      </div>

      {expanded && (
        <div className="card-item__body">
          <div className="card-item__grid card-item__grid--3">
            <PremiumInput
              label="Break Name"
              name="name"
              placeholder="e.g. Lunch Break"
              required
              value={breakItem.name}
              onChange={(e) => onChange(breakItem.id, e)}
            />
            <PremiumInput
              label="After Period"
              type="number"
              name="afterPeriod"
              placeholder="2"
              min="1"
              max={maxPeriods || 12}
              required
              value={breakItem.afterPeriod}
              onChange={(e) => onChange(breakItem.id, e)}
              hint="Which period this follows"
            />
            <PremiumInput
              label="Duration"
              type="number"
              name="duration"
              placeholder="15"
              min="1"
              max="120"
              required
              value={breakItem.duration}
              onChange={(e) => onChange(breakItem.id, e)}
              hint="Minutes"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Double Period Card ───────────────────────────────────────────────────
const DoublePeriodCard = ({dpItem, index, daysOfWeek, onChange, onRemove}) => (
  <div
    className="card-item card-item--expanded"
    style={{"--delay": `${index * 60}ms`}}
  >
    <div className="card-item__header">
      <div className="card-item__header-left">
        <div className="card-item__index">{index + 1}</div>
        <span className="card-item__name">
          {dpItem.day && dpItem.period
            ? `${dpItem.day} — Period ${dpItem.period}`
            : "New Double Period"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(dpItem.id)}
        className="btn-ghost-danger"
      >
        <Icon.Remove />
        Remove
      </button>
    </div>
    <div className="card-item__body">
      <div className="card-item__grid card-item__grid--2">
        <PremiumSelect
          label="Day"
          name="day"
          options={daysOfWeek.map((d) => ({value: d, label: d}))}
          required
          value={dpItem.day}
          onChange={(e) => onChange(dpItem.id, e)}
        />
        <PremiumInput
          label="Period Number"
          type="number"
          name="period"
          placeholder="1"
          min="1"
          max="12"
          required
          value={dpItem.period}
          onChange={(e) => onChange(dpItem.id, e)}
          hint="Starting period of double slot"
        />
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────
const EmptyState = ({icon, title, description, action, actionLabel}) => (
  <div className="empty-state">
    <div className="empty-state__icon">{icon}</div>
    <p className="empty-state__title">{title}</p>
    <p className="empty-state__desc">{description}</p>
    {action && (
      <button
        type="button"
        onClick={action}
        className="btn-add btn-add--centered"
      >
        <Icon.Add />
        {actionLabel}
      </button>
    )}
  </div>
);

// ─── Completion Metric ────────────────────────────────────────────────────
const useFormCompletion = (formData) => {
  const fields = ["name", "startTime", "periodsPerDay", "periodDuration"];
  const filled = fields.filter((f) => formData[f] !== "").length;
  return Math.round((filled / fields.length) * 100);
};

// ─── Main Component ───────────────────────────────────────────────────────
const Generation = () => {
  const {isloading, error, isCreated, generateTabel, idOfSchool, relValue} =
    useGenStore();
  const {user, logout} = useAuthStore();

  // Navigation props
  const userName = user || "User";
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

  const initialFormData = {
    name: "",
    school: "",
    startTime: "",
    periodsPerDay: "",
    periodDuration: "",
    breaks: [],
    doublePeriods: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const completion = useFormCompletion(formData);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const addBreak = () =>
    setFormData((prev) => ({
      ...prev,
      breaks: [
        ...prev.breaks,
        {id: crypto.randomUUID(), name: "", afterPeriod: "", duration: ""},
      ],
    }));

  const handleBreakChange = (id, e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      breaks: prev.breaks.map((b) => (b.id === id ? {...b, [name]: value} : b)),
    }));
  };

  const removeBreak = (id) =>
    setFormData((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((b) => b.id !== id),
    }));

  const addDoublePeriod = () =>
    setFormData((prev) => ({
      ...prev,
      doublePeriods: [
        ...prev.doublePeriods,
        {id: crypto.randomUUID(), day: "", period: ""},
      ],
    }));

  const handleDoublePeriodChange = (id, e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      doublePeriods: prev.doublePeriods.map((dp) =>
        dp.id === id ? {...dp, [name]: value} : dp,
      ),
    }));
  };

  const removeDoublePeriod = (id) =>
    setFormData((prev) => ({
      ...prev,
      doublePeriods: prev.doublePeriods.filter((dp) => dp.id !== id),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        periodsPerDay: formData.periodsPerDay
          ? parseInt(formData.periodsPerDay)
          : undefined,
        periodDuration: formData.periodDuration
          ? parseInt(formData.periodDuration)
          : undefined,
        startTime: formData.startTime || undefined,
        breaks: formData.breaks
          .filter((b) => b.name)
          .map((b) => ({
            name: b.name,
            afterPeriod: b.afterPeriod ? parseInt(b.afterPeriod) : undefined,
            duration: b.duration ? parseInt(b.duration) : undefined,
          })),
        doublePeriods: formData.doublePeriods
          .filter((dp) => dp.day && dp.period)
          .map((dp) => ({
            day: dp.day,
            period: dp.period ? parseInt(dp.period) : undefined,
          })),
      };
      await generateTabel(formData.name, config, formData.school);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // Determine progress step
  const currentStep = !formData.name
    ? 0
    : !formData.startTime || !formData.periodsPerDay || !formData.periodDuration
      ? 1
      : formData.breaks.length === 0
        ? 2
        : 3;

  return (
    <>
      <style>{css}</style>

      {/* Navigation bar */}
      <Navigation
        userName={userName}
        institutionName={institutionName}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />

      <div className="gen-root" style={{paddingTop: "68px"}}>
        {/* ── Page Header ── */}
        <header className="gen-header">
          <div className="gen-header__inner">
            <div className="gen-header__left">
              <div className="gen-header__eyebrow">
                <span className="gen-header__dot" />
                Academic Scheduling
              </div>
              <h1 className="gen-header__title">New Timetable</h1>
              <p className="gen-header__subtitle">
                Define your institution's schedule structure and let the engine
                handle the rest.
              </p>
            </div>
            <div className="gen-header__stats">
              <StatPill label="Breaks" value={formData.breaks.length} />
              <StatPill
                label="Double Periods"
                value={formData.doublePeriods.length}
              />
              <StatPill
                label="Complete"
                value={`${completion}%`}
                accent={completion === 100}
              />
            </div>
          </div>
          <ProgressBar current={currentStep} />
        </header>

        {/* ── Error Banner ── */}
        {error && (
          <div className="alert alert--error">
            <Icon.Warning />
            <span>{error}</span>
          </div>
        )}

        {/* ── Success Banner ── */}
        {isCreated && submitted && (
          <div className="alert alert--success">
            <Icon.Check />
            <span>
              Timetable configuration saved — the schedule engine is now
              running.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="gen-form">
          {/* ── Section 1: Identity ── */}
          <section className="gen-section">
            <SectionHeader
              title="Institution"
              description="Name your timetable for easy identification in the dashboard."
            />
            <div className="gen-grid gen-grid--2">
              <PremiumInput
                label="Timetable Name"
                icon={Icon.School}
                name="name"
                placeholder="e.g. St. Mary's 2025–26 Schedule"
                required
                value={formData.name}
                onChange={handleChange}
                hint="This appears on all generated reports and exports"
              />
              <PremiumInput
                label="School ID"
                name="school"
                placeholder="Optional — links to existing institution"
                value={formData.school}
                onChange={handleChange}
                hint="Leave blank to create a new institution profile"
              />
            </div>
          </section>

          <div className="gen-divider" />

          {/* ── Section 2: Schedule Config ── */}
          <section className="gen-section">
            <SectionHeader
              title="Schedule Configuration"
              description="Core parameters that govern how periods and timing are structured."
            />
            <div className="gen-grid gen-grid--3">
              <PremiumInput
                label="Start Time"
                icon={Icon.Clock}
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                hint="First period begins at"
              />
              <PremiumInput
                label="Periods Per Day"
                icon={Icon.Periods}
                type="number"
                name="periodsPerDay"
                placeholder="7"
                min="1"
                max="12"
                required
                value={formData.periodsPerDay}
                onChange={handleChange}
                hint="Excluding break periods"
              />
              <PremiumInput
                label="Period Duration"
                icon={Icon.Duration}
                type="number"
                name="periodDuration"
                placeholder="40"
                min="5"
                max="120"
                required
                value={formData.periodDuration}
                onChange={handleChange}
                hint="Minutes per standard period"
              />
            </div>

            {formData.startTime &&
              formData.periodsPerDay &&
              formData.periodDuration && (
                <div className="schedule-preview">
                  <div className="schedule-preview__label">
                    <Icon.Sparkle />
                    Schedule Preview
                  </div>
                  <ScheduleTimeline
                    startTime={formData.startTime}
                    periodsPerDay={parseInt(formData.periodsPerDay)}
                    periodDuration={parseInt(formData.periodDuration)}
                    breaks={formData.breaks}
                  />
                </div>
              )}
          </section>

          <div className="gen-divider" />

          {/* ── Section 3: Breaks ── */}
          <section className="gen-section">
            <SectionHeader
              title="Breaks"
              description="Recesses, lunch periods, and transitions between instructional blocks."
              action={addBreak}
              actionLabel="Add Break"
              count={formData.breaks.length}
            />

            {formData.breaks.length === 0 ? (
              <EmptyState
                icon={<Icon.Clock />}
                title="No breaks configured"
                description="Most institutions include at least one recess and a lunch period."
                action={addBreak}
                actionLabel="Add your first break"
              />
            ) : (
              <div className="card-list">
                {formData.breaks.map((b, i) => (
                  <BreakCard
                    key={b.id}
                    breakItem={b}
                    index={i}
                    onChange={handleBreakChange}
                    onRemove={removeBreak}
                    maxPeriods={formData.periodsPerDay}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="gen-divider" />

          {/* ── Section 4: Double Periods ── */}
          <section className="gen-section">
            <SectionHeader
              title="Double Periods"
              description="Extended consecutive slots for subjects requiring longer instructional time."
              action={addDoublePeriod}
              actionLabel="Add Double Period"
              count={formData.doublePeriods.length}
            />

            {formData.doublePeriods.length === 0 ? (
              <EmptyState
                icon={<Icon.Periods />}
                title="No double periods defined"
                description="Common for labs, physical education, or arts subjects."
                action={addDoublePeriod}
                actionLabel="Add a double period"
              />
            ) : (
              <div className="card-list">
                {formData.doublePeriods.map((dp, i) => (
                  <DoublePeriodCard
                    key={dp.id}
                    dpItem={dp}
                    index={i}
                    daysOfWeek={daysOfWeek}
                    onChange={handleDoublePeriodChange}
                    onRemove={removeDoublePeriod}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Submit ── */}
          <div className="gen-submit">
            <div className="gen-submit__meta">
              <div
                className={`completion-ring ${completion === 100 ? "completion-ring--complete" : ""}`}
              >
                <svg viewBox="0 0 36 36" width="36" height="36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.12"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(completion / 100) * 94.2} 94.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
                <span>{completion}%</span>
              </div>
              <div>
                <p className="gen-submit__title">Ready to generate</p>
                <p className="gen-submit__desc">
                  {completion < 100
                    ? "Complete required fields to generate the timetable"
                    : `${formData.breaks.length} break${formData.breaks.length !== 1 ? "s" : ""} · ${formData.doublePeriods.length} double period${formData.doublePeriods.length !== 1 ? "s" : ""} configured`}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-generate ${isloading ? "btn-generate--loading" : ""}`}
              disabled={isloading || completion < 100}
            >
              {isloading ? (
                <>
                  <Icon.Loader />
                  Generating Schedule…
                </>
              ) : (
                <>
                  <Icon.Sparkle />
                  Generate Timetable
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Output ── */}
        {relValue && (
          <div className="gen-output">
            <div className="gen-output__header">
              <div className="gen-output__badge">
                <Icon.Check />
                Generated
              </div>
              <h2 className="gen-output__title">Timetable Output</h2>
            </div>
            <Timetable
              timetableResponse={{
                success: true,
                message: "Timetable loaded",
                data: relValue,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

// ─── Schedule Timeline Preview (with improved spacing & time visibility) ───
const ScheduleTimeline = ({
  startTime,
  periodsPerDay,
  periodDuration,
  breaks,
}) => {
  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h > 12 ? h - 12 : h || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  let cursor = parseTime(startTime);
  const slots = [];

  for (let p = 1; p <= Math.min(periodsPerDay, 8); p++) {
    slots.push({
      type: "period",
      label: `P${p}`,
      start: formatTime(cursor),
      duration: periodDuration,
    });
    cursor += periodDuration;
    const brk = breaks.find((b) => parseInt(b.afterPeriod) === p && b.duration);
    if (brk) {
      slots.push({
        type: "break",
        label: brk.name || "Break",
        start: formatTime(cursor),
        duration: parseInt(brk.duration),
      });
      cursor += parseInt(brk.duration);
    }
  }

  if (periodsPerDay > 8) {
    slots.push({
      type: "more",
      label: `+${periodsPerDay - 8} more`,
      duration: 0,
    });
  }

  return (
    <div className="timeline">
      {slots.map((slot, i) => (
        <div
          key={i}
          className={`timeline__slot timeline__slot--${slot.type}`}
          style={{
            "--w": slot.duration
              ? `${Math.max(slot.duration / 1.5, 48)}px` // wider boxes
              : "60px",
          }}
          title={`${slot.label}${slot.start ? " · " + slot.start : ""}${slot.duration ? " · " + slot.duration + "min" : ""}`}
        >
          <span className="timeline__label">{slot.label}</span>
          {slot.start && <span className="timeline__time">{slot.start}</span>}
        </div>
      ))}
    </div>
  );
};

// ─── Styles (updated for timeline spacing & time visibility) ───────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d10;
    --surface: #131316;
    --surface-2: #1a1a1f;
    --surface-3: #212128;
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(139,92,246,0.5);
    --text: #f0f0f5;
    --text-2: #9898a8;
    --text-3: #5a5a70;
    --accent: #7c3aed;
    --accent-light: #a78bfa;
    --accent-glow: rgba(124,58,237,0.15);
    --green: #10b981;
    --red: #f43f5e;
    --amber: #f59e0b;
    --radius: 10px;
    --radius-lg: 14px;
    --radius-xl: 18px;
    --shadow: 0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
    --font: 'Inter', -apple-system, sans-serif;
    --transition: 180ms cubic-bezier(0.4,0,0.2,1);
  }

  .gen-root {
    font-family: var(--font);
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    padding: 0 0 80px;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Header ── */
  .gen-header {
    background: linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
    padding: 40px 48px 0;
    margin-bottom: 8px;
  }
  .gen-header__inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }
  .gen-header__eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-light);
    margin-bottom: 10px;
  }
  .gen-header__dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-light);
    box-shadow: 0 0 8px var(--accent-light);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }
  .gen-header__title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1.15;
  }
  .gen-header__subtitle {
    font-size: 14px;
    color: var(--text-2);
    margin-top: 6px;
    line-height: 1.5;
  }
  .gen-header__stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: flex-start;
    padding-top: 4px;
  }
  .stat-pill {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 64px;
    transition: var(--transition);
  }
  .stat-pill:hover { border-color: rgba(255,255,255,0.12); }
  .stat-pill--accent { border-color: var(--border-focus); background: var(--accent-glow); }
  .stat-pill__value { font-size: 18px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
  .stat-pill__label { font-size: 10px; font-weight: 500; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 1px; }

  /* ── Progress ── */
  .progress-bar {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 0 24px;
  }
  .progress-step {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .progress-step__dot {
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    transition: var(--transition);
  }
  .progress-step--active .progress-step__dot {
    border-color: var(--accent);
    background: var(--accent-glow);
    color: var(--accent-light);
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .progress-step--done .progress-step__dot {
    border-color: var(--green);
    background: rgba(16,185,129,0.1);
    color: var(--green);
  }
  .progress-step__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    white-space: nowrap;
  }
  .progress-step--active .progress-step__label { color: var(--text-2); }
  .progress-step--done .progress-step__label { color: var(--text-3); }
  .progress-connector {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin: 0 10px;
    min-width: 20px;
    transition: var(--transition);
  }
  .progress-connector--done { background: rgba(16,185,129,0.3); }

  /* ── Form ── */
  .gen-form {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* ── Section ── */
  .gen-section { padding: 32px 0; }
  .gen-divider {
    height: 1px;
    background: var(--border);
    max-width: 900px;
    margin: 0 auto;
  }
  .gen-grid { display: grid; gap: 16px; }
  .gen-grid--2 { grid-template-columns: repeat(2, 1fr); }
  .gen-grid--3 { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 720px) {
    .gen-grid--2, .gen-grid--3 { grid-template-columns: 1fr; }
    .gen-form, .gen-header { padding-left: 20px; padding-right: 20px; }
    .gen-header__inner { flex-direction: column; }
  }

  .section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .section-header__title-row { display: flex; align-items: center; gap: 10px; }
  .section-header__title { font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.01em; }
  .section-header__badge {
    background: var(--accent-glow);
    border: 1px solid var(--border-focus);
    color: var(--accent-light);
    font-size: 11px;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: 20px;
  }
  .section-header__desc { font-size: 13px; color: var(--text-3); margin-top: 3px; line-height: 1.5; }

  /* ── Field ── */
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .field__required { color: var(--red); font-size: 11px; }
  .field__control {
    position: relative;
    display: flex;
    align-items: center;
  }
  .field__control--select::after { display: none; }
  .field__icon {
    position: absolute;
    left: 12px;
    color: var(--text-3);
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color var(--transition);
  }
  .field--focused .field__icon { color: var(--accent-light); }
  .field__input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 12px;
    font-size: 14px;
    font-family: var(--font);
    color: var(--text);
    outline: none;
    transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
    -webkit-appearance: none;
  }
  .field__input--padded { padding-left: 36px; }
  .field__input::placeholder { color: var(--text-3); }
  .field__input:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .field__input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
  .field__select {
    width: 100%;
    appearance: none;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 36px 10px 12px;
    font-size: 14px;
    font-family: var(--font);
    color: var(--text);
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
  }
  .field__select:focus {
    border-color: var(--border-focus);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .field__select option { background: var(--surface-3); color: var(--text); }
  .field__chevron {
    position: absolute;
    right: 10px;
    color: var(--text-3);
    pointer-events: none;
    display: flex;
  }
  .field__hint { font-size: 11px; color: var(--text-3); }

  /* ── Buttons ── */
  .btn-add {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 7px 13px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
    font-family: var(--font);
  }
  .btn-add:hover {
    background: var(--surface-3);
    border-color: var(--border-focus);
    color: var(--accent-light);
  }
  .btn-add--centered { margin: 0 auto; display: flex; }
  .btn-ghost-danger {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 7px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    cursor: pointer;
    transition: all var(--transition);
    font-family: var(--font);
  }
  .btn-ghost-danger:hover { color: var(--red); border-color: rgba(244,63,94,0.2); background: rgba(244,63,94,0.06); }

  /* ── Card Items ── */
  .card-list { display: flex; flex-direction: column; gap: 8px; }
  .card-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: border-color var(--transition), box-shadow var(--transition);
    animation: slideIn var(--transition) both;
    animation-delay: var(--delay, 0ms);
  }
  .card-item:hover { border-color: rgba(255,255,255,0.1); box-shadow: var(--shadow); }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .card-item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    cursor: pointer;
    gap: 12px;
  }
  .card-item__header-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; overflow: hidden; }
  .card-item__index {
    width: 22px; height: 22px;
    border-radius: 6px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-3);
    flex-shrink: 0;
  }
  .card-item__name { font-size: 14px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-item__meta {
    font-size: 11px;
    color: var(--text-3);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 2px 7px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .card-item__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .card-item__chevron { color: var(--text-3); display: flex; transition: transform var(--transition); }
  .card-item__chevron--open { transform: rotate(180deg); }
  .card-item__body { padding: 0 16px 16px; }
  .card-item__grid { display: grid; gap: 12px; }
  .card-item__grid--3 { grid-template-columns: repeat(3, 1fr); }
  .card-item__grid--2 { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) {
    .card-item__grid--3, .card-item__grid--2 { grid-template-columns: 1fr; }
  }

  /* ── Empty State ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 24px;
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
    text-align: center;
  }
  .empty-state__icon { color: var(--text-3); opacity: 0.6; margin-bottom: 4px; }
  .empty-state__title { font-size: 14px; font-weight: 500; color: var(--text-2); }
  .empty-state__desc { font-size: 13px; color: var(--text-3); max-width: 320px; line-height: 1.5; }

  /* ── Schedule Preview (improved) ── */
  .schedule-preview {
    margin-top: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    animation: slideIn 200ms both;
  }
  .schedule-preview__label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--accent-light);
    margin-bottom: 14px;
  }
  .timeline {
    display: flex;
    align-items: stretch;
    gap: 6px;               /* more spacing between boxes */
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .timeline::-webkit-scrollbar { height: 5px; }
  .timeline::-webkit-scrollbar-track { background: transparent; }
  .timeline::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .timeline__slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: var(--w, 56px);
    width: var(--w, 56px);
    padding: 10px 6px;
    border-radius: 8px;
    flex-shrink: 0;
    gap: 4px;
  }
  .timeline__slot--period { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.3); }
  .timeline__slot--break { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); }
  .timeline__slot--more { background: var(--surface-2); border: 1px dashed var(--border); }
  .timeline__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
    white-space: nowrap;
  }
  .timeline__slot--period .timeline__label { color: var(--accent-light); }
  .timeline__slot--break .timeline__label { color: var(--amber); }
  .timeline__time {
    font-size: 10px;
    color: var(--text-2);
    white-space: nowrap;
    font-weight: 500;
    background: rgba(0,0,0,0.2);
    padding: 2px 5px;
    border-radius: 12px;
  }

  /* ── Submit ── */
  .gen-submit {
    margin-top: 40px;
    padding: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .gen-submit__meta { display: flex; align-items: center; gap: 16px; }
  .completion-ring { position: relative; display: flex; align-items: center; justify-content: center; color: var(--accent); }
  .completion-ring--complete { color: var(--green); }
  .completion-ring span {
    position: absolute;
    font-size: 9px;
    font-weight: 700;
    color: var(--text-2);
  }
  .gen-submit__title { font-size: 14px; font-weight: 600; color: var(--text); }
  .gen-submit__desc { font-size: 12px; color: var(--text-3); margin-top: 2px; }
  .btn-generate {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent);
    border: none;
    border-radius: var(--radius);
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all var(--transition);
    font-family: var(--font);
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    white-space: nowrap;
  }
  .btn-generate:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
    transform: translateY(-1px);
  }
  .btn-generate:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-generate--loading { pointer-events: none; }
  .animate-spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Alerts ── */
  .alert {
    max-width: 900px;
    margin: 16px auto 0;
    padding: 12px 16px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 500;
  }
  .alert--error { background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2); color: #f87171; }
  .alert--success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34d399; }

  /* ── Output ── */
  .gen-output {
    max-width: 900px;
    margin: 40px auto 0;
    padding: 0 48px;
  }
  .gen-output__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .gen-output__badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--green);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .gen-output__title { font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  @media (max-width: 720px) { .gen-output { padding: 0 20px; } }
`;

export default Generation;
