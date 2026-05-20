import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

const TextArea = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  required = false,
  id,
  label,
  description,
  rows = 3,
  className = '',
  textareaClassName = '',
  ...textareaProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`TextArea: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
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
          <textarea
            {...field}
            {...textareaProps}
            id={id || name}
            rows={rows}
            className={`form-control ${fieldState.error ? 'is-invalid' : ''} ${textareaClassName}`}
          />
        </FormFieldWrapper>
      )}
    />
  );
};

export default TextArea;
