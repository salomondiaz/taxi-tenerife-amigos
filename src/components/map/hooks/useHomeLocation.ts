
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import { useHomeMapInteraction } from './useHomeMapInteraction';
import { toast } from '@/hooks/use-toast';

/**
 * Main hook for managing home location in the map
 */
export function useHomeLocation(
  map: mapboxgl.Map | null, 
  origin?: MapCoordinates, 
  onOriginChange?: (coordinates: MapCoordinates) => void
) {
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);
  const [showHomeMarker, setShowHomeMarker] = useState<boolean>(false);
  const [isHomeLocation, setIsHomeLocation] = useState<boolean>(false);
  
  // Use the separated storage and interaction hooks
  const { loadHomeLocation, saveHomeLocation: storeHomeLocation, updateHomeLocation } = useHomeLocationStorage();
  const { useHomeAsOrigin, isHomeLocation: checkIsHomeLocation } = useHomeMapInteraction(map, homeLocation, onOriginChange);

  // Load home location on mount
  useEffect(() => {
    const storedLocation = loadHomeLocation();
    if (storedLocation) {
      setHomeLocation(storedLocation);
      setShowHomeMarker(true);
    }
  }, [loadHomeLocation]);

  // Check if current origin is home location
  useEffect(() => {
    if (origin && homeLocation) {
      const isHome = checkIsHomeLocation(origin);
      setIsHomeLocation(isHome);
      console.log("Is home location:", isHome);
    } else {
      setIsHomeLocation(false);
    }
  }, [origin, homeLocation, checkIsHomeLocation]);

  // Save home location
  const saveHomeLocation = () => {
    if (!origin) {
      console.error("No origin set to save as home");
      toast({
        title: "No hay ubicación para guardar",
        description: "Selecciona primero una ubicación de origen",
        variant: "destructive"
      });
      return;
    }
    
    const success = storeHomeLocation(origin);
    if (success) {
      setHomeLocation(origin);
      setShowHomeMarker(true);
      toast({
        title: "Casa guardada",
        description: "Tu ubicación actual ha sido guardada como tu casa",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar la ubicación como tu casa",
        variant: "destructive"
      });
    }
  };

  return {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin,
    updateHomeLocation
  };
}
