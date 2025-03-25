
import React from "react";
import { AlertCircle, Check, AlertTriangle } from "lucide-react";

interface TrafficInfoProps {
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
}

const TrafficInfo: React.FC<TrafficInfoProps> = ({ trafficLevel, arrivalTime }) => {
  if (!trafficLevel) return null;
  
  let content;
  
  switch (trafficLevel) {
    case 'low':
      content = (
        <div className="flex items-center bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
          <Check className="mr-3 text-green-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium">Tráfico fluido</h4>
            <p className="text-sm">Excelentes condiciones de tráfico en la ruta seleccionada.</p>
            {arrivalTime && (
              <p className="text-sm font-medium mt-1">Hora de llegada estimada: {arrivalTime}</p>
            )}
          </div>
        </div>
      );
      break;
    
    case 'moderate':
      content = (
        <div className="flex items-center bg-yellow-50 text-yellow-700 p-3 rounded-lg border border-yellow-200">
          <AlertTriangle className="mr-3 text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium">Tráfico moderado</h4>
            <p className="text-sm">Hay algo de tráfico en la ruta. El tiempo estimado puede aumentar un 20%.</p>
            {arrivalTime && (
              <p className="text-sm font-medium mt-1">Hora de llegada estimada: {arrivalTime}</p>
            )}
          </div>
        </div>
      );
      break;
    
    case 'heavy':
      content = (
        <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
          <AlertCircle className="mr-3 text-red-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium">Tráfico intenso</h4>
            <p className="text-sm">Hay mucho tráfico en la ruta. El tiempo estimado puede aumentar un 50%.</p>
            {arrivalTime && (
              <p className="text-sm font-medium mt-1">Hora de llegada estimada: {arrivalTime}</p>
            )}
          </div>
        </div>
      );
      break;
  }
  
  return content;
};

export default TrafficInfo;
