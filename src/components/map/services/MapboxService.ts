
import { MapCoordinates } from '../types';

// Coordenadas centrales de Tenerife
export const TENERIFE_CENTER = {
  lat: 28.2916,
  lng: -16.6291
};

export async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<MapCoordinates | null> {
  try {
    // Asegurar que estamos buscando en Tenerife
    const searchQuery = `${address}, Tenerife, Islas Canarias, España`;
    console.log("Geocoding query:", searchQuery);
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${apiKey}&limit=1&country=es&proximity=${TENERIFE_CENTER.lng},${TENERIFE_CENTER.lat}&bbox=-16.9,28.0,-16.1,28.6`
    );
    
    const data = await response.json();
    console.log("Geocoding response:", data);
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { 
        lng, 
        lat, 
        address: data.features[0].place_name 
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

export async function reverseGeocode(
  coordinates: {lat: number, lng: number},
  apiKey: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?access_token=${apiKey}&limit=1&country=es&proximity=${TENERIFE_CENTER.lng},${TENERIFE_CENTER.lat}&language=es`
    );
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

export async function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
  });
}
