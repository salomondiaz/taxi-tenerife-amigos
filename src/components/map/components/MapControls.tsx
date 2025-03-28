
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
  // Wrap the selection controls and floating button with react components
  return {
    createSelectionControls: createSelectionControls({
      selectionMode,
      setSelectionMode: onSelectionModeChange
    }),
    renderFloatingButton: () => renderFloatingButton({
      selectionMode,
      setSelectionMode: onSelectionModeChange,
      showDestinationSelection
    })
  };
};

export default MapControls;
