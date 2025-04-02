
import { useEffect } from 'react';
import { MapCoordinates } from '../types';

interface UseGoogleMapRoutingProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  directionsRendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>;
  origin?: MapCoordinates | null;
  destination?: MapCoordinates | null;
  showRoute?: boolean;
}

export function useGoogleMapRouting({
  mapRef,
  directionsRendererRef,
  origin,
  destination,
  showRoute = false
}: UseGoogleMapRoutingProps) {
  
  // Update route when origin or destination changes
  useEffect(() => {
    if (!mapRef.current || !directionsRendererRef.current || !showRoute) {
      return;
    }
    
    if (origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    } else {
      // Clear the route if we don't have both origin and destination
      directionsRendererRef.current.setDirections({ routes: [] } as google.maps.DirectionsResult);
    }
  }, [mapRef, directionsRendererRef, origin, destination, showRoute]);
}
