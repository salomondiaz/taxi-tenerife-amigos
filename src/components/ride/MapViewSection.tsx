
import React from "react";
import MapViewer from "./MapViewer";
import { MapCoordinates } from "@/components/map/types";

interface MapViewSectionProps {
  useManualSelection: boolean;
  originCoords: MapCoordinates | null;
  destinationCoords: MapCoordinates | null;
  routeGeometry: any;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
  saveRideToSupabase?: () => void;
  useHomeAsDestination?: () => void;
}

const MapViewSection: React.FC<MapViewSectionProps> = ({
  useManualSelection,
  originCoords,
  destinationCoords,
  routeGeometry,
  handleOriginChange,
  handleDestinationChange,
  saveRideToSupabase,
  useHomeAsDestination
}) => {
  return (
    <div className="h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapViewer
        useManualSelection={useManualSelection}
        originCoords={originCoords}
        destinationCoords={destinationCoords}
        routeGeometry={routeGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
        saveRideToSupabase={saveRideToSupabase}
        useHomeAsDestination={useHomeAsDestination}
      />
    </div>
  );
};

export default MapViewSection;
