
export interface MapCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapDriverPosition {
  lat: number;
  lng: number;
  heading?: number;
}

export type MapSelectionMode = 'none' | 'origin' | 'destination';

export const API_KEY_STORAGE_KEY = 'mapbox_api_key';

export type FavoriteLocationType = 'home' | 'work' | 'favorite' | 'recent';

export interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: MapCoordinates;
  type: FavoriteLocationType;
  icon: string;
}

export interface MapProps {
  className?: string;
  apiKey?: string;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  routeGeometry?: any;  // Para rutas de Mapbox
  interactive?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showRoute?: boolean;
  allowMapSelection?: boolean;
  useHomeAsDestination?: () => void;
  showHomeMarker?: boolean;
  alwaysShowHomeMarker?: boolean;
  allowHomeEditing?: boolean;
  homeLocation?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  showSelectMarkers?: boolean;
}
