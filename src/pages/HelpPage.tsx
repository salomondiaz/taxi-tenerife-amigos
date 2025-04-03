
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Encuentra respuestas a las preguntas más comunes sobre nuestro servicio de taxi.
            Si no encuentras lo que buscas, no dudes en contactarnos.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Cómo solicito un taxi?</AccordionTrigger>
            <AccordionContent>
              Puedes solicitar un taxi a través de nuestra aplicación móvil, 
              llamando a nuestro número de teléfono central o reservando en nuestra página web.
              El proceso es rápido y sencillo.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cuánto cuesta un viaje?</AccordionTrigger>
            <AccordionContent>
              El costo del viaje depende de la distancia y el tiempo de viaje. 
              Puedes obtener un presupuesto aproximado antes de confirmar tu viaje 
              usando la calculadora de tarifas en nuestra aplicación.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>¿Cómo puedo pagar mi viaje?</AccordionTrigger>
            <AccordionContent>
              Aceptamos pagos en efectivo, tarjetas de crédito/débito y pago a través 
              de la aplicación. También ofrecemos facturación para clientes corporativos.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>¿Puedo programar un viaje con anticipación?</AccordionTrigger>
            <AccordionContent>
              Sí, puedes programar viajes con hasta 7 días de anticipación. 
              Esta función es ideal para traslados al aeropuerto, citas médicas 
              u otros compromisos importantes donde la puntualidad es esencial.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>¿Qué hago si olvidé algo en el taxi?</AccordionTrigger>
            <AccordionContent>
              Si olvidaste algo en uno de nuestros taxis, contacta inmediatamente 
              con nuestro servicio de atención al cliente proporcionando detalles 
              del viaje. Haremos todo lo posible por localizar tus pertenencias.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger>¿Ofrecen servicio de taxi para mascotas?</AccordionTrigger>
            <AccordionContent>
              Sí, muchos de nuestros conductores aceptan mascotas. Al solicitar 
              el taxi, marca la opción "viajo con mascota" para que te asignemos 
              un vehículo adecuado. Algunas restricciones pueden aplicar para 
              animales de gran tamaño.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-10 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">¿Necesitas más ayuda?</h2>
          <p className="mb-4">
            Nuestro equipo de atención al cliente está disponible 24/7 para asistirte.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>Contactar soporte</Button>
            <Button variant="outline">Ver tutoriales</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
