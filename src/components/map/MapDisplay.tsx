
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '@/hooks/use-toast';

import { MapProps, MapCoordinates, MapSelectionMode } from './types';
import MapApiKeyInput from './MapApiKeyInput';
import MapSelectionControl from './controls/MapSelectionControl';
import SelectionHint from './controls/SelectionHint';
import OriginMarker from './markers/OriginMarker';
import DestinationMarker from './markers/DestinationMarker';
import DriverMarker from './markers/DriverMarker';
import { useMapRouting } from './hooks/useMapRouting';
import { useMapEvents } from './hooks/useMapEvents';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { TENERIFE_CENTER } from './services/MapboxService';
import { API_KEY_STORAGE_KEY } from './types';

const MapDisplay: React.FC<MapProps> = ({
  origin,
  destination,
  showDriverPosition = false,
  driverPosition,
  style,
  className = "",
  interactive = true,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(
    allowMapSelection ? 'origin' : 'none'
  );

  // Load API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  // Initialize map when API key is available
  useEffect(() => {
    if (!apiKey || !mapContainer.current || showKeyInput) return;
    
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
      
      // Cambiar el cursor para toda el área del mapa 
      map.current.getCanvas().style.cursor = 'default';
      
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
        
        // Add geolocation button
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
      
      // Cambiar el cursor cuando se está en modo de selección
      map.current.on('load', () => {
        if (allowMapSelection && selectionMode !== 'none') {
          map.current!.getCanvas().style.cursor = 'crosshair';
        }
        
        // Si ambos puntos están establecidos, ajustar los límites para mostrarlos
        if (origin && destination && map.current) {
          const bounds = new mapboxgl.LngLatBounds()
            .extend([origin.lng, origin.lat])
            .extend([destination.lng, destination.lat]);
            
          map.current.fitBounds(bounds, {
            padding: 60,
            maxZoom: 14
          });
        } else if (origin && map.current) {
          // Si solo se establece el origen, centrarse en él
          map.current.flyTo({
            center: [origin.lng, origin.lat],
            zoom: 14
          });
        } else if (destination && map.current) {
          // Si solo se establece el destino, centrarse en él
          map.current.flyTo({
            center: [destination.lng, destination.lat],
            zoom: 14
          });
        }
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      toast({
        title: "Error al cargar el mapa",
        description: "Por favor, verifica tu clave API de Mapbox",
        variant: "destructive",
      });
      setShowKeyInput(true);
    }
  }, [apiKey, origin, destination, interactive, showKeyInput]);

  // Actualizar el cursor del mapa cuando cambia el modo de selección
  useEffect(() => {
    if (!map.current || !map.current.getCanvas()) return;
    
    if (allowMapSelection && selectionMode !== 'none') {
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = 'default';
    }
  }, [selectionMode, allowMapSelection]);

  // Draw route between points if both exist
  useMapRouting(map.current, origin, destination);
  
  // Handle map click events for selection
  useMapEvents({
    map: map.current,
    apiKey,
    selectionMode,
    onOriginSelect: onOriginChange,
    onDestinationSelect: onDestinationChange
  });
  
  // Current location handler
  const { getLocation } = useCurrentLocation({
    apiKey,
    onLocationFound: onOriginChange
  });

  const handleApiKeySubmit = () => {
    setShowKeyInput(false);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {showKeyInput ? (
        <MapApiKeyInput
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSubmit={handleApiKeySubmit}
          testMode={false}
          onSkip={() => setShowKeyInput(false)}
        />
      ) : (
        <>
          <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm overflow-hidden" />
          
          {map.current && origin && (
            <OriginMarker 
              map={map.current} 
              coordinates={origin}
              onDragEnd={onOriginChange}
            />
          )}
          
          {map.current && destination && (
            <DestinationMarker 
              map={map.current} 
              coordinates={destination}
              onDragEnd={onDestinationChange}
            />
          )}
          
          {map.current && showDriverPosition && driverPosition && (
            <DriverMarker 
              map={map.current} 
              position={driverPosition}
            />
          )}
          
          {allowMapSelection && (
            <MapSelectionControl
              selectionMode={selectionMode}
              setSelectionMode={setSelectionMode}
              onUseCurrentLocation={getLocation}
            />
          )}
          
          <SelectionHint selectionMode={selectionMode} />
        </>
      )}
    </div>
  );
};

export default MapDisplay;
