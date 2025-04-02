
import React from 'react';
import { MapSelectionMode, MapCoordinates } from '../types';
import MapSelectionControl from '../controls/MapSelectionControl';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation?: () => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
  onSearchLocation,
}) => {
  if (!allowMapSelection) return null;
  
  const handleUseCurrentLocation = () => {
    if (!onUseCurrentLocation) {
      // Default implementation if no prop is provided
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            reverseGeocode(latitude, longitude, (address) => {
              toast({
                title: "Ubicación actual",
                description: address || `(${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
              });
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Error de ubicación",
              description: "No se pudo obtener tu ubicación actual",
              variant: "destructive"
            });
          }
        );
      }
    } else {
      onUseCurrentLocation();
    }
  };
  
  const handleSearchLocation = (query: string, type: 'origin' | 'destination') => {
    if (onSearchLocation) {
      onSearchLocation(query, type);
    } else {
      // Fallback implementation
      toast({
        title: "Búsqueda no implementada",
        description: "Esta función no está disponible",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MapSelectionControl
      selectionMode={selectionMode}
      setSelectionMode={setSelectionMode}
      onUseCurrentLocation={handleUseCurrentLocation}
      onSearchLocation={handleSearchLocation}
    />
  );
};

export default MapSelectionControls;
