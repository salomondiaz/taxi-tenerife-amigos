
import React from "react";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import PriceEstimator from "@/components/ride/PriceEstimator";

interface RouteCalculatorProps {
  origin: string;
  originCoords: MapCoordinates | null;
  destination: string;
  destinationCoords: MapCoordinates | null;
  isLoading: boolean;
  calculateEstimates: () => void;
}

const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  origin,
  originCoords,
  destination,
  destinationCoords,
  isLoading,
  calculateEstimates,
}) => {
  return (
    <>
      {/* Price estimator */}
      <PriceEstimator
        origin={origin}
        originCoords={originCoords}
        destination={destination}
        destinationCoords={destinationCoords}
        isLoading={isLoading}
        calculateEstimates={calculateEstimates}
      />
    </>
  );
};

export default RouteCalculator;
