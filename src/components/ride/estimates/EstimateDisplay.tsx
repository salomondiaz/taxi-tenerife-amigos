
import React from "react";
import { TrafficLevel } from "@/components/map/types";

interface EstimateDisplayProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  estimatedPrice: number | null;
}

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({
  estimatedDistance,
  estimatedTime,
  estimatedPrice,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700 font-medium">Distancia</p>
        <p className="text-xl font-bold">{estimatedDistance ? `${estimatedDistance.toFixed(1)} km` : "Calculando..."}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700 font-medium">Tiempo estimado</p>
        <p className="text-xl font-bold">{estimatedTime ? `${estimatedTime} min` : "Calculando..."}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-md text-center col-span-2">
        <p className="text-sm text-green-700 mb-1">Precio estimado</p>
        <p className="text-3xl font-bold text-green-700">
          {estimatedPrice ? `${estimatedPrice.toFixed(2)} €` : "Calculando..."}
        </p>
      </div>
    </div>
  );
};

export default EstimateDisplay;
