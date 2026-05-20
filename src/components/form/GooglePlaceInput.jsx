import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormFieldWrapper from './FormFieldWrapper';
import { loadGooglePlaces } from '../../utils/loadGooglePlaces';

const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

const GooglePlaceInput = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  id,
  label,
  placeholder = 'Enter location',
  disabled = false,
  description,
  className = '',
  inputClassName = '',
  onPlaceSelect,
  ...inputProps
}) => {
  const methods = useFormContext();
  const effectiveControl = control || methods?.control;
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const isRequired = !!rules?.required;

  const onPlaceSelectRef = useRef(onPlaceSelect);
  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    if (!inputRef.current || !GOOGLE_API_KEY) return;

    let destroyed = false;

    loadGooglePlaces(GOOGLE_API_KEY)
      .then((google) => {
        if (destroyed) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['establishment', 'geocode'],
          fields: ['formatted_address', 'geometry', 'address_components']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && onPlaceSelectRef.current) {
            onPlaceSelectRef.current({
              address: place.formatted_address,
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
              place
            });
          }
        });
      })
      .catch((err) => {
        console.error('Failed to load Google Places:', err);
      });

    return () => {
      destroyed = true;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      autocompleteRef.current = null;
    };
  }, []);

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
            ref={(el) => {
              inputRef.current = el;
              field.ref(el);
            }}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className={`form-control ${fieldState.error ? 'is-invalid' : ''} ${inputClassName}`}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormFieldWrapper>
      )}
    />
  );
};

export default GooglePlaceInput;
