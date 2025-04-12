
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Navigation, Calendar, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentRide {
  id: number;
  created_at: string;
  origen: string;
  destino: string;
  precio_estimado: number;
  estado: string;
  hora_programada: string | null;
}

const RecentRidesSection: React.FC = () => {
  const [recentRides, setRecentRides] = useState<RecentRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecentRides();
  }, []);

  const getRecentRides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("viajes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      setRecentRides(data || []);
    } catch (err) {
      console.error("Error fetching recent rides:", err);
      setError("No se pudieron cargar los viajes recientes");
      toast({
        title: "Error",
        description: "No se pudieron cargar los viajes recientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">Pendiente</span>;
      case "confirmado":
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Confirmado</span>;
      case "en curso":
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">En curso</span>;
      case "completado":
        return <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Completado</span>;
      case "cancelado":
        return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">Cancelado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return format(date, "PPP 'a las' p", { locale: es });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Viajes Recientes
          <button 
            onClick={getRecentRides}
            className="ml-2 text-xs text-tenerife-blue hover:underline"
          >
            Actualizar
          </button>
        </h2>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={getRecentRides} 
              className="mt-2 text-tenerife-blue hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : recentRides.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <Navigation className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-lg font-medium text-gray-600">No hay viajes recientes</p>
            <p className="text-gray-500">Tus viajes aparecerán aquí una vez los solicites</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentRides.map((ride) => (
              <div key={ride.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{ride.origen} → {ride.destino}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {ride.hora_programada ? (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-purple-600" />
                          <span>Programado: {formatDate(ride.hora_programada)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{formatDate(ride.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-green-700">{ride.precio_estimado.toFixed(2)}€</span>
                    <div className="mt-1">{getStatusBadge(ride.estado)}</div>
                  </div>
                </div>
                
                <div className="flex flex-col text-sm text-gray-600 mt-2 space-y-1">
                  <div className="flex items-start">
                    <MapPin size={14} className="mr-1 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{ride.origen}</span>
                  </div>
                  <div className="flex items-start">
                    <Navigation size={14} className="mr-1 mt-0.5 text-red-600 flex-shrink-0" />
                    <span className="truncate">{ride.destino}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRidesSection;
