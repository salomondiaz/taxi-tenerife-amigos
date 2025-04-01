
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Navigation, Car, Banknote } from "lucide-react";

interface RideDetailsProps {
  estimatedPrice: number | null;
  estimatedTime: number | null;
  estimatedDistance: number | null;
  isLoading: boolean;
  handleRequestRide: () => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({
  estimatedPrice,
  estimatedTime,
  estimatedDistance,
  isLoading,
  handleRequestRide,
}) => {
  if (estimatedPrice === null) {
    return null;
  }

  // Safe formatting with null checks
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return "0.00";
    return price.toFixed(2);
  };
  
  const formatDistance = (distance: number | null) => {
    if (distance === null || distance === undefined) return "0.0";
    return distance.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Detalles del viaje</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Tiempo estimado:</span>
          </div>
          <span className="font-medium">{estimatedTime || 0} minutos</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Navigation size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Distancia:</span>
          </div>
          <span className="font-medium">{formatDistance(estimatedDistance)} km</span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <Banknote size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Precio estimado:</span>
          </div>
          <span className="text-xl font-bold text-tenerife-blue">€ {formatPrice(estimatedPrice)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="default"
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90 py-6 text-lg"
          onClick={handleRequestRide}
          disabled={isLoading}
        >
          <Car size={20} className="mr-2" />
          Solicitar taxi ahora
        </Button>
      </div>
    </div>
  );
};

export default RideDetails;
