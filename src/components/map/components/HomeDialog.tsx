
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapCoordinates } from '../types';

interface HomeDialogProps {
  showHomeDialog: boolean;
  setShowHomeDialog: (show: boolean) => void;
  homeLocation: MapCoordinates | null;
  useHomeAsDestination?: () => void;
}

const HomeDialog: React.FC<HomeDialogProps> = ({
  showHomeDialog,
  setShowHomeDialog,
  homeLocation,
  useHomeAsDestination
}) => {
  if (!homeLocation) return null;
  
  return (
    <Dialog open={showHomeDialog} onOpenChange={setShowHomeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usar tu casa como destino</DialogTitle>
          <DialogDescription>
            ¿Quieres usar tu dirección guardada como destino?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mb-4">
          <Home className="text-green-500" size={20} />
          <span className="font-medium">{homeLocation.address || 'Mi Casa'}</span>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowHomeDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={() => {
            if (useHomeAsDestination) {
              useHomeAsDestination();
              setShowHomeDialog(false);
            }
          }}>
            Usar como destino
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDialog;
