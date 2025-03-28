
import { useEffect } from 'react';

interface UseMapCursorProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  selectionMode: 'origin' | 'destination' | null;
}

export function useMapCursor({
  mapRef,
  selectionMode
}: UseMapCursorProps) {
  
  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;
    
    // Set cursor based on selection mode
    if (selectionMode) {
      currentMap.setOptions({
        draggableCursor: 'crosshair'
      });
    } else {
      currentMap.setOptions({
        draggableCursor: ''
      });
    }
    
    // Cleanup cursor on unmount or selection mode change
    return () => {
      if (currentMap) {
        currentMap.setOptions({
          draggableCursor: ''
        });
      }
    };
  }, [mapRef, selectionMode]);
}
