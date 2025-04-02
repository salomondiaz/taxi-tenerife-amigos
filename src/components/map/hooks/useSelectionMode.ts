
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapSelectionMode } from '../types';

interface UseSelectionModeProps {
  map: mapboxgl.Map | null;
  allowMapSelection: boolean;
  defaultSelectionMode?: MapSelectionMode;
}

export function useSelectionMode({
  map,
  allowMapSelection,
  defaultSelectionMode = 'none'
}: UseSelectionModeProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(defaultSelectionMode);

  // Reset selection mode if map selection is disabled
  useEffect(() => {
    if (!allowMapSelection && selectionMode !== 'none') {
      setSelectionMode('none');
    }
  }, [allowMapSelection, selectionMode]);

  // Update cursor style based on selection mode
  useEffect(() => {
    if (!map || !map.getCanvas()) return;
    
    const canvas = map.getCanvas();
    
    switch (selectionMode) {
      case 'origin':
      case 'destination':
        canvas.style.cursor = 'crosshair';
        break;
      default:
        canvas.style.cursor = '';
        break;
    }
    
    return () => {
      if (map && map.getCanvas()) {
        map.getCanvas().style.cursor = '';
      }
    };
  }, [map, selectionMode]);

  return { selectionMode, setSelectionMode };
}
