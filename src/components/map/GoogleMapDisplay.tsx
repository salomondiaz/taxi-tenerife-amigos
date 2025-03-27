
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapProps } from './types';
import { toast } from '@/hooks/use-toast';

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
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | 'none'>(allowMapSelection ? 'origin' : 'none');
  const homeLocationKey = 'user_home_location';
  
  useEffect(() => {
    if (!mapContainerRef.current || !apiKey) return;

    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Error loading Google Maps API');
        toast({
          title: 'Error',
          description: 'No se pudo cargar Google Maps',
          variant: 'destructive'
        });
      };
      
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [apiKey]);

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    const tenerife = { lat: 28.2916, lng: -16.6291 };
    const initialCenter = origin ? { lat: origin.lat, lng: origin.lng } : tenerife;
    
    const mapOptions: google.maps.MapOptions = {
      center: initialCenter,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: interactive ? 'greedy' : 'none',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
    
    mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
    
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1E88E5',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });
    
    directionsRendererRef.current.setMap(mapRef.current);
    
    if (allowMapSelection) {
      mapRef.current.addListener('click', handleMapClick);
      
      const controlDiv = document.createElement('div');
      createSelectionControls(controlDiv);
      
      mapRef.current.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }
    
    if (allowHomeEditing) {
      const homeButtonDiv = document.createElement('div');
      createHomeButton(homeButtonDiv);
      
      mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeButtonDiv);
    }

    updateMarkers();
  }, []);

  const updateMarkers = () => {
    if (!mapRef.current) return;
    
    if (origin) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
      } else {
        originMarkerRef.current = new google.maps.Marker({
          position: { lat: origin.lat, lng: origin.lng },
          map: mapRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          },
          draggable: allowMapSelection,
          title: 'Origen'
        });
        
        if (allowMapSelection && onOriginChange) {
          originMarkerRef.current.addListener('dragend', () => {
            const position = originMarkerRef.current?.getPosition();
            if (position) {
              reverseGeocode(position.lat(), position.lng(), (address) => {
                onOriginChange({
                  lat: position.lat(),
                  lng: position.lng(),
                  address: address
                });
              });
            }
          });
        }
      }
    } else if (originMarkerRef.current) {
      originMarkerRef.current.setMap(null);
      originMarkerRef.current = null;
    }

    if (destination) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
      } else {
        destinationMarkerRef.current = new google.maps.Marker({
          position: { lat: destination.lat, lng: destination.lng },
          map: mapRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          },
          draggable: allowMapSelection,
          title: 'Destino'
        });
        
        if (allowMapSelection && onDestinationChange) {
          destinationMarkerRef.current.addListener('dragend', () => {
            const position = destinationMarkerRef.current?.getPosition();
            if (position) {
              reverseGeocode(position.lat(), position.lng(), (address) => {
                onDestinationChange({
                  lat: position.lat(),
                  lng: position.lng(),
                  address: address
                });
              });
            }
          });
        }
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setMap(null);
      destinationMarkerRef.current = null;
    }
    
    if (allowHomeEditing) {
      try {
        const homeLocationJSON = localStorage.getItem(homeLocationKey);
        if (homeLocationJSON) {
          const homeLocation = JSON.parse(homeLocationJSON);
          
          if (homeMarkerRef.current) {
            homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
          } else {
            homeMarkerRef.current = new google.maps.Marker({
              position: { lat: homeLocation.lat, lng: homeLocation.lng },
              map: mapRef.current,
              icon: {
                url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
                scaledSize: new google.maps.Size(40, 40)
              },
              title: 'Mi Casa'
            });
          }
        }
      } catch (error) {
        console.error('Error showing home marker:', error);
      }
    }
  };

  const calculateAndDisplayRoute = () => {
    if (!mapRef.current || !origin || !destination || !directionsRendererRef.current) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRendererRef.current?.setDirections(response);
        } else {
          console.error('Error calculating route:', status);
          toast({
            title: 'Error',
            description: 'No se pudo calcular la ruta',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!mapRef.current || selectionMode === 'none' || !event.latLng) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    reverseGeocode(lat, lng, (address) => {
      const coordinates = { lat, lng, address };
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        setSelectionMode('destination');
      } else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        setSelectionMode('none');
      }
    });
  };

  const reverseGeocode = (lat: number, lng: number, callback: (address: string) => void) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error('Error reverse geocoding:', status);
        callback(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    });
  };

  const createSelectionControls = (controlDiv: HTMLDivElement) => {
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    controlDiv.style.textAlign = 'center';
    
    const originButton = document.createElement('button');
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#1E88E5' : 'white';
    originButton.style.color = selectionMode === 'origin' ? 'white' : 'black';
    originButton.style.border = 'none';
    originButton.style.borderRadius = '4px';
    originButton.style.padding = '8px 12px';
    originButton.style.margin = '0 5px';
    originButton.style.fontSize = '14px';
    originButton.style.cursor = 'pointer';
    originButton.textContent = 'Seleccionar Origen';
    originButton.onclick = () => {
      setSelectionMode('origin');
      originButton.style.backgroundColor = '#1E88E5';
      originButton.style.color = 'white';
      destButton.style.backgroundColor = 'white';
      destButton.style.color = 'black';
    };
    
    const destButton = document.createElement('button');
    destButton.style.backgroundColor = selectionMode === 'destination' ? '#1E88E5' : 'white';
    destButton.style.color = selectionMode === 'destination' ? 'white' : 'black';
    destButton.style.border = 'none';
    destButton.style.borderRadius = '4px';
    destButton.style.padding = '8px 12px';
    destButton.style.margin = '0 5px';
    destButton.style.fontSize = '14px';
    destButton.style.cursor = 'pointer';
    destButton.textContent = 'Seleccionar Destino';
    destButton.onclick = () => {
      setSelectionMode('destination');
      destButton.style.backgroundColor = '#1E88E5';
      destButton.style.color = 'white';
      originButton.style.backgroundColor = 'white';
      originButton.style.color = 'black';
    };
    
    controlDiv.appendChild(originButton);
    controlDiv.appendChild(destButton);
  };

  const createHomeButton = (controlDiv: HTMLDivElement) => {
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    
    const button = document.createElement('button');
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '8px 12px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.innerHTML = '<span style="font-size: 16px;">🏠</span> Guardar Casa';
    
    button.onclick = () => {
      if (origin) {
        try {
          localStorage.setItem(homeLocationKey, JSON.stringify(origin));
          toast({
            title: 'Casa guardada',
            description: 'Tu ubicación de casa ha sido guardada',
          });
          
          updateMarkers();
        } catch (error) {
          console.error('Error saving home location:', error);
          toast({
            title: 'Error',
            description: 'No se pudo guardar la ubicación de tu casa',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Sin ubicación',
          description: 'Selecciona primero una ubicación',
          variant: 'destructive'
        });
      }
    };
    
    controlDiv.appendChild(button);
  };

  useEffect(() => {
    updateMarkers();
  }, [origin, destination, mapRef.current]);

  useEffect(() => {
    if (!mapRef.current || !origin || !destination) return;
    
    if (showRoute) {
      calculateAndDisplayRoute();
    }
    
    const bounds = new google.maps.LatLngBounds();
    if (origin) bounds.extend({ lat: origin.lat, lng: origin.lng });
    if (destination) bounds.extend({ lat: destination.lat, lng: destination.lng });
    
    // Fix: Change padding from object to number
    mapRef.current.fitBounds(bounds, { 
      padding: 100  // Changed from object to number
    });
  }, [origin, destination, showRoute]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${className}`}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

export default GoogleMapDisplay;
