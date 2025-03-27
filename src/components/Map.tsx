
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './map/types';
import GoogleMapDisplay from './map/GoogleMapDisplay';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBBhFX2uXJtOBZFWqKKACGEBYqKKn80lrg';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();

  // Check if we should show the home marker
  const showHomeMarker = props.origin?.address?.toLowerCase().includes('mi casa') || 
                        props.origin?.address?.toLowerCase().includes('home');

  // Pass all props to GoogleMapDisplay including the API key and home marker flag
  return <GoogleMapDisplay 
    apiKey={GOOGLE_MAPS_API_KEY} 
    allowHomeEditing={showHomeMarker || props.allowHomeEditing}
    {...props} 
  />;
};

// Exportaciones
export default Map;
export { GOOGLE_MAPS_API_KEY };
export type { MapCoordinates } from './map/types';
