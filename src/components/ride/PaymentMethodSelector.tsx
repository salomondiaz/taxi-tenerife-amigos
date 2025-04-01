
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, CashIcon } from "lucide-react";
import { PaymentInfo } from "@/components/payment/PaymentInfo";

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onSelectMethod: (method: string) => void;
  onRequestRide: () => void;
}

const CashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="12" x="3" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M7 15h.01M17 15h.01M7 9h.01M17 9h.01" />
  </svg>
);

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  onRequestRide
}) => {
  const paymentMethods = [
    { id: "cash", name: "Efectivo", icon: CashIcon },
    { id: "card", name: "Tarjeta", icon: CreditCard },
    { id: "wallet", name: "Monedero", icon: Wallet },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Método de pago</h2>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              variant={selectedMethod === method.id ? "default" : "outline"}
              className={`flex flex-col items-center justify-center py-4 h-auto ${
                selectedMethod === method.id ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-sm">{method.name}</span>
            </Button>
          );
        })}
      </div>
      
      <Button
        className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
        size="lg"
        onClick={onRequestRide}
        disabled={!selectedMethod}
      >
        Solicitar taxi
      </Button>
      
      {/* Mostrar información sobre el pago en efectivo si se selecciona efectivo */}
      {selectedMethod === "cash" && <PaymentInfo />}
    </div>
  );
};

export default PaymentMethodSelector;
