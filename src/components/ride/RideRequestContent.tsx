
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapCoordinates } from "@/components/map/types";

// Components
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import PriceEstimator from "@/components/ride/PriceEstimator";
import RideDetails from "@/components/ride/RideDetails";
import TrafficInfo from "@/components/ride/TrafficInfo";
import InfoSection from "@/components/ride/InfoSection";
import RidePaymentInfo from "@/components/ride/PaymentInfo";
import RequestHeader from "@/components/ride/header/RequestHeader";

// Custom hooks
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useGeocodingService } from "@/hooks/useGeocodingService";
import { useEstimateCalculator } from "@/hooks/useEstimateCalculator";
import { useRideRequest } from "@/hooks/useRideRequest";
import { toast } from "@/hooks/use-toast";

const RideRequestContent: React.FC = () => {
  const location = useLocation();
  const initialDestination = location.state?.destination || "";
  
  // Selection mode state
  const [useManualSelection, setUseManualSelection] = useState(true); // Enabled by default
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<MapCoordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  
  // New states for traffic information
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'moderate' | 'heavy' | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  
  // Custom hooks
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

  // Handle origin change from map
  const handleOriginChange = (coords: MapCoordinates) => {
    setOriginCoords(coords);
    if (coords.address) {
      setOrigin(coords.address);
    }
    console.log("New origin from map:", coords);
  };

  // Handle destination change from map
  const handleDestinationChange = (coords: MapCoordinates) => {
    setDestinationCoords(coords);
    if (coords.address) {
      setDestination(coords.address);
    }
    console.log("New destination from map:", coords);
  };

  // Calculate estimated arrival time
  const calculateArrivalTime = (estimatedTimeMinutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + estimatedTimeMinutes);
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Simulate traffic level based on distance and time
  const calculateTrafficLevel = (distance: number, time: number): 'low' | 'moderate' | 'heavy' => {
    // Average speed in km/h
    const avgSpeed = distance / (time / 60);
    
    if (avgSpeed > 40) return 'low';
    if (avgSpeed > 25) return 'moderate';
    return 'heavy';
  };

  // Function to calculate estimates
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
          
          // Calculate traffic information
          if (routeData.distance && routeData.time) {
            const traffic = calculateTrafficLevel(routeData.distance, routeData.time);
            setTrafficLevel(traffic);
            
            // Adjust estimated time based on traffic
            let adjustedTime = routeData.time;
            if (traffic === 'moderate') {
              adjustedTime = Math.ceil(adjustedTime * 1.2); // 20% more time
            } else if (traffic === 'heavy') {
              adjustedTime = Math.ceil(adjustedTime * 1.5); // 50% more time
            }
            
            setArrivalTime(calculateArrivalTime(adjustedTime));
          }
        }
      }
    } catch (error) {
      console.error("Error calculating estimates:", error);
      toast({
        title: "Error de cálculo",
        description: "No se pudieron calcular las estimaciones. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Process ride request
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
      
      {/* Location selector */}
      <LocationSelector
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        useManualSelection={useManualSelection}
        setUseManualSelection={setUseManualSelection}
        handleUseCurrentLocation={handleUseCurrentLocation}
      />
      
      {/* Map viewer */}
      <MapViewer
        useManualSelection={useManualSelection}
        originCoords={originCoords}
        destinationCoords={destinationCoords}
        routeGeometry={routeGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
      />
      
      {/* Price estimator */}
      <PriceEstimator
        origin={origin}
        originCoords={originCoords}
        destination={destination}
        destinationCoords={destinationCoords}
        isLoading={isLoading}
        calculateEstimates={calculateEstimates}
      />

      {/* Traffic information */}
      {estimatedTime !== null && (
        <TrafficInfo 
          estimatedTime={estimatedTime}
          trafficLevel={trafficLevel}
          arrivalTime={arrivalTime}
        />
      )}

      {/* Ride details */}
      {estimatedPrice !== null && (
        <>
          <RideDetails
            estimatedPrice={estimatedPrice}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            isLoading={isLoading}
            handleRequestRide={handleRequestRide}
          />
          
          {/* Payment information */}
          <RidePaymentInfo />
        </>
      )}

      {/* Information section */}
      <InfoSection />
    </div>
  );
};

export default RideRequestContent;
