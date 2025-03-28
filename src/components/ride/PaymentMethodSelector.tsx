
import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onSelectMethod: (methodId: string) => void;
  onRequestRide: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  onRequestRide
}) => {
  const { paymentMethods } = usePaymentMethods();
  
  // Set default payment method on first render
  useEffect(() => {
    if (!selectedMethod && paymentMethods.length > 0) {
      const defaultMethod = paymentMethods.find(m => m.default) || paymentMethods[0];
      onSelectMethod(defaultMethod.id);
    }
  }, [paymentMethods, selectedMethod, onSelectMethod]);
  
  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'cash':
        return <CircleDollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Wallet className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const getMethodName = (method: any) => {
    if (method.type === 'card') {
      return `${method.name}`;
    }
    return method.name;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-3">Método de pago</h3>
      
      <div className="space-y-3 mb-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`flex items-center w-full p-3 rounded-lg border ${
              selectedMethod === method.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-3">
              {getMethodIcon(method.type)}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{getMethodName(method)}</p>
              {method.type === 'cash' && (
                <p className="text-xs text-gray-500">Pagar al conductor en efectivo</p>
              )}
            </div>
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
              {selectedMethod === method.id && (
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <Button 
        className="w-full" 
        size="lg"
        onClick={onRequestRide}
        disabled={!selectedMethod}
      >
        Solicitar viaje
      </Button>
      
      <p className="text-xs text-center mt-2 text-gray-500">
        Al solicitar un viaje aceptas nuestros términos y condiciones
      </p>
    </div>
  );
};

export default PaymentMethodSelector;
