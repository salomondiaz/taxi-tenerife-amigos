
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveRideToSupabase } from "@/hooks/useRideRequestMain";

interface RideRequestMainProps {
  estimatedPrice?: number;
  distance?: number;
  duration?: number;
}

const RideRequestMain = ({ estimatedPrice, distance, duration }: RideRequestMainProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const { toast } = useToast();

  const handleSubmitRequest = async () => {
    if (!origin || !destination) {
      toast({
        variant: "destructive",
        title: "Información incompleta",
        description: "Por favor ingrese origen y destino",
      });
      return;
    }
    
    try {
      let scheduledDateObj: Date | null = null;
      
      if (isScheduled && scheduledDate && scheduledTime) {
        // Create a new Date object from the scheduledDate
        scheduledDateObj = new Date(scheduledDate);
        
        // Parse the time string and set hours and minutes
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        scheduledDateObj.setHours(hours, minutes);
      }
      
      await saveRideToSupabase(
        origin,
        destination,
        distance || 0,
        duration || 0,
        estimatedPrice || 0,
        scheduledDateObj
      );
      
      toast({
        title: "Solicitud enviada!",
        description: "Su solicitud de viaje ha sido enviada con éxito.",
      });
    } catch (error) {
      console.error("Failed to save ride request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al solicitar el viaje.",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="origin">Origen</Label>
        <Input
          id="origin"
          placeholder="Punto de partida"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
          }}
        />
      </div>
      <div>
        <Label htmlFor="destination">Destino</Label>
        <Input
          id="destination"
          placeholder="¿A dónde quieres ir?"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Input
          id="schedule"
          type="checkbox"
          checked={isScheduled}
          onChange={(e) => setIsScheduled(e.target.checked)}
        />
        <Label htmlFor="schedule">Programar viaje</Label>
      </div>

      {isScheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Hora</Label>
            <Input
              type="time"
              id="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>
      )}

      {estimatedPrice !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Precio estimado:</span>
          <span className="text-2xl font-bold">{estimatedPrice.toFixed(2)} €</span>
        </div>
      )}

      <Button onClick={handleSubmitRequest}>Solicitar viaje</Button>
    </div>
  );
};

export default RideRequestMain;
