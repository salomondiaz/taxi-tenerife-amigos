
import { useState, useCallback } from 'react';
import { MapCoordinates } from '@/components/map/types';

const HOME_LOCATION_KEY = 'user_home_location';

export const useHomeLocationStorage = () => {
  // State to track if home location is available
  const [hasHomeLocation, setHasHomeLocation] = useState<boolean>(() => {
    try {
      const storedLocation = localStorage.getItem(HOME_LOCATION_KEY);
      return !!storedLocation;
    } catch (error) {
      console.error('Error checking home location:', error);
      return false;
    }
  });

  // Save home location to localStorage
  const saveHomeLocation = useCallback((location: MapCoordinates) => {
    try {
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(location));
      setHasHomeLocation(true);
      console.log('Home location saved:', location);
      return true;
    } catch (error) {
      console.error('Error saving home location:', error);
      return false;
    }
  }, []);

  // Load home location from localStorage
  const loadHomeLocation = useCallback((): MapCoordinates | null => {
    try {
      const storedLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (!storedLocation) return null;
      
      const parsedLocation = JSON.parse(storedLocation) as MapCoordinates;
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
      return true;
    } catch (error) {
      console.error('Error clearing home location:', error);
      return false;
    }
  }, []);

  return {
    hasHomeLocation,
    saveHomeLocation,
    loadHomeLocation,
    clearHomeLocation
  };
};
