
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance, formatRelativeTime } from "@/lib/utils";
import { Clock, Navigation, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentRidesProps {
  recentRides: any[];
  loading: boolean;
  handleRequestRide: () => void;
}

const RecentRides: React.FC<RecentRidesProps> = ({ recentRides, loading, handleRequestRide }) => {
  const navigate = useNavigate();
  
  const handleRideDetail = (id: string) => {
    navigate(`/rides/${id}`);
  };
  
  // Si no hay viajes recientes y no está cargando, mostrar mensaje
  if (!loading && (!recentRides || recentRides.length === 0)) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Historial de viajes</h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <Clock size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tienes viajes recientes</h3>
          <p className="text-gray-500 mb-4">¡Solicita tu primer viaje y comienza a crear tu historial!</p>
          <Button onClick={handleRequestRide} className="bg-tenerife-blue hover:bg-blue-700">
            Solicitar un taxi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Historial de viajes</h2>
      
      {loading ? (
        // Loading skeletons
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Actual content
        <div className="space-y-4">
          {recentRides.map((ride) => (
            <Card key={ride.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRideDetail(ride.id)}>
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Navigation size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Viaje a {ride.destination.split(',')[0]}</p>
                    <p className="text-gray-500 text-sm">
                      {formatRelativeTime(ride.date)}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="font-semibold">{ride.price.toFixed(2)} €</p>
                  </div>
                </div>
                
                <div className="flex text-sm mb-3">
                  <div className="flex-1">
                    <div className="flex items-start mb-1">
                      <MapPin size={16} className="mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 line-clamp-1">{ride.origin}</p>
                    </div>
                    <div className="flex items-start">
                      <Navigation size={16} className="mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 line-clamp-1">{ride.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={15} className="mr-1" />
                    <span>{ride.duration} min</span>
                    <span className="mx-1">·</span>
                    <span>{formatDistance(ride.distance)}</span>
                  </div>
                  
                  {ride.rating && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{ride.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {recentRides.length > 0 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => navigate('/rides')} className="w-full">
                Ver todo el historial
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentRides;
