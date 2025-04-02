
import { useState, useEffect } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { toast } from '@/hooks/use-toast';

interface UseMapSelectionProps {
  map: google.maps.Map | null;
  allowMapSelection: boolean;
  defaultSelectionMode?: MapSelectionMode;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useGoogleMapSelection({
  map,
  allowMapSelection,
  defaultSelectionMode = 'none',
  onOriginChange,
  onDestinationChange
}: UseMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(defaultSelectionMode);

  // Change selection mode with feedback
  const changeSelectionMode = (mode: MapSelectionMode) => {
    setSelectionMode(mode);
    
    if (mode === 'none') {
      return;
    }
    
    // Show toast message
    toast({
      title: mode === 'origin' ? 'Selecciona el origen' : 'Selecciona el destino',
      description: `Haz clic en el mapa para seleccionar el punto de ${mode === 'origin' ? 'origen' : 'destino'}`,
    });
  };

  // Reset to default mode when component unmmounts
  useEffect(() => {
    return () => {
      setSelectionMode('none');
    };
  }, []);

  return { selectionMode, setSelectionMode: changeSelectionMode };
}
