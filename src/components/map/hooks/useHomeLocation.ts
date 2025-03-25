
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { zoomToHomeLocation } from '../services/MapRoutingService';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';

const HOME_LOCATION_KEY = 'user_home_location';

export function useHomeLocation(map: mapboxgl.Map | null, origin?: MapCoordinates, onOriginChange?: (coordinates: MapCoordinates) => void) {
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);
  const [showHomeMarker, setShowHomeMarker] = useState<boolean>(false);
  const [isHomeLocation, setIsHomeLocation] = useState<boolean>(false);
  const { getLocationByType, saveFavoriteLocation } = useFavoriteLocations();

  // Load home location on mount
  useEffect(() => {
    try {
      // First check if we have a home in the favorites system
      const homeFromFavorites = getLocationByType('home');
      
      if (homeFromFavorites) {
        setHomeLocation(homeFromFavorites.coordinates);
        setShowHomeMarker(true);
        console.log("Loaded home location from favorites:", homeFromFavorites.coordinates);
        return;
      }
      
      // Fall back to legacy system
      const savedHomeLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (savedHomeLocation) {
        const parsedHome = JSON.parse(savedHomeLocation);
        setHomeLocation(parsedHome);
        setShowHomeMarker(true);
        console.log("Loaded home location from legacy storage:", parsedHome);
      }
    } catch (error) {
      console.error("Error loading home location:", error);
    }
  }, [getLocationByType]);

  // Check if current origin is home location
  useEffect(() => {
    if (origin && homeLocation) {
      const isHome = 
        Math.abs(origin.lat - homeLocation.lat) < 0.0001 && 
        Math.abs(origin.lng - homeLocation.lng) < 0.0001;
      
      setIsHomeLocation(isHome);
      console.log("Is home location:", isHome);
    } else {
      setIsHomeLocation(false);
    }
  }, [origin, homeLocation]);

  // Save home location
  const saveHomeLocation = () => {
    if (!origin) {
      console.error("No origin set to save as home");
      return;
    }
    
    try {
      console.log("Saving home location:", origin);
      
      // Save in both systems - new favorites system and legacy
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(origin));
      
      // Save in favorites system
      saveFavoriteLocation({
        name: "Mi Casa",
        coordinates: origin,
        type: "home",
        icon: "🏠",
        id: "home" // explicitly include id here
      });
      
      setHomeLocation(origin);
      setShowHomeMarker(true);
      console.log("Home location saved:", origin);
    } catch (error) {
      console.error("Error saving home location:", error);
    }
  };

  // Use home location as origin
  const useHomeAsOrigin = () => {
    if (!homeLocation || !onOriginChange || !map) {
      console.error("No home location saved or no origin change handler");
      return;
    }
    
    // Ensure the origin marker updates correctly
    console.log("Setting home as origin:", homeLocation);
    onOriginChange(homeLocation);
    setIsHomeLocation(true);
    
    // Zoom to home location
    zoomToHomeLocation(map, homeLocation);
  };

  return {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  };
}
