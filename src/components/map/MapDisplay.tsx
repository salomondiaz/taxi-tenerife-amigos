
import React, { useRef, useState } from 'react';
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
      
      // Adjust bounds on load
      map.current.on('load', () => {
        if (origin && destination && map.current) {
          const bounds = new mapboxgl.LngLatBounds()
            .extend([origin.lng, origin.lat])
            .extend([destination.lng, destination.lat]);
            
          map.current.fitBounds(bounds, {
            padding: 60,
            maxZoom: 14
          });
        } else if (origin && map.current) {
          map.current.flyTo({
            center: [origin.lng, origin.lat],
            zoom: 14
          });
        } else if (destination && map.current) {
          map.current.flyTo({
            center: [destination.lng, destination.lat],
            zoom: 14
          });
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
  }, [apiKey, origin, destination, interactive, showKeyInput, setShowKeyInput]);

  // Draw route between points if both exist
  useMapRouting(map.current, origin, destination);
  
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
        </>
      )}
    </div>
  );
};

export default MapDisplay;
