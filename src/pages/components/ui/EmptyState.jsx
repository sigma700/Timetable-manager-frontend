/**
 * EmptyState — shown when a list or table has no data.
 *
 * @param {string} title      - Primary message
 * @param {string} [message]  - Secondary description
 * @param {string} [icon]     - Emoji icon
 * @param {node}   [action]   - Optional CTA button
 */
const EmptyState = ({title, message, icon = "📭", action}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <span className="text-4xl mb-4">{icon}</span>
    <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
      {title}
    </h3>
    {message && <p className="text-sm text-muted max-w-xs">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
