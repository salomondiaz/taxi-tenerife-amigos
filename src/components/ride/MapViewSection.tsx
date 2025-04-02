
import React, { useState } from "react";
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
  useHomeAsDestination,
  saveRideToSupabase,
  allowHomeEditing,
  trafficLevel,
  estimatedTime,
  estimatedDistance,
  estimatedPrice,
  scheduledTime
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Función para guardar el viaje
  const handleSaveRide = async () => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Faltan datos",
        description: "Por favor selecciona origen y destino para continuar",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await saveRideToSupabase();
      toast({
        title: "¡Viaje guardado!",
        description: scheduledTime 
          ? `Tu viaje ha sido programado para ${new Date(scheduledTime).toLocaleString('es-ES')}`
          : "Tu viaje ha sido guardado correctamente"
      });
    } catch (error) {
      console.error("Error guardando el viaje:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el viaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Comprobar si debemos mostrar la información previa del viaje
  const shouldShowTripInfo = originCoords && 
                            destinationCoords && 
                            (estimatedDistance !== null || 
                             estimatedTime !== null || 
                             estimatedPrice !== null);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white" style={{ height: "500px" }}>
      <div className="relative h-full">
        <Map
          interactive={true}
          allowMapSelection={useManualSelection}
          origin={originCoords}
          destination={destinationCoords}
          routeGeometry={routeGeometry}
          onOriginChange={handleOriginChange}
          onDestinationChange={handleDestinationChange}
          useHomeAsDestination={useHomeAsDestination}
          alwaysShowHomeMarker={true}
          allowHomeEditing={allowHomeEditing}
          showRoute={true}
        />
        
        {/* Información previa del viaje (overlay) */}
        {shouldShowTripInfo && (
          <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-10">
            <div className="grid grid-cols-3 gap-2 text-sm">
              {estimatedDistance !== null && (
                <div>
                  <p className="font-semibold text-gray-800">Distancia</p>
                  <p>{estimatedDistance.toFixed(1)} km</p>
                </div>
              )}
              
              {estimatedTime !== null && (
                <div>
                  <p className="font-semibold text-gray-800">Tiempo estimado</p>
                  <p>{estimatedTime} min</p>
                </div>
              )}
              
              {estimatedPrice !== null && (
                <div>
                  <p className="font-semibold text-gray-800">Precio estimado</p>
                  <p>{estimatedPrice.toFixed(2)} €</p>
                </div>
              )}
            </div>
            
            {trafficLevel && trafficLevel !== 'low' && (
              <div className={`mt-2 px-2 py-1 rounded text-xs ${
                trafficLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                trafficLevel === 'high' || trafficLevel === 'very_high' ? 'bg-red-100 text-red-800' : 
                'bg-green-100 text-green-800'
              }`}>
                <p>
                  {trafficLevel === 'moderate' ? '⚠️ Tráfico moderado en la ruta' :
                   trafficLevel === 'high' || trafficLevel === 'very_high' ? '⚠️ Tráfico denso en la ruta' : 
                   '✓ Tráfico fluido en la ruta'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewSection;
