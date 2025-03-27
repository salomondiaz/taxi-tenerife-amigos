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
import StripePaymentProvider from "@/components/payment/StripePaymentProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Home } from "lucide-react";
import MapComponent from "@/components/Map";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [homeAddress, setHomeAddress] = useState<string>("");
  
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
      
      // Update home address field if in home setup mode
      if (setHomeLocationMode) {
        setHomeAddress(coords.address);
      }
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

  // Function to handle selection of a saved location
  const handleSelectSavedLocation = (coordinates: MapCoordinates, address?: string) => {
    setOriginCoords(coordinates);
    if (address) {
      setOrigin(address);
    }
    console.log("Selected saved location:", coordinates);
  };

  // Function to save home location
  const handleSaveHomeLocation = () => {
    if (!originCoords) {
      toast({
        title: "No hay ubicación seleccionada",
        description: "Por favor, selecciona una ubicación en el mapa primero",
        variant: "destructive"
      });
      return;
    }
    
    // Create home location object
    const homeLocation = {
      id: "home",
      name: "Mi Casa",
      coordinates: {
        ...originCoords,
        address: homeAddress || originCoords.address || "Mi Casa"
      },
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
  const handleRequestRide = (paymentMethodId: string) => {
    requestRide(
      origin, 
      destination, 
      originCoords, 
      destinationCoords, 
      estimatedPrice, 
      estimatedDistance,
      paymentMethodId
    );
  };

  // Render home setup mode
  if (setHomeLocationMode) {
    return (
      <div className="min-h-screen p-6">
        <RequestHeader />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Home className="mr-2 text-tenerife-blue" size={24} />
            Configurar Mi Casa
          </h2>
          
          <p className="text-gray-600 mb-6">
            Selecciona la ubicación de tu casa en el mapa o introduce la dirección manualmente.
          </p>
          
          <div className="mb-6">
            <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de tu casa
            </label>
            <Input
              id="homeAddress"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Ej: Calle Principal 123, Puerto de la Cruz, Tenerife"
              className="w-full mb-2"
            />
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={async () => {
                if (!homeAddress) {
                  toast({
                    title: "Dirección vacía",
                    description: "Por favor, introduce una dirección",
                    variant: "destructive"
                  });
                  return;
                }
                
                setIsLoading(true);
                try {
                  const result = await geocodeLocations(homeAddress, "", null, null);
                  if (result.success && result.finalOriginCoords) {
                    setOriginCoords(result.finalOriginCoords);
                    setOrigin(result.finalOriginCoords.address || homeAddress);
                    toast({
                      title: "Dirección encontrada",
                      description: "Verifica en el mapa si la ubicación es correcta"
                    });
                  } else {
                    toast({
                      title: "Dirección no encontrada",
                      description: "No pudimos localizar esa dirección. Intenta ser más específico",
                      variant: "destructive"
                    });
                  }
                } catch (error) {
                  console.error("Error geocoding address:", error);
                  toast({
                    title: "Error de búsqueda",
                    description: "No pudimos procesar la dirección",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <MapPin size={16} className="mr-2" />
              Buscar dirección
            </Button>
          </div>
          
          <div className="h-72 mb-6 border rounded-lg overflow-hidden">
            <MapComponent 
              origin={originCoords || undefined}
              className="h-full"
              onOriginChange={handleOriginChange}
              allowMapSelection={true}
              allowHomeEditing={true}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveHomeLocation}
              className="bg-tenerife-blue hover:bg-tenerife-blue/90"
              disabled={!originCoords}
            >
              <Home size={16} className="mr-2" />
              Guardar Mi Casa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StripePaymentProvider>
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
    </StripePaymentProvider>
  );
};

export default RideRequestContent;
