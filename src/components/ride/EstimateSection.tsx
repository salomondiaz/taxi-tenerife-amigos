
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
  
  // Make sure values are numbers and not null
  const safeDistance = estimatedDistance || 0;
  const safeTime = estimatedTime || 0;
  const safePrice = estimatedPrice || 0;
  const safeArrivalTime = arrivalTime || "--:--";
  
  return (
    <div className="space-y-4">
      <EstimateDisplay
        estimatedDistance={safeDistance}
        estimatedTime={safeTime}
        trafficLevel={trafficLevel}
        arrivalTime={safeArrivalTime}
      />
      
      <PriceEstimate 
        estimatedPrice={safePrice} 
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
