
import { useCallback } from 'react';
import { MapCoordinates } from '@/components/map/types';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';

/**
 * Hook for managing home location storage
 */
export function useHomeLocationStorage() {
  const { getLocationByType, saveFavoriteLocation, editFavoriteLocation } = useFavoriteLocations();
  
  // Legacy storage key for backwards compatibility
  const HOME_LOCATION_KEY = 'user_home_location';

  /**
   * Load home location from storage
   */
  const loadHomeLocation = useCallback(() => {
    try {
      // First check if we have a home in the favorites system
      const homeFromFavorites = getLocationByType('home');
      
      if (homeFromFavorites) {
        console.log("Loaded home location from favorites:", homeFromFavorites.coordinates);
        return homeFromFavorites.coordinates;
      }
      
      // Fall back to legacy system
      const savedHomeLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (savedHomeLocation) {
        const parsedHome = JSON.parse(savedHomeLocation);
        console.log("Loaded home location from legacy storage:", parsedHome);
        return parsedHome;
      }
      
      return null;
    } catch (error) {
      console.error("Error loading home location:", error);
      return null;
    }
  }, [getLocationByType]);

  /**
   * Save home location to storage
   */
  const saveHomeLocation = useCallback((coordinates: MapCoordinates) => {
    if (!coordinates) {
      console.error("No coordinates provided to save home location");
      return false;
    }
    
    try {
      console.log("Saving home location:", coordinates);
      
      // Save in both systems - new favorites system and legacy
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(coordinates));
      
      // Save in favorites system
      return saveFavoriteLocation({
        name: "Mi Casa",
        coordinates,
        type: "home",
        icon: "🏠",
        id: "home" // explicitly include id here
      });
    } catch (error) {
      console.error("Error saving home location:", error);
      return false;
    }
  }, [saveFavoriteLocation]);

  /**
   * Update home location in storage
   */
  const updateHomeLocation = useCallback((newCoordinates: MapCoordinates) => {
    if (!newCoordinates) {
      console.error("No coordinates provided to update home location");
      return false;
    }
    
    try {
      console.log("Updating home location:", newCoordinates);
      
      // Update in favorites system
      const result = editFavoriteLocation("home", {
        coordinates: newCoordinates
      });
      
      // Update in legacy system
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(newCoordinates));
      
      console.log("Home location updated:", newCoordinates);
      return result;
    } catch (error) {
      console.error("Error updating home location:", error);
      return false;
    }
  }, [editFavoriteLocation]);

  return {
    loadHomeLocation,
    saveHomeLocation,
    updateHomeLocation
  };
}
