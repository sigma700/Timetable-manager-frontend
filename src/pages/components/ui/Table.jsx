import {TableSkeleton} from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";

/**
 * Table — reusable data table with loading and empty states.
 *
 * @param {Array}   columns          - [{ key, label, render? }]
 * @param {Array}   data             - Array of row objects
 * @param {boolean} [loading]        - Show skeleton
 * @param {string}  [emptyTitle]     - Empty state title
 * @param {string}  [emptyMessage]   - Empty state message
 * @param {Object}  [pagination]     - { page, totalPages, onNext, onPrev }
 */
const Table = ({
  columns,
  data,
  loading = false,
  emptyTitle = "No data found",
  emptyMessage = "Nothing to show here yet.",
  pagination,
}) => {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {!loading && data?.length > 0 && (
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={row._id || row.id || i}
                  className="border-b border-brand-border last:border-0 hover:bg-[var(--color-hover)] transition-colors duration-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-[var(--color-text)] whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {loading && <TableSkeleton rows={5} cols={columns.length} />}

      {!loading && (!data || data.length === 0) && (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-brand-border">
          <span className="text-xs text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={pagination.onPrev}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-xs rounded-md border border-brand-border text-[var(--color-text)] hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={pagination.onNext}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-xs rounded-md border border-brand-border text-[var(--color-text)] hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
