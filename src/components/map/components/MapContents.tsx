
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode, MapDriverPosition } from '../types';
import MapMarkers from './MapMarkers';
import MapSelectionControls from './MapSelectionControls';
import HomeLocationControls from './HomeLocationControls';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

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
    onLocationFound: onOriginChange
  });

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
        setSelectionMode={setSelectionMode}
        onUseCurrentLocation={getLocation}
      />
      
      <HomeLocationControls
        allowMapSelection={allowMapSelection}
        origin={origin}
        homeLocation={homeLocation}
        saveHomeLocation={saveHomeLocation}
        useHomeAsOrigin={useHomeAsOrigin}
      />
    </>
  );
};

export default MapContents;
