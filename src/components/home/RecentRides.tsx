
import React from "react";
import { Clock, MapPin, Star, Calendar, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + " €";
  };
  
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'pendiente': 'bg-blue-100 text-blue-800',
      'programado': 'bg-amber-100 text-amber-800',
      'en_curso': 'bg-purple-100 text-purple-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
    };
    
    const labels: Record<string, string> = {
      'pendiente': 'Pendiente',
      'programado': 'Programado',
      'en_curso': 'En curso',
      'completado': 'Completado',
      'cancelado': 'Cancelado',
    };
    
    const color = colors[status] || 'bg-gray-100 text-gray-800';
    const label = labels[status] || status;
    
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
        {label}
      </span>
    );
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
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">
                      {formatDate(ride.created_at)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formatTime(ride.created_at)}
                    </span>
                    {getStatusBadge(ride.estado)}
                  </div>
                  <h3 className="font-medium text-gray-800 mt-1">{ride.destino}</h3>
                  
                  {/* Mostrar hora programada si existe */}
                  {ride.hora_programada && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-amber-600">
                      <Calendar size={14} />
                      <span>
                        Programado para: {format(new Date(ride.hora_programada), "d MMM yyyy, HH:mm", { locale: es })}
                      </span>
                    </div>
                  )}
                </div>
                
                {ride.precio && (
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(ride.precio)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>{ride.duracion || "--"} min</span>
                  <span className="mx-2">•</span>
                  <span>{ride.distancia || "--"} km</span>
                </div>
                
                {ride.rating && (
                  <div className="flex items-center text-amber-500">
                    <Star size={16} className="mr-1 fill-amber-500" />
                    <span>{ride.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-3">
                <div className="text-xs text-gray-500">
                  <strong>De:</strong> {ride.origen}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Función para repetir el viaje
                    // Implementar lógica que use ride.origen y ride.destino
                    console.log("Repetir viaje:", ride);
                  }}
                >
                  Repetir
                </Button>
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
