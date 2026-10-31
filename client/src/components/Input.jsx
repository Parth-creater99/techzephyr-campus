import React, { useId } from 'react';

/**
 * Reusable Form Input with label, icon slot, helper text, and error states.
 */
export const Input = React.forwardRef(function Input(
  {
    label,
    id,
    helperText,
    error,
    icon: Icon = null,
    required = false,
    disabled = false,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`form-field ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>
            {label}
            {required && <span className="form-required" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="input-container">
        {Icon && (
          <div className="input-icon-slot">
            <Icon size={16} aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`form-input ${Icon ? 'input-has-icon' : ''} ${
            error ? 'form-input-error' : ''
          } ${className}`.trim()}
          {...props}
        />
      </div>

      {error ? (
        <span id={errorId} className="form-error-text" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="form-helper-text">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
