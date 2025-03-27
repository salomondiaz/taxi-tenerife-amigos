
import { useEffect } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';

export function useGoogleMapRouting({
  mapRef,
  directionsRendererRef,
  origin,
  destination,
  showRoute
}: {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  directionsRendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showRoute?: boolean;
}) {
  // Calculate and display route
  const calculateAndDisplayRoute = () => {
    if (!mapRef.current || !origin || !destination || !directionsRendererRef.current) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK && response) {
          directionsRendererRef.current?.setDirections(response);
        } else {
          console.error('Error calculating route:', status);
          toast({
            title: 'Error',
            description: 'No se pudo calcular la ruta',
            variant: 'destructive'
          });
        }
      }
    );
  };

  // Update route when origin or destination changes
  useEffect(() => {
    if (!mapRef.current || !origin || !destination) return;
    
    if (showRoute) {
      calculateAndDisplayRoute();
    }
    
    const bounds = new google.maps.LatLngBounds();
    if (origin) bounds.extend({ lat: origin.lat, lng: origin.lng });
    if (destination) bounds.extend({ lat: destination.lat, lng: destination.lng });
    
    mapRef.current.fitBounds(bounds);
  }, [origin, destination, showRoute]);

  return { calculateAndDisplayRoute };
}
