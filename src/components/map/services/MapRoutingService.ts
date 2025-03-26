import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { TENERIFE_BOUNDS, TENERIFE_CENTER } from './MapboxService';

// Draw route between points
export const drawRoute = (
  map: mapboxgl.Map, 
  origin: MapCoordinates, 
  destination: MapCoordinates,
  routeGeometry?: any
): void => {
  if (!map || !map.loaded() || !map.getStyle()) {
    console.log("Map not fully loaded yet, skipping route drawing");
    return;
  }
  
  try {
    console.log("Drawing route from", origin, "to", destination);
    
    // Check if coordinates are within Tenerife boundaries
    if (!isWithinTenerifeBounds(origin) || !isWithinTenerifeBounds(destination)) {
      console.error("Origin or destination outside of Tenerife bounds");
      return;
    }
    
    // Check if map source exists and remove it safely
    if (map.getSource('route')) {
      map.removeLayer('route-arrows');
      map.removeLayer('route-glow');
      map.removeLayer('route');
      map.removeSource('route');
    }
    
    // Si tenemos la geometría de la ruta desde la API de direcciones, la usamos
    if (routeGeometry) {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeGeometry
        }
      });
    } else {
      // Fallback a una línea recta si no hay datos de la API
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [origin.lng, origin.lat],
              [destination.lng, destination.lat]
            ]
          }
        }
      });
    }
    
    // Agregar línea principal
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1E88E5',
        'line-width': 6,
        'line-opacity': 0.8
      }
    });
    
    // Agregar efecto de resplandor a la ruta
    map.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#4FC3F7',
        'line-width': 12,
        'line-opacity': 0.3,
        'line-blur': 3
      }
    }, 'route');
    
    // Agregar flechas direccionales en la ruta
    map.addLayer({
      id: 'route-arrows',
      type: 'symbol',
      source: 'route',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 100,
        'icon-image': 'arrow-right',
        'icon-size': 0.75,
        'text-field': '→',
        'text-size': 20,
        'text-offset': [0, 0],
        'text-rotation-alignment': 'map',
        'icon-rotation-alignment': 'map'
      },
      paint: {
        'text-color': '#1E88E5',
        'text-halo-color': '#fff',
        'text-halo-width': 2
      }
    });
    
    console.log("Route drawn successfully");
  } catch (error) {
    console.error("Error drawing route:", error);
  }
};

// Helper function to check if coordinates are within Tenerife
function isWithinTenerifeBounds(coords: MapCoordinates): boolean {
  return (
    coords.lng >= TENERIFE_BOUNDS.minLng && 
    coords.lng <= TENERIFE_BOUNDS.maxLng && 
    coords.lat >= TENERIFE_BOUNDS.minLat && 
    coords.lat <= TENERIFE_BOUNDS.maxLat
  );
}

export const fitMapToBounds = (
  map: mapboxgl.Map,
  origin: MapCoordinates,
  destination: MapCoordinates
): void => {
  if (!map || !map.loaded()) return;
  
  try {
    console.log("Fitting map to bounds");
    
    // Verify coordinates are within Tenerife
    if (!isWithinTenerifeBounds(origin) || !isWithinTenerifeBounds(destination)) {
      console.error("Cannot fit to bounds: coordinates outside Tenerife");
      resetMapToTenerife(map);
      return;
    }
    
    // Create bounds from the route points
    const bounds = new mapboxgl.LngLatBounds()
      .extend([origin.lng, origin.lat])
      .extend([destination.lng, destination.lat]);
      
    // Add padding to ensure markers are visible
    const padding = {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100
    };
    
    // Only if the bounds are valid and within Tenerife's general area
    map.fitBounds(bounds, {
      padding: padding,
      maxZoom: 14,
      duration: 1000 // Animación más suave
    });
    
    // Save the last view position to localStorage
    saveLastMapPosition(map);
  } catch (error) {
    console.error("Error fitting map to bounds:", error);
  }
};

// Function to ensure map always centers on Tenerife if it drifts too far
export const resetMapToTenerife = (map: mapboxgl.Map): void => {
  if (!map || !map.loaded()) return;
  
  try {
    const center = map.getCenter();
    
    // If map drifts too far from Tenerife, reset it
    if (!isPointNearTenerife(center.lng, center.lat)) {
      console.log("Map drifted away from Tenerife, resetting...");
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 10,
        essential: true
      });
      
      // Save the reset position
      saveLastMapPosition(map);
    }
  } catch (error) {
    console.error("Error resetting map:", error);
  }
};

// Helper function to check if a point is near Tenerife
function isPointNearTenerife(lng: number, lat: number): boolean {
  const maxDistance = 0.5; // Closer constraint
  return (
    Math.abs(lng - TENERIFE_CENTER.lng) <= maxDistance && 
    Math.abs(lat - TENERIFE_CENTER.lat) <= maxDistance
  );
}

// New function to zoom to home location
export const zoomToHomeLocation = (
  map: mapboxgl.Map,
  homeLocation: MapCoordinates
): void => {
  if (!map || !map.loaded()) return;
  
  try {
    // Verify home location is within Tenerife
    if (!isWithinTenerifeBounds(homeLocation)) {
      console.warn("Home location outside Tenerife, using center instead");
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 12,
        essential: true
      });
      return;
    }
    
    console.log("Zooming to home location:", homeLocation);
    
    map.flyTo({
      center: [homeLocation.lng, homeLocation.lat],
      zoom: 16, // Closer zoom for home location
      essential: true,
      duration: 1500 // Transición más suave
    });
    
    // Save the home view position
    saveLastMapPosition(map);
  } catch (error) {
    console.error("Error zooming to home location:", error);
  }
};

// Save last map position to localStorage
export const saveLastMapPosition = (map: mapboxgl.Map): void => {
  if (!map || !map.loaded()) return;
  
  try {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    const mapPosition = {
      center: { lng: center.lng, lat: center.lat },
      zoom: zoom
    };
    
    localStorage.setItem('last_map_position', JSON.stringify(mapPosition));
    console.log("Saved map position:", mapPosition);
  } catch (error) {
    console.error("Error saving map position:", error);
  }
};

// Load last map position from localStorage
export const loadLastMapPosition = (map: mapboxgl.Map): void => {
  if (!map || !map.loaded()) return;
  
  try {
    const savedPosition = localStorage.getItem('last_map_position');
    
    if (savedPosition) {
      const mapPosition = JSON.parse(savedPosition);
      
      // Check if position is within Tenerife area before applying
      const center = mapPosition.center;
      
      if (isPointNearTenerife(center.lng, center.lat)) {
        map.flyTo({
          center: [center.lng, center.lat],
          zoom: mapPosition.zoom,
          essential: true,
          duration: 1000 // Transición más suave
        });
        
        console.log("Loaded saved map position:", mapPosition);
      } else {
        console.log("Saved position was outside Tenerife area, using default center");
        map.flyTo({
          center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
          zoom: 10,
          essential: true
        });
      }
    } else {
      // If no saved position, center on Tenerife
      map.flyTo({
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 10,
        essential: true
      });
    }
  } catch (error) {
    console.error("Error loading map position:", error);
  }
};
