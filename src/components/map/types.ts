
export type MapCoordinates = {
  lat: number;
  lng: number;
  address?: string;
};

export type MapDriverPosition = {
  lat: number;
  lng: number;
};

export type MapProps = {
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  style?: React.CSSProperties;
  className?: string;
  interactive?: boolean;
};

export const API_KEY_STORAGE_KEY = 'mapbox_api_key';
