
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrafficLevel } from "@/components/map/types";
import { CalendarClock, Clock } from "lucide-react";
import PaymentMethodsSection from "./PaymentMethodsSection";
import ScheduleRideDialog from "./ScheduleRideDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EstimateSectionProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  trafficLevel: TrafficLevel;
  arrivalTime: string | null;
  estimatedPrice: number | null;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string) => void;
  handleRideRequest: () => void;
  visible: boolean;
  scheduledTime?: string;
  onScheduleRide?: (date: Date) => void;
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
  scheduledTime,
  onScheduleRide
}) => {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  // Handle scheduling a ride
  const handleScheduleRide = (date: Date) => {
    if (onScheduleRide) {
      onScheduleRide(date);
    }
  };

  // If estimates are not available, don't show this section
  if (!visible) return null;
  
  // Format estimated arrival time
  const formattedArrivalTime = arrivalTime 
    ? `Llegada estimada: ${arrivalTime}h`
    : "";
    
  // Format traffic info text and color
  const getTrafficInfo = () => {
    switch (trafficLevel) {
      case 'low':
        return { text: "Tráfico ligero", color: "text-green-600" };
      case 'moderate':
        return { text: "Tráfico moderado", color: "text-yellow-600" };
      case 'high':
        return { text: "Tráfico denso", color: "text-orange-600" };
      case 'very_high':
        return { text: "Tráfico muy denso", color: "text-red-600" };
      default:
        return { text: "Información de tráfico no disponible", color: "text-gray-600" };
    }
  };
  
  const trafficInfo = getTrafficInfo();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-2">Detalles del viaje</h2>
      
      {/* Distance and time info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Distancia</p>
          <p className="text-xl font-bold">{estimatedDistance?.toFixed(1)} km</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Tiempo</p>
          <p className="text-xl font-bold">{estimatedTime} min</p>
        </div>
      </div>
      
      {/* Traffic and arrival info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className={`font-medium ${trafficInfo.color}`}>
            {trafficInfo.text}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm text-gray-600">{formattedArrivalTime}</span>
        </div>
      </div>
      
      {/* Scheduled ride info */}
      {scheduledTime && (
        <div className="bg-purple-50 p-3 rounded-lg mb-4 flex items-center">
          <CalendarClock className="h-5 w-5 text-purple-600 mr-2" />
          <div>
            <p className="font-medium text-purple-800">Viaje programado</p>
            <p className="text-sm text-purple-700">{scheduledTime}</p>
          </div>
        </div>
      )}
      
      <Separator className="my-4" />
      
      {/* Price */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg">Precio estimado:</span>
        <span className="text-2xl font-bold">{estimatedPrice?.toFixed(2)}€</span>
      </div>
      
      {/* Payment section */}
      <PaymentMethodsSection 
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={setSelectedPaymentMethod}
      />
      
      <div className="mt-4 flex gap-2">
        {!scheduledTime && onScheduleRide && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowScheduleDialog(true)}
          >
            <CalendarClock className="h-4 w-4 mr-2" />
            Programar
          </Button>
        )}
        
        <Button 
          onClick={handleRideRequest} 
          className="flex-1 bg-tenerife-blue hover:bg-tenerife-blue/90"
          disabled={!selectedPaymentMethod}
        >
          {scheduledTime ? "Programar viaje" : "Solicitar taxi"}
        </Button>
      </div>
      
      <ScheduleRideDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSchedule={handleScheduleRide}
      />
    </div>
  );
};

export default EstimateSection;
