
import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Home } from "lucide-react";

interface QuickAccessButtonsProps {
  handleUseCurrentLocation: () => void;
  useHomeAddress: () => void;
  saveHomeAddress: () => void;
}

const QuickAccessButtons: React.FC<QuickAccessButtonsProps> = ({
  handleUseCurrentLocation,
  useHomeAddress,
  saveHomeAddress,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleUseCurrentLocation}
      >
        <Target size={16} />
        <span className="md:inline">Mi ubicación</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={useHomeAddress}
      >
        <Home size={16} />
        <span className="md:inline">Mi casa</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={saveHomeAddress}
      >
        <Home size={16} />
        <span className="md:inline">Guardar casa</span>
      </Button>
    </div>
  );
};

export default QuickAccessButtons;
