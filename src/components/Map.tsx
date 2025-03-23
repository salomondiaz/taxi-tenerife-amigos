
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Car } from 'lucide-react';

type MapProps = {
  origin?: {
    lat: number;
    lng: number;
    address?: string;
  };
  destination?: {
    lat: number;
    lng: number;
    address?: string;
  };
  showDriverPosition?: boolean;
  driverPosition?: {
    lat: number;
    lng: number;
  };
  style?: React.CSSProperties;
  className?: string;
  interactive?: boolean;
};

const API_KEY_STORAGE_KEY = 'mapbox_api_key';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { testMode } = useAppContext();

  // Intentar cargar la clave API desde localStorage
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  // Simulación de movimiento del conductor si estamos en modo de prueba
  useEffect(() => {
    if (testMode && showDriverPosition && map.current && driverMarker.current && origin && destination) {
      let step = 0;
      const totalSteps = 100;
      let startLat = origin.lat;
      let startLng = origin.lng;
      let endLat = destination.lat;
      let endLng = destination.lng;
      
      if (driverPosition) {
        startLat = driverPosition.lat;
        startLng = driverPosition.lng;
      }
      
      const latStep = (endLat - startLat) / totalSteps;
      const lngStep = (endLng - startLng) / totalSteps;
      
      const interval = setInterval(() => {
        step++;
        
        if (step >= totalSteps) {
          clearInterval(interval);
          return;
        }
        
        const nextLat = startLat + latStep * step;
        const nextLng = startLng + lngStep * step;
        
        if (driverMarker.current) {
          driverMarker.current.setLngLat([nextLng, nextLat]);
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [testMode, showDriverPosition, driverPosition, origin, destination]);

  useEffect(() => {
    if (!apiKey || !mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = apiKey;
      
      // Inicializar el mapa
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: origin ? [origin.lng, origin.lat] : [-16.2519, 28.4689], // Centro por defecto: Santa Cruz de Tenerife
        zoom: 12,
        interactive: interactive
      });
      
      if (interactive) {
        // Añadir controles de navegación
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      }
      
      // Evento de carga del mapa
      map.current.on('load', () => {
        if (origin) {
          // Crear marcador de origen
          const markerEl = document.createElement('div');
          markerEl.className = 'origin-marker';
          markerEl.style.width = '20px';
          markerEl.style.height = '20px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = '#3b82f6';
          markerEl.style.border = '3px solid #ffffff';
          markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          
          originMarker.current = new mapboxgl.Marker(markerEl)
            .setLngLat([origin.lng, origin.lat])
            .addTo(map.current!);
            
          if (origin.address) {
            originMarker.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(origin.address)
            );
          }
        }
        
        if (destination) {
          // Crear marcador de destino
          const markerEl = document.createElement('div');
          markerEl.className = 'destination-marker';
          markerEl.style.width = '20px';
          markerEl.style.height = '20px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = '#ef4444';
          markerEl.style.border = '3px solid #ffffff';
          markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          
          destinationMarker.current = new mapboxgl.Marker(markerEl)
            .setLngLat([destination.lng, destination.lat])
            .addTo(map.current!);
            
          if (destination.address) {
            destinationMarker.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(destination.address)
            );
          }
        }
        
        // Si tenemos origen y destino, ajustar la vista para incluir ambos
        if (origin && destination) {
          const bounds = new mapboxgl.LngLatBounds()
            .extend([origin.lng, origin.lat])
            .extend([destination.lng, destination.lat]);
            
          map.current!.fitBounds(bounds, {
            padding: 60,
            maxZoom: 14
          });
          
          // Dibujar ruta entre origen y destino
          if (map.current) {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [origin.lng, origin.lat],
                    [destination.lng, destination.lat]
                  ]
                }
              }
            });
            
            map.current.addLayer({
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
          }
        }
        
        // Si debemos mostrar la posición del conductor
        if (showDriverPosition) {
          const markerEl = document.createElement('div');
          
          // Crear un elemento personalizado para el marcador del conductor
          const driverIconHTML = `
            <div style="background-color: #1E88E5; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car">
                <path d="M5 11.5h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/>
                <path d="M6 15.5v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3"/>
                <path d="m14 15.5 1-5h5l1 5"/>
                <path d="m3 15.5 1-5h5l1 5"/>
                <path d="M7 10.5h10"/>
                <path d="M13 10.5V5.5h1v5"/>
                <path d="M10 10.5V5.5h1v5"/>
              </svg>
            </div>
          `;
          
          markerEl.innerHTML = driverIconHTML;
          
          const startPosition = driverPosition || origin;
          
          if (startPosition) {
            driverMarker.current = new mapboxgl.Marker(markerEl)
              .setLngLat([startPosition.lng, startPosition.lat])
              .addTo(map.current!);
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
    
    // Limpieza
    return () => {
      map.current?.remove();
    };
  }, [apiKey, origin, destination, showDriverPosition, driverPosition, interactive]);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Clave API requerida",
        description: "Por favor, introduce una clave API válida",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Guardar la clave API en localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    
    // Simular verificación
    setTimeout(() => {
      setIsLoading(false);
      setShowKeyInput(false);
      
      toast({
        title: "Clave API guardada",
        description: "El mapa se cargará con tu clave API",
      });
    }, 1000);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {showKeyInput ? (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Configuración del mapa</h3>
          <p className="text-sm text-gray-600 mb-4">
            Para ver el mapa, introduce tu clave API pública de Mapbox. 
            Puedes obtener una clave en <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-tenerife-blue hover:underline">mapbox.com</a>.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Introduce tu clave API de Mapbox"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button 
              onClick={handleApiKeySubmit}
              disabled={isLoading}
              className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
            >
              {isLoading ? "Verificando..." : "Guardar clave API"}
            </Button>
            {testMode && (
              <Button 
                variant="outline"
                onClick={() => setShowKeyInput(false)}
                className="w-full"
              >
                Usar mapa de prueba
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm overflow-hidden" />
      )}
    </div>
  );
};

export default Map;
