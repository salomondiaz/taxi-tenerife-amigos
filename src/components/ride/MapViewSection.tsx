
import React from "react";
import { MapCoordinates } from "@/components/map/types";
import Map from "@/components/Map";
import { toast } from "@/hooks/use-toast";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase: () => Promise<any>;
  useHomeAsDestination?: () => void;
  allowHomeEditing?: boolean;
  trafficLevel?: 'low' | 'moderate' | 'high' | 'very_high' | null;
  estimatedTime?: number | null;
  estimatedDistance?: number | null;
  estimatedPrice?: number | null;
  scheduledTime?: string;
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination,
  allowHomeEditing,
  trafficLevel,
  estimatedTime,
  estimatedDistance,
  estimatedPrice,
  scheduledTime
}) => {
  // Instrucciones de selección de ubicaciones
  React.useEffect(() => {
    // Mostrar instrucción inicial
    if (useManualSelection && !originCoords) {
      toast({
        title: "Seleccionar ubicaciones",
        description: "Usa los botones azul y rojo para marcar el origen y destino en el mapa",
      });
    }
  }, [useManualSelection, originCoords]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] relative">
      <Map
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        allowMapSelection={true}
        showRoute={true}
        useHomeAsDestination={useHomeAsDestination}
        alwaysShowHomeMarker={true}
        allowHomeEditing={allowHomeEditing}
        showSelectMarkers={true}
      />
      
      {/* Indicadores de estado */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-10">
        <h3 className="font-semibold text-sm mb-1">Instrucciones:</h3>
        <p className="text-xs text-gray-700">
          1. Selecciona origen (azul) y destino (rojo)<br/>
          2. Usa los botones en la esquina superior derecha<br/>
          3. Haz clic en el mapa para colocar los marcadores
        </p>
      </div>

      {/* Mostrar resumen del viaje si tenemos estimaciones */}
      {estimatedPrice && estimatedDistance && estimatedTime && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">
                {estimatedDistance.toFixed(1)} km • {estimatedTime} min
              </span>
              <p className="text-xs text-gray-500">
                {trafficLevel === 'low' && "Tráfico ligero"}
                {trafficLevel === 'moderate' && "Tráfico moderado"}
                {trafficLevel === 'high' && "Tráfico denso"}
                {trafficLevel === 'very_high' && "Tráfico muy denso"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">{estimatedPrice.toFixed(2)}€</span>
              <p className="text-xs text-gray-500">
                {scheduledTime ? "Viaje programado" : "Precio estimado"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewSection;
