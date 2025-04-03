
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const HelpPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Centro de Ayuda</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">¿Cómo solicito un taxi?</h3>
                <p className="text-gray-700">
                  Para solicitar un taxi, simplemente ingresa a la sección "Solicitar" en el menú principal. 
                  Allí podrás seleccionar tu punto de origen y destino, ya sea escribiendo la dirección o 
                  marcando los puntos en el mapa.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">¿Cómo puedo pagar mi viaje?</h3>
                <p className="text-gray-700">
                  Aceptamos pagos en efectivo directamente al conductor o puedes registrar una tarjeta de crédito/débito 
                  en la aplicación para pagar electrónicamente. También puedes agregar saldo a tu cuenta para pagos rápidos.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">¿Puedo programar un viaje para más tarde?</h3>
                <p className="text-gray-700">
                  Sí, puedes programar un viaje con hasta 7 días de anticipación. Al solicitar un taxi, 
                  selecciona la opción "Programar viaje" y elige la fecha y hora deseada.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">
                Si no encuentras respuesta a tu pregunta, puedes contactarnos directamente:
              </p>
              
              <div className="space-y-2 mb-6">
                <p><strong>Teléfono:</strong> +34 922 123 456</p>
                <p><strong>Email:</strong> ayuda@taxitenerife.com</p>
                <p><strong>Horario de atención:</strong> Lunes a Domingo, 8:00 - 20:00</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default">
                  Llamar ahora
                </Button>
                <Button variant="outline">
                  Enviar correo electrónico
                </Button>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tutoriales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">Cómo solicitar un taxi</h3>
                <p className="text-gray-700 mb-4">
                  Aprende a solicitar un taxi de forma rápida y sencilla utilizando nuestra aplicación.
                </p>
                <Button variant="link" className="px-0">Ver tutorial</Button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">Cómo programar un viaje</h3>
                <p className="text-gray-700 mb-4">
                  Paso a paso para programar un viaje con anticipación y asegurar tu taxi cuando lo necesites.
                </p>
                <Button variant="link" className="px-0">Ver tutorial</Button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">Cómo configurar tu perfil</h3>
                <p className="text-gray-700 mb-4">
                  Aprende a configurar tus preferencias, guardar ubicaciones favoritas y gestionar tus métodos de pago.
                </p>
                <Button variant="link" className="px-0">Ver tutorial</Button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-2">Preguntas sobre facturación</h3>
                <p className="text-gray-700 mb-4">
                  Todo lo que necesitas saber sobre pagos, recibos y cómo solicitar facturas para tus viajes.
                </p>
                <Button variant="link" className="px-0">Ver tutorial</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
