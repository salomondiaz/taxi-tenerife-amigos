
import { useState, useCallback, useEffect } from 'react';
import { MapCoordinates } from '@/components/map/types';
import { toast } from '@/hooks/use-toast';

const HOME_LOCATION_KEY = 'user_home_location';

export const useHomeLocationStorage = () => {
  // State to track if home location is available
  const [hasHomeLocation, setHasHomeLocation] = useState<boolean>(false);
  const [homeLocation, setHomeLocationState] = useState<MapCoordinates | null>(null);

  // Load home location on mount
  useEffect(() => {
    const location = loadHomeLocation();
    setHasHomeLocation(!!location);
    setHomeLocationState(location);
  }, []);

  // Save home location to localStorage
  const saveHomeLocation = useCallback((location: MapCoordinates) => {
    try {
      if (!location) {
        console.error('Attempted to save undefined home location');
        return false;
      }
      
      console.log('Saving home location:', location);
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(location));
      setHasHomeLocation(true);
      setHomeLocationState(location);
      
      toast({
        title: "Casa guardada",
        description: "Tu ubicación ha sido guardada como tu casa"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving home location:', error);
      
      toast({
        title: "Error",
        description: "No se pudo guardar la ubicación de casa",
        variant: "destructive"
      });
      
      return false;
    }
  }, []);

  // Load home location from localStorage
  const loadHomeLocation = useCallback((): MapCoordinates | null => {
    try {
      const storedLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (!storedLocation) return null;
      
      const parsedLocation = JSON.parse(storedLocation) as MapCoordinates;
      console.log('Loaded home location:', parsedLocation);
      return parsedLocation;
    } catch (error) {
      console.error('Error loading home location:', error);
      return null;
    }
  }, []);

  // Clear home location from localStorage
  const clearHomeLocation = useCallback(() => {
    try {
      localStorage.removeItem(HOME_LOCATION_KEY);
      setHasHomeLocation(false);
      setHomeLocationState(null);
      
      toast({
        title: "Casa eliminada",
        description: "Tu ubicación de casa ha sido eliminada"
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing home location:', error);
      return false;
    }
  }, []);

  // Update home location (alias for saveHomeLocation)
  const updateHomeLocation = useCallback((location: MapCoordinates) => {
    return saveHomeLocation(location);
  }, [saveHomeLocation]);

  // Helper to use home location as origin
  const useHomeAddress = useCallback((setOrigin: (address: string) => void, handleOriginChange: (coordinates: MapCoordinates) => void) => {
    const home = loadHomeLocation();
    if (home) {
      setOrigin(home.address || "Mi Casa");
      handleOriginChange(home);
      
      toast({
        title: "Casa seleccionada como origen",
        description: "Tu ubicación de casa ha sido establecida como punto de origen."
      });
      
      return true;
    } else {
      toast({
        title: "No hay casa guardada",
        description: "Primero debes guardar una ubicación como casa.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [loadHomeLocation]);

  return {
    hasHomeLocation,
    homeLocation,
    saveHomeLocation,
    loadHomeLocation,
    clearHomeLocation,
    updateHomeLocation,
    useHomeAddress
  };
};
