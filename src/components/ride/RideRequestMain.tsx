
import React, { useState, useEffect } from "react";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { useToast } from "@/hooks/use-toast";
import EnhancedLocationSelector from "./EnhancedLocationSelector";
import MapViewer from "./MapViewer";
import EstimateDisplay from "./EstimateDisplay";
import PriceEstimate from "./PriceEstimate";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";

const RideRequestMain: React.FC = () => {
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

  const [useManualSelection, setUseManualSelection] = useState(true); // Default to true to enable map selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // Home address management
  const HOME_ADDRESS_KEY = 'home_address';
  const HOME_LOCATION_KEY = 'user_home_location';

  // Log coordinates for debugging
  useEffect(() => {
    console.log("Current coordinates in RideRequestMain:", { 
      originCoords, 
      destinationCoords,
      origin,
      destination
    });
  }, [originCoords, destinationCoords, origin, destination]);

  const saveHomeAddress = () => {
    if (origin) {
      localStorage.setItem(HOME_ADDRESS_KEY, origin);
      
      // Verificar si tenemos coordenadas en homeLocation (para compatibilidad)
      const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
      if (!homeLocationJSON) {
        // Si no hay coordenadas guardadas, mostrar mensaje informativo
        toast({
          title: "Dirección guardada",
          description: "Para guardar la ubicación exacta, usa la opción 'Guardar como Mi Casa' en el mapa",
        });
      } else {
        toast({
          title: "Dirección guardada",
          description: "Tu casa ha sido guardada correctamente",
        });
      }
    } else {
      toast({
        title: "No hay dirección para guardar",
        description: "Por favor, introduce primero una dirección de origen o selecciónala en el mapa",
        variant: "destructive",
      });
    }
  };

  const useHomeAddress = () => {
    // Intentar obtener primero de HOME_LOCATION_KEY (nuevo sistema)
    const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
    if (homeLocationJSON) {
      try {
        const homeLocation = JSON.parse(homeLocationJSON);
        if (homeLocation.address) {
          setOrigin(homeLocation.address);
          if (homeLocation.lat && homeLocation.lng) {
            handleOriginChange({
              lat: homeLocation.lat,
              lng: homeLocation.lng,
              address: homeLocation.address
            });
          }
          toast({
            title: "Dirección de casa cargada",
            description: "Se ha establecido tu casa como punto de origen",
          });
          
          // Forzar actualización del componente
          setTimeout(() => {
            const homeAddressEvent = new CustomEvent('home-address-used');
            window.dispatchEvent(homeAddressEvent);
          }, 100);
          return;
        }
      } catch (error) {
        console.error("Error parsing home location:", error);
      }
    }
    
    // Si no hay datos en el nuevo sistema o no tienen dirección, usar el antiguo
    const homeAddress = localStorage.getItem(HOME_ADDRESS_KEY);
    if (homeAddress) {
      setOrigin(homeAddress);
      toast({
        title: "Dirección de casa cargada",
        description: "Se ha establecido tu casa como punto de origen",
      });
      
      // Forzar actualización del componente
      setTimeout(() => {
        const homeAddressEvent = new CustomEvent('home-address-used');
        window.dispatchEvent(homeAddressEvent);
      }, 100);
    } else {
      toast({
        title: "No hay dirección guardada",
        description: "Aún no has guardado ninguna dirección como tu casa",
        variant: "destructive",
      });
    }
  };

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
  
  // For toast notifications
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Location Inputs and Estimates */}
        <div className="lg:col-span-5 space-y-4">
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
          
          {/* Estimates are only shown after calculation */}
          {estimatedPrice > 0 && (
            <div className="space-y-4">
              <EstimateDisplay
                estimatedDistance={estimatedDistance}
                estimatedTime={estimatedTime}
                trafficLevel={trafficLevel}
                arrivalTime={arrivalTime}
              />
              
              <PriceEstimate 
                estimatedPrice={estimatedPrice} 
              />
              
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                onRequestRide={handleRideRequest}
              />
            </div>
          )}
        </div>
        
        {/* Right Column - Map View */}
        <div className="lg:col-span-7">
          <div className="h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
            <MapViewer
              useManualSelection={useManualSelection}
              originCoords={originCoords}
              destinationCoords={destinationCoords}
              routeGeometry={routeGeometry}
              handleOriginChange={handleOriginChange}
              handleDestinationChange={handleDestinationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
