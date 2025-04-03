
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Euro, ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodsSectionProps {
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (method: string) => void;
  className?: string;
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  className
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bizumPhone, setBizumPhone] = useState("");
  
  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };
  
  // Handle card number input with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 16) {
      setCardNumber(formatCardNumber(input));
    }
  };
  
  // Format expiry date as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      const formatted = input.length > 2 
        ? `${input.substring(0, 2)}/${input.substring(2)}` 
        : input;
      setCardExpiry(formatted);
    }
  };
  
  // Only allow numbers for CVV
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 3) {
      setCardCVV(input);
    }
  };
  
  // Format IBAN with spaces every 4 characters
  const handleIBANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase().replace(/\s/g, "");
    setIbanNumber(input.replace(/(.{4})/g, "$1 ").trim());
  };
  
  // Only allow numbers and + for phone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d+]/g, "");
    setBizumPhone(input);
  };
  
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border p-4", className)}>
      <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
      
      <RadioGroup
        value={selectedPaymentMethod || ""}
        onValueChange={onSelectPaymentMethod}
        className="space-y-4"
      >
        {/* Efectivo */}
        <div className={cn(
          "flex items-start space-x-3 border rounded-lg p-3 transition-all",
          selectedPaymentMethod === "cash" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="cash" id="cash" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <Euro className="h-5 w-5 text-green-600 mr-2" />
              <Label htmlFor="cash" className="font-medium">Efectivo</Label>
              {selectedPaymentMethod === "cash" && (
                <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
              )}
            </div>
            <p className="text-sm text-gray-600">El conductor podrá dar cambio. Billete máximo permitido: 20€</p>
          </div>
        </div>
        
        {/* Tarjeta */}
        <div className={cn(
          "flex items-start space-x-3 border rounded-lg p-3 transition-all",
          selectedPaymentMethod === "card" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="card" id="card" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
              <Label htmlFor="card" className="font-medium">Tarjeta</Label>
              {selectedPaymentMethod === "card" && (
                <CheckCircle className="h-4 w-4 text-blue-600 ml-2" />
              )}
            </div>
            
            {selectedPaymentMethod === "card" && (
              <div className="mt-2 space-y-3">
                <div>
                  <Label htmlFor="card-number" className="text-sm mb-1 block">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="card-expiry" className="text-sm mb-1 block">Fecha expiración</Label>
                    <div className="relative">
                      <Input
                        id="card-expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="bg-white"
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="card-cvv" className="text-sm mb-1 block">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="000"
                      value={cardCVV}
                      onChange={handleCVVChange}
                      type="password"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Transferencia bancaria */}
        <div className={cn(
          "flex items-start space-x-3 border rounded-lg p-3 transition-all",
          selectedPaymentMethod === "transfer" ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="transfer" id="transfer" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <ArrowRight className="h-5 w-5 text-purple-600 mr-2" />
              <Label htmlFor="transfer" className="font-medium">Transferencia bancaria</Label>
              {selectedPaymentMethod === "transfer" && (
                <CheckCircle className="h-4 w-4 text-purple-600 ml-2" />
              )}
            </div>
            
            {selectedPaymentMethod === "transfer" && (
              <div className="mt-2 space-y-3">
                <div>
                  <Label htmlFor="iban" className="text-sm mb-1 block">IBAN</Label>
                  <Input
                    id="iban"
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    value={ibanNumber}
                    onChange={handleIBANChange}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="account-holder" className="text-sm mb-1 block">Titular de la cuenta</Label>
                  <Input
                    id="account-holder"
                    placeholder="Nombre y apellidos"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bizum */}
        <div className={cn(
          "flex items-start space-x-3 border rounded-lg p-3 transition-all",
          selectedPaymentMethod === "bizum" ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"
        )}>
          <RadioGroupItem value="bizum" id="bizum" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="text-orange-600 font-bold text-lg mr-2">B</span>
              <Label htmlFor="bizum" className="font-medium">Bizum</Label>
              {selectedPaymentMethod === "bizum" && (
                <CheckCircle className="h-4 w-4 text-orange-600 ml-2" />
              )}
            </div>
            
            {selectedPaymentMethod === "bizum" && (
              <div className="mt-2">
                <Label htmlFor="bizum-phone" className="text-sm mb-1 block">Número de teléfono asociado</Label>
                <Input
                  id="bizum-phone"
                  placeholder="+34 600 000 000"
                  value={bizumPhone}
                  onChange={handlePhoneChange}
                  className="bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodsSection;
