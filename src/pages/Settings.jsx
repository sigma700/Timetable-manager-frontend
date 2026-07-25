import React, {useState, useEffect, useRef, useCallback} from "react";
import {useAuthStore} from "../store/authStore";
import {Navigation} from "./components/navigation";
import {
  Building2,
  GraduationCap,
  CalendarDays,
  Clock3,
  BookOpen,
  Users,
  School,
  Sparkles,
  Brain,
  ShieldCheck,
  Database,
  Bell,
  Palette,
  Settings2,
  Save,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  AlertCircle,
  Info,
  Zap,
  RefreshCw,
  Lock,
  HardDrive,
  LifeBuoy,
  FileText,
  Globe,
  Moon,
  Sun,
  Monitor,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Layers,
  Target,
  Activity,
  TrendingUp,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const tk = {
  bg0: "#09090C",
  bg1: "#0F1015",
  bg2: "#14151C",
  bg3: "#1A1B25",
  bg4: "#1F2130",
  border: "rgba(255,255,255,0.06)",
  borderHov: "rgba(255,255,255,0.11)",
  borderAccent: "rgba(79,110,247,0.36)",
  text1: "#EDEEF5",
  text2: "#8B90AA",
  text3: "#52566A",
  accent: "#4F6EF7",
  accentHov: "#3D5CE8",
  accentSubtle: "rgba(79,110,247,0.09)",
  accentBorder: "rgba(79,110,247,0.26)",
  success: "#22C55E",
  successSubtle: "rgba(34,197,94,0.08)",
  successBorder: "rgba(34,197,94,0.2)",
  amber: "#F59E0B",
  amberSubtle: "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.24)",
  danger: "#F87171",
  dangerSubtle: "rgba(248,113,113,0.08)",
  dangerBorder: "rgba(248,113,113,0.22)",
  violet: "#8B5CF6",
  violetSubtle: "rgba(139,92,246,0.09)",
  violetBorder: "rgba(139,92,246,0.26)",
};

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    id: "institution",
    icon: Building2,
    label: "Institution",
    desc: "Profile and identity",
  },
  {
    id: "academic",
    icon: GraduationCap,
    label: "Academic Configuration",
    desc: "Calendar and schedule",
  },
  {
    id: "timetable",
    icon: CalendarDays,
    label: "Timetable Preferences",
    desc: "Generation rules",
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    desc: "Alerts and updates",
  },
  {
    id: "appearance",
    icon: Palette,
    label: "Appearance",
    desc: "Theme and display",
  },
  {
    id: "ai",
    icon: Brain,
    label: "AI Preferences",
    desc: "Scheduling intelligence",
  },
  {
    id: "user",
    icon: Users,
    label: "User Preferences",
    desc: "Personal settings",
  },
  {
    id: "security",
    icon: ShieldCheck,
    label: "Security",
    desc: "Access and permissions",
  },
  {
    id: "data",
    icon: Database,
    label: "Data & Backup",
    desc: "Export and recovery",
  },
  {id: "support", icon: LifeBuoy, label: "Support", desc: "Help and resources"},
  {id: "about", icon: Info, label: "About", desc: "Version and credits"},
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
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

// ─── Primitive components ─────────────────────────────────────────────────────

function Toggle({value, onChange}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: value ? tk.accent : tk.bg4,
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.22s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: value ? `0 0 0 3px ${tk.accentSubtle}` : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.22s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function SegmentedControl({options, value, onChange}) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: tk.bg3,
        border: `1px solid ${tk.border}`,
        borderRadius: 9,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "5px 14px",
              borderRadius: 7,
              border: "none",
              background: active ? tk.bg1 : "transparent",
              color: active ? tk.text1 : tk.text3,
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.25)" : "none",
              transition: "all 0.18s",
              whiteSpace: "nowrap",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SelectInput({value, onChange, options, style = {}}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{position: "relative", ...style}}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          appearance: "none",
          width: "100%",
          background: tk.bg2,
          border: `1px solid ${focused ? tk.borderAccent : tk.border}`,
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          fontSize: 13,
          color: tk.text1,
          outline: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "border-color 0.18s",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{background: tk.bg2}}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        color={tk.text3}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function TextInput({value, onChange, placeholder, type = "text"}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: focused ? "rgba(79,110,247,0.04)" : tk.bg2,
        border: `1px solid ${focused ? tk.borderAccent : tk.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        color: tk.text1,
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.18s, background 0.18s",
      }}
    />
  );
}

function SliderInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}) {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 12}}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{flex: 1, accentColor: tk.accent, cursor: "pointer", height: 4}}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: tk.accent,
          minWidth: 44,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {unit}
      </span>
    </div>
  );
}

// ─── Setting row ──────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  helper,
  children,
  tags = [],
  border = true,
}) {
  const matchesTags = (search) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      (description || "").toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };
  return {label, description, helper, children, tags, border, matchesTags};
}

function SettingRowUI({
  label,
  description,
  helper,
  children,
  border = true,
  visible = true,
}) {
  if (!visible) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        padding: "16px 0",
        borderBottom: border ? `1px solid ${tk.border}` : "none",
      }}
    >
      <div style={{flex: 1, minWidth: 0}}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: tk.text1,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: 12,
              color: tk.text3,
              lineHeight: 1.6,
              marginTop: 2,
            }}
          >
            {description}
          </div>
        )}
        {helper && (
          <div
            style={{
              fontSize: 11,
              color: tk.accent,
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Info size={11} />
            {helper}
          </div>
        )}
      </div>
      <div style={{flexShrink: 0, display: "flex", alignItems: "center"}}>
        {children}
      </div>
    </div>
  );
}

// ─── Settings card ────────────────────────────────────────────────────────────

function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  iconColor,
  delay = 0,
}) {
  const [ref, inView] = useInView(0.06);
  return (
    <div
      ref={ref}
      style={{
        background: tk.bg1,
        border: `1px solid ${tk.border}`,
        borderRadius: 14,
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        marginBottom: 16,
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 24px",
          borderBottom: `1px solid ${tk.border}`,
          background: tk.bg2,
        }}
      >
        {Icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: iconColor?.bg || tk.accentSubtle,
              border: `1px solid ${iconColor?.border || tk.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor?.text || tk.accent,
              flexShrink: 0,
            }}
          >
            <Icon size={15} strokeWidth={1.8} />
          </div>
        )}
        <div>
          <div style={{fontSize: 13, fontWeight: 600, color: tk.text1}}>
            {title}
          </div>
          {description && (
            <div style={{fontSize: 11, color: tk.text3, marginTop: 2}}>
              {description}
            </div>
          )}
        </div>
      </div>
      {/* Card body */}
      <div style={{padding: "0 24px"}}>{children}</div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({label, title, description}) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        marginBottom: 28,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: tk.text3,
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontSize: "clamp(20px, 2.5vw, 26px)",
          fontWeight: 600,
          color: tk.text1,
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: 14,
            color: tk.text2,
            lineHeight: 1.7,
            maxWidth: 540,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({value, onChange}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        background: focused ? "rgba(79,110,247,0.04)" : tk.bg2,
        border: `1px solid ${focused ? tk.borderAccent : tk.border}`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 10,
        transition: "border-color 0.18s, background 0.18s",
      }}
    >
      <Search size={14} color={focused ? tk.accent : tk.text3} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search settings — teacher, calendar, AI, notifications..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          border: "none",
          background: "transparent",
          fontSize: 13,
          color: tk.text1,
          outline: "none",
          padding: "10px 0",
          fontFamily: "inherit",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            background: "none",
            border: "none",
            color: tk.text3,
            cursor: "pointer",
            padding: 0,
            display: "flex",
          }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Save bar ─────────────────────────────────────────────────────────────────

