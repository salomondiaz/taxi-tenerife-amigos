
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

    // Draw route between points
    drawRoute(map, origin, destination);
    
    // Fit map to show both points
    fitMapToBounds(map, origin, destination);
    
    return () => {
      // Clean up route when component unmounts
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }
    };
  }, [map, origin, destination]);
}
