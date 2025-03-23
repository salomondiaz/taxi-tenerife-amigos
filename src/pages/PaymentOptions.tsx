
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { PaymentMethodList } from "@/components/payment/PaymentMethodList";
import { AddPaymentDialog } from "@/components/payment/AddPaymentDialog";
import { AddBalanceDialog } from "@/components/payment/AddBalanceDialog";
import { PaymentInfo } from "@/components/payment/PaymentInfo";

const PaymentOptions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    paymentMethods,
    setDefaultPayment,
    removePaymentMethod,
    addPaymentMethod,
    addCashBalance,
  } = usePaymentMethods();

  const handleAddMethod = (data: {
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
    setIsProcessing(true);
    
    // Simulación de procesamiento
    setTimeout(() => {
      addPaymentMethod(data);
      setIsProcessing(false);
      setIsDialogOpen(false);
    }, 1500);
  };

  const handleAddCashBalance = (amount: number) => {
    addCashBalance(amount);
    setIsChangeDialogOpen(false);
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6 pb-24">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Métodos de pago</h1>

        <PaymentMethodList
          paymentMethods={paymentMethods}
          onSetDefault={setDefaultPayment}
          onRemove={removePaymentMethod}
          onOpenAddBalance={() => setIsChangeDialogOpen(true)}
        />

        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
        >
          <PlusCircle size={18} className="mr-2" />
          Añadir nuevo método de pago
        </Button>

        <PaymentInfo />

        <AddPaymentDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddMethod={handleAddMethod}
          isProcessing={isProcessing}
        />

        <AddBalanceDialog
          isOpen={isChangeDialogOpen}
          onOpenChange={setIsChangeDialogOpen}
          onAddBalance={handleAddCashBalance}
        />
      </div>
    </MainLayout>
  );
};

export default PaymentOptions;
