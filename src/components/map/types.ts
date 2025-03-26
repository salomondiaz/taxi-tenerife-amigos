
export const API_KEY_STORAGE_KEY = 'mapbox_api_key';

export type MapCoordinates = {
  lat: number;
  lng: number;
  address?: string;
};

export type MapDriverPosition = {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
};

export type MapSelectionMode = 'none' | 'origin' | 'destination';

export interface MapProps {
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  routeGeometry?: any;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  allowMapSelection?: boolean;
  showRoute?: boolean;
}

// Definición para los tipos de Ride
export interface Ride {
  id: string;
  origin: MapCoordinates;
  destination: MapCoordinates;
  originAddress: string;
  destinationAddress: string;
  price: number;
  distance: number;
  status: string;
  createdAt: string;
  requestTime: string; // Campo requerido
  paymentMethodId: string;
}
