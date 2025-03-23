
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { MapCoordinates } from "@/components/map/types";

// Componentes
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import PriceEstimator from "@/components/ride/PriceEstimator";
import RideDetails from "@/components/ride/RideDetails";
import InfoSection from "@/components/ride/InfoSection";
import RidePaymentInfo from "@/components/ride/PaymentInfo";

// Hooks personalizados
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useGeocodingService } from "@/hooks/useGeocodingService";
import { useEstimateCalculator } from "@/hooks/useEstimateCalculator";

const RideRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testMode, setCurrentRide } = useAppContext();
  
  const initialDestination = location.state?.destination || "";
  
  // Estado del modo de selección
  const [useManualSelection, setUseManualSelection] = useState(true); // Activado por defecto
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<MapCoordinates | null>(null);
  
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
    setEstimatedPrice,
    setEstimatedTime,
    setEstimatedDistance,
    calculateEstimatedValues
  } = useEstimateCalculator();

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
    const result = await geocodeLocations(origin, destination, originCoords, destinationCoords);
    
    if (result.success && result.finalOriginCoords && result.finalDestinationCoords) {
      setOriginCoords(result.finalOriginCoords);
      setDestinationCoords(result.finalDestinationCoords);
      
      calculateEstimatedValues(result.finalOriginCoords, result.finalDestinationCoords);
    }
  };

  // Procesar la solicitud de viaje
  const handleRequestRide = () => {
    if (!origin || !destination || !estimatedPrice || !originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, calcula primero el precio estimado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulación de solicitud de viaje
    setTimeout(() => {
      // Crear un nuevo viaje
      const newRide = {
        id: `ride-${Date.now()}`,
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
        requestTime: new Date(),
        price: estimatedPrice,
        distance: estimatedDistance,
      };

      // Actualizar el contexto con el nuevo viaje
      setCurrentRide(newRide);

      toast({
        title: "¡Viaje solicitado!",
        description: "Buscando conductores disponibles...",
      });

      setIsLoading(false);
      navigate("/tracking");
    }, 1500);
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-4">Solicitar un taxi</h1>
        
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
    </MainLayout>
  );
};

export default RideRequest;
