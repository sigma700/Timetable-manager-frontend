import clsx from "clsx";

/**
 * MetricCard — displays a single KPI with label, value, and optional trend.
 *
 * @param {string}  label      - Metric label e.g. "Total Teachers"
 * @param {string}  value      - Metric value e.g. "24"
 * @param {string}  [icon]     - Optional emoji or icon character
 * @param {string}  [trend]    - Optional trend string e.g. "+3 this month"
 * @param {string}  [color]    - Accent color: 'primary' | 'success' | 'warning' | 'danger' | 'accent'
 * @param {boolean} [loading]  - Show skeleton state
 */
const MetricCard = ({
  label,
  value,
  icon,
  trend,
  color = "primary",
  loading = false,
}) => {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    accent: "bg-accent/10 text-accent",
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 w-24 rounded bg-brand-border mb-4" />
        <div className="h-8 w-16 rounded bg-brand-border mb-2" />
        <div className="h-3 w-32 rounded bg-brand-border" />
      </div>
    );
  }

  return (
    <div className="card hover:border-primary/30 transition-colors duration-150 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-muted font-medium">{label}</span>
        {icon && (
          <span
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm",
              accentMap[color],
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <p className="text-3xl font-bold text-[var(--color-text)] mb-1 tabular-nums">
        {value ?? "—"}
      </p>

      {trend && <p className="text-xs text-muted mt-1">{trend}</p>}
    </div>
  );
};

export default MetricCard;
