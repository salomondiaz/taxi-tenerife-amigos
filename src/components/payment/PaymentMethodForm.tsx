
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Calendar, Lock } from "lucide-react";

interface PaymentMethodFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
}

export interface PaymentFormData {
  type: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  saveForFuture?: boolean;
  bizumPhone?: string;
  bankName?: string;
  accountNumber?: string;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSubmit, onCancel }) => {
  const [paymentType, setPaymentType] = useState<string>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [bizumPhone, setBizumPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value[i];
    }
    
    setCardNumber(formatted);
  };

  // Format expiry date MM/YY
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    
    setExpiryDate(value);
  };

  // Basic validation before submission
  const validateForm = (): boolean => {
    setError(null);
    
    if (paymentType === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        setError("Introduce un número de tarjeta válido");
        return false;
      }
      if (!cardHolder) {
        setError("Introduce el nombre del titular");
        return false;
      }
      if (!expiryDate || expiryDate.length < 5) {
        setError("Introduce una fecha de expiración válida");
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setError("Introduce un código de seguridad válido");
        return false;
      }
    } else if (paymentType === "bizum") {
      if (!bizumPhone || bizumPhone.length < 9) {
        setError("Introduce un número de teléfono válido para Bizum");
        return false;
      }
    } else if (paymentType === "transfer") {
      if (!bankName) {
        setError("Introduce el nombre del banco");
        return false;
      }
      if (!accountNumber || accountNumber.length < 10) {
        setError("Introduce un número de cuenta válido");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData: PaymentFormData = {
      type: paymentType
    };
    
    if (paymentType === "card") {
      formData.cardNumber = cardNumber;
      formData.cardHolder = cardHolder;
      formData.expiryDate = expiryDate;
      formData.cvv = cvv;
      formData.saveForFuture = saveCard;
    } else if (paymentType === "bizum") {
      formData.bizumPhone = bizumPhone;
    } else if (paymentType === "transfer") {
      formData.bankName = bankName;
      formData.accountNumber = accountNumber;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Añadir método de pago</h2>
      
      <div className="flex space-x-2 mb-6">
        <Button
          type="button"
          variant={paymentType === "card" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setPaymentType("card")}
        >
          Tarjeta
        </Button>
        <Button
          type="button"
          variant={paymentType === "bizum" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setPaymentType("bizum")}
        >
          Bizum
        </Button>
        <Button
          type="button"
          variant={paymentType === "transfer" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setPaymentType("transfer")}
        >
          Transferencia
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {paymentType === "card" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">Número de tarjeta</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="card-holder">Titular de la tarjeta</Label>
              <Input
                id="card-holder"
                placeholder="NOMBRE APELLIDOS"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry-date">Fecha de expiración</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="expiry-date"
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cvv">Código de seguridad</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="cvv"
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="save-card" 
                checked={saveCard} 
                onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              />
              <Label htmlFor="save-card" className="text-sm">
                Guardar esta tarjeta para futuros pagos
              </Label>
            </div>
          </div>
        )}
        
        {paymentType === "bizum" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bizum-phone">Número de teléfono</Label>
              <Input
                id="bizum-phone"
                type="tel"
                placeholder="600123456"
                value={bizumPhone}
                onChange={(e) => setBizumPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              />
            </div>
            <p className="text-sm text-gray-600">
              Recibirás una notificación en tu app de Bizum para confirmar el pago.
            </p>
          </div>
        )}
        
        {paymentType === "transfer" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-name">Nombre del banco</Label>
              <Input
                id="bank-name"
                placeholder="CaixaBank, BBVA, etc."
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="account-number">Número de cuenta (IBAN)</Label>
              <Input
                id="account-number"
                placeholder="ES12 3456 7890 1234 5678 9012"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Recibirás los detalles de la transferencia por correo electrónico.
            </p>
          </div>
        )}
        
        <div className="mt-6 flex space-x-3">
          <Button type="submit" className="flex-1">
            Guardar método de pago
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
