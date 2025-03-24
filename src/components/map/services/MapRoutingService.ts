
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

// Tenerife coordinates for centering the map
export const TENERIFE_CENTER = {
  lat: 28.2916,
  lng: -16.6291
};

export const drawRoute = (
  map: mapboxgl.Map, 
  origin: MapCoordinates, 
  destination: MapCoordinates
): void => {
  if (!map || !map.loaded()) {
    console.log("Map not fully loaded yet, skipping route drawing");
    return;
  }
  
  try {
    console.log("Drawing route from", origin, "to", destination);
    
    // Check if map source exists and remove it safely
    if (map.getStyle() && map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }
    
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [origin.lng, origin.lat],
            [destination.lng, destination.lat]
          ]
        }
      }
    });
    
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1E88E5',
        'line-width': 4,
        'line-opacity': 0.7
      }
    });
    
    console.log("Route drawn successfully");
  } catch (error) {
    console.error("Error drawing route:", error);
  }
};

export const fitMapToBounds = (
  map: mapboxgl.Map,
  origin: MapCoordinates,
  destination: MapCoordinates
): void => {
  if (!map || !map.loaded()) return;
  
  try {
    console.log("Fitting map to bounds");
    
    // Create bounds from the route points
    const bounds = new mapboxgl.LngLatBounds()
      .extend([origin.lng, origin.lat])
      .extend([destination.lng, destination.lat]);
      
    // Only if the bounds are valid and within Tenerife's general area
    map.fitBounds(bounds, {
      padding: 60,
      maxZoom: 14
    });
  } catch (error) {
    console.error("Error fitting map to bounds:", error);
  }
};

// Function to ensure map always centers on Tenerife if it drifts too far
export const resetMapToTenerife = (map: mapboxgl.Map): void => {
  if (!map || !map.loaded()) return;
  
  try {
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;
    
    // If map drifts too far from Tenerife, reset it
    const maxDistance = 2; // Degrees
    if (Math.abs(lat - TENERIFE_CENTER.lat) > maxDistance || 
        Math.abs(lng - TENERIFE_CENTER.lng) > maxDistance) {
      console.log("Map drifted away from Tenerife, resetting...");
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 10,
        essential: true
      });
    }
  } catch (error) {
    console.error("Error resetting map:", error);
  }
};
