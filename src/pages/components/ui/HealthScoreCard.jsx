import {HealthBadge} from "./Badge.jsx";
import {Skeleton} from "./Skeleton.jsx";
import clsx from "clsx";

/**
 * Returns the stroke color for the score ring.
 */
const scoreColor = (score) => {
  if (score >= 80) return "#10b981"; // success
  if (score >= 60) return "#3b82f6"; // info
  if (score >= 40) return "#f59e0b"; // warning
  return "#ef4444"; // danger
};

/**
 * Circular SVG score ring.
 */
const ScoreRing = ({score}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{transition: "stroke-dasharray 0.6s ease"}}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums" style={{color}}>
          {score}
        </span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
};

/**
 * HealthScoreCard — displays the timetable health score with breakdown.
 *
 * @param {Object}  data     - Health data from /api/analytics/health
 * @param {boolean} loading
 */
const HealthScoreCard = ({data, loading = false}) => {
  if (loading) {
    return (
      <div className="card">
        <Skeleton className="h-5 w-40 mb-6" />
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-36 h-36 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const issues = [
    {label: "Warnings", value: data.issues?.warnings, color: "text-warning"},
    {
      label: "Empty Slots",
      value: data.issues?.emptySlots,
      color: "text-danger",
    },
    {
      label: "Unassigned Teachers",
      value: data.issues?.unassignedTeachers,
      color: "text-warning",
    },
    {
      label: "Coverage Gaps",
      value: data.issues?.coverageGaps,
      color: "text-danger",
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Timetable Health
          </h3>
          <p className="text-xs text-muted mt-0.5">{data.timetableName}</p>
        </div>
        <HealthBadge category={data.category} />
      </div>

      <div className="flex flex-col items-center mb-6">
        <ScoreRing score={data.healthScore} />
      </div>

      <div className="space-y-2 border-t border-brand-border pt-4">
        {issues.map((issue) => (
          <div key={issue.label} className="flex items-center justify-between">
            <span className="text-xs text-muted">{issue.label}</span>
            <span
              className={clsx(
                "text-xs font-semibold tabular-nums",
                issue.color,
              )}
            >
              {issue.value ?? 0}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-2 gap-2 text-xs text-muted">
        <span>
          Total Periods:{" "}
          <strong className="text-[var(--color-text)]">
            {data.totalPeriods}
          </strong>
        </span>
        <span>
          Total Classes:{" "}
          <strong className="text-[var(--color-text)]">
            {data.totalClasses}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default HealthScoreCard;
