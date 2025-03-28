
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
  apiKey
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

    setMapReady(true);
  }, [allowHomeEditing, allowMapSelection]);

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
      {renderFloatingButton}
    </div>
  );
};

export default GoogleMapDisplay;
