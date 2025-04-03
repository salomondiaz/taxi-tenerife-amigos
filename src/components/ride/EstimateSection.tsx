
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CalendarDays, Clock, AlertCircle, MapPin, Calendar, Info } from "lucide-react";
import { TrafficLevel } from "@/components/map/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface EstimateSectionProps {
  estimatedDistance: number | null;
  estimatedTime: number | null;
  trafficLevel: TrafficLevel;
  arrivalTime: Date | null;
  estimatedPrice: number | null;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (paymentMethod: string) => void;
  handleRideRequest: () => void;
  visible: boolean;
  scheduledTime?: string;
  onScheduleRide: (date: Date) => void;
}

const EstimateSection: React.FC<EstimateSectionProps> = ({
  estimatedDistance,
  estimatedTime,
  trafficLevel,
  arrivalTime,
  estimatedPrice,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handleRideRequest,
  visible,
  scheduledTime,
  onScheduleRide,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
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

  // Format traffic level text and color
  const getTrafficInfo = () => {
    switch (trafficLevel) {
      case "low":
        return { text: "Tráfico ligero", color: "text-green-600", bg: "bg-green-50" };
      case "moderate":
        return { text: "Tráfico moderado", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "high":
        return { text: "Tráfico denso", color: "text-orange-600", bg: "bg-orange-50" };
      case "very_high":
        return { text: "Tráfico muy denso", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { text: "Tráfico desconocido", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  // Handle scheduling a ride
  const handleScheduleSelect = () => {
    if (!selectedDate) return;
    
    const hour = parseInt(selectedHour);
    const minute = parseInt(selectedMinute);
    
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hour, minute);
    
    onScheduleRide(scheduledDate);
    setShowDatePicker(false);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDetails(method !== "cash");
  };

  if (!visible) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalles del viaje</span>
          {scheduledTime && (
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Programado
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Información estimada para tu viaje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estimates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700 font-medium">Distancia</p>
            <p className="text-xl font-bold">{estimatedDistance ? `${estimatedDistance.toFixed(1)} km` : "Calculando..."}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700 font-medium">Tiempo estimado</p>
            <p className="text-xl font-bold">{estimatedTime ? `${estimatedTime} min` : "Calculando..."}</p>
          </div>
        </div>

        {/* Traffic info */}
        {trafficLevel && (
          <div className={`p-3 rounded-md flex items-center justify-between ${getTrafficInfo().bg}`}>
            <div className="flex items-center">
              <AlertCircle className={`h-5 w-5 mr-2 ${getTrafficInfo().color}`} />
              <span className={`font-medium ${getTrafficInfo().color}`}>
                {getTrafficInfo().text}
              </span>
            </div>
            {arrivalTime && (
              <div className="text-sm">
                <span className="text-gray-500">Llegada aproximada: </span>
                <span className="font-medium">{format(arrivalTime, "HH:mm")}</span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="bg-green-50 p-4 rounded-md text-center">
          <p className="text-sm text-green-700 mb-1">Precio estimado</p>
          <p className="text-3xl font-bold text-green-700">
            {estimatedPrice ? `${estimatedPrice.toFixed(2)} €` : "Calculando..."}
          </p>
        </div>

        {/* Schedule ride section */}
        {!scheduledTime && (
          <div className="border border-gray-200 rounded-md p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-medium">Programar viaje</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-xs h-8"
              >
                {showDatePicker ? "Cancelar" : "Programar"}
              </Button>
            </div>

            {showDatePicker && (
              <div className="space-y-4 border-t border-gray-200 pt-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Selecciona fecha y hora:</label>
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left">
                          {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : "Selecciona una fecha"}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="flex space-x-2">
                      <Select value={selectedHour} onValueChange={setSelectedHour}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Hora</SelectLabel>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      <span className="flex items-center">:</span>
                      
                      <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Minutos</SelectLabel>
                            {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((min) => (
                              <SelectItem key={min} value={min}>
                                {min}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleScheduleSelect} 
                  disabled={!selectedDate} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Programar viaje
                </Button>
              </div>
            )}

            {scheduledTime && (
              <div className="mt-2 bg-purple-50 p-2 rounded-md">
                <p className="text-sm font-medium flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1 text-purple-600" />
                  <span>Viaje programado para:</span>
                </p>
                <p className="text-purple-700 font-medium mt-1">{scheduledTime}</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selection */}
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
          
          {showPaymentDetails && selectedPaymentMethod === "card" && (
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
          )}
          
          {showPaymentDetails && selectedPaymentMethod === "transfer" && (
            <div className="mt-3">
              <Input 
                placeholder="IBAN" 
                value={paymentDetails.bankAccount}
                onChange={(e) => setPaymentDetails({...paymentDetails, bankAccount: e.target.value})}
              />
            </div>
          )}
          
          {showPaymentDetails && selectedPaymentMethod === "bizum" && (
            <div className="mt-3">
              <Input 
                placeholder="Número de teléfono" 
                value={paymentDetails.phoneNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRideRequest} 
          disabled={!selectedPaymentMethod || !estimatedPrice}
          className="w-full"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {scheduledTime ? "Confirmar viaje programado" : "Solicitar taxi ahora"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EstimateSection;
