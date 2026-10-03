import React from 'react';

export const Input = ({
  label,
  required,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-control ${className}`}
        {...props}
      />
      {error && <span style={{ color: 'var(--status-red-text)', fontSize: 12 }}>{error}</span>}
      {helperText && !error && <span className="metadata-text">{helperText}</span>}
    </div>
  );
};

export const Select = ({
  label,
  required,
  error,
  options = [],
  id,
  className = '',
  children,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && <span style={{ color: 'var(--status-red-text)', fontSize: 12 }}>{error}</span>}
    </div>
  );
};

export const Textarea = ({
  label,
  required,
  error,
  helperText,
  id,
  className = '',
  rows = 4,
  ...props
}) => {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={areaId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        className={`form-textarea ${className}`}
        {...props}
      />
      {error && <span style={{ color: 'var(--status-red-text)', fontSize: 12 }}>{error}</span>}
      {helperText && !error && <span className="metadata-text">{helperText}</span>}
    </div>
  );
};
