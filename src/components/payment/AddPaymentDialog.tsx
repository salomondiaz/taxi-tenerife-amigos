
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMethod: (data: {
    type: "card" | "paypal" | "bizum";
    cardDetails?: {
      number: string;
      name: string;
      expiry: string;
      cvc: string;
    };
    paypalEmail?: string;
    bizumPhone?: string;
  }) => void;
  isProcessing: boolean;
}

export const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddMethod,
  isProcessing,
}) => {
  const [newPaymentType, setNewPaymentType] = useState<"card" | "paypal" | "bizum">("card");
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bizumPhone, setBizumPhone] = useState("");

  const handleAddMethod = () => {
    onAddMethod({
      type: newPaymentType,
      cardDetails: newPaymentType === "card" ? newCard : undefined,
      paypalEmail: newPaymentType === "paypal" ? paypalEmail : undefined,
      bizumPhone: newPaymentType === "bizum" ? bizumPhone : undefined,
    });
  };

  const renderPaymentMethodForm = () => {
    switch (newPaymentType) {
      case "card":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="card-number" className="text-sm font-medium">
                Número de tarjeta
              </label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="card-name" className="text-sm font-medium">
                Nombre en la tarjeta
              </label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="card-expiry" className="text-sm font-medium">
                  Fecha de caducidad
                </label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="card-cvc" className="text-sm font-medium">
                  CVC
                </label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case "paypal":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="paypal-email" className="text-sm font-medium">
                Correo electrónico de PayPal
              </label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
            </div>
          </div>
        );
      case "bizum":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="bizum-phone" className="text-sm font-medium">
                Número de teléfono para Bizum
              </label>
              <Input
                id="bizum-phone"
                type="tel"
                placeholder="600123456"
                value={bizumPhone}
                onChange={(e) => setBizumPhone(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isAddButtonDisabled = () => {
    if (isProcessing) return true;
    
    switch (newPaymentType) {
      case "card":
        return !newCard.number || !newCard.name || !newCard.expiry || !newCard.cvc;
      case "paypal":
        return !paypalEmail;
      case "bizum":
        return !bizumPhone;
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir método de pago</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de método de pago que deseas añadir.
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 py-4">
          <Button
            variant={newPaymentType === "card" ? "default" : "outline"}
            onClick={() => setNewPaymentType("card")}
            className="flex-1"
          >
            <CreditCard className="mr-2" size={16} />
            Tarjeta
          </Button>
          <Button
            variant={newPaymentType === "paypal" ? "default" : "outline"}
            onClick={() => setNewPaymentType("paypal")}
            className="flex-1"
          >
            <Wallet className="mr-2 text-blue-500" size={16} />
            PayPal
          </Button>
          <Button
            variant={newPaymentType === "bizum" ? "default" : "outline"}
            onClick={() => setNewPaymentType("bizum")}
            className="flex-1"
          >
            <Wallet className="mr-2 text-purple-500" size={16} />
            Bizum
          </Button>
        </div>

        {renderPaymentMethodForm()}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddMethod}
            disabled={isAddButtonDisabled()}
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
          >
            {isProcessing ? "Procesando..." : "Añadir método"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
