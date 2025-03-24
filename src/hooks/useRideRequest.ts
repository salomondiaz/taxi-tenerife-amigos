import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { MapCoordinates } from "@/components/map/types";

const RIDE_HISTORY_KEY = 'ride_history';

type RideHistoryEntry = {
  id: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  requestTime: string; // ISO string
  price: number;
  distance: number | null;
};

export function useRideRequest() {
  const navigate = useNavigate();
  const { setCurrentRide } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const saveRideToHistory = (ride: RideHistoryEntry) => {
    try {
      const historyJSON = localStorage.getItem(RIDE_HISTORY_KEY);
      const history: RideHistoryEntry[] = historyJSON ? JSON.parse(historyJSON) : [];
      
      history.unshift(ride);
      
      const trimmedHistory = history.slice(0, 20);
      
      localStorage.setItem(RIDE_HISTORY_KEY, JSON.stringify(trimmedHistory));
      
      console.log("Ride saved to history:", ride);
    } catch (error) {
      console.error("Error saving ride to history:", error);
    }
  };

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

    setTimeout(() => {
      const rideId = `ride-${Date.now()}`;
      const requestTime = new Date();
      
      const newRide = {
        id: rideId,
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
        requestTime: requestTime,
        price: estimatedPrice,
        distance: estimatedDistance,
      };

      setCurrentRide(newRide);
      
      saveRideToHistory({
        ...newRide,
        requestTime: requestTime.toISOString(),
      });

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
