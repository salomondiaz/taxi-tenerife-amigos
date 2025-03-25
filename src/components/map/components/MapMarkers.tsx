
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapDriverPosition } from '../types';
import OriginMarker from '../markers/OriginMarker';
import DestinationMarker from '../markers/DestinationMarker';
import DriverMarker from '../markers/DriverMarker';
import HomeMarker from '../markers/HomeMarker';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  homeLocation?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showHomeMarker?: boolean;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  origin,
  destination,
  homeLocation,
  showDriverPosition,
  driverPosition,
  onOriginChange,
  onDestinationChange,
  showHomeMarker = true
}) => {
  if (!map) return null;
  
  // Verificamos que el mapa esté completamente cargado
  if (!map.loaded() || !map.getContainer()) {
    return null;
  }
  
  console.log("Rendering markers - Origin:", origin, "Destination:", destination, "Home:", homeLocation);
  
  return (
    <>
      {origin && (
        <OriginMarker 
          map={map} 
          coordinates={origin}
          onDragEnd={onOriginChange}
        />
      )}
      
      {destination && (
        <DestinationMarker 
          map={map} 
          coordinates={destination}
          onDragEnd={onDestinationChange}
        />
      )}
      
      {showHomeMarker && homeLocation && (
        <HomeMarker
          map={map}
          coordinates={homeLocation}
        />
      )}
      
      {showDriverPosition && driverPosition && (
        <DriverMarker 
          map={map} 
          position={driverPosition}
        />
      )}
    </>
  );
};

export default MapMarkers;
