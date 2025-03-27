
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
    if (!mapRef.current || !showDriverPosition) return;
    
    const startPosition = driverPosition || origin;
    
    if (startPosition) {
      try {
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setPosition({ lat: startPosition.lat, lng: startPosition.lng });
        } else {
          const markerEl = document.createElement('div');
          
          const driverIconHTML = `
            <div style="background-color: #1E88E5; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car">
                <path d="M5 11.5h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/>
                <path d="M6 15.5v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3"/>
                <path d="m14 15.5 1-5h5l1 5"/>
                <path d="m3 15.5 1-5h5l1 5"/>
                <path d="M7 10.5h10"/>
                <path d="M13 10.5V5.5h1v5"/>
                <path d="M10 10.5V5.5h1v5"/>
              </svg>
            </div>
          `;
          
          markerEl.innerHTML = driverIconHTML;
          
          driverMarkerRef.current = new google.maps.Marker({
            position: { lat: startPosition.lat, lng: startPosition.lng },
            map: mapRef.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/cabs.png',
              scaledSize: new google.maps.Size(32, 32)
            }
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
