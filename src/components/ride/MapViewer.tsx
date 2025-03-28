
import React, { useState } from 'react';
import Map from '@/components/Map';
import { MapCoordinates } from '@/components/map/types';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MapViewerProps {
  useManualSelection?: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
}

const MapViewer: React.FC<MapViewerProps> = ({
  useManualSelection = true, // Changed default to true to enable selection by default
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange
}) => {
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | null>(null);

  const toggleSelectionMode = (mode: 'origin' | 'destination') => {
    if (selectionMode === mode) {
      setSelectionMode(null);
    } else {
      setSelectionMode(mode);
      toast({
        title: `Selección de ${mode === 'origin' ? 'origen' : 'destino'} activada`,
        description: `Haz clic en el mapa para seleccionar el punto de ${mode === 'origin' ? 'origen' : 'destino'}`
      });
    }
  };

  return (
    <div className="relative h-full">
      {/* Selection controls for mobile */}
      {useManualSelection && (
        <div className="absolute top-3 left-0 right-0 flex justify-center z-10 mx-4">
          <div className="bg-white rounded-lg shadow-lg flex p-1 gap-1">
            <Button
              onClick={() => toggleSelectionMode('origin')}
              variant={selectionMode === 'origin' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <MapPin size={16} />
              <span className="hidden md:inline">Origen</span>
            </Button>
            <Button
              onClick={() => toggleSelectionMode('destination')}
              variant={selectionMode === 'destination' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <Navigation size={16} />
              <span className="hidden md:inline">Destino</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Main map component */}
      <Map
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        allowMapSelection={true}
        showRoute={true}
      />
      
      {/* Selection mode message */}
      {selectionMode && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/70 text-white py-2 px-4 rounded-full text-sm">
            {selectionMode === 'origin' 
              ? 'Haz clic para seleccionar el punto de origen' 
              : 'Haz clic para seleccionar el punto de destino'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
