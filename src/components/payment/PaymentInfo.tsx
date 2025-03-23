
import React from "react";
import { AlertCircle } from "lucide-react";

export const PaymentInfo: React.FC = () => {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-start">
        <AlertCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-blue-800">Información sobre pago en efectivo</h3>
          <p className="text-sm text-blue-600 mt-1">
            Si el conductor no dispone de cambio para billetes superiores a 20€, el importe quedará depositado en tu saldo para futuros viajes.
          </p>
        </div>
      </div>
    </div>
  );
};
