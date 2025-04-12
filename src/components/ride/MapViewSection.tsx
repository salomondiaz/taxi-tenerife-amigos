
import React, { useState } from "react";
import { MapCoordinates } from "@/components/map/types";
import Map from "@/components/Map";
import { toast } from "@/hooks/use-toast";
import HomeDestinationDialog from "@/components/map/components/HomeDestinationDialog";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import { useFavoriteLocations } from "@/hooks/useFavoriteLocations";
import { AlertCircle } from "lucide-react";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase: (scheduledDate?: Date) => Promise<any>;
  useHomeAsDestination?: () => void;
  allowHomeEditing?: boolean;
  trafficLevel?: 'low' | 'moderate' | 'high' | 'very_high' | null;
  estimatedTime?: number | null;
  estimatedDistance?: number | null;
  estimatedPrice?: number | null;
  scheduledTime?: string;
  roadInterruptions?: string[];
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination,
  allowHomeEditing,
  trafficLevel,
  estimatedTime,
  estimatedDistance,
  estimatedPrice,
  scheduledTime,
  roadInterruptions = []
}) => {
  // Select the current step based on what's already selected
  const selectionMode = React.useMemo(() => {
    if (!originCoords) return 'origin';
    if (!destinationCoords) return 'destination';
    return 'none';
  }, [originCoords, destinationCoords]);
  
  const [showHomeDialog, setShowHomeDialog] = useState(false);
  const [clickedPoint, setClickedPoint] = useState<MapCoordinates | null>(null);
  const { saveHomeLocation } = useHomeLocationStorage();
  const { getLocationByType, saveFavoriteLocation } = useFavoriteLocations();
  const homeLocation = getLocationByType('home');

  // Home dialog handlers
  const handleMapClick = (coords: MapCoordinates) => {
    // Save the clicked point
    setClickedPoint(coords);
    
    // If this is the first click (setting origin), check if we should show dialog
    if (!originCoords) {
      // Set the origin to the clicked point
      handleOriginChange(coords);
      
      // If we have a home location, ask if they want to go home from here
      if (homeLocation) {
        setShowHomeDialog(true);
      }
    } else if (!destinationCoords) {
      // If second click, just set destination normally
      handleDestinationChange(coords);
    }
  };

  const handleHomeDialogConfirm = () => {
    if (useHomeAsDestination && homeLocation) {
      useHomeAsDestination();
    }
  };
  
  const handleSaveHomeLocation = () => {
    if (!originCoords) {
      toast({
        title: "No hay ubicación seleccionada",
        description: "Selecciona primero una ubicación de origen para guardarla como casa",
        variant: "destructive"
      });
      return;
    }
    
    // Save to localStorage for backward compatibility
    saveHomeLocation(originCoords);
    
    // Also save to favorite locations
    const homeFavorite = {
      name: "Mi Casa",
      type: "home" as 'home',
      coordinates: originCoords,
      icon: "🏠",
      notes: "Mi dirección principal"
    };
    
    saveFavoriteLocation(homeFavorite);
    
    toast({
      title: "Casa guardada",
      description: "Tu ubicación ha sido guardada como tu casa",
    });
  };

  // Format traffic level text
  const getTrafficText = () => {
    switch (trafficLevel) {
      case 'low': return "🟢 Tráfico ligero";
      case 'moderate': return "🟡 Tráfico moderado";
      case 'high': return "🟠 Tráfico denso";
      case 'very_high': return "🔴 Tráfico muy denso";
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] relative">
      <Map
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        onMapClick={handleMapClick}
        allowMapSelection={true}
        showRoute={true}
        useHomeAsDestination={useHomeAsDestination}
        alwaysShowHomeMarker={true}
        allowHomeEditing={allowHomeEditing}
        showSelectMarkers={true}
        selectionMode={selectionMode}
      />
      
      {/* Button to save home location */}
      <div className="absolute top-4 right-4 z-40">
        <button 
          onClick={handleSaveHomeLocation}
          className="bg-white text-tenerife-blue px-3 py-2 rounded-lg shadow-md text-sm font-medium flex items-center"
        >
          <span className="mr-1">🏠</span>
          Guardar como Mi Casa
        </button>
      </div>
      
      <HomeDestinationDialog 
        open={showHomeDialog}
        onOpenChange={setShowHomeDialog}
        clickedPoint={clickedPoint}
        onConfirm={handleHomeDialogConfirm}
        homeAddress={homeLocation?.coordinates.address}
      />
      
      {/* Mostrar resumen del viaje si tenemos estimaciones */}
      {estimatedPrice && estimatedDistance && estimatedTime && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-md z-40">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-sm font-medium flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{estimatedDistance.toFixed(1)} km</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{estimatedTime} min</span>
                  {scheduledTime && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Programado: {scheduledTime}</span>
                  )}
                </div>
                {getTrafficText() && (
                  <p className="text-xs text-gray-600 mt-1">
                    {getTrafficText()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold bg-green-100 text-green-800 px-2 py-1 rounded">{estimatedPrice.toFixed(2)}€</span>
                <p className="text-xs text-gray-500 mt-1">
                  {scheduledTime ? "Viaje programado" : "Precio estimado"}
                </p>
              </div>
            </div>
            
            {/* Road interruptions section */}
            {roadInterruptions && roadInterruptions.length > 0 && (
              <div className="mt-1 pt-1 border-t border-gray-200">
                <div className="flex items-center text-amber-700 text-xs">
                  <AlertCircle size={14} className="mr-1" />
                  <span className="font-medium">Alertas en la ruta:</span>
                </div>
                <ul className="text-xs text-amber-600 mt-1">
                  {roadInterruptions.map((interruption, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{interruption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewSection;
