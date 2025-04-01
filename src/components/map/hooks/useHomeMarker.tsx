
import { useRef, useState, useEffect, useCallback } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';
import { getHomeMarkerSvg, createMarkerIcon } from './useMapMarkerIcons';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

interface UseHomeMarkerProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  allowHomeEditing?: boolean;
  alwaysShowHomeMarker?: boolean;
  showHomeMarker?: boolean;
  homeLocation?: MapCoordinates | null;
}

export function useHomeMarker({
  mapRef,
  origin,
  allowHomeEditing = false,
  alwaysShowHomeMarker = false,
  showHomeMarker = false,
  homeLocation: externalHomeLocation
}: UseHomeMarkerProps) {
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);
  const { saveHomeLocation: storeHomeLocation, updateHomeLocation } = useHomeLocationStorage();

  // Load home location from storage or props
  useEffect(() => {
    // Si tenemos homeLocation pasada como prop, usarla
    if (externalHomeLocation) {
      setHomeLocation(externalHomeLocation);
    }
  }, [externalHomeLocation]);

  // Function to update home marker on the map
  const updateHomeMarker = useCallback(() => {
    if (!mapRef.current) return;
    
    try {
      // If we don't have a home location yet, nothing to show
      if (!homeLocation && !externalHomeLocation) return;
      
      const currentHomeLocation = homeLocation || externalHomeLocation;
      if (!currentHomeLocation) return;
      
      // Check if origin location is the home location
      const isOriginHome = origin && 
        currentHomeLocation && 
        ((Math.abs(origin.lat - currentHomeLocation.lat) < 0.0001 && 
          Math.abs(origin.lng - currentHomeLocation.lng) < 0.0001) ||
         (origin?.address && origin.address.toLowerCase().includes("mi casa")));
      
      // Show home marker if...
      // 1. We're at home location
      // 2. We have allowHomeEditing enabled
      // 3. We have alwaysShowHomeMarker enabled
      // 4. We have showHomeMarker explicitly set to true
      if (isOriginHome || allowHomeEditing || alwaysShowHomeMarker || showHomeMarker) {
        if (homeMarkerRef.current) {
          homeMarkerRef.current.setPosition({ lat: currentHomeLocation.lat, lng: currentHomeLocation.lng });
          homeMarkerRef.current.setMap(mapRef.current); // Make sure it's visible
          
          // Si estamos en modo edición, hacer el marcador arrastrable
          homeMarkerRef.current.setDraggable(allowHomeEditing);
          
          // Crear tooltip para edición si corresponde
          if (allowHomeEditing) {
            // Info window con instrucciones de edición
            const infowindow = new google.maps.InfoWindow({
              content: `
                <div style="text-align: center;">
                  <strong>Editar ubicación de casa</strong>
                  <p>Arrastra este marcador para ajustar la ubicación</p>
                  <button id="save-home-location" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Guardar ubicación
                  </button>
                </div>
              `
            });
            
            // Abrir info window automáticamente si estamos en modo edición
            infowindow.open(mapRef.current, homeMarkerRef.current);
            
            // Configurar listeners para botón de guardar
            google.maps.event.addListener(infowindow, 'domready', () => {
              document.getElementById('save-home-location')?.addEventListener('click', () => {
                if (homeMarkerRef.current) {
                  const position = homeMarkerRef.current.getPosition();
                  if (position) {
                    const newHome: MapCoordinates = {
                      lat: position.lat(),
                      lng: position.lng(),
                      address: homeLocation?.address || "Mi Casa"
                    };
                    
                    // Guardar nueva ubicación
                    updateHomeLocation(newHome);
                    setHomeLocation(newHome);
                    
                    toast({
                      title: "Casa actualizada",
                      description: "La ubicación de tu casa ha sido actualizada"
                    });
                    
                    infowindow.close();
                  }
                }
              });
            });
          }
        } else {
          const homeIcon = createMarkerIcon(getHomeMarkerSvg());
          
          homeMarkerRef.current = new google.maps.Marker({
            position: { lat: currentHomeLocation.lat, lng: currentHomeLocation.lng },
            map: mapRef.current,
            icon: homeIcon,
            title: 'Mi Casa',
            zIndex: 1000, // Make sure home marker is on top
            draggable: allowHomeEditing
          });
          
          // Add info window
          const infowindow = new google.maps.InfoWindow({
            content: allowHomeEditing 
              ? `
                <div style="text-align: center;">
                  <strong>Mi Casa</strong>
                  ${currentHomeLocation.address ? `<div>${currentHomeLocation.address}</div>` : ''}
                  <p>Arrastra este marcador para ajustar la ubicación</p>
                  <button id="save-home-location" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Guardar ubicación
                  </button>
                </div>
              `
              : `<div><strong>Mi Casa</strong>${currentHomeLocation.address ? `<div>${currentHomeLocation.address}</div>` : ''}</div>`
          });
          
          // Add click listener to open info window
          homeMarkerRef.current.addListener('click', () => {
            infowindow.open(mapRef.current, homeMarkerRef.current);
            
            // Add event listener for save button if in edit mode
            if (allowHomeEditing) {
              google.maps.event.addListener(infowindow, 'domready', () => {
                document.getElementById('save-home-location')?.addEventListener('click', () => {
                  if (homeMarkerRef.current) {
                    const position = homeMarkerRef.current.getPosition();
                    if (position) {
                      const newHome: MapCoordinates = {
                        lat: position.lat(),
                        lng: position.lng(),
                        address: homeLocation?.address || "Mi Casa"
                      };
                      
                      // Guardar nueva ubicación
                      updateHomeLocation(newHome);
                      setHomeLocation(newHome);
                      
                      toast({
                        title: "Casa actualizada",
                        description: "La ubicación de tu casa ha sido actualizada"
                      });
                      
                      infowindow.close();
                    }
                  }
                });
              });
            }
          });
          
          // Add dragend listener if editable
          if (allowHomeEditing) {
            homeMarkerRef.current.addListener('dragend', () => {
              if (homeMarkerRef.current) {
                const position = homeMarkerRef.current.getPosition();
                if (position) {
                  // Actualizar la dirección después de arrastrar
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode({ location: position }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                      const address = results[0].formatted_address;
                      toast({
                        title: "Nueva ubicación seleccionada",
                        description: `Haz clic en guardar para establecer: ${address}`
                      });
                    }
                  });
                }
              }
            });
            
            // Abrir info window automáticamente si estamos en modo edición
            infowindow.open(mapRef.current, homeMarkerRef.current);
          }
        }
      } else if (homeMarkerRef.current && !alwaysShowHomeMarker && !showHomeMarker) {
        homeMarkerRef.current.setMap(null);
        homeMarkerRef.current = null;
      }
    } catch (error) {
      console.error('Error showing home marker:', error);
    }
  }, [mapRef, origin, homeLocation, externalHomeLocation, allowHomeEditing, alwaysShowHomeMarker, showHomeMarker, updateHomeLocation]);

  // Function to save home location
  const saveHomeLocation = useCallback(() => {
    if (origin) {
      try {
        storeHomeLocation(origin);
        setHomeLocation(origin);
        
        toast({
          title: 'Casa guardada',
          description: 'Tu ubicación de casa ha sido guardada',
        });
        
        updateHomeMarker();
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
  }, [origin, updateHomeMarker, storeHomeLocation]);

  // Update home marker when relevant props change
  useEffect(() => {
    updateHomeMarker();
    return () => {
      if (homeMarkerRef.current) {
        homeMarkerRef.current.setMap(null);
        homeMarkerRef.current = null;
      }
    };
  }, [updateHomeMarker]);

  return {
    homeMarkerRef,
    homeLocation: homeLocation || externalHomeLocation,
    updateHomeMarker,
    saveHomeLocation
  };
}
