
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Home, MapPin, Settings as SettingsIcon, User } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Ajustes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Perfil
              </CardTitle>
              <CardDescription>Administra tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/perfil">
                  <Button variant="outline" className="w-full justify-start">
                    Editar perfil
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Cambiar contraseña
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                Ubicación
              </CardTitle>
              <CardDescription>Configura tus ubicaciones favoritas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/ajustes/casa">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4 text-green-600" />
                    Configurar Mi Casa
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Otras ubicaciones favoritas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                Notificaciones
              </CardTitle>
              <CardDescription>Administra tus preferencias de notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Preferencias de notificación
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About and Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5 text-purple-600" />
                Acerca de
              </CardTitle>
              <CardDescription>Información sobre la aplicación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Términos y condiciones
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Política de privacidad
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
