
import React, { useState, useEffect } from "react";
import MapViewer from "./MapViewer";
import { MapCoordinates } from "@/components/map/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle, Car } from "lucide-react";
import { useDriverTracking } from "@/hooks/useDriverTracking";
import { useRouteVisualization } from "@/hooks/useRouteVisualization";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase?: () => void;
  useHomeAsDestination?: () => void;
  rideId?: string;
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry: initialRouteGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination,
  rideId
}) => {
  const { toast } = useToast();
  const [showHomePrompt, setShowHomePrompt] = useState<MapCoordinates | null>(null);

  // Get real-time driver position and status
  const { driverPosition, driverStatus, error: driverError, isLoading: isLoadingDriver } = useDriverTracking({ rideId });
  
  // Calculate and manage route visualization
  const { routeGeometry, routeError, isCalculating } = useRouteVisualization({
    driverPosition,
    originCoords,
    destinationCoords,
    hasPickedUp: driverStatus.hasPickedUp,
    isDriverAssigned: driverStatus.isAssigned
  });

  // Show toast if driver tracking encounters an error
  useEffect(() => {
    if (driverError) {
      toast({
        title: "Error de seguimiento",
        description: driverError,
        variant: "destructive",
      });
    }
  }, [driverError, toast]);

  // Show toast if route calculation encounters an error
  useEffect(() => {
    if (routeError) {
      toast({
        title: "Error en la ruta",
        description: routeError,
        variant: "destructive",
      });
    }
  }, [routeError, toast]);

  // Handle map click with the new selection logic
  const handleMapClick = (coords: MapCoordinates) => {
    // Check if this is a click near home location
    const homeLocation = localStorage.getItem('user_home_location');
    let isNearHome = false;
    
    if (homeLocation) {
      try {
        const home = JSON.parse(homeLocation);
        // Check if click is very close to home location (within ~50 meters)
        if (
          Math.abs(home.lat - coords.lat) < 0.0005 && 
          Math.abs(home.lng - coords.lng) < 0.0005
        ) {
          isNearHome = true;
        }
      } catch (error) {
        console.error("Error parsing home location:", error);
      }
    }

    if (isNearHome) {
      // If clicked on home, don't show prompt
      return;
    }

    // Normal selection logic
    if (!originCoords) {
      // First click - set origin
      handleOriginChange(coords);
    } else if (!destinationCoords) {
      // Second click - set destination
      handleDestinationChange(coords);
    } else {
      // Third click - show prompt asking what to do
      setShowHomePrompt(coords);
    }
  };

  // Handle the reset of markers when a third point is selected
  const handleResetMarkers = (coords: MapCoordinates) => {
    // Reset origin to the new point and clear destination
    handleOriginChange(coords);
    handleDestinationChange(null as any); // We need to use null here to clear the destination
  };

  // Handle using the selected point as origin and home as destination
  const handleUseHomeAsDestinationFromPoint = (coords: MapCoordinates) => {
    handleOriginChange(coords);
    if (useHomeAsDestination) {
      useHomeAsDestination();
    }
    setShowHomePrompt(null);
  };

  // Decide which route geometry to use
  const effectiveRouteGeometry = driverStatus.isAssigned ? routeGeometry : initialRouteGeometry;

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapViewer
        useManualSelection={useManualSelection && !driverStatus.isAssigned}
        originCoords={originCoords}
        destinationCoords={destinationCoords}
        routeGeometry={effectiveRouteGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
        saveRideToSupabase={saveRideToSupabase}
        useHomeAsDestination={useHomeAsDestination}
        onMapClick={handleMapClick}
        alwaysShowHomeMarker={true}
        showDriverPosition={driverStatus.isAssigned}
        driverPosition={driverPosition}
      />

      {/* Driver status indicator */}
      {rideId && !driverStatus.isAssigned && !isLoadingDriver && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-2 text-amber-600">
            <Car className="animate-pulse" size={18} />
            <span className="font-medium">Buscando conductor cercano...</span>
          </div>
        </div>
      )}

      {/* Route status indicator */}
      {driverStatus.isAssigned && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-2 text-green-600">
            <Car size={18} />
            <span className="font-medium">
              {driverStatus.hasPickedUp
                ? "En camino a tu destino..."
                : "El conductor está en camino..."}
            </span>
          </div>
        </div>
      )}

      {/* Connection error indicator */}
      {(driverError || routeError) && (
        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>Error de conexión</span>
          </div>
        </div>
      )}

      {/* Home travel prompt */}
      {showHomePrompt && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50 w-80">
          <div className="text-center mb-4">
            <h3 className="font-semibold">¿Qué quieres hacer?</h3>
            <p className="text-sm text-gray-600">Has seleccionado un nuevo punto en el mapa</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => handleUseHomeAsDestinationFromPoint(showHomePrompt)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Viajar hasta mi casa desde este punto
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleResetMarkers(showHomePrompt)}
              className="w-full"
            >
              Establecer como nuevo punto de origen
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setShowHomePrompt(null)}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewSection;
