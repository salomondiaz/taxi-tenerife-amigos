
import React, { useRef } from 'react';
import { MapProps } from './types';
import { useMapApiKey } from './hooks/useMapApiKey';
import { useMapInitialization } from './hooks/useMapInitialization';

import ApiKeyManager from './components/ApiKeyManager';
import MapContainer from './components/MapContainer';
import MapContents from './components/MapContents';

const MapDisplay: React.FC<MapProps> = ({
  origin,
  destination,
  routeGeometry,
  showDriverPosition = false,
  driverPosition,
  style,
  className = "",
  interactive = true,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  // API Key management
  const { 
    apiKey, 
    setApiKey, 
    showKeyInput, 
    setShowKeyInput, 
    handleApiKeySubmit 
  } = useMapApiKey();

  // Initialize map and related functionality
  const {
    map,
    selectionMode,
    setSelectionMode,
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  } = useMapInitialization({
    mapContainer,
    origin,
    destination,
    routeGeometry,
    interactive,
    apiKey,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    showKeyInput,
    setShowKeyInput
  });

  return (
    <div className={`relative ${className}`} style={style}>
      {showKeyInput ? (
        <ApiKeyManager
          apiKey={apiKey}
          setApiKey={setApiKey}
          onApiKeySubmit={handleApiKeySubmit}
        />
      ) : (
        <>
          <MapContainer 
            mapContainer={mapContainer}
            selectionMode={selectionMode}
            allowMapSelection={allowMapSelection}
            apiKey={apiKey}
            onOriginChange={onOriginChange}
          />
          
          <MapContents
            map={map}
            origin={origin}
            destination={destination}
            homeLocation={homeLocation}
            showDriverPosition={showDriverPosition}
            driverPosition={driverPosition}
            showHomeMarker={showHomeMarker}
            allowMapSelection={allowMapSelection}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            apiKey={apiKey}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
            saveHomeLocation={saveHomeLocation}
            useHomeAsOrigin={useHomeAsOrigin}
          />
        </>
      )}
    </div>
  );
};

export default MapDisplay;
