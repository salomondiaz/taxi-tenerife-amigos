
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ScheduleRideDialog from "./ScheduleRideDialog";

interface ScheduleRideButtonProps {
  onSchedule: (scheduledDate: Date) => Promise<any>;
  isDisabled?: boolean;
}

const ScheduleRideButton: React.FC<ScheduleRideButtonProps> = ({
  onSchedule,
  isDisabled = false
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async (scheduledDate: Date) => {
    if (isScheduling) return;
    
    try {
      setIsScheduling(true);
      
      // Validar que la fecha sea futura
      if (scheduledDate <= new Date()) {
        toast({
          title: "Fecha inválida",
          description: "La fecha de programación debe ser en el futuro",
          variant: "destructive"
        });
        return;
      }
      
      // Procesar la programación
      const result = await onSchedule(scheduledDate);
      
      if (result) {
        setShowDialog(false);
        toast({
          title: "Viaje programado",
          description: `Tu viaje ha sido programado para el ${scheduledDate.toLocaleDateString()} a las ${scheduledDate.toLocaleTimeString()}`
        });
      }
    } catch (error) {
      console.error("Error al programar viaje:", error);
      toast({
        title: "Error de programación",
        description: "No se pudo programar el viaje. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center bg-white border-purple-300 text-purple-700"
        onClick={() => setShowDialog(true)}
        disabled={isDisabled}
      >
        <Calendar className="mr-2" size={18} />
        <span className="mr-1">Programar viaje</span>
        <Clock size={14} />
      </Button>
      
      <ScheduleRideDialog 
        open={showDialog}
        onOpenChange={setShowDialog}
        onSchedule={handleSchedule}
      />
    </>
  );
};

export default ScheduleRideButton;
