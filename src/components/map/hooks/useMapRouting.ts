
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { 
  drawRoute, 
  fitMapToBounds, 
  resetMapToTenerife, 
  TENERIFE_CENTER,
  zoomToHomeLocation
} from '../services/MapRoutingService';
import { API_KEY_STORAGE_KEY } from '../types';

export function useMapRouting(
  map: mapboxgl.Map | null,
  origin?: MapCoordinates,
  destination?: MapCoordinates,
  isHomeLocation: boolean = false
) {
  const [routeGeometry, setRouteGeometry] = useState<any>(null);

  // Effect to ensure map stays centered on Tenerife when it loads initially
  useEffect(() => {
    if (!map) return;
    
    const centerOnTenerife = () => {
      // If origin is home location and is set, zoom to it instead of Tenerife center
      if (isHomeLocation && origin) {
        zoomToHomeLocation(map, origin);
      } else {
        map.flyTo({
          center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
          zoom: 10,
          essential: true
        });
      }
    };
    
    if (map.loaded()) {
      centerOnTenerife();
    } else {
      map.once('load', centerOnTenerife);
    }
    
    return () => {
      map.off('load', centerOnTenerife);
    };
  }, [map, origin, isHomeLocation]);

  // Efecto para obtener la ruta entre puntos
  useEffect(() => {
    if (!map || !origin || !destination) return;

    const fetchRoute = async () => {
      try {
        const accessToken = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (!accessToken) return;
        
        // Mostrar mensaje de carga
        console.log("Calculando ruta entre puntos...");
        
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${accessToken}&geometries=geojson`
        );
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          console.log("Ruta calculada con éxito:", data.routes[0]);
          setRouteGeometry(data.routes[0].geometry);
          return data.routes[0];
        } else {
          console.error("No se encontraron rutas", data);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
      return null;
    };
    
    fetchRoute();
  }, [map, origin, destination]);

  // Effect to handle route drawing between points
  useEffect(() => {
    if (!map || !origin || !destination) return;

    console.log("useMapRouting effect triggered with", origin, destination);

    // Ensure map is loaded before drawing routes
    const handleRouting = async () => {
      try {
        console.log("Executing routing logic");
        
        // If the style isn't loaded yet, wait for it
        if (!map.getStyle()) {
          console.log("Map style not loaded yet, waiting...");
          map.once('styledata', () => handleRouting());
          return;
        }
        
        // Draw route between points with defined geometry from API
        if (routeGeometry) {
          console.log("Drawing route with geometry from API");
          drawRoute(map, origin, destination, routeGeometry);
        } else {
          // Draw simple route if no API geometry available
          console.log("Drawing direct route without API geometry");
          drawRoute(map, origin, destination);
        }
        
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
  }, [map, origin, destination, routeGeometry]);
  
  // Add effect to handle a single origin (home location) without destination
  useEffect(() => {
    if (!map || !origin || destination || !isHomeLocation) return;
    
    const zoomToHome = () => {
      try {
        if (!map.getStyle()) {
          map.once('styledata', zoomToHome);
          return;
        }
        
        console.log("Zooming to home location");
        zoomToHomeLocation(map, origin);
      } catch (error) {
        console.error("Error zooming to home:", error);
      }
    };
    
    if (map.loaded()) {
      zoomToHome();
    } else {
      map.once('load', zoomToHome);
    }
    
    return () => {
      map.off('load', zoomToHome);
    };
  }, [map, origin, destination, isHomeLocation]);
  
  return { routeGeometry, setRouteGeometry };
}
