
import React, { useState, useEffect } from "react";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { useToast } from "@/hooks/use-toast";
import LocationInputSection from "./LocationInputSection";
import MapViewSection from "./MapViewSection";
import EstimateSection from "./EstimateSection";
import { useHomeAddressManager } from "@/hooks/useHomeAddressManager";
import { useRideSaver } from "@/hooks/useRideSaver";

const RideRequestMain: React.FC = () => {
  // Move useToast to the top level before using it
  const { toast } = useToast();
  
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
  const { saveHomeAddress, useHomeAddress } = useHomeAddressManager();
  const { saveRideToSupabase } = useRideSaver(
    origin, 
    destination, 
    originCoords, 
    destinationCoords, 
    calculateEstimates, 
    estimatedPrice || 0
  );

  // Function to use home as destination
  const handleUseHomeAsDestination = () => {
    const homeLocation = localStorage.getItem('home_location');
    
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

  // Process ride
  const handleRideRequest = () => {
    if (selectedPaymentMethod) {
      handleRequestRide(selectedPaymentMethod);
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
          />
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
