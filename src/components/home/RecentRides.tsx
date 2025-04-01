
import React from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentRidesProps {
  recentRides: any[];
  loading: boolean;
  handleRequestRide: () => void;
}

const RecentRides: React.FC<RecentRidesProps> = ({ 
  recentRides, 
  loading, 
  handleRequestRide 
}) => {
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + " €";
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Viajes recientes</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>
          ))}
        </div>
      ) : recentRides.length > 0 ? (
        <div className="space-y-4">
          {recentRides.map((ride) => (
            <div 
              key={ride.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm mr-2">
                      {formatDate(ride.date)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formatTime(ride.date)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 mt-1">{ride.destination}</h3>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(ride.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>{ride.duration} min</span>
                  <span className="mx-2">•</span>
                  <span>{ride.distance} km</span>
                </div>
                
                <div className="flex items-center text-amber-500">
                  <Star size={16} className="mr-1 fill-amber-500" />
                  <span>{ride.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-medium mb-2">No hay viajes recientes</h3>
          <p className="text-gray-500 text-sm mb-4">
            Solicita tu primer viaje para verlo aquí
          </p>
          <Button 
            onClick={handleRequestRide}
            variant="ghost" 
            size="default"
          >
            Solicitar ahora
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentRides;
