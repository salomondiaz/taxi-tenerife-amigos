
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/MapboxService';
import { toast } from '@/hooks/use-toast';

interface UseMapEventsProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  selectionMode: MapSelectionMode;
  onOriginSelect?: (coordinates: MapCoordinates) => void;
  onDestinationSelect?: (coordinates: MapCoordinates) => void;
}

export function useMapEvents({
  map,
  apiKey,
  selectionMode,
  onOriginSelect,
  onDestinationSelect
}: UseMapEventsProps) {
  // Manejar el cursor del mapa según el modo de selección
  useEffect(() => {
    if (!map) return;
    
    try {
      // Función segura para actualizar el cursor
      const updateCursor = () => {
        if (map && map.getCanvas()) {
          if (selectionMode !== 'none') {
            map.getCanvas().style.cursor = 'crosshair';
          } else {
            map.getCanvas().style.cursor = '';
          }
        }
      };
      
      // Actualizar el cursor inicialmente
      if (map.loaded()) {
        updateCursor();
      } else {
        map.once('load', updateCursor);
      }
      
      // Limpiar al desmontar
      return () => {
        try {
          if (map && map.getCanvas()) {
            map.getCanvas().style.cursor = '';
          }
          if (!map.loaded()) {
            map.off('load', updateCursor);
          }
        } catch (error) {
          console.error("Error al restablecer el cursor:", error);
        }
      };
    } catch (error) {
      console.error("Error en el efecto del cursor:", error);
    }
  }, [map, selectionMode]);
  
  // Handle map click events for selection
  useEffect(() => {
    if (!map) return;
    
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      try {
        // Prevenir el comportamiento predeterminado si estamos en modo de selección
        if (selectionMode === 'none') {
          return; // No procesar si no estamos en modo de selección
        }
        
        // Detener eventos subyacentes
        e.preventDefault();
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
        
        console.log("Map clicked in mode:", selectionMode);
        
        const lngLat = e.lngLat;
        const coordinates = {
          lat: lngLat.lat,
          lng: lngLat.lng
        };
        
        // Obtain address via reverse geocoding
        try {
          const address = await reverseGeocode(coordinates, apiKey);
          const coordsWithAddress = { ...coordinates, address };
          
          if (selectionMode === 'origin' && onOriginSelect) {
            console.log("Setting origin to:", coordsWithAddress);
            onOriginSelect(coordsWithAddress);
            toast({
              title: "Origen seleccionado",
              description: address || "Ubicación seleccionada en el mapa",
            });
          } else if (selectionMode === 'destination' && onDestinationSelect) {
            console.log("Setting destination to:", coordsWithAddress);
            onDestinationSelect(coordsWithAddress);
            toast({
              title: "Destino seleccionado",
              description: address || "Ubicación seleccionada en el mapa",
            });
          }
        } catch (error) {
          console.error("Error during reverse geocoding:", error);
          
          // Even if geocoding fails, still set the coordinates
          if (selectionMode === 'origin' && onOriginSelect) {
            onOriginSelect(coordinates);
            toast({
              title: "Origen seleccionado",
              description: "No se pudo obtener la dirección",
            });
          } else if (selectionMode === 'destination' && onDestinationSelect) {
            onDestinationSelect(coordinates);
            toast({
              title: "Destino seleccionado",
              description: "No se pudo obtener la dirección",
            });
          }
        }
      } catch (error) {
        console.error("Error procesando el clic en el mapa:", error);
      }
    };
    
    // Solo agregar el controlador de clics si estamos en modo de selección
    if (selectionMode !== 'none' && map) {
      if (map.loaded()) {
        map.on('click', handleMapClick);
      } else {
        map.once('load', () => {
          map.on('click', handleMapClick);
        });
      }
    }
    
    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
}
