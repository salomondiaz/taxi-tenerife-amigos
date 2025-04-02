
import { useState, useRef, useEffect, useCallback } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { toast } from '@/hooks/use-toast';
import MapControls from '../components/MapControls';
import { reverseGeocode } from '../services/GeocodingService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
  useHomeAsDestination?: () => void;
  homeLocation?: MapCoordinates | null;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true,
  useHomeAsDestination,
  homeLocation
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(null);
  const [showHomeDialog, setShowHomeDialog] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{lat: number, lng: number} | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  
  // Función para manejar los clics en el mapa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!selectionMode) {
      // Si ya hay un origen seleccionado y no estamos en modo de selección específico,
      // y tenemos una ubicación de casa, preguntar si quiere viajar a casa
      if (homeLocation && useHomeAsDestination) {
        const lat = e.latLng?.lat() || 0;
        const lng = e.latLng?.lng() || 0;
        setSelectedPoint({lat, lng});
        setShowHomeDialog(true);
        return;
      }
      return;
    }
    
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
    
    console.log(`Map clicked in ${selectionMode} mode at:`, lat, lng);
    
    // Obtener la dirección para las coordenadas seleccionadas
    reverseGeocode(lat, lng, (address) => {
      const coordinates = {
        lat,
        lng,
        address
      };
      
      console.log(`Address found: ${address}`);
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        toast({
          title: "Origen seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
        
        // Cambiar automáticamente al modo de selección de destino si está disponible
        if (showDestinationSelection) {
          setSelectionMode('destination');
          toast({
            title: "Seleccione destino",
            description: "Ahora haga clic para seleccionar el destino"
          });
        } else {
          setSelectionMode(null);
        }
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        toast({
          title: "Destino seleccionado",
          description: address || "Ubicación seleccionada en el mapa"
        });
        // Desactivar el modo de selección después de seleccionar el destino
        setSelectionMode(null);
      }
    });
  }, [selectionMode, onOriginChange, onDestinationChange, showDestinationSelection, homeLocation, useHomeAsDestination]);

  // Gestionar los eventos de clic del mapa y deshabilitar doble clic para zoom
  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;

    // Eliminar el listener anterior si existe
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Añadir un nuevo listener de clic si estamos en modo selección o si podemos seleccionar casa
    if ((selectionMode || homeLocation) && mapRef.current) {
      console.log(`Adding click listener for ${selectionMode || 'home travel'} selection`);
      clickListenerRef.current = mapRef.current.addListener('click', handleMapClick);
      
      // Deshabilitar zoom por doble clic cuando estamos en modo selección
      mapRef.current.setOptions({ disableDoubleClickZoom: true });
    } else if (mapRef.current) {
      // Rehabilitar zoom por doble clic cuando no estamos en modo selección
      mapRef.current.setOptions({ disableDoubleClickZoom: false });
    }

    // Limpiar el listener al desmontar o cambiar el modo de selección
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      
      // Asegurarse de que el zoom por doble clic se restaura al desmontar
      if (mapRef.current) {
        mapRef.current.setOptions({ disableDoubleClickZoom: false });
      }
    };
  }, [mapRef.current, selectionMode, allowMapSelection, handleMapClick, homeLocation]);

  // Controles de selección desde botones en el mapa
  const mapControls = MapControls({
    allowMapSelection,
    selectionMode,
    onSelectionModeChange: setSelectionMode,
    showDestinationSelection: true
  });

  // Dialogo para preguntar si quiere viajar desde el punto seleccionado hasta su casa
  const HomeDialog = () => {
    const handleConfirm = useCallback(() => {
      if (!selectedPoint) return;
      
      // Obtener la dirección para el punto seleccionado
      reverseGeocode(selectedPoint.lat, selectedPoint.lng, (address) => {
        if (onOriginChange) {
          onOriginChange({
            lat: selectedPoint.lat,
            lng: selectedPoint.lng,
            address
          });
          
          toast({
            title: "Origen seleccionado",
            description: address || "Ubicación seleccionada como origen"
          });
        }
        
        // Usar la casa como destino
        if (useHomeAsDestination) {
          useHomeAsDestination();
        }
        
        setShowHomeDialog(false);
        setSelectedPoint(null);
      });
    }, [selectedPoint, useHomeAsDestination]);
    
    return (
      <Dialog open={showHomeDialog} onOpenChange={setShowHomeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Deseas viajar desde aquí hasta tu casa?</DialogTitle>
            <DialogDescription>
              El origen será el punto que acabas de seleccionar y el destino será tu casa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHomeDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return { 
    selectionMode, 
    setSelectionMode, 
    handleMapClick,
    createSelectionControls: mapControls.createSelectionControls,
    renderFloatingButton: mapControls.renderFloatingButton,
    HomeDialog,
    showHomeDialog
  };
}
