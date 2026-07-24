import clsx from "clsx";

/**
 * Base skeleton block.
 */
export const Skeleton = ({className}) => (
  <div className={clsx("animate-pulse rounded bg-brand-border", className)} />
);

/**
 * Skeleton row for tables — renders N placeholder rows.
 */
export const TableSkeleton = ({rows = 5, cols = 4}) => (
  <div className="w-full">
    {Array.from({length: rows}).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-4 py-3 border-b border-brand-border"
      >
        {Array.from({length: cols}).map((_, j) => (
          <Skeleton
            key={j}
            className={clsx("h-4", j === 0 ? "w-32" : "flex-1")}
          />
        ))}
      </div>
    ))}
  </div>
);

/**
 * Skeleton grid for metric cards.
 */
export const MetricGridSkeleton = ({count = 4}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({length: count}).map((_, i) => (
      <div key={i} className="card animate-pulse">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </div>
);

export default Skeleton;
