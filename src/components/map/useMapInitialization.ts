
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from './types';
import { toast } from '@/hooks/use-toast';
import { addOriginMarker, addDestinationMarker, addDriverMarker, drawRoute, fitMapToBounds, geocodeAddress } from './MapboxUtils';

interface UseMapInitializationProps {
  apiKey: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  originMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  destinationMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  driverMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  showDriverPosition?: boolean;
  driverPosition?: {
    lat: number;
    lng: number;
  };
  interactive?: boolean;
  setShowKeyInput: (show: boolean) => void;
}

export const useMapInitialization = ({
  apiKey,
  mapContainer,
  map,
  originMarker,
  destinationMarker,
  driverMarker,
  origin,
  destination,
  showDriverPosition = false,
  driverPosition,
  interactive = true,
  setShowKeyInput
}: UseMapInitializationProps): void => {
  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origin ? [origin.lng, origin.lat] : [-16.2519, 28.4689],
        zoom: 12,
        interactive: interactive
      });
      
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      }
      
      map.current.on('load', async () => {
        let originCoords = origin;
        let destinationCoords = destination;
        
        if (origin?.address && (!origin.lat || !origin.lng)) {
          const geocoded = await geocodeAddress(origin.address, apiKey);
          if (geocoded) {
            originCoords = {
              lat: geocoded.lat,
              lng: geocoded.lng,
              address: origin.address
            };
          }
        }
        
        if (destination?.address && (!destination.lat || !destination.lng)) {
          const geocoded = await geocodeAddress(destination.address, apiKey);
          if (geocoded) {
            destinationCoords = {
              lat: geocoded.lat,
              lng: geocoded.lng,
              address: destination.address
            };
          }
        }
        
        if (originCoords && map.current) {
          originMarker.current = addOriginMarker(map.current, originCoords);
        }
        
        if (destinationCoords && map.current) {
          destinationMarker.current = addDestinationMarker(map.current, destinationCoords);
        }
        
        if (originCoords && destinationCoords && map.current) {
          fitMapToBounds(map.current, originCoords, destinationCoords);
          drawRoute(map.current, originCoords, destinationCoords);
        }
        
        if (showDriverPosition && map.current) {
          const startPosition = driverPosition || origin;
          
          if (startPosition) {
            driverMarker.current = addDriverMarker(map.current, startPosition);
          }
        }
      });
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      toast({
        title: "Error al cargar el mapa",
        description: "Por favor, verifica tu clave API de Mapbox",
        variant: "destructive",
      });
      setShowKeyInput(true);
    }
    
    return () => {
      map.current?.remove();
    };
  }, [apiKey, origin, destination, showDriverPosition, driverPosition, interactive, mapContainer, map, originMarker, destinationMarker, driverMarker, setShowKeyInput]);
};
