
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddBalanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBalance: (amount: number) => void;
}

export const AddBalanceDialog: React.FC<AddBalanceDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddBalance,
}) => {
  const [changeAmount, setChangeAmount] = useState(0);

  const handleAddBalance = () => {
    onAddBalance(changeAmount);
    setChangeAmount(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir saldo para cambio</DialogTitle>
          <DialogDescription>
            Este saldo se utilizará para futuros viajes cuando el conductor no disponga de cambio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="change-amount" className="text-sm font-medium">
              Cantidad a añadir (€)
            </label>
            <Input
              id="change-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={changeAmount || ""}
              onChange={(e) => setChangeAmount(Number(e.target.value))}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddBalance}
            disabled={!changeAmount || changeAmount <= 0}
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
          >
            Añadir saldo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
