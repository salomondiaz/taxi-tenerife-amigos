
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, CalendarClock } from "lucide-react";
import EnhancedLocationSelector from "./EnhancedLocationSelector";
import { GOOGLE_MAPS_API_KEY } from "../Map";
import { MapCoordinates } from "@/components/map/types";

interface LocationInputSectionProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  handleUseCurrentLocation: () => void;
  useHomeAddress: () => void;
  saveHomeAddress: () => void;
  isLoading: boolean;
  calculateEstimates: () => void;
  handleUseHomeAsDestination: () => void;
  scheduledTime?: string;
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  handleOriginChange,
  handleDestinationChange,
  handleUseCurrentLocation,
  useHomeAddress,
  saveHomeAddress,
  isLoading,
  calculateEstimates,
  handleUseHomeAsDestination,
  scheduledTime
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">¿A dónde quieres ir?</h2>
        
        {scheduledTime && (
          <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">
            <CalendarClock className="h-4 w-4 mr-1" />
            Programado
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center justify-center"
          onClick={handleUseCurrentLocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Usar mi ubicación
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center"
          onClick={handleUseHomeAsDestination}
        >
          <Home className="h-4 w-4 mr-2" />
          Casa como destino
        </Button>
      </div>
      
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
    </div>
  );
};

export default LocationInputSection;
