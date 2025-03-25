
import React from "react";
import { AlertCircle, Clock, ArrowUpRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrafficInfoProps {
  estimatedTime: number | null;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
}

const TrafficInfo: React.FC<TrafficInfoProps> = ({
  estimatedTime,
  trafficLevel,
  arrivalTime
}) => {
  if (!estimatedTime) return null;
  
  const getTrafficStatusColor = () => {
    switch(trafficLevel) {
      case 'low':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'heavy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getTrafficMessage = () => {
    switch(trafficLevel) {
      case 'low':
        return 'Tráfico fluido';
      case 'moderate':
        return 'Tráfico moderado';
      case 'heavy':
        return 'Tráfico congestionado';
      default:
        return 'Sin información de tráfico';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Información de tráfico</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Tiempo estimado:</span>
          </div>
          <span className="font-medium">{estimatedTime} minutos</span>
        </div>
        
        {arrivalTime && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowUpRight size={18} className="text-gray-500 mr-2" />
              <span className="text-gray-700">Hora de llegada:</span>
            </div>
            <span className="font-medium">{arrivalTime}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Estado del tráfico:</span>
          </div>
          <span className={cn("font-medium", getTrafficStatusColor())}>
            {getTrafficMessage()}
          </span>
        </div>
        
        {trafficLevel === 'moderate' || trafficLevel === 'heavy' ? (
          <div className="mt-2 flex items-start rounded-md bg-amber-50 p-3 text-sm">
            <AlertCircle size={18} className="mr-2 mt-0.5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-800">Aviso de tráfico</p>
              <p className="text-amber-700 mt-1">
                {trafficLevel === 'heavy' 
                  ? "Hay congestión en la ruta. Se ha ajustado el tiempo estimado."
                  : "Hay tráfico moderado en algunas partes de la ruta."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TrafficInfo;
