
import React, { useRef } from 'react';
import { MapProps } from './types';
import { useGoogleMap } from './hooks/useGoogleMap';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSearch } from './hooks/useGoogleMapSearch';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import MapStatusOverlay from './components/MapStatusOverlay';
import MapSelectionControls from './components/MapSelectionControls';
import HomeButtonControls from './components/HomeButtonControls';
import HomeDialog from './components/HomeDialog';
import GoogleMapContainer from './components/GoogleMapContainer';
import MapInstructions from './components/MapInstructions';
import { toast } from '@/hooks/use-toast';

const GoogleMapDisplay: React.FC<MapProps> = (props) => {
  const {
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
    homeLocation: initialHomeLocation,
    showSelectMarkers = false
  } = props;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const { saveHomeLocation: storageUpdateHome, loadHomeLocation } = useHomeLocationStorage();
  const homeLocationFromStorage = loadHomeLocation();
  
  const homeLocation = initialHomeLocation || homeLocationFromStorage;
  console.log("Home location in GoogleMapDisplay:", homeLocation);

  // Initialize map
  const mapRef = useGoogleMap({
    mapContainerRef,
    origin,
    interactive,
    apiKey,
    onMapReady: (map) => {
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
      
      // Configuraciones adicionales al inicializar el mapa
      map.setOptions({
        disableDoubleClickZoom: true, // Desactivar zoom con doble clic
        gestureHandling: "cooperative" // Mejor control de gestos
      });
    }
  });

  // Handle map selection (origin/destination)
  const { 
    selectionMode, 
    setSelectionMode, 
    handleMapClick,
    showHomeDialog,
    setShowHomeDialog
  } = useGoogleMapSelection({
    map: mapRef.current,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    showDestinationSelection: true,
    homeLocation,
    useHomeAsDestination,
    showSelectMarkers
  });

  // Handle map markers
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

  // Handle routing between points
  useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  // Handle map search functionality
  const {
    handleUseCurrentLocation,
    handleSearchLocation
  } = useGoogleMapSearch({
    mapRef,
    onOriginChange,
    onDestinationChange
  });

  // Handle saving home location
  const handleSaveHomeLocation = () => {
    if (origin) {
      saveHomeLocation();
      storageUpdateHome(origin);
      toast({
        title: "Casa guardada",
        description: "Tu ubicación de casa ha sido guardada"
      });
      return true;
    }
    toast({
      title: "No hay origen seleccionado",
      description: "Por favor selecciona primero una ubicación",
      variant: "destructive"
    });
    return false;
  };

  return (
    <GoogleMapContainer mapContainerRef={mapContainerRef}>
      <MapSelectionControls
        allowMapSelection={allowMapSelection}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onUseCurrentLocation={handleUseCurrentLocation}
        onSearchLocation={handleSearchLocation}
      />
      
      <MapStatusOverlay
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        showSelectMarkers={showSelectMarkers}
      />
      
      <HomeButtonControls
        allowHomeEditing={allowHomeEditing}
        handleSaveHomeLocation={handleSaveHomeLocation}
      />
      
      <HomeDialog
        showHomeDialog={showHomeDialog}
        setShowHomeDialog={setShowHomeDialog}
        homeLocation={homeLocation}
        useHomeAsDestination={useHomeAsDestination}
      />
      
      <MapInstructions 
        selectionMode={selectionMode}
        allowMapSelection={allowMapSelection}
      />
    </GoogleMapContainer>
  );
};

export default GoogleMapDisplay;
