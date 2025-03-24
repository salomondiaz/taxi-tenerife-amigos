
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { fitMapToBounds } from '../services/MapRoutingService';

interface UseMapViewProps {
  map: mapboxgl.Map | null;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
}

export function useMapView({
  map,
  origin,
  destination
}: UseMapViewProps) {
  useEffect(() => {
    if (!map) return;
    
    // Ensure the map is loaded before trying to manipulate the view
    const updateView = () => {
      if (origin && destination) {
        fitMapToBounds(map, origin, destination);
      } else if (origin) {
        map.flyTo({
          center: [origin.lng, origin.lat],
          zoom: 14
        });
      } else if (destination) {
        map.flyTo({
          center: [destination.lng, destination.lat],
          zoom: 14
        });
      }
    };
    
    if (map.loaded()) {
      updateView();
    } else {
      map.once('load', updateView);
    }
    
    return () => {
      map.off('load', updateView);
    };
  }, [map, origin, destination]);
}
