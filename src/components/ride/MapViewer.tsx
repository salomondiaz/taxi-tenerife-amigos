
import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import { MapCoordinates } from '@/components/map/types';
import { toast } from '@/hooks/use-toast';

interface MapViewerProps {
  useManualSelection?: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase?: () => void;
}

const MapViewer: React.FC<MapViewerProps> = ({
  useManualSelection = true,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase
}) => {
  const [selectionStep, setSelectionStep] = useState<'none' | 'origin' | 'destination'>('origin');

  // Reiniciar selección cuando cambia useManualSelection
  useEffect(() => {
    if (useManualSelection) {
      setSelectionStep('origin');
    } else {
      setSelectionStep('none');
    }
  }, [useManualSelection]);

  // Avanzar al siguiente paso cuando se selecciona un punto
  useEffect(() => {
    if (originCoords && selectionStep === 'origin') {
      setSelectionStep('destination');
      toast({
        title: "Origen seleccionado",
        description: "Ahora haz clic para seleccionar el destino"
      });
    }
  }, [originCoords, selectionStep]);

  // Cuando se selecciona el destino, avanzar y guardar
  useEffect(() => {
    if (destinationCoords && selectionStep === 'destination' && originCoords) {
      setSelectionStep('none');
      toast({
        title: "Destino seleccionado",
        description: "Calculando ruta..."
      });
      
      // Si existe la función para guardar en Supabase, llamarla automáticamente
      if (saveRideToSupabase) {
        setTimeout(() => {
          saveRideToSupabase();
        }, 1000);
      }
    }
  }, [destinationCoords, selectionStep, originCoords, saveRideToSupabase]);

  return (
    <div className="relative h-full">
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
      {selectionStep !== 'none' && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/70 text-white py-2 px-4 rounded-full text-sm">
            {selectionStep === 'origin' 
              ? 'Haz clic para seleccionar el punto de origen' 
              : 'Haz clic para seleccionar el punto de destino'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
