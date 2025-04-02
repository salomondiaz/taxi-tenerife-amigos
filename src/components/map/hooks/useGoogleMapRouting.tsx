
import { useEffect } from 'react';
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
  showRoute = false
}: UseGoogleMapRoutingProps) {
  // Calculate and display route when origin and destination are available
  useEffect(() => {
    if (!mapRef.current || !directionsRendererRef.current || !showRoute || !origin || !destination) {
      // If no route should be shown, clear the directions renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        // Create a proper DirectionsResult object to clear the renderer
        const emptyDirectionsResult: google.maps.DirectionsResult = {
          routes: [],
          geocoded_waypoints: [],
          request: {
            origin: { lat: 0, lng: 0 },
            destination: { lat: 0, lng: 0 },
            travelMode: google.maps.TravelMode.DRIVING
          }
        };
        directionsRendererRef.current.setDirections(emptyDirectionsResult);
        directionsRendererRef.current.setMap(mapRef.current);
      }
      return;
    }
    
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
          
          // Fit map to route bounds
          if (mapRef.current && result.routes[0]?.bounds) {
            mapRef.current.fitBounds(result.routes[0].bounds);
          }
        } else {
          console.error("Error calculating route:", status);
        }
      }
    );
  }, [mapRef, directionsRendererRef, origin, destination, showRoute]);
}
