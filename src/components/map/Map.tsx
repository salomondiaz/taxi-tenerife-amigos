
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './types';
import GoogleMapDisplay from './GoogleMapDisplay';
import { useDriverSimulation } from './hooks/useDriverSimulation';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();
  
  // Esta función solo simula el movimiento del conductor
  useDriverSimulation({
    testMode,
    showDriverPosition: props.showDriverPosition || false,
    origin: props.origin,
    destination: props.destination,
    driverPosition: props.driverPosition
  });

  return <GoogleMapDisplay {...props} />;
};

export default Map;
