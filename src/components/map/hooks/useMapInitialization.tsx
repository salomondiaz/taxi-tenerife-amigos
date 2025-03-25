
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useMapRouting } from './useMapRouting';
import { useMapEvents } from './useMapEvents';
import { useHomeLocation } from './useHomeLocation';
import { loadLastMapPosition } from '../services/MapRoutingService';
import { toast } from '@/hooks/use-toast';

interface UseMapInitializationProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  routeGeometry?: any;
  interactive?: boolean;
  apiKey: string;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showKeyInput: boolean;
  setShowKeyInput: (show: boolean) => void;
}

export function useMapInitialization({
  mapContainer,
  origin,
  destination,
  routeGeometry,
  interactive = true,
  apiKey,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  showKeyInput,
  setShowKeyInput
}: UseMapInitializationProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? 'origin' : 'none'
  );

  // Home location management
  const {
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  } = useHomeLocation(map, origin, onOriginChange);

  // Draw route between points if both exist
  useMapRouting(map, origin, destination, isHomeLocation);
  
  // Handle map click events for selection
  useMapEvents({
    map: map,
    apiKey,
    selectionMode,
    onOriginSelect: onOriginChange,
    onDestinationSelect: onDestinationChange
  });

  // Initialize map when API key is available
  useEffect(() => {
    if (!apiKey || !mapContainer.current || showKeyInput) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [28.2916, -16.6291], // Default to TENERIFE_CENTER
        zoom: 11,
        interactive: true,
        dragRotate: false,
        pitchWithRotate: false,
      });
      
      // Disable map rotation completely
      newMap.touchZoomRotate.disableRotation();
      
      // Configurar controles de navegación
      if (!allowMapSelection) {
        // Solo agregar controles de navegación si no estamos en modo selección
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        
        newMap.addControl(navControl, 'top-right');
      }
      
      // Configuración especial cuando estamos en modo selección
      if (allowMapSelection) {
        // IMPORTANTE: Deshabilitar completamente el zoom con scroll cuando estemos en modo selección
        newMap.scrollZoom.disable();
        
        // Deshabilitar zoom con doble click
        newMap.doubleClickZoom.disable();
      }
      
      newMap.once('load', () => {
        // Cargar última posición del mapa
        loadLastMapPosition(newMap);
        
        // Dibujar ruta si hay geometría y puntos
        if (routeGeometry && origin && destination) {
          try {
            if (newMap.getSource('route')) {
              newMap.removeLayer('route');
              newMap.removeSource('route');
            }
            
            newMap.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: routeGeometry
              }
            });
            
            newMap.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#1E88E5',
                'line-width': 4,
                'line-opacity': 0.7
              }
            });
          } catch (error) {
            console.error("Error drawing route from geometry:", error);
          }
        }
        
        // Notificar al usuario sobre el modo de selección
        if (allowMapSelection && selectionMode === 'origin') {
          toast({
            title: "Selección de punto de origen",
            description: "Haz clic en el mapa para seleccionar el origen de tu viaje",
          });
        }
      });
      
      setMap(newMap);
      
      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      setShowKeyInput(true);
      return undefined;
    }
  }, [apiKey, interactive, showKeyInput, setShowKeyInput, homeLocation, routeGeometry, origin, destination, mapContainer, allowMapSelection, selectionMode]);

  // Actualizar el comportamiento del mapa cuando cambia el modo de selección
  useEffect(() => {
    if (!map) return;
    
    // Change the cursor style based on selection mode
    if (map.getCanvas()) {
      if (selectionMode !== 'none') {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = '';
      }
    }
  }, [map, selectionMode]);

  return {
    map,
    selectionMode,
    setSelectionMode,
    homeLocation,
    showHomeMarker,
    isHomeLocation,
    saveHomeLocation,
    useHomeAsOrigin
  };
}
