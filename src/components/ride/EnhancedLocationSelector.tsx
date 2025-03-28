
import React, { useState } from "react";
import { MapPin, Navigation, Home, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";

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
      
      {/* Quick Access Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleUseCurrentLocation}
        >
          <Target size={16} />
          <span className="md:inline">Mi ubicación</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={useHomeAddress}
        >
          <Home size={16} />
          <span className="md:inline">Mi casa</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={saveHomeAddress}
        >
          <Home size={16} />
          <span className="md:inline">Guardar casa</span>
        </Button>
      </div>
      
      {/* Location Inputs */}
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
                onPlaceSelected={handleOriginPlaceSelected}
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
                onPlaceSelected={handleDestinationPlaceSelected}
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
      
      {/* Action Buttons */}
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
      
      {/* Search Overlay */}
      {showSearchInput && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Buscar {searchType === "origin" ? "origen" : "destino"}
            </h3>
            
            <div className="flex gap-2 mb-4">
              <Input
                placeholder={`Dirección de ${searchType === "origin" ? "origen" : "destino"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              
              <Button onClick={handleSearch}>
                <Search size={18} />
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowSearchInput(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationSelector;
