
import React from 'react';
import { MapSelectionMode } from '../types';

interface MapStatusOverlayProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  showSelectMarkers?: boolean;
}

const MapStatusOverlay: React.FC<MapStatusOverlayProps> = ({
  selectionMode,
  setSelectionMode,
  showSelectMarkers = false
}) => {
  if (selectionMode === 'none') return null;

  const getMessage = () => {
    switch (selectionMode) {
      case 'origin':
        return 'Haz clic en el mapa para seleccionar el punto de ORIGEN';
      case 'destination':
        return 'Haz clic en el mapa para seleccionar el punto de DESTINO';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (selectionMode) {
      case 'origin':
        return 'bg-blue-600';
      case 'destination':
        return 'bg-red-600';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <>
      {/* Indicador de modo de selección */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className={`${getColor()} px-4 py-2 rounded-full text-white font-medium shadow-lg`}>
          {getMessage()}
        </div>
      </div>
      
      {/* Símbolo de cruz en el centro durante la selección */}
      {showSelectMarkers && selectionMode !== 'none' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className={`w-10 h-10 relative ${selectionMode === 'origin' ? 'text-blue-600' : 'text-red-600'}`}>
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 rounded-full" 
                 style={{backgroundColor: 'currentColor'}}></div>
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 rounded-full"
                 style={{backgroundColor: 'currentColor'}}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapStatusOverlay;
