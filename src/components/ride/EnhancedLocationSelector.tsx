
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import QuickAccessButtons from "./location/QuickAccessButtons";
import LocationInputs from "./location/LocationInputs";
import SearchOverlay from "./location/SearchOverlay";

interface EnhancedLocationSelectorProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onOriginCoordinatesChange: (coordinates: MapCoordinates) => void;
  onDestinationCoordinatesChange: (coordinates: MapCoordinates) => void;
  handleUseCurrentLocation: () => void;
  useHomeAddress: () => void;
  saveHomeAddress: () => void;
  googleMapsApiKey?: string;
  calculateEstimates: () => void;
  isCalculating: boolean;
}

const EnhancedLocationSelector: React.FC<EnhancedLocationSelectorProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  onOriginCoordinatesChange,
  onDestinationCoordinatesChange,
  handleUseCurrentLocation,
  useHomeAddress,
  saveHomeAddress,
  googleMapsApiKey,
  calculateEstimates,
  isCalculating,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"origin" | "destination" | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleOriginPlaceSelected = (coordinates: MapCoordinates) => {
    onOriginCoordinatesChange(coordinates);
    setOrigin(coordinates.address || "");
    
    // Auto-focus destination field after origin is set
    setTimeout(() => {
      const destinationInput = document.getElementById("destination-autocomplete-input");
      if (destinationInput) {
        (destinationInput as HTMLInputElement).focus();
      }
    }, 100);
  };
  
  const handleDestinationPlaceSelected = (coordinates: MapCoordinates) => {
    onDestinationCoordinatesChange(coordinates);
    setDestination(coordinates.address || "");
    
    // Auto-calculate after both fields are filled
    if (origin && coordinates.address) {
      setTimeout(() => calculateEstimates(), 500);
    }
  };

  const handleOpenSearch = (type: "origin" | "destination") => {
    setSearchType(type);
    setShowSearchInput(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim() || !searchType) {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor introduce una dirección o lugar",
        variant: "destructive"
      });
      return;
    }

    const coordinates = {
      address: searchQuery
    } as MapCoordinates;

    if (searchType === "origin") {
      onOriginCoordinatesChange(coordinates);
      setOrigin(searchQuery);
    } else {
      onDestinationCoordinatesChange(coordinates);
      setDestination(searchQuery);
    }

    setShowSearchInput(false);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-3">¿A dónde quieres ir?</h2>
      
      <QuickAccessButtons
        handleUseCurrentLocation={handleUseCurrentLocation}
        useHomeAddress={useHomeAddress}
        saveHomeAddress={saveHomeAddress}
      />
      
      <LocationInputs
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        onOriginPlaceSelected={handleOriginPlaceSelected}
        onDestinationPlaceSelected={handleDestinationPlaceSelected}
        googleMapsApiKey={googleMapsApiKey}
        calculateEstimates={calculateEstimates}
        isCalculating={isCalculating}
      />
      
      {showSearchInput && (
        <SearchOverlay
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          closeSearch={() => setShowSearchInput(false)}
          searchType={searchType}
        />
      )}
    </div>
  );
};

export default EnhancedLocationSelector;
