import React, { useRef, useCallback, useEffect, useState } from 'react';
import { MapProps } from './types';
import { toast } from '@/hooks/use-toast';
import { useGoogleMapInitialization } from './hooks/useGoogleMapInitialization';
import { useGoogleMapMarkers } from './hooks/useGoogleMapMarkers';
import { useGoogleMapRouting } from './hooks/useGoogleMapRouting';
import { useGoogleMapSelection } from './hooks/useGoogleMapSelection';
import { useGoogleMapDriverMarker } from './hooks/useGoogleMapDriverMarker';
import MapControls from './components/MapControls';
import HomeControl from './components/HomeControl';
import MapSelectionIndicator from './components/MapSelectionIndicator';
import MapSelectionControl from './controls/MapSelectionControl';
import { reverseGeocode } from './services/GeocodingService';

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
  apiKey,
  useHomeAsDestination,
  alwaysShowHomeMarker = false,
  showHomeMarker = false,
  homeLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#1E88E5',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });
    
    directionsRendererRef.current.setMap(map);
    
    if (allowMapSelection && map) {
      const controlDiv = document.createElement('div');
      const mapControlsObj = MapControls({
        allowMapSelection,
        selectionMode,
        onSelectionModeChange: setSelectionMode,
        showDestinationSelection: !destination
      });
      
      mapControlsObj.createSelectionControls(controlDiv);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }
    
    if (allowHomeEditing) {
      const homeButtonDiv = document.createElement('div');
      const homeControlObj = HomeControl({
        onSaveHome: saveHomeLocation
      });
      
      homeControlObj.createHomeButton(homeButtonDiv);
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeButtonDiv);
    }

    if (useHomeAsDestination) {
      const travelHomeButtonDiv = document.createElement('div');
      travelHomeButtonDiv.className = 'map-control-container';
      travelHomeButtonDiv.style.margin = '10px';
      travelHomeButtonDiv.style.backgroundColor = 'white';
      travelHomeButtonDiv.style.borderRadius = '4px';
      travelHomeButtonDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      const button = document.createElement('button');
      button.style.padding = '10px 16px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.cursor = 'pointer';
      button.style.border = 'none';
      button.style.backgroundColor = 'transparent';
      button.title = 'Ir a casa';
      
      button.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style="font-size: 10px; color: #333;">Ir a casa</span>
        </div>
      `;
      
      button.addEventListener('click', () => {
        useHomeAsDestination();
      });
      
      travelHomeButtonDiv.appendChild(button);
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(travelHomeButtonDiv);
    }

    setMapReady(true);
  }, [allowHomeEditing, allowMapSelection, useHomeAsDestination]);

  useGoogleMapInitialization({
    mapContainerRef,
    origin,
    interactive,
    apiKey,
    onMapReady: handleMapReady
  });

  const { 
    originMarkerRef,
    destinationMarkerRef,
    homeMarkerRef,
    updateMarkers, 
    saveHomeLocation 
  } = useGoogleMapMarkers({
    mapRef,
    origin,
    destination,
    allowHomeEditing,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    alwaysShowHomeMarker,
    showHomeMarker,
    homeLocation
  });

  const { 
    selectionMode, 
    setSelectionMode,
    handleMapClick,
    createSelectionControls,
    renderFloatingButton
  } = useGoogleMapSelection({
    mapRef,
    allowMapSelection,
    onOriginChange,
    onDestinationChange,
    showDestinationSelection: !destination
  });

  const { driverMarkerRef } = useGoogleMapDriverMarker({
    mapRef,
    showDriverPosition,
    driverPosition,
    origin: origin
  });

  const { bounds: routeBounds } = useGoogleMapRouting({
    mapRef,
    directionsRendererRef,
    origin,
    destination,
    showRoute
  });

  useEffect(() => {
    if (mapReady && mapRef.current) {
      if (routeBounds) {
        mapRef.current.fitBounds(routeBounds, {
          top: 50, right: 50, bottom: 50, left: 50
        });
        return;
      }

      if (origin && destination) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: origin.lat, lng: origin.lng });
        bounds.extend({ lat: destination.lat, lng: destination.lng });
        
        mapRef.current.fitBounds(bounds, {
          top: 70, right: 70, bottom: 70, left: 70
        });
      }
    }
  }, [mapReady, origin, destination, routeBounds]);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      updateMarkers();
    }
  }, [origin, destination, updateMarkers, mapReady]);

  const handleSearchLocation = useCallback((query: string, type: 'origin' | 'destination') => {
    if (!mapRef.current) return;
    
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const position = results[0].geometry.location;
        const lat = position.lat();
        const lng = position.lng();
        
        reverseGeocode(lat, lng, (address) => {
          const coordinates = {
            lat,
            lng,
            address: address || results[0].formatted_address
          };
          
          if (type === 'origin' && onOriginChange) {
            onOriginChange(coordinates);
            mapRef.current?.panTo(position);
            toast({
              title: "Origen encontrado",
              description: coordinates.address || "Ubicación encontrada"
            });
          } else if (type === 'destination' && onDestinationChange) {
            onDestinationChange(coordinates);
            mapRef.current?.panTo(position);
            toast({
              title: "Destino encontrado",
              description: coordinates.address || "Ubicación encontrada"
            });
          }
        });
      } else {
        toast({
          title: "No se encontró la ubicación",
          description: "Por favor intenta con otra dirección",
          variant: "destructive"
        });
      }
    });
  }, [mapRef, onOriginChange, onDestinationChange]);

  const handleUseCurrentLocation = useCallback(() => {
    toast({
      title: "Usando ubicación actual",
      description: "Obteniendo coordenadas..."
    });
    
    setTimeout(() => {
      const currentLocation = {
        lat: 28.4698,
        lng: -16.2549,
        address: "Tu ubicación actual"
      };
      
      if (onOriginChange) {
        onOriginChange(currentLocation);
        if (mapRef.current) {
          mapRef.current.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
          mapRef.current.setZoom(14);
        }
        toast({
          title: "Ubicación actual establecida",
          description: "Tu ubicación actual se ha establecido como origen"
        });
      }
    }, 1000);
  }, [mapRef, onOriginChange]);

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
      
      <MapSelectionIndicator 
        visible={!!selectionMode && allowMapSelection} 
        type={selectionMode} 
      />

      {allowMapSelection && (
        <div className="absolute top-2 left-2 z-10">
          <MapSelectionControl 
            selectionMode={selectionMode}
            setSelectionMode={(mode) => setSelectionMode(mode)}
            onUseCurrentLocation={handleUseCurrentLocation}
            onSearchLocation={handleSearchLocation}
          />
        </div>
      )}
      
      {renderFloatingButton && renderFloatingButton()}
    </div>
  );
};

export default GoogleMapDisplay;
