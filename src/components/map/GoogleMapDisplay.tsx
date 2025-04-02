
import React, { useRef, useEffect, useState } from 'react';
import { MapProps, MapCoordinates, MapSelectionMode } from './types';
import { useGoogleMapInitialization } from './hooks/useGoogleMapInitialization';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

const GoogleMapDisplay: React.FC<MapProps> = ({
  apiKey,
  origin,
  destination,
  routeGeometry,
  interactive = true,
  showRoute = false,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  useHomeAsDestination,
  showHomeMarker = false,
  alwaysShowHomeMarker = false,
  allowHomeEditing = false,
  homeLocation: initialHomeLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { saveHomeLocation: storageUpdateHome, loadHomeLocation } = useHomeLocationStorage();
  const homeLocationFromStorage = loadHomeLocation();
  
  // Use provided home location or fall back to stored one
  const homeLocation = initialHomeLocation || homeLocationFromStorage;

  // Initialize map and prepare to receive markers
  const mapRef = useGoogleMapInitialization({
    mapContainerRef,
    origin,
    interactive,
    apiKey,
    onMapReady: (map) => {
      setMapReady(true);
      
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          preserveViewport: true,
          polylineOptions: {
            strokeColor: '#1E88E5',
            strokeWeight: 5,
            strokeOpacity: 0.7
          }
        });
      } else {
        directionsRendererRef.current.setMap(map);
      }
    }
  });

  // Set up map selection capabilities (clicking on map to set points)
  const { 
    selectionMode, 
    setSelectionMode,
    handleMapClick,
    createSelectionControls,
    renderFloatingButton,
    HomeDialog,
    showHomeDialog
  } = useGoogleMapSelection({
    mapRef,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    showDestinationSelection: true,
    useHomeAsDestination,
    homeLocation
  });

  // Handle markers on the map (origin, destination, home)
  const { 
    updateMarkers,
    saveHomeLocation
  } = useGoogleMapMarkers({
    mapRef,
    origin,
    destination,
    allowHomeEditing,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    alwaysShowHomeMarker,
    showHomeMarker,
    homeLocation
  });

  // Handle route display between points
  useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  // Update markers when coordinates change
  useEffect(() => {
    if (mapReady) {
      updateMarkers();
    }
  }, [mapReady, origin, destination, homeLocation, updateMarkers]);

  // Function to save home location - both in context and in localStorage
  const handleSaveHomeLocation = () => {
    if (origin) {
      saveHomeLocation();
      storageUpdateHome(origin);
    }
  };

  const selectionControlsComponent = createSelectionControls();

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Selection controls for setting origin and destination */}
      {selectionControlsComponent}
      
      {/* Floating button for easy access to selection */}
      {renderFloatingButton()}
      
      {/* Dialog for asking if user wants to travel from current point to home */}
      <HomeDialog />
      
      {/* Home location controls */}
      {allowHomeEditing && (
        <div className="absolute top-20 right-4 z-10 bg-white p-3 rounded-lg shadow-md">
          <button
            onClick={handleSaveHomeLocation}
            className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <span className="material-icons text-sm mr-1">home</span>
            Guardar como Casa
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapDisplay;
