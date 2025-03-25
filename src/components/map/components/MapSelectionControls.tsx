
import React from 'react';
import { MapSelectionMode } from '../types';
import MapSelectionControl from '../controls/MapSelectionControl';
import SelectionHint from '../controls/SelectionHint';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation: () => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
  onSearchLocation
}) => {
  if (!allowMapSelection) return null;
  
  return (
    <>
      <MapSelectionControl
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onUseCurrentLocation={onUseCurrentLocation}
        onSearchLocation={onSearchLocation}
      />
      <SelectionHint selectionMode={selectionMode} />
    </>
  );
};

export default MapSelectionControls;
