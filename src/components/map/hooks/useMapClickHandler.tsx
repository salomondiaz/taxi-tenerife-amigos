
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from '../types';
import { getAddressFromCoordinates } from '../services/GoogleGeocodingService';

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
  
  // Handles map click events based on the current selection mode
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !selectionMode) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    console.log("Map clicked in mode:", selectionMode, "at coordinates:", lat, lng);
    
    getAddressFromCoordinates(lat, lng, (coordinates) => {
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        toast({
          title: "Origen seleccionado",
          description: coordinates.address || "Ubicación seleccionada"
        });
      } else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        toast({
          title: "Destino seleccionado",
          description: coordinates.address || "Ubicación seleccionada"
        });
      }
    });
  }, [selectionMode, onOriginChange, onDestinationChange]);

  return { handleMapClick };
}
