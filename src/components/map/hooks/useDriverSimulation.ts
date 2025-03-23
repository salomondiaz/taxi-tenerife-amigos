import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapDriverPosition } from '../types';

interface UseDriverSimulationProps {
  testMode: boolean;
  showDriverPosition: boolean;
  map?: mapboxgl.Map | null;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  driverPosition?: MapDriverPosition;
}

export const useDriverSimulation = ({
  testMode,
  showDriverPosition,
  origin,
  destination,
  driverPosition
}: UseDriverSimulationProps) => {
  // Keep track of the interval to clear it on component unmount
  const intervalRef = useRef<number | null>(null);
  
  // Current position state (to be updated in the simulation)
  const currentPositionRef = useRef<MapDriverPosition | null>(null);
  
  // Driver marker reference (to update its position)
  const simulatedPositionCallback = useRef<((pos: MapDriverPosition) => void) | null>(null);
  
  // Set up the simulation when all required data is available
  useEffect(() => {
    if (testMode && showDriverPosition && origin && destination) {
      let step = 0;
      const totalSteps = 100;
      
      // Starting point (driver position or origin)
      let startLat = origin.lat;
      let startLng = origin.lng;
      
      // If we have a specific driver position, use that as the starting point
      if (driverPosition) {
        startLat = driverPosition.lat;
        startLng = driverPosition.lng;
        
        // Initialize the current position
        currentPositionRef.current = driverPosition;
      } else {
        // Initialize with origin position but slightly offset to simulate approach
        currentPositionRef.current = {
          lat: startLat - 0.01,
          lng: startLng + 0.005
        };
      }
      
      const endLat = destination.lat;
      const endLng = destination.lng;
      
      const latStep = (endLat - startLat) / totalSteps;
      const lngStep = (endLng - startLng) / totalSteps;
      
      // Clear any existing interval
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      
      // Set up a new interval for the simulation
      intervalRef.current = window.setInterval(() => {
        step++;
        
        if (step >= totalSteps) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        const nextLat = startLat + latStep * step;
        const nextLng = startLng + lngStep * step;
        
        // Update current position
        currentPositionRef.current = {
          lat: nextLat,
          lng: nextLng
        };
        
        // Call the callback if one is registered
        if (simulatedPositionCallback.current && currentPositionRef.current) {
          simulatedPositionCallback.current(currentPositionRef.current);
        }
      }, 500);
      
      // Cleanup on unmount or when dependencies change
      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [testMode, showDriverPosition, driverPosition, origin, destination]);
  
  // Register a callback to get updated positions
  const registerPositionCallback = (callback: (pos: MapDriverPosition) => void) => {
    simulatedPositionCallback.current = callback;
    
    // If we already have a position, call the callback immediately
    if (currentPositionRef.current) {
      callback(currentPositionRef.current);
    }
    
    // Return an unregister function
    return () => {
      simulatedPositionCallback.current = null;
    };
  };
  
  return { registerPositionCallback };
};
