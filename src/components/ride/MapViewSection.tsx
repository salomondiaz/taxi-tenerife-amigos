
import React, { useState } from "react";
import MapViewer from "./MapViewer";
import { MapCoordinates } from "@/components/map/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase?: () => void;
  useHomeAsDestination?: () => void;
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination
}) => {
  const { toast } = useToast();
  const [showHomePrompt, setShowHomePrompt] = useState<MapCoordinates | null>(null);

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

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapViewer
        useManualSelection={useManualSelection}
        originCoords={originCoords}
        destinationCoords={destinationCoords}
        routeGeometry={routeGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
        saveRideToSupabase={saveRideToSupabase}
        useHomeAsDestination={useHomeAsDestination}
        onMapClick={handleMapClick}
        alwaysShowHomeMarker={true}
      />

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
