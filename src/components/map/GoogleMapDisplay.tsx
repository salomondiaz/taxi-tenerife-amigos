
import React, { useRef } from 'react';
import { MapProps } from './types';
import { useGoogleMapDisplay } from './hooks/useGoogleMapDisplay';
import MapStatusOverlay from './components/MapStatusOverlay';
import MapSelectionControls from './components/MapSelectionControls';
import HomeButtonControls from './components/HomeButtonControls';
import HomeDialog from './components/HomeDialog';
import GoogleMapContainer from './components/GoogleMapContainer';
import MapInstructions from './components/MapInstructions';

const GoogleMapDisplay: React.FC<MapProps> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    mapRef,
    selectionMode,
    setSelectionMode,
    showHomeDialog,
    setShowHomeDialog,
    homeLocation,
    handleSaveHomeLocation,
    handleUseCurrentLocation,
    handleSearchLocation,
  } = useGoogleMapDisplay({
    props,
    mapContainerRef,
  });

  return (
    <GoogleMapContainer mapContainerRef={mapContainerRef}>
      <MapSelectionControls
        allowMapSelection={props.allowMapSelection || false}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onUseCurrentLocation={handleUseCurrentLocation}
        onSearchLocation={handleSearchLocation}
      />
      
      <MapStatusOverlay
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        showSelectMarkers={props.showSelectMarkers || false}
      />
      
      <HomeButtonControls
        allowHomeEditing={props.allowHomeEditing || false}
        handleSaveHomeLocation={handleSaveHomeLocation}
      />
      
      <HomeDialog
        showHomeDialog={showHomeDialog}
        setShowHomeDialog={setShowHomeDialog}
        homeLocation={homeLocation}
        useHomeAsDestination={props.useHomeAsDestination}
      />
      
      <MapInstructions 
        selectionMode={selectionMode}
        allowMapSelection={props.allowMapSelection || false}
      />
    </GoogleMapContainer>
  );
};

export default GoogleMapDisplay;
