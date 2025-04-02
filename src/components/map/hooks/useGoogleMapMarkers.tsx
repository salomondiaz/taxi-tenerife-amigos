import { useCallback, useEffect, useRef, useState } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapMarkersProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates | null;
  destination?: MapCoordinates | null;
  homeLocation?: MapCoordinates | null;
  allowHomeEditing?: boolean;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  alwaysShowHomeMarker?: boolean;
  showHomeMarker?: boolean;
}

export function useGoogleMapMarkers({
  mapRef,
  origin,
  destination,
  homeLocation,
  allowHomeEditing = false,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  alwaysShowHomeMarker = false,
  showHomeMarker = false
}: UseGoogleMapMarkersProps) {
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const [markersCreated, setMarkersCreated] = useState(false);

  const createMarkerSVG = useCallback((color: string, icon: 'pin' | 'home' | 'destination') => {
    const pinSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `;
    
    const homeSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `;
    
    const destinationSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    `;
    
    let svg = pinSVG;
    if (icon === 'home') svg = homeSVG;
    if (icon === 'destination') svg = destinationSVG;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, icon === 'pin' ? 32 : 16)
    };
  }, []);

  const createMarkers = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("Creando marcadores...");
    
    if (!originMarkerRef.current) {
      originMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowMapSelection,
        visible: false,
        icon: createMarkerSVG('#1a73e8', 'pin'),
        zIndex: 1
      });
      
      if (allowMapSelection && onOriginChange) {
        originMarkerRef.current.addListener('dragend', () => {
          const position = originMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                onOriginChange({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
              } else {
                onOriginChange({ lat, lng, address: `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})` });
              }
            });
          }
        });
      }
    }
    
    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowMapSelection,
        visible: false,
        icon: createMarkerSVG('#d81b60', 'destination'),
        zIndex: 1
      });
      
      if (allowMapSelection && onDestinationChange) {
        destinationMarkerRef.current.addListener('dragend', () => {
          const position = destinationMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                onDestinationChange({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
              } else {
                onDestinationChange({ lat, lng, address: `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})` });
              }
            });
          }
        });
      }
    }
    
    if (!homeMarkerRef.current) {
      homeMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowHomeEditing,
        visible: false,
        icon: createMarkerSVG('#4caf50', 'home'),
        zIndex: 2
      });
      
      if (allowHomeEditing) {
        homeMarkerRef.current.addListener('dragend', () => {
          const position = homeMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                if (onOriginChange) {
                  onOriginChange({
                    lat,
                    lng,
                    address: results[0].formatted_address
                  });
                }
              } else {
                if (onOriginChange) {
                  onOriginChange({ lat, lng, address: `Mi Casa (${lat.toFixed(6)}, ${lng.toFixed(6)})` });
                }
              }
            });
          }
        });
        
        homeMarkerRef.current.addListener('click', () => {
          toast({
            title: "Marcador de Casa",
            description: "Puedes arrastrar este marcador para ajustar la ubicación de tu casa",
          });
        });
      }
    }
    
    setMarkersCreated(true);
  }, [mapRef, allowMapSelection, allowHomeEditing, onOriginChange, onDestinationChange, createMarkerSVG]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("Actualizando marcadores con:", { origin, destination, homeLocation });
    
    if (!markersCreated) {
      createMarkers();
    }
    
    if (originMarkerRef.current) {
      if (origin) {
        originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
        originMarkerRef.current.setVisible(true);
        
        if (!allowMapSelection) {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color: #1a73e8; font-weight: bold;">Origen: ${origin.address || 'Punto de partida'}</div>`
          });
          
          originMarkerRef.current.addListener('click', () => {
            infoWindow.open(mapRef.current, originMarkerRef.current);
          });
        }
      } else {
        originMarkerRef.current.setVisible(false);
      }
    }
    
    if (destinationMarkerRef.current) {
      if (destination) {
        destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
        destinationMarkerRef.current.setVisible(true);
        
        if (!allowMapSelection) {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="color: #d81b60; font-weight: bold;">Destino: ${destination.address || 'Punto de llegada'}</div>`
          });
          
          destinationMarkerRef.current.addListener('click', () => {
            infoWindow.open(mapRef.current, destinationMarkerRef.current);
          });
        }
      } else {
        destinationMarkerRef.current.setVisible(false);
      }
    }
    
    if (homeMarkerRef.current && homeLocation) {
      const shouldShowHomeMarker = alwaysShowHomeMarker || showHomeMarker || allowHomeEditing;
      
      console.log("Mostrando marcador de casa:", { 
        shouldShowHomeMarker, 
        alwaysShowHomeMarker, 
        showHomeMarker, 
        allowHomeEditing, 
        homeLocation 
      });
      
      if (shouldShowHomeMarker) {
        homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
        homeMarkerRef.current.setVisible(true);
        homeMarkerRef.current.setDraggable(allowHomeEditing);
        
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="color: #4caf50; font-weight: bold;">Mi Casa: ${homeLocation.address || 'Ubicación guardada'}</div>`
        });
        
        google.maps.event.clearListeners(homeMarkerRef.current, 'click');
        
        homeMarkerRef.current.addListener('click', () => {
          infoWindow.open(mapRef.current, homeMarkerRef.current);
        });
      } else {
        homeMarkerRef.current.setVisible(false);
      }
    } else if (homeLocation && !homeMarkerRef.current && mapRef.current) {
      createMarkers();
      setTimeout(() => updateMarkers(), 10);
    }
    
    if (origin && destination && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      mapRef.current.fitBounds(bounds, 50);
    } else if (origin && mapRef.current) {
      mapRef.current.setCenter({ lat: origin.lat, lng: origin.lng });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(14);
    } else if (destination && mapRef.current) {
      mapRef.current.setCenter({ lat: destination.lat, lng: destination.lng });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(14);
    } else if (homeLocation && (showHomeMarker || alwaysShowHomeMarker) && mapRef.current) {
      mapRef.current.setCenter({ lat: homeLocation.lat, lng: homeLocation.lng });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(14);
    }
  }, [
    mapRef,
    origin,
    destination,
    homeLocation,
    allowMapSelection,
    alwaysShowHomeMarker,
    showHomeMarker,
    allowHomeEditing,
    markersCreated,
    createMarkers
  ]);

  useEffect(() => {
    return () => {
      if (originMarkerRef.current) {
        originMarkerRef.current.setMap(null);
        originMarkerRef.current = null;
      }
      
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null);
        destinationMarkerRef.current = null;
      }
      
      if (homeMarkerRef.current) {
        homeMarkerRef.current.setMap(null);
        homeMarkerRef.current = null;
      }
    };
  }, []);

  const saveHomeLocation = useCallback(() => {
    if (!origin) {
      toast({
        title: "No hay origen seleccionado",
        description: "Primero selecciona una ubicación",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Casa guardada",
      description: "La ubicación actual se ha guardado como tu casa"
    });
    
    return true;
  }, [origin]);

  useEffect(() => {
    if (mapRef.current && !markersCreated) {
      createMarkers();
    }
  }, [mapRef.current, markersCreated, createMarkers]);

  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [mapRef.current, origin, destination, homeLocation, updateMarkers]);

  return {
    updateMarkers,
    saveHomeLocation
  };
}
