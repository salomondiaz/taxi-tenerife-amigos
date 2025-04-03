
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { TrafficLevel } from "@/components/map/types";
import EstimateDisplay from "./estimates/EstimateDisplay";
import TrafficDisplay from "./estimates/TrafficDisplay";
import ScheduleRideSection from "./schedule/ScheduleRideSection";
import PaymentMethodSelector from "./payment/PaymentMethodSelector";

interface EstimateSectionProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  trafficLevel: TrafficLevel;
  arrivalTime: Date | null;
  estimatedPrice: number | null;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (paymentMethod: string) => void;
  handleRideRequest: () => void;
  visible: boolean;
  scheduledTime?: string;
  onScheduleRide: (date: Date) => void;
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
  onScheduleRide,
}) => {
  if (!visible) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalles del viaje</span>
          {scheduledTime && (
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Programado
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Información estimada para tu viaje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estimates */}
        <EstimateDisplay 
          estimatedDistance={estimatedDistance}
          estimatedTime={estimatedTime}
          estimatedPrice={estimatedPrice}
        />

        {/* Traffic info */}
        {trafficLevel && (
          <TrafficDisplay trafficLevel={trafficLevel} arrivalTime={arrivalTime} />
        )}

        {/* Schedule ride section */}
        {!scheduledTime && (
          <ScheduleRideSection 
            scheduledTime={scheduledTime}
            onScheduleRide={onScheduleRide}
          />
        )}

        {/* Payment Method Selection */}
        <PaymentMethodSelector 
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />
        
        {selectedPaymentMethod && estimatedPrice && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-bold">Total a pagar:</span> {estimatedPrice.toFixed(2)}€
            </p>
            <p className="text-xs text-blue-600">
              {selectedPaymentMethod === 'card' && "El pago se realizará automáticamente al finalizar el viaje"}
              {selectedPaymentMethod === 'cash' && "Paga en efectivo directamente al conductor"}
              {selectedPaymentMethod === 'bizum' && "Recibirás una notificación en tu app de Bizum para confirmar el pago"}
              {selectedPaymentMethod === 'transfer' && "Recibirás los datos para realizar la transferencia"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRideRequest} 
          disabled={!selectedPaymentMethod || !estimatedPrice}
          className="w-full"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {scheduledTime ? "Confirmar viaje programado" : "Solicitar taxi ahora"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EstimateSection;
