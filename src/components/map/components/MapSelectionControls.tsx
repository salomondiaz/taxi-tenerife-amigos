
import React from 'react';
import { MapSelectionMode, MapCoordinates } from '../types';
import MapSelectionControl from '../controls/MapSelectionControl';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation?: () => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
  onSearchLocation,
}) => {
  if (!allowMapSelection) return null;
  
  // Mostrar controles más grandes y visibles para mejor interacción
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button 
        className={`flex items-center justify-center p-3 rounded-full shadow-lg ${
          selectionMode === 'origin' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
        } hover:bg-blue-600 hover:text-white transition-colors`}
        onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
        title="Seleccionar origen en el mapa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </button>
      
      <button 
        className={`flex items-center justify-center p-3 rounded-full shadow-lg ${
          selectionMode === 'destination' ? 'bg-red-500 text-white' : 'bg-white text-red-500'
        } hover:bg-red-600 hover:text-white transition-colors`}
        onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
        title="Seleccionar destino en el mapa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
      </button>
    </div>
  );
};

export default MapSelectionControls;
