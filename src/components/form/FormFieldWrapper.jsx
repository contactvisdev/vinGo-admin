import React from 'react';

const FormFieldWrapper = ({
  id,
  label,
  required,
  description,
  error,
  children,
  className = '',
  labelClassName = '',
  descriptionClassName = '',
  errorClassName = ''
}) => {
  const describedByIds = [];

  if (description) describedByIds.push(`${id}-description`);
  if (error) describedByIds.push(`${id}-error`);

  const childWithA11y = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: children.props.id ?? id,
        'aria-invalid': error != null ? true : children.props['aria-invalid'],
        'aria-describedby': [children.props['aria-describedby'], describedByIds.join(' ')].filter(Boolean).join(' ') || undefined
      })
    : children;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className={`form-label fw-semibold ${labelClassName}`}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {childWithA11y}

      {description && (
        <div id={`${id}-description`} className={`form-text ${descriptionClassName}`}>
          {description}
        </div>
      )}

      {error && (
        <div id={`${id}-error`} className={`invalid-feedback d-block ${errorClassName}`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormFieldWrapper;
