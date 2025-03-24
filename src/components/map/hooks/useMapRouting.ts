
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { drawRoute, fitMapToBounds } from '../services/MapRoutingService';

export function useMapRouting(
  map: mapboxgl.Map | null,
  origin?: MapCoordinates,
  destination?: MapCoordinates
) {
  useEffect(() => {
    if (!map || !origin || !destination) return;

    // Ensure map is loaded before drawing routes
    const handleRouting = () => {
      try {
        // Draw route between points
        drawRoute(map, origin, destination);
        
        // Fit map to show both points
        fitMapToBounds(map, origin, destination);
      } catch (error) {
        console.error("Error in map routing:", error);
      }
    };
    
    if (map.loaded()) {
      handleRouting();
    } else {
      // Wait for map to load before drawing route
      map.once('load', handleRouting);
    }
    
    return () => {
      // Clean up route and event listener when component unmounts
      if (map.loaded() && map.getStyle() && map.getSource('route')) {
        try {
          map.removeLayer('route');
          map.removeSource('route');
        } catch (error) {
          console.error("Error cleaning up route:", error);
        }
      }
      
      // Remove load event listener
      map.off('load', handleRouting);
    };
  }, [map, origin, destination]);
}
