
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { MapProps } from './types';
import MapDisplay from './MapDisplay';

const Map: React.FC<MapProps> = (props) => {
  const { testMode } = useAppContext();

  return <MapDisplay {...props} />;
};

export default Map;
