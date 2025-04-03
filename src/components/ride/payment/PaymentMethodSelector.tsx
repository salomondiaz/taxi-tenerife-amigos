
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Info } from "lucide-react";
import PaymentMethodInput from "./PaymentMethodInput";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PaymentDetails {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  bankAccount: string;
  phoneNumber: string;
}

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (paymentMethod: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    bankAccount: "",
    phoneNumber: "",
  });

  // Available payment methods
  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Efectivo", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { id: "card", name: "Tarjeta", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { id: "transfer", name: "Transferencia", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { id: "bizum", name: "Bizum", icon: <CreditCard className="mr-2 h-4 w-4" /> },
  ];

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDetails(method !== "cash");
  };

  return (
    <div>
      <label className="text-sm text-gray-500 block mb-2">Método de pago:</label>
      <div className="grid grid-cols-2 gap-2">
        {paymentMethods.map((method) => (
          <Button
            key={method.id}
            variant={selectedPaymentMethod === method.id ? "default" : "outline"}
            size="sm"
            onClick={() => handlePaymentMethodSelect(method.id)}
            className="justify-start"
          >
            {method.icon}
            {method.name}
          </Button>
        ))}
      </div>
      
      {selectedPaymentMethod === "cash" && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-blue-800">
          <div className="flex items-start">
            <Info className="h-4 w-4 mr-1 mt-0.5" />
            <p>El conductor podrá dar cambio. Billete máximo permitido: 20€</p>
          </div>
        </div>
      )}
      
      {showPaymentDetails && (
        <PaymentMethodInput 
          selectedPaymentMethod={selectedPaymentMethod || ""}
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector;
