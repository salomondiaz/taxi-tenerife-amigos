
import { useEffect, useState } from 'react';
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
  useEffect(() => {
    if (!showRoute || !origin || !destination || !mapRef.current || !directionsRendererRef.current) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(null);
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
        } else {
          console.error('Directions request failed: ', status);
          // Draw a straight line if directions failed
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(null);
          }
        }
      }
    );
  }, [mapRef, directionsRendererRef, origin, destination, showRoute]);
}
