
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { createSelectionControls, renderFloatingButton } from '../controls/SelectionControls';

interface MapControlsProps {
  allowMapSelection: boolean;
  selectionMode: 'origin' | 'destination' | null;
  onSelectionModeChange: (mode: 'origin' | 'destination' | null) => void;
  showDestinationSelection: boolean;
}

const MapControls = ({
  allowMapSelection,
  selectionMode,
  onSelectionModeChange,
  showDestinationSelection
}: MapControlsProps) => {
  
  // Función para manejar cambios en el modo de selección
  const handleSelectionModeChange = (newMode: 'origin' | 'destination' | null) => {
    // Si el nuevo modo es igual al actual, cancelar la selección
    if (newMode === selectionMode) {
      onSelectionModeChange(null);
      toast({
        title: "Selección cancelada",
        description: "Has cancelado el modo de selección"
      });
    } else {
      onSelectionModeChange(newMode);
      
      // Mostrar mensaje apropiado
      if (newMode === 'origin') {
        toast({
          title: "Selección de origen activada",
          description: "Haz clic en el mapa para seleccionar el punto de origen"
        });
      } else if (newMode === 'destination') {
        toast({
          title: "Selección de destino activada",
          description: "Haz clic en el mapa para seleccionar el punto de destino"
        });
      }
    }
  };
  
  // Wrap the selection controls and floating button with react components
  return {
    createSelectionControls: createSelectionControls({
      selectionMode,
      setSelectionMode: handleSelectionModeChange
    }),
    renderFloatingButton: () => renderFloatingButton({
      selectionMode,
      setSelectionMode: handleSelectionModeChange,
      showDestinationSelection
    })
  };
};

export default MapControls;
