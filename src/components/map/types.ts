
// API key storage key
export const API_KEY_STORAGE_KEY = 'mapbox_api_key';

// Coordinates with optional address for map points
export interface MapCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

// Map selection mode
export type MapSelectionMode = 'origin' | 'destination' | null;

// Driver position with heading/rotation
export interface MapDriverPosition {
  lat: number;
  lng: number;
  heading?: number;
  name?: string;
  vehicle?: {
    make: string;
    model: string;
    color: string;
    plate: string;
  };
}

// Main map component props
export interface MapProps {
  apiKey?: string;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  routeGeometry?: any;  // GeoJSON route geometry
  homeLocation?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showRoute?: boolean;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  useHomeAsDestination?: () => void;
  showHomeMarker?: boolean;
  alwaysShowHomeMarker?: boolean;
  allowHomeEditing?: boolean;
}

// Map route type
export interface MapRoute {
  geometry: any;  // GeoJSON LineString geometry
  distance: number;  // in kilometers
  duration: number;  // in minutes
}

// Ride type for history and tracking
export interface Ride {
  id: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination?: {
    address: string;
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  requestTime: Date;
  price?: number;
  distance?: number;
  createdAt: string;
  paymentMethodId: string;
}
