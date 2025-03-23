
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from './types';

interface UseDriverSimulationProps {
  testMode: boolean;
  showDriverPosition: boolean;
  map: mapboxgl.Map | null;
  driverMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  driverPosition?: {
    lat: number;
    lng: number;
  };
}

export const useDriverSimulation = ({
  testMode,
  showDriverPosition,
  map,
  driverMarker,
  origin,
  destination,
  driverPosition
}: UseDriverSimulationProps): void => {
  useEffect(() => {
    if (testMode && showDriverPosition && map && driverMarker.current && origin && destination) {
      let step = 0;
      const totalSteps = 100;
      let startLat = origin.lat;
      let startLng = origin.lng;
      let endLat = destination.lat;
      let endLng = destination.lng;
      
      if (driverPosition) {
        startLat = driverPosition.lat;
        startLng = driverPosition.lng;
      }
      
      const latStep = (endLat - startLat) / totalSteps;
      const lngStep = (endLng - startLng) / totalSteps;
      
      const interval = setInterval(() => {
        step++;
        
        if (step >= totalSteps) {
          clearInterval(interval);
          return;
        }
        
        const nextLat = startLat + latStep * step;
        const nextLng = startLng + lngStep * step;
        
        if (driverMarker.current) {
          driverMarker.current.setLngLat([nextLng, nextLat]);
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [testMode, showDriverPosition, driverPosition, origin, destination, map, driverMarker]);
};
