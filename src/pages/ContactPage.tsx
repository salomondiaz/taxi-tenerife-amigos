
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contáctanos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
                <Input id="name" placeholder="Tu nombre" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono</label>
                <Input id="phone" placeholder="Tu número de teléfono" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Mensaje</label>
                <Textarea id="message" rows={5} placeholder="¿En qué podemos ayudarte?" />
              </div>
              
              <Button type="submit" className="w-full">Enviar mensaje</Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Información de contacto</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Dirección:</p>
                <p className="text-gray-600">Calle Principal 123, Puerto de la Cruz, Tenerife</p>
              </div>
              
              <div>
                <p className="font-medium">Teléfono:</p>
                <p className="text-gray-600">+34 922 123 456</p>
              </div>
              
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-gray-600">info@taxitenerife.com</p>
              </div>
              
              <div>
                <p className="font-medium">Horario de atención:</p>
                <p className="text-gray-600">Lunes a Domingo, 24 horas</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Síguenos</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon">FB</Button>
                <Button variant="outline" size="icon">TW</Button>
                <Button variant="outline" size="icon">IG</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
