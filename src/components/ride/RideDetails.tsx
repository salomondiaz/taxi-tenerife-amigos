
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Navigation, Car } from "lucide-react";

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Detalles estimados</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Tiempo estimado:</span>
          </div>
          <span className="font-medium">{estimatedTime} minutos</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Navigation size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700">Distancia:</span>
          </div>
          <span className="font-medium">{estimatedDistance} km</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Precio estimado:</span>
          <span className="text-xl font-bold text-tenerife-blue">{estimatedPrice.toFixed(2)} €</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          variant="default"
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
          onClick={handleRequestRide}
          disabled={isLoading}
        >
          <Car size={18} className="mr-2" />
          Solicitar taxi ahora
        </Button>
      </div>
    </div>
  );
};

export default RideDetails;
