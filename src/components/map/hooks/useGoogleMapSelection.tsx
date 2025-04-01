
import { useState, useRef, useEffect, useCallback } from 'react';
import { MapCoordinates } from '../types';
import { useMapCursor } from './useMapCursor';
import { toast } from '@/hooks/use-toast';
import MapControls from '../components/MapControls';
import { reverseGeocode } from '../services/GeocodingService';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  
  // Aplicar estilo de cursor basado en el modo de selección
  useMapCursor({
    mapRef,
    selectionMode
  });

  // Función para manejar los clics en el mapa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!selectionMode) return;
    
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
    
    console.log(`Map clicked in ${selectionMode} mode at:`, lat, lng);
    
    // Obtener la dirección para las coordenadas seleccionadas
    reverseGeocode(lat, lng, (address) => {
      const coordinates = {
        lat,
        lng,
        address
      };
      
      console.log(`Address found: ${address}`);
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        toast({
          title: "Origen seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
        // Desactivar el modo de selección después de seleccionar
        setSelectionMode(null);
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        toast({
          title: "Destino seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
        // Desactivar el modo de selección después de seleccionar
        setSelectionMode(null);
      }
    });
  }, [selectionMode, onOriginChange, onDestinationChange]);

  // Gestionar los eventos de clic del mapa
  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;

    // Eliminar el listener anterior si existe
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Añadir un nuevo listener de clic si estamos en modo selección
    if (selectionMode && mapRef.current) {
      console.log(`Adding click listener for ${selectionMode} selection`);
      clickListenerRef.current = mapRef.current.addListener('click', handleMapClick);
    }

    // Limpiar el listener al desmontar o cambiar el modo de selección
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [mapRef.current, selectionMode, allowMapSelection, handleMapClick]);

  // Controles de selección desde botones en el mapa
  const mapControls = MapControls({
    allowMapSelection,
    selectionMode,
    onSelectionModeChange: setSelectionMode,
    showDestinationSelection
  });

  return { 
    selectionMode, 
    setSelectionMode, 
    handleMapClick,
    createSelectionControls: mapControls.createSelectionControls,
    renderFloatingButton: mapControls.renderFloatingButton
  };
}
