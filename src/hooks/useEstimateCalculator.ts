
import { useState } from "react";
import { MapCoordinates } from "@/components/map/types";

export const useEstimateCalculator = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  
  const calculateEstimatedValues = (
    originCoords: MapCoordinates, 
    destinationCoords: MapCoordinates
  ) => {
    // Calcular distancia entre puntos (fórmula haversine)
    const R = 6371; // Radio de la Tierra en km
    const dLat = (destinationCoords.lat - originCoords.lat) * Math.PI / 180;
    const dLon = (destinationCoords.lng - originCoords.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originCoords.lat * Math.PI / 180) * Math.cos(destinationCoords.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Calcular tiempo estimado (3 minutos por km + algo aleatorio para variabilidad)
    const time = Math.floor(distance * 3 + Math.random() * 5);
    
    // Calcular precio (tarifa base de 3€ + 1.5€ por km)
    const price = distance * 1.5 + 3;

    setEstimatedDistance(parseFloat(distance.toFixed(1)));
    setEstimatedTime(time);
    setEstimatedPrice(parseFloat(price.toFixed(2)));
    
    return {
      distance: parseFloat(distance.toFixed(1)),
      time,
      price: parseFloat(price.toFixed(2))
    };
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
