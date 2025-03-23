
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
}

export function useMapSelection({
  map,
  apiKey,
  allowMapSelection = false,
  defaultSelectionMode = 'none',
  onOriginChange,
  onDestinationChange
}: UseMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? defaultSelectionMode : 'none'
  );

  useEffect(() => {
    if (!map || !allowMapSelection) return;
    
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      if (selectionMode === 'none') return;
      
      const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      const address = await reverseGeocode(coords, apiKey);
      
      if (selectionMode === 'origin') {
        if (onOriginChange) {
          onOriginChange({ ...coords, address: address || undefined });
        }
        
        toast({
          title: "Origen seleccionado",
          description: address || "Ubicación seleccionada en el mapa",
        });
      } else if (selectionMode === 'destination') {
        if (onDestinationChange) {
          onDestinationChange({ ...coords, address: address || undefined });
        }
        
        toast({
          title: "Destino seleccionado",
          description: address || "Ubicación seleccionada en el mapa",
        });
      }
    };
    
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, apiKey, allowMapSelection, selectionMode, onOriginChange, onDestinationChange]);

  return { selectionMode, setSelectionMode };
}
