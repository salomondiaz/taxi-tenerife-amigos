
import { useEffect, useRef } from 'react';
import { MapDriverPosition, MapCoordinates } from '../types';

export function useGoogleMapDriverMarker({
  mapRef,
  showDriverPosition,
  driverPosition,
  origin
}: {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  origin?: MapCoordinates;
}) {
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);

  // Add driver marker to map
  useEffect(() => {
    if (!mapRef.current || !showDriverPosition) {
      // Clean up marker if not showing driver position
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
      return;
    }
    
    const startPosition = driverPosition || origin;
    
    if (startPosition) {
      try {
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setPosition({ lat: startPosition.lat, lng: startPosition.lng });
          
          // Update rotation if heading is available
          if (driverPosition?.heading !== undefined && google.maps.Symbol) {
            const icon = driverMarkerRef.current.getIcon();
            if (typeof icon !== 'string' && icon && 'rotation' in icon) {
              icon.rotation = driverPosition.heading;
              driverMarkerRef.current.setIcon(icon);
            }
          }
        } else {
          // Create new marker
          driverMarkerRef.current = new google.maps.Marker({
            position: { lat: startPosition.lat, lng: startPosition.lng },
            map: mapRef.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/cabs.png',
              scaledSize: new google.maps.Size(32, 32)
            },
            title: 'Driver',
            animation: google.maps.Animation.DROP
          });
        }
      } catch (error) {
        console.error("Error setting up driver marker:", error);
      }
    }

    return () => {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
    };
  }, [mapRef.current, showDriverPosition, driverPosition, origin]);

  return { driverMarkerRef };
}
