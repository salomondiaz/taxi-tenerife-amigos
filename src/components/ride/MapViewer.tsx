
import React from "react";
import Map from "@/components/Map";
import { MapCoordinates } from "@/components/map/types";

interface MapViewerProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
}

const MapViewer: React.FC<MapViewerProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  handleOriginChange,
  handleDestinationChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {useManualSelection 
          ? "Selecciona los puntos en el mapa" 
          : "Vista previa del recorrido"}
      </h2>
      
      <div className="h-72 mb-3">
        <Map 
          origin={originCoords || undefined}
          destination={destinationCoords || undefined}
          className="h-full"
          onOriginChange={handleOriginChange}
          onDestinationChange={handleDestinationChange}
          allowMapSelection={useManualSelection}
        />
      </div>
      
      {useManualSelection && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Instrucciones:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Usa los botones en el mapa para seleccionar origen o destino</li>
            <li>Haz clic en el mapa en la ubicación deseada</li>
            <li>Puedes arrastrar los marcadores para ajustar la posición</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
