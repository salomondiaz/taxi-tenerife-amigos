
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import { useRideSaver } from "@/hooks/useRideSaver";
import { MapCoordinates, TrafficLevel } from "@/components/map/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const useRideRequestMain = () => {
  const { toast } = useToast();
  const location = useLocation();
  const locationState = location.state || {};
  const scheduledTimeFromLocation = locationState.scheduledTime;
  const setHomeLocation = locationState.setHomeLocation || false;
  
  // Estado para viaje programado
  const [scheduledTime, setScheduledTime] = useState<string | undefined>(scheduledTimeFromLocation);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    originCoords,
    destinationCoords,
    routeGeometry,
    isLoading,
    handleUseCurrentLocation,
    handleOriginChange,
    handleDestinationChange,
    calculateEstimates,
    handleRequestRide,
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    trafficLevel,
    arrivalTime
  } = useRideRequestFlow();

  const [useManualSelection, setUseManualSelection] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Custom hooks
  const { 
    saveHomeLocation,
    updateHomeLocation,
    loadHomeLocation
  } = useHomeLocationStorage();
  
  const { saveRideToSupabase } = useRideSaver(
    origin, 
    destination, 
    originCoords, 
    destinationCoords, 
    calculateEstimates, 
    estimatedPrice || 0
  );
  
  // Handle scheduling a ride
  const handleScheduleRide = (date: Date) => {
    const formattedDate = format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    setScheduledTime(formattedDate);
    setScheduledDate(date);
  };

  // Helper functions for home location
  const saveHomeAddress = () => {
    if (originCoords) {
      saveHomeLocation(originCoords);
      toast({
        title: "Casa guardada",
        description: "Tu ubicación ha sido guardada como tu casa."
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Necesitas seleccionar una ubicación primero.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const useHomeAddress = (
    setOriginFunc: (address: string) => void, 
    handleOriginChangeFunc: (coordinates: MapCoordinates) => void
  ) => {
    const home = loadHomeLocation();
    if (home) {
      setOriginFunc(home.address || "Mi Casa");
      handleOriginChangeFunc(home);
      toast({
        title: "Casa seleccionada como origen",
        description: "Tu ubicación de casa ha sido establecida como punto de origen."
      });
      return true;
    } else {
      toast({
        title: "No hay casa guardada",
        description: "Primero debes guardar una ubicación como casa.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to use home as destination
  const handleUseHomeAsDestination = () => {
    const homeLocation = loadHomeLocation();
    
    if (homeLocation) {
      handleDestinationChange(homeLocation);
      setDestination(homeLocation.address || "Mi Casa");
      toast({
        title: "Casa seleccionada como destino",
        description: "Tu ubicación de casa ha sido establecida como destino."
      });
    } else {
      toast({
        title: "Casa no encontrada",
        description: "No tienes una ubicación de casa guardada. Guarda tu casa primero.",
        variant: "destructive"
      });
    }
  };

  // Process ride
  const handleRideRequest = () => {
    if (selectedPaymentMethod) {
      if (scheduledDate) {
        // Si es un viaje programado, guardarlo con la fecha programada
        saveRideToSupabase(scheduledDate);
      } else {
        // Si es un viaje inmediato, seguir el flujo normal
        handleRequestRide(selectedPaymentMethod);
      }
    } else {
      toast({
        title: "Selecciona un método de pago",
        description: "Por favor, selecciona un método de pago para continuar",
        variant: "destructive",
      });
    }
  };

  return {
    scheduledTime,
    setScheduledTime,
    scheduledDate,
    setScheduledDate,
    handleScheduleRide,
    origin,
    setOrigin,
    destination,
    setDestination,
    originCoords,
    destinationCoords,
    routeGeometry,
    isLoading,
    useManualSelection,
    setUseManualSelection,
    handleUseCurrentLocation,
    handleOriginChange,
    handleDestinationChange,
    saveHomeAddress,
    useHomeAddress,
    handleUseHomeAsDestination,
    calculateEstimates,
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    trafficLevel,
    arrivalTime,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    handleRideRequest,
    saveRideToSupabase,
    setHomeLocation
  };
};
