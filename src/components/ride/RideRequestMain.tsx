
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
import { useFavoriteLocations, FavoriteLocation } from "@/hooks/useFavoriteLocations";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import HomesSelector from "@/components/home/HomesSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const RideRequestMain: React.FC = () => {
  const location = useLocation();
  const selectedHomeId = location.state?.selectedHomeId;
  
  // Get instances of hooks
  const { getLocationByType, getLocationById, favoriteLocations } = useFavoriteLocations();
  const { saveHomeLocation } = useHomeLocationStorage();
  
  const [showHomesSelector, setShowHomesSelector] = useState(false);
  
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
  
  // Manejo de casas múltiples
  useEffect(() => {
    // Si se especificó un ID de casa, usarla
    if (selectedHomeId) {
      const selectedHome = getLocationById(selectedHomeId);
      if (selectedHome && selectedHome.type === 'home') {
        useHomeLocation(selectedHome);
      }
    } else if (location.state?.useHomeAsOrigin) {
      // Si no hay ID específico pero se pidió usar casa, usar la predeterminada
      const homeLocation = getLocationByType('home');
      if (homeLocation) {
        useHomeLocation(homeLocation);
      }
    }
  }, [selectedHomeId, location.state?.useHomeAsOrigin]);

  const useHomeLocation = (homeLocation: FavoriteLocation) => {
    if (homeLocation) {
      handleOriginChange(homeLocation.coordinates);
      setOrigin(homeLocation.name || homeLocation.coordinates.address || "Mi Casa");
      toast({
        title: "Casa como origen",
        description: `${homeLocation.name} ha sido establecida como punto de origen`
      });
    } else {
      toast({
        title: "No tienes una casa guardada",
        description: "Configura tu ubicación de casa en Ajustes",
        variant: "destructive"
      });
    }
  };
  
  const useHomeAddress = () => {
    // Abrimos el selector de casas si hay más de una
    if (favoriteLocations.filter(loc => loc.type === 'home').length > 1) {
      setShowHomesSelector(true);
    } else {
      // Si solo hay una casa, la usamos directamente
      const homeLocation = getLocationByType('home');
      if (homeLocation) {
        useHomeLocation(homeLocation);
      } else {
        toast({
          title: "No tienes una casa guardada",
          description: "Configura tu ubicación de casa en Ajustes",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSelectHome = (home: FavoriteLocation) => {
    useHomeLocation(home);
    setShowHomesSelector(false);
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
  const saveRideToSupabase = async (scheduledDate?: Date) => {
    if (!estimatedPrice || !originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, calcula el precio antes de solicitar",
        variant: "destructive"
      });
      return null;
    }
    
    return handleRequestRide("efectivo"); // Default to cash payment
  };

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
            saveRideToSupabase={saveRideToSupabase}
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
                onClick={() => saveRideToSupabase()}
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
      
      {/* Diálogo para seleccionar casa */}
      <Dialog open={showHomesSelector} onOpenChange={setShowHomesSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccionar casa</DialogTitle>
            <DialogDescription>
              Elige la casa que quieres usar como punto de origen
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <HomesSelector 
              onSelectHome={handleSelectHome} 
              allowEditing={false}
              showAddNew={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideRequestMain;
