import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';

const RichTextInput = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  required = false,
  id,
  label,
  description,
  className = '',
  editorClassName = '',
  placeholder = '',
  ...editorProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const isRequired = !!rules?.required || required;

  if (!effectiveControl) {
    console.error(`RichTextInput: 'control' is required but was not provided, and no FormProvider was found for field: ${name}`);
    return null;
  }

  return (
    <Controller
      name={name}
      control={effectiveControl}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
        <FormFieldWrapper
          id={id || name}
          label={label}
          required={isRequired}
          description={description}
          error={fieldState.error?.message}
          className={className}
        >
          <div className={fieldState.error ? 'is-invalid border border-danger rounded' : ''}>
            <ReactQuill
              theme="snow"
              ref={ref}
              value={value || ''}
              onChange={(content, delta, source, editor) => {
                const text = editor.getText().trim();
                onChange(text ? content : '');
              }}
              onBlur={(previousSelection, source, editor) => onBlur()}
              placeholder={placeholder}
              className={`${editorClassName}`}
              {...editorProps}
            />
          </div>
        </FormFieldWrapper>
      )}
    />
  );
};

export default RichTextInput;
