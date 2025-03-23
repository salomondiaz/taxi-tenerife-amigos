
import React from 'react';
import { MapSelectionMode } from '../types';

interface SelectionHintProps {
  selectionMode: MapSelectionMode;
}

const SelectionHint: React.FC<SelectionHintProps> = ({ selectionMode }) => {
  if (selectionMode === 'none') return null;
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-md shadow-md text-sm">
      Haga clic en el mapa para seleccionar {selectionMode === 'origin' ? 'origen' : 'destino'}
    </div>
  );
};

export default SelectionHint;
