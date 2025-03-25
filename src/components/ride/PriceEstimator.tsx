
import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface PriceEstimatorProps {
  origin: string;
  originCoords: any;
  destination: string;
  destinationCoords: any;
  isLoading: boolean;
  calculateEstimates: () => void;
}

const PriceEstimator: React.FC<PriceEstimatorProps> = ({
  origin,
  originCoords,
  destination,
  destinationCoords,
  isLoading,
  calculateEstimates,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <Button 
        variant="default"
        className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90 py-6 text-lg"
        onClick={calculateEstimates}
        disabled={isLoading || (!origin && !originCoords) || (!destination && !destinationCoords)}
      >
        <Calculator size={20} className="mr-2" />
        Calcular precio
      </Button>
    </div>
  );
};

export default PriceEstimator;
