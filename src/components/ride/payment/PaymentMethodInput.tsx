
import React from "react";
import { Input } from "@/components/ui/input";

interface PaymentDetails {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  bankAccount: string;
  phoneNumber: string;
}

interface PaymentMethodInputProps {
  selectedPaymentMethod: string;
  paymentDetails: PaymentDetails;
  setPaymentDetails: (details: PaymentDetails) => void;
}

const PaymentMethodInput: React.FC<PaymentMethodInputProps> = ({
  selectedPaymentMethod,
  paymentDetails,
  setPaymentDetails,
}) => {
  if (selectedPaymentMethod === "card") {
    return (
      <div className="mt-3 space-y-2">
        <Input 
          placeholder="Número de tarjeta" 
          value={paymentDetails.cardNumber}
          onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="MM/AA" 
            value={paymentDetails.cardExpiry}
            onChange={(e) => setPaymentDetails({...paymentDetails, cardExpiry: e.target.value})}
          />
          <Input 
            placeholder="CVV" 
            value={paymentDetails.cardCvc}
            onChange={(e) => setPaymentDetails({...paymentDetails, cardCvc: e.target.value})}
          />
        </div>
      </div>
    );
  }
  
  if (selectedPaymentMethod === "transfer") {
    return (
      <div className="mt-3">
        <Input 
          placeholder="IBAN" 
          value={paymentDetails.bankAccount}
          onChange={(e) => setPaymentDetails({...paymentDetails, bankAccount: e.target.value})}
        />
      </div>
    );
  }
  
  if (selectedPaymentMethod === "bizum") {
    return (
      <div className="mt-3">
        <Input 
          placeholder="Número de teléfono" 
          value={paymentDetails.phoneNumber}
          onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
        />
      </div>
    );
  }
  
  return null;
};

export default PaymentMethodInput;
