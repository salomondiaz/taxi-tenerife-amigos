import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { MapProps } from './types';
import { useGoogleMapKey } from './hooks/useGoogleMapKey';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';
import { Loader2, Home, MapPin, Navigation } from 'lucide-react';

const TENERIFE_CENTER = {
  lat: 28.2916,
  lng: -16.6291
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const googleMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places', 'geometry'];

const GoogleMapDisplay: React.FC<MapProps> = ({
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const { apiKey, setApiKey, isValidKey } = useGoogleMapKey();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectionMode, setSelectionMode] = useState<'none' | 'origin' | 'destination'>('none');
  const [selectedMarker, setSelectedMarker] = useState<'origin' | 'destination' | 'home' | null>(null);
  const { favoriteLocations, saveFavoriteLocation } = useFavoriteLocations();
  const homeLocation = favoriteLocations.find(loc => loc.type === 'home');
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || 'AIzaSyCbfe8aqbD8YBmCZzNA1wkJrtLFeznyMLI',
    libraries: libraries
  });

  useEffect(() => {
    if (isLoaded && origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error getting directions: ${status}`);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, origin, destination]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (origin && destination) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      mapRef.current.fitBounds(bounds, 50);
    } else if (origin) {
      mapRef.current.setCenter({ lat: origin.lat, lng: origin.lng });
      mapRef.current.setZoom(15);
    } else if (destination) {
      mapRef.current.setCenter({ lat: destination.lat, lng: destination.lng });
      mapRef.current.setZoom(15);
    } else if (homeLocation) {
      mapRef.current.setCenter({ 
        lat: homeLocation.coordinates.lat, 
        lng: homeLocation.coordinates.lng 
      });
      mapRef.current.setZoom(15);
    } else {
      mapRef.current.setCenter(TENERIFE_CENTER);
      mapRef.current.setZoom(10);
    }
  }, [isLoaded, origin, destination, homeLocation, mapRef.current]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!allowMapSelection || selectionMode === 'none' || !e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const coords = {
          lat,
          lng,
          address: results[0].formatted_address
        };
        
        if (selectionMode === 'origin' && onOriginChange) {
          onOriginChange(coords);
          toast({
            title: "Origen seleccionado",
            description: coords.address || "Ubicación seleccionada como origen"
          });
        } else if (selectionMode === 'destination' && onDestinationChange) {
          onDestinationChange(coords);
          toast({
            title: "Destino seleccionado",
            description: coords.address || "Ubicación seleccionada como destino"
          });
        }
        
        setSelectionMode('none');
      } else {
        toast({
          title: "Error de geocodificación",
          description: "No se pudo obtener la dirección de esta ubicación",
          variant: "destructive"
        });
      }
    });
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent, type: 'origin' | 'destination' | 'home') => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const coords = {
          lat,
          lng,
          address: results[0].formatted_address
        };
        
        if (type === 'origin' && onOriginChange) {
          onOriginChange(coords);
        } else if (type === 'destination' && onDestinationChange) {
          onDestinationChange(coords);
        } else if (type === 'home') {
          saveFavoriteLocation({
            id: 'home',
            name: 'Mi Casa',
            coordinates: coords,
            type: 'home',
            icon: '🏠'
          });
          toast({
            title: "Casa actualizada",
            description: "La ubicación de tu casa ha sido actualizada"
          });
        }
      }
    });
  };

  const saveAsHome = (coords: {lat: number, lng: number, address?: string}) => {
    saveFavoriteLocation({
      id: 'home',
      name: 'Mi Casa',
      coordinates: coords,
      type: 'home',
      icon: '🏠'
    });
    toast({
      title: "Casa guardada",
      description: "Ubicación guardada como tu casa"
    });
  };

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={style}>
        <div className="text-center p-4">
          <p className="text-red-500 mb-3">Error al cargar Google Maps</p>
          <p className="text-sm text-gray-700 mb-4">Verifica que la clave API sea válida</p>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Ingresa la clave API de Google Maps"
            className="w-full p-2 border rounded mb-3"
          />
          <Button variant="default">
            Guardar clave API
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={style}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Cargando Google Maps...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={TENERIFE_CENTER}
        zoom={10}
        options={googleMapOptions}
        onClick={handleMapClick}
        onLoad={map => {
          mapRef.current = map;
        }}
      >
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#1E88E5',
                strokeOpacity: 0.7,
                strokeWeight: 5
              }
            }}
          />
        )}
        
        {origin && (
          <Marker
            position={{ lat: origin.lat, lng: origin.lng }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#1E88E5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
                </svg>
              `),
              anchor: new google.maps.Point(24, 48),
            }}
            draggable={!!onOriginChange}
            onClick={() => setSelectedMarker('origin')}
            onDragEnd={(e) => handleMarkerDragEnd(e, 'origin')}
          />
        )}
        
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#D32F2F" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#D32F2F"/>
                </svg>
              `),
              anchor: new google.maps.Point(24, 48),
            }}
            draggable={!!onDestinationChange}
            onClick={() => setSelectedMarker('destination')}
            onDragEnd={(e) => handleMarkerDragEnd(e, 'destination')}
          />
        )}
        
        {homeLocation && (
          <Marker
            position={{ 
              lat: homeLocation.coordinates.lat, 
              lng: homeLocation.coordinates.lng 
            }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              `),
              anchor: new google.maps.Point(24, 48),
            }}
            draggable={true}
            onClick={() => setSelectedMarker('home')}
            onDragEnd={(e) => handleMarkerDragEnd(e, 'home')}
          />
        )}
        
        {showDriverPosition && driverPosition && (
          <Marker
            position={{ lat: driverPosition.lat, lng: driverPosition.lng }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#000000" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#FFC107"/>
                  <path d="M16 6l-8 6 8 6" stroke="#000000" fill="none"/>
                </svg>
              `),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        )}
        
        {selectedMarker === 'origin' && origin && (
          <InfoWindow
            position={{ lat: origin.lat, lng: origin.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold mb-1">Punto de origen</h3>
              <p className="text-sm">{origin.address || "Ubicación seleccionada"}</p>
              {!homeLocation && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => saveAsHome(origin)}
                >
                  <Home className="mr-1 h-4 w-4" />
                  Guardar como casa
                </Button>
              )}
            </div>
          </InfoWindow>
        )}
        
        {selectedMarker === 'destination' && destination && (
          <InfoWindow
            position={{ lat: destination.lat, lng: destination.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold mb-1">Punto de destino</h3>
              <p className="text-sm">{destination.address || "Ubicación seleccionada"}</p>
            </div>
          </InfoWindow>
        )}
        
        {selectedMarker === 'home' && homeLocation && (
          <InfoWindow
            position={{ 
              lat: homeLocation.coordinates.lat, 
              lng: homeLocation.coordinates.lng 
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold mb-1">Mi Casa</h3>
              <p className="text-sm">{homeLocation.coordinates.address || "Mi hogar"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {allowMapSelection && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md p-2 flex gap-2">
          <Button
            variant={selectionMode === 'origin' ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectionMode('origin')}
            className="gap-1"
          >
            <MapPin size={16} className="text-blue-500" />
            <span>Origen</span>
          </Button>
          <Button
            variant={selectionMode === 'destination' ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectionMode('destination')}
            className="gap-1"
          >
            <MapPin size={16} className="text-red-500" />
            <span>Destino</span>
          </Button>
        </div>
      )}
      
      {selectionMode !== 'none' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white py-2 px-4 rounded-full z-10">
          <p className="text-sm">
            {selectionMode === 'origin' 
              ? 'Haz clic en el mapa para seleccionar el origen' 
              : 'Haz clic en el mapa para seleccionar el destino'}
          </p>
        </div>
      )}
      
      <Button
        variant="default"
        size="icon"
        className="absolute bottom-4 right-4 z-10 rounded-full h-10 w-10 bg-white text-gray-800 hover:bg-gray-100 shadow-md"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: coords }, (results, status) => {
                  if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const locationData = {
                      ...coords,
                      address: results[0].formatted_address
                    };
                    
                    if (onOriginChange) {
                      onOriginChange(locationData);
                      toast({
                        title: "Ubicación actual como origen",
                        description: locationData.address || "Se ha establecido tu ubicación actual como punto de origen"
                      });
                    }
                  }
                });
              },
              (error) => {
                toast({
                  title: "Error de ubicación",
                  description: "No se pudo obtener tu ubicación actual: " + error.message,
                  variant: "destructive"
                });
              }
            );
          } else {
            toast({
              title: "Geolocalización no soportada",
              description: "Tu navegador no soporta la geolocalización",
              variant: "destructive"
            });
          }
        }}
      >
        <Navigation size={16} />
      </Button>
    </div>
  );
};

export default GoogleMapDisplay;
