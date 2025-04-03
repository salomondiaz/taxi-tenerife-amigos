
import React, { useRef } from 'react';
import { MapCoordinates } from '../types';

interface GoogleMapContainerProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({ 
  mapContainerRef,
  children 
}) => {
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {children}
    </div>
  );
};

export default GoogleMapContainer;
