
import { useState } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "./use-toast";

export const useTrafficCalculator = () => {
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'moderate' | 'heavy' | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);

  // Calculate estimated arrival time
  const calculateArrivalTime = (estimatedTimeMinutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + estimatedTimeMinutes);
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Simulate traffic level based on distance and time
  const calculateTrafficLevel = (distance: number, time: number): 'low' | 'moderate' | 'heavy' => {
    // If the values seem unreasonable for Tenerife (>100km), default to moderate
    if (distance > 100 || time > 180) {
      console.warn("Distance or time outside reasonable range for Tenerife", { distance, time });
      return 'moderate';
    }
    
    // Average speed in km/h
    const avgSpeed = distance / (time / 60);
    console.log("Calculated average speed:", avgSpeed, "km/h");
    
    if (avgSpeed > 40) return 'low';
    if (avgSpeed > 25) return 'moderate';
    return 'heavy';
  };

  // Update traffic information
  const updateTrafficInfo = (distance: number, time: number) => {
    console.log("Calculating traffic for distance:", distance, "km and time:", time, "min");
    
    // Verify reasonable values for Tenerife
    if (distance > 100 || distance <= 0 || time <= 0) {
      console.error("Invalid distance or time values for traffic calculation", { distance, time });
      toast({
        title: "Error de cálculo",
        description: "No se pudo calcular la información de tráfico con los valores proporcionados",
        variant: "destructive"
      });
      return null;
    }
    
    const traffic = calculateTrafficLevel(distance, time);
    setTrafficLevel(traffic);
    
    // Adjust estimated time based on traffic
    let adjustedTime = time;
    if (traffic === 'moderate') {
      adjustedTime = Math.ceil(adjustedTime * 1.2); // 20% more time
    } else if (traffic === 'heavy') {
      adjustedTime = Math.ceil(adjustedTime * 1.5); // 50% more time
    }
    
    const arrival = calculateArrivalTime(adjustedTime);
    setArrivalTime(arrival);
    
    // Mostrar notificación sobre el estado del tráfico
    let trafficMessage = '';
    let variant: 'default' | 'destructive' | undefined = 'default';
    
    switch (traffic) {
      case 'low':
        trafficMessage = 'Tráfico fluido. Buen momento para viajar.';
        break;
      case 'moderate':
        trafficMessage = 'Tráfico moderado. Posible demora de 20%.';
        variant = undefined;
        break;
      case 'heavy':
        trafficMessage = 'Tráfico intenso. Tiempo estimado aumentado en 50%.';
        variant = 'destructive';
        break;
    }
    
    console.log("Traffic level:", traffic, "Adjusted time:", adjustedTime, "Arrival time:", arrival);
    
    toast({
      title: `Hora estimada de llegada: ${arrival}`,
      description: trafficMessage,
      variant: variant
    });
    
    return { trafficLevel: traffic, adjustedTime, arrivalTime: arrival };
  };

  return {
    trafficLevel,
    arrivalTime,
    updateTrafficInfo
  };
};
