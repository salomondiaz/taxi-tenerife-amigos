
import React, { useEffect } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { toast } from "@/hooks/use-toast";

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

  // Prevent default events on container when in selection mode
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const container = mapContainer.current;
    
    const preventDefaultEvents = (e: Event) => {
      if (allowMapSelection && selectionMode !== 'none') {
        e.preventDefault();
        e.stopPropagation();
        
        // Show a toast message to guide the user
        if (e.type === 'wheel') {
          toast({
            title: "Modo de selección activo",
            description: "No puedes hacer zoom mientras seleccionas un punto. Haz clic para seleccionar.",
            variant: "default",
          });
        }
      }
    };
    
    // Prevent standard drag events when in selection mode
    container.addEventListener('dragstart', preventDefaultEvents, { passive: false });
    container.addEventListener('drag', preventDefaultEvents, { passive: false });
    container.addEventListener('dragend', preventDefaultEvents, { passive: false });
    
    container.addEventListener('click', (e) => {
      if (allowMapSelection && selectionMode !== 'none') {
        // Don't stop propagation here as we want the click to be handled
        // by the map click handler in useMapEvents
      }
    }, { passive: false });
    
    // Prevent zoom and other gestures
    container.addEventListener('wheel', preventDefaultEvents, { passive: false });
    container.addEventListener('touchstart', preventDefaultEvents, { passive: false });
    container.addEventListener('touchmove', preventDefaultEvents, { passive: false });
    container.addEventListener('touchend', preventDefaultEvents, { passive: false });
    
    return () => {
      container.removeEventListener('dragstart', preventDefaultEvents);
      container.removeEventListener('drag', preventDefaultEvents);
      container.removeEventListener('dragend', preventDefaultEvents);
      container.removeEventListener('wheel', preventDefaultEvents);
      container.removeEventListener('touchstart', preventDefaultEvents);
      container.removeEventListener('touchmove', preventDefaultEvents);
      container.removeEventListener('touchend', preventDefaultEvents);
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
