
import React from "react";
import { MapCoordinates } from "@/components/map/types";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import StripePaymentProvider from "@/components/payment/StripePaymentProvider";
import RequestHeader from "@/components/ride/header/RequestHeader";
import LocationSelector from "@/components/ride/LocationSelector";
import MapViewer from "@/components/ride/MapViewer";
import RouteCalculator from "@/components/ride/RouteCalculator";
import RouteResults from "@/components/ride/RouteResults";
import InfoSection from "@/components/ride/InfoSection";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";

const RideRequestMain: React.FC = () => {
  const {
    useManualSelection,
    setUseManualSelection,
    origin,
    setOrigin,
    destination,
    setDestination,
    originCoords,
    destinationCoords,
    routeGeometry,
    isLoading,
    handleUseCurrentLocation,
    handleOriginChange,
    handleDestinationChange,
    handlePlaceSelected,
    handleSelectSavedLocation,
    calculateEstimates,
    handleRequestRide,
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    trafficLevel,
    arrivalTime
  } = useRideRequestFlow();

  return (
    <StripePaymentProvider>
      <div className="min-h-screen p-6">
        <RequestHeader />
        
        {/* Location selector */}
        <LocationSelector
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          useManualSelection={useManualSelection}
          setUseManualSelection={setUseManualSelection}
          handleUseCurrentLocation={handleUseCurrentLocation}
          originCoords={originCoords}
          onSelectLocation={handleSelectSavedLocation}
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
        />
        
        {/* Map viewer */}
        <MapViewer
          useManualSelection={useManualSelection}
          originCoords={originCoords}
          destinationCoords={destinationCoords}
          routeGeometry={routeGeometry}
          handleOriginChange={handleOriginChange}
          handleDestinationChange={handleDestinationChange}
        />
        
        {/* Route calculator */}
        <RouteCalculator
          origin={origin}
          originCoords={originCoords}
          destination={destination}
          destinationCoords={destinationCoords}
          isLoading={isLoading}
          calculateEstimates={calculateEstimates}
        />

        {/* Route results */}
        <RouteResults
          estimatedPrice={estimatedPrice}
          estimatedTime={estimatedTime}
          estimatedDistance={estimatedDistance}
          trafficLevel={trafficLevel}
          arrivalTime={arrivalTime}
          isLoading={isLoading}
          handleRequestRide={handleRequestRide}
        />

        {/* Information section */}
        <InfoSection />
      </div>
    </StripePaymentProvider>
  );
};

export default RideRequestMain;
