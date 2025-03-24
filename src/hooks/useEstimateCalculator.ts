
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
    // Improved distance calculation using haversine formula
    // The original formula was correct, but wasn't considering road routes
    // We'll apply a correction factor to approximate real road distances
    const R = 6371; // Radio de la Tierra en km
    const dLat = (destinationCoords.lat - originCoords.lat) * Math.PI / 180;
    const dLon = (destinationCoords.lng - originCoords.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originCoords.lat * Math.PI / 180) * Math.cos(destinationCoords.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    // Direct distance as the crow flies
    const directDistance = R * c;
    
    // Apply correction factor for road routes (typically 1.3-1.5x the direct distance)
    // In mountainous areas like Tenerife, the factor can be higher
    const roadFactor = 1.6; // Increased road factor for mountainous terrain
    const distance = directDistance * roadFactor;
    
    // Calculate time based on realistic average speed in minutes per km
    // In Tenerife with its winding roads and mountains, average speed is lower
    // Assume average speed of 40 km/h = 1.5 minutes per km
    const timePerKm = 1.5;
    const time = Math.floor(distance * timePerKm + Math.random() * 5);
    
    // Calculate price (tarifa base of 3€ + 1.5€ per km)
    const price = distance * 1.5 + 3;

    // Round the distance to one decimal place
    const roundedDistance = parseFloat(distance.toFixed(1));
    
    setEstimatedDistance(roundedDistance);
    setEstimatedTime(time);
    setEstimatedPrice(parseFloat(price.toFixed(2)));
    
    return {
      distance: roundedDistance,
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
