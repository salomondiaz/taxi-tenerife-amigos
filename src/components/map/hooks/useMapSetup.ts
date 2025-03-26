
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { loadLastMapPosition } from '../services/MapRoutingService';
import { toast } from '@/hooks/use-toast';
import { TENERIFE_CENTER, TENERIFE_BOUNDS } from '../services/MapboxService';

interface UseMapSetupProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  apiKey: string;
  interactive: boolean;
  showKeyInput: boolean;
  setShowKeyInput: (show: boolean) => void;
  allowMapSelection: boolean;
  routeGeometry?: any;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
}

export function useMapSetup({
  mapContainer,
  apiKey,
  interactive,
  showKeyInput,
  setShowKeyInput,
  allowMapSelection,
  routeGeometry,
  origin,
  destination
}: UseMapSetupProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

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
      
      // Configure navigation controls
      if (!allowMapSelection) {
        // Add navigation controls only if not in selection mode
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        
        newMap.addControl(navControl, 'top-right');
      } else {
        // If in selection mode, add controls in a different position
        const navControl = new mapboxgl.NavigationControl({
          showCompass: false,
          showZoom: true,
          visualizePitch: false
        });
        
        newMap.addControl(navControl, 'bottom-right');
      }
      
      // Special configuration when in selection mode
      if (allowMapSelection) {
        // Disable double-click zoom to avoid interference when selecting
        newMap.doubleClickZoom.disable();
      }
      
      newMap.once('load', () => {
        // Load last map position
        loadLastMapPosition(newMap);
        
        // Draw route if geometry and points exist
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
        
        // Notify user about how to select points
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
  }, [apiKey, interactive, showKeyInput, setShowKeyInput, routeGeometry, origin, destination, mapContainer, allowMapSelection]);

  return map;
}
