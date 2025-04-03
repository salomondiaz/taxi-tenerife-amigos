
import React, { useState } from 'react';
import Map from '@/components/Map';
import { MapCoordinates, MapDriverPosition } from '@/components/map/types';
import { toast } from '@/hooks/use-toast';
import { Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapViewerProps {
  useManualSelection?: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase?: () => void;
  useHomeAsDestination?: () => void;
  onMapClick?: (coords: MapCoordinates) => void;
  alwaysShowHomeMarker?: boolean;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition | null;
}

const MapViewer: React.FC<MapViewerProps> = ({
  useManualSelection = true,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination,
  onMapClick,
  alwaysShowHomeMarker = false,
  showDriverPosition = false,
  driverPosition = null
}) => {
  // Track which point we're currently selecting
  const [selectionStep, setSelectionStep] = useState<'origin' | 'destination' | null>(
    originCoords ? (destinationCoords ? null : 'destination') : 'origin'
  );
  
  // Helper to show status of the selection
  const getSelectionStatus = () => {
    if (originCoords && destinationCoords) return "✅ Origen y destino seleccionados";
    if (originCoords) return "Ahora selecciona el destino";
    return "Selecciona tu punto de origen";
  };

  // Toggle selection mode buttons
  const handleSelectOrigin = () => {
    setSelectionStep('origin');
    toast({
      title: "Selección de origen activada",
      description: "Haz clic en el mapa para marcar tu punto de partida",
    });
  };

  const handleSelectDestination = () => {
    setSelectionStep('destination');
    toast({
      title: "Selección de destino activada",
      description: "Haz clic en el mapa para marcar tu punto de llegada",
    });
  };

  return (
    <div className="relative h-full">
      {/* Selection buttons */}
      {useManualSelection && (
        <div className="absolute top-4 right-4 z-40 flex flex-col space-y-2">
          <Button 
            onClick={handleSelectOrigin} 
            className={`flex items-center ${selectionStep === 'origin' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
            size="sm"
          >
            <MapPin size={16} className="mr-1" />
            Seleccionar origen
          </Button>
          
          <Button 
            onClick={handleSelectDestination} 
            className={`flex items-center ${selectionStep === 'destination' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600'}`}
            size="sm"
          >
            <MapPin size={16} className="mr-1" />
            Seleccionar destino
          </Button>
          
          {useHomeAsDestination && (
            <Button 
              onClick={useHomeAsDestination} 
              className="flex items-center bg-white text-green-600 border border-green-600"
              size="sm"
            >
              <Home size={16} className="mr-1" />
              Casa como destino
            </Button>
          )}
        </div>
      )}
      
      {/* Main map component */}
      <Map
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        allowMapSelection={useManualSelection}
        showRoute={true}
        useHomeAsDestination={useHomeAsDestination}
        alwaysShowHomeMarker={alwaysShowHomeMarker}
        showDriverPosition={showDriverPosition}
        driverPosition={driverPosition || undefined}
        showSelectMarkers={true}
        selectionMode={selectionStep}
      />
      
      {/* Status banner at the bottom of the map */}
      {useManualSelection && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md z-40 text-center">
          <p className="font-semibold text-sm">
            {getSelectionStatus()}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
