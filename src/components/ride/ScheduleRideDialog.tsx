
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ScheduleRideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (scheduledTime: Date) => void;
}

const ScheduleRideDialog: React.FC<ScheduleRideDialogProps> = ({
  open,
  onOpenChange,
  onSchedule
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");
  
  const handleSchedule = () => {
    if (!date) return;
    
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledTime = new Date(date);
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Check if the scheduled time is in the future
    if (scheduledTime < new Date()) {
      alert("No puedes programar un viaje para el pasado. Por favor, elige una fecha y hora futura.");
      return;
    }
    
    onSchedule(scheduledTime);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-purple-600" />
            Programar viaje
          </DialogTitle>
          <DialogDescription>
            Selecciona la fecha y hora para programar tu viaje
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Fecha</label>
            <div className="flex justify-center border rounded-md p-1">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium leading-none flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              Hora
            </label>
            <input
              type="time"
              id="time"
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          {date && (
            <p className="text-sm text-center">
              Viaje programado para:{" "}
              <strong>
                {format(date, "EEEE d 'de' MMMM", { locale: es })} a las{" "}
                {time}
              </strong>
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="default" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSchedule}
          >
            Programar viaje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleRideDialog;
