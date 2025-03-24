
import React from 'react';
import { MapCoordinates } from '../types';

interface HomeLocationControlsProps {
  allowMapSelection: boolean;
  origin?: MapCoordinates;
  homeLocation?: MapCoordinates | null;
  saveHomeLocation: () => void;
  useHomeAsOrigin: () => void;
}

const HomeLocationControls: React.FC<HomeLocationControlsProps> = ({
  allowMapSelection,
  origin,
  homeLocation,
  saveHomeLocation,
  useHomeAsOrigin
}) => {
  if (!allowMapSelection) return null;
  
  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      {origin && (
        <button 
          onClick={saveHomeLocation}
          className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100"
          title="Guardar como mi casa"
        >
          💾 Guardar como Mi Casa
        </button>
      )}
      
      {homeLocation && (
        <button 
          onClick={useHomeAsOrigin}
          className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100"
          title="Usar Mi Casa como origen"
        >
          🏠 Usar Mi Casa
        </button>
      )}
    </div>
  );
};

export default HomeLocationControls;
