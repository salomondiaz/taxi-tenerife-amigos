
import React from 'react';
import { MapSelectionMode } from '../types';

interface CreateSelectionControlsProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
}

// Create selection controls UI component
export const createSelectionControls = ({ selectionMode, setSelectionMode }: CreateSelectionControlsProps) => {
  return () => (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-3 flex flex-col space-y-2">
      <button
        className={`px-3 py-1 text-sm rounded-md flex items-center transition ${
          selectionMode === 'origin' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
      >
        <span className="material-icons-outlined text-sm mr-1">place</span>
        {selectionMode === 'origin' ? 'Cancelar selección' : 'Seleccionar Origen'}
      </button>
      
      <button
        className={`px-3 py-1 text-sm rounded-md flex items-center transition ${
          selectionMode === 'destination' ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
      >
        <span className="material-icons-outlined text-sm mr-1">flag</span>
        {selectionMode === 'destination' ? 'Cancelar selección' : 'Seleccionar Destino'}
      </button>
    </div>
  );
};

// Create a floating action button for selection
export const renderFloatingButton = ({ 
  selectionMode, 
  setSelectionMode,
  showDestinationSelection = true 
}: { 
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  showDestinationSelection?: boolean;
}) => {
  // If already in selection mode, we don't show the floating button
  if (selectionMode !== 'none') return null;
  
  return (
    <div className="absolute bottom-20 right-4 z-10">
      <button
        className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition"
        onClick={() => setSelectionMode('origin')}
        title="Seleccionar puntos en el mapa"
      >
        <span className="material-icons">add_location</span>
      </button>
    </div>
  );
};
