
import { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/hooks/use-toast";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card-1",
      type: "card",
      name: "Visa terminada en 4242",
      last4: "4242",
      expiry: "12/25",
      default: true,
    },
    {
      id: "cash-1",
      type: "cash",
      name: "Efectivo",
      default: false,
      changeBalance: 0, // Saldo inicial para cambio
    },
    {
      id: "paypal-1",
      type: "paypal",
      name: "PayPal",
      default: false,
    },
    {
      id: "bizum-1",
      type: "bizum",
      name: "Bizum",
      default: false,
    },
  ]);

  const setDefaultPayment = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      default: method.id === id,
    }));
    
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Método por defecto actualizado",
      description: "Tu método de pago por defecto ha sido actualizado",
    });
  };

  const removePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(m => m.id === id);
    
    if (methodToRemove?.default) {
      toast({
        title: "No se puede eliminar",
        description: "No puedes eliminar tu método de pago por defecto",
        variant: "destructive",
      });
      return;
    }
    
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Método eliminado",
      description: "El método de pago ha sido eliminado",
    });
  };

  const addPaymentMethod = (data: {
    type: "card" | "paypal" | "bizum";
    cardDetails?: {
      number: string;
      name: string;
      expiry: string;
      cvc: string;
    };
    paypalEmail?: string;
    bizumPhone?: string;
  }) => {
    let newPaymentMethod: PaymentMethod;
    
    if (data.type === "card" && data.cardDetails) {
      const last4 = data.cardDetails.number.slice(-4);
      
      newPaymentMethod = {
        id: `card-${Date.now()}`,
        type: "card",
        name: `Tarjeta terminada en ${last4}`,
        last4,
        expiry: data.cardDetails.expiry,
        default: false,
      };
    } else if (data.type === "paypal" && data.paypalEmail) {
      newPaymentMethod = {
        id: `paypal-${Date.now()}`,
        type: "paypal",
        name: `PayPal (${data.paypalEmail})`,
        default: false,
      };
    } else if (data.type === "bizum" && data.bizumPhone) {
      newPaymentMethod = {
        id: `bizum-${Date.now()}`,
        type: "bizum",
        name: `Bizum (${data.bizumPhone})`,
        default: false,
      };
    } else {
      throw new Error("Invalid payment method data");
    }
    
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    
    toast({
      title: "Método de pago añadido",
      description: "Tu nuevo método de pago ha sido añadido con éxito",
    });
  };

  const addCashBalance = (amount: number) => {
    // Actualizar el saldo de cambio en efectivo
    const updatedMethods = paymentMethods.map(method => {
      if (method.type === "cash") {
        return {
          ...method,
          changeBalance: (method.changeBalance || 0) + amount,
        };
      }
      return method;
    });
    
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Saldo actualizado",
      description: `Se ha añadido ${amount}€ a tu saldo para cambio en efectivo`,
    });
  };

  return {
    paymentMethods,
    setDefaultPayment,
    removePaymentMethod,
    addPaymentMethod,
    addCashBalance,
  };
};
