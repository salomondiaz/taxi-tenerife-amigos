
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { TENERIFE_BOUNDS, TENERIFE_CENTER } from './MapboxService';
import { saveLastMapPosition } from './MapPositionService';

// Helper function to check if coordinates are within Tenerife
export function isWithinTenerifeBounds(coords: MapCoordinates): boolean {
  return (
    coords.lng >= TENERIFE_BOUNDS.minLng && 
    coords.lng <= TENERIFE_BOUNDS.maxLng && 
    coords.lat >= TENERIFE_BOUNDS.minLat && 
    coords.lat <= TENERIFE_BOUNDS.maxLat
  );
}

// Helper function to check if a point is near Tenerife
export function isPointNearTenerife(lng: number, lat: number): boolean {
  const maxDistance = 0.5; // Closer constraint
  return (
    Math.abs(lng - TENERIFE_CENTER.lng) <= maxDistance && 
    Math.abs(lat - TENERIFE_CENTER.lat) <= maxDistance
  );
}

export const fitMapToBounds = (
  map: mapboxgl.Map,
  origin: MapCoordinates,
  destination: MapCoordinates
): void => {
  if (!map || !map.loaded()) return;
  
  try {
    console.log("Fitting map to bounds");
    
    // Verify coordinates are within Tenerife
    if (!isWithinTenerifeBounds(origin) || !isWithinTenerifeBounds(destination)) {
      console.error("Cannot fit to bounds: coordinates outside Tenerife");
      resetMapToTenerife(map);
      return;
    }
    
    // Create bounds from the route points
    const bounds = new mapboxgl.LngLatBounds()
      .extend([origin.lng, origin.lat])
      .extend([destination.lng, destination.lat]);
      
    // Add padding to ensure markers are visible
    const padding = {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    };
    
    // Only if the bounds are valid and within Tenerife's general area
    map.fitBounds(bounds, {
      padding: padding,
      maxZoom: 14,
      duration: 1000 // Animación más suave
    });
    
    // Save the last view position to localStorage
    saveLastMapPosition(map);
  } catch (error) {
    console.error("Error fitting map to bounds:", error);
  }
};

// Function to ensure map always centers on Tenerife if it drifts too far
export const resetMapToTenerife = (map: mapboxgl.Map): void => {
  if (!map || !map.loaded()) return;
  
  try {
    const center = map.getCenter();
    
    // If map drifts too far from Tenerife, reset it
    if (!isPointNearTenerife(center.lng, center.lat)) {
      console.log("Map drifted away from Tenerife, resetting...");
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 10,
        essential: true
      });
      
      // Save the reset position
      saveLastMapPosition(map);
    }
  } catch (error) {
    console.error("Error resetting map:", error);
  }
};
