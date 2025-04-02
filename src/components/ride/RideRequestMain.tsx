
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
  const { saveHomeAddress, useHomeAddress } = useHomeLocationStorage();
  const { saveRideToSupabase } = useRideSaver(
    origin, 
    destination, 
    originCoords, 
    destinationCoords, 
    calculateEstimates, 
    estimatedPrice || 0,
    scheduledTime
  );

  // Function to use home as destination
  const handleUseHomeAsDestination = () => {
    const homeLocation = localStorage.getItem('user_home_location');
    
    if (homeLocation) {
      try {
        const parsed = JSON.parse(homeLocation);
        handleDestinationChange(parsed);
        setDestination(parsed.address || "Mi Casa");
        toast({
          title: "Casa seleccionada como destino",
          description: "Tu ubicación de casa ha sido establecida como destino."
        });
      } catch (error) {
        console.error("Error parsing home location:", error);
        toast({
          title: "Error",
          description: "No se pudo establecer tu casa como destino. Por favor guarda primero tu ubicación de casa.",
          variant: "destructive"
        });
      }
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
            saveHomeAddress={() => saveHomeAddress(origin)}
            isLoading={isLoading}
            calculateEstimates={calculateEstimates}
            handleUseHomeAsDestination={handleUseHomeAsDestination}
            scheduledTime={scheduledTime}
          />
          
          <EstimateSection 
            estimatedDistance={estimatedDistance}
            estimatedTime={estimatedTime}
            trafficLevel={trafficLevel}
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
            trafficLevel={trafficLevel}
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
