
import React from 'react';
import { MapSelectionMode, MapCoordinates } from '../types';
import MapSelectionControl from '../controls/MapSelectionControl';
import { reverseGeocode, geocodeAddress } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onOriginChange?: (coordinates: MapCoordinates) => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  mapRef,
  onOriginChange
}) => {
  if (!allowMapSelection) return null;
  
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude, (address) => {
            const coords = {
              lat: latitude,
              lng: longitude,
              address: address || `Mi ubicación (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
            };
            if (onOriginChange) {
              onOriginChange(coords);
            }
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
  };
  
  const handleSearchLocation = (query: string, type: 'origin' | 'destination') => {
    geocodeAddress(query, (coords) => {
      if (!coords) {
        toast({
          title: "No se encontró la ubicación",
          description: "Intenta con una dirección más específica",
          variant: "destructive"
        });
        return;
      }
      
      if (onOriginChange && type === 'origin') {
        onOriginChange(coords);
      }
    });
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
