import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

/**
 * Radio group component.
 * options: [{ value, label, disabled? }]
 */
const RadioGroup = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  required = false,
  id,
  label,
  description,
  options = [],
  inline = false,
  className = '',
  radioClassName = ''
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`RadioGroup: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
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
          <div id={id || name}>
            {options.map((option) => {
              const inputId = `${id || name}-${option.value}`;

              return (
                <div key={option.value} className={`form-check ${inline ? 'form-check-inline' : ''} ${radioClassName}`}>
                  <input
                    className={`form-check-input ${fieldState.error ? 'is-invalid' : ''}`}
                    type="radio"
                    id={inputId}
                    name={name}
                    value={option.value}
                    checked={field.value === option.value}
                    disabled={option.disabled}
                    onChange={() => field.onChange(option.value)}
                  />
                  <label className="form-check-label" htmlFor={inputId}>
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </FormFieldWrapper>
      )}
    />
  );
};

export default RadioGroup;
