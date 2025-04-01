
import React from 'react';

interface MapSelectionIndicatorProps {
  visible: boolean;
  type: 'origin' | 'destination' | null;
}

const MapSelectionIndicator: React.FC<MapSelectionIndicatorProps> = ({ visible, type }) => {
  if (!visible) return null;

  const color = type === 'origin' ? 'bg-blue-500' : 'bg-red-500';
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      {/* Cruz horizontal */}
      <div className={`absolute h-0.5 w-8 ${color} opacity-70`}></div>
      {/* Cruz vertical */}
      <div className={`absolute w-0.5 h-8 ${color} opacity-70`}></div>
      {/* Círculo exterior */}
      <div className={`absolute w-6 h-6 rounded-full border-2 ${color.replace('bg-', 'border-')} opacity-70`}></div>
    </div>
  );
};

export default MapSelectionIndicator;
