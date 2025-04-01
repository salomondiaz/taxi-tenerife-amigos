
import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import { MapCoordinates, MapDriverPosition } from '@/components/map/types';
import { toast } from '@/hooks/use-toast';

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
  const [selectionStep, setSelectionStep] = useState<'none' | 'origin' | 'destination'>('origin');

  // Reiniciar selección cuando cambia useManualSelection
  useEffect(() => {
    if (useManualSelection) {
      // If we already have origin set, but not destination
      if (originCoords && !destinationCoords) {
        setSelectionStep('destination');
      } 
      // If we have no origin yet
      else if (!originCoords) {
        setSelectionStep('origin');
      }
      // If we have both, don't need selection
      else {
        setSelectionStep('none');
      }
    } else {
      setSelectionStep('none');
    }
  }, [useManualSelection, originCoords, destinationCoords]);

  // Handle map clicks
  const handleMapSelection = (coords: MapCoordinates) => {
    if (onMapClick) {
      onMapClick(coords);
    } else {
      // Fallback to default behavior if no custom click handler
      if (selectionStep === 'origin') {
        handleOriginChange(coords);
        setSelectionStep('destination');
        toast({
          title: "Origen seleccionado",
          description: "Ahora haz clic para seleccionar el destino"
        });
      } else if (selectionStep === 'destination') {
        handleDestinationChange(coords);
        setSelectionStep('none');
        toast({
          title: "Destino seleccionado",
          description: "Calculando ruta..."
        });
      }
    }
  };

  // Avanzar al siguiente paso cuando se selecciona un punto
  useEffect(() => {
    if (originCoords && selectionStep === 'origin' && !onMapClick) {
      setSelectionStep('destination');
      toast({
        title: "Origen seleccionado",
        description: "Ahora haz clic para seleccionar el destino"
      });
    }
  }, [originCoords, selectionStep, onMapClick]);

  // Cuando se selecciona el destino, avanzar y guardar
  useEffect(() => {
    if (destinationCoords && selectionStep === 'destination' && originCoords && !onMapClick) {
      setSelectionStep('none');
      toast({
        title: "Destino seleccionado",
        description: "Calculando ruta..."
      });
      
      // Si existe la función para guardar en Supabase, llamarla automáticamente
      // pero solo si tenemos todos los datos necesarios
      if (saveRideToSupabase && originCoords && destinationCoords) {
        // Añadir temporizador para permitir que otras operaciones terminen primero
        setTimeout(() => {
          if (originCoords && destinationCoords) { // Verificar nuevamente por seguridad
            saveRideToSupabase();
          }
        }, 1000);
      }
    }
  }, [destinationCoords, selectionStep, originCoords, saveRideToSupabase, onMapClick]);

  return (
    <div className="relative h-full">
      {/* Main map component */}
      <Map
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleMapSelection}
        onDestinationChange={handleMapSelection}
        allowMapSelection={useManualSelection}
        showRoute={true}
        useHomeAsDestination={useHomeAsDestination}
        alwaysShowHomeMarker={alwaysShowHomeMarker}
        showDriverPosition={showDriverPosition}
        driverPosition={driverPosition || undefined}
      />
      
      {/* Selection mode message */}
      {selectionStep !== 'none' && !onMapClick && (
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
