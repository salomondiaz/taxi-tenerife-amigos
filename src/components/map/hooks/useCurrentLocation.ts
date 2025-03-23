
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from '../types';
import { getCurrentLocation } from '../services/MapboxService';

interface UseCurrentLocationProps {
  apiKey: string;
  onLocationFound?: (coords: MapCoordinates) => void;
}

export function useCurrentLocation({ apiKey, onLocationFound }: UseCurrentLocationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Se necesita una clave de API para usar la ubicación actual",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Obteniendo ubicación",
      description: "Por favor, espere mientras obtenemos su ubicación actual...",
    });

    try {
      const position = await getCurrentLocation();
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Intentar obtener la dirección usando reverse geocoding
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${apiKey}&limit=1&language=es`
      )
        .then(response => response.json())
        .then(data => {
          let coordsWithAddress: MapCoordinates = coords;
          
          if (data.features && data.features.length > 0) {
            coordsWithAddress.address = data.features[0].place_name;
          }
          
          if (onLocationFound) {
            onLocationFound(coordsWithAddress);
          }
          
          toast({
            title: "Ubicación actual establecida",
            description: "Se ha establecido su ubicación actual como punto de origen",
          });
        })
        .catch(error => {
          console.error("Error getting address:", error);
          if (onLocationFound) {
            onLocationFound(coords);
          }
          
          toast({
            title: "Ubicación actual establecida",
            description: "Se ha establecido su ubicación actual como punto de origen (sin dirección)",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Error de ubicación",
        description: "No pudimos acceder a su ubicación. Por favor, asegúrese de haber concedido permisos de ubicación.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return { getLocation, isLoading };
}
