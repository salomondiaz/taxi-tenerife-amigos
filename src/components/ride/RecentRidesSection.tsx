
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapPin, Calendar, Clock, AlertCircle } from "lucide-react";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";

interface Ride {
  id: number;
  created_at: string;
  origen: string;
  destino: string;
  precio_estimado: number;
  estado: string;
  hora_programada: string | null;
}

const RecentRidesSection: React.FC = () => {
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getRecentRides();
  }, []);

  const getRecentRides = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const { data, error } = await supabase
        .from("viajes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent rides:", error);
        setHasError(true);
        return;
      }

      setRecentRides(data || []);
    } catch (error) {
      console.error("Exception fetching recent rides:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_curso":
      case "en curso":
        return "bg-blue-100 text-blue-800";
      case "completado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true, locale: es });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Viajes recientes</h2>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tenerife-blue"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Viajes recientes</h2>
        <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
          <AlertCircle className="text-red-500 mr-2" />
          <p className="text-red-700">No pudimos cargar tus viajes recientes. Por favor intenta más tarde.</p>
        </div>
      </div>
    );
  }

  if (recentRides.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Viajes recientes</h2>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No has realizado ningún viaje aún. ¡Solicita tu primer viaje ahora!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm mt-8">
      <h2 className="text-xl font-semibold mb-4">Viajes recientes</h2>
      <div className="space-y-4">
        {recentRides.map((ride) => (
          <div key={ride.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                  <p className="text-sm font-medium">{ride.origen || "Origen no especificado"}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-red-600 mr-1" />
                  <p className="text-sm font-medium">{ride.destino || "Destino no especificado"}</p>
                </div>
                {ride.hora_programada && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                    <p className="text-xs text-purple-700">
                      Programado: {new Date(ride.hora_programada).toLocaleDateString()}
                      <Clock className="h-3 w-3 inline ml-1 mr-1" />
                      {new Date(ride.hora_programada).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusClass(ride.estado)}`}
                >
                  {ride.estado}
                </span>
                <span className="text-sm font-bold mt-2">{ride.precio_estimado?.toFixed(2)}€</span>
                <span className="text-xs text-gray-500 mt-1">{formatDate(ride.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRidesSection;
