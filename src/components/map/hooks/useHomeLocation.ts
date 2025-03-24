
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { zoomToHomeLocation } from '../services/MapRoutingService';

const HOME_LOCATION_KEY = 'user_home_location';

export function useHomeLocation(map: mapboxgl.Map | null, origin?: MapCoordinates, onOriginChange?: (coordinates: MapCoordinates) => void) {
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);
  const [showHomeMarker, setShowHomeMarker] = useState<boolean>(false);
  const [isHomeLocation, setIsHomeLocation] = useState<boolean>(false);

  // Load home location on mount
  useEffect(() => {
    try {
      const savedHomeLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (savedHomeLocation) {
        const parsedHome = JSON.parse(savedHomeLocation);
        setHomeLocation(parsedHome);
        setShowHomeMarker(true);
        console.log("Loaded home location:", parsedHome);
      }
    } catch (error) {
      console.error("Error loading home location:", error);
    }
  }, []);

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
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(origin));
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
    
    onOriginChange(homeLocation);
    setIsHomeLocation(true);
    
    // Zoom to home location
    zoomToHomeLocation(map, homeLocation);
    console.log("Using home as origin:", homeLocation);
  };

  return {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  };
}
