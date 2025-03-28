
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
    if (!mapRef.current) return;
    
    // Set cursor based on selection mode
    if (mapRef.current) {
      if (selectionMode) {
        mapRef.current.setOptions({
          draggableCursor: 'crosshair'
        });
      } else {
        mapRef.current.setOptions({
          draggableCursor: ''
        });
      }
    }
    
    // Cleanup cursor on unmount or selection mode change
    return () => {
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: ''
        });
      }
    };
  }, [mapRef.current, selectionMode]);
}
