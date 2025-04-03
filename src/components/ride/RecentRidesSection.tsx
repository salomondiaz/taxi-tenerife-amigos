
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin } from "lucide-react";

interface Ride {
  id: number;
  created_at: string;
  origen: string;
  destino: string;
  estado: string;
  precio_estimado?: number;
  hora_programada?: string;
}

const RecentRidesSection: React.FC = () => {
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentRides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the 5 most recent rides from Supabase
      const { data, error } = await supabase
        .from('viajes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent rides:", error);
        setError(error.message);
        return;
      }
      
      setRecentRides(data || []);
    } catch (err: any) {
      console.error("Exception in fetchRecentRides:", err);
      setError(err.message || "Error al cargar viajes recientes");
    } finally {
      setLoading(false);
    }
  };

  // Load recent rides on component mount
  useEffect(() => {
    fetchRecentRides();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('rides_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'viajes' 
        }, 
        () => {
          // Refresh the rides list when a new ride is inserted
          fetchRecentRides();
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Viajes recientes</h2>
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Viajes recientes</h2>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Error: {error}</p>
          <Button 
            variant="outline" 
            onClick={fetchRecentRides} 
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (recentRides.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Viajes recientes</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes viajes recientes</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status badge style based on state
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'programado':
        return 'bg-blue-100 text-blue-800';
      case 'en_curso':
      case 'en curso':
        return 'bg-green-100 text-green-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Viajes recientes</h2>
      
      <div className="space-y-4">
        {recentRides.map((ride) => (
          <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="text-sm font-medium truncate max-w-[250px]">
                    {ride.origen || "Origen no especificado"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-red-600" />
                  <span className="text-sm font-medium truncate max-w-[250px]">
                    {ride.destino || "Destino no especificado"}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusBadge(ride.estado)}`}>
                  {ride.estado}
                </span>
                
                {ride.precio_estimado && (
                  <div className="font-bold mt-1">
                    {ride.precio_estimado.toFixed(2)} €
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                {formatDate(ride.created_at)}
              </div>
              
              {ride.hora_programada && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(ride.hora_programada)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button 
          variant="link" 
          className="text-blue-600"
          onClick={fetchRecentRides}
        >
          Actualizar historial
        </Button>
      </div>
    </div>
  );
};

export default RecentRidesSection;
