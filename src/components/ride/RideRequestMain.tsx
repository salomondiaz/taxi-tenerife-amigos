
import React, { useState } from "react";
import { useRideRequestMain } from "@/hooks/useRideRequestMain";
import ScheduledRideBanner from "./ScheduledRideBanner";
import LocationInputSection from "./LocationInputSection";
import MapViewSection from "./MapViewSection";
import EstimateSection from "./EstimateSection";
import { TrafficLevel } from "@/components/map/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const RideRequestMain: React.FC = () => {
  const {
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

  const [scheduledTime, setScheduledTime] = useState<string | undefined>(undefined);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const handleScheduleRide = (date: Date) => {
    const formattedDate = format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    setScheduledTime(formattedDate);
    setScheduledDate(date);
  };

  const handleSaveScheduledRide = async () => {
    if (!originCoords || !destinationCoords || !scheduledDate) {
      return false;
    }
    
    try {
      // Here we correctly pass the Date object
      await saveRideToSupabase(scheduledDate);
      return true;
    } catch (error) {
      console.error("Error saving scheduled ride:", error);
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <ScheduledRideBanner scheduledTime={scheduledTime} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            handleRideRequest={scheduledTime ? handleSaveScheduledRide : handleRideRequest}
            visible={originCoords !== null && destinationCoords !== null}
            scheduledTime={scheduledTime}
            onScheduleRide={handleScheduleRide}
          />
        </div>
        
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
