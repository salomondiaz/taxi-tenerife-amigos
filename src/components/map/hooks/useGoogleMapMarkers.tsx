
import { useCallback } from 'react';
import { MapCoordinates } from '../types';
import { useLocationMarkers } from './useLocationMarkers';
import { useHomeMarker } from './useHomeMarker';

interface UseGoogleMapMarkersProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  allowHomeEditing?: boolean;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useGoogleMapMarkers({
  mapRef,
  origin,
  destination,
  allowHomeEditing = false,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange
}: UseGoogleMapMarkersProps) {
  // Use the location markers hook
  const { 
    originMarkerRef, 
    destinationMarkerRef,
    updateOriginMarker,
    updateDestinationMarker
  } = useLocationMarkers({
    mapRef,
    origin,
    destination,
    allowMapSelection,
    onOriginChange,
    onDestinationChange
  });

  // Use the home marker hook
  const {
    homeMarkerRef,
    homeLocation,
    updateHomeMarker,
    saveHomeLocation
  } = useHomeMarker({
    mapRef,
    origin,
    allowHomeEditing
  });

  // Function to update all markers
  const updateMarkers = useCallback(() => {
    console.log("Updating markers with:", { origin, destination });
    updateOriginMarker();
    updateDestinationMarker();
    updateHomeMarker();
  }, [updateOriginMarker, updateDestinationMarker, updateHomeMarker, origin, destination]);

  return { 
    originMarkerRef, 
    destinationMarkerRef, 
    homeMarkerRef,
    updateMarkers,
    updateHomeMarker,
    saveHomeLocation
  };
}
