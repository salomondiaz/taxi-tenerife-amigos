
import React, { useRef } from 'react';
import { MapProps } from './types';
import GoogleMapDisplay from './GoogleMapDisplay';

const MapDisplay: React.FC<MapProps> = (props) => {
  // Simplemente pasa todas las props a GoogleMapDisplay
  return <GoogleMapDisplay {...props} />;
};

export default MapDisplay;
