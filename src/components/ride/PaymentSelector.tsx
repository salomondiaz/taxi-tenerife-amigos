
import React, { useState } from 'react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { CreditCard, Wallet, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

interface PaymentSelectorProps {
  price: number;
  onPaymentMethodSelected: (methodId: string) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ 
  price,
  onPaymentMethodSelected
}) => {
  const { paymentMethods } = usePaymentMethods();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    paymentMethods.find(method => method.default)?.id || null
  );
  const [showStripeDialog, setShowStripeDialog] = useState(false);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onPaymentMethodSelected(methodId);
  };
  
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
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Método de pago</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowStripeDialog(true)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pagar ahora
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={`flex items-center p-3 rounded-lg border ${
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
      
      <Dialog open={showStripeDialog} onOpenChange={setShowStripeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pago con tarjeta</DialogTitle>
          </DialogHeader>
          <StripePaymentForm 
            amount={price} 
            onSuccess={() => setShowStripeDialog(false)}
            onCancel={() => setShowStripeDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSelector;
