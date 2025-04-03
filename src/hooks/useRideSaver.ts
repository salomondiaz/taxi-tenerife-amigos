
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import { useRouter } from "react-router-dom";

export const useRideSaver = (
  origin: string,
  destination: string,
  originCoords: MapCoordinates | null,
  destinationCoords: MapCoordinates | null,
  calculateEstimates: () => void,
  estimatedPrice: number = 0,
  scheduledTime?: string
) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Save ride details to Supabase
   */
  const saveRideToSupabase = async (scheduledDate?: Date) => {
    // Validate required data
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona origen y destino",
        variant: "destructive",
      });
      return false;
    }

    // Calculate estimates if needed
    if (estimatedPrice === 0) {
      calculateEstimates();
    }

    try {
      setIsSaving(true);
      
      // Prepare ride data
      const rideData = {
        origen: origin,
        destino: destination,
        origen_lat: originCoords.lat,
        origen_lng: originCoords.lng,
        destino_lat: destinationCoords.lat,
        destino_lng: destinationCoords.lng,
        precio_estimado: estimatedPrice,
        estado: "pendiente",
        hora_programada: scheduledDate ? scheduledDate.toISOString() : null,
        usuario: "anonymous", // Replace with user ID once authentication is implemented
      };

      // Save to Supabase
      const { data, error } = await supabase.from("viajes").insert([rideData]).select();

      if (error) {
        console.error("Error saving ride to Supabase:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudo guardar el viaje. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
        return false;
      }

      // Show success message
      toast({
        title: scheduledDate ? "Viaje Programado" : "Viaje Solicitado",
        description: scheduledDate 
          ? "Tu viaje ha sido programado con éxito" 
          : "Tu viaje ha sido registrado con éxito. Un conductor lo verá pronto.",
        variant: "default",
      });

      // Return ride data
      return data && data[0];
    } catch (error) {
      console.error("Exception saving ride:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar tu solicitud",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveRideToSupabase,
    isSaving,
  };
};
