
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { MapSelectionMode } from '../types';

interface SelectionControlsProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  showDestinationSelection?: boolean;
}

export const createSelectionControls = ({
  selectionMode,
  setSelectionMode,
  showDestinationSelection = true
}: SelectionControlsProps) => {
  const handleOriginSelection = () => {
    setSelectionMode(selectionMode === 'origin' ? null : 'origin');
  };

  const handleDestinationSelection = () => {
    setSelectionMode(selectionMode === 'destination' ? null : 'destination');
  };

  return () => (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button 
        className={`flex items-center justify-center p-2 rounded-full shadow-lg ${
          selectionMode === 'origin' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
        } hover:bg-blue-600 hover:text-white transition-colors`}
        onClick={handleOriginSelection}
        title="Seleccionar origen en el mapa"
      >
        <MapPin size={24} />
      </button>
      
      {showDestinationSelection && (
        <button 
          className={`flex items-center justify-center p-2 rounded-full shadow-lg ${
            selectionMode === 'destination' ? 'bg-red-500 text-white' : 'bg-white text-red-500'
          } hover:bg-red-600 hover:text-white transition-colors`}
          onClick={handleDestinationSelection}
          title="Seleccionar destino en el mapa"
        >
          <Navigation size={24} />
        </button>
      )}
    </div>
  );
};

export const renderFloatingButton = ({
  selectionMode,
  setSelectionMode,
  showDestinationSelection = true
}: SelectionControlsProps) => {
  // If we already have a selection mode active, don't show the floating button
  if (selectionMode) return null;
  
  return (
    <div className="absolute bottom-20 right-4 z-10">
      <button 
        className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setSelectionMode('origin')}
        title="Seleccionar puntos en el mapa"
      >
        <MapPin size={24} />
      </button>
    </div>
  );
};
