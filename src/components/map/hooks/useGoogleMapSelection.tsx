
import { useState, useEffect, useCallback } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapSelectionProps {
  map: google.maps.Map | null;
  allowMapSelection: boolean;
  defaultSelectionMode?: MapSelectionMode;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
  homeLocation?: MapCoordinates | null;
  useHomeAsDestination?: () => void;
  showSelectMarkers?: boolean;
  selectionMode?: MapSelectionMode; // Add prop for externally controlled selection mode
}

export function useGoogleMapSelection({
  map,
  allowMapSelection,
  defaultSelectionMode = null,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true,
  homeLocation,
  useHomeAsDestination,
  showSelectMarkers = false,
  selectionMode: externalSelectionMode = null
}: UseGoogleMapSelectionProps) {
  // Use external selection mode if provided, otherwise use internal state
  const [internalSelectionMode, setInternalSelectionMode] = useState<MapSelectionMode>(defaultSelectionMode);
  const [showHomeDialog, setShowHomeDialog] = useState(false);
  
  // Use external selection mode if provided, otherwise use internal state
  const effectiveSelectionMode = externalSelectionMode !== undefined ? externalSelectionMode : internalSelectionMode;

  // Update internal mode when external mode changes
  useEffect(() => {
    if (externalSelectionMode !== undefined) {
      setInternalSelectionMode(externalSelectionMode);
    }
  }, [externalSelectionMode]);

  // Change selection mode with feedback
  const changeSelectionMode = (mode: MapSelectionMode) => {
    if (mode === effectiveSelectionMode) {
      // Toggle off the current mode
      setInternalSelectionMode(null);
      return;
    }
    
    setInternalSelectionMode(mode);
    
    if (mode === null) return;
    
    // Show toast message with clearer instructions
    toast({
      title: mode === 'origin' ? 'Seleccionar punto de salida' : 'Seleccionar punto de llegada',
      description: `Haz clic en el mapa para marcar la ubicación ${mode === 'origin' ? 'desde donde saldrás' : 'a donde quieres ir'}`,
    });
  };

  // Handle map click for selection
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (effectiveSelectionMode === null || !allowMapSelection || !map) return;
    
    const lat = e.latLng!.lat();
    const lng = e.latLng!.lng();
    
    console.log(`Map clicked at: ${lat}, ${lng} in mode: ${effectiveSelectionMode}`);
    
    // Reverse geocode to get the address
    reverseGeocode(lat, lng, (address) => {
      const coords: MapCoordinates = {
        lat,
        lng,
        address: address || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`
      };
      
      if (effectiveSelectionMode === 'origin' && onOriginChange) {
        onOriginChange(coords);
        toast({
          title: "Origen seleccionado",
          description: coords.address
        });
        
        // Automatically switch to destination selection mode
        if (allowMapSelection && showDestinationSelection) {
          setInternalSelectionMode('destination');
        } else {
          setInternalSelectionMode(null);
        }
      } 
      else if (effectiveSelectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coords);
        toast({
          title: "Destino seleccionado",
          description: coords.address
        });
        
        // Return to no selection mode
        setInternalSelectionMode(null);
      }
    });
  }, [effectiveSelectionMode, allowMapSelection, onOriginChange, onDestinationChange, map, showDestinationSelection]);

  // Setup map click listener
  useEffect(() => {
    if (!map || !allowMapSelection) return;
    
    // Disable double-click zoom to prevent accidental zooming when selecting points
    map.setOptions({
      disableDoubleClickZoom: true
    });
    
    const listener = map.addListener('click', handleMapClick);
    
    console.log("Map selection mode activated: ", effectiveSelectionMode);
    
    return () => {
      google.maps.event.removeListener(listener);
      console.log("Map click listener removed");
    };
  }, [map, allowMapSelection, handleMapClick, effectiveSelectionMode]);

  return {
    selectionMode: effectiveSelectionMode,
    setSelectionMode: changeSelectionMode,
    handleMapClick,
    showHomeDialog,
    setShowHomeDialog
  };
}
