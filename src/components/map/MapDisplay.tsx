
import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MapProps, MapCoordinates, MapSelectionMode } from './types';
import { useMapRouting } from './hooks/useMapRouting';
import { useMapEvents } from './hooks/useMapEvents';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { useMapApiKey } from './hooks/useMapApiKey';
import { useHomeLocation } from './hooks/useHomeLocation';
import { loadLastMapPosition } from './services/MapRoutingService';

import ApiKeyManager from './components/ApiKeyManager';
import MapContainer from './components/MapContainer';
import MapMarkers from './components/MapMarkers';
import MapSelectionControls from './components/MapSelectionControls';
import HomeLocationControls from './components/HomeLocationControls';

const MapDisplay: React.FC<MapProps> = ({
  origin,
  destination,
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
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? 'origin' : 'none'
  );

  // API Key management
  const { 
    apiKey, 
    setApiKey, 
    showKeyInput, 
    setShowKeyInput, 
    handleApiKeySubmit 
  } = useMapApiKey();

  // Home location management
  const {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  } = useHomeLocation(map.current, origin, onOriginChange);
  
  // Draw route between points if both exist
  useMapRouting(map.current, origin, destination, isHomeLocation);
  
  // Handle map click events for selection
  useMapEvents({
    map: map.current,
    apiKey,
    selectionMode,
    onOriginSelect: onOriginChange,
    onDestinationSelect: onDestinationChange
  });
  
  // Current location handler for MapSelectionControls
  const { getLocation } = useCurrentLocation({
    apiKey,
    onLocationFound: onOriginChange
  });

  // Initialize map when API key is available
  React.useEffect(() => {
    if (!apiKey || !mapContainer.current || showKeyInput) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [28.2916, -16.6291], // Default to TENERIFE_CENTER
        zoom: 11,
        interactive: interactive
      });
      
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
        
        // Add geolocation button
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );
      }
      
      map.current.once('load', () => {
        // Load last map position when map is ready
        loadLastMapPosition(map.current!);
        
        // If home location exists, show home marker
        if (homeLocation && map.current) {
          console.log("Home location exists, showing home marker");
        }
      });
      
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setShowKeyInput(true);
      return undefined;
    }
  }, [apiKey, interactive, showKeyInput, setShowKeyInput, homeLocation]);

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
          
          <MapMarkers 
            map={map.current}
            origin={origin}
            destination={destination}
            homeLocation={homeLocation || undefined}
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
      )}
    </div>
  );
};

export default MapDisplay;
