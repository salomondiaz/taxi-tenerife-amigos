
import React from "react";
import { Clock, Navigation, AlertTriangle } from "lucide-react";
import { TrafficLevel } from "@/components/map/types";

interface EstimateDisplayProps {
  estimatedDistance: number;
  estimatedTime: number;
  trafficLevel: TrafficLevel | null;
  arrivalTime: string;
}

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({
  estimatedDistance,
  estimatedTime,
  trafficLevel,
  arrivalTime
}) => {
  // Función para formatear la distancia
  const formatDistance = (distance: number): string => {
    if (distance === null || distance === undefined) return "0 km";
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Función para formatear el tiempo
  const formatTime = (minutes: number): string => {
    if (minutes === null || minutes === undefined) return "0 min";
    
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours} h ${remainingMinutes > 0 ? `${remainingMinutes} min` : ''}`;
  };

  // Determinar el color del tráfico
  const getTrafficColor = (): string => {
    switch (trafficLevel) {
      case "low":
        return "text-green-500";
      case "moderate":
        return "text-yellow-500";
      case "high":
      case "very_high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Determinar mensaje de tráfico
  const getTrafficMessage = (): string => {
    switch (trafficLevel) {
      case "low":
        return "Tráfico ligero";
      case "moderate":
        return "Tráfico moderado";
      case "high":
      case "very_high":
        return "Tráfico intenso";
      default:
        return "Tráfico desconocido";
    }
  };

  const trafficColor = getTrafficColor();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Detalles del viaje</h2>
      
      <div className="space-y-4">
        {/* Tiempo de llegada */}
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
            <div>
              <p className="font-medium">Hora de llegada</p>
              <p className="text-gray-500">{arrivalTime || "--:--"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatTime(estimatedTime)}</p>
            <p className="text-sm text-gray-500">de viaje</p>
          </div>
        </div>
        
        {/* Distancia */}
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Navigation className="h-5 w-5 mr-2 mt-0.5 text-gray-400" />
            <div>
              <p className="font-medium">Distancia</p>
              <p className="text-gray-500">{formatDistance(estimatedDistance)}</p>
            </div>
          </div>
        </div>
        
        {/* Tráfico */}
        {trafficLevel && (
          <div className="flex items-start mt-2">
            <AlertTriangle className={`h-5 w-5 mr-2 mt-0.5 ${trafficColor}`} />
            <div>
              <p className={`font-medium ${trafficColor}`}>{getTrafficMessage()}</p>
              <p className="text-gray-500 text-sm">
                {trafficLevel === "heavy" 
                  ? "Es posible que haya retrasos debido al tráfico intenso" 
                  : trafficLevel === "moderate" 
                    ? "Puede haber retrasos moderados" 
                    : "Se espera una buena circulación"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateDisplay;
