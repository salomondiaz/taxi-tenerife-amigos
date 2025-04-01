
import React from 'react';

interface MapSelectionIndicatorProps {
  visible: boolean;
  type: 'origin' | 'destination';
}

const MapSelectionIndicator: React.FC<MapSelectionIndicatorProps> = ({ visible, type }) => {
  if (!visible) return null;
  
  const isOrigin = type === 'origin';
  const color = isOrigin ? 'bg-blue-500' : 'bg-red-500';
  const text = isOrigin ? 'Seleccionando origen' : 'Seleccionando destino';
  
  return (
    <div className="absolute top-0 left-0 right-0 z-20">
      <div className={`w-full py-2 ${color} text-white text-center font-medium`}>
        {text} — Haz clic en el mapa para seleccionar
      </div>
    </div>
  );
};

export default MapSelectionIndicator;
