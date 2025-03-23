
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '@/context/AppContext';
import { MapProps, API_KEY_STORAGE_KEY } from './types';
import MapApiKeyInput from './MapApiKeyInput';
import { useMapInitialization } from './useMapInitialization';
import { useDriverSimulation } from './useDriverSimulation';

const Map: React.FC<MapProps> = ({ 
  origin, 
  destination, 
  showDriverPosition = false,
  driverPosition,
  style, 
  className = "",
  interactive = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const originMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const { testMode } = useAppContext();

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

  // Initialize map
  useMapInitialization({
    apiKey,
    mapContainer,
    map,
    originMarker,
    destinationMarker,
    driverMarker,
    origin,
    destination,
    showDriverPosition,
    driverPosition,
    interactive,
    setShowKeyInput
  });

  // Driver simulation effect
  useDriverSimulation({
    testMode,
    showDriverPosition,
    map: map.current,
    driverMarker,
    origin,
    destination,
    driverPosition
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
          testMode={testMode}
          onSkip={() => setShowKeyInput(false)}
        />
      ) : (
        <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm overflow-hidden" />
      )}
    </div>
  );
};

export default Map;
