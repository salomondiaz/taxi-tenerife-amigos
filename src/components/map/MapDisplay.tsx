
import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MapProps, MapCoordinates, MapSelectionMode } from './types';
import { useMapRouting } from './hooks/useMapRouting';
import { useMapEvents } from './hooks/useMapEvents';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { useMapApiKey } from './hooks/useMapApiKey';

import ApiKeyManager from './components/ApiKeyManager';
import MapContainer from './components/MapContainer';
import MapMarkers from './components/MapMarkers';
import MapSelectionControls from './components/MapSelectionControls';

const HOME_LOCATION_KEY = 'user_home_location';

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
  const [isHomeLocation, setIsHomeLocation] = useState<boolean>(false);
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);

  // API Key management
  const { 
    apiKey, 
    setApiKey, 
    showKeyInput, 
    setShowKeyInput, 
    handleApiKeySubmit 
  } = useMapApiKey();

  // Load home location on mount
  useEffect(() => {
    try {
      const savedHomeLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (savedHomeLocation) {
        const parsedHome = JSON.parse(savedHomeLocation);
        setHomeLocation(parsedHome);
        console.log("Loaded home location:", parsedHome);
      }
    } catch (error) {
      console.error("Error loading home location:", error);
    }
  }, []);

  // Check if current origin is home location
  useEffect(() => {
    if (origin && homeLocation) {
      const isHome = 
        Math.abs(origin.lat - homeLocation.lat) < 0.0001 && 
        Math.abs(origin.lng - homeLocation.lng) < 0.0001;
      
      setIsHomeLocation(isHome);
      console.log("Is home location:", isHome);
    } else {
      setIsHomeLocation(false);
    }
  }, [origin, homeLocation]);

  // Save home location
  const saveHomeLocation = () => {
    if (!origin) {
      console.error("No origin set to save as home");
      return;
    }
    
    try {
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(origin));
      setHomeLocation(origin);
      console.log("Home location saved:", origin);
    } catch (error) {
      console.error("Error saving home location:", error);
    }
  };

  // Use home location as origin
  const useHomeAsOrigin = () => {
    if (!homeLocation || !onOriginChange) {
      console.error("No home location saved or no origin change handler");
      return;
    }
    
    onOriginChange(homeLocation);
    setIsHomeLocation(true);
    console.log("Using home as origin:", homeLocation);
  };

  // Initialize map when API key is available
  React.useEffect(() => {
    if (!apiKey || !mapContainer.current || showKeyInput) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origin 
          ? [origin.lng, origin.lat] 
          : [28.2916, -16.6291], // TENERIFE_CENTER
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
      
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setShowKeyInput(true);
      return undefined;
    }
  }, [apiKey, origin, destination, interactive, showKeyInput, setShowKeyInput]);

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
            showDriverPosition={showDriverPosition}
            driverPosition={driverPosition}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
          />
          
          <MapSelectionControls 
            allowMapSelection={allowMapSelection}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            onUseCurrentLocation={getLocation}
          />
          
          {allowMapSelection && (
            <div className="absolute bottom-4 left-4 z-10 flex gap-2">
              {origin && (
                <button 
                  onClick={saveHomeLocation}
                  className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100"
                  title="Guardar como mi casa"
                >
                  💾 Guardar como Mi Casa
                </button>
              )}
              
              {homeLocation && (
                <button 
                  onClick={useHomeAsOrigin}
                  className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100"
                  title="Usar Mi Casa como origen"
                >
                  🏠 Usar Mi Casa
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapDisplay;
