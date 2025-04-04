
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import EnhancedLocationSelector from "./EnhancedLocationSelector";
import MapViewSection from "./MapViewSection";
import RouteCalculator from "./RouteCalculator";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const RideRequestMain: React.FC = () => {
  const location = useLocation();
  const {
    useManualSelection,
    setUseManualSelection,
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
    trafficLevel
  } = useRideRequestFlow();

  const [activeTab, setActiveTab] = useState<"map" | "info">("map");
  
  // Get locations from context
  const { getLocationByType } = useFavoriteLocations();
  
  const useHomeAddress = () => {
    const homeLocation = getLocationByType('home');
    if (homeLocation) {
      handleOriginChange(homeLocation.coordinates);
      setOrigin(homeLocation.coordinates.address || "Mi Casa");
      toast({
        title: "Casa como origen",
        description: "Tu ubicación de casa ha sido establecida como punto de origen"
      });
    } else {
      toast({
        title: "No tienes una casa guardada",
        description: "Configura tu ubicación de casa en Ajustes",
        variant: "destructive"
      });
    }
  };
  
  const saveHomeAddress = () => {
    if (!originCoords) {
      toast({
        title: "Selecciona un origen primero",
        description: "Marca un punto en el mapa para guardar como casa",
        variant: "destructive"
      });
      return;
    }
    
    // Call the hook to save the home location
    const { saveHomeLocation } = useHomeLocationStorage();
    saveHomeLocation(originCoords);
    
    toast({
      title: "Casa guardada",
      description: "Tu ubicación actual ha sido guardada como tu casa"
    });
  };
  
  const useHomeAsDestination = () => {
    const homeLocation = getLocationByType('home');
    if (homeLocation) {
      handleDestinationChange(homeLocation.coordinates);
      setDestination(homeLocation.coordinates.address || "Mi Casa");
      toast({
        title: "Casa como destino",
        description: "Tu ubicación de casa ha sido establecida como punto de destino"
      });
    } else {
      toast({
        title: "No tienes una casa guardada",
        description: "Configura tu ubicación de casa en Ajustes",
        variant: "destructive"
      });
    }
  };

  // Request a ride
  const handleSubmitRideRequest = () => {
    if (!estimatedPrice || !originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, calcula el precio antes de solicitar",
        variant: "destructive"
      });
      return;
    }
    
    handleRequestRide("efectivo"); // Default to cash payment
  };

  // Import required hooks
  const { useFavoriteLocations } = require("@/hooks/useFavoriteLocations");
  const { useHomeLocationStorage } = require("@/hooks/useHomeLocationStorage");

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Map on desktop */}
        <div className="col-span-1 lg:col-span-7 order-2 lg:order-1">
          <MapViewSection 
            useManualSelection={useManualSelection}
            originCoords={originCoords}
            destinationCoords={destinationCoords}
            routeGeometry={routeGeometry}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            saveRideToSupabase={handleSubmitRideRequest}
            useHomeAsDestination={useHomeAsDestination}
            allowHomeEditing={true}
            trafficLevel={trafficLevel}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            estimatedPrice={estimatedPrice}
          />
        </div>
        
        {/* Right column - ride info */}
        <div className="col-span-1 lg:col-span-5 order-1 lg:order-2 space-y-4">
          <EnhancedLocationSelector 
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            onOriginCoordinatesChange={handleOriginChange}
            onDestinationCoordinatesChange={handleDestinationChange}
            handleUseCurrentLocation={handleUseCurrentLocation}
            useHomeAddress={useHomeAddress}
            saveHomeAddress={saveHomeAddress}
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            calculateEstimates={calculateEstimates}
            isCalculating={isLoading}
          />
          
          {/* Calculation buttons */}
          <RouteCalculator
            origin={origin}
            originCoords={originCoords}
            destination={destination}
            destinationCoords={destinationCoords}
            isLoading={isLoading}
            calculateEstimates={calculateEstimates}
          />
          
          {/* Request button (only shown if price is calculated) */}
          {estimatedPrice && estimatedDistance && estimatedTime && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Button 
                onClick={handleSubmitRideRequest}
                className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
              >
                <Car className="mr-2" size={24} />
                Solicitar Taxi ({estimatedPrice.toFixed(2)}€)
              </Button>
              <p className="text-sm text-center mt-2 text-gray-500">
                Tiempo estimado de espera: 3-5 minutos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
