
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapDriverPosition } from '../types';
import OriginMarker from '../markers/OriginMarker';
import DestinationMarker from '../markers/DestinationMarker';
import DriverMarker from '../markers/DriverMarker';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  origin,
  destination,
  showDriverPosition,
  driverPosition,
  onOriginChange,
  onDestinationChange
}) => {
  if (!map) return null;
  
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
