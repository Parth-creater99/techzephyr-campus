import React, { useId } from 'react';

/**
 * Reusable Select dropdown with label, options list, helper text, and error states.
 */
export const Select = React.forwardRef(function Select(
  {
    label,
    id,
    options = [],
    helperText,
    error,
    placeholder = 'Select an option...',
    required = false,
    disabled = false,
    className = '',
    containerClassName = '',
    children,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  return (
    <div className={`form-field ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>
            {label}
            {required && <span className="form-required" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="input-container">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`form-select ${error ? 'form-input-error' : ''} ${className}`.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
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

export default Select;
