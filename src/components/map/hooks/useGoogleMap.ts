
import { useRef, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from '../types';

interface UseGoogleMapProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  interactive?: boolean;
  apiKey: string;
  onMapReady: (map: google.maps.Map) => void;
}

export function useGoogleMap({
  mapContainerRef,
  origin,
  interactive = true,
  apiKey,
  onMapReady
}: UseGoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapIsInitialized = useRef<boolean>(false);
  
  // Initialize the map
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapIsInitialized.current) return;
    
    const tenerife = { lat: 28.2916, lng: -16.6291 };
    const initialCenter = origin ? { lat: origin.lat, lng: origin.lng } : tenerife;
    
    const mapOptions: google.maps.MapOptions = {
      center: initialCenter,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: "greedy", // Allow user to freely move map without Ctrl key
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
    
    try {
      mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
      mapIsInitialized.current = true;
      
      if (mapRef.current) {
        // Wait for the map to finish loading before calling onMapReady
        google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
          if (mapRef.current) {
            onMapReady(mapRef.current);
          }
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Error al cargar el mapa",
        description: "No se pudo inicializar Google Maps",
        variant: "destructive"
      });
    }
  }, [mapContainerRef, interactive, origin, onMapReady]);

  // Initialize map when API key is available
  useEffect(() => {
    if (!mapContainerRef.current || !apiKey || mapIsInitialized.current) return;

    if (!window.google?.maps) {
      // Only load the script once
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = "google-maps-script";
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
          // Don't remove the script on unmount to prevent re-loading
          // Just clean up other resources
          if (mapRef.current) {
            google.maps.event.clearInstanceListeners(mapRef.current);
          }
        };
      } else {
        // Script already exists, wait for it to load
        const checkGoogleMapsLoaded = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkGoogleMapsLoaded);
            initializeMap();
          }
        }, 100);
        
        return () => {
          clearInterval(checkGoogleMapsLoaded);
        };
      }
    } else {
      // Google Maps already loaded
      initializeMap();
    }
  }, [apiKey, initializeMap]);

  // Update map center when origin changes
  useEffect(() => {
    if (!mapRef.current || !origin) return;
    
    const newCenter = { lat: origin.lat, lng: origin.lng };
    mapRef.current.setCenter(newCenter);
  }, [origin]);

  return mapRef;
}
