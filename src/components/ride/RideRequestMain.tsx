
import React, { useState, useEffect, useCallback } from "react";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LocationInputSection from "./LocationInputSection";
import MapViewSection from "./MapViewSection";
import EstimateSection from "./EstimateSection";

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

  const [useManualSelection, setUseManualSelection] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Home address management
  const HOME_ADDRESS_KEY = 'home_address';
  const HOME_LOCATION_KEY = 'user_home_location';

  // Log coordinates for debugging
  useEffect(() => {
    console.log("Coordenadas actuales en RideRequestMain:", { 
      originCoords, 
      destinationCoords,
      origin,
      destination
    });
  }, [originCoords, destinationCoords, origin, destination]);

  // Guardar viaje en Supabase
  const saveRideToSupabase = useCallback(async () => {
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, selecciona origen y destino en el mapa",
        variant: "destructive",
      });
      return;
    }

    if (isSaving) return; // Evitar guardado múltiple
    setIsSaving(true);

    try {
      // Calcular estimaciones primero
      if (estimatedPrice === 0) {
        await calculateEstimates();
      }

      // Preparar datos para guardar
      const rideData = {
        origen: origin || originCoords.address || `${originCoords.lat},${originCoords.lng}`,
        destino: destination || destinationCoords.address || `${destinationCoords.lat},${destinationCoords.lng}`,
        estado: 'pendiente',
        // Agregar más campos según sea necesario
      };

      // Guardar en Supabase
      const { data, error } = await supabase
        .from('viajes')
        .insert(rideData)
        .select();

      if (error) {
        console.error("Error al guardar viaje:", error);
        toast({
          title: "Error al guardar viaje",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Viaje guardado exitosamente:", data);
        toast({
          title: "Viaje guardado exitosamente",
          description: "Tu viaje ha sido guardado con estado 'pendiente'",
        });
      }
    } catch (error) {
      console.error("Error en saveRideToSupabase:", error);
      toast({
        title: "Error al procesar la solicitud",
        description: "Ha ocurrido un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [origin, destination, originCoords, destinationCoords, estimatedPrice, calculateEstimates, toast, isSaving]);

  const saveHomeAddress = () => {
    if (origin) {
      localStorage.setItem(HOME_ADDRESS_KEY, origin);
      
      // Verificar si tenemos coordenadas en homeLocation (para compatibilidad)
      const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
      if (!homeLocationJSON) {
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
        console.error("Error al procesar ubicación de casa:", error);
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
          <LocationInputSection 
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            handleUseCurrentLocation={handleUseCurrentLocation}
            useHomeAddress={useHomeAddress}
            saveHomeAddress={saveHomeAddress}
            isLoading={isLoading}
            calculateEstimates={calculateEstimates}
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
          />
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
