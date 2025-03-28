
import { useCallback } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';
import { reverseGeocode } from '../services/GeocodingService';

interface UseMapClickHandlerProps {
  selectionMode: 'origin' | 'destination' | null;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useMapClickHandler({
  selectionMode,
  onOriginChange,
  onDestinationChange
}: UseMapClickHandlerProps) {
  
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!selectionMode) return;
    
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
    
    // Obtener la dirección para las coordenadas seleccionadas
    reverseGeocode(lat, lng, (address) => {
      const coordinates = {
        lat,
        lng,
        address
      };
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        toast({
          title: "Origen seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        toast({
          title: "Destino seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
      }

      // Una vez seleccionado, cambiar el modo de selección a null
      // Este cambio es importante para evitar el parpadeo y problemas de selección
      // Ya que el modo de selección se restablece después de cada selección
    });
  }, [selectionMode, onOriginChange, onDestinationChange]);
  
  return { handleMapClick };
}
