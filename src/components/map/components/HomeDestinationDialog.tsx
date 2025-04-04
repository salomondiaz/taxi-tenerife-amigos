
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
import { Home, MapPin } from "lucide-react";
import { MapCoordinates } from '../types';

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
  homeAddress = 'Mi Casa'
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
            <Home className="mr-2 h-5 w-5 text-tenerife-blue" />
            ¿Quieres ir a casa?
          </DialogTitle>
          <DialogDescription>
            Hemos detectado que seleccionaste un punto de origen. ¿Deseas establecer tu casa como destino de este viaje?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 pt-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Origen seleccionado</p>
              <p className="text-sm text-gray-500">{clickedPoint?.address || 'Ubicación seleccionada'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Home className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Destino: Tu casa</p>
              <p className="text-sm text-gray-500">{homeAddress}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            No, seleccionar otro destino
          </Button>
          <Button type="button" onClick={handleConfirm} className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Sí, ir a casa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDestinationDialog;
