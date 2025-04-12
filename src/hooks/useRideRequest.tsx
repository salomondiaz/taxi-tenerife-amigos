
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";

export const useRideRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const requestRide = async (
    origin: string,
    destination: string,
    originCoords: MapCoordinates | null,
    destinationCoords: MapCoordinates | null,
    price: number,
    distance: number | null,
    paymentMethod: string,
    scheduledDate?: Date
  ) => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Selecciona puntos de origen y destino válidos",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || "anonymous";

      const { data, error } = await supabase.from("viajes").insert([
        {
          origen: origin,
          destino: destination,
          origen_lat: originCoords.lat,
          origen_lng: originCoords.lng,
          destino_lat: destinationCoords.lat,
          destino_lng: destinationCoords.lng,
          precio_estimado: price,
          estado: scheduledDate ? "programado" : "pendiente",
          usuario: userId,
          hora_programada: scheduledDate ? scheduledDate.toISOString() : null,
          metodo_pago: paymentMethod,
          distancia_km: distance,
        },
      ]).select();

      if (error) {
        console.error("Error al solicitar viaje:", error);
        toast({
          title: "Error al solicitar",
          description: "No se pudo procesar tu solicitud. Por favor, intenta nuevamente.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Viaje solicitado:", data);
      
      // Mostrar mensaje según si es programado o no
      const message = scheduledDate 
        ? "Tu viaje ha sido programado para " + scheduledDate.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : "Tu viaje ha sido solicitado. Un conductor te recogerá pronto.";
      
      toast({
        title: scheduledDate ? "Viaje programado" : "Viaje solicitado",
        description: message,
      });

      // Si no es programado, redirigir a la pantalla de viaje activo
      if (!scheduledDate && data && data[0]) {
        // Esperar un poco para dar tiempo a ver el toast
        setTimeout(() => {
          navigate(`/viaje/${data[0].id}`, { 
            state: { 
              rideData: data[0],
              origin: originCoords,
              destination: destinationCoords,
              price,
              distance,
            } 
          });
        }, 1000);
      } else if (scheduledDate && data && data[0]) {
        // Si es programado, redirigir a la pantalla de historial
        setTimeout(() => {
          navigate(`/historial`, { 
            state: { 
              highlightRideId: data[0].id,
              showThanks: true 
            } 
          });
        }, 2000);
      }

      return data ? data[0] : null;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestRide,
    isLoading,
  };
};
