
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
  // Select the current step based on what's already selected
  const selectionMode = React.useMemo(() => {
    if (!originCoords) return 'origin';
    if (!destinationCoords) return 'destination';
    return null;
  }, [originCoords, destinationCoords]);

  // Instrucciones de selección de ubicaciones
  React.useEffect(() => {
    // Mostrar instrucción inicial solo cuando no hay ni origen ni destino
    if (useManualSelection && !originCoords && !destinationCoords) {
      toast({
        title: "Seleccionar ubicaciones",
        description: "Haz clic en el mapa para marcar tu punto de origen",
      });
    }
  }, [useManualSelection, originCoords, destinationCoords]);

  // Format traffic level text
  const getTrafficText = () => {
    switch (trafficLevel) {
      case 'low': return "🟢 Tráfico ligero";
      case 'moderate': return "🟡 Tráfico moderado";
      case 'high': return "🟠 Tráfico denso";
      case 'very_high': return "🔴 Tráfico muy denso";
      default: return null;
    }
  };

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
        selectionMode={selectionMode}
      />
      
      {/* Mostrar resumen del viaje si tenemos estimaciones */}
      {estimatedPrice && estimatedDistance && estimatedTime && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-md z-40">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-1">{estimatedDistance.toFixed(1)} km</span> • 
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mx-1">{estimatedTime} min</span>
                {scheduledTime && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-1">Programado</span>
                )}
              </div>
              {getTrafficText() && (
                <p className="text-xs text-gray-600 mt-1">
                  {getTrafficText()}
                </p>
              )}
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
