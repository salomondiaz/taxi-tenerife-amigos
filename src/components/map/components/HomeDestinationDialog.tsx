
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { MapCoordinates } from "../types";

interface HomeDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clickedPoint: MapCoordinates | null;
  onConfirm: () => void;
  homeAddress?: string;
}

const HomeDestinationDialog: React.FC<HomeDestinationDialogProps> = ({
  open,
  onOpenChange,
  clickedPoint,
  onConfirm,
  homeAddress,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            ¿Viajar hasta tu casa?
          </DialogTitle>
          <DialogDescription>
            ¿Deseas viajar desde esta ubicación hasta tu casa?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg bg-blue-50 p-3 mb-3">
            <p className="text-sm font-medium text-blue-800">Desde:</p>
            <p className="text-sm text-blue-700">{clickedPoint?.address || "Punto seleccionado en el mapa"}</p>
          </div>
          
          <div className="rounded-lg bg-teal-50 p-3">
            <p className="text-sm font-medium text-teal-800">Hasta tu casa:</p>
            <p className="text-sm text-teal-700">{homeAddress || "Tu ubicación guardada como casa"}</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1 order-2"
          >
            Cancelar
          </Button>
          <Button
            className="bg-tenerife-blue hover:bg-tenerife-blue/90 sm:order-2 order-1"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Sí, viajar a casa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDestinationDialog;
