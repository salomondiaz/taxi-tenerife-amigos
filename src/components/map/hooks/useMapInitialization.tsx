import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useMapRouting } from './useMapRouting';
import { useMapEvents } from './useMapEvents';
import { useHomeLocation } from './useHomeLocation';
import { loadLastMapPosition } from '../services/MapRoutingService';
import { toast } from '@/hooks/use-toast';
import { TENERIFE_CENTER, TENERIFE_BOUNDS } from '../services/MapboxService';

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
    allowMapSelection ? 'none' : 'none'
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
    map,
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
        center: [TENERIFE_CENTER.lng, TENERIFE_CENTER.lat],
        zoom: 11,
        interactive: true,
        dragRotate: false,
        pitchWithRotate: false,
        maxBounds: [
          [TENERIFE_BOUNDS.minLng - 0.1, TENERIFE_BOUNDS.minLat - 0.1],
          [TENERIFE_BOUNDS.maxLng + 0.1, TENERIFE_BOUNDS.maxLat + 0.1]
        ]
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
      } else {
        // Si estamos en modo selección, agregar controles específicos
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        
        // Agregar controles en una posición diferente para no interferir con la selección
        newMap.addControl(navControl, 'bottom-right');
      }
      
      // Configuración especial cuando estamos en modo selección
      if (allowMapSelection) {
        // Deshabilitar completamente el zoom con scroll cuando estemos en modo selección
        // newMap.scrollZoom.disable(); - Permitimos el scroll zoom para mejor experiencia
        
        // Deshabilitar zoom con doble click para evitar interferencias al seleccionar
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
        
        // Notificar al usuario sobre cómo seleccionar puntos
        if (allowMapSelection) {
          toast({
            title: "Selección en el mapa",
            description: "Usa los botones para elegir si quieres marcar el origen o destino, luego haz clic en el mapa",
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
  }, [apiKey, interactive, showKeyInput, setShowKeyInput, homeLocation, routeGeometry, origin, destination, mapContainer, allowMapSelection]);

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
