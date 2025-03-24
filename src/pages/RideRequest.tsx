
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAppContext } from "@/context/AppContext";
import RideRequestContent from "@/components/ride/RideRequestContent";

const RideRequest = () => {
  const { testMode } = useAppContext();
  
  return (
    <MainLayout requireAuth>
      <RideRequestContent />
    </MainLayout>
  );
};

export default RideRequest;
