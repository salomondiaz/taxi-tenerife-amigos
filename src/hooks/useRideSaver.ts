
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
  estimatedPrice: number,
  scheduledTime?: string
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
        estado: scheduledTime ? 'programado' : 'pendiente',
        // Agregar campo de hora programada si existe
        ...(scheduledTime && { hora_programada: scheduledTime })
      };

      console.log("Guardando viaje:", rideData);

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
        return null;
      } else {
        console.log("Viaje guardado exitosamente:", data);
        
        // Actualizar historial en localStorage para retrocompatibilidad
        try {
          const history = JSON.parse(localStorage.getItem('ride_history') || '[]');
          const newRide = {
            ...data[0],
            date: new Date(),
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null
          };
          
          history.unshift(newRide);
          localStorage.setItem('ride_history', JSON.stringify(history));
        } catch (localError) {
          console.error("Error actualizando historial local:", localError);
        }
        
        toast({
          title: scheduledTime 
            ? "Viaje programado exitosamente" 
            : "Viaje guardado exitosamente",
          description: scheduledTime
            ? `Tu viaje ha sido programado para ${new Date(scheduledTime).toLocaleString()}`
            : "Tu viaje ha sido guardado con estado 'pendiente'",
        });
        
        return data[0];
      }
    } catch (error) {
      console.error("Error en saveRideToSupabase:", error);
      toast({
        title: "Error al procesar la solicitud",
        description: "Ha ocurrido un error al procesar la solicitud",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [origin, destination, originCoords, destinationCoords, estimatedPrice, calculateEstimates, toast, isSaving, scheduledTime]);

  return { saveRideToSupabase, isSaving };
};
