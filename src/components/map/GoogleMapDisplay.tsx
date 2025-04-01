
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { MapProps } from './types';
import { toast } from '@/hooks/use-toast';
import { useGoogleMapInitialization } from './hooks/useGoogleMapInitialization';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import MapControls from './components/MapControls';
import HomeControl from './components/HomeControl';
import { reverseGeocode } from './services/GeocodingService';

const GoogleMapDisplay: React.FC<MapProps> = ({
  origin,
  destination,
  routeGeometry,
  className = '',
  style,
  interactive = true,
  showDriverPosition,
  driverPosition,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false,
  showRoute = true,
  allowHomeEditing = false,
  apiKey,
  useHomeAsDestination
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Handle map initialization
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Setup directions renderer
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1E88E5',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });
    
    directionsRendererRef.current.setMap(map);
    
    // Add selection controls to the map if map selection is allowed
    if (allowMapSelection && map) {
      // Add selection controls to the map
      const controlDiv = document.createElement('div');
      const mapControlsObj = MapControls({
        allowMapSelection,
        selectionMode,
        onSelectionModeChange: setSelectionMode,
        showDestinationSelection: !destination
      });
      
      mapControlsObj.createSelectionControls(controlDiv);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }
    
    // Add home button if home editing is allowed
    if (allowHomeEditing) {
      const homeButtonDiv = document.createElement('div');
      const homeControlObj = HomeControl({
        onSaveHome: saveHomeLocation
      });
      
      homeControlObj.createHomeButton(homeButtonDiv);
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeButtonDiv);
    }

    // Add "Travel to Home" button if the function is provided
    if (useHomeAsDestination) {
      const travelHomeButtonDiv = document.createElement('div');
      travelHomeButtonDiv.className = 'map-control-container';
      travelHomeButtonDiv.style.margin = '10px';
      travelHomeButtonDiv.style.backgroundColor = 'white';
      travelHomeButtonDiv.style.borderRadius = '4px';
      travelHomeButtonDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      const button = document.createElement('button');
      button.style.padding = '10px 16px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.cursor = 'pointer';
      button.style.border = 'none';
      button.style.backgroundColor = 'transparent';
      button.title = 'Ir a casa';
      
      // Home icon SVG
      button.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style="font-size: 10px; color: #333;">Ir a casa</span>
        </div>
      `;
      
      button.addEventListener('click', () => {
        useHomeAsDestination();
      });
      
      travelHomeButtonDiv.appendChild(button);
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(travelHomeButtonDiv);
    }

    setMapReady(true);
  }, [allowHomeEditing, allowMapSelection, useHomeAsDestination]);

  // Use our map initialization hook
  useGoogleMapInitialization({
    mapContainerRef,
    origin,
    interactive,
    apiKey,
    onMapReady: handleMapReady
  });

  // Use custom hooks for map functionality
  const { 
    originMarkerRef,
    destinationMarkerRef,
    homeMarkerRef,
    updateMarkers, 
    saveHomeLocation 
  } = useGoogleMapMarkers({
    mapRef,
    origin,
    destination,
    allowHomeEditing,
    allowMapSelection,
    onOriginChange,
    onDestinationChange
  });

  const { 
    selectionMode, 
    setSelectionMode,
    handleMapClick,
    createSelectionControls,
    renderFloatingButton
  } = useGoogleMapSelection({
    mapRef,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    showDestinationSelection: true
  });

  useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  // Update markers when origin or destination changes
  useEffect(() => {
    if (mapReady && mapRef.current) {
      updateMarkers();
    }
  }, [origin, destination, updateMarkers, mapReady]);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        ...style
      }}
    >
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
      {renderFloatingButton && renderFloatingButton()}
    </div>
  );
};

export default GoogleMapDisplay;
