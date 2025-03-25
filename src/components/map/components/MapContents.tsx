
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode, MapDriverPosition } from '../types';
import MapMarkers from './MapMarkers';
import MapSelectionControls from './MapSelectionControls';
import HomeLocationControls from './HomeLocationControls';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { toast } from '@/hooks/use-toast';

interface MapContentsProps {
  map: mapboxgl.Map | null;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  homeLocation?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  showHomeMarker: boolean;
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  apiKey: string;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  saveHomeLocation: (location: MapCoordinates) => void;
  useHomeAsOrigin: () => void;
}

const MapContents: React.FC<MapContentsProps> = ({
  map,
  origin,
  destination,
  homeLocation,
  showDriverPosition,
  driverPosition,
  showHomeMarker,
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  apiKey,
  onOriginChange,
  onDestinationChange,
  saveHomeLocation,
  useHomeAsOrigin
}) => {
  // Current location handler for MapSelectionControls
  const { getLocation } = useCurrentLocation({
    apiKey,
    onLocationFound: (coords) => {
      if (onOriginChange) {
        onOriginChange(coords);
        toast({
          title: "Ubicación actual como origen",
          description: coords.address || "Se ha establecido tu ubicación actual como punto de origen"
        });
      }
    }
  });

  // Función para manejar cambios en el modo de selección
  const handleSelectionModeChange = (mode: MapSelectionMode) => {
    setSelectionMode(mode);
    
    // Mostrar mensaje al usuario cuando cambia el modo
    if (mode === 'origin') {
      toast({
        title: "Selecciona el origen",
        description: "Haz clic en el mapa para seleccionar el punto de origen",
      });
    } else if (mode === 'destination') {
      toast({
        title: "Selecciona el destino",
        description: "Haz clic en el mapa para seleccionar el punto de destino",
      });
    }
  };

  return (
    <>
      <MapMarkers 
        map={map}
        origin={origin}
        destination={destination}
        homeLocation={homeLocation}
        showDriverPosition={showDriverPosition}
        driverPosition={driverPosition}
        onOriginChange={onOriginChange}
        onDestinationChange={onDestinationChange}
        showHomeMarker={showHomeMarker}
      />
      
      <MapSelectionControls 
        allowMapSelection={allowMapSelection}
        selectionMode={selectionMode}
        setSelectionMode={handleSelectionModeChange}
        onUseCurrentLocation={getLocation}
      />
      
      <HomeLocationControls
        allowMapSelection={allowMapSelection}
        origin={origin}
        homeLocation={homeLocation}
        saveHomeLocation={() => {
          if (origin) {
            saveHomeLocation(origin);
            toast({
              title: "Casa guardada",
              description: "Tu ubicación actual ha sido guardada como tu casa",
            });
          }
        }}
        useHomeAsOrigin={() => {
          useHomeAsOrigin();
          toast({
            title: "Casa como origen",
            description: "Tu casa ha sido establecida como punto de origen",
          });
        }}
      />
    </>
  );
};

export default MapContents;
