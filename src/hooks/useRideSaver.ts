
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";

export const useRideSaver = (
  origin: string,
  destination: string,
  originCoords: MapCoordinates | null,
  destinationCoords: MapCoordinates | null,
  calculateEstimates: () => void,
  estimatedPrice: number = 0,
  scheduledTime?: string
) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Save ride details to Supabase
   * @param scheduledDate An optional Date object representing when the ride is scheduled
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

      console.log("Saving ride data:", rideData);

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
          ? "Tu viaje ha sido programado con éxito para " + scheduledDate.toLocaleString() 
          : "Tu viaje ha sido registrado con éxito. Un conductor lo verá pronto.",
        variant: "default",
      });

      console.log("Ride saved successfully:", data);

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
