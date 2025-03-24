
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapCoordinates } from "@/components/map/types";

// Componentes
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import PriceEstimator from "@/components/ride/PriceEstimator";
import RideDetails from "@/components/ride/RideDetails";
import InfoSection from "@/components/ride/InfoSection";
import RidePaymentInfo from "@/components/ride/PaymentInfo";
import RequestHeader from "@/components/ride/header/RequestHeader";

// Hooks personalizados
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useGeocodingService } from "@/hooks/useGeocodingService";
import { useEstimateCalculator } from "@/hooks/useEstimateCalculator";
import { useRideRequest } from "@/hooks/useRideRequest";
import { toast } from "@/hooks/use-toast";

const RideRequestContent: React.FC = () => {
  const location = useLocation();
  const initialDestination = location.state?.destination || "";
  
  // Estado del modo de selección
  const [useManualSelection, setUseManualSelection] = useState(true); // Activado por defecto
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<MapCoordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  
  // Hooks personalizados
  const { 
    origin, setOrigin, 
    destination, setDestination, 
    handleUseCurrentLocation 
  } = useLocationTracker(initialDestination);
  
  const { 
    geocodeLocations, 
    isLoading, 
    setIsLoading 
  } = useGeocodingService();
  
  const {
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    calculateEstimatedValues
  } = useEstimateCalculator();

  const { requestRide } = useRideRequest();

  // Manejar cambios en el origen desde el mapa
  const handleOriginChange = (coords: MapCoordinates) => {
    setOriginCoords(coords);
    if (coords.address) {
      setOrigin(coords.address);
    }
    console.log("Nuevo origen desde el mapa:", coords);
  };

  // Manejar cambios en el destino desde el mapa
  const handleDestinationChange = (coords: MapCoordinates) => {
    setDestinationCoords(coords);
    if (coords.address) {
      setDestination(coords.address);
    }
    console.log("Nuevo destino desde el mapa:", coords);
  };

  // Función para calcular estimaciones
  const calculateEstimates = async () => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, selecciona origen y destino en el mapa",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await geocodeLocations(origin, destination, originCoords, destinationCoords);
      
      if (result.success && result.finalOriginCoords && result.finalDestinationCoords) {
        setOriginCoords(result.finalOriginCoords);
        setDestinationCoords(result.finalDestinationCoords);
        
        const routeData = await calculateEstimatedValues(
          result.finalOriginCoords, 
          result.finalDestinationCoords
        );
        
        if (routeData && routeData.routeGeometry) {
          setRouteGeometry(routeData.routeGeometry);
        }
      }
    } catch (error) {
      console.error("Error al calcular estimaciones:", error);
      toast({
        title: "Error de cálculo",
        description: "No se pudieron calcular las estimaciones. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Procesar la solicitud de viaje
  const handleRequestRide = () => {
    requestRide(
      origin, 
      destination, 
      originCoords, 
      destinationCoords, 
      estimatedPrice, 
      estimatedDistance
    );
  };

  return (
    <div className="min-h-screen p-6">
      <RequestHeader />
      
      {/* Selector de ubicaciones */}
      <LocationSelector
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        useManualSelection={useManualSelection}
        setUseManualSelection={setUseManualSelection}
        handleUseCurrentLocation={handleUseCurrentLocation}
      />
      
      {/* Visualizador de mapa */}
      <MapViewer
        useManualSelection={useManualSelection}
        originCoords={originCoords}
        destinationCoords={destinationCoords}
        routeGeometry={routeGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
      />
      
      {/* Estimador de precio */}
      <PriceEstimator
        origin={origin}
        originCoords={originCoords}
        destination={destination}
        destinationCoords={destinationCoords}
        isLoading={isLoading}
        calculateEstimates={calculateEstimates}
      />

      {/* Detalles del viaje estimado */}
      {estimatedPrice !== null && (
        <>
          <RideDetails
            estimatedPrice={estimatedPrice}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            isLoading={isLoading}
            handleRequestRide={handleRequestRide}
          />
          
          {/* Información de pago en efectivo */}
          <RidePaymentInfo />
        </>
      )}

      {/* Sección de información */}
      <InfoSection />
    </div>
  );
};

export default RideRequestContent;
