
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, Coffee } from "lucide-react";

// Create a custom CashIcon since it's not available in lucide-react
const CashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onSelectMethod: (method: string) => void;
  onRequestRide: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  onRequestRide,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
      
      <div className="space-y-3">
        {/* Payment methods */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedMethod === "cash" ? "default" : "outline"}
            className={`flex-1 ${selectedMethod === "cash" ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
            onClick={() => onSelectMethod("cash")}
          >
            <CashIcon />
            <span className="ml-2">Efectivo</span>
          </Button>
          
          <Button
            variant={selectedMethod === "card" ? "default" : "outline"}
            className={`flex-1 ${selectedMethod === "card" ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
            onClick={() => onSelectMethod("card")}
          >
            <CreditCard size={18} />
            <span className="ml-2">Tarjeta</span>
          </Button>
          
          <Button
            variant={selectedMethod === "transfer" ? "default" : "outline"}
            className={`flex-1 ${selectedMethod === "transfer" ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
            onClick={() => onSelectMethod("transfer")}
          >
            <Banknote size={18} />
            <span className="ml-2">Transferencia</span>
          </Button>
        </div>
        
        {/* Request ride button */}
        <Button
          variant="default"
          className="w-full py-6 text-lg bg-tenerife-blue hover:bg-tenerife-blue/90"
          onClick={onRequestRide}
          disabled={!selectedMethod}
        >
          <Coffee size={20} className="mr-2" />
          Solicitar ahora
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
