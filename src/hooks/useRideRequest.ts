
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";

export const useRideRequest = () => {
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  const requestRide = async (
    origin: string,
    destination: string,
    originCoords: MapCoordinates | null,
    destinationCoords: MapCoordinates | null,
    estimatedPrice: number | null,
    estimatedDistance: number | null,
    paymentMethodId: string,
    scheduledDate?: Date
  ) => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona origen y destino en el mapa",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsRequesting(true);

      const rideData = {
        origen: origin,
        destino: destination,
        origen_lat: originCoords.lat,
        origen_lng: originCoords.lng,
        destino_lat: destinationCoords.lat,
        destino_lng: destinationCoords.lng,
        precio_estimado: estimatedPrice || 0,
        estado: "pendiente",
        hora_programada: scheduledDate ? scheduledDate.toISOString() : null,
        usuario: "anonymous", // Replace with actual user ID when auth is implemented
        distancia_estimada: estimatedDistance,
        metodo_pago: paymentMethodId
      };

      console.log("Attempting to save ride data:", rideData);

      // Check connection to Supabase
      const { data: pingData, error: pingError } = await supabase.from('tabla de prueba').select('*').limit(1);
      
      if (pingError) {
        console.error("Error connecting to Supabase:", pingError);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor. Por favor intenta más tarde.",
          variant: "destructive",
        });
        return null;
      }

      // Insert ride data
      const { data, error } = await supabase.from("viajes").insert([rideData]).select();

      if (error) {
        console.error("Error requesting ride:", error);
        toast({
          title: "Error al solicitar viaje",
          description: "No se pudo procesar tu solicitud. Por favor intenta de nuevo.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Ride data saved successfully:", data);

      // Success message
      toast({
        title: scheduledDate ? "Viaje Programado" : "Viaje Solicitado",
        description: scheduledDate
          ? `Tu viaje ha sido programado para el ${scheduledDate.toLocaleDateString()} a las ${scheduledDate.toLocaleTimeString()}`
          : "Tu solicitud de viaje ha sido recibida. Pronto recibirás confirmación.",
      });

      // Return the created ride data
      return data?.[0] || null;
    } catch (error) {
      console.error("Exception requesting ride:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar tu solicitud",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    requestRide,
    isRequesting,
  };
};
