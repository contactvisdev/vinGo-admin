export const buildCompleteAddress = (baseAddress = '', plotNo = '', floor = '', buildingName = '') => {
  const parts = [plotNo, floor, buildingName].filter(Boolean);
  if (!parts.length) return baseAddress;
  return `${parts.join(', ')}, ${baseAddress}`;
};

export const extractBaseGoogleAddress = (completeAddress = '', plotNo = '', floor = '', buildingName = '') => {
  const parts = [plotNo, floor, buildingName].filter(Boolean);
  if (!parts.length) return completeAddress;

  const prefix = parts.join(', ') + ', ';
  return completeAddress.startsWith(prefix) ? completeAddress.slice(prefix.length) : completeAddress;
};

export const parseGooglePlaceData = (place) => {
  if (!place || !place.address_components) {
    return {
      complete_address: place?.formatted_address || '',
      pincode: '',
      plot_no: '',
      floor: '',
      building_name: '',
      landmark: '',
      base_address: place?.formatted_address || ''
    };
  }

  const addressComponents = place.address_components;

  let pincode = '';
  let landmark = '';
  let streetNumber = '';
  let route = '';
  let sublocality = '';
  let premise = '';
  let subpremise = '';

  addressComponents.forEach((component) => {
    const types = component.types;

    if (types.includes('postal_code')) {
      pincode = component.long_name;
    }

    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    }

    if (types.includes('route')) {
      route = component.long_name;
    }

    if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
      sublocality = component.long_name;
    }

    if (types.includes('premise')) {
      premise = component.long_name;
    }

    if (types.includes('subpremise')) {
      subpremise = component.long_name;
    }

    if (types.includes('locality') && !landmark) {
      landmark = component.long_name;
    } else if (types.includes('administrative_area_level_2') && !landmark) {
      landmark = component.long_name;
    } else if (types.includes('administrative_area_level_3') && !landmark) {
      landmark = component.long_name;
    }
  });

  const baseComponents = addressComponents
    .filter((comp) => {
      const t = comp.types;
      return !t.includes('street_number') && !t.includes('subpremise') && !t.includes('premise');
    })
    .map((comp) => comp.long_name);

  const baseAddress = baseComponents.length > 0 ? baseComponents.join(', ') : place.formatted_address;

  return {
    complete_address: place.formatted_address || '',
    pincode,
    plot_no: streetNumber || '',
    floor: subpremise || '',

    building_name: premise || '',

    landmark,
    base_address: baseAddress
  };
};

export const autoFillAddressFields = (data, setValue) => {
  if (!data || !data.place) {
    console.warn('No place data available for auto-fill');
    return;
  }

  try {
    const parsedData = parseGooglePlaceData(data.place);

    // Set the search field value to the CLEAN base address (without plot/floor/building)
    setValue('business.address', parsedData.base_address || '');

    if (data.lat != null && data.lng != null) {
      setValue('business.location.coordinates.latitude', data.lat);
      setValue('business.location.coordinates.longitude', data.lng);
    }

    setValue('business.location.complete_address', parsedData.complete_address);
    setValue('business.location.pincode', parsedData.pincode);

    // Always set these fields from Google if available
    setValue('business.location.plot_no', parsedData.plot_no);
    setValue('business.location.floor', parsedData.floor);
    setValue('business.location.building_name', parsedData.building_name);

    if (parsedData.landmark) {
      setValue('business.location.landmark', parsedData.landmark);
    }

    if (!parsedData.pincode && data.lat != null && data.lng != null && window.google?.maps) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: { lat: data.lat, lng: data.lng } }, (results, status) => {
        if (status === 'OK' && results?.length) {
          for (const result of results) {
            const postalComponent = result.address_components?.find((c) => c.types.includes('postal_code'));
            if (postalComponent) {
              setValue('business.location.pincode', postalComponent.long_name);
              break;
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Error auto-filling address fields:', error);
  }
};

export const reverseGeocodeAndFill = (lat, lng, setValue) => {
  if (!window.google?.maps) return;

  setValue('business.location.coordinates.latitude', lat);
  setValue('business.location.coordinates.longitude', lng);

  const geocoder = new window.google.maps.Geocoder();

  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === 'OK' && results?.[0]) {
      const place = results[0];
      const parsedData = parseGooglePlaceData(place);

      // Set the search field value to the CLEAN base address (without plot/floor/building)
      setValue('business.address', parsedData.base_address || '');
      setValue('business.location.complete_address', parsedData.complete_address);

      setValue('business.location.pincode', parsedData.pincode || '');
      setValue('business.location.plot_no', parsedData.plot_no || '');
      setValue('business.location.floor', parsedData.floor || '');
      setValue('business.location.building_name', parsedData.building_name || '');

      if (parsedData.landmark) {
        setValue('business.location.landmark', parsedData.landmark);
      }
    }
  });
};
