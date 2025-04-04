
import { useEffect, useRef } from 'react';
import { MapDriverPosition } from '../types';

interface UseGoogleMapDriverMarkerProps {
  map: google.maps.Map | null;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
}

export function useGoogleMapDriverMarker({
  map,
  showDriverPosition = false,
  driverPosition
}: UseGoogleMapDriverMarkerProps) {
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);
  
  // Add driver position marker
  useEffect(() => {
    if (!map || !showDriverPosition || !driverPosition) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
      return;
    }
    
    // Create driver marker if it doesn't exist
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new google.maps.Marker({
        map,
        position: { lat: driverPosition.lat, lng: driverPosition.lng },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          rotation: driverPosition.heading || 0
        },
        title: 'Driver',
        zIndex: 3
      });
    } else {
      // Update existing marker position
      driverMarkerRef.current.setPosition({ 
        lat: driverPosition.lat, 
        lng: driverPosition.lng 
      });
      
      // Update icon if heading is available
      if (driverPosition.heading !== undefined) {
        const icon = driverMarkerRef.current.getIcon() as google.maps.Symbol;
        icon.rotation = driverPosition.heading;
        driverMarkerRef.current.setIcon(icon);
      }
    }
    
    // Add pulsating effect if available
    if (driverPosition.pulsate) {
      // This would require custom animation code
    }
    
    return () => {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
    };
  }, [map, showDriverPosition, driverPosition]);

  return driverMarkerRef;
}
