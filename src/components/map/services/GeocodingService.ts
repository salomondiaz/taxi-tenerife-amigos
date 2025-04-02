
import { MapCoordinates } from '../types';

// Función para convertir coordenadas a dirección usando Google Maps Geocoder
export function reverseGeocode(
  lat: number,
  lng: number,
  callback: (address: string | null) => void
) {
  try {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          callback(results[0].formatted_address);
        } else {
          console.error("Error geocodificando posición:", status);
          callback(null);
        }
      }
    );
  } catch (error) {
    console.error("Error en reverseGeocode:", error);
    callback(null);
  }
}

// Función para convertir una dirección a coordenadas (geocodificación directa)
export function geocodeAddress(
  address: string,
  callback: (coordinates: MapCoordinates | null) => void
) {
  try {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { address: address + ", Tenerife, España" }, // Añadir "Tenerife" para mejorar la precisión
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          callback({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          });
        } else {
          console.error("Error geocodificando dirección:", status);
          callback(null);
        }
      }
    );
  } catch (error) {
    console.error("Error en geocodeAddress:", error);
    callback(null);
  }
}
