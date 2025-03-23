
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from './types';
import { toast } from '@/hooks/use-toast';
import { 
  addOriginMarker, 
  addDestinationMarker, 
  addDriverMarker, 
  drawRoute, 
  fitMapToBounds, 
  geocodeAddress, 
  reverseGeocode,
  TENERIFE_CENTER
} from './MapboxUtils';

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
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  allowMapSelection?: boolean;
  defaultSelectionMode?: MapSelectionMode;
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
  setShowKeyInput,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false,
  defaultSelectionMode = 'none'
}: UseMapInitializationProps): { selectionMode: MapSelectionMode; setSelectionMode: (mode: MapSelectionMode) => void } => {
  // Inicializamos el modo de selección con el valor por defecto
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? defaultSelectionMode : 'none'
  );

  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origin 
          ? [origin.lng, origin.lat] 
          : [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 11,
        interactive: interactive
      });
      
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
        
        // Añadir botón de geolocación
        map.current.addControl(
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
          
          // Evento para cuando el marcador de origen se mueve
          if (onOriginChange && originMarker.current) {
            originMarker.current.on('dragend', async () => {
              const lngLat = originMarker.current?.getLngLat();
              if (lngLat) {
                const coords = { lat: lngLat.lat, lng: lngLat.lng };
                const address = await reverseGeocode(coords, apiKey);
                onOriginChange({ ...coords, address: address || undefined });
                
                // Actualizar ruta si ambos marcadores existen
                if (originMarker.current && destinationMarker.current && map.current) {
                  const destLngLat = destinationMarker.current.getLngLat();
                  drawRoute(map.current, coords, { lat: destLngLat.lat, lng: destLngLat.lng });
                }
              }
            });
          }
        }
        
        if (destinationCoords && map.current) {
          destinationMarker.current = addDestinationMarker(map.current, destinationCoords);
          
          // Evento para cuando el marcador de destino se mueve
          if (onDestinationChange && destinationMarker.current) {
            destinationMarker.current.on('dragend', async () => {
              const lngLat = destinationMarker.current?.getLngLat();
              if (lngLat) {
                const coords = { lat: lngLat.lat, lng: lngLat.lng };
                const address = await reverseGeocode(coords, apiKey);
                onDestinationChange({ ...coords, address: address || undefined });
                
                // Actualizar ruta si ambos marcadores existen
                if (originMarker.current && destinationMarker.current && map.current) {
                  const origLngLat = originMarker.current.getLngLat();
                  drawRoute(map.current, { lat: origLngLat.lat, lng: origLngLat.lng }, coords);
                }
              }
            });
          }
        }
        
        if (originCoords && destinationCoords && map.current) {
          fitMapToBounds(map.current, originCoords, destinationCoords);
          drawRoute(map.current, originCoords, destinationCoords);
        } else if (originCoords && map.current) {
          map.current.flyTo({
            center: [originCoords.lng, originCoords.lat],
            zoom: 14
          });
        } else if (destinationCoords && map.current) {
          map.current.flyTo({
            center: [destinationCoords.lng, destinationCoords.lat],
            zoom: 14
          });
        }
        
        if (showDriverPosition && map.current) {
          const startPosition = driverPosition || origin;
          
          if (startPosition) {
            driverMarker.current = addDriverMarker(map.current, startPosition);
          }
        }
        
        // Permitir selección de ubicación en el mapa
        if (allowMapSelection && map.current) {
          map.current.on('click', async (e) => {
            if (selectionMode === 'origin') {
              const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
              const address = await reverseGeocode(coords, apiKey);
              
              // Remover marcador existente
              if (originMarker.current) {
                originMarker.current.remove();
              }
              
              // Añadir nuevo marcador
              originMarker.current = addOriginMarker(map.current!, { 
                ...coords, 
                address: address || undefined 
              });
              
              // Llamar al callback
              if (onOriginChange) {
                onOriginChange({ ...coords, address: address || undefined });
              }
              
              // Actualizar ruta si ambos marcadores existen
              if (originMarker.current && destinationMarker.current && map.current) {
                const destLngLat = destinationMarker.current.getLngLat();
                drawRoute(map.current, coords, { lat: destLngLat.lat, lng: destLngLat.lng });
              }
              
              // No reseteamos el modo de selección para permitir múltiples selecciones
              
              toast({
                title: "Origen seleccionado",
                description: address || "Ubicación seleccionada en el mapa",
              });
            } else if (selectionMode === 'destination') {
              const coords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
              const address = await reverseGeocode(coords, apiKey);
              
              // Remover marcador existente
              if (destinationMarker.current) {
                destinationMarker.current.remove();
              }
              
              // Añadir nuevo marcador
              destinationMarker.current = addDestinationMarker(map.current!, { 
                ...coords, 
                address: address || undefined 
              });
              
              // Llamar al callback
              if (onDestinationChange) {
                onDestinationChange({ ...coords, address: address || undefined });
              }
              
              // Actualizar ruta si ambos marcadores existen
              if (originMarker.current && destinationMarker.current && map.current) {
                const origLngLat = originMarker.current.getLngLat();
                drawRoute(map.current, { lat: origLngLat.lat, lng: origLngLat.lng }, coords);
              }
              
              // No reseteamos el modo de selección para permitir múltiples selecciones
              
              toast({
                title: "Destino seleccionado",
                description: address || "Ubicación seleccionada en el mapa",
              });
            }
          });
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
  }, [apiKey, origin, destination, showDriverPosition, driverPosition, interactive, mapContainer, map, originMarker, destinationMarker, driverMarker, setShowKeyInput, onOriginChange, onDestinationChange, allowMapSelection, selectionMode]);

  return { selectionMode, setSelectionMode };
};
