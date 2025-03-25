
import { useState } from "react";
import mapboxgl from "mapbox-gl";
import { MapCoordinates } from "@/components/map/types";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";

export const useEstimateCalculator = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  
  const calculateEstimatedValues = async (
    originCoords: MapCoordinates, 
    destinationCoords: MapCoordinates
  ) => {
    try {
      // Get Mapbox API token
      const accessToken = localStorage.getItem(API_KEY_STORAGE_KEY);
      
      if (!accessToken) {
        toast({
          title: "Error de configuración",
          description: "No se encontró el token de API de Mapbox",
          variant: "destructive",
        });
        return null;
      }
      
      // Use Mapbox Directions API to get the actual route
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?access_token=${accessToken}&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        // Distance is in meters, convert to kilometers
        const distance = data.routes[0].distance / 1000;
        // Time is in seconds, convert to minutes
        const time = Math.floor(data.routes[0].duration / 60);
        
        // Simulate traffic congestion based on time of day
        const hour = new Date().getHours();
        let trafficMultiplier = 1.0;
        
        // Peak hours: adjust estimated time
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          trafficMultiplier = 1.3; // 30% more time during peak hours
        }
        
        const adjustedTime = Math.floor(time * trafficMultiplier);
        
        // Calculate price (base fare of 3€ + 1.5€ per km)
        const price = distance * 1.5 + 3;

        // Round distance to one decimal place
        const roundedDistance = parseFloat(distance.toFixed(1));
        
        setEstimatedDistance(roundedDistance);
        setEstimatedTime(adjustedTime);
        setEstimatedPrice(parseFloat(price.toFixed(2)));
        
        // Save the route geometry to draw it on the map
        const routeGeometry = data.routes[0].geometry;
        
        return {
          distance: roundedDistance,
          time: adjustedTime,
          price: parseFloat(price.toFixed(2)),
          routeGeometry
        };
      } else {
        toast({
          title: "Error de ruta",
          description: "No se pudo calcular la ruta entre los puntos seleccionados",
          variant: "destructive",
        });
        throw new Error("No se pudo calcular la ruta");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      toast({
        title: "Error de cálculo",
        description: "Ocurrió un error al calcular la ruta. Inténtalo de nuevo.",
        variant: "destructive",
      });
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
