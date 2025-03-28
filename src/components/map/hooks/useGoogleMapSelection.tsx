
import { useState, useRef, useEffect } from 'react';
import { MapCoordinates } from '../types';
import { useMapClickHandler } from './useMapClickHandler';
import { useMapCursor } from './useMapCursor';
import { createSelectionControls, renderFloatingButton } from '../controls/SelectionControls';

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

  // Get the map click handler from our custom hook
  const { handleMapClick } = useMapClickHandler({
    selectionMode,
    onOriginChange,
    onDestinationChange
  });

  // Apply cursor styling based on selection mode
  useMapCursor({
    mapRef,
    selectionMode
  });

  // Create map controls for selection
  const selectionControls = createSelectionControls({
    selectionMode,
    setSelectionMode
  });

  // Create floating button for destination selection
  const floatingButton = renderFloatingButton({
    selectionMode,
    setSelectionMode,
    showDestinationSelection: !!showDestinationSelection
  });

  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;

    // Clean up the previous listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Add a new click listener if in selection mode
    if (selectionMode && mapRef.current) {
      clickListenerRef.current = mapRef.current.addListener('click', handleMapClick);
    }

    // Cleanup listener on unmount or selection mode change
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [mapRef.current, selectionMode, allowMapSelection, handleMapClick]);

  return { 
    selectionMode, 
    setSelectionMode, 
    handleMapClick,
    createSelectionControls: selectionControls,
    renderFloatingButton: floatingButton 
  };
}
