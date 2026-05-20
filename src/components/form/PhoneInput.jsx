import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import FormFieldWrapper from './FormFieldWrapper';

const PhoneInput = ({
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
  country = 'IN',
  disabled = false,
  inputStyle,
  ...props
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`PhoneInput: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
    return null;
  }

  return (
    <Controller
      name={name}
      control={effectiveControl}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;

        const rawValue = field.value ?? '';
        const phoneValue = rawValue.startsWith('+') ? rawValue.slice(1) : rawValue;

        const computedInputStyle = {
          width: '100%',
          borderColor: errorMessage ? '#dc3545' : '#ced4da',
          borderRadius: '0.375rem',
          minHeight: '38px',
          ...inputStyle
        };

        return (
          <FormFieldWrapper
            id={id || name}
            label={label}
            required={isRequired}
            description={description}
            error={errorMessage}
            className={className}
          >
            <PhoneInputLib
              country={country.toLowerCase()}
              value={phoneValue}
              disabled={disabled}
              inputProps={{ id: id || name }}
              containerClass="w-100"
              inputClass={`form-control ${errorMessage ? 'is-invalid' : ''} ${inputClassName}`}
              inputStyle={computedInputStyle}
              dropdownClass="z-50"
              onChange={(val) => {
                field.onChange(val ? `+${val}` : '');
              }}
              {...props}
            />
          </FormFieldWrapper>
        );
      }}
    />
  );
};

export default PhoneInput;
