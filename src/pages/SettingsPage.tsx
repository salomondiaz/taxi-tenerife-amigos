import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Bell, CreditCard, User, Settings, Mail } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>

        <div className="grid gap-6">
          {/* Home location settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-blue-600" />
                Ubicación de Casa
              </CardTitle>
              <CardDescription>
                Configura tu ubicación de casa para acceder rápidamente durante los viajes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/settings/home-location">Configurar ubicación de casa</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Other settings (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-blue-600" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Gestiona tus preferencias de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Configurar notificaciones</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Métodos de pago
              </CardTitle>
              <CardDescription>
                Gestiona tus tarjetas y métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Gestionar métodos de pago</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Datos personales
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Editar datos personales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
