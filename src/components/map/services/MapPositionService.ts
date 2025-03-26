
import mapboxgl from 'mapbox-gl';
import { TENERIFE_CENTER } from './MapboxService';

// Helper function to check if a point is near Tenerife
function isPointNearTenerife(lng: number, lat: number): boolean {
  const maxDistance = 0.5; // Closer constraint
  return (
    Math.abs(lng - TENERIFE_CENTER.lng) <= maxDistance && 
    Math.abs(lat - TENERIFE_CENTER.lat) <= maxDistance
  );
}

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
