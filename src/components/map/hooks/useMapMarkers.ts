
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { addOriginMarker, addDestinationMarker, addDriverMarker } from '../services/MapMarkerService';
import { reverseGeocode } from '../services/MapboxService';
import { drawRoute } from '../services/MapRoutingService';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  driverPosition?: {
    lat: number;
    lng: number;
  };
  showDriverPosition?: boolean;
  originMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  destinationMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  driverMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useMapMarkers({
  map,
  apiKey,
  origin,
  destination,
  driverPosition,
  showDriverPosition = false,
  originMarker,
  destinationMarker,
  driverMarker,
  onOriginChange,
  onDestinationChange
}: UseMapMarkersProps) {
  // Setup origin marker
  useEffect(() => {
    if (!map || !origin) return;
    
    if (originMarker.current) {
      originMarker.current.remove();
    }
    
    originMarker.current = addOriginMarker(map, origin);
    
    // Add drag event handling
    if (onOriginChange && originMarker.current) {
      originMarker.current.on('dragend', async () => {
        const lngLat = originMarker.current?.getLngLat();
        if (lngLat) {
          const coords = { lat: lngLat.lat, lng: lngLat.lng };
          const address = await reverseGeocode(coords, apiKey);
          onOriginChange({ ...coords, address: address || undefined });
          
          // Update route if both markers exist
          if (originMarker.current && destinationMarker.current && map) {
            const destLngLat = destinationMarker.current.getLngLat();
            drawRoute(map, coords, { lat: destLngLat.lat, lng: destLngLat.lng });
          }
        }
      });
    }
    
    return () => {
      if (originMarker.current) {
        originMarker.current.remove();
        originMarker.current = null;
      }
    };
  }, [map, origin, apiKey, originMarker, destinationMarker, onOriginChange]);
  
  // Setup destination marker
  useEffect(() => {
    if (!map || !destination) return;
    
    if (destinationMarker.current) {
      destinationMarker.current.remove();
    }
    
    destinationMarker.current = addDestinationMarker(map, destination);
    
    // Add drag event handling
    if (onDestinationChange && destinationMarker.current) {
      destinationMarker.current.on('dragend', async () => {
        const lngLat = destinationMarker.current?.getLngLat();
        if (lngLat) {
          const coords = { lat: lngLat.lat, lng: lngLat.lng };
          const address = await reverseGeocode(coords, apiKey);
          onDestinationChange({ ...coords, address: address || undefined });
          
          // Update route if both markers exist
          if (originMarker.current && destinationMarker.current && map) {
            const origLngLat = originMarker.current.getLngLat();
            drawRoute(map, { lat: origLngLat.lat, lng: origLngLat.lng }, coords);
          }
        }
      });
    }
    
    return () => {
      if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
      }
    };
  }, [map, destination, apiKey, originMarker, destinationMarker, onDestinationChange]);
  
  // Setup driver marker
  useEffect(() => {
    if (!map || !showDriverPosition) return;
    
    const startPosition = driverPosition || origin;
    
    if (startPosition) {
      if (driverMarker.current) {
        driverMarker.current.remove();
      }
      
      driverMarker.current = addDriverMarker(map, startPosition);
    }
    
    return () => {
      if (driverMarker.current) {
        driverMarker.current.remove();
        driverMarker.current = null;
      }
    };
  }, [map, showDriverPosition, driverPosition, origin, driverMarker]);
}
