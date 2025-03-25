
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/MapboxService';

interface UseMapEventsProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  selectionMode: MapSelectionMode;
  onOriginSelect?: (coordinates: MapCoordinates) => void;
  onDestinationSelect?: (coordinates: MapCoordinates) => void;
}

export function useMapEvents({
  map,
  apiKey,
  selectionMode,
  onOriginSelect,
  onDestinationSelect
}: UseMapEventsProps) {
  // Handle map click events for selection
  useEffect(() => {
    if (!map) return;
    
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      console.log("Map clicked in mode:", selectionMode);
      
      if (selectionMode === 'none') return;
      
      const lngLat = e.lngLat;
      const coordinates = {
        lat: lngLat.lat,
        lng: lngLat.lng
      };
      
      try {
        // Obtain address via reverse geocoding
        const address = await reverseGeocode(coordinates, apiKey);
        const coordsWithAddress = { ...coordinates, address };
        
        if (selectionMode === 'origin' && onOriginSelect) {
          console.log("Setting origin to:", coordsWithAddress);
          onOriginSelect(coordsWithAddress);
        } else if (selectionMode === 'destination' && onDestinationSelect) {
          console.log("Setting destination to:", coordsWithAddress);
          onDestinationSelect(coordsWithAddress);
        }
      } catch (error) {
        console.error("Error during reverse geocoding:", error);
        
        // Even if geocoding fails, still set the coordinates
        if (selectionMode === 'origin' && onOriginSelect) {
          onOriginSelect(coordinates);
        } else if (selectionMode === 'destination' && onDestinationSelect) {
          onDestinationSelect(coordinates);
        }
      }
    };
    
    // Only add click handler if we're in selection mode and map is valid
    if (selectionMode !== 'none' && map && map.getCanvas()) {
      try {
        map.getCanvas().style.cursor = 'pointer';
        map.on('click', handleMapClick);
      } catch (error) {
        console.error("Error setting cursor style:", error);
      }
    } else if (map && map.getCanvas()) {
      try {
        map.getCanvas().style.cursor = '';
      } catch (error) {
        console.error("Error resetting cursor style:", error);
      }
    }
    
    return () => {
      // Clean up only if map still exists
      if (map) {
        try {
          map.off('click', handleMapClick);
          if (map.getCanvas()) {
            map.getCanvas().style.cursor = '';
          }
        } catch (error) {
          console.error("Error in cleanup of map events:", error);
        }
      }
    };
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
}
