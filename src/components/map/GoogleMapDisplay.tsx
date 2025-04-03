
import React, { useRef, useEffect } from 'react';
import { MapProps } from './types';
import { useGoogleMapInitialization } from './hooks/useGoogleMapInitialization';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import MapStatusOverlay from './components/MapStatusOverlay';
import MapSelectionControls from './components/MapSelectionControls';
import HomeButtonControls from './components/HomeButtonControls';
import HomeDialog from './components/HomeDialog';
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
  const mapRef = useGoogleMapInitialization({
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

  // Prevent automatic zoom out when clicking
  useEffect(() => {
    if (mapRef.current) {
      const currentMap = mapRef.current;
      
      // Create a listener that prevents zoom being reset
      const preventZoomReset = (event: any) => {
        event.stop();
      };
      
      // Add various event listeners to prevent unwanted zoom changes
      google.maps.event.addListener(currentMap, 'dblclick', preventZoomReset);
      
      return () => {
        if (currentMap) {
          google.maps.event.clearListeners(currentMap, 'dblclick');
        }
      };
    }
  }, [mapRef.current]);

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

  // Handle using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get the address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const address = results[0].formatted_address;
              if (onOriginChange) {
                onOriginChange({
                  lat: latitude,
                  lng: longitude,
                  address
                });
                toast({
                  title: "Ubicación actual establecida",
                  description: address
                });
              }
            }
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast({
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación actual",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocalización no soportada",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive"
      });
    }
  };

  // Handle search location
  const handleSearchLocation = (query: string, type: 'origin' | 'destination') => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;
        
        if (type === 'origin' && onOriginChange) {
          onOriginChange({ lat, lng, address });
          // Fly to location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
          toast({
            title: "Origen establecido",
            description: address
          });
        } else if (type === 'destination' && onDestinationChange) {
          onDestinationChange({ lat, lng, address });
          // Fly to location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
          toast({
            title: "Destino establecido",
            description: address
          });
        }
      } else {
        toast({
          title: "Ubicación no encontrada",
          description: "No se encontró ninguna ubicación con esa dirección",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      
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
      
      {/* Instrucciones de selección */}
      {!selectionMode && allowMapSelection && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm z-30">
          Usa los botones en la esquina superior derecha para seleccionar origen y destino
        </div>
      )}
    </div>
  );
};

export default GoogleMapDisplay;
