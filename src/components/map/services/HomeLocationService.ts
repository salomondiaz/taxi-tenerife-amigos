
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { TENERIFE_CENTER } from './MapboxService';
import { isWithinTenerifeBounds } from './MapBoundsService';
import { saveLastMapPosition } from './MapPositionService';
import { toast } from '@/hooks/use-toast';

/**
 * Zoom the map to the home location
 */
export const zoomToHomeLocation = (
  map: mapboxgl.Map,
  homeLocation: MapCoordinates
): void => {
  if (!map || !map.loaded()) return;
  
  try {
    // Verify home location is within Tenerife
    if (!isWithinTenerifeBounds(homeLocation)) {
      console.warn("Home location outside Tenerife, using center instead");
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 12,
        essential: true
      });
      
      toast({
        title: "Ubicación fuera de Tenerife",
        description: "La casa está fuera de los límites de Tenerife",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Zooming to home location:", homeLocation);
    
    map.flyTo({
      center: [homeLocation.lng, homeLocation.lat],
      zoom: 16, // Closer zoom for home location
      essential: true,
      duration: 1500 // Transición más suave
    });
    
    // Save the home view position
    saveLastMapPosition(map);
  } catch (error) {
    console.error("Error zooming to home location:", error);
    toast({
      title: "Error",
      description: "No se pudo acercar a la ubicación de la casa",
      variant: "destructive"
    });
  }
};

/**
 * Check if a location is near another location
 */
export const isLocationNearby = (
  location1: MapCoordinates, 
  location2: MapCoordinates,
  toleranceInMeters: number = 100
): boolean => {
  // Convert tolerance from meters to approximate degrees
  // This is a rough estimation, 1 degree is approximately 111,000 meters
  const toleranceInDegrees = toleranceInMeters / 111000;
  
  return Math.abs(location1.lat - location2.lat) < toleranceInDegrees &&
         Math.abs(location1.lng - location2.lng) < toleranceInDegrees;
};
