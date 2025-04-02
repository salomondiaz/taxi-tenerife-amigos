
import React, { useRef, useEffect, useState } from 'react';
import { MapProps, MapCoordinates, MapSelectionMode } from './types';
import { useGoogleMapInitialization } from './hooks/useGoogleMapInitialization';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import { MapPin, X, Home } from 'lucide-react';
import MapSelectionControl from './controls/MapSelectionControl';
import { reverseGeocode, geocodeAddress } from './services/GeocodingService';
import { toast } from '@/hooks/use-toast';

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
  homeLocation: initialHomeLocation,
  showSelectMarkers = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { saveHomeLocation: storageUpdateHome, loadHomeLocation } = useHomeLocationStorage();
  const homeLocationFromStorage = loadHomeLocation();
  
  const homeLocation = initialHomeLocation || homeLocationFromStorage;

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
    homeLocation,
    showSelectMarkers
  });

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

  useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  // Añadimos un efecto para configurar el listener de clics en el mapa
  useEffect(() => {
    if (mapReady && mapRef.current && allowMapSelection) {
      const map = mapRef.current;
      
      // Función que maneja el clic en el mapa
      const handleClick = (e: google.maps.MapMouseEvent) => {
        if (selectionMode === 'none') return;
        
        const lat = e.latLng!.lat();
        const lng = e.latLng!.lng();
        
        console.log(`Map clicked at: ${lat}, ${lng} in mode: ${selectionMode}`);
        
        // Usar geocodificación inversa para obtener la dirección
        reverseGeocode(lat, lng, (address) => {
          const coords: MapCoordinates = {
            lat,
            lng,
            address: address || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`
          };
          
          if (selectionMode === 'origin' && onOriginChange) {
            onOriginChange(coords);
            toast({
              title: "Origen seleccionado",
              description: coords.address
            });
            
            // Cambiar automáticamente al modo de selección de destino
            if (allowMapSelection) {
              setSelectionMode('destination');
            }
          } 
          else if (selectionMode === 'destination' && onDestinationChange) {
            onDestinationChange(coords);
            toast({
              title: "Destino seleccionado",
              description: coords.address
            });
            
            // Volver al modo sin selección
            setSelectionMode('none');
          }
        });
      };
      
      // Añadir el listener de clics al mapa
      map.addListener('click', handleClick);
      
      // Limpiar el listener cuando se desmonta el componente
      return () => {
        google.maps.event.clearListeners(map, 'click');
      };
    }
  }, [mapReady, mapRef, selectionMode, onOriginChange, onDestinationChange, allowMapSelection, setSelectionMode]);

  useEffect(() => {
    if (mapReady) {
      updateMarkers();
    }
  }, [mapReady, origin, destination, homeLocation, updateMarkers]);

  const handleSaveHomeLocation = () => {
    if (origin) {
      saveHomeLocation();
      storageUpdateHome(origin);
      
      toast({
        title: "Casa guardada",
        description: "Se ha guardado tu casa correctamente"
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {allowMapSelection && (
        <MapSelectionControl
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          onUseCurrentLocation={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  reverseGeocode(latitude, longitude, (address) => {
                    const coords = {
                      lat: latitude,
                      lng: longitude,
                      address: address || `Mi ubicación (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
                    };
                    if (onOriginChange) {
                      onOriginChange(coords);
                    }
                  });
                },
                (error) => {
                  console.error("Error getting location:", error);
                  toast({
                    title: "Error de ubicación",
                    description: "No se pudo obtener tu ubicación actual",
                    variant: "destructive"
                  });
                }
              );
            }
          }}
          onSearchLocation={(query, type) => {
            geocodeAddress(query, (coords) => {
              if (!coords) {
                toast({
                  title: "No se encontró la ubicación",
                  description: "Intenta con una dirección más específica",
                  variant: "destructive"
                });
                return;
              }
              
              if (type === 'origin' && onOriginChange) {
                onOriginChange(coords);
              } else if (type === 'destination' && onDestinationChange) {
                onDestinationChange(coords);
              }
            });
          }}
        />
      )}
      
      {allowMapSelection && selectionMode && selectionMode !== 'none' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2">
          {selectionMode === 'origin' ? (
            <>
              <MapPin className="text-blue-500" size={18} />
              <span className="text-sm font-medium">Selecciona el origen</span>
              <X 
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" 
                size={16} 
                onClick={() => setSelectionMode('none')}
              />
            </>
          ) : (
            <>
              <MapPin className="text-red-500" size={18} />
              <span className="text-sm font-medium">Selecciona el destino</span>
              <X 
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" 
                size={16}
                onClick={() => setSelectionMode('none')}
              />
            </>
          )}
        </div>
      )}
      
      {showSelectMarkers && selectionMode !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin 
            size={48} 
            className={`${selectionMode === 'origin' ? 'text-blue-500' : 'text-red-500'} animate-bounce shadow-lg`} 
            strokeWidth={1.5}
          />
        </div>
      )}
      
      {allowHomeEditing && (
        <div className="absolute top-20 right-4 z-10 bg-white p-3 rounded-lg shadow-md">
          <button
            onClick={handleSaveHomeLocation}
            className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <Home className="mr-2" size={16} />
            Guardar como Casa
          </button>
        </div>
      )}
      
      <HomeDialog />
    </div>
  );
};

export default GoogleMapDisplay;
