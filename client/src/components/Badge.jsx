import React from 'react';

/**
 * Reusable Badge / Status indicator.
 * Variants: 'default' | 'info' | 'success' | 'warning' | 'danger'
 */
export function Badge({
  children,
  variant = 'default',
  withDot = true,
  icon: Icon = null,
  className = '',
  ...props
}) {
  const variantClass = `badge-${variant}`;

  return (
    <span
      className={`badge ${variantClass} ${className}`.trim()}
      {...props}
    >
      {withDot && <span className="badge-dot" aria-hidden="true" />}
      {Icon && <Icon size={12} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
