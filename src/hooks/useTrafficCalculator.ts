
import { useState, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export const useTrafficCalculator = () => {
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'moderate' | 'high' | 'very_high' | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  
  // Calculate traffic level based on time of day and distance/time ratio
  const updateTrafficInfo = (distance: number, durationMinutes: number) => {
    // Get current time
    const currentHour = new Date().getHours();
    
    // Base speed calculation (km per minute)
    const speed = distance / durationMinutes;
    
    // Determine if it's rush hour (7-9 AM or 5-7 PM)
    const isRushHour = (currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19);
    
    // Calculate expected speed based on road type
    // For urban roads: ~30-50 km/h → 0.5-0.83 km per minute
    // For highways: ~80-120 km/h → 1.33-2 km per minute
    const isLikelyHighway = speed > 1.0; // Assuming highway if speed > 60 km/h
    
    // Determine traffic level based on speed and time of day
    let calculatedTrafficLevel: 'low' | 'moderate' | 'high' | 'very_high';
    
    if (isLikelyHighway) {
      if (speed > 1.5) calculatedTrafficLevel = 'low';
      else if (speed > 1.2) calculatedTrafficLevel = isRushHour ? 'moderate' : 'low';
      else if (speed > 0.8) calculatedTrafficLevel = isRushHour ? 'high' : 'moderate';
      else calculatedTrafficLevel = isRushHour ? 'very_high' : 'high';
    } else {
      // Urban roads
      if (speed > 0.7) calculatedTrafficLevel = 'low'; 
      else if (speed > 0.5) calculatedTrafficLevel = isRushHour ? 'moderate' : 'low';
      else if (speed > 0.3) calculatedTrafficLevel = isRushHour ? 'high' : 'moderate';
      else calculatedTrafficLevel = isRushHour ? 'very_high' : 'high';
    }
    
    // Set traffic level state
    setTrafficLevel(calculatedTrafficLevel);
    
    // Calculate arrival time based on current time + duration
    const now = new Date();
    const arrival = addMinutes(now, durationMinutes);
    
    // Format arrival time
    const formattedArrival = format(arrival, "HH:mm", { locale: es });
    setArrivalTime(formattedArrival);
    
    console.log('Traffic info updated:', {
      distance,
      durationMinutes,
      speed: speed.toFixed(2),
      trafficLevel: calculatedTrafficLevel,
      arrivalTime: formattedArrival
    });
    
    return {
      trafficLevel: calculatedTrafficLevel,
      arrivalTime: formattedArrival
    };
  };
  
  return {
    trafficLevel,
    arrivalTime,
    updateTrafficInfo
  };
};
