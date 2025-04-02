
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

  // Función para crear SVG para marcadores personalizados
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

  // Función para crear marcadores
  const createMarkers = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("Creando marcadores...");
    
    // Crear marcador de origen si no existe
    if (!originMarkerRef.current) {
      originMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowMapSelection,
        visible: false,
        icon: createMarkerSVG('#1a73e8', 'pin'),
        zIndex: 1
      });
      
      // Si es arrastrable, configurar eventos de arrastre
      if (allowMapSelection && onOriginChange) {
        originMarkerRef.current.addListener('dragend', () => {
          const position = originMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            // Usar geocodificación inversa para obtener la dirección
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
    
    // Crear marcador de destino si no existe
    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowMapSelection,
        visible: false,
        icon: createMarkerSVG('#d81b60', 'destination'),
        zIndex: 1
      });
      
      // Si es arrastrable, configurar eventos de arrastre
      if (allowMapSelection && onDestinationChange) {
        destinationMarkerRef.current.addListener('dragend', () => {
          const position = destinationMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            // Usar geocodificación inversa para obtener la dirección
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
    
    // Crear marcador de casa si no existe
    if (!homeMarkerRef.current) {
      homeMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        draggable: allowHomeEditing,
        visible: false,
        icon: createMarkerSVG('#4caf50', 'home'),
        zIndex: 2
      });
      
      // Si es editable, configurar eventos de arrastre y clic
      if (allowHomeEditing) {
        homeMarkerRef.current.addListener('dragend', () => {
          const position = homeMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            // Usar geocodificación inversa para obtener la dirección
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

  // Actualizar posición y visibilidad de los marcadores
  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("Actualizando marcadores con:", { origin, destination });
    
    // Si los marcadores no se han creado aún, crearlos
    if (!markersCreated) {
      createMarkers();
    }
    
    // Actualizar marcador de origen
    if (originMarkerRef.current) {
      if (origin) {
        originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
        originMarkerRef.current.setVisible(true);
        
        // Añadir popup si no está en modo selección
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
    
    // Actualizar marcador de destino
    if (destinationMarkerRef.current) {
      if (destination) {
        destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
        destinationMarkerRef.current.setVisible(true);
        
        // Añadir popup si no está en modo selección
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
    
    // Actualizar marcador de casa
    if (homeMarkerRef.current && homeLocation) {
      const shouldShowHomeMarker = alwaysShowHomeMarker || showHomeMarker || allowHomeEditing;
      
      if (shouldShowHomeMarker) {
        homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
        homeMarkerRef.current.setVisible(true);
        
        // Añadir popup
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="color: #4caf50; font-weight: bold;">Mi Casa: ${homeLocation.address || 'Ubicación guardada'}</div>`
        });
        
        homeMarkerRef.current.addListener('click', () => {
          infoWindow.open(mapRef.current, homeMarkerRef.current);
        });
      } else {
        homeMarkerRef.current.setVisible(false);
      }
    }
    
    // Ajustar el zoom y centrado del mapa si hay origen y destino
    if (origin && destination && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      mapRef.current.fitBounds(bounds, 50); // 50 píxeles de padding
    } 
    // O sólo origen
    else if (origin && mapRef.current) {
      mapRef.current.setCenter({ lat: origin.lat, lng: origin.lng });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(14);
    } 
    // O sólo destino
    else if (destination && mapRef.current) {
      mapRef.current.setCenter({ lat: destination.lat, lng: destination.lng });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(14);
    }
    // O sólo casa
    else if (homeLocation && showHomeMarker && mapRef.current) {
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

  // Eliminar marcadores al desmontar
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

  // Función para guardar la ubicación de casa
  const saveHomeLocation = useCallback(() => {
    if (!origin) {
      toast({
        title: "No hay origen seleccionado",
        description: "Primero selecciona una ubicación",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [origin]);

  // Inicializar marcadores cuando el mapa está listo
  useEffect(() => {
    if (mapRef.current && !markersCreated) {
      createMarkers();
    }
  }, [mapRef.current, markersCreated, createMarkers]);

  // Actualizar marcadores cuando cambian las coordenadas
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [mapRef.current, origin, destination, homeLocation, updateMarkers]);

  // Exportar funciones y estado
  return {
    updateMarkers,
    saveHomeLocation
  };
}
