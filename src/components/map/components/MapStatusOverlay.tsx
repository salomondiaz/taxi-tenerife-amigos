
import React from 'react';
import { MapSelectionMode } from '../types';
import { MapPin, X } from 'lucide-react';

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
  return (
    <>
      {selectionMode && selectionMode !== 'none' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-10 flex items-center gap-2">
          {selectionMode === 'origin' ? (
            <>
              <MapPin className="text-blue-500" size={18} />
              <span className="text-sm font-medium">Selecciona el origen</span>
              <X 
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" 
                size={16} 
                onClick={() => setSelectionMode('none')}
              />
            </>
          ) : (
            <>
              <MapPin className="text-red-500" size={18} />
              <span className="text-sm font-medium">Selecciona el destino</span>
              <X 
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" 
                size={16}
                onClick={() => setSelectionMode('none')}
              />
            </>
          )}
        </div>
      )}
      
      {showSelectMarkers && selectionMode !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin 
            size={48} 
            className={`${selectionMode === 'origin' ? 'text-blue-500' : 'text-red-500'} animate-bounce shadow-lg`} 
            strokeWidth={1.5}
          />
        </div>
      )}
    </>
  );
};

export default MapStatusOverlay;
