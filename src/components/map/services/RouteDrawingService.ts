
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { isWithinTenerifeBounds } from './MapBoundsService';

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
