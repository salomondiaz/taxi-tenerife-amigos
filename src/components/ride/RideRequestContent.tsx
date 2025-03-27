
import React from "react";
import { useLocation } from "react-router-dom";
import HomeLocationSetup from "@/components/ride/HomeLocationSetup";
import RideRequestMain from "@/components/ride/RideRequestMain";
import { useRideRequestFlow } from "@/hooks/useRideRequestFlow";

const RideRequestContent: React.FC = () => {
  const location = useLocation();
  const setHomeLocationMode = location.state?.setHomeLocation || false;
  const { setOrigin } = useRideRequestFlow();
  
  // Render home setup mode or normal ride request
  if (setHomeLocationMode) {
    return <HomeLocationSetup setOrigin={setOrigin} />;
  }

  return <RideRequestMain />;
};

export default RideRequestContent;
