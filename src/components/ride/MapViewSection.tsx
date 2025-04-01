
import React from "react";
import { MapCoordinates } from "@/components/map/types";
import Map from "@/components/Map";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry?: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase: () => Promise<any>; // Changed from Promise<void> to Promise<any>
  useHomeAsDestination?: () => void;
  allowHomeEditing?: boolean;
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  useHomeAsDestination,
  saveRideToSupabase,
  allowHomeEditing
}) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white" style={{ height: "500px" }}>
      <Map
        interactive={true}
        allowMapSelection={useManualSelection}
        origin={originCoords}
        destination={destinationCoords}
        routeGeometry={routeGeometry}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        useHomeAsDestination={useHomeAsDestination}
        alwaysShowHomeMarker={true}
        allowHomeEditing={allowHomeEditing}
      />
    </div>
  );
};

export default MapViewSection;
