
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { MapCoordinates } from "@/components/map/types";

export function useRideRequest() {
  const navigate = useNavigate();
  const { setCurrentRide } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const requestRide = (
    origin: string,
    destination: string,
    originCoords: MapCoordinates | null,
    destinationCoords: MapCoordinates | null,
    estimatedPrice: number | null,
    estimatedDistance: number | null
  ) => {
    if (!origin || !destination || !estimatedPrice || !originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, calcula primero el precio estimado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulación de solicitud de viaje
    setTimeout(() => {
      // Crear un nuevo viaje
      const newRide = {
        id: `ride-${Date.now()}`,
        origin: {
          address: origin,
          lat: originCoords.lat,
          lng: originCoords.lng,
        },
        destination: {
          address: destination,
          lat: destinationCoords.lat,
          lng: destinationCoords.lng,
        },
        status: "pending" as "pending" | "accepted" | "ongoing" | "completed" | "cancelled",
        requestTime: new Date(),
        price: estimatedPrice,
        distance: estimatedDistance,
      };

      // Actualizar el contexto con el nuevo viaje
      setCurrentRide(newRide);

      toast({
        title: "¡Viaje solicitado!",
        description: "Buscando conductores disponibles...",
      });

      setIsLoading(false);
      navigate("/tracking");
    }, 1500);
  };

  return {
    requestRide,
    isLoading,
    setIsLoading
  };
}
