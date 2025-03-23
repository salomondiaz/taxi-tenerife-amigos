
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
import { geocodeAddress } from "@/components/map/MapboxUtils";

// Función para geocodificar direcciones usando Mapbox específicamente para Tenerife
const geocodeAddressForRequest = async (address: string): Promise<MapCoordinates | null> => {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) return null;
  
  const result = await geocodeAddress(address, apiKey);
  return result;
};

export const useGeocodingService = () => {
  const [isLoading, setIsLoading] = useState(false);

  const geocodeLocations = async (
    origin: string,
    destination: string,
    originCoords: MapCoordinates | null,
    destinationCoords: MapCoordinates | null
  ): Promise<{ 
    success: boolean; 
    finalOriginCoords?: MapCoordinates;
    finalDestinationCoords?: MapCoordinates;
  }> => {
    if (!origin || !destination) {
      toast({
        title: "Información incompleta",
        description: "Por favor, introduce origen y destino",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    
    // Si ya tenemos coordenadas del mapa, las usamos directamente
    let finalOriginCoords = originCoords;
    let finalDestinationCoords = destinationCoords;
    
    // Si no tenemos coordenadas, geocodificamos las direcciones
    if (!finalOriginCoords) {
      const originResult = await geocodeAddressForRequest(origin);
      if (!originResult) {
        toast({
          title: "Error de geocodificación",
          description: "No se pudo encontrar el origen en Tenerife. Intenta ser más específico o usar la selección manual.",
          variant: "destructive",
        });
        setIsLoading(false);
        return { success: false };
      }
      finalOriginCoords = originResult;
    }
    
    if (!finalDestinationCoords) {
      const destinationResult = await geocodeAddressForRequest(destination);
      if (!destinationResult) {
        toast({
          title: "Error de geocodificación",
          description: "No se pudo encontrar el destino en Tenerife. Intenta ser más específico o usar la selección manual.",
          variant: "destructive",
        });
        setIsLoading(false);
        return { success: false };
      }
      finalDestinationCoords = destinationResult;
    }
    
    console.log("Origin coordinates:", finalOriginCoords);
    console.log("Destination coordinates:", finalDestinationCoords);

    setIsLoading(false);
    return { 
      success: true, 
      finalOriginCoords, 
      finalDestinationCoords 
    };
  };

  return { 
    geocodeLocations,
    isLoading,
    setIsLoading 
  };
};
