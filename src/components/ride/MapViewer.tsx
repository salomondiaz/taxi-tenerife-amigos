
import React from "react";
import Map from "@/components/Map";
import { MapCoordinates } from "@/components/map/types";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface MapViewerProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
}

const MapViewer: React.FC<MapViewerProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
}) => {
  return (
    <div className="relative h-full w-full">
      <Map 
        origin={originCoords || undefined}
        destination={destinationCoords || undefined}
        routeGeometry={routeGeometry}
        className="h-full w-full"
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        allowMapSelection={true}
        showRoute={destinationCoords !== null}
        interactive={true}
      />
      
      {/* Map Legend/Info */}
      <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded-lg p-3 shadow-md text-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span className="ml-1">Origen</span>
              </span>
              
              <span className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                <span className="ml-1">Destino</span>
              </span>
            </div>
            
            <p className="text-xs text-gray-600">
              Toca el mapa o usa el buscador para seleccionar ubicaciones
            </p>
          </div>
          
          {routeGeometry && (
            <div className="flex items-center justify-end">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold">Ruta calculada</span>
                <span className="text-xs text-gray-600">
                  {originCoords?.address?.substring(0, 15)}... → {destinationCoords?.address?.substring(0, 15)}...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
