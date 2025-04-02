
import { useState, useEffect, useCallback } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null> | google.maps.Map | null;
  allowMapSelection: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
  useHomeAsDestination?: () => void;
  homeLocation?: MapCoordinates | null;
  showSelectMarkers?: boolean;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true,
  useHomeAsDestination,
  homeLocation,
  showSelectMarkers = false
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>('none');
  const [showHomeDialog, setShowHomeDialog] = useState(false);

  // Handle map click for selection
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    // Get the map object, whether it's a ref or direct object
    const map = mapRef && 'current' in mapRef ? mapRef.current : mapRef;
    
    if (selectionMode === 'none' || !allowMapSelection || !map) return;
    
    const lat = e.latLng!.lat();
    const lng = e.latLng!.lng();
    
    console.log(`Map clicked at: ${lat}, ${lng} in mode: ${selectionMode}`);
    
    // Use reverse geocoding to get the address
    reverseGeocode(lat, lng, (address) => {
      const coords: MapCoordinates = {
        lat,
        lng,
        address: address || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`
      };
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coords);
        toast({
          title: "Origen seleccionado",
          description: coords.address
        });
        
        // Automatically switch to destination selection mode
        if (allowMapSelection && showDestinationSelection) {
          setSelectionMode('destination');
        } else {
          setSelectionMode('none');
        }
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coords);
        toast({
          title: "Destino seleccionado",
          description: coords.address
        });
        
        // Return to no selection mode
        setSelectionMode('none');
      }
    });
  }, [selectionMode, allowMapSelection, onOriginChange, onDestinationChange, mapRef, showDestinationSelection]);

  // Setup map click listener
  useEffect(() => {
    // Check if mapRef is a ref object or a direct map instance
    const map = mapRef && 'current' in mapRef ? mapRef.current : mapRef;
    
    if (!map || !allowMapSelection) return;
    
    const listener = map.addListener('click', handleMapClick);
    
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapRef, allowMapSelection, handleMapClick]);

  return {
    selectionMode,
    setSelectionMode,
    handleMapClick,
    showHomeDialog,
    setShowHomeDialog
  };
}
