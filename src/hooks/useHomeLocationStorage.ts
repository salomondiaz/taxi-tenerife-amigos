
import { useState, useEffect } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";

// Default location: Puerto de la Cruz (as specified in the requirements)
const DEFAULT_HOME_LOCATION: MapCoordinates = {
  lat: 28.4155,
  lng: -16.5503,
  address: "Puerto de la Cruz, Tenerife",
};

// Local storage key
const HOME_LOCATION_KEY = "taxi_tenerife_home_location";

export const useHomeLocationStorage = () => {
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);
  
  useEffect(() => {
    // Load home location when hook is initialized
    const location = loadHomeLocation();
    if (location) {
      setHomeLocation(location);
    }
  }, []);
  
  // Save home location to local storage
  const saveHomeLocation = (location: MapCoordinates): boolean => {
    try {
      // Make sure we have an address
      const locationToSave = {
        ...location,
        address: location.address || "Mi Casa"
      };
      
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(locationToSave));
      setHomeLocation(locationToSave);
      
      toast({
        title: "Casa guardada",
        description: "Tu ubicación ha sido guardada como tu casa."
      });
      
      return true;
    } catch (error) {
      console.error("Error saving home location:", error);
      
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu ubicación de casa.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // Load home location from local storage
  const loadHomeLocation = (): MapCoordinates | null => {
    try {
      const storedLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (storedLocation) {
        return JSON.parse(storedLocation) as MapCoordinates;
      }
      return DEFAULT_HOME_LOCATION; // Return default if not found
    } catch (error) {
      console.error("Error loading home location:", error);
      return DEFAULT_HOME_LOCATION; // Return default on error
    }
  };
  
  // Update home location
  const updateHomeLocation = (location: MapCoordinates): boolean => {
    return saveHomeLocation(location);
  };
  
  // Reset home location to default
  const resetHomeLocation = (): boolean => {
    return saveHomeLocation(DEFAULT_HOME_LOCATION);
  };

  return {
    homeLocation: homeLocation || loadHomeLocation(),
    saveHomeLocation,
    loadHomeLocation,
    updateHomeLocation,
    resetHomeLocation,
  };
};
