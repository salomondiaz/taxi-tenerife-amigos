
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from '@/hooks/use-toast';
import { MapSelectionMode, MapCoordinates } from '../types';
import { reverseGeocode } from '../services/MapboxService';

interface UseMapSelectionProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  allowMapSelection?: boolean;
  defaultSelectionMode?: MapSelectionMode;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  onMapClick?: (coordinates: MapCoordinates) => void;
}

export function useMapSelection({
  map,
  apiKey,
  allowMapSelection = false,
  defaultSelectionMode = 'none',
  onOriginChange,
  onDestinationChange,
  onMapClick
}: UseMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? defaultSelectionMode : 'none'
  );

  useEffect(() => {
    if (!map) return;
    
    // Remove the dragPan restriction that requires CTRL key
    if (map.dragPan) {
      map.dragPan.enable();
    }
    
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      if (!allowMapSelection) return;
      
      const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      let address: string | undefined;
      
      try {
        address = await reverseGeocode(coords, apiKey);
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
      
      const fullCoords: MapCoordinates = { 
        ...coords, 
        address: address || undefined 
      };
      
      // Pass event to custom click handler if provided
      if (onMapClick) {
        onMapClick(fullCoords);
        return;
      }
      
      if (selectionMode === 'origin') {
        if (onOriginChange) {
          onOriginChange(fullCoords);
        }
        
        toast({
          title: "Origen seleccionado",
          description: address || "Ubicación seleccionada en el mapa",
        });
        
        // Auto-switch to destination selection after origin is set
        setSelectionMode('destination');
      } else if (selectionMode === 'destination') {
        if (onDestinationChange) {
          onDestinationChange(fullCoords);
        }
        
        toast({
          title: "Destino seleccionado",
          description: address || "Ubicación seleccionada en el mapa",
        });
        
        // Reset selection mode after destination is set
        setSelectionMode('none');
      }
    };
    
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, allowMapSelection, selectionMode, onOriginChange, onDestinationChange, onMapClick]);

  return { selectionMode, setSelectionMode };
}
