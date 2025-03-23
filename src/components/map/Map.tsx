
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './types';
import MapDisplay from './MapDisplay';
import { useDriverSimulation } from './hooks/useDriverSimulation';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();
  
  // This hook is only responsible for simulating driver movement
  // It's called here to track this specific state that's not part of MapDisplay
  useDriverSimulation({
    testMode,
    showDriverPosition: props.showDriverPosition || false,
    origin: props.origin,
    destination: props.destination,
    driverPosition: props.driverPosition
  });

  return <MapDisplay {...props} />;
};

export default Map;
