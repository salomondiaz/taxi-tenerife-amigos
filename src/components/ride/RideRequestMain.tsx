
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { useToast } from "@/hooks/use-toast";
import LocationInputSection from "./LocationInputSection";
import MapViewSection from "./MapViewSection";
import EstimateSection from "./EstimateSection";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import { useRideSaver } from "@/hooks/useRideSaver";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapCoordinates, TrafficLevel } from "@/components/map/types";

const RideRequestMain: React.FC = () => {
  // Move useToast to the top level before using it
  const { toast } = useToast();
  const location = useLocation();
  const scheduledTimeFromLocation = location.state?.scheduledTime;
  const setHomeLocation = location.state?.setHomeLocation || false;
  
  // Estado para viaje programado
  const [scheduledTime, setScheduledTime] = useState<string | undefined>(scheduledTimeFromLocation);
  
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
    estimatedPrice || 0,
    scheduledTime
  );

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

  // Log coordinates for debugging
  useEffect(() => {
    console.log("Coordenadas actuales en RideRequestMain:", { 
      originCoords, 
      destinationCoords,
      origin,
      destination
    });
  }, [originCoords, destinationCoords, origin, destination]);
  
  // Formatear la fecha programada para mostrarse
  const formatScheduledTime = () => {
    if (!scheduledTime) return "";
    
    try {
      const date = new Date(scheduledTime);
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return scheduledTime;
    }
  };

  // Process ride
  const handleRideRequest = () => {
    if (selectedPaymentMethod) {
      if (scheduledTime) {
        // Si es un viaje programado, guardarlo directamente en Supabase
        saveRideToSupabase();
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Mostrar banner si es un viaje programado */}
      {scheduledTime && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-medium text-amber-800">Viaje programado</h3>
            <p className="text-amber-700 text-sm">Para: {formatScheduledTime()}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Location Inputs and Estimates */}
        <div className="lg:col-span-5 space-y-4">
          <LocationInputSection 
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            handleUseCurrentLocation={handleUseCurrentLocation}
            useHomeAddress={() => useHomeAddress(setOrigin, handleOriginChange)}
            saveHomeAddress={saveHomeAddress}
            isLoading={isLoading}
            calculateEstimates={calculateEstimates}
            handleUseHomeAsDestination={handleUseHomeAsDestination}
            scheduledTime={scheduledTime}
          />
          
          <EstimateSection 
            estimatedDistance={estimatedDistance}
            estimatedTime={estimatedTime}
            trafficLevel={trafficLevel as TrafficLevel}
            arrivalTime={arrivalTime}
            estimatedPrice={estimatedPrice}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handleRideRequest={handleRideRequest}
            visible={originCoords !== null && destinationCoords !== null}
            scheduledTime={scheduledTime}
          />
        </div>
        
        {/* Right Column - Map View */}
        <div className="lg:col-span-7">
          <MapViewSection 
            useManualSelection={useManualSelection}
            originCoords={originCoords}
            destinationCoords={destinationCoords}
            routeGeometry={routeGeometry}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            saveRideToSupabase={saveRideToSupabase}
            useHomeAsDestination={handleUseHomeAsDestination}
            allowHomeEditing={setHomeLocation}
            trafficLevel={trafficLevel as TrafficLevel}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            estimatedPrice={estimatedPrice}
            scheduledTime={scheduledTime}
          />
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
