
import React from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  selectionMode: MapSelectionMode;
  allowMapSelection: boolean;
  apiKey: string;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  homeLocation?: MapCoordinates;
  showHomeMarker?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  mapContainer, 
  selectionMode, 
  allowMapSelection,
  apiKey,
  onOriginChange,
  homeLocation,
  showHomeMarker
}) => {
  // Determine cursor style based on selection mode
  const getCursorStyle = () => {
    if (!allowMapSelection) return 'default';
    
    switch(selectionMode) {
      case 'origin':
      case 'destination':
        return 'crosshair';
      default:
        return 'default';
    }
  };

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg shadow-sm overflow-hidden"
      style={{ cursor: getCursorStyle() }}
    />
  );
};

export default MapContainer;
