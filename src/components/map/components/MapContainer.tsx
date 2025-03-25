
import React, { useRef, useEffect } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  selectionMode: MapSelectionMode;
  allowMapSelection: boolean;
  apiKey: string;
  onOriginChange?: (coordinates: MapCoordinates) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  mapContainer, 
  selectionMode, 
  allowMapSelection,
  apiKey,
  onOriginChange 
}) => {
  // Current location handler
  const { getLocation } = useCurrentLocation({
    apiKey,
    onLocationFound: onOriginChange
  });

  // Determinar el tipo de cursor basado en el modo de selección
  const getCursorStyle = () => {
    if (!allowMapSelection) return 'default';
    
    switch(selectionMode) {
      case 'origin':
        return 'crosshair';
      case 'destination':
        return 'crosshair';
      default:
        return 'default';
    }
  };

  // Prevenir eventos predeterminados del contenedor cuando estamos en modo de selección
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const container = mapContainer.current;
    
    const preventDefaultDrag = (e: Event) => {
      if (allowMapSelection && selectionMode !== 'none') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Prevenir eventos de arrastre estándar cuando estamos en modo de selección
    container.addEventListener('dragstart', preventDefaultDrag, { passive: false });
    
    return () => {
      container.removeEventListener('dragstart', preventDefaultDrag);
    };
  }, [mapContainer, allowMapSelection, selectionMode]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg shadow-sm overflow-hidden"
      style={{ cursor: getCursorStyle() }}
    />
  );
};

export default MapContainer;
