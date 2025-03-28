
import { useState, useRef, useEffect } from 'react';
import { MapCoordinates } from '../types';
import { useMapClickHandler } from './useMapClickHandler';
import { useMapCursor } from './useMapCursor';
import { toast } from '@/hooks/use-toast';
import MapControls from '../components/MapControls';

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
  
  // Usar nuestro hook personalizado para manejar los clics en el mapa
  const { handleMapClick } = useMapClickHandler({
    selectionMode,
    onOriginChange: (coordinates) => {
      if (onOriginChange) {
        onOriginChange(coordinates);
        // Desactivar el modo de selección después de seleccionar
        setSelectionMode(null);
      }
    },
    onDestinationChange: (coordinates) => {
      if (onDestinationChange) {
        onDestinationChange(coordinates);
        // Desactivar el modo de selección después de seleccionar
        setSelectionMode(null);
      }
    }
  });

  // Aplicar estilo de cursor basado en el modo de selección
  useMapCursor({
    mapRef,
    selectionMode
  });

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
