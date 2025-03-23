
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, PlusCircle, CreditCard, Euro, Wallet } from "lucide-react";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodItemProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
  onAddBalance?: () => void;
}

export const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  method,
  onSetDefault,
  onRemove,
  onAddBalance,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="text-tenerife-blue" size={24} />;
      case "cash":
        return <Euro className="text-tenerife-green-dark" size={24} />;
      case "paypal":
        return <Wallet className="text-blue-500" size={24} />;
      case "bizum":
        return <Wallet className="text-purple-500" size={24} />;
      default:
        return <CreditCard size={24} />;
    }
  };

  const renderPaymentMethodDetails = () => {
    if (method.type === "cash" && method.changeBalance !== undefined) {
      return (
        <>
          <p className="text-sm text-gray-500">Saldo para cambio: {method.changeBalance.toFixed(2)}€</p>
          {method.default && (
            <span className="text-xs text-tenerife-blue flex items-center mt-1">
              <Check size={12} className="mr-1" />
              Método por defecto
            </span>
          )}
        </>
      );
    }
    
    if (method.expiry) {
      return (
        <>
          <p className="text-sm text-gray-500">Caduca: {method.expiry}</p>
          {method.default && (
            <span className="text-xs text-tenerife-blue flex items-center mt-1">
              <Check size={12} className="mr-1" />
              Método por defecto
            </span>
          )}
        </>
      );
    }
    
    return method.default && (
      <span className="text-xs text-tenerife-blue flex items-center mt-1">
        <Check size={12} className="mr-1" />
        Método por defecto
      </span>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getIcon(method.type)}
            <div>
              <h3 className="font-medium">{method.name}</h3>
              {renderPaymentMethodDetails()}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {method.type === "cash" && onAddBalance && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddBalance}
                className="text-gray-500 hover:text-tenerife-blue"
              >
                <PlusCircle size={18} className="mr-1" />
                <span className="text-xs">Añadir saldo</span>
              </Button>
            )}
            
            {!method.default && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(method.id)}
                  className="text-gray-500 hover:text-tenerife-blue"
                >
                  <Check size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(method.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
