
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  homeAddress = "tu casa"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5 text-green-600" />
            Viaje a casa
          </DialogTitle>
          <DialogDescription>
            ¿Deseas viajar desde este punto hasta {homeAddress}?
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {clickedPoint && (
            <p className="text-sm text-gray-600">
              Origen: {clickedPoint.address || `(${clickedPoint.lat.toFixed(5)}, ${clickedPoint.lng.toFixed(5)})`}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirmar viaje a casa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDestinationDialog;
