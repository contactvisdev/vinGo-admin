import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGooglePlaces } from '../../utils/loadGooglePlaces';

const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India center
const DEFAULT_ZOOM = 5;
const SELECTED_ZOOM = 16;

const LocationPickerMap = ({ latitude, longitude, onLocationChange, height = '350px', disabled = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');

  const hasCoordinates = latitude != null && longitude != null && latitude !== '' && longitude !== '';

  const handleMapClick = useCallback(
    (e) => {
      if (disabled) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onLocationChange?.(lat, lng);
    },
    [disabled, onLocationChange]
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !GOOGLE_API_KEY) return;

    loadGooglePlaces(GOOGLE_API_KEY)
      .then((google) => {
        const center = hasCoordinates ? { lat: Number(latitude), lng: Number(longitude) } : DEFAULT_CENTER;

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: hasCoordinates ? SELECTED_ZOOM : DEFAULT_ZOOM,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        });

        if (hasCoordinates) {
          markerRef.current = new google.maps.Marker({
            position: center,
            map: mapInstanceRef.current,
            draggable: !disabled,
            animation: google.maps.Animation.DROP
          });

          if (!disabled) {
            markerRef.current.addListener('dragend', (e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              onLocationChange?.(lat, lng);
            });
          }
        }

        if (!disabled) {
          mapInstanceRef.current.addListener('click', handleMapClick);
        }

        setMapLoaded(true);
      })
      .catch(() => {
        setError('Failed to load Google Maps');
      });

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const google = window.google;
    if (!google) return;

    if (hasCoordinates) {
      const position = { lat: Number(latitude), lng: Number(longitude) };

      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          draggable: !disabled,
          animation: google.maps.Animation.DROP
        });

        if (!disabled) {
          markerRef.current.addListener('dragend', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onLocationChange?.(lat, lng);
          });
        }
      }

      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(SELECTED_ZOOM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, mapLoaded, disabled]);

  if (error) {
    return (
      <div className="alert alert-warning mb-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height,
          borderRadius: '0.375rem',
          border: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa'
        }}
      />
      {hasCoordinates && (
        <div className="d-flex gap-3 mt-2">
          <small className="text-muted">
            Lat: <strong>{Number(latitude).toFixed(6)}</strong>
          </small>
          <small className="text-muted">
            Lng: <strong>{Number(longitude).toFixed(6)}</strong>
          </small>
        </div>
      )}
      {!hasCoordinates && mapLoaded && (
        <small className="text-muted mt-1 d-block">Search an address above or click on the map to select a location</small>
      )}
    </div>
  );
};

export default LocationPickerMap;
