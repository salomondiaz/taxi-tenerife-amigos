
import React from "react";
import { MapCoordinates } from "@/components/map/types";
import TrafficInfo from "./TrafficInfo";
import RideDetails from "./RideDetails";
import RidePaymentInfo from "./PaymentInfo";

interface RouteResultsProps {
  estimatedPrice: number | null;
  estimatedTime: number | null;
  estimatedDistance: number | null;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
  isLoading: boolean;
  handleRequestRide: () => void;
}

const RouteResults: React.FC<RouteResultsProps> = ({
  estimatedPrice,
  estimatedTime,
  estimatedDistance,
  trafficLevel,
  arrivalTime,
  isLoading,
  handleRequestRide,
}) => {
  if (estimatedPrice === null) {
    return null;
  }

  return (
    <>
      {/* Traffic information */}
      {estimatedTime !== null && (
        <TrafficInfo 
          estimatedTime={estimatedTime}
          trafficLevel={trafficLevel}
          arrivalTime={arrivalTime}
        />
      )}

      {/* Ride details */}
      <RideDetails
        estimatedPrice={estimatedPrice}
        estimatedTime={estimatedTime}
        estimatedDistance={estimatedDistance}
        isLoading={isLoading}
        handleRequestRide={handleRequestRide}
      />
      
      {/* Payment information */}
      <RidePaymentInfo />
    </>
  );
};

export default RouteResults;
