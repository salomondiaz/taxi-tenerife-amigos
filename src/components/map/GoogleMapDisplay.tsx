
import React, { useEffect, useRef, useCallback } from 'react';
import { MapProps } from './types';
import { toast } from '@/hooks/use-toast';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';

const GoogleMapDisplay: React.FC<MapProps> = ({
  origin,
  destination,
  routeGeometry,
  className = '',
  style,
  interactive = true,
  showDriverPosition,
  driverPosition,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false,
  showRoute = true,
  allowHomeEditing = false,
  apiKey
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Use custom hooks for map functionality
  const { 
    updateMarkers, 
    saveHomeLocation 
  } = useGoogleMapMarkers({
    mapRef,
    origin,
    destination,
    allowHomeEditing,
    allowMapSelection,
    onOriginChange,
    onDestinationChange
  });

  const { 
    selectionMode, 
    setSelectionMode,
    handleMapClick, 
    createSelectionControls 
  } = useGoogleMapSelection({
    mapRef,
    allowMapSelection,
    onOriginChange,
    onDestinationChange
  });

  useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  // Initialize the map
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    const tenerife = { lat: 28.2916, lng: -16.6291 };
    const initialCenter = origin ? { lat: origin.lat, lng: origin.lng } : tenerife;
    
    const mapOptions: google.maps.MapOptions = {
      center: initialCenter,
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: interactive ? 'greedy' : 'none',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };
    
    mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
    
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1E88E5',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });
    
    directionsRendererRef.current.setMap(mapRef.current);
    
    if (allowMapSelection) {
      // Ya no asignamos aquí el manejador de click porque lo hace el hook useGoogleMapSelection
      
      const controlDiv = document.createElement('div');
      createSelectionControls(controlDiv);
      
      mapRef.current.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }
    
    if (allowHomeEditing) {
      const homeButtonDiv = document.createElement('div');
      createHomeButton(homeButtonDiv);
      
      mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeButtonDiv);
    }

    updateMarkers();
  }, [allowHomeEditing, allowMapSelection, createSelectionControls, interactive, origin, updateMarkers]);

  // Create home button
  const createHomeButton = (controlDiv: HTMLDivElement) => {
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    
    const button = document.createElement('button');
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '8px 12px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.innerHTML = '<span style="font-size: 16px;">🏠</span> Guardar Casa';
    
    button.onclick = saveHomeLocation;
    
    controlDiv.appendChild(button);
  };

  // Initialize map when API key is available
  useEffect(() => {
    if (!mapContainerRef.current || !apiKey) return;

    if (!window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Error loading Google Maps API');
        toast({
          title: 'Error',
          description: 'No se pudo cargar Google Maps',
          variant: 'destructive'
        });
      };
      
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [apiKey, initializeMap]);

  // Activar selección de destino
  const enableDestinationSelection = () => {
    if (mapRef.current && !destination) {
      setSelectionMode('destination');
      toast({
        title: "Selección de destino activada",
        description: "Haz clic en el mapa para seleccionar tu destino"
      });
    }
  };

  // Botón flotante para seleccionar destino
  const renderFloatingButton = () => {
    if (!mapRef.current || !allowMapSelection || selectionMode === 'destination') return null;
    
    return (
      <button 
        className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        onClick={enableDestinationSelection}
      >
        <span>Seleccionar destino</span>
      </button>
    );
  };

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        ...style
      }}
    >
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
      {renderFloatingButton()}
    </div>
  );
};

export default GoogleMapDisplay;
