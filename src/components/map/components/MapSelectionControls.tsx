
import React from 'react';
import { MapSelectionMode } from '../types';
import MapSelectionControl from '../controls/MapSelectionControl';
import SelectionHint from '../controls/SelectionHint';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation: () => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation
}) => {
  if (!allowMapSelection) return null;
  
  return (
    <>
      <MapSelectionControl
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onUseCurrentLocation={onUseCurrentLocation}
      />
      <SelectionHint selectionMode={selectionMode} />
    </>
  );
};

export default MapSelectionControls;
