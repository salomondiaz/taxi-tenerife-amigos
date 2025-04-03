
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, CalendarClock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface RecentRide {
  id: number;
  origen: string;
  destino: string;
  created_at: string;
  estado: string;
  precio_estimado?: number;
  hora_programada?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100 text-gray-700";
  
  switch (status) {
    case "pendiente":
      bgColor = "bg-yellow-100 text-yellow-800";
      break;
    case "aceptado":
      bgColor = "bg-blue-100 text-blue-800";
      break;
    case "completado":
      bgColor = "bg-green-100 text-green-800";
      break;
    case "cancelado":
      bgColor = "bg-red-100 text-red-800";
      break;
  }
  
  return (
    <span className={`${bgColor} text-xs px-2 py-1 rounded-full`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const RecentRidesSection: React.FC = () => {
  const [recentRides, setRecentRides] = useState<RecentRide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent rides from Supabase
  const fetchRecentRides = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("viajes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching recent rides:", error);
        setError("No se pudieron cargar los viajes recientes");
      } else {
        setRecentRides(data || []);
        setError(null);
      }
    } catch (err) {
      console.error("Exception when fetching recent rides:", err);
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };
  
  // Subscribe to changes in the viajes table
  useEffect(() => {
    fetchRecentRides();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('public:viajes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'viajes'
      }, () => {
        // Reload data when changes occur
        fetchRecentRides();
      })
      .subscribe();
      
    return () => {
      // Clean up subscription
      supabase.removeChannel(subscription);
    };
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };
  
  // Format programmed date if available
  const formatProgrammedDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return format(date, "d MMM, HH:mm", { locale: es });
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4">Viajes recientes</h2>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
              <Skeleton className="h-6 w-40 mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : recentRides.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-lg text-center">
          No hay viajes recientes para mostrar. ¡Solicita tu primer taxi!
        </div>
      ) : (
        <div className="space-y-3">
          {recentRides.map((ride) => (
            <div key={ride.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{formatDate(ride.created_at)}</span>
                </div>
                <StatusBadge status={ride.estado} />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-start">
                  <div className="mr-2 mt-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Origen:</p>
                    <p className="text-sm text-gray-600 truncate">{ride.origen || "No especificado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-2 mt-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Destino:</p>
                    <p className="text-sm text-gray-600 truncate">{ride.destino || "No especificado"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                {ride.precio_estimado ? (
                  <p className="text-sm font-medium">Precio: <span className="text-green-700">{ride.precio_estimado.toFixed(2)}€</span></p>
                ) : (
                  <span></span>
                )}
                
                {ride.hora_programada && (
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-xs text-purple-700">
                      Programado: {formatProgrammedDate(ride.hora_programada)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRidesSection;
