
import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapCoordinates, MapSelectionMode, API_KEY_STORAGE_KEY } from '../types';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapInitializationProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  interactive?: boolean;
  apiKey?: string;
  onMapReady?: (map: google.maps.Map) => void;
}

const TENERIFE_CENTER = { lat: 28.2916, lng: -16.6291 };
const DEFAULT_ZOOM = 11;

export function useGoogleMapInitialization({
  mapContainerRef,
  origin,
  interactive = true,
  apiKey,
  onMapReady
}: UseGoogleMapInitializationProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapInitializedRef = useRef(false);

  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current || mapInitializedRef.current) return;
    
    try {
      // Usar API key proporcionada o buscar en localStorage
      const accessToken = apiKey || localStorage.getItem(API_KEY_STORAGE_KEY);
      
      if (!accessToken) {
        setMapError("No se encontró una API key de Google Maps");
        setMapLoading(false);
        return;
      }
      
      console.log("Inicializando mapa con Google Maps API");
      
      // Cargar Google Maps API
      const loader = new Loader({
        apiKey: accessToken,
        version: "weekly",
        libraries: ["places", "geometry"]
      });
      
      const google = await loader.load();
      
      // Determinar el centro inicial del mapa
      const initialCenter = origin 
        ? { lat: origin.lat, lng: origin.lng } 
        : TENERIFE_CENTER;
      
      // Crear el mapa
      const map = new google.maps.Map(mapContainerRef.current, {
        center: initialCenter,
        zoom: DEFAULT_ZOOM,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        gestureHandling: interactive ? "greedy" : "none",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      
      // Establecer el mapa en el ref
      mapRef.current = map;
      mapInitializedRef.current = true;
      setMapLoading(false);
      
      // Notificar que el mapa está listo
      if (onMapReady) {
        onMapReady(map);
      }
    } catch (error) {
      console.error("Error inicializando el mapa:", error);
      setMapError("Error al cargar el mapa de Google");
      setMapLoading(false);
    }
  }, [mapContainerRef, apiKey, origin, interactive, onMapReady]);
  
  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    initializeMap();
    
    return () => {
      mapInitializedRef.current = false;
    };
  }, [initializeMap]);
  
  // Manejar errores de carga del mapa
  useEffect(() => {
    if (mapError) {
      toast({
        title: "Error en el mapa",
        description: mapError,
        variant: "destructive"
      });
    }
  }, [mapError]);
  
  return mapRef;
}
