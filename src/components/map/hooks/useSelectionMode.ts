
import { useEffect, useState } from 'react';
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
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? defaultSelectionMode : 'none'
  );

  // Update map behavior when selection mode changes
  useEffect(() => {
    if (!map) return;
    
    // Change the cursor style based on selection mode
    if (map.getCanvas()) {
      if (selectionMode !== 'none') {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = '';
      }
    }
  }, [map, selectionMode]);

  return { selectionMode, setSelectionMode };
}
