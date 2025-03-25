
import React from "react";
import { AlertTriangle, Clock, ArrowUp } from "lucide-react";

interface TrafficInfoProps {
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  estimatedTime: number | null;
  arrivalTime: string | null;
}

const TrafficInfo: React.FC<TrafficInfoProps> = ({ 
  trafficLevel, 
  estimatedTime,
  arrivalTime 
}) => {
  if (!trafficLevel || !estimatedTime || !arrivalTime) {
    return null;
  }

  const getTrafficColor = () => {
    switch (trafficLevel) {
      case 'low':
        return 'text-green-500';
      case 'moderate':
        return 'text-amber-500';
      case 'heavy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrafficIcon = () => {
    switch (trafficLevel) {
      case 'low':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'moderate':
        return <Clock size={16} className="text-amber-500" />;
      case 'heavy':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getTrafficText = () => {
    switch (trafficLevel) {
      case 'low':
        return 'Tráfico fluido';
      case 'moderate':
        return 'Tráfico moderado';
      case 'heavy':
        return 'Tráfico intenso';
      default:
        return 'Tráfico desconocido';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Información de tráfico</h2>
        <div className={`flex items-center ${getTrafficColor()}`}>
          {getTrafficIcon()}
          <span className="ml-1 text-sm font-medium">{getTrafficText()}</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Tiempo de viaje:</span>
          </div>
          <span className="font-medium">{estimatedTime} minutos</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Hora de llegada estimada:</span>
          </div>
          <span className="font-medium">{arrivalTime}</span>
        </div>
        
        {trafficLevel === 'moderate' && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md mt-2">
            <p className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              <span>Hay algo de congestión en la ruta que podría afectar el tiempo de llegada.</span>
            </p>
          </div>
        )}
        
        {trafficLevel === 'heavy' && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-2">
            <p className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              <span>Hay congestión importante en la ruta. El tiempo de llegada puede aumentar considerablemente.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficInfo;
