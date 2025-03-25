
import { useState, useEffect } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";

export type FavoriteLocationType = 'home' | 'work' | 'favorite';

export interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: MapCoordinates;
  type: FavoriteLocationType;
  icon?: string;
}

const FAVORITE_LOCATIONS_KEY = 'favorite_locations';
const HOME_LOCATION_KEY = 'user_home_location'; // For backwards compatibility

export function useFavoriteLocations() {
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);

  // Load favorite locations from localStorage on mount
  useEffect(() => {
    loadFavoriteLocations();
  }, []);

  // Function to load favorite locations
  const loadFavoriteLocations = () => {
    try {
      // First try to load from the new system
      const savedLocations = localStorage.getItem(FAVORITE_LOCATIONS_KEY);
      let locations: FavoriteLocation[] = [];
      
      if (savedLocations) {
        locations = JSON.parse(savedLocations);
      }
      
      // For backwards compatibility, check if we have a home location saved in the old format
      const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
      if (homeLocationJSON && !locations.some(loc => loc.type === 'home')) {
        try {
          const homeLocation = JSON.parse(homeLocationJSON);
          const homeFavorite: FavoriteLocation = {
            id: 'home',
            name: 'Mi Casa',
            coordinates: homeLocation,
            type: 'home',
            icon: '🏠'
          };
          locations.push(homeFavorite);
        } catch (error) {
          console.error("Error parsing home location:", error);
        }
      }
      
      setFavoriteLocations(locations);
      console.log("Loaded favorite locations:", locations);
    } catch (error) {
      console.error("Error loading favorite locations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus ubicaciones favoritas",
        variant: "destructive"
      });
    }
  };

  // Function to save a new favorite location
  const saveFavoriteLocation = (location: Omit<FavoriteLocation, 'id'>) => {
    try {
      const newLocation: FavoriteLocation = {
        ...location,
        id: location.id || Date.now().toString()
      };
      
      // Check if we're updating an existing location
      const updated = favoriteLocations.map(loc => 
        (loc.type === location.type && location.type !== 'favorite') ? newLocation : loc
      );
      
      // If it's not an update, add it as a new location
      const exists = updated.some(loc => 
        (loc.type === location.type && location.type !== 'favorite') || 
        loc.id === newLocation.id
      );
      
      const newLocations = exists ? updated : [...updated, newLocation];
      
      // Save to localStorage
      localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(newLocations));
      
      // If it's a home location, also save in the old format for backwards compatibility
      if (location.type === 'home') {
        localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(location.coordinates));
      }
      
      setFavoriteLocations(newLocations);
      console.log("Saved favorite location:", newLocation);
      
      return true;
    } catch (error) {
      console.error("Error saving favorite location:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la ubicación favorita",
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to remove a favorite location
  const removeFavoriteLocation = (id: string) => {
    try {
      const location = favoriteLocations.find(loc => loc.id === id);
      const newLocations = favoriteLocations.filter(loc => loc.id !== id);
      
      localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(newLocations));
      
      // If removing home, also remove from old storage
      if (location?.type === 'home') {
        localStorage.removeItem(HOME_LOCATION_KEY);
      }
      
      setFavoriteLocations(newLocations);
      console.log("Removed favorite location:", id);
      
      return true;
    } catch (error) {
      console.error("Error removing favorite location:", error);
      return false;
    }
  };

  // Function to get a location by type (like 'home', 'work')
  const getLocationByType = (type: FavoriteLocationType): FavoriteLocation | undefined => {
    return favoriteLocations.find(loc => loc.type === type);
  };

  // Get all locations of a specific type
  const getLocationsByType = (type: FavoriteLocationType): FavoriteLocation[] => {
    return favoriteLocations.filter(loc => loc.type === type);
  };

  return {
    favoriteLocations,
    saveFavoriteLocation,
    removeFavoriteLocation,
    getLocationByType,
    getLocationsByType,
    loadFavoriteLocations
  };
}
