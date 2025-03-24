
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

    // Ensure the map is actually ready before adding markers
    const addOriginMarkerToMap = () => {
      try {
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
              try {
                const address = await reverseGeocode(coords, apiKey);
                onOriginChange({ ...coords, address: address || undefined });
                
                // Update route if both markers exist
                if (originMarker.current && destinationMarker.current && map) {
                  const destLngLat = destinationMarker.current.getLngLat();
                  drawRoute(map, coords, { lat: destLngLat.lat, lng: destLngLat.lng });
                }
              } catch (error) {
                console.error("Error during reverse geocoding:", error);
                onOriginChange(coords);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error setting up origin marker:", error);
      }
    };
    
    if (map.loaded()) {
      addOriginMarkerToMap();
    } else {
      map.once('load', addOriginMarkerToMap);
    }
    
    return () => {
      if (originMarker.current) {
        originMarker.current.remove();
        originMarker.current = null;
      }
      map.off('load', addOriginMarkerToMap);
    };
  }, [map, origin, apiKey, originMarker, destinationMarker, onOriginChange]);
  
  // Setup destination marker
  useEffect(() => {
    if (!map || !destination) return;
    
    const addDestinationMarkerToMap = () => {
      try {
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
              try {
                const address = await reverseGeocode(coords, apiKey);
                onDestinationChange({ ...coords, address: address || undefined });
                
                // Update route if both markers exist
                if (originMarker.current && destinationMarker.current && map) {
                  const origLngLat = originMarker.current.getLngLat();
                  drawRoute(map, { lat: origLngLat.lat, lng: origLngLat.lng }, coords);
                }
              } catch (error) {
                console.error("Error during reverse geocoding:", error);
                onDestinationChange(coords);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error setting up destination marker:", error);
      }
    };
    
    if (map.loaded()) {
      addDestinationMarkerToMap();
    } else {
      map.once('load', addDestinationMarkerToMap);
    }
    
    return () => {
      if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
      }
      map.off('load', addDestinationMarkerToMap);
    };
  }, [map, destination, apiKey, originMarker, destinationMarker, onDestinationChange]);
  
  // Setup driver marker
  useEffect(() => {
    if (!map || !showDriverPosition) return;
    
    const startPosition = driverPosition || origin;
    
    const addDriverMarkerToMap = () => {
      if (startPosition) {
        try {
          if (driverMarker.current) {
            driverMarker.current.remove();
          }
          
          driverMarker.current = addDriverMarker(map, startPosition);
        } catch (error) {
          console.error("Error setting up driver marker:", error);
        }
      }
    };
    
    if (map.loaded()) {
      addDriverMarkerToMap();
    } else {
      map.once('load', addDriverMarkerToMap);
    }
    
    return () => {
      if (driverMarker.current) {
        driverMarker.current.remove();
        driverMarker.current = null;
      }
      map.off('load', addDriverMarkerToMap);
    };
  }, [map, showDriverPosition, driverPosition, origin, driverMarker]);
}
