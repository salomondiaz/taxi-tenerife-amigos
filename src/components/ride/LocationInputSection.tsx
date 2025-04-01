
import React from "react";
import { EnhancedLocationSelector } from "@/components/ride/EnhancedLocationSelector";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
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
  // Obtener la API key de Google Maps
  const googleMapsApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';

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
      googleMapsApiKey={googleMapsApiKey}
      calculateEstimates={calculateEstimates}
      isCalculating={isLoading}
    />
  );
};

export default LocationInputSection;
