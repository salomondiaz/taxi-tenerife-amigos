
import React from 'react';
import { MapSelectionMode } from '../types';

interface MapInstructionsProps {
  selectionMode: MapSelectionMode;
  allowMapSelection: boolean;
}

const MapInstructions: React.FC<MapInstructionsProps> = ({
  selectionMode,
  allowMapSelection
}) => {
  if (!allowMapSelection) return null;
  
  if (selectionMode === null) {
    return (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm z-30">
        Usa los botones en la esquina superior derecha para seleccionar ubicaciones
      </div>
    );
  }
  
  // Change the instruction text based on selection mode
  const instructionText = selectionMode === 'origin' 
    ? 'Haz clic en el mapa para marcar tu punto de origen' 
    : 'Haz clic en el mapa para marcar tu punto de destino';
  
  // Change background color based on selection mode
  const bgColor = selectionMode === 'origin' 
    ? 'bg-blue-600' 
    : 'bg-red-600';
    
  return (
    <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-full text-sm z-30 shadow-md`}>
      {instructionText}
    </div>
  );
};

export default MapInstructions;
