
import React from "react";
import RequestHeader from "./header/RequestHeader";
import RideRequestMain from "./RideRequestMain";

const RideRequestContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <RequestHeader />
      <div className="px-4 py-3 bg-blue-50 rounded-lg mb-4 max-w-4xl mx-auto">
        <h3 className="text-blue-800 font-medium text-sm mb-1">Nuevo modo de selección rápida:</h3>
        <p className="text-blue-700 text-sm">
          1️⃣ <strong>Primer clic</strong> en el mapa: Selecciona el <span className="text-blue-600">origen</span> (punto azul)<br/>
          2️⃣ <strong>Segundo clic</strong> en el mapa: Selecciona el <span className="text-red-600">destino</span> (punto rojo)<br/>
          3️⃣ El viaje se guardará automáticamente con estado "pendiente"
        </p>
      </div>
      <RideRequestMain />
    </div>
  );
};

export default RideRequestContent;
