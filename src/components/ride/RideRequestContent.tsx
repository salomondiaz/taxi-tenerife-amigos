
import React from "react";
import RequestHeader from "./header/RequestHeader";
import RideRequestMain from "./RideRequestMain";

const RideRequestContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <RequestHeader />
      <RideRequestMain />
    </div>
  );
};

export default RideRequestContent;
