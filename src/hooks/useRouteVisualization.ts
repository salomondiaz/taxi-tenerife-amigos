
import { useState, useEffect } from 'react';
import { MapCoordinates, MapDriverPosition } from '@/components/map/types';

interface UseRouteVisualizationProps {
  driverPosition: MapDriverPosition | null;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  hasPickedUp: boolean;
  isDriverAssigned: boolean;
}

export function useRouteVisualization({
  driverPosition,
  originCoords,
  destinationCoords,
  hasPickedUp,
  isDriverAssigned
}: UseRouteVisualizationProps) {
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Calculate routes based on current state
  useEffect(() => {
    if (!isDriverAssigned || !driverPosition) {
      setRouteGeometry(null);
      return;
    }
    
    const calculateRoute = async () => {
      setIsCalculating(true);
      setRouteError(null);
      
      try {
        // Create DirectionsService instance
        const directionsService = new google.maps.DirectionsService();
        
        if (hasPickedUp && originCoords && destinationCoords) {
          // Calculate route from origin to destination (passenger is in the car)
          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route(
              {
                origin: { lat: originCoords.lat, lng: originCoords.lng },
                destination: { lat: destinationCoords.lat, lng: destinationCoords.lng },
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                  resolve(result);
                } else {
                  reject(status);
                }
              }
            );
          });
          
          // Extract route geometry for rendering
          setRouteGeometry(result.routes[0].overview_polyline);
        } else if (!hasPickedUp && originCoords) {
          // Calculate route from driver to pickup location
          const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route(
              {
                origin: { lat: driverPosition.lat, lng: driverPosition.lng },
                destination: { lat: originCoords.lat, lng: originCoords.lng },
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                  resolve(result);
                } else {
                  reject(status);
                }
              }
            );
          });
          
          // Extract route geometry for rendering
          setRouteGeometry(result.routes[0].overview_polyline);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        setRouteError('Could not calculate route');
        setRouteGeometry(null);
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculateRoute();
  }, [driverPosition, originCoords, destinationCoords, hasPickedUp, isDriverAssigned]);
  
  return { routeGeometry, routeError, isCalculating };
}
