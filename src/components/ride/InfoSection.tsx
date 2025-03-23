
import React from "react";

const InfoSection: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <p className="text-sm text-gray-600 text-center">
        El precio final puede variar según el tráfico y la ruta exacta tomada por el conductor.
      </p>
      
      <div className="mt-3 text-sm text-gray-700 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
        <p className="font-medium mb-1">Sugerencias para mejorar la precisión:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Incluye "Tenerife" en la dirección (por ejemplo: "Plaza del Charco, Puerto de la Cruz, Tenerife")</li>
          <li>Usa nombres oficiales para lugares y calles</li>
          <li>Si tienes problemas, utiliza la función "Seleccionar en mapa"</li>
          <li>Puedes arrastrar los marcadores para ajustar las ubicaciones</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoSection;
