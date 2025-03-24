
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
    
    // Check if map is fully loaded and initialized
    if (!map.loaded()) {
      console.log("Map not fully loaded, skipping click handler");
      return;
    }
    
    const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
    
    try {
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
    } catch (error) {
      console.error("Error processing map click:", error);
      toast({
        title: "Error al seleccionar ubicación",
        description: "No se pudo procesar la selección en el mapa",
        variant: "destructive",
      });
    }
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
  
  useEffect(() => {
    if (!map) return;
    
    // Only attach the click handler when the map is fully loaded
    const handleLoad = () => {
      map.on('click', handleMapClick);
    };
    
    if (map.loaded()) {
      map.on('click', handleMapClick);
    } else {
      map.once('load', handleLoad);
    }
    
    return () => {
      map.off('click', handleMapClick);
      map.off('load', handleLoad);
    };
  }, [map, handleMapClick]);
}
