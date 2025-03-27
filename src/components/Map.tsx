
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './map/types';
import GoogleMapDisplay from './map/GoogleMapDisplay';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBBhFX2uXJtOBZFWqKKACGEBYqKKn80lrg';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();

  // Pass all props to GoogleMapDisplay including the API key
  return <GoogleMapDisplay apiKey={GOOGLE_MAPS_API_KEY} {...props} />;
};

// Exportaciones
export default Map;
export { GOOGLE_MAPS_API_KEY };
export type { MapCoordinates } from './map/types';
