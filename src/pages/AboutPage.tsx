
import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Acerca de Nosotros</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            Bienvenido a nuestro servicio de taxis en Tenerife. Nos dedicamos a proporcionar un servicio
            de transporte seguro, confiable y eficiente para residentes y visitantes de nuestra hermosa isla.
          </p>
          <p className="mb-4">
            Nuestra misión es ofrecer un servicio de máxima calidad, con conductores profesionales,
            vehículos bien mantenidos y una experiencia de usuario excepcional.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Nuestra Historia</h2>
          <p className="mb-4">
            Fundada en 2020, nuestra empresa ha crecido para convertirse en uno de los servicios
            de taxi más confiables en toda la isla de Tenerife.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Nuestros Valores</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>Confiabilidad</li>
            <li>Profesionalismo</li>
            <li>Seguridad</li>
            <li>Excelencia en el servicio</li>
            <li>Responsabilidad medioambiental</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
