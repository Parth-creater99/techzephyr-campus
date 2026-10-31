import React from 'react';

/**
 * Standardized PageHeading primitive for all dashboard screens.
 * Contains title, optional badge, description, and action button slots.
 */
export function PageHeading({
  title,
  subtitle,
  badge = null,
  actions = null,
  className = '',
}) {
  return (
    <div className={`page-heading ${className}`.trim()}>
      <div className="page-heading-content">
        <div className="page-heading-header">
          <h1 className="page-heading-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="page-heading-subtitle">{subtitle}</p>}
      </div>

      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}

export default PageHeading;
