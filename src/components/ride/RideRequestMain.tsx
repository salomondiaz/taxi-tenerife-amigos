
import React from "react";
import { useRideRequestMain } from "@/hooks/useRideRequestMain";
import ScheduledRideBanner from "./ScheduledRideBanner";
import LocationInputSection from "./LocationInputSection";
import MapViewSection from "./MapViewSection";
import EstimateSection from "./EstimateSection";
import { TrafficLevel } from "@/components/map/types";

const RideRequestMain: React.FC = () => {
  const {
    scheduledTime,
    origin,
    setOrigin,
    destination,
    setDestination,
    originCoords,
    destinationCoords,
    routeGeometry,
    isLoading,
    useManualSelection,
    handleUseCurrentLocation,
    handleOriginChange,
    handleDestinationChange,
    saveHomeAddress,
    useHomeAddress,
    handleUseHomeAsDestination,
    calculateEstimates,
    estimatedPrice,
    estimatedTime,
    estimatedDistance,
    trafficLevel,
    arrivalTime,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    handleRideRequest,
    saveRideToSupabase,
    setHomeLocation
  } = useRideRequestMain();

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Banner para viajes programados */}
      <ScheduledRideBanner scheduledTime={scheduledTime} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna izquierda - Inputs de ubicación y estimaciones */}
        <div className="lg:col-span-5 space-y-4">
          <LocationInputSection 
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            handleUseCurrentLocation={handleUseCurrentLocation}
            useHomeAddress={() => useHomeAddress(setOrigin, handleOriginChange)}
            saveHomeAddress={saveHomeAddress}
            isLoading={isLoading}
            calculateEstimates={calculateEstimates}
            handleUseHomeAsDestination={handleUseHomeAsDestination}
            scheduledTime={scheduledTime}
          />
          
          <EstimateSection 
            estimatedDistance={estimatedDistance}
            estimatedTime={estimatedTime}
            trafficLevel={trafficLevel as TrafficLevel}
            arrivalTime={arrivalTime}
            estimatedPrice={estimatedPrice}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handleRideRequest={handleRideRequest}
            visible={originCoords !== null && destinationCoords !== null}
            scheduledTime={scheduledTime}
          />
        </div>
        
        {/* Columna derecha - Vista del mapa */}
        <div className="lg:col-span-7">
          <MapViewSection 
            useManualSelection={useManualSelection}
            originCoords={originCoords}
            destinationCoords={destinationCoords}
            routeGeometry={routeGeometry}
            handleOriginChange={handleOriginChange}
            handleDestinationChange={handleDestinationChange}
            saveRideToSupabase={saveRideToSupabase}
            useHomeAsDestination={handleUseHomeAsDestination}
            allowHomeEditing={setHomeLocation}
            trafficLevel={trafficLevel as TrafficLevel}
            estimatedTime={estimatedTime}
            estimatedDistance={estimatedDistance}
            estimatedPrice={estimatedPrice}
            scheduledTime={scheduledTime}
          />
        </div>
      </div>
    </div>
  );
};

export default RideRequestMain;
