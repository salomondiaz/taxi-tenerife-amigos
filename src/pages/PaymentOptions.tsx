
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, CreditCard, Euro, Wallet, PlusCircle, Check, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type PaymentMethod = {
  id: string;
  type: "card" | "cash" | "paypal" | "bizum";
  name: string;
  last4?: string;
  expiry?: string;
  default?: boolean;
  // Campo para el cambio en efectivo
  changeBalance?: number;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<"card" | "paypal" | "bizum">("card");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bizumPhone, setBizumPhone] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);

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

  const handleAddMethod = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      let newPaymentMethod: PaymentMethod;
      
      if (newPaymentType === "card") {
        const last4 = newCard.number.slice(-4);
        
        newPaymentMethod = {
          id: `card-${Date.now()}`,
          type: "card",
          name: `Tarjeta terminada en ${last4}`,
          last4,
          expiry: newCard.expiry,
          default: false,
        };
      } else if (newPaymentType === "paypal") {
        newPaymentMethod = {
          id: `paypal-${Date.now()}`,
          type: "paypal",
          name: `PayPal (${paypalEmail})`,
          default: false,
        };
      } else {
        newPaymentMethod = {
          id: `bizum-${Date.now()}`,
          type: "bizum",
          name: `Bizum (${bizumPhone})`,
          default: false,
        };
      }
      
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      
      // Resetear los estados
      setNewCard({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
      });
      setPaypalEmail("");
      setBizumPhone("");
      
      setIsProcessing(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Método de pago añadido",
        description: "Tu nuevo método de pago ha sido añadido con éxito",
      });
    }, 1500);
  };

  const handleAddCashChange = () => {
    // Actualizar el saldo de cambio en efectivo
    const updatedMethods = paymentMethods.map(method => {
      if (method.type === "cash") {
        return {
          ...method,
          changeBalance: (method.changeBalance || 0) + changeAmount,
        };
      }
      return method;
    });
    
    setPaymentMethods(updatedMethods);
    setIsChangeDialogOpen(false);
    setChangeAmount(0);
    
    toast({
      title: "Saldo actualizado",
      description: `Se ha añadido ${changeAmount}€ a tu saldo para cambio en efectivo`,
    });
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

  const renderPaymentMethodDetails = (method: PaymentMethod) => {
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

  const showAddPaymentDialog = () => {
    setNewPaymentType("card");
    setIsDialogOpen(true);
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
                      {renderPaymentMethodDetails(method)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Botón para añadir saldo para cambio si es efectivo */}
                    {method.type === "cash" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsChangeDialogOpen(true)}
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
          onClick={showAddPaymentDialog}
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
        >
          <PlusCircle size={18} className="mr-2" />
          Añadir nuevo método de pago
        </Button>

        {/* Información sobre cambio en efectivo */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <AlertCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-medium text-blue-800">Información sobre pago en efectivo</h3>
              <p className="text-sm text-blue-600 mt-1">
                Si el conductor no dispone de cambio para billetes superiores a 20€, el importe quedará depositado en tu saldo para futuros viajes.
              </p>
            </div>
          </div>
        </div>

        {/* Dialog para añadir nuevo método de pago */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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

        {/* Dialog para añadir saldo para cambio */}
        <Dialog open={isChangeDialogOpen} onOpenChange={setIsChangeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir saldo para cambio</DialogTitle>
              <DialogDescription>
                Este saldo se utilizará para futuros viajes cuando el conductor no disponga de cambio.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="change-amount" className="text-sm font-medium">
                  Cantidad a añadir (€)
                </label>
                <Input
                  id="change-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={changeAmount || ""}
                  onChange={(e) => setChangeAmount(Number(e.target.value))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsChangeDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCashChange}
                disabled={!changeAmount || changeAmount <= 0}
                className="bg-tenerife-blue hover:bg-tenerife-blue/90"
              >
                Añadir saldo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default PaymentOptions;
