
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './map/types';
import GoogleMapDisplay from './map/GoogleMapDisplay';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBBhFX2uXJtOBZFWqKKACGEBYqKKn80lrg';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();
  const { loadHomeLocation } = useHomeLocationStorage();

  // Cargar ubicación de casa
  const homeLocation = loadHomeLocation();
  
  // Check if we should show the home marker
  const showHomeMarker = props.alwaysShowHomeMarker || 
                         (!!homeLocation && (!props.origin || 
                          (props.origin?.address && (
                            props.origin.address.toLowerCase().includes('mi casa') || 
                            props.origin.address.toLowerCase().includes('home')
                          ))
                         ));

  console.log("Map component props:", { 
    ...props, 
    homeLocation, 
    showHomeMarker,
    selectionMode: props.selectionMode
  });

  // Pass all props to GoogleMapDisplay including the API key and home marker flag
  return <GoogleMapDisplay 
    apiKey={GOOGLE_MAPS_API_KEY} 
    allowHomeEditing={showHomeMarker || props.allowHomeEditing}
    {...props} 
    showHomeMarker={showHomeMarker}
    homeLocation={homeLocation}
  />;
};

// Exportaciones
export default Map;
export { GOOGLE_MAPS_API_KEY };
export type { MapCoordinates } from './map/types';
