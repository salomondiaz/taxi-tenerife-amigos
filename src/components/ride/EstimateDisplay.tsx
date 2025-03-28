
import React from 'react';
import { Car, Clock, MapPin, Calendar } from 'lucide-react';

interface EstimateDisplayProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
}

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({
  estimatedDistance,
  estimatedTime,
  trafficLevel,
  arrivalTime
}) => {
  // Get traffic level text and color
  const getTrafficInfo = () => {
    if (!trafficLevel) return { text: 'No disponible', color: 'text-gray-500' };
    
    switch (trafficLevel) {
      case 'low':
        return { text: 'Bajo', color: 'text-green-500' };
      case 'moderate':
        return { text: 'Moderado', color: 'text-yellow-500' };
      case 'heavy':
        return { text: 'Alto', color: 'text-red-500' };
      default:
        return { text: 'No disponible', color: 'text-gray-500' };
    }
  };
  
  const trafficInfo = getTrafficInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-3">Detalles del trayecto</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Car size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Distancia</p>
            <p className="font-medium">{estimatedDistance ? `${estimatedDistance.toFixed(1)} km` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-full">
            <Clock size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tiempo estimado</p>
            <p className="font-medium">{estimatedTime ? `${estimatedTime} min` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-full">
            <MapPin size={18} className="text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nivel de tráfico</p>
            <p className={`font-medium ${trafficInfo.color}`}>{trafficInfo.text}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-full">
            <Calendar size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Llegada estimada</p>
            <p className="font-medium">{arrivalTime ? `${arrivalTime}` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateDisplay;
