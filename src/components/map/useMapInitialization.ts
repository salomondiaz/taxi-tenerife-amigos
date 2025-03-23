
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from './types';
import { useMapInstance } from './hooks/useMapInstance';
import { useMapGeocoding } from './hooks/useMapGeocoding';
import { useMapMarkers } from './hooks/useMapMarkers';
import { useMapView } from './hooks/useMapView';
import { useMapSelection } from './hooks/useMapSelection';

interface UseMapInitializationProps {
  apiKey: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  originMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  destinationMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  driverMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: {
    lat: number;
    lng: number;
  };
  interactive?: boolean;
  setShowKeyInput: (show: boolean) => void;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  allowMapSelection?: boolean;
  defaultSelectionMode?: MapSelectionMode;
}

export const useMapInitialization = ({
  apiKey,
  mapContainer,
  map,
  originMarker,
  destinationMarker,
  driverMarker,
  origin,
  destination,
  showDriverPosition = false,
  driverPosition,
  interactive = true,
  setShowKeyInput,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false,
  defaultSelectionMode = 'none'
}: UseMapInitializationProps): { selectionMode: MapSelectionMode; setSelectionMode: (mode: MapSelectionMode) => void } => {
  // Create map instance
  const mapInstance = useMapInstance({
    apiKey,
    mapContainer,
    origin,
    interactive,
    setShowKeyInput
  });
  
  // Set the map ref to the current instance
  if (mapInstance && map.current !== mapInstance) {
    map.current = mapInstance;
  }
  
  // Handle geocoding for addresses
  useMapGeocoding({
    apiKey,
    origin,
    destination,
    onOriginResolved: onOriginChange,
    onDestinationResolved: onDestinationChange
  });
  
  // Handle markers
  useMapMarkers({
    map: map.current,
    apiKey,
    origin,
    destination,
    driverPosition,
    showDriverPosition,
    originMarker,
    destinationMarker,
    driverMarker,
    onOriginChange,
    onDestinationChange
  });
  
  // Handle map view (panning, zooming)
  useMapView({
    map: map.current,
    origin,
    destination
  });
  
  // Handle map selection mode
  const { selectionMode, setSelectionMode } = useMapSelection({
    map: map.current,
    apiKey,
    allowMapSelection,
    defaultSelectionMode,
    onOriginChange,
    onDestinationChange
  });
  
  return { selectionMode, setSelectionMode };
};
