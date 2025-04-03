
import React from 'react';
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
  return (
    <div className="relative h-full">
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
      />
      
      {/* Enhanced instructions overlay */}
      {useManualSelection && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-40 max-w-sm">
          <h3 className="font-semibold text-sm mb-1">Selección de ubicaciones:</h3>
          <p className="text-xs text-gray-700">
            1. Haz clic en <span className="font-semibold text-blue-600">Seleccionar origen</span> (botón azul)<br/>
            2. Haz clic en el mapa para marcar el punto de partida<br/>
            3. Luego haz clic en <span className="font-semibold text-red-600">Seleccionar destino</span> (botón rojo)<br/>
            4. Haz clic en el mapa para marcar hacia dónde quieres ir
          </p>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
