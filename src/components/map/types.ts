
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

// Tipo para los niveles de tráfico
export type TrafficLevel = 'low' | 'moderate' | 'high' | 'very_high' | null;

// Interfaz para los viajes
export interface Ride {
  id: string;
  origin: MapCoordinates & { address: string }; // Aseguramos que address siempre exista
  destination: MapCoordinates & { address: string }; // Aseguramos que address siempre exista
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requestTime: Date;
  price: number;
  distance: number;
  createdAt: string;
  paymentMethodId: string;
  driver?: {
    id: string;
    name: string;
    photo?: string;
    rating?: number;
  };
  vehicle?: {
    id: string;
    model: string;
    plate: string;
    color: string;
  };
}
