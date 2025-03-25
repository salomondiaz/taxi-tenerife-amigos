
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapCoordinates } from "@/components/map/types";

// Componentes
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import PriceEstimator from "@/components/ride/PriceEstimator";
import RideDetails from "@/components/ride/RideDetails";
import TrafficInfo from "@/components/ride/TrafficInfo";
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
  
  // Nuevos estados para información de tráfico
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'moderate' | 'heavy' | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  
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

  // Calcular la hora de llegada estimada
  const calculateArrivalTime = (estimatedTimeMinutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + estimatedTimeMinutes);
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Simular nivel de tráfico basado en la distancia y el tiempo
  const calculateTrafficLevel = (distance: number, time: number): 'low' | 'moderate' | 'heavy' => {
    // Velocidad promedio en km/h
    const avgSpeed = distance / (time / 60);
    
    if (avgSpeed > 40) return 'low';
    if (avgSpeed > 25) return 'moderate';
    return 'heavy';
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
          
          // Calcular información de tráfico
          if (routeData.distance && routeData.time) {
            const traffic = calculateTrafficLevel(routeData.distance, routeData.time);
            setTrafficLevel(traffic);
            
            // Ajustar tiempo estimado según tráfico
            let adjustedTime = routeData.time;
            if (traffic === 'moderate') {
              adjustedTime = Math.ceil(adjustedTime * 1.2); // 20% más tiempo
            } else if (traffic === 'heavy') {
              adjustedTime = Math.ceil(adjustedTime * 1.5); // 50% más tiempo
            }
            
            setArrivalTime(calculateArrivalTime(adjustedTime));
          }
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

      {/* Información de tráfico */}
      {estimatedTime !== null && (
        <TrafficInfo 
          estimatedTime={estimatedTime}
          trafficLevel={trafficLevel}
          arrivalTime={arrivalTime}
        />
      )}

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
