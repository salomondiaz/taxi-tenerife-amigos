
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeSelector } from "./TimeSelector";
import { toast } from "@/hooks/use-toast";

interface ScheduleRideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (scheduledDate: Date) => void;
}

const ScheduleRideDialog: React.FC<ScheduleRideDialogProps> = ({
  open,
  onOpenChange,
  onSchedule
}) => {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  
  const handleSubmit = () => {
    if (!date || !time) {
      toast({
        title: "Datos incompletos",
        description: "Por favor selecciona fecha y hora para programar el viaje",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Parse the time string (format: HH:MM)
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create a new date with the selected date and time
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours);
      scheduledDate.setMinutes(minutes);
      
      // Verify the date is in the future
      if (scheduledDate <= new Date()) {
        toast({
          title: "Fecha inválida",
          description: "La fecha de programación debe ser en el futuro",
          variant: "destructive"
        });
        return;
      }
      
      onSchedule(scheduledDate);
      
      // Reset form after submission
      setDate(undefined);
      setTime(undefined);
    } catch (error) {
      console.error("Error processing date:", error);
      toast({
        title: "Error de programación",
        description: "Ocurrió un error al programar el viaje. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Programar viaje</DialogTitle>
          <DialogDescription>
            Selecciona la fecha y hora para tu viaje programado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="col-span-4 space-y-2">
              <label className="text-sm font-medium">Hora</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !time && "text-muted-foreground"
                    )}
                  >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {time ? time : "Seleccionar hora"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <TimeSelector value={time} onChange={setTime} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!date || !time}
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
          >
            Programar viaje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleRideDialog;
