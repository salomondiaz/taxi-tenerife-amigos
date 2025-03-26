
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, AlertTriangle, Car } from 'lucide-react';
import TrafficInfo from './TrafficInfo';
import PaymentSelector from './PaymentSelector';

interface RouteResultsProps {
  estimatedPrice: number;
  estimatedTime: number;
  estimatedDistance: number;
  trafficLevel: 'low' | 'moderate' | 'heavy' | null;
  arrivalTime: string | null;
  isLoading: boolean;
  handleRequestRide: (paymentMethodId: string) => void;
}

const RouteResults: React.FC<RouteResultsProps> = ({
  estimatedPrice,
  estimatedTime,
  estimatedDistance,
  trafficLevel,
  arrivalTime,
  isLoading,
  handleRequestRide
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  const hasRouteInfo = estimatedPrice > 0 && estimatedTime > 0 && estimatedDistance > 0;
  
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  const handleRideRequest = () => {
    if (selectedPaymentMethod) {
      handleRequestRide(selectedPaymentMethod);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Calculando ruta y estimaciones...</p>
      </div>
    );
  }
  
  if (!hasRouteInfo) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Resultados de la ruta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <Car className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">Distancia</p>
          <p className="text-xl font-bold">{estimatedDistance.toFixed(1)} km</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <Clock className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">Tiempo estimado</p>
          <p className="text-xl font-bold">{estimatedTime} min</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600 mb-2">€</div>
          <p className="text-sm text-gray-500">Precio estimado</p>
          <p className="text-xl font-bold">{estimatedPrice.toFixed(2)} €</p>
        </div>
      </div>
      
      <TrafficInfo trafficLevel={trafficLevel} arrivalTime={arrivalTime} />
      
      <div className="border-t border-gray-100 pt-4 mt-4">
        <PaymentSelector 
          price={estimatedPrice}
          onPaymentMethodSelected={handlePaymentMethodSelected}
        />
      </div>
      
      <div className="mt-6">
        <Button
          className="w-full"
          size="lg"
          onClick={handleRideRequest}
          disabled={!selectedPaymentMethod}
        >
          Solicitar viaje
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Al solicitar un viaje aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
};

export default RouteResults;
