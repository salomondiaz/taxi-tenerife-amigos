
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from 'lucide-react';
import { MapSelectionMode } from '../types';

interface MapSelectionControlProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation: () => void;
}

const MapSelectionControl: React.FC<MapSelectionControlProps> = ({
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
}) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col space-y-2 bg-white p-2 rounded-md shadow-md">
      <Button 
        size="sm" 
        variant={selectionMode === 'origin' ? "default" : "outline"}
        onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
        className="flex items-center"
      >
        <MapPin size={16} className="mr-2" />
        {selectionMode === 'origin' ? 'Seleccionando origen...' : 'Seleccionar origen'}
      </Button>
      
      <Button 
        size="sm" 
        variant={selectionMode === 'destination' ? "default" : "outline"}
        onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
        className="flex items-center"
      >
        <Navigation size={16} className="mr-2" />
        {selectionMode === 'destination' ? 'Seleccionando destino...' : 'Seleccionar destino'}
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={onUseCurrentLocation}
        className="flex items-center"
      >
        <span className="flex h-2 w-2 mr-2 rounded-full bg-blue-500 animate-pulse" />
        Usar ubicación actual
      </Button>
    </div>
  );
};

export default MapSelectionControl;
