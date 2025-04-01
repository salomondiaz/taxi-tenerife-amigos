
import React from "react";
import EnhancedLocationSelector from "./EnhancedLocationSelector";
import { MapCoordinates } from "@/components/map/types";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";

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
  calculateEstimates
}) => {
  return (
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
  );
};

export default LocationInputSection;
