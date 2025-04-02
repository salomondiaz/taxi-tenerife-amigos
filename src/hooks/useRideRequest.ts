
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates, Ride } from "@/components/map/types";

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
      // Creamos un objeto de tipo Ride con la estructura correcta
      const rideData = {
        id: `ride-${Date.now()}`,
        origin: {
          ...originCoords,
          address: origin || originCoords.address || "Ubicación sin nombre", // Aseguramos que siempre haya una dirección
        },
        destination: {
          ...destinationCoords,
          address: destination || destinationCoords.address || "Destino sin nombre", // Aseguramos que siempre haya una dirección
        },
        status: "pending" as const,
        requestTime: new Date(),
        price: estimatedPrice,
        distance: estimatedDistance,
        createdAt: new Date().toISOString(),
        paymentMethodId: paymentMethodId,
      };

      // Guardar en el contexto de la aplicación
      setCurrentRide(rideData as any); // Usamos type assertion para evitar el error de tipo

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
