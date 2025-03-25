
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";

// Components
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import InfoSection from "@/components/ride/InfoSection";
import RequestHeader from "@/components/ride/header/RequestHeader";
import RouteCalculator from "@/components/ride/RouteCalculator";
import RouteResults from "@/components/ride/RouteResults";

// Custom hooks
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useGeocodingService } from "@/hooks/useGeocodingService";
import { useEstimateCalculator } from "@/hooks/useEstimateCalculator";
import { useRideRequest } from "@/hooks/useRideRequest";
import { useTrafficCalculator } from "@/hooks/useTrafficCalculator";
import { useFavoriteLocations } from "@/hooks/useFavoriteLocations";

const RideRequestContent: React.FC = () => {
  const location = useLocation();
  const initialDestination = location.state?.destination || "";
  const useHomeAsOrigin = location.state?.useHomeAsOrigin || false;
  const setHomeLocationMode = location.state?.setHomeLocation || false;
  
  // Selection mode state
  const [useManualSelection, setUseManualSelection] = useState(true); // Enabled by default
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<MapCoordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  
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
  
  const {
    trafficLevel,
    arrivalTime,
    updateTrafficInfo
  } = useTrafficCalculator();
  
  const { getLocationByType, saveFavoriteLocation } = useFavoriteLocations();

  // Cargar ubicación de casa si viene con ese parámetro
  useEffect(() => {
    if (useHomeAsOrigin) {
      const homeLocation = getLocationByType('home');
      if (homeLocation) {
        setOriginCoords(homeLocation.coordinates);
        setOrigin(homeLocation.coordinates.address || "Mi Casa");
        toast({
          title: "Casa seleccionada como origen",
          description: "Tu ubicación de casa ha sido establecida como punto de origen."
        });
      }
    }
  }, [useHomeAsOrigin, getLocationByType, setOrigin]);

  // Handle origin change from map
  const handleOriginChange = (coords: MapCoordinates) => {
    setOriginCoords(coords);
    if (coords.address) {
      setOrigin(coords.address);
    }
    console.log("New origin from map:", coords);
    
    // If we're in set home location mode, save this as home
    if (setHomeLocationMode) {
      const homeLocation = {
        id: "home",
        name: "Mi Casa",
        coordinates: coords,
        type: 'home' as const,
        icon: '🏠'
      };
      
      const success = saveFavoriteLocation(homeLocation);
      if (success) {
        toast({
          title: "Casa guardada",
          description: "Ubicación guardada como tu casa exitosamente."
        });
      }
    }
  };

  // Handle destination change from map
  const handleDestinationChange = (coords: MapCoordinates) => {
    setDestinationCoords(coords);
    if (coords.address) {
      setDestination(coords.address);
    }
    console.log("New destination from map:", coords);
  };

  // Function to handle selection of a saved location
  const handleSelectSavedLocation = (coordinates: MapCoordinates, address?: string) => {
    setOriginCoords(coordinates);
    if (address) {
      setOrigin(address);
    }
    console.log("Selected saved location:", coordinates);
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
            updateTrafficInfo(routeData.distance, routeData.time);
            
            // Mostrar mensaje de éxito con la información de la ruta
            toast({
              title: "Ruta calculada",
              description: `Distancia: ${routeData.distance.toFixed(1)} km - Tiempo estimado: ${routeData.time} min`
            });
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
        originCoords={originCoords}
        onSelectLocation={handleSelectSavedLocation}
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
      
      {/* Route calculator */}
      <RouteCalculator
        origin={origin}
        originCoords={originCoords}
        destination={destination}
        destinationCoords={destinationCoords}
        isLoading={isLoading}
        calculateEstimates={calculateEstimates}
      />

      {/* Route results */}
      <RouteResults
        estimatedPrice={estimatedPrice}
        estimatedTime={estimatedTime}
        estimatedDistance={estimatedDistance}
        trafficLevel={trafficLevel}
        arrivalTime={arrivalTime}
        isLoading={isLoading}
        handleRequestRide={handleRequestRide}
      />

      {/* Information section */}
      <InfoSection />
    </div>
  );
};

export default RideRequestContent;
