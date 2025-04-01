
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Euro } from "lucide-react";

interface PriceEstimateProps {
  estimatedPrice: number;
}

const PriceEstimate: React.FC<PriceEstimateProps> = ({ estimatedPrice }) => {
  // Ensure we handle null or undefined values
  const safePrice = estimatedPrice || 0;
  const formattedPrice = safePrice.toFixed(2);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Euro size={24} className="text-tenerife-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Precio estimado</p>
              <p className="text-2xl font-bold text-tenerife-blue">{formattedPrice} €</p>
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <p className="text-xs text-blue-600">Precio aproximado</p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          El precio final puede variar ligeramente según las condiciones de tráfico y la ruta exacta tomada.
        </p>
      </CardContent>
    </Card>
  );
};

export default PriceEstimate;
