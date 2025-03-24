
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RequestHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/home")}
        className="text-tenerife-blue flex items-center mb-6"
        aria-label="Volver a la página de inicio"
      >
        <ArrowLeft size={20} className="mr-1" />
        <span>Volver</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Solicitar un taxi</h1>
    </>
  );
};

export default RequestHeader;
