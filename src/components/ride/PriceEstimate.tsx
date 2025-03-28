
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PriceEstimateProps {
  estimatedPrice: number;
}

const PriceEstimate: React.FC<PriceEstimateProps> = ({ estimatedPrice }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-3">Precio estimado</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
          <p className="text-2xl font-bold text-blue-600">{estimatedPrice.toFixed(2)} €</p>
        </div>
        
        <div className="text-center bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Precio fijo garantizado</p>
          <p className="text-sm font-medium text-blue-700">Sin sorpresas</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <AlertTriangle size={14} className="text-yellow-500" />
        <p>El precio final puede variar si cambias la ruta durante el viaje</p>
      </div>
    </div>
  );
};

export default PriceEstimate;
