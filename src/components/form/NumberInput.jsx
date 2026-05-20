import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

const NumberInput = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  required = false,
  id,
  label,
  description,
  className = '',
  inputClassName = '',
  ...inputProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`NumberInput: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
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
          <input
            {...field}
            {...inputProps}
            id={id || name}
            type="number"
            className={`form-control ${fieldState.error ? 'is-invalid' : ''} ${inputClassName}`}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : Number(e.target.value);
              field.onChange(value);
            }}
          />
        </FormFieldWrapper>
      )}
    />
  );
};

export default NumberInput;
