
import React from "react";
import EstimateDisplay from "./EstimateDisplay";
import PriceEstimate from "./PriceEstimate";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface EstimateSectionProps {
  estimatedDistance: number;
  estimatedTime: number;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string;
  estimatedPrice: number;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string) => void;
  handleRideRequest: () => void;
  visible: boolean;
}

const EstimateSection: React.FC<EstimateSectionProps> = ({
  estimatedDistance,
  estimatedTime,
  trafficLevel,
  arrivalTime,
  estimatedPrice,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handleRideRequest,
  visible
}) => {
  if (!visible) return null;
  
  return (
    <div className="space-y-4">
      <EstimateDisplay
        estimatedDistance={estimatedDistance}
        estimatedTime={estimatedTime}
        trafficLevel={trafficLevel}
        arrivalTime={arrivalTime}
      />
      
      <PriceEstimate 
        estimatedPrice={estimatedPrice} 
      />
      
      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
        onRequestRide={handleRideRequest}
      />
    </div>
  );
};

export default EstimateSection;
