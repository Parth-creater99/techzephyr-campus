import React from 'react';

/**
 * LoadingIndicator provides spinner variants and skeleton placeholders for data-dense layouts.
 */
export function LoadingSpinner({
  size = 'md',
  className = '',
  ariaLabel = 'Loading content...',
}) {
  const sizeMap = {
    sm: 'loading-spinner-sm',
    md: 'loading-spinner-md',
    lg: 'loading-spinner-lg',
  };

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`loading-spinner ${className}`.trim()}
    >
      <span className={`loading-spinner-circle ${sizeMap[size] || sizeMap.md}`} />
    </div>
  );
}

export function LoadingOverlay({
  message = 'Loading operational data...',
  size = 'lg',
}) {
  return (
    <div className="loading-overlay" role="status">
      <LoadingSpinner size={size} ariaLabel={message} />
      <span>{message}</span>
    </div>
  );
}

export function Skeleton({
  width = '100%',
  height = '18px',
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`skeleton-box ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export default LoadingSpinner;
