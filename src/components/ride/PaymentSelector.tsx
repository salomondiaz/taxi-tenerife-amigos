
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PaymentMethodForm, { PaymentFormData } from "@/components/payment/PaymentMethodForm";
import { toast } from "@/hooks/use-toast";

interface PaymentSelectorProps {
  price: number;
  onPaymentMethodSelected: (methodId: string) => void;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ price, onPaymentMethodSelected }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onPaymentMethodSelected(methodId);
    
    // Show feedback based on payment method
    switch (methodId) {
      case 'card':
        toast({ title: "Tarjeta seleccionada", description: "Se realizará el cargo automáticamente" });
        break;
      case 'cash':
        toast({ title: "Efectivo seleccionado", description: "Paga al conductor cuando llegues a tu destino" });
        break;
      case 'bizum':
        toast({ title: "Bizum seleccionado", description: "Recibirás una notificación en tu app de Bizum" });
        break;
    }
  };
  
  const handlePaymentFormSubmit = (data: PaymentFormData) => {
    // Process the form data (would normally send to backend)
    console.log("Payment form submitted:", data);
    
    // Close the form
    setShowAddPaymentForm(false);
    
    // Select the new payment method
    handleMethodSelect(data.type);
    
    // Show success message
    toast({
      title: "Método de pago añadido",
      description: "Tu método de pago ha sido guardado correctamente"
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Selecciona un método de pago</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant={selectedMethod === 'card' ? 'default' : 'outline'}
          className="flex flex-col items-center justify-center py-3 h-auto"
          onClick={() => handleMethodSelect('card')}
        >
          <CreditCard className="h-5 w-5 mb-1" />
          <span className="text-sm">Tarjeta</span>
        </Button>
        
        <Button
          variant={selectedMethod === 'cash' ? 'default' : 'outline'}
          className="flex flex-col items-center justify-center py-3 h-auto"
          onClick={() => handleMethodSelect('cash')}
        >
          <Banknote className="h-5 w-5 mb-1" />
          <span className="text-sm">Efectivo</span>
        </Button>
        
        <Button
          variant={selectedMethod === 'bizum' ? 'default' : 'outline'}
          className="flex flex-col items-center justify-center py-3 h-auto"
          onClick={() => handleMethodSelect('bizum')}
        >
          <Phone className="h-5 w-5 mb-1" />
          <span className="text-sm">Bizum</span>
        </Button>
      </div>
      
      <Dialog open={showAddPaymentForm} onOpenChange={setShowAddPaymentForm}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full mt-2"
          >
            Añadir nuevo método de pago
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <PaymentMethodForm 
            onSubmit={handlePaymentFormSubmit}
            onCancel={() => setShowAddPaymentForm(false)}
          />
        </DialogContent>
      </Dialog>
      
      {selectedMethod && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700 mb-1">
            <span className="font-bold">Total a pagar:</span> {price.toFixed(2)}€
          </p>
          <p className="text-xs text-blue-600">
            {selectedMethod === 'card' && "El pago se realizará automáticamente al finalizar el viaje"}
            {selectedMethod === 'cash' && "Paga en efectivo directamente al conductor"}
            {selectedMethod === 'bizum' && "Recibirás una notificación en tu app de Bizum para confirmar el pago"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSelector;
