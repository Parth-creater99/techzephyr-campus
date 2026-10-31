import React from 'react';

/**
 * Reusable Button component for CIT Smart Scheduling Platform.
 * Supports primary, secondary, outline, ghost, and danger variants.
 */
export const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon = null,
    rightIcon: RightIcon = null,
    disabled = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <span
          className="loading-spinner-circle loading-spinner-sm"
          role="status"
          aria-label="Loading"
        />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} aria-hidden="true" />
      ) : null}

      <span>{children}</span>

      {!isLoading && RightIcon && (
        <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} aria-hidden="true" />
      )}
    </button>
  );
});

export default Button;
