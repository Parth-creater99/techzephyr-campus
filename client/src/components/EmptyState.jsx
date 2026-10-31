import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState primitive for tables, lists, and search queries with no results.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching the current operational criteria.',
  action = null,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state-icon">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
