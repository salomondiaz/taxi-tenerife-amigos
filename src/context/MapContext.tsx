
import React, { createContext, useContext, useState } from 'react';
import { MapCoordinates } from '@/components/map/types';

interface MapContextType {
  originCoordinates: MapCoordinates | null;
  destinationCoordinates: MapCoordinates | null;
  setOriginCoordinates: (coords: MapCoordinates | null) => void;
  setDestinationCoordinates: (coords: MapCoordinates | null) => void;
  routeGeometry: any | null;
  setRouteGeometry: (geometry: any | null) => void;
}

const MapContext = createContext<MapContextType>({
  originCoordinates: null,
  destinationCoordinates: null,
  setOriginCoordinates: () => {},
  setDestinationCoordinates: () => {},
  routeGeometry: null,
  setRouteGeometry: () => {}
});

export const MapProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [originCoordinates, setOriginCoordinates] = useState<MapCoordinates | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<MapCoordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any | null>(null);

  const value = {
    originCoordinates,
    destinationCoordinates,
    setOriginCoordinates,
    setDestinationCoordinates,
    routeGeometry,
    setRouteGeometry
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
