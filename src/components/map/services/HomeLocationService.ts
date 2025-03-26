
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { TENERIFE_CENTER } from './MapboxService';
import { isWithinTenerifeBounds } from './MapBoundsService';
import { saveLastMapPosition } from './MapPositionService';

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
