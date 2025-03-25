
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useMapRouting } from './useMapRouting';
import { useMapEvents } from './useMapEvents';
import { useHomeLocation } from './useHomeLocation';
import { loadLastMapPosition } from '../services/MapRoutingService';

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
        interactive: interactive,
        dragRotate: false, // Deshabilitar rotación con arrastre
        pitchWithRotate: false, // Deshabilitar inclinación con rotación
        dragPan: !allowMapSelection, // Deshabilitar pan con arrastre si estamos en modo selección
      });
      
      // Deshabilitar completamente la rotación del mapa
      newMap.touchZoomRotate.disableRotation();
      
      if (interactive) {
        // Solo agregar los controles de navegación básicos
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false, // Ocultar la brújula para evitar rotaciones
          showZoom: true,     // Mantener los controles de zoom
          visualizePitch: false // No visualizar la inclinación
        });
        
        newMap.addControl(navControl, 'top-right');
        
        // Deshabilitar el doble clic para zoom
        newMap.doubleClickZoom.disable();
        
        // Reducir la sensibilidad del scroll para zoom
        newMap.scrollZoom.setWheelZoomRate(0.5);
        
        // Add geolocation button
        newMap.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: false, // Cambiar a false para evitar tracking continuo
            showUserHeading: true
          }),
          'top-right'
        );
      }
      
      // Configuración especial para selección en el mapa
      if (allowMapSelection) {
        // Eventos específicos para prevenir manipulación del mapa en modo selección
        newMap.on('dragstart', (e) => {
          if (selectionMode !== 'none') {
            e.preventDefault();
          }
        });
        
        // Prevenir zoom con scroll en modo selección
        newMap.scrollZoom.disable();
      }
      
      newMap.once('load', () => {
        // Load last map position when map is ready
        loadLastMapPosition(newMap);
        
        // Si hay geometría de ruta, dibujarla
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
            console.error("Error dibujando ruta desde geometría:", error);
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
      console.error("Error al inicializar el mapa:", error);
      setShowKeyInput(true);
      return undefined;
    }
  }, [apiKey, interactive, showKeyInput, setShowKeyInput, homeLocation, routeGeometry, origin, destination, mapContainer, allowMapSelection, selectionMode]);

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
