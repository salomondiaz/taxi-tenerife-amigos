
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CircleDollarSign, Car } from "lucide-react";
import TrafficInfo from "./TrafficInfo";

interface RouteResultsProps {
  estimatedPrice: number | null;
  estimatedTime: number | null;
  estimatedDistance: number | null;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
  isLoading: boolean;
  handleRequestRide: () => void;
}

const RouteResults: React.FC<RouteResultsProps> = ({
  estimatedPrice,
  estimatedTime,
  estimatedDistance,
  trafficLevel,
  arrivalTime,
  isLoading,
  handleRequestRide
}) => {
  // Check if we have results to show
  const hasResults = estimatedPrice !== null && 
                    estimatedTime !== null && 
                    estimatedDistance !== null;
                    
  const formattedPrice = estimatedPrice ? `${estimatedPrice.toFixed(2)} €` : "---";
  const formattedTime = estimatedTime ? `${estimatedTime} min` : "---";
  const formattedDistance = estimatedDistance ? `${estimatedDistance.toFixed(1)} km` : "---";
  
  console.log("RouteResults rendering with:", {
    trafficLevel,
    arrivalTime,
    hasResults,
    isLoading
  });
  
  if (!hasResults && !isLoading) {
    return null; // Don't show the component if no results and not loading
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-fade-in">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 text-blue-500" size={20} />
        Detalles de la ruta
      </h2>
      
      {isLoading ? (
        <div className="py-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <CircleDollarSign className="mb-2 text-green-600" size={24} />
              <p className="text-sm text-gray-600 mb-1">Precio estimado</p>
              <h3 className="text-lg font-bold text-gray-800">{formattedPrice}</h3>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <Clock className="mb-2 text-blue-600" size={24} />
              <p className="text-sm text-gray-600 mb-1">Tiempo de viaje</p>
              <h3 className="text-lg font-bold text-gray-800">{formattedTime}</h3>
              {arrivalTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Llegada estimada: {arrivalTime}
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <Car className="mb-2 text-indigo-600" size={24} />
              <p className="text-sm text-gray-600 mb-1">Distancia</p>
              <h3 className="text-lg font-bold text-gray-800">{formattedDistance}</h3>
            </div>
          </div>
          
          {/* Traffic information */}
          {trafficLevel && (
            <div className="mb-5">
              <TrafficInfo trafficLevel={trafficLevel} arrivalTime={arrivalTime} />
            </div>
          )}
          
          <Button 
            className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
            size="lg"
            onClick={handleRequestRide}
          >
            <Car className="mr-2" size={18} />
            Solicitar taxi ahora
          </Button>
        </>
      )}
    </div>
  );
};

export default RouteResults;
