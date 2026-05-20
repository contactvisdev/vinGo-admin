import React, { forwardRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const capitalizeCamelCase = (str = '') => str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

export const CustomPhoneInput = forwardRef(
  (
    {
      label,
      name,
      data = {},
      value,
      onChange,
      errorMessage,
      extraClassName = '',
      required = false,
      inputClass = '',
      disabled = false,
      readOnly = false,
      placeholder = '',
      ignoreLabel = false,
      ignoreError = false,
      country = 'IN',
      ...props
    },
    ref
  ) => {
    const isLocked = disabled || readOnly;

    const finalValue = value ?? data?.[name] ?? '';

    // Remove "+" ONLY for PhoneInput
    const phoneValue = finalValue.startsWith('+') ? finalValue.slice(1) : finalValue;

    return (
      <div className={extraClassName}>
        {!ignoreLabel && (
          <label className="block mb-1 text-[12px] lg:text-[14px] 2xl:text-[16px] text-black">
            {label || capitalizeCamelCase(name)}
            {required && <span style={{ color: '#E8227A' }}> *</span>}
          </label>
        )}

        <PhoneInput
          ref={ref}
          country={country.toLowerCase()}
          enableSearch={!isLocked}
          disabled={isLocked}
          countryCodeEditable={false}
          value={phoneValue}
          onChange={(val) => {
            if (isLocked || !onChange) return;
            onChange({
              name,
              value: `+${val}`
            });
          }}
          placeholder={placeholder || `Enter ${capitalizeCamelCase(name)}`}
          containerClass="w-full"
          inputClass={`w-full h-[40px] border ${errorMessage || props?.error ? 'border-[#E8227A]' : 'border-gray-300'} rounded-md px-3 text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputClass}`}
          dropdownClass="z-50"
          {...props}
        />

        {!ignoreError && (
          <small className="block min-h-[20px] text-[8px] lg:text-[10px] 2xl:text-[12px] text-[#E8227A]">
            {errorMessage || <span className="opacity-0">.</span>}
          </small>
        )}
      </div>
    );
  }
);

CustomPhoneInput.displayName = 'CustomPhoneInput';
