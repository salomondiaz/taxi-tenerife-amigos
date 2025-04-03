
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
    if (useManualSelection && !originCoords && !destinationCoords) {
      toast({
        title: "Seleccionar ubicaciones",
        description: "Haz clic en el botón azul para marcar el origen y luego en el rojo para el destino",
      });
    }
  }, [useManualSelection, originCoords, destinationCoords]);

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
      
      {/* Instrucciones de uso */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-10">
        <h3 className="font-semibold text-sm mb-1">¿Cómo seleccionar ubicaciones?</h3>
        <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-1">
          <li>Haz clic en el botón <span className="font-bold text-blue-600">azul</span> arriba a la derecha</li>
          <li>Haz clic en el mapa para marcar el <span className="font-bold text-blue-600">origen</span></li>
          <li>Haz clic en el botón <span className="font-bold text-red-600">rojo</span> arriba a la derecha</li>
          <li>Haz clic en el mapa para marcar el <span className="font-bold text-red-600">destino</span></li>
        </ol>
      </div>

      {/* Mostrar resumen del viaje si tenemos estimaciones */}
      {estimatedPrice && estimatedDistance && estimatedTime && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1">{estimatedDistance.toFixed(1)} km</span> • 
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-1">{estimatedTime} min</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {trafficLevel === 'low' && "🟢 Tráfico ligero"}
                {trafficLevel === 'moderate' && "🟡 Tráfico moderado"}
                {trafficLevel === 'high' && "🟠 Tráfico denso"}
                {trafficLevel === 'very_high' && "🔴 Tráfico muy denso"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold bg-green-100 text-green-800 px-2 py-1 rounded">{estimatedPrice.toFixed(2)}€</span>
              <p className="text-xs text-gray-500 mt-1">
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
