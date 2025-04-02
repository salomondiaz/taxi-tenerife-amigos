
/**
 * Geocoding service helper functions
 */

// Reverse geocode: coordinates to address
export const reverseGeocode = (lat: number, lng: number, callback: (address: string | null) => void) => {
  try {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error("Geocoder failed:", status);
        callback(null);
      }
    });
  } catch (error) {
    console.error("Error in reverseGeocode:", error);
    callback(null);
  }
};

// Forward geocode: address to coordinates
export const forwardGeocode = (
  address: string, 
  callback: (coordinates: { lat: number; lng: number; formatted_address: string } | null) => void
) => {
  try {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        callback({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address
        });
      } else {
        console.error("Geocoder failed:", status);
        callback(null);
      }
    });
  } catch (error) {
    console.error("Error in forwardGeocode:", error);
    callback(null);
  }
};
