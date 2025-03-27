
import { useState, useEffect } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";
import { useFavoriteLocations } from "@/hooks/useFavoriteLocations";

export const useHomeLocationSetup = (setHomeLocationMode: boolean) => {
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [homeAddress, setHomeAddress] = useState<string>("");
  const { saveFavoriteLocation } = useFavoriteLocations();

  // Function to handle origin change from map
  const handleOriginChange = (coords: MapCoordinates) => {
    setOriginCoords(coords);
    
    // Update home address field if in home setup mode
    if (setHomeLocationMode && coords.address) {
      setHomeAddress(coords.address);
    }
    console.log("New origin from map:", coords);
  };

  // Handle place selected from Google Places Autocomplete
  const handlePlaceSelected = (coords: MapCoordinates) => {
    if (setHomeLocationMode) {
      setOriginCoords(coords);
      setHomeAddress(coords.address || "");
      toast({
        title: "Ubicación seleccionada",
        description: "Ubicación seleccionada como tu casa. Puedes guardarla haciendo clic en 'Guardar Mi Casa'."
      });
    }
  };

  // Function to save home location
  const handleSaveHomeLocation = () => {
    if (!originCoords) {
      toast({
        title: "No hay ubicación seleccionada",
        description: "Por favor, selecciona una ubicación en el mapa primero",
        variant: "destructive"
      });
      return;
    }
    
    // Create home location object
    const homeLocation = {
      id: "home",
      name: "Mi Casa",
      coordinates: {
        ...originCoords,
        address: homeAddress || originCoords.address || "Mi Casa"
      },
      type: 'home' as const,
      icon: '🏠'
    };
    
    const success = saveFavoriteLocation(homeLocation);
    if (success) {
      toast({
        title: "Casa guardada",
        description: "Ubicación guardada como tu casa exitosamente."
      });
    }
  };

  return {
    originCoords,
    setOriginCoords,
    homeAddress,
    setHomeAddress,
    handleOriginChange,
    handlePlaceSelected,
    handleSaveHomeLocation
  };
};
