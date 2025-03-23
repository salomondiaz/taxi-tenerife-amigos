
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from '@/hooks/use-toast';
import { TENERIFE_CENTER } from '../services/MapboxService';
import { MapCoordinates } from '../types';

interface UseMapInstanceProps {
  apiKey: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  interactive?: boolean;
  setShowKeyInput: (show: boolean) => void;
}

export function useMapInstance({
  apiKey,
  mapContainer,
  origin,
  interactive = true,
  setShowKeyInput
}: UseMapInstanceProps) {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origin 
          ? [origin.lng, origin.lat] 
          : [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 11,
        interactive: interactive
      });
      
      if (interactive) {
        map.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
        
        // Add geolocation button
        map.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );
      }
      
      map.on('load', () => {
        setMapInstance(map);
      });
      
      return () => {
        map.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Error loading map",
        description: "Please verify your Mapbox API key",
        variant: "destructive",
      });
      setShowKeyInput(true);
      return undefined;
    }
  }, [apiKey, mapContainer, origin, interactive, setShowKeyInput]);

  return mapInstance;
}
