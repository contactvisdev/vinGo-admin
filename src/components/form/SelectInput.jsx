import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

const SelectInput = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  required = false,
  id,
  label,
  description,
  options = [],
  className = '',
  selectClassName = '',
  placeholder,
  loading = false,
  ...selectProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`SelectInput: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
    return null;
  }

  return (
    <Controller
      name={name}
      control={effectiveControl}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormFieldWrapper
          id={id || name}
          label={label}
          required={isRequired}
          description={description}
          error={fieldState.error?.message}
          className={className}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              {...field}
              {...selectProps}
              id={id || name}
              className={`form-select ${fieldState.error ? 'is-invalid' : ''} ${selectClassName}`}
              value={field.value || ''}
              style={loading ? { paddingRight: '3.5rem' } : undefined}
            >
              {placeholder && <option value="">{placeholder}</option>}

              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
            {loading && (
              <span
                className="spinner-border spinner-border-sm text-secondary"
                role="status"
                style={{
                  position: 'absolute',
                  right: '2.25rem',
                  width: '1rem',
                  height: '1rem',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </FormFieldWrapper>
      )}
    />
  );
};

export default SelectInput;
