
import { useState } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useMapSetup } from './useMapSetup';
import { useSelectionMode } from './useSelectionMode';
import { useHomeLocation } from './useHomeLocation';
import { useMapRouting } from './useMapRouting';

interface UseMapInitializationProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  routeGeometry?: any;
  interactive?: boolean;
  apiKey: string;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showKeyInput: boolean;
  setShowKeyInput: (show: boolean) => void;
}

export function useMapInitialization({
  mapContainer,
  origin,
  destination,
  routeGeometry,
  interactive = true,
  apiKey,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  showKeyInput,
  setShowKeyInput
}: UseMapInitializationProps) {
  // Initialize the map
  const map = useMapSetup({
    mapContainer,
    apiKey,
    interactive,
    showKeyInput,
    setShowKeyInput,
    allowMapSelection,
    routeGeometry,
    origin,
    destination
  });
  
  // Home location management
  const {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  } = useHomeLocation(map, origin, onOriginChange);

  // Draw route between points if both exist
  useMapRouting(map, origin, destination, isHomeLocation);
  
  // Handle selection mode
  const { selectionMode, setSelectionMode } = useSelectionMode({
    map,
    allowMapSelection,
    defaultSelectionMode: 'none'
  });

  return {
    map,
    selectionMode,
    setSelectionMode,
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  };
}
