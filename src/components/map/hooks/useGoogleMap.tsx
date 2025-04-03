
import { useRef, useEffect } from 'react';
import { MapCoordinates } from '../types';

interface UseGoogleMapProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  interactive?: boolean;
  apiKey?: string;
  onMapReady?: (map: google.maps.Map) => void;
}

export function useGoogleMap({
  mapContainerRef,
  origin,
  interactive = true,
  apiKey,
  onMapReady
}: UseGoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Initialize map when container is ready
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Load Google Maps API
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }

    try {
      // Create map instance
      const defaultCenter = { lat: 40.416775, lng: -3.70379 }; // Default center (Madrid)
      const initialCenter = origin || defaultCenter;
      
      const mapOptions: google.maps.MapOptions = {
        center: initialCenter,
        zoom: 13,
        mapTypeId: 'roadmap',
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: interactive,
        gestureHandling: interactive ? 'greedy' : 'none',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
      console.log("Google Map initialized");
      
      if (onMapReady) {
        onMapReady(mapRef.current);
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
    
    return () => {
      // No explicit cleanup needed for Google Maps
      mapRef.current = null;
    };
  }, [mapContainerRef, origin, interactive, onMapReady]);
  
  // Prevent automatic zoom out when clicking
  useEffect(() => {
    if (mapRef.current) {
      const currentMap = mapRef.current;
      
      // Create a listener that prevents zoom being reset
      const preventZoomReset = (event: any) => {
        event.stop();
      };
      
      // Add various event listeners to prevent unwanted zoom changes
      google.maps.event.addListener(currentMap, 'dblclick', preventZoomReset);
      
      return () => {
        if (currentMap) {
          google.maps.event.clearListeners(currentMap, 'dblclick');
        }
      };
    }
  }, [mapRef.current]);
  
  return mapRef;
}
