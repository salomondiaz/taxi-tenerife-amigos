
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PaymentMethodSelector from "./PaymentMethodSelector";
import EstimateDisplay from "./EstimateDisplay";
import PriceEstimate from "./PriceEstimate";

interface EstimateSectionProps {
  estimatedDistance: number;
  estimatedTime: number;
  trafficLevel: "low" | "moderate" | "heavy";
  arrivalTime: string;
  estimatedPrice: number;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string) => void;
  handleRideRequest: () => void;
  visible: boolean;
  scheduledTime?: string;
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
  visible,
  scheduledTime
}) => {
  if (!visible) return null;
  
  // Format scheduled time for display
  const formatScheduledTime = () => {
    if (!scheduledTime) return null;
    
    try {
      const date = new Date(scheduledTime);
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error("Error formatting scheduled time:", error);
      return scheduledTime;
    }
  };

  // Make sure values are numbers and not null
  const safeDistance = estimatedDistance || 0;
  const safeTime = estimatedTime || 0;
  const safePrice = estimatedPrice || 0;
  const safeArrivalTime = arrivalTime || "--:--";
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mt-4">
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
      
      {scheduledTime && (
        <div className="mb-4 flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <Calendar className="text-amber-600" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">Viaje programado</p>
            <p className="text-xs text-amber-700">{formatScheduledTime()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimateSection;
