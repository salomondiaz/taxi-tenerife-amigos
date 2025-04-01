
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapCoordinates } from "@/components/map/types";

export const useRideSaver = (
  origin: string,
  destination: string, 
  originCoords: MapCoordinates | null,
  destinationCoords: MapCoordinates | null,
  calculateEstimates: () => Promise<void>,
  estimatedPrice: number
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveRideToSupabase = useCallback(async () => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, selecciona origen y destino en el mapa",
        variant: "destructive",
      });
      return;
    }

    if (isSaving) return; // Evitar guardado múltiple
    setIsSaving(true);

    try {
      // Calcular estimaciones primero
      if (estimatedPrice === 0) {
        await calculateEstimates();
      }

      // Preparar datos para guardar
      const rideData = {
        origen: origin || originCoords.address || `${originCoords.lat},${originCoords.lng}`,
        destino: destination || destinationCoords.address || `${destinationCoords.lat},${destinationCoords.lng}`,
        estado: 'pendiente',
        // Agregar más campos según sea necesario
      };

      // Guardar en Supabase
      const { data, error } = await supabase
        .from('viajes')
        .insert(rideData)
        .select();

      if (error) {
        console.error("Error al guardar viaje:", error);
        toast({
          title: "Error al guardar viaje",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Viaje guardado exitosamente:", data);
        toast({
          title: "Viaje guardado exitosamente",
          description: "Tu viaje ha sido guardado con estado 'pendiente'",
        });
      }
    } catch (error) {
      console.error("Error en saveRideToSupabase:", error);
      toast({
        title: "Error al procesar la solicitud",
        description: "Ha ocurrido un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [origin, destination, originCoords, destinationCoords, estimatedPrice, calculateEstimates, toast, isSaving]);

  return { saveRideToSupabase, isSaving };
};
