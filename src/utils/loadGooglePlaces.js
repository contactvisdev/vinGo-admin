let googlePlacesPromise = null;

export function loadGooglePlaces(apiKey) {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (!googlePlacesPromise) {
    googlePlacesPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve(window.google);
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  return googlePlacesPromise;
}
