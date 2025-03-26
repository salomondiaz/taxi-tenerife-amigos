
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

// Re-export all functions from the new service files
export { drawRoute } from './RouteDrawingService';
export { 
  fitMapToBounds, 
  resetMapToTenerife,
  isWithinTenerifeBounds,
  isPointNearTenerife 
} from './MapBoundsService';
export { zoomToHomeLocation } from './HomeLocationService';
export { 
  saveLastMapPosition,
  loadLastMapPosition 
} from './MapPositionService';
