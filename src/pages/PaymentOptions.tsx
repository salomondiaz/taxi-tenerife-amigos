
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, CreditCard, Euro, Wallet, PlusCircle, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

type PaymentMethod = {
  id: string;
  type: "card" | "cash" | "paypal";
  name: string;
  last4?: string;
  expiry?: string;
  default?: boolean;
};

const PaymentOptions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
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
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="text-tenerife-blue" size={24} />;
      case "cash":
        return <Euro className="text-tenerife-green-dark" size={24} />;
      case "paypal":
        return <Wallet className="text-blue-500" size={24} />;
      default:
        return <CreditCard size={24} />;
    }
  };

  const handleAddCard = () => {
    setIsProcessing(true);
    
    // Simulación de procesamiento de tarjeta
    setTimeout(() => {
      const last4 = newCard.number.slice(-4);
      
      const newPaymentMethod: PaymentMethod = {
        id: `card-${Date.now()}`,
        type: "card",
        name: `Tarjeta terminada en ${last4}`,
        last4,
        expiry: newCard.expiry,
        default: false,
      };
      
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setNewCard({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
      });
      
      setIsProcessing(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Tarjeta añadida",
        description: "Tu nueva tarjeta ha sido añadida con éxito",
      });
    }, 1500);
  };

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

        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="w-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getIcon(method.type)}
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      {method.expiry && (
                        <p className="text-sm text-gray-500">Caduca: {method.expiry}</p>
                      )}
                      {method.default && (
                        <span className="text-xs text-tenerife-blue flex items-center mt-1">
                          <Check size={12} className="mr-1" />
                          Método por defecto
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.default && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultPayment(method.id)}
                          className="text-gray-500 hover:text-tenerife-blue"
                        >
                          <Check size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaymentMethod(method.id)}
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
          ))}
        </div>

        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
        >
          <PlusCircle size={18} className="mr-2" />
          Añadir nueva tarjeta
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir nueva tarjeta</DialogTitle>
            </DialogHeader>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCard}
                disabled={
                  isProcessing || 
                  !newCard.number || 
                  !newCard.name || 
                  !newCard.expiry || 
                  !newCard.cvc
                }
                className="bg-tenerife-blue hover:bg-tenerife-blue/90"
              >
                {isProcessing ? "Procesando..." : "Añadir tarjeta"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default PaymentOptions;