function SaveBar({dirty, onSave, onDiscard, saving, lastSaved}) {
  if (!dirty && !saving) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(9,9,12,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${tk.border}`,
        padding: "14px clamp(16px,4vw,48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: tk.amber,
            flexShrink: 0,
            boxShadow: `0 0 8px ${tk.amber}`,
          }}
        />
        <span style={{fontSize: 13, color: tk.text2}}>
          You have unsaved changes
        </span>
        {lastSaved && (
          <span style={{fontSize: 11, color: tk.text3}}>
            Last saved {lastSaved}
          </span>
        )}
      </div>
      <div style={{display: "flex", gap: 10}}>
        <button
          onClick={onDiscard}
          style={{
            padding: "8px 18px",
            background: "transparent",
            color: tk.text2,
            border: `1px solid ${tk.border}`,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "border-color 0.18s, color 0.18s",
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
          Discard
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: "8px 20px",
            background: saving ? tk.accentSubtle : tk.accent,
            color: saving ? tk.accent : "#fff",
            border: `1px solid ${saving ? tk.accentBorder : "transparent"}`,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 7,
            transition: "all 0.18s",
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saving ? (
            <RefreshCw
              size={13}
              style={{animation: "spin 0.75s linear infinite"}}
            />
          ) : (
            <Save size={13} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({active, onChange, mobileOpen, onClose}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 149,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: tk.bg1,
          borderRight: `1px solid ${tk.border}`,
          position: "sticky",
          top: 64,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 150,
          // Mobile
          ...(typeof window !== "undefined" && window.innerWidth < 900
            ? {
                position: "fixed",
                left: mobileOpen ? 0 : -260,
                top: 0,
                height: "100vh",
                paddingTop: 80,
                transition: "left 0.28s cubic-bezier(0.22,1,0.36,1)",
                boxShadow: mobileOpen ? "4px 0 40px rgba(0,0,0,0.4)" : "none",
              }
            : {}),
        }}
      >
        {/* Mobile close */}
        <button
          onClick={onClose}
          style={{
            display: "none",
            position: "absolute",
            top: 16,
            right: 16,
            background: tk.bg3,
            border: `1px solid ${tk.border}`,
            borderRadius: 8,
            padding: 6,
            cursor: "pointer",
            color: tk.text2,
          }}
          className="sidebar-close"
        >
          <X size={16} />
        </button>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChange(item.id);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 9,
                border: "none",
                background: isActive ? tk.accentSubtle : "transparent",
                color: isActive ? tk.accent : tk.text2,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                width: "100%",
                transition: "all 0.18s",
                boxShadow: isActive
                  ? `inset 0 0 0 1px ${tk.accentBorder}`
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = tk.bg3;
                  e.currentTarget.style.color = tk.text1;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = tk.text2;
                }
              }}
            >
              <Icon size={16} strokeWidth={1.8} style={{flexShrink: 0}} />
              <div style={{minWidth: 0}}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: isActive ? tk.accent : tk.text3,
                    marginTop: 1,
                    opacity: 0.8,
                  }}
                >
                  {item.desc}
                </div>
              </div>
              {isActive && (
                <ChevronRight
                  size={13}
                  style={{marginLeft: "auto", flexShrink: 0}}
                />
              )}
            </button>
          );
        })}
      </aside>
    </>
  );
}

// ─── Institution section ──────────────────────────────────────────────────────

function InstitutionSection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  return (
    <div>
      <SectionHeader
        label="Institution"
        title="Institution Profile"
        description="Configure your institution's identity, location, and operating details. This information is used across all generated timetables and reports."
      />

      {/* Overview card */}
      <SettingsCard
        title="Institution Overview"
        description="Executive summary of your academic infrastructure"
        icon={Building2}
        delay={0}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            padding: "20px 0",
          }}
        >
          {[
            {label: "Subscription", value: "Pro Plan", color: tk.accent},
            {label: "Status", value: "Active", color: tk.success},
            {label: "System Health", value: "Operational", color: tk.success},
            {label: "Academic Year", value: "2024/2025", color: tk.text2},
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: tk.bg2,
                border: `1px solid ${tk.border}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: tk.text3,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div style={{fontSize: 14, fontWeight: 600, color: item.color}}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Basic Information"
        icon={School}
        delay={60}
        iconColor={{
          bg: tk.violetSubtle,
          border: tk.violetBorder,
          text: tk.violet,
        }}
      >
        {visible("Institution Name", ["school", "name"]) && (
          <SettingRowUI
            label="Institution Name"
            description="Official registered name of your school or college"
          >
            <div style={{width: 220}}>
              <TextInput
                value={settings.name || ""}
                onChange={(v) => onChange("name", v)}
                placeholder="e.g. Nyeri High School"
              />
            </div>
          </SettingRowUI>
        )}
        {visible("School Type", ["type", "secondary", "primary"]) && (
          <SettingRowUI
            label="School Type"
            description="Classification of your educational institution"
          >
            <SelectInput
              value={settings.schoolType || "secondary"}
              onChange={(v) => onChange("schoolType", v)}
              style={{width: 180}}
              options={[
                {value: "primary", label: "Primary School"},
                {value: "secondary", label: "Secondary School"},
                {value: "college", label: "College"},
                {value: "university", label: "University"},
                {value: "vocational", label: "Vocational Institute"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Location", ["county", "city", "region"]) && (
          <SettingRowUI
            label="Location"
            description="City or county where your institution is based"
          >
            <div style={{width: 220}}>
              <TextInput
                value={settings.location || ""}
                onChange={(v) => onChange("location", v)}
                placeholder="e.g. Nyeri, Kenya"
              />
            </div>
          </SettingRowUI>
        )}
        {visible("Website", ["url", "website", "link"]) && (
          <SettingRowUI
            label="Website"
            description="Official institution website"
            border={false}
          >
            <div style={{width: 220}}>
              <TextInput
                value={settings.website || ""}
                onChange={(v) => onChange("website", v)}
                placeholder="https://school.ac.ke"
                type="url"
              />
            </div>
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Academic Configuration section ──────────────────────────────────────────

function AcademicSection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  return (
    <div>
      <SectionHeader
        label="Academic Configuration"
        title="Academic Calendar & Schedule"
        description="Define your institution's academic structure. These settings directly influence how Protiba's scheduling intelligence generates and optimizes your timetables."
      />

      {/* Academic Calendar */}
      <SettingsCard
        title="Academic Calendar"
        icon={CalendarDays}
        delay={0}
        iconColor={{
          bg: tk.accentSubtle,
          border: tk.accentBorder,
          text: tk.accent,
        }}
      >
        {visible("Academic Year", ["year", "calendar"]) && (
          <SettingRowUI
            label="Academic Year"
            description="Current academic year for timetable generation"
          >
            <SelectInput
              value={settings.academicYear || "2024/2025"}
              onChange={(v) => onChange("academicYear", v)}
              style={{width: 160}}
              options={["2024/2025", "2025/2026", "2026/2027"].map((y) => ({
                value: y,
                label: y,
              }))}
            />
          </SettingRowUI>
        )}
        {visible("Current Term", ["term", "semester", "trimester"]) && (
          <SettingRowUI
            label="Current Term"
            description="Active teaching term or semester"
          >
            <SegmentedControl
              value={settings.currentTerm || "term1"}
              onChange={(v) => onChange("currentTerm", v)}
              options={[
                {value: "term1", label: "Term 1"},
                {value: "term2", label: "Term 2"},
                {value: "term3", label: "Term 3"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Number of Terms", ["terms", "semesters"]) && (
          <SettingRowUI
            label="Number of Terms"
            description="How many teaching terms per academic year"
          >
            <SegmentedControl
              value={String(settings.numTerms || "3")}
              onChange={(v) => onChange("numTerms", v)}
              options={[
                {value: "2", label: "2 Terms"},
                {value: "3", label: "3 Terms"},
                {value: "4", label: "4 Terms"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Academic Start Date", ["start", "begin", "date"]) && (
          <SettingRowUI
            label="Academic Start Date"
            description="When the current academic year begins"
          >
            <TextInput
              value={settings.startDate || ""}
              onChange={(v) => onChange("startDate", v)}
              type="date"
            />
          </SettingRowUI>
        )}
        {visible("Academic End Date", ["end", "finish", "date"]) && (
          <SettingRowUI
            label="Academic End Date"
            description="When the current academic year ends"
            border={false}
          >
            <TextInput
              value={settings.endDate || ""}
              onChange={(v) => onChange("endDate", v)}
              type="date"
            />
          </SettingRowUI>
        )}
      </SettingsCard>

      {/* School Schedule */}
      <SettingsCard
        title="School Schedule"
        icon={Clock3}
        delay={80}
        iconColor={{
          bg: tk.successSubtle,
          border: tk.successBorder,
          text: tk.success,
        }}
      >
        {visible("Morning Start Time", ["start", "time", "morning"]) && (
          <SettingRowUI
            label="Morning Start Time"
            description="When the first lesson of the day begins"
          >
            <TextInput
              value={settings.startTime || "07:00"}
              onChange={(v) => onChange("startTime", v)}
              type="time"
            />
          </SettingRowUI>
        )}
        {visible("School End Time", ["end", "time", "finish"]) && (
          <SettingRowUI
            label="School End Time"
            description="When the last lesson of the day ends"
          >
            <TextInput
              value={settings.endTime || "17:00"}
              onChange={(v) => onChange("endTime", v)}
              type="time"
            />
          </SettingRowUI>
        )}
        {visible("Lessons Per Day", ["lessons", "periods", "day"]) && (
          <SettingRowUI
            label="Lessons Per Day"
            description="Maximum number of lessons scheduled per day"
            helper={`Currently ${settings.lessonsPerDay || 8} lessons per day`}
          >
            <SliderInput
              value={settings.lessonsPerDay || 8}
              onChange={(v) => onChange("lessonsPerDay", v)}
              min={4}
              max={12}
              unit=" periods"
            />
          </SettingRowUI>
        )}
        {visible("Lesson Duration", [
          "duration",
          "lesson",
          "period",
          "minutes",
        ]) && (
          <SettingRowUI
            label="Lesson Duration"
            description="Standard duration of a single teaching period"
            helper="Double lessons use 2x this value"
          >
            <SliderInput
              value={settings.lessonDuration || 40}
              onChange={(v) => onChange("lessonDuration", v)}
              min={30}
              max={90}
              step={5}
              unit=" min"
            />
          </SettingRowUI>
        )}
        {visible("Break Duration", ["break", "recess", "minutes"]) && (
          <SettingRowUI
            label="Break Duration"
            description="Duration of short breaks between lessons"
          >
            <SliderInput
              value={settings.breakDuration || 20}
              onChange={(v) => onChange("breakDuration", v)}
              min={5}
              max={45}
              step={5}
              unit=" min"
            />
          </SettingRowUI>
        )}
        {visible("Lunch Duration", ["lunch", "break", "minutes"]) && (
          <SettingRowUI
            label="Lunch Duration"
            description="Duration of the midday lunch break"
          >
            <SliderInput
              value={settings.lunchDuration || 45}
              onChange={(v) => onChange("lunchDuration", v)}
              min={20}
              max={90}
              step={5}
              unit=" min"
            />
          </SettingRowUI>
        )}
        {visible("Saturday Classes", ["saturday", "weekend", "classes"]) && (
          <SettingRowUI
            label="Saturday Classes"
            description="Enable scheduled lessons on Saturdays"
          >
            <Toggle
              value={settings.saturdayClasses || false}
              onChange={(v) => onChange("saturdayClasses", v)}
            />
          </SettingRowUI>
        )}
        {visible("Sunday Classes", ["sunday", "weekend", "classes"]) && (
          <SettingRowUI
            label="Sunday Classes"
            description="Enable scheduled lessons on Sundays"
            border={false}
          >
            <Toggle
              value={settings.sundayClasses || false}
              onChange={(v) => onChange("sundayClasses", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>

      {/* Generation Defaults */}
      <SettingsCard
        title="Timetable Generation Defaults"
        icon={Settings2}
        delay={160}
        iconColor={{
          bg: tk.violetSubtle,
          border: tk.violetBorder,
          text: tk.violet,
        }}
      >
        {visible("Generation Strategy", [
          "strategy",
          "generate",
          "ai",
          "algorithm",
        ]) && (
          <SettingRowUI
            label="Generation Strategy"
            description="How Protiba's AI approaches schedule building"
          >
            <SelectInput
              value={settings.strategy || "balanced"}
              onChange={(v) => onChange("strategy", v)}
              style={{width: 200}}
              options={[
                {value: "fast", label: "Fast Mode"},
                {value: "balanced", label: "Balanced (Recommended)"},
                {value: "optimal", label: "Maximum Optimization"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Optimization Mode", ["optimize", "mode", "quality"]) && (
          <SettingRowUI
            label="Optimization Mode"
            description="Priority focus during schedule generation"
          >
            <SegmentedControl
              value={settings.optimizationMode || "balanced"}
              onChange={(v) => onChange("optimizationMode", v)}
              options={[
                {value: "teacher", label: "Teacher First"},
                {value: "balanced", label: "Balanced"},
                {value: "student", label: "Student First"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Automatic Regeneration", [
          "auto",
          "regenerate",
          "conflict",
        ]) && (
          <SettingRowUI
            label="Automatic Regeneration"
            description="Automatically regenerate when configuration changes are detected"
          >
            <Toggle
              value={settings.autoRegenerate || false}
              onChange={(v) => onChange("autoRegenerate", v)}
            />
          </SettingRowUI>
        )}
        {visible("Conflict Resolution", ["conflict", "resolve", "error"]) && (
          <SettingRowUI
            label="Conflict Resolution"
            description="How the engine handles unresolvable scheduling conflicts"
            border={false}
          >
            <SelectInput
              value={settings.conflictResolution || "skip"}
              onChange={(v) => onChange("conflictResolution", v)}
              style={{width: 200}}
              options={[
                {value: "skip", label: "Skip and Warn"},
                {value: "reassign", label: "Auto-Reassign Teacher"},
                {value: "flag", label: "Flag for Manual Review"},
              ]}
            />
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Timetable Preferences section ───────────────────────────────────────────

function TimetableSection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  return (
    <div>
      <SectionHeader
        label="Timetable Preferences"
        title="Scheduling Rules & Intelligence"
        description="Fine-tune how Protiba's AI engine schedules teachers, subjects, and classes. These preferences are applied every time a timetable is generated or regenerated."
      />

      {/* Teacher Preferences */}
      <SettingsCard
        title="Teacher Preferences"
        icon={Users}
        delay={0}
        iconColor={{
          bg: "rgba(245,158,11,0.09)",
          border: "rgba(245,158,11,0.24)",
          text: tk.amber,
        }}
      >
        {visible("Maximum Daily Lessons", ["teacher", "max", "daily"]) && (
          <SettingRowUI
            label="Maximum Daily Lessons"
            description="Upper limit for lessons a single teacher can teach per day"
          >
            <SliderInput
              value={settings.maxTeacherDaily || 6}
              onChange={(v) => onChange("maxTeacherDaily", v)}
              min={2}
              max={10}
              unit=" lessons"
            />
          </SettingRowUI>
        )}
        {visible("Maximum Weekly Lessons", ["teacher", "max", "weekly"]) && (
          <SettingRowUI
            label="Maximum Weekly Lessons"
            description="Upper limit for total lessons per teacher per week"
          >
            <SliderInput
              value={settings.maxTeacherWeekly || 28}
              onChange={(v) => onChange("maxTeacherWeekly", v)}
              min={10}
              max={40}
              unit=" lessons"
            />
          </SettingRowUI>
        )}
        {visible("Minimum Break Between Lessons", [
          "break",
          "gap",
          "rest",
          "teacher",
        ]) && (
          <SettingRowUI
            label="Minimum Break Between Lessons"
            description="Required gap between consecutive teaching periods"
            helper="Prevents teacher fatigue and burnout"
          >
            <SegmentedControl
              value={settings.minTeacherBreak || "none"}
              onChange={(v) => onChange("minTeacherBreak", v)}
              options={[
                {value: "none", label: "None"},
                {value: "1", label: "1 Period"},
                {value: "2", label: "2 Periods"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Avoid Consecutive Double Lessons", [
          "double",
          "consecutive",
          "teacher",
        ]) && (
          <SettingRowUI
            label="Avoid Consecutive Double Lessons"
            description="Prevent the same teacher from taking back-to-back double periods"
            border={false}
          >
            <Toggle
              value={settings.avoidConsecutiveDouble || true}
              onChange={(v) => onChange("avoidConsecutiveDouble", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>

      {/* Subject Rules */}
      <SettingsCard
        title="Subject Rules"
        icon={BookOpen}
        delay={80}
        iconColor={{
          bg: tk.successSubtle,
          border: tk.successBorder,
          text: tk.success,
        }}
      >
        {visible("Double Lessons Allowed", [
          "double",
          "lessons",
          "subject",
        ]) && (
          <SettingRowUI
            label="Double Lessons Allowed"
            description="Permit consecutive periods for the same subject"
          >
            <Toggle
              value={settings.doubleAllowed || true}
              onChange={(v) => onChange("doubleAllowed", v)}
            />
          </SettingRowUI>
        )}
        {visible("Maximum Double Lessons Per Subject", [
          "double",
          "max",
          "subject",
        ]) && (
          <SettingRowUI
            label="Maximum Doubles Per Subject Per Week"
            description="Cap on double period allocations per subject"
          >
            <SliderInput
              value={settings.maxDoubles || 2}
              onChange={(v) => onChange("maxDoubles", v)}
              min={0}
              max={5}
              unit="x"
            />
          </SettingRowUI>
        )}
        {visible("Lab Priority", ["lab", "science", "practical"]) && (
          <SettingRowUI
            label="Lab Session Priority"
            description="Schedule lab-requiring subjects in available lab periods first"
          >
            <Toggle
              value={settings.labPriority || true}
              onChange={(v) => onChange("labPriority", v)}
            />
          </SettingRowUI>
        )}
        {visible("Sports Priority", ["sports", "pe", "physical"]) && (
          <SettingRowUI
            label="Sports & PE Priority"
            description="Assign sports periods to afternoon slots where possible"
            border={false}
          >
            <Toggle
              value={settings.sportsPriority || true}
              onChange={(v) => onChange("sportsPriority", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>

      {/* AI Scheduling */}
      <SettingsCard
        title="AI Scheduling Engine"
        icon={Brain}
        delay={160}
        iconColor={{
          bg: tk.violetSubtle,
          border: tk.violetBorder,
          text: tk.violet,
        }}
      >
        {visible("Automatic Conflict Resolution", [
          "ai",
          "conflict",
          "auto",
          "resolve",
        ]) && (
          <SettingRowUI
            label="Automatic Conflict Resolution"
            description="Let the AI engine automatically resolve scheduling conflicts without manual intervention"
            helper="Protiba's AI resolves 98% of conflicts automatically"
          >
            <Toggle
              value={settings.aiAutoResolve || true}
              onChange={(v) => onChange("aiAutoResolve", v)}
            />
          </SettingRowUI>
        )}
        {visible("Generation Quality", ["quality", "accuracy", "ai"]) && (
          <SettingRowUI
            label="Generation Quality"
            description="Balance between generation speed and schedule quality"
          >
            <SegmentedControl
              value={settings.generationQuality || "balanced"}
              onChange={(v) => onChange("generationQuality", v)}
              options={[
                {value: "fast", label: "Fast"},
                {value: "balanced", label: "Balanced"},
                {value: "maximum", label: "Maximum"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Confidence Threshold", [
          "confidence",
          "threshold",
          "ai",
          "accuracy",
        ]) && (
          <SettingRowUI
            label="Confidence Threshold"
            description="Minimum AI confidence score required before accepting a generated schedule"
            helper="Higher values produce better schedules but may increase generation time"
          >
            <SliderInput
              value={settings.confidenceThreshold || 80}
              onChange={(v) => onChange("confidenceThreshold", v)}
              min={50}
              max={99}
              unit="%"
            />
          </SettingRowUI>
        )}
        {visible("Smart Suggestions", [
          "suggestions",
          "ai",
          "smart",
          "predict",
        ]) && (
          <SettingRowUI
            label="Smart Suggestions"
            description="Receive AI-powered recommendations for improving your timetable"
          >
            <Toggle
              value={settings.smartSuggestions || true}
              onChange={(v) => onChange("smartSuggestions", v)}
            />
          </SettingRowUI>
        )}
        {visible("Predictive Improvements", [
          "predictive",
          "ai",
          "improve",
          "learn",
        ]) && (
          <SettingRowUI
            label="Predictive Improvements"
            description="Allow Protiba to learn from your adjustments and improve future generations"
          >
            <Toggle
              value={settings.predictiveMode || false}
              onChange={(v) => onChange("predictiveMode", v)}
            />
          </SettingRowUI>
        )}
        {visible("Learning Mode", ["learning", "adaptive", "ai"]) && (
          <SettingRowUI
            label="Learning Mode"
            description="Enable adaptive scheduling that improves over time based on your institution's patterns"
            border={false}
          >
            <Toggle
              value={settings.learningMode || false}
              onChange={(v) => onChange("learningMode", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>

      {/* Regeneration Behaviour */}
      <SettingsCard
        title="Regeneration Behaviour"
        icon={RefreshCw}
        delay={240}
        iconColor={{
          bg: tk.accentSubtle,
          border: tk.accentBorder,
          text: tk.accent,
        }}
      >
        {visible("Regeneration Strategy", [
          "regenerate",
          "partial",
          "full",
          "strategy",
        ]) && (
          <SettingRowUI
            label="Regeneration Strategy"
            description="How the system handles timetable regeneration after changes"
          >
            <SelectInput
              value={settings.regenStrategy || "partial"}
              onChange={(v) => onChange("regenStrategy", v)}
              style={{width: 220}}
              options={[
                {value: "full", label: "Regenerate Entire Schedule"},
                {value: "partial", label: "Partial Regeneration (Recommended)"},
                {value: "keep", label: "Keep Existing, Fill Gaps"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Allow AI Rearrangement", ["rearrange", "ai", "move"]) && (
          <SettingRowUI
            label="Allow AI Rearrangement"
            description="Permit the AI to move existing lessons to resolve new conflicts"
          >
            <Toggle
              value={settings.allowRearrangement || true}
              onChange={(v) => onChange("allowRearrangement", v)}
            />
          </SettingRowUI>
        )}
        {visible("Version History", ["version", "history", "backup"]) && (
          <SettingRowUI
            label="Version History"
            description="Keep a history of all generated timetables for comparison and rollback"
            helper="Stores up to 20 previous versions"
          >
            <Toggle
              value={settings.versionHistory || true}
              onChange={(v) => onChange("versionHistory", v)}
            />
          </SettingRowUI>
        )}
        {visible("Rollback Support", ["rollback", "undo", "restore"]) && (
          <SettingRowUI
            label="Rollback Support"
            description="Allow one-click restoration of any previous timetable version"
            border={false}
          >
            <Toggle
              value={settings.rollbackSupport || true}
              onChange={(v) => onChange("rollbackSupport", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Notifications section ────────────────────────────────────────────────────

function NotificationsSection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };
  return (
    <div>
      <SectionHeader
        label="Notifications"
        title="Alerts & Updates"
        description="Control how and when Protiba notifies you about scheduling events, conflicts, and system updates."
      />
      <SettingsCard
        title="Notification Channels"
        icon={Bell}
        delay={0}
        iconColor={{bg: tk.amberSubtle, border: tk.amberBorder, text: tk.amber}}
      >
        {visible("Email Notifications", ["email", "notify"]) && (
          <SettingRowUI
            label="Email Notifications"
            description="Receive scheduling alerts and reports via email"
          >
            <Toggle
              value={settings.emailNotifs || true}
              onChange={(v) => onChange("emailNotifs", v)}
            />
          </SettingRowUI>
        )}
        {visible("Conflict Alerts", ["conflict", "alert", "warning"]) && (
          <SettingRowUI
            label="Conflict Alerts"
            description="Notify immediately when scheduling conflicts are detected"
          >
            <Toggle
              value={settings.conflictAlerts || true}
              onChange={(v) => onChange("conflictAlerts", v)}
            />
          </SettingRowUI>
        )}
        {visible("Generation Complete", ["generation", "complete", "done"]) && (
          <SettingRowUI
            label="Generation Complete"
            description="Notify when a timetable generation finishes"
          >
            <Toggle
              value={settings.generationNotif || true}
              onChange={(v) => onChange("generationNotif", v)}
            />
          </SettingRowUI>
        )}
        {visible("Weekly Summary", ["weekly", "summary", "report"]) && (
          <SettingRowUI
            label="Weekly Summary"
            description="Receive a weekly digest of scheduling activity and insights"
            border={false}
          >
            <Toggle
              value={settings.weeklySummary || false}
              onChange={(v) => onChange("weeklySummary", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Appearance section ───────────────────────────────────────────────────────

function AppearanceSection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };
  const themes = [
    {value: "dark", label: "Dark", icon: Moon},
    {value: "light", label: "Light", icon: Sun},
    {value: "system", label: "System", icon: Monitor},
  ];
  return (
    <div>
      <SectionHeader
        label="Appearance"
        title="Theme & Display"
        description="Personalize how the Protiba interface looks and feels for your workflow."
      />
      <SettingsCard
        title="Interface Theme"
        icon={Palette}
        delay={0}
        iconColor={{
          bg: tk.violetSubtle,
          border: tk.violetBorder,
          text: tk.violet,
        }}
      >
        {visible("Theme", ["theme", "dark", "light", "mode"]) && (
          <SettingRowUI
            label="Theme"
            description="Choose your preferred interface color scheme"
          >
            <div style={{display: "flex", gap: 10}}>
              {themes.map(({value, label, icon: Icon}) => {
                const active = (settings.theme || "dark") === value;
                return (
                  <button
                    key={value}
                    onClick={() => onChange("theme", value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      background: active ? tk.accentSubtle : tk.bg2,
                      boxShadow: active
                        ? `inset 0 0 0 1.5px ${tk.accent}`
                        : `inset 0 0 0 1px ${tk.border}`,
                      transition: "all 0.18s",
                    }}
                  >
                    <Icon
                      size={18}
                      color={active ? tk.accent : tk.text3}
                      strokeWidth={1.6}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: active ? 600 : 400,
                        color: active ? tk.accent : tk.text3,
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </SettingRowUI>
        )}
        {visible("Compact Mode", ["compact", "dense", "spacing"]) && (
          <SettingRowUI
            label="Compact Mode"
            description="Reduce spacing for a denser information layout"
            border={false}
          >
            <Toggle
              value={settings.compactMode || false}
              onChange={(v) => onChange("compactMode", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Security section ─────────────────────────────────────────────────────────

function SecuritySection({settings, onChange, search}) {
  const visible = (label, tags = []) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      label.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  };
  return (
    <div>
      <SectionHeader
        label="Security"
        title="Access & Permissions"
        description="Manage authentication, session security, and access controls for your institution's Protiba workspace."
      />
      <SettingsCard
        title="Authentication"
        icon={ShieldCheck}
        delay={0}
        iconColor={{
          bg: tk.dangerSubtle,
          border: tk.dangerBorder,
          text: tk.danger,
        }}
      >
        {visible("Two-Factor Authentication", [
          "2fa",
          "two factor",
          "security",
          "auth",
        ]) && (
          <SettingRowUI
            label="Two-Factor Authentication"
            description="Require a second verification step when signing in"
            helper="Strongly recommended for institution accounts"
          >
            <Toggle
              value={settings.twoFactor || false}
              onChange={(v) => onChange("twoFactor", v)}
            />
          </SettingRowUI>
        )}
        {visible("Session Timeout", ["session", "timeout", "logout"]) && (
          <SettingRowUI
            label="Session Timeout"
            description="Automatically sign out after a period of inactivity"
          >
            <SelectInput
              value={settings.sessionTimeout || "24h"}
              onChange={(v) => onChange("sessionTimeout", v)}
              style={{width: 160}}
              options={[
                {value: "1h", label: "1 Hour"},
                {value: "8h", label: "8 Hours"},
                {value: "24h", label: "24 Hours"},
                {value: "never", label: "Never"},
              ]}
            />
          </SettingRowUI>
        )}
        {visible("Login Notifications", ["login", "notify", "alert"]) && (
          <SettingRowUI
            label="Login Notifications"
            description="Receive an alert when your account is accessed from a new device"
            border={false}
          >
            <Toggle
              value={settings.loginNotifs || true}
              onChange={(v) => onChange("loginNotifs", v)}
            />
          </SettingRowUI>
        )}
      </SettingsCard>
    </div>
  );
}

// ─── Data section ─────────────────────────────────────────────────────────────

function DataSection({settings, onChange, search}) {
  return (
    <div>
      <SectionHeader
        label="Data & Backup"
        title="Export & Recovery"
        description="Export your timetable data, configure automatic backups, and manage data retention policies."
      />
      <SettingsCard
        title="Data Management"
        icon={Database}
        delay={0}
        iconColor={{bg: tk.tealSubtle, border: tk.tealBorder, text: "#2DD4BF"}}
      >
        <SettingRowUI
          label="Auto Backup"
          description="Automatically back up timetable data daily"
        >
          <Toggle
            value={settings.autoBackup || true}
            onChange={(v) => onChange("autoBackup", v)}
          />
        </SettingRowUI>
        <SettingRowUI
          label="Data Retention"
          description="How long historical timetable data is kept"
        >
          <SelectInput
            value={settings.dataRetention || "1year"}
            onChange={(v) => onChange("dataRetention", v)}
            style={{width: 160}}
            options={[
              {value: "3months", label: "3 Months"},
              {value: "6months", label: "6 Months"},
              {value: "1year", label: "1 Year"},
              {value: "forever", label: "Forever"},
            ]}
          />
        </SettingRowUI>
        <SettingRowUI
          label="Export Format"
          description="Default format when exporting timetable data"
          border={false}
        >
          <SegmentedControl
            value={settings.exportFormat || "pdf"}
            onChange={(v) => onChange("exportFormat", v)}
            options={[
              {value: "pdf", label: "PDF"},
              {value: "csv", label: "CSV"},
              {value: "xlsx", label: "Excel"},
            ]}
          />
        </SettingRowUI>
      </SettingsCard>
    </div>
  );
}

// ─── About section ────────────────────────────────────────────────────────────

function AboutSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <div>
      <SectionHeader
        label="About"
        title="Protiba Platform"
        description="Version, credits, and platform information for your Protiba installation."
      />
      <div
        ref={ref}
        style={{
          background: tk.bg1,
          border: `1px solid ${tk.border}`,
          borderRadius: 14,
          padding: 28,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(18px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: tk.accentSubtle,
              border: `1px solid ${tk.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={22} color={tk.accent} />
          </div>
          <div>
            <div style={{fontSize: 17, fontWeight: 600, color: tk.text1}}>
              Protiba
            </div>
            <div style={{fontSize: 12, color: tk.text3}}>
              Academic Scheduling Infrastructure
            </div>
          </div>
        </div>
        {[
          {label: "Version", value: "2.4.1"},
          {label: "Platform", value: "Cloud — Kenya Region"},
          {label: "Last Updated", value: "July 2025"},
          {label: "Support", value: "allankirimi65@gmail.com"},
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom:
                i < arr.length - 1 ? `1px solid ${tk.border}` : "none",
              fontSize: 13,
            }}
          >
            <span style={{color: tk.text3}}>{row.label}</span>
            <span style={{color: tk.text1, fontWeight: 500}}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Placeholder sections ─────────────────────────────────────────────────────

function PlaceholderSection({id}) {
  const item = NAV_ITEMS.find((n) => n.id === id);
  const Icon = item?.icon || Settings2;
  const [ref, inView] = useInView(0.1);
  return (
    <div>
      <SectionHeader
        label={item?.label || "Settings"}
        title={item?.label || "Settings"}
        description={`Configure ${item?.label?.toLowerCase()} preferences for your institution.`}
      />
      <div
        ref={ref}
        style={{
          background: tk.bg1,
          border: `1px solid ${tk.border}`,
          borderRadius: 14,
          padding: "48px 28px",
          textAlign: "center",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(18px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            margin: "0 auto 18px",
            background: tk.accentSubtle,
            border: `1px solid ${tk.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={tk.accent} strokeWidth={1.6} />
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: tk.text1,
            marginBottom: 8,
          }}
        >
          {item?.label} Settings
        </h3>
        <p
          style={{
            fontSize: 13,
            color: tk.text3,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          These settings are being configured. Check back soon or contact
          support for assistance.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const tealSubtle = "rgba(45,212,191,0.08)";
const tealBorder = "rgba(45,212,191,0.22)";

const Settings = () => {
  const {user, isLoading: authLoading} = useAuthStore();
  const [activeSection, setActiveSection] = useState("institution");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState({
    // Institution
    name: "Nyeri High School",
    schoolType: "secondary",
    location: "Nyeri, Kenya",
    website: "",
    // Academic
    academicYear: "2024/2025",
    currentTerm: "term2",
    numTerms: "3",
    startDate: "2025-01-06",
    endDate: "2025-04-04",
    startTime: "07:00",
    endTime: "17:00",
    lessonsPerDay: 8,
    lessonDuration: 40,
    breakDuration: 20,
    lunchDuration: 45,
    saturdayClasses: false,
    sundayClasses: false,
    strategy: "balanced",
    optimizationMode: "balanced",
    autoRegenerate: false,
    conflictResolution: "skip",
    // Timetable
    maxTeacherDaily: 6,
    maxTeacherWeekly: 28,
    minTeacherBreak: "none",
    avoidConsecutiveDouble: true,
    doubleAllowed: true,
    maxDoubles: 2,
    labPriority: true,
    sportsPriority: true,
    aiAutoResolve: true,
    generationQuality: "balanced",
    confidenceThreshold: 80,
    smartSuggestions: true,
    predictiveMode: false,
    learningMode: false,
    regenStrategy: "partial",
    allowRearrangement: true,
    versionHistory: true,
    rollbackSupport: true,
    // Notifications
    emailNotifs: true,
    conflictAlerts: true,
    generationNotif: true,
    weeklySummary: false,
    // Appearance
    theme: "dark",
    compactMode: false,
    // Security
    twoFactor: false,
    sessionTimeout: "24h",
    loginNotifs: true,
    // Data
    autoBackup: true,
    dataRetention: "1year",
    exportFormat: "pdf",
  });

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (res.ok) window.location.href = "/login";
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleChange = useCallback((key, value) => {
    setSettings((prev) => ({...prev, [key]: value}));
    setDirty(true);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setDirty(false);
    const now = new Date();
    setLastSaved(
      `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
    );
  };

  const handleDiscard = () => {
    setDirty(false);
  };

  const renderSection = () => {
    const props = {settings, onChange: handleChange, search};
    switch (activeSection) {
      case "institution":
        return <InstitutionSection {...props} />;
      case "academic":
        return <AcademicSection {...props} />;
      case "timetable":
        return <TimetableSection {...props} />;
      case "notifications":
        return <NotificationsSection {...props} />;
      case "appearance":
        return <AppearanceSection {...props} />;
      case "security":
        return <SecuritySection {...props} />;
      case "data":
        return <DataSection {...props} />;
      case "about":
        return <AboutSection />;
      default:
        return <PlaceholderSection id={activeSection} />;
    }
  };

  if (authLoading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div
          style={{
            background: tk.bg0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `2px solid ${tk.accentSubtle}`,
              borderTopColor: tk.accent,
              animation: "spin 0.75s linear infinite",
            }}
          />
          <span style={{fontSize: 12, color: tk.text3}}>Loading settings</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes shimmer {
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(79,110,247,0.25); border-radius: 2px; }

        input[type="date"], input[type="time"] {
          color-scheme: dark;
        }
        select option { background: #14151C; color: #EDEEF5; }

        @media (max-width: 900px) {
          .settings-sidebar { display: none !important; }
          .settings-mobile-bar { display: flex !important; }
          .sidebar-close { display: flex !important; }
        }
        @media (min-width: 901px) {
          .settings-sidebar { display: flex !important; }
          .settings-mobile-bar { display: none !important; }
        }

        @media (max-width: 600px) {
          .settings-hero { padding: 32px 16px 24px !important; }
          .settings-content { padding: 24px 16px 100px !important; }
          .settings-search-wrap { padding: 0 16px 16px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navigation
        userName={userName}
        institutionName={settings.name || "Your Institution"}
        notificationCount={3}
        onLogout={handleLogout}
      />

      <div
        style={{
          minHeight: "100vh",
          background: tk.bg0,
          color: tk.text1,
          paddingTop: 64,
          fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
        }}
      >
        {/* Ambient glow */}
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

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          className="settings-hero"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "48px 48px 28px",
            position: "relative",
            zIndex: 1,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
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
                  padding: "4px 12px",
                  marginBottom: 14,
                }}
              >
                <Settings2 size={11} />
                Control Center
              </div>
              <h1
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: tk.text1,
                  marginBottom: 8,
                }}
              >
                Settings
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: tk.text2,
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}
              >
                Control how Protiba works for{" "}
                {settings.name || "your institution"}. Configure your academic
                infrastructure, scheduling intelligence, and preferences.
              </p>
            </div>

            {/* Status strip */}
            <div style={{display: "flex", flexWrap: "wrap", gap: 10}}>
              {[
                {
                  label: "Pro Plan",
                  color: tk.accent,
                  bg: tk.accentSubtle,
                  border: tk.accentBorder,
                },
                {
                  label: "System Operational",
                  color: tk.success,
                  bg: tk.successSubtle,
                  border: tk.successBorder,
                },
                lastSaved && {
                  label: `Saved ${lastSaved}`,
                  color: tk.text3,
                  bg: tk.bg2,
                  border: tk.border,
                },
              ]
                .filter(Boolean)
                .map((badge) => (
                  <div
                    key={badge.label}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: badge.color,
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      borderRadius: 20,
                      padding: "5px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: badge.color,
                        display: "inline-block",
                      }}
                    />
                    {badge.label}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <div
          className="settings-search-wrap"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 48px 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: tk.border,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        />

        {/* ── Mobile nav bar ───────────────────────────────────────────────── */}
        <div
          className="settings-mobile-bar"
          style={{
            display: "none",
            padding: "12px 20px",
            alignItems: "center",
            gap: 12,
            borderBottom: `1px solid ${tk.border}`,
            background: tk.bg1,
            position: "sticky",
            top: 64,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setMobileNavOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: tk.bg2,
              border: `1px solid ${tk.border}`,
              borderRadius: 9,
              color: tk.text2,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Menu size={15} />
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label || "Settings"}
          </button>
          {dirty && (
            <span
              style={{
                fontSize: 11,
                color: tk.amber,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: tk.amber,
                  display: "inline-block",
                }}
              />
              Unsaved changes
            </span>
          )}
        </div>

        {/* ── Layout ──────────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Sidebar */}
          <div className="settings-sidebar">
            <Sidebar
              active={activeSection}
              onChange={(id) => {
                setActiveSection(id);
                setSearch("");
              }}
              mobileOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
            />
          </div>

          {/* Mobile sidebar (portal-like) */}
          {mobileNavOpen && (
            <Sidebar
              active={activeSection}
              onChange={(id) => {
                setActiveSection(id);
                setSearch("");
              }}
              mobileOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
            />
          )}

          {/* Main content */}
          <main
            className="settings-content"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "36px 48px 120px",
            }}
          >
            {search && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                  fontSize: 12,
                  color: tk.text3,
                }}
              >
                <Search size={12} />
                Searching across all settings for &ldquo;{search}&rdquo;
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: tk.accent,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  Clear
                </button>
              </div>
            )}

            {renderSection()}
          </main>
        </div>

        {/* Save bar */}
        <SaveBar
          dirty={dirty}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saving={saving}
          lastSaved={lastSaved}
        />
      </div>
    </>
  );
};

export default Settings;
