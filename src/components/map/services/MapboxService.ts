
import { MapCoordinates } from '../types';

// Coordenadas centrales de Tenerife
export const TENERIFE_CENTER = {
  lat: 28.2916,
  lng: -16.6291
};

// Define Tenerife bounding box (approximate)
export const TENERIFE_BOUNDS = {
  minLng: -16.92,
  minLat: 28.00,
  maxLng: -16.10,
  maxLat: 28.59
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
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${apiKey}&limit=1&country=es&proximity=${TENERIFE_CENTER.lng},${TENERIFE_CENTER.lat}&bbox=${TENERIFE_BOUNDS.minLng},${TENERIFE_BOUNDS.minLat},${TENERIFE_BOUNDS.maxLng},${TENERIFE_BOUNDS.maxLat}`
    );
    
    const data = await response.json();
    console.log("Geocoding response:", data);
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;

      // Verificar que las coordenadas están dentro de Tenerife
      if (lng < TENERIFE_BOUNDS.minLng || lng > TENERIFE_BOUNDS.maxLng || 
          lat < TENERIFE_BOUNDS.minLat || lat > TENERIFE_BOUNDS.maxLat) {
        console.warn("Coordinates outside of Tenerife bounds:", lng, lat);
        return null;
      }
      
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
    // Verificar que las coordenadas están dentro de Tenerife
    if (coordinates.lng < TENERIFE_BOUNDS.minLng || coordinates.lng > TENERIFE_BOUNDS.maxLng || 
        coordinates.lat < TENERIFE_BOUNDS.minLat || coordinates.lat > TENERIFE_BOUNDS.maxLat) {
      console.warn("Coordinates outside of Tenerife bounds:", coordinates);
      return "Ubicación fuera de Tenerife";
    }
    
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
