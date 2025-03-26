
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";

export const useRideRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setCurrentRide } = useAppContext();

  const requestRide = (
    origin: string,
    destination: string,
    originCoords: MapCoordinates | null,
    destinationCoords: MapCoordinates | null,
    estimatedPrice: number,
    estimatedDistance: number,
    paymentMethodId: string
  ) => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, asegúrate de seleccionar un origen y un destino válidos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Aquí se haría la llamada a la API para solicitar un viaje
    // En este caso, simulamos un tiempo de respuesta
    setTimeout(() => {
      const rideData = {
        id: `ride-${Date.now()}`,
        origin: originCoords,
        destination: destinationCoords,
        originAddress: origin,
        destinationAddress: destination,
        price: estimatedPrice,
        distance: estimatedDistance,
        status: "pending",
        createdAt: new Date().toISOString(),
        paymentMethodId: paymentMethodId,
      };

      // Guardar en el contexto de la aplicación
      setCurrentRide(rideData);

      // Mostrar notificación de éxito
      toast({
        title: "¡Viaje solicitado!",
        description: "Buscando conductor disponible...",
      });

      // Redirigir a la página de seguimiento
      navigate("/ride-tracking");

      setIsSubmitting(false);
    }, 1500);
  };

  return {
    requestRide,
    isSubmitting,
  };
};
