
import { useRef, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from '../types';

interface UseGoogleMapInitializationProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  interactive?: boolean;
  apiKey: string;
  onMapReady: (map: google.maps.Map) => void;
}

export function useGoogleMapInitialization({
  mapContainerRef,
  origin,
  interactive = true,
  apiKey,
  onMapReady
}: UseGoogleMapInitializationProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Initialize the map
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    const tenerife = { lat: 28.2916, lng: -16.6291 };
    const initialCenter = origin ? { lat: origin.lat, lng: origin.lng } : tenerife;
    
    const mapOptions: google.maps.MapOptions = {
      center: initialCenter,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: interactive ? 'greedy' : 'none',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
    
    mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
    
    if (mapRef.current) {
      onMapReady(mapRef.current);
    }
    
  }, [mapContainerRef, interactive, origin, onMapReady]);

  // Initialize map when API key is available
  useEffect(() => {
    if (!mapContainerRef.current || !apiKey) return;

    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        console.error('Error loading Google Maps API');
        toast({
          title: 'Error',
          description: 'No se pudo cargar Google Maps',
          variant: 'destructive'
        });
      };
      
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [apiKey, initializeMap]);

  return mapRef;
}
