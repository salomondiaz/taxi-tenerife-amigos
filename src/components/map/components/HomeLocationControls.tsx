
import React from 'react';
import { Home } from 'lucide-react';
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
  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      {origin && (
        <button 
          onClick={saveHomeLocation}
          className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100 flex items-center"
          title="Guardar como mi casa"
        >
          <Home size={18} className="mr-2 text-tenerife-blue" />
          Guardar Mi Casa
        </button>
      )}
      
      {homeLocation && (
        <button 
          onClick={useHomeAsOrigin}
          className="bg-white p-2 rounded-md shadow-md text-sm font-medium hover:bg-gray-100 flex items-center"
          title="Usar Mi Casa como origen"
        >
          <Home size={18} className="mr-2 text-green-500" />
          Usar Mi Casa
        </button>
      )}
    </div>
  );
};

export default HomeLocationControls;
