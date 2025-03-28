
import { MapCoordinates } from '../types';

/**
 * Performs reverse geocoding to convert coordinates to an address
 */
export const reverseGeocode = (
  lat: number, 
  lng: number, 
  callback: (address: string) => void
): void => {
  if (!window.google?.maps) {
    callback(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    return;
  }
  
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
      callback(results[0].formatted_address);
    } else {
      console.error('Error reverse geocoding:', status);
      callback(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  });
};
