
import React from "react";
import { AlertCircle } from "lucide-react";
import { TrafficLevel } from "@/components/map/types";

interface TrafficDisplayProps {
  trafficLevel: TrafficLevel;
  arrivalTime: Date | null;
}

const TrafficDisplay: React.FC<TrafficDisplayProps> = ({
  trafficLevel,
  arrivalTime,
}) => {
  // Format traffic level text and color
  const getTrafficInfo = () => {
    switch (trafficLevel) {
      case "low":
        return { text: "Tráfico ligero", color: "text-green-600", bg: "bg-green-50" };
      case "moderate":
        return { text: "Tráfico moderado", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "high":
        return { text: "Tráfico denso", color: "text-orange-600", bg: "bg-orange-50" };
      case "very_high":
        return { text: "Tráfico muy denso", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { text: "Tráfico desconocido", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };
  
  if (!trafficLevel) return null;

  const trafficInfo = getTrafficInfo();
  
  return (
    <div className={`p-3 rounded-md flex items-center justify-between ${trafficInfo.bg}`}>
      <div className="flex items-center">
        <AlertCircle className={`h-5 w-5 mr-2 ${trafficInfo.color}`} />
        <span className={`font-medium ${trafficInfo.color}`}>
          {trafficInfo.text}
        </span>
      </div>
      {arrivalTime && (
        <div className="text-sm">
          <span className="text-gray-500">Llegada aproximada: </span>
          <span className="font-medium">{arrivalTime.getHours().toString().padStart(2, '0')}:{arrivalTime.getMinutes().toString().padStart(2, '0')}</span>
        </div>
      )}
    </div>
  );
};

export default TrafficDisplay;
