
import React from "react";

interface PriceEstimateProps {
  estimatedPrice: number;
}

const PriceEstimate: React.FC<PriceEstimateProps> = ({ estimatedPrice }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-2">Precio estimado</h2>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{estimatedPrice.toFixed(2)}</span>
        <span className="text-xl">€</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        El precio final puede variar ligeramente según la ruta exacta y las condiciones del tráfico.
      </p>
    </div>
  );
};

export default PriceEstimate;
