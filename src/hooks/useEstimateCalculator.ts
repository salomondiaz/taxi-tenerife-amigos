
import { useState } from "react";
import { MapCoordinates } from "@/components/map/types";

export const useEstimateCalculator = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  
  const calculateEstimatedValues = async (
    originCoords: MapCoordinates, 
    destinationCoords: MapCoordinates
  ) => {
    try {
      // Usar Mapbox Directions API para obtener la ruta real
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?access_token=${mapboxgl.accessToken}&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        // La distancia viene en metros, convertir a kilómetros
        const distance = data.routes[0].distance / 1000;
        // El tiempo viene en segundos, convertir a minutos
        const time = Math.floor(data.routes[0].duration / 60);
        
        // Calcular precio (tarifa base de 3€ + 1.5€ por km)
        const price = distance * 1.5 + 3;

        // Redondear la distancia a un decimal
        const roundedDistance = parseFloat(distance.toFixed(1));
        
        setEstimatedDistance(roundedDistance);
        setEstimatedTime(time);
        setEstimatedPrice(parseFloat(price.toFixed(2)));
        
        return {
          distance: roundedDistance,
          time,
          price: parseFloat(price.toFixed(2))
        };
      } else {
        throw new Error("No se pudo calcular la ruta");
      }
    } catch (error) {
      console.error("Error calculando la ruta:", error);
      return null;
    }
  };
  
  return {
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    setEstimatedPrice,
    setEstimatedTime,
    setEstimatedDistance,
    calculateEstimatedValues
  };
};
