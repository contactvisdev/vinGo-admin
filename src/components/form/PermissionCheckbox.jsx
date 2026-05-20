import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

const PermissionCheckbox = ({
  name,
  value,
  labelText,
  control,
  rules = {},
  defaultValue = {},
  wrapperLabel = '',
  description,
  className = '',

  // 👇 NEW (for view-only usage)
  checked,
  disabled = false
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;

  /* ================= VIEW MODE ================= */
  if (!effectiveControl) {
    return (
      <div className={`form-check ${className}`}>
        <input type="checkbox" className="form-check-input" checked={!!checked} disabled readOnly />
        <label className="form-check-label">{labelText}</label>
      </div>
    );
  }

  /* ================= FORM MODE ================= */

  if (!name || typeof name !== 'string') {
    console.error('PermissionCheckbox: `name` must be a non-empty string', name);
    return null;
  }

  if (!value) {
    console.error('PermissionCheckbox: `value` is required', value);
    return null;
  }

  const id = `${name}-${value}`;

  return (
    <Controller
      name={name}
      control={effectiveControl}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => {
        const currentValue = typeof field.value === 'object' && field.value !== null ? field.value : {};

        const isChecked = currentValue[value] === true;

        return (
          <FormFieldWrapper id={id} label={wrapperLabel} description={description} error={fieldState.error?.message} className={className}>
            <div className="form-check">
              <input
                type="checkbox"
                id={id}
                className={`form-check-input ${fieldState.error ? 'is-invalid' : ''}`}
                checked={isChecked}
                onChange={(e) => {
                  field.onChange({
                    ...currentValue,
                    [value]: e.target.checked
                  });
                }}
              />
              <label htmlFor={id} className="form-check-label">
                {labelText}
              </label>
            </div>
          </FormFieldWrapper>
        );
      }}
    />
  );
};

export default PermissionCheckbox;
