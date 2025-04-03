
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Map, AlertTriangle, DollarSign } from "lucide-react";
import { TrafficLevel } from "@/components/map/types";
import PaymentSelector from "./PaymentSelector";

interface EstimateSectionProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  trafficLevel: TrafficLevel | null;
  arrivalTime: string | null;
  estimatedPrice: number | null;
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

  const getTrafficColor = () => {
    switch (trafficLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'very_high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrafficIcon = () => {
    switch (trafficLevel) {
      case 'low':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'high':
        return '🟠';
      case 'very_high':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getTrafficText = () => {
    switch (trafficLevel) {
      case 'low':
        return 'Tráfico ligero';
      case 'moderate':
        return 'Tráfico moderado';
      case 'high':
        return 'Tráfico denso';
      case 'very_high':
        return 'Tráfico muy denso';
      default:
        return 'Tráfico desconocido';
    }
  };
  
  // Format price and distance safely
  const formattedPrice = estimatedPrice ? estimatedPrice.toFixed(2) : '0.00';
  const formattedDistance = estimatedDistance ? estimatedDistance.toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Información del viaje</h2>
      
      {/* Indicadores de error si no hay estimaciones */}
      {(!estimatedDistance || !estimatedTime || !estimatedPrice) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Faltan algunos datos para calcular correctamente el viaje. 
              Por favor, asegúrate de seleccionar origen y destino.
            </p>
          </div>
        </div>
      )}

      {/* Grid con información del viaje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg p-4 border bg-slate-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Distancia</span>
            <Map className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold">{formattedDistance} km</div>
        </div>

        <div className="rounded-lg p-4 border bg-slate-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Tiempo</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold">{estimatedTime || 0} min</div>
          {arrivalTime && (
            <div className="text-xs text-gray-500 mt-1">
              Llegada estimada: {arrivalTime}
            </div>
          )}
        </div>

        <div className="rounded-lg p-4 border bg-slate-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Precio</span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold">{formattedPrice} €</div>
        </div>
      </div>

      {/* Información de tráfico */}
      {trafficLevel && (
        <div className={`p-3 rounded-lg mb-6 ${getTrafficColor()}`}>
          <div className="flex items-center">
            <span className="text-lg mr-2">{getTrafficIcon()}</span>
            <div>
              <h4 className="font-medium">{getTrafficText()}</h4>
              {arrivalTime && (
                <p className="text-sm">Hora estimada de llegada: {arrivalTime}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selector de método de pago */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h3 className="text-md font-medium mb-3">Método de pago</h3>
        <PaymentSelector 
          price={estimatedPrice || 0}
          onPaymentMethodSelected={setSelectedPaymentMethod}
        />
      </div>
      
      {/* Botón para solicitar viaje */}
      <div className="mt-6">
        <Button
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
          size="lg"
          onClick={handleRideRequest}
          disabled={!selectedPaymentMethod || !estimatedPrice}
        >
          {scheduledTime ? "Programar viaje" : "Solicitar viaje ahora"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Al solicitar un viaje aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
};

export default EstimateSection;
