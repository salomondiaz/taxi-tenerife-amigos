
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
        interactive: interactive,
        dragRotate: false, // Disable rotation with drag
        pitchWithRotate: false, // Disable pitch with rotation
        dragPan: !allowMapSelection, // Disable pan with drag if we're in selection mode
      });
      
      // Disable map rotation completely
      newMap.touchZoomRotate.disableRotation();
      
      if (interactive) {
        // Only add basic navigation controls
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false, // Hide compass to prevent rotations
          showZoom: true,     // Keep zoom controls
          visualizePitch: false // Don't visualize pitch
        });
        
        newMap.addControl(navControl, 'top-right');
        
        // Disable double click for zoom
        newMap.doubleClickZoom.disable();
        
        // Reduce scroll sensitivity for zoom
        newMap.scrollZoom.setWheelZoomRate(0.5);
        
        // Add geolocation button
        newMap.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: false, // Change to false to avoid continuous tracking
            showUserHeading: true
          }),
          'top-right'
        );
      }
      
      // Special configuration for map selection
      if (allowMapSelection) {
        // Specific events to prevent map manipulation in selection mode
        newMap.on('dragstart', (e) => {
          if (selectionMode !== 'none') {
            // We can't use preventDefault here since it doesn't exist on this event type
            // Instead we'll use stopPropagation to prevent the drag behavior
            if (e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
          }
        });
        
        // Prevent zoom with scroll in selection mode
        newMap.scrollZoom.disable();
      }
      
      newMap.once('load', () => {
        // Load last map position when map is ready
        loadLastMapPosition(newMap);
        
        // If there's route geometry, draw it
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
        
        // Notify user about selection mode
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
