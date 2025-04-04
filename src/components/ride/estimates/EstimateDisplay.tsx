
import React from "react";
import { TrafficLevel } from "@/components/map/types";
import { AlertCircle, Clock } from "lucide-react";

interface EstimateDisplayProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  estimatedPrice: number | null;
  trafficLevel?: TrafficLevel | null;
}

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({
  estimatedDistance,
  estimatedTime,
  estimatedPrice,
  trafficLevel,
}) => {
  // Function to get traffic status text and color
  const getTrafficInfo = () => {
    if (!trafficLevel) return null;
    
    switch (trafficLevel) {
      case 'low':
        return { text: "Tráfico ligero", color: "text-green-700", bg: "bg-green-50" };
      case 'moderate':
        return { text: "Tráfico moderado", color: "text-yellow-700", bg: "bg-yellow-50" };
      case 'high':
        return { text: "Tráfico denso", color: "text-orange-700", bg: "bg-orange-50" };
      case 'very_high':
        return { text: "Tráfico muy denso", color: "text-red-700", bg: "bg-red-50" };
      default:
        return null;
    }
  };
  
  const trafficInfo = getTrafficInfo();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700 font-medium">Distancia</p>
          <p className="text-xl font-bold">{estimatedDistance ? `${estimatedDistance.toFixed(1)} km` : "Calculando..."}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700 font-medium">Tiempo estimado</p>
          <p className="text-xl font-bold">{estimatedTime ? `${estimatedTime} min` : "Calculando..."}</p>
        </div>
      </div>
      
      {trafficInfo && (
        <div className={`${trafficInfo.bg} p-3 rounded-md flex items-start`}>
          <Clock className={`${trafficInfo.color} h-5 w-5 mr-2 mt-0.5`} />
          <div>
            <p className={`font-medium ${trafficInfo.color}`}>{trafficInfo.text}</p>
            {trafficLevel === 'high' || trafficLevel === 'very_high' ? (
              <p className="text-sm mt-1">
                Considera que el tiempo de viaje podría ser mayor al estimado.
              </p>
            ) : null}
          </div>
        </div>
      )}
      
      <div className="bg-green-50 p-4 rounded-md text-center">
        <p className="text-sm text-green-700 mb-1">Precio estimado</p>
        <p className="text-3xl font-bold text-green-700">
          {estimatedPrice ? `${estimatedPrice.toFixed(2)} €` : "Calculando..."}
        </p>
      </div>
    </div>
  );
};

export default EstimateDisplay;
