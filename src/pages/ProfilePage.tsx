
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+34 612 345 678",
    profilePicture: "",
    memberSince: "Enero 2023",
    trips: 15,
    savedLocations: 3
  };

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-start gap-8">
          {/* Profile Summary Card */}
          <Card className="w-full lg:w-80">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <div className="text-sm text-gray-500">Miembro desde {user.memberSince}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Correo electrónico</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
                <div className="flex justify-between text-center pt-2">
                  <div>
                    <p className="font-bold">{user.trips}</p>
                    <p className="text-xs text-gray-500">Viajes</p>
                  </div>
                  <div>
                    <p className="font-bold">{user.savedLocations}</p>
                    <p className="text-xs text-gray-500">Ubicaciones</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate("/settings")}
                >
                  Editar perfil
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="activities">
              <TabsList className="mb-6">
                <TabsTrigger value="activities">Actividad reciente</TabsTrigger>
                <TabsTrigger value="favorites">Ubicaciones favoritas</TabsTrigger>
                <TabsTrigger value="payments">Métodos de pago</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activities" className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Aeropuerto Sur → Puerto de la Cruz</h3>
                        <p className="text-sm text-gray-500">15 mar 2023 · 45,30 €</p>
                      </div>
                      <Button variant="outline" size="sm">Ver detalles</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Mi Casa → Hospital Universitario</h3>
                        <p className="text-sm text-gray-500">10 mar 2023 · 12,50 €</p>
                      </div>
                      <Button variant="outline" size="sm">Ver detalles</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="link" className="px-0">Ver todos los viajes →</Button>
              </TabsContent>
              
              <TabsContent value="favorites">
                <h2 className="text-xl font-semibold mb-4">Ubicaciones favoritas</h2>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded">🏠</div>
                      <div>
                        <h3 className="font-medium">Mi Casa</h3>
                        <p className="text-sm text-gray-500">Calle Principal 123, Puerto de la Cruz</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-800 p-2 rounded">🏢</div>
                      <div>
                        <h3 className="font-medium">Trabajo</h3>
                        <p className="text-sm text-gray-500">Av. Comercial 456, Santa Cruz</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => navigate("/settings/home-location")}
                >
                  Administrar ubicaciones
                </Button>
              </TabsContent>
              
              <TabsContent value="payments">
                <h2 className="text-xl font-semibold mb-4">Métodos de pago</h2>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded">💳</div>
                        <div>
                          <h3 className="font-medium">Visa terminada en 4321</h3>
                          <p className="text-sm text-gray-500">Expira 05/25</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">Predeterminada</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded">💰</div>
                        <div>
                          <h3 className="font-medium">Efectivo</h3>
                          <p className="text-sm text-gray-500">Pago al conductor</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button variant="outline" className="mt-2">
                  Añadir método de pago
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
