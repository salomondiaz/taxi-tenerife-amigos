
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './map/types';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import GoogleMapDisplay from './map/GoogleMapDisplay';

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBBhFX2uXJtOBZFWqKKACGEBYqKKn80lrg';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();
  const { loadHomeLocation } = useHomeLocationStorage();

  // Load home location
  const homeLocation = loadHomeLocation();
  
  // Check if we should show the home marker
  const showHomeMarker = props.alwaysShowHomeMarker || 
                         (!!homeLocation && (!props.origin || 
                          (props.origin?.address && (
                            props.origin.address.toLowerCase().includes('mi casa') || 
                            props.origin.address.toLowerCase().includes('home')
                          ))
                         ));

  // Pass all props to GoogleMapDisplay including the API key and home marker flag
  return <GoogleMapDisplay 
    apiKey={GOOGLE_MAPS_API_KEY} 
    allowHomeEditing={props.allowHomeEditing || false}
    {...props} 
    showHomeMarker={showHomeMarker || props.showHomeMarker}
    homeLocation={homeLocation}
  />;
};

// Exportaciones
export default Map;
export { GOOGLE_MAPS_API_KEY };
export type { MapCoordinates } from './map/types';
