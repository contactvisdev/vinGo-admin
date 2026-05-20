import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import FormFieldWrapper from './FormFieldWrapper';

const MultiSelectInput = ({
  name,
  control,
  rules = {},
  defaultValue = [],
  id,
  label,
  description,
  required = false,
  className = '',
  selectClassName = '',
  styles,
  ...selectProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`MultiSelectInput: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
    return null;
  }

  const mergedStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.selectProps['data-error'] ? '#dc3545' : state.isFocused ? '#86b7fe' : base.borderColor,
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13,110,253,.25)' : 'none',
      '&:hover': {
        borderColor: state.selectProps['data-error'] ? '#dc3545' : '#86b7fe'
      },
      minHeight: '38px'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    }),
    ...styles
  };

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
          <div className={selectClassName}>
            <Select
              {...field}
              {...selectProps}
              inputId={id || name}
              isMulti
              classNamePrefix="react-select"
              styles={mergedStyles}
              data-error={!!fieldState.error}
              value={field.value || []}
              onChange={(value) => field.onChange(value)}
            />
          </div>
        </FormFieldWrapper>
      )}
    />
  );
};

export default MultiSelectInput;
