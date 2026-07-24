import clsx from "clsx";

/**
 * Badge — inline status label.
 *
 * @param {string} label    - Text to display
 * @param {string} variant  - 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral'
 * @param {string} [size]   - 'sm' | 'md'
 */
const Badge = ({label, variant = "neutral", size = "md"}) => {
  const variantMap = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10  text-danger  border-danger/20",
    info: "bg-info/10    text-info    border-info/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10  text-accent  border-accent/20",
    neutral: "bg-brand-border/50 text-muted border-brand-border",
  };

  const sizeMap = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-medium",
        variantMap[variant],
        sizeMap[size],
      )}
    >
      {label}
    </span>
  );
};

/**
 * Maps health category string to badge variant.
 */
export const HealthBadge = ({category}) => {
  const map = {
    Excellent: "success",
    Good: "info",
    "Needs Attention": "warning",
    Critical: "danger",
  };

  return <Badge label={category} variant={map[category] ?? "neutral"} />;
};

/**
 * Maps account type to badge variant.
 */
export const RoleBadge = ({role}) => {
  const map = {
    admin: "danger",
    school_admin: "primary",
    teacher: "neutral",
  };

  const labels = {
    admin: "Super Admin",
    school_admin: "School Admin",
    teacher: "Teacher",
  };

  return (
    <Badge label={labels[role] ?? role} variant={map[role] ?? "neutral"} />
  );
};

export default Badge;
