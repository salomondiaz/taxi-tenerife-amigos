
import { useState, useEffect, useRef } from 'react';
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
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (!mapRef.current || !origin || !destination || !showRoute) {
      // Clear route if any condition is not met but renderer exists
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setDirections({ routes: [] } as google.maps.DirectionsResult);
      }
      return;
    }

    // Initialize directions service if not already done
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }

    const originLatLng = new google.maps.LatLng(origin.lat, origin.lng);
    const destinationLatLng = new google.maps.LatLng(destination.lat, destination.lng);

    // Calculate route
    directionsServiceRef.current.route(
      {
        origin: originLatLng,
        destination: destinationLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        provideRouteAlternatives: false
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
            
            // Store route bounds for later use
            if (result.routes.length > 0 && result.routes[0].bounds) {
              setBounds(result.routes[0].bounds);
            }
          }
        } else {
          console.error(`Error calculating route: ${status}`);
          // Clear route if there was an error
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections({ routes: [] } as google.maps.DirectionsResult);
          }
          // Create bounds from origin and destination anyway for fallback
          const newBounds = new google.maps.LatLngBounds();
          newBounds.extend(originLatLng);
          newBounds.extend(destinationLatLng);
          setBounds(newBounds);
        }
      }
    );
  }, [mapRef.current, directionsRendererRef.current, origin, destination, showRoute]);

  return { bounds };
}
