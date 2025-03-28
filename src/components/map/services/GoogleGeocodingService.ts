
/**
 * Service for handling Google Maps geocoding operations
 */
import { MapCoordinates } from '../types';

export const reverseGeocode = async (
  coordinates: { lat: number, lng: number },
  callback: (address: string | null) => void
): Promise<void> => {
  try {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coordinates }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error('Error reverse geocoding:', status);
        callback(null);
      }
    });
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    callback(null);
  }
};

export const getAddressFromCoordinates = (
  lat: number,
  lng: number,
  onComplete: (coordinates: MapCoordinates) => void
): void => {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
      address = results[0].formatted_address;
    } else {
      console.error('Error reverse geocoding:', status);
    }
    
    onComplete({
      lat,
      lng,
      address
    });
  });
};
