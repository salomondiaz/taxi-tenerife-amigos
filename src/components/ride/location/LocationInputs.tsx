
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapCoordinates } from "@/components/map/types";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";

interface LocationInputsProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onOriginPlaceSelected: (coordinates: MapCoordinates) => void;
  onDestinationPlaceSelected: (coordinates: MapCoordinates) => void;
  googleMapsApiKey?: string;
  calculateEstimates: () => void;
  isCalculating: boolean;
}

const LocationInputs: React.FC<LocationInputsProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  onOriginPlaceSelected,
  onDestinationPlaceSelected,
  googleMapsApiKey,
  calculateEstimates,
  isCalculating,
}) => {
  return (
    <>
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <MapPin size={20} className="text-blue-600" />
          </div>
          
          {googleMapsApiKey ? (
            <div className="flex-1">
              <GooglePlacesAutocomplete
                placeholder="¿Dónde te recogemos?"
                value={origin}
                onChange={setOrigin}
                onPlaceSelected={onOriginPlaceSelected}
                apiKey={googleMapsApiKey}
                className="flex-1"
              />
            </div>
          ) : (
            <Input
              placeholder="¿Dónde te recogemos?"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex-1"
            />
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-red-100 rounded-full">
            <Navigation size={20} className="text-red-600" />
          </div>
          
          {googleMapsApiKey ? (
            <div className="flex-1">
              <GooglePlacesAutocomplete
                id="destination-autocomplete-input"
                placeholder="¿A dónde vas?"
                value={destination}
                onChange={setDestination}
                onPlaceSelected={onDestinationPlaceSelected}
                apiKey={googleMapsApiKey}
                className="flex-1"
              />
            </div>
          ) : (
            <Input
              placeholder="¿A dónde vas?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1"
            />
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={calculateEstimates} 
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
          disabled={!origin || !destination || isCalculating}
        >
          {isCalculating ? "Calculando..." : "Calcular precio"}
        </Button>
        
        {!origin || !destination ? (
          <p className="text-xs text-center mt-2 text-gray-500">
            Completa origen y destino para calcular el precio
          </p>
        ) : null}
      </div>
    </>
  );
};

export default LocationInputs;
