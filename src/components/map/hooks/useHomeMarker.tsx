
import { useRef, useState, useEffect, useCallback } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';
import { getHomeMarkerSvg, createMarkerIcon } from './useMapMarkerIcons';

interface UseHomeMarkerProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  allowHomeEditing?: boolean;
}

export function useHomeMarker({
  mapRef,
  origin,
  allowHomeEditing = false
}: UseHomeMarkerProps) {
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const homeLocationKey = 'user_home_location';
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);

  // Load home location from storage
  useEffect(() => {
    try {
      const homeLocationJSON = localStorage.getItem(homeLocationKey);
      if (homeLocationJSON) {
        const parsedHome = JSON.parse(homeLocationJSON);
        setHomeLocation(parsedHome);
      }
    } catch (error) {
      console.error('Error loading home location:', error);
    }
  }, []);

  // Function to update home marker on the map
  const updateHomeMarker = useCallback(() => {
    if (!mapRef.current || !homeLocation) return;
    
    try {
      // Check if origin location is the home location
      const isOriginHome = origin && 
        homeLocation && 
        ((Math.abs(origin.lat - homeLocation.lat) < 0.0001 && 
          Math.abs(origin.lng - homeLocation.lng) < 0.0001) ||
         (origin.address && origin.address.toLowerCase().includes("mi casa")));
      
      // Show home marker if we're at home location or if we have allowHomeEditing enabled
      if (isOriginHome || allowHomeEditing) {
        if (homeMarkerRef.current) {
          homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
        } else {
          const homeIcon = createMarkerIcon(getHomeMarkerSvg());
          
          homeMarkerRef.current = new google.maps.Marker({
            position: { lat: homeLocation.lat, lng: homeLocation.lng },
            map: mapRef.current,
            icon: homeIcon,
            title: 'Mi Casa'
          });
          
          // Add info window
          const infowindow = new google.maps.InfoWindow({
            content: `<div><strong>Mi Casa</strong></div>${homeLocation.address ? `<div>${homeLocation.address}</div>` : ''}`
          });
          
          homeMarkerRef.current.addListener('click', () => {
            infowindow.open(mapRef.current, homeMarkerRef.current);
          });
        }
      } else if (homeMarkerRef.current) {
        homeMarkerRef.current.setMap(null);
        homeMarkerRef.current = null;
      }
    } catch (error) {
      console.error('Error showing home marker:', error);
    }
  }, [mapRef, origin, homeLocation, allowHomeEditing]);

  // Function to save home location
  const saveHomeLocation = useCallback(() => {
    if (origin) {
      try {
        localStorage.setItem(homeLocationKey, JSON.stringify(origin));
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
  }, [origin, updateHomeMarker]);

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
    homeLocation,
    updateHomeMarker,
    saveHomeLocation
  };
}
