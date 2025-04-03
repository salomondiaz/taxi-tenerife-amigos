
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapCoordinates } from '../types';
import { Home, X } from 'lucide-react';

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
  homeAddress
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5 text-green-600" />
            ¿Viajar a casa?
          </DialogTitle>
          <DialogDescription>
            ¿Deseas viajar desde este punto hasta tu casa?
            {homeAddress && (
              <div className="mt-2 bg-blue-50 p-2 rounded-md">
                <p className="text-sm font-semibold">Dirección de tu casa:</p>
                <p className="text-sm text-blue-700">{homeAddress}</p>
              </div>
            )}
            {clickedPoint?.address && (
              <div className="mt-2 bg-gray-50 p-2 rounded-md">
                <p className="text-sm font-semibold">Punto seleccionado:</p>
                <p className="text-sm text-gray-700">{clickedPoint.address}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Sí, viajar a casa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDestinationDialog;
