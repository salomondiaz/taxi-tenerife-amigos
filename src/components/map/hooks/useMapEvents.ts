
import { useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from '@/hooks/use-toast';
import { MapSelectionMode, MapCoordinates } from '../types';
import { reverseGeocode } from '../services/MapboxService';

interface UseMapEventsProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  selectionMode: MapSelectionMode;
  onOriginSelect?: (coords: MapCoordinates) => void;
  onDestinationSelect?: (coords: MapCoordinates) => void;
}

export function useMapEvents({
  map,
  apiKey,
  selectionMode,
  onOriginSelect,
  onDestinationSelect
}: UseMapEventsProps) {
  const handleMapClick = useCallback(async (e: mapboxgl.MapMouseEvent) => {
    if (!map || !apiKey || selectionMode === 'none') return;
    
    const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
    const address = await reverseGeocode(coords, apiKey);
    const coordsWithAddress = { ...coords, address: address || undefined };
    
    if (selectionMode === 'origin' && onOriginSelect) {
      onOriginSelect(coordsWithAddress);
      toast({
        title: "Origen seleccionado",
        description: address || "Ubicación seleccionada en el mapa",
      });
    } else if (selectionMode === 'destination' && onDestinationSelect) {
      onDestinationSelect(coordsWithAddress);
      toast({
        title: "Destino seleccionado",
        description: address || "Ubicación seleccionada en el mapa",
      });
    }
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, handleMapClick]);
}
