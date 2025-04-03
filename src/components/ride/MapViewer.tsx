
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
  // We no longer need to track selection step internally
  // as that's now handled by the map selection controls

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
      
      {/* Instructions for selection */}
      {useManualSelection && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-lg shadow-md z-40 max-w-xs">
          <p className="text-xs text-gray-700">
            Usa los botones ubicados en la esquina superior derecha para seleccionar origen y destino
          </p>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
