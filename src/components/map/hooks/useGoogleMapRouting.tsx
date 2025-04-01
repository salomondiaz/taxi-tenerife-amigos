
import { useEffect, useCallback, useRef } from 'react';
import { MapCoordinates } from '../types';

interface UseGoogleMapRoutingProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  directionsRendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showRoute?: boolean;
}

export function useGoogleMapRouting({
  mapRef,
  directionsRendererRef,
  origin,
  destination,
  showRoute = true
}: UseGoogleMapRoutingProps) {
  // State for route bounds
  const bounds = useRef<google.maps.LatLngBounds | null>(null);

  // Update route when origin or destination changes
  const updateRoute = useCallback(() => {
    if (!mapRef.current || !directionsRendererRef.current) return;
    
    if (!showRoute || !origin || !destination) {
      // Clear previous route
      directionsRendererRef.current.setDirections(null);
      return;
    }
    
    try {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            
            // Store route bounds if available
            if (result.routes && result.routes[0] && result.routes[0].bounds) {
              bounds.current = result.routes[0].bounds;
            }
          } else {
            console.error("Directions request failed:", status);
            directionsRendererRef.current?.setDirections(null);
            bounds.current = null;
          }
        }
      );
    } catch (error) {
      console.error("Error calculating route:", error);
      directionsRendererRef.current?.setDirections(null);
      bounds.current = null;
    }
  }, [mapRef, directionsRendererRef, origin, destination, showRoute]);

  useEffect(() => {
    updateRoute();
  }, [updateRoute, origin, destination]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(null);
      }
      bounds.current = null;
    };
  }, []);

  return { updateRoute, bounds: bounds.current };
}
