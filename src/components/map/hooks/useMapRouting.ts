
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { drawRoute, fitMapToBounds, resetMapToTenerife, TENERIFE_CENTER } from '../services/MapRoutingService';

export function useMapRouting(
  map: mapboxgl.Map | null,
  origin?: MapCoordinates,
  destination?: MapCoordinates
) {
  // Effect to ensure map stays centered on Tenerife when it loads initially
  useEffect(() => {
    if (!map) return;
    
    const centerOnTenerife = () => {
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 10,
        essential: true
      });
    };
    
    if (map.loaded()) {
      centerOnTenerife();
    } else {
      map.once('load', centerOnTenerife);
    }
    
    return () => {
      map.off('load', centerOnTenerife);
    };
  }, [map]);

  // Effect to handle route drawing between points
  useEffect(() => {
    if (!map || !origin || !destination) return;

    console.log("useMapRouting effect triggered with", origin, destination);

    // Ensure map is loaded before drawing routes
    const handleRouting = () => {
      try {
        console.log("Executing routing logic");
        // Draw route between points
        drawRoute(map, origin, destination);
        
        // Fit map to show both points
        fitMapToBounds(map, origin, destination);
        
        // Make sure we're still focused on Tenerife
        resetMapToTenerife(map);
      } catch (error) {
        console.error("Error in map routing:", error);
      }
    };
    
    if (map.loaded()) {
      console.log("Map already loaded, drawing route now");
      handleRouting();
    } else {
      console.log("Map not loaded yet, waiting for load event");
      // Wait for map to load before drawing route
      map.once('load', handleRouting);
    }
    
    return () => {
      // Clean up route and event listener when component unmounts
      if (map.loaded() && map.getStyle()) {
        try {
          if (map.getSource('route')) {
            console.log("Cleaning up route");
            map.removeLayer('route');
            map.removeSource('route');
          }
        } catch (error) {
          console.error("Error cleaning up route:", error);
        }
      }
      
      // Remove load event listener
      map.off('load', handleRouting);
    };
  }, [map, origin, destination]);
}
