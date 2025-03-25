
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode, MapDriverPosition } from '../types';
import MapMarkers from './MapMarkers';
import MapSelectionControls from './MapSelectionControls';
import HomeLocationControls from './HomeLocationControls';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { toast } from '@/hooks/use-toast';
import { geocodeAddress } from '../services/MapboxService';

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
  saveHomeLocation: () => void;
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

  // Función para buscar ubicaciones
  const handleSearchLocation = async (query: string, type: 'origin' | 'destination') => {
    if (!map) return;
    
    try {
      toast({
        title: "Buscando ubicación",
        description: "Espera mientras buscamos: " + query
      });
      
      const geocodedLocation = await geocodeAddress(query, apiKey);
      
      if (geocodedLocation) {
        // Volar a la ubicación encontrada
        map.flyTo({
          center: [geocodedLocation.lng, geocodedLocation.lat],
          zoom: 15,
          essential: true
        });
        
        // Si estamos buscando un origen o destino, seleccionarlo automáticamente
        if (type === 'origin' && onOriginChange) {
          onOriginChange(geocodedLocation);
          toast({
            title: "Origen establecido",
            description: geocodedLocation.address || "Ubicación seleccionada"
          });
        } else if (type === 'destination' && onDestinationChange) {
          onDestinationChange(geocodedLocation);
          toast({
            title: "Destino establecido",
            description: geocodedLocation.address || "Ubicación seleccionada"
          });
        }
      } else {
        toast({
          title: "Ubicación no encontrada",
          description: "No pudimos encontrar: " + query,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error al buscar ubicación:", error);
      toast({
        title: "Error de búsqueda",
        description: "Ocurrió un error al buscar la ubicación",
        variant: "destructive"
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
        onSearchLocation={handleSearchLocation}
      />
      
      <HomeLocationControls
        allowMapSelection={allowMapSelection}
        origin={origin}
        homeLocation={homeLocation}
        saveHomeLocation={() => {
          if (origin) {
            saveHomeLocation();
            toast({
              title: "Casa guardada",
              description: "Tu ubicación actual ha sido guardada como tu casa",
            });
          } else {
            toast({
              title: "No hay ubicación para guardar",
              description: "Selecciona primero una ubicación de origen",
              variant: "destructive"
            });
          }
        }}
        useHomeAsOrigin={() => {
          if (homeLocation) {
            useHomeAsOrigin();
            toast({
              title: "Casa como origen",
              description: "Tu casa ha sido establecida como punto de origen",
            });
          } else {
            toast({
              title: "No hay casa guardada",
              description: "Primero debes guardar una ubicación como tu casa",
              variant: "destructive"
            });
          }
        }}
      />
    </>
  );
};

export default MapContents;
