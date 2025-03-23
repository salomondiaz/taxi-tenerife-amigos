
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Clock, TrendingUp, Car, Info, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FareSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuración general
  const [baseFare, setBaseFare] = useState("3.00");
  const [perKmRate, setPerKmRate] = useState("1.50");
  const [perMinuteRate, setPerMinuteRate] = useState("0.50");
  const [minimumFare, setMinimumFare] = useState("5.00");
  const [platformFeePercentage, setPlatformFeePercentage] = useState("15");
  
  // Configuración de tarifas dinámicas
  const [dynamicPricingEnabled, setDynamicPricingEnabled] = useState(true);
  const [peakHoursMultiplier, setPeakHoursMultiplier] = useState("1.5");
  const [nightTimeMultiplier, setNightTimeMultiplier] = useState("1.3");
  const [weekendMultiplier, setWeekendMultiplier] = useState("1.2");
  const [highDemandMultiplier, setHighDemandMultiplier] = useState("1.8");
  
  // Configuración de zonas
  const [zoneSpecificRates, setZoneSpecificRates] = useState([
    { id: 1, name: "Zona Norte", multiplier: "1.0", description: "La Orotava, Puerto de la Cruz, Los Realejos" },
    { id: 2, name: "Zona Sur", multiplier: "1.2", description: "Adeje, Arona, Costa Adeje" },
    { id: 3, name: "Zona Metropolitana", multiplier: "1.1", description: "Santa Cruz, La Laguna" },
    { id: 4, name: "Aeropuerto", multiplier: "1.3", description: "Aeropuerto Norte y Sur" },
  ]);
  
  // Configuración de períodos de tiempo
  const [timePeriods, setTimePeriods] = useState([
    { id: 1, name: "Hora punta mañana", startTime: "07:00", endTime: "09:30", multiplier: "1.5", days: ["Lun", "Mar", "Mié", "Jue", "Vie"] },
    { id: 2, name: "Hora punta tarde", startTime: "17:00", endTime: "20:00", multiplier: "1.4", days: ["Lun", "Mar", "Mié", "Jue", "Vie"] },
    { id: 3, name: "Noche", startTime: "22:00", endTime: "06:00", multiplier: "1.3", days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] },
    { id: 4, name: "Fin de semana", startTime: "12:00", endTime: "02:00", multiplier: "1.2", days: ["Sáb", "Dom"] },
  ]);
  
  const handleUpdateZone = (id: number, field: keyof typeof zoneSpecificRates[0], value: string) => {
    setZoneSpecificRates(prev => 
      prev.map(zone => 
        zone.id === id ? { ...zone, [field]: value } : zone
      )
    );
  };
  
  const handleUpdateTimePeriod = (id: number, field: keyof typeof timePeriods[0], value: string | string[]) => {
    setTimePeriods(prev => 
      prev.map(period => 
        period.id === id ? { ...period, [field]: value } : period
      )
    );
  };
  
  const handleAddZone = () => {
    const newId = Math.max(...zoneSpecificRates.map(z => z.id), 0) + 1;
    setZoneSpecificRates([
      ...zoneSpecificRates,
      { id: newId, name: "Nueva zona", multiplier: "1.0", description: "" }
    ]);
  };
  
  const handleRemoveZone = (id: number) => {
    setZoneSpecificRates(prev => prev.filter(zone => zone.id !== id));
  };
  
  const handleAddTimePeriod = () => {
    const newId = Math.max(...timePeriods.map(p => p.id), 0) + 1;
    setTimePeriods([
      ...timePeriods,
      { 
        id: newId, 
        name: "Nuevo periodo", 
        startTime: "08:00", 
        endTime: "10:00", 
        multiplier: "1.0", 
        days: ["Lun", "Mar", "Mié", "Jue", "Vie"] 
      }
    ]);
  };
  
  const handleRemoveTimePeriod = (id: number) => {
    setTimePeriods(prev => prev.filter(period => period.id !== id));
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Aquí iría la lógica para guardar los ajustes en la base de datos
    setTimeout(() => {
      console.log({
        baseFare,
        perKmRate,
        perMinuteRate,
        minimumFare,
        platformFeePercentage,
        dynamicPricingEnabled,
        peakHoursMultiplier,
        nightTimeMultiplier,
        weekendMultiplier,
        highDemandMultiplier,
        zoneSpecificRates,
        timePeriods
      });
      
      toast({
        title: "Configuración guardada",
        description: "Los ajustes de tarifas han sido actualizados correctamente.",
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres restablecer todas las configuraciones a los valores predeterminados?")) {
      setBaseFare("3.00");
      setPerKmRate("1.50");
      setPerMinuteRate("0.50");
      setMinimumFare("5.00");
      setPlatformFeePercentage("15");
      setDynamicPricingEnabled(true);
      setPeakHoursMultiplier("1.5");
      setNightTimeMultiplier("1.3");
      setWeekendMultiplier("1.2");
      setHighDemandMultiplier("1.8");
      
      toast({
        title: "Configuración restablecida",
        description: "Todos los valores han sido restablecidos a su configuración predeterminada.",
      });
    }
  };
  
  const calculateSampleFare = () => {
    const base = parseFloat(baseFare);
    const km = parseFloat(perKmRate);
    const minute = parseFloat(perMinuteRate);
    const min = parseFloat(minimumFare);
    
    // Cálculo para un viaje de ejemplo (5 km, 10 minutos)
    const distanceCost = 5 * km;
    const timeCost = 10 * minute;
    let totalFare = base + distanceCost + timeCost;
    
    // Aplicar tarifa mínima si es necesario
    totalFare = Math.max(totalFare, min);
    
    return totalFare.toFixed(2);
  };
  
  const calculateDriverPay = (fare: string) => {
    const total = parseFloat(fare);
    const fee = parseFloat(platformFeePercentage);
    const driverPay = total * (1 - fee / 100);
    return driverPay.toFixed(2);
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

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Configuración de tarifas</h1>
          <Button
            onClick={handleSaveSettings}
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Guardar cambios
          </Button>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Tarifas básicas</TabsTrigger>
            <TabsTrigger value="dynamic">Tarificación dinámica</TabsTrigger>
            <TabsTrigger value="zones">Zonas</TabsTrigger>
            <TabsTrigger value="times">Periodos de tiempo</TabsTrigger>
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tarifas básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseFare">Tarifa base (€)</Label>
                    <Input 
                      id="baseFare" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      value={baseFare} 
                      onChange={(e) => setBaseFare(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Tarifa inicial al comenzar un viaje</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="perKmRate">Tarifa por kilómetro (€/km)</Label>
                    <Input 
                      id="perKmRate" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      value={perKmRate} 
                      onChange={(e) => setPerKmRate(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Costo por kilómetro recorrido</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="perMinuteRate">Tarifa por minuto (€/min)</Label>
                    <Input 
                      id="perMinuteRate" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      value={perMinuteRate} 
                      onChange={(e) => setPerMinuteRate(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Costo por minuto de viaje</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimumFare">Tarifa mínima (€)</Label>
                    <Input 
                      id="minimumFare" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      value={minimumFare} 
                      onChange={(e) => setMinimumFare(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Tarifa mínima para cualquier viaje</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="platformFee">Comisión de la plataforma (%)</Label>
                    <Input 
                      id="platformFee" 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="1" 
                      value={platformFeePercentage} 
                      onChange={(e) => setPlatformFeePercentage(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Porcentaje que se queda la plataforma por cada viaje</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ejemplo de tarifa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Viaje de ejemplo</span>
                      <p className="font-medium">5 km, 10 minutos</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tarifa total</span>
                      <p className="font-medium text-xl">{calculateSampleFare()} €</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Pago al conductor</span>
                      <p className="font-medium">{calculateDriverPay(calculateSampleFare())} €</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dynamic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de tarificación dinámica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dynamicPricing">Activar tarificación dinámica</Label>
                  <Switch 
                    id="dynamicPricing" 
                    checked={dynamicPricingEnabled}
                    onCheckedChange={setDynamicPricingEnabled}
                  />
                </div>
                
                {dynamicPricingEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="peakHours">Multiplicador en hora punta</Label>
                      <Input 
                        id="peakHours" 
                        type="number" 
                        min="1" 
                        step="0.1" 
                        value={peakHoursMultiplier} 
                        onChange={(e) => setPeakHoursMultiplier(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Factor a aplicar durante las horas de mayor demanda</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nightTime">Multiplicador nocturno</Label>
                      <Input 
                        id="nightTime" 
                        type="number" 
                        min="1" 
                        step="0.1" 
                        value={nightTimeMultiplier} 
                        onChange={(e) => setNightTimeMultiplier(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Factor a aplicar durante horario nocturno</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weekend">Multiplicador fin de semana</Label>
                      <Input 
                        id="weekend" 
                        type="number" 
                        min="1" 
                        step="0.1" 
                        value={weekendMultiplier} 
                        onChange={(e) => setWeekendMultiplier(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Factor a aplicar durante fines de semana</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="highDemand">Multiplicador alta demanda</Label>
                      <Input 
                        id="highDemand" 
                        type="number" 
                        min="1" 
                        step="0.1" 
                        value={highDemandMultiplier} 
                        onChange={(e) => setHighDemandMultiplier(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Factor a aplicar cuando hay muy pocos conductores disponibles</p>
                    </div>
                  </div>
                )}
                
                {!dynamicPricingEnabled && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-2">
                    <div className="flex items-start">
                      <Info size={20} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        La tarificación dinámica permite adaptar las tarifas según la demanda, hora del día y otras condiciones, maximizando los ingresos y mejorando la disponibilidad en horas punta.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Configuración por zonas</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={handleAddZone}
                  className="h-8"
                >
                  Añadir zona
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zoneSpecificRates.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1 mr-4">
                          <Label htmlFor={`zone-name-${zone.id}`}>Nombre de la zona</Label>
                          <Input
                            id={`zone-name-${zone.id}`}
                            value={zone.name}
                            onChange={(e) => handleUpdateZone(zone.id, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 w-24">
                          <Label htmlFor={`zone-multiplier-${zone.id}`}>Factor</Label>
                          <Input
                            id={`zone-multiplier-${zone.id}`}
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={zone.multiplier}
                            onChange={(e) => handleUpdateZone(zone.id, "multiplier", e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => handleRemoveZone(zone.id)}
                        >
                          ×
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`zone-description-${zone.id}`}>Descripción</Label>
                        <Textarea
                          id={`zone-description-${zone.id}`}
                          value={zone.description}
                          onChange={(e) => handleUpdateZone(zone.id, "description", e.target.value)}
                          placeholder="Describe las áreas que incluye esta zona"
                          className="h-20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="times" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Configuración por períodos de tiempo</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={handleAddTimePeriod}
                  className="h-8"
                >
                  Añadir período
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timePeriods.map((period) => (
                    <div key={period.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1 mr-4">
                          <Label htmlFor={`period-name-${period.id}`}>Nombre del período</Label>
                          <Input
                            id={`period-name-${period.id}`}
                            value={period.name}
                            onChange={(e) => handleUpdateTimePeriod(period.id, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 w-24">
                          <Label htmlFor={`period-multiplier-${period.id}`}>Factor</Label>
                          <Input
                            id={`period-multiplier-${period.id}`}
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={period.multiplier}
                            onChange={(e) => handleUpdateTimePeriod(period.id, "multiplier", e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => handleRemoveTimePeriod(period.id)}
                        >
                          ×
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`period-start-${period.id}`}>Hora de inicio</Label>
                          <Input
                            id={`period-start-${period.id}`}
                            type="time"
                            value={period.startTime}
                            onChange={(e) => handleUpdateTimePeriod(period.id, "startTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`period-end-${period.id}`}>Hora de fin</Label>
                          <Input
                            id={`period-end-${period.id}`}
                            type="time"
                            value={period.endTime}
                            onChange={(e) => handleUpdateTimePeriod(period.id, "endTime", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label className="mb-2 block">Días aplicables</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Switch
                                id={`day-${day}-${period.id}`}
                                checked={period.days.includes(day)}
                                onCheckedChange={(checked) => {
                                  const newDays = checked
                                    ? [...period.days, day]
                                    : period.days.filter(d => d !== day);
                                  handleUpdateTimePeriod(period.id, "days", newDays);
                                }}
                              />
                              <Label htmlFor={`day-${day}-${period.id}`}>{day}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa de tarifas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Tarifa base</h3>
                          <span className="text-lg font-bold">{baseFare} €</span>
                        </div>
                        <p className="text-sm text-gray-500">Precio inicial para comenzar el viaje</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Por kilómetro</h3>
                          <span className="text-lg font-bold">{perKmRate} €</span>
                        </div>
                        <p className="text-sm text-gray-500">Precio por cada kilómetro recorrido</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Por minuto</h3>
                          <span className="text-lg font-bold">{perMinuteRate} €</span>
                        </div>
                        <p className="text-sm text-gray-500">Precio por cada minuto de viaje</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="zones">
                      <AccordionTrigger>Multiplicadores por zona</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {zoneSpecificRates.map((zone) => (
                            <div key={zone.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <p className="font-medium">{zone.name}</p>
                                <p className="text-sm text-gray-500">{zone.description}</p>
                              </div>
                              <span className="font-bold">{zone.multiplier}x</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="times">
                      <AccordionTrigger>Multiplicadores por tiempo</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {timePeriods.map((period) => (
                            <div key={period.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <p className="font-medium">{period.name}</p>
                                <p className="text-sm text-gray-500">
                                  {period.startTime} - {period.endTime} ({period.days.join(", ")})
                                </p>
                              </div>
                              <span className="font-bold">{period.multiplier}x</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Ejemplo de cálculo</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Tarifa base:</span> {baseFare} €
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Distancia (5 km):</span> 5 × {perKmRate} € = {(5 * parseFloat(perKmRate)).toFixed(2)} €
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Tiempo (10 min):</span> 10 × {perMinuteRate} € = {(10 * parseFloat(perMinuteRate)).toFixed(2)} €
                      </p>
                      <p className="text-sm font-medium">
                        Total: {calculateSampleFare()} €
                      </p>
                      <p className="text-sm text-gray-500">
                        Comisión de la plataforma ({platformFeePercentage}%): {(parseFloat(calculateSampleFare()) * parseFloat(platformFeePercentage) / 100).toFixed(2)} €
                      </p>
                      <p className="text-sm text-gray-500">
                        Pago al conductor: {calculateDriverPay(calculateSampleFare())} €
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleReset}
              >
                Restablecer valores predeterminados
              </Button>
              
              <Button
                onClick={handleSaveSettings}
                className="bg-tenerife-blue hover:bg-tenerife-blue/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Guardar cambios
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FareSettings;
