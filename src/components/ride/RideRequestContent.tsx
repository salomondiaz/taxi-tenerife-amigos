
import React from "react";
import RequestHeader from "./header/RequestHeader";
import RideRequestMain from "./RideRequestMain";

const RideRequestContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <RequestHeader />
      <div className="px-4 py-3 bg-blue-50 rounded-lg mb-4 max-w-4xl mx-auto">
        <h3 className="text-blue-800 font-medium text-sm mb-1">Instrucciones:</h3>
        <p className="text-blue-700 text-sm">
          1️⃣ Haz clic en el botón "<strong>Seleccionar origen</strong>" y luego en el mapa para marcar el punto de partida<br/>
          2️⃣ Haz clic en el botón "<strong>Seleccionar destino</strong>" y luego en el mapa para marcar hacia dónde quieres ir<br/>
          3️⃣ También puedes usar el botón "<strong>Usar mi ubicación actual</strong>" o buscar una dirección específica
        </p>
      </div>
      <RideRequestMain />
    </div>
  );
};

export default RideRequestContent;
