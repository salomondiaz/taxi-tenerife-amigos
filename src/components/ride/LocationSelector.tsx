
import React from "react";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
import { MapCoordinates } from "@/components/map/types";
import FavoriteLocations from "./FavoriteLocations";
import LocationSelectionControls from "./LocationSelectionControls";
import AddressInputFields from "./AddressInputFields";

interface LocationSelectorProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  useManualSelection: boolean;
  setUseManualSelection: (value: boolean) => void;
  handleUseCurrentLocation: () => void;
  originCoords?: MapCoordinates | null;
  onSelectLocation?: (coordinates: MapCoordinates, address?: string) => void;
  googleMapsApiKey?: string;
  onPlaceSelected?: (coordinates: MapCoordinates) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  useManualSelection,
  setUseManualSelection,
  handleUseCurrentLocation,
  originCoords,
  onSelectLocation,
  googleMapsApiKey,
  onPlaceSelected
}) => {
  const handleOriginPlaceSelected = (coordinates: MapCoordinates) => {
    if (onSelectLocation) {
      onSelectLocation(coordinates, coordinates.address);
    }
    if (onPlaceSelected) {
      onPlaceSelected(coordinates);
    }
  };
  
  const handleDestinationPlaceSelected = (coordinates: MapCoordinates) => {
    // Solo para el destino, no necesitamos actualizar la ubicación guardada
    setDestination(coordinates.address || "");
  };

  const handleSelectFavoriteLocation = (coordinates: MapCoordinates, address?: string) => {
    if (onSelectLocation) {
      onSelectLocation(coordinates, address);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">¿De dónde a dónde vas?</h2>
        
        <LocationSelectionControls 
          useManualSelection={useManualSelection}
          setUseManualSelection={setUseManualSelection}
          handleUseCurrentLocation={handleUseCurrentLocation}
          origin={origin}
          handleOriginChange={coordinates => onSelectLocation?.(coordinates)}
          setOrigin={setOrigin}
        />
        
        <AddressInputFields 
          useManualSelection={useManualSelection}
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          googleMapsApiKey={googleMapsApiKey}
          onOriginPlaceSelected={handleOriginPlaceSelected}
          onDestinationPlaceSelected={handleDestinationPlaceSelected}
        />
      </div>

      {/* Ubicaciones favoritas */}
      <FavoriteLocations 
        origin={originCoords} 
        currentCoordinates={originCoords}
        onSelectLocation={handleSelectFavoriteLocation}
      />
    </div>
  );
};

export default LocationSelector;
