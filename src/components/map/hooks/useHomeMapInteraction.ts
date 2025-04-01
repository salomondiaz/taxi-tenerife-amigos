
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { zoomToHomeLocation } from '../services/MapRoutingService';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for handling home location map interactions
 */
export function useHomeMapInteraction(
  map: mapboxgl.Map | null, 
  homeLocation: MapCoordinates | null,
  onOriginChange?: (coordinates: MapCoordinates) => void
) {
  /**
   * Use home location as origin
   */
  const useHomeAsOrigin = useCallback(() => {
    if (!homeLocation || !onOriginChange || !map) {
      console.error("No home location saved or no origin change handler");
      return;
    }
    
    // Ensure the origin marker updates correctly
    console.log("Setting home as origin:", homeLocation);
    onOriginChange(homeLocation);
    
    // Zoom to home location
    zoomToHomeLocation(map, homeLocation);
    
    toast({
      title: "Casa como origen",
      description: "Tu casa ha sido establecida como punto de origen",
    });
  }, [map, homeLocation, onOriginChange]);

  /**
   * Check if a location is the home location
   */
  const isHomeLocation = useCallback((location?: MapCoordinates): boolean => {
    if (!location || !homeLocation) return false;
    
    return Math.abs(location.lat - homeLocation.lat) < 0.0001 && 
           Math.abs(location.lng - homeLocation.lng) < 0.0001;
  }, [homeLocation]);

  return {
    useHomeAsOrigin,
    isHomeLocation
  };
}
