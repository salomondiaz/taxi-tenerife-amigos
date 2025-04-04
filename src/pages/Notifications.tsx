
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, Clock } from "lucide-react";

const NotificationsPage = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "system",
      title: "Bienvenido a la app",
      message: "Gracias por registrarte en nuestra plataforma de taxis.",
      date: new Date(),
      read: false,
    },
    {
      id: 2,
      type: "ride",
      title: "Viaje completado",
      message: "Tu último viaje ha sido completado con éxito.",
      date: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
    },
    {
      id: 3,
      type: "promotion",
      title: "Oferta especial",
      message: "Obtén un 10% de descuento en tu próximo viaje.",
      date: new Date(Date.now() - 172800000), // 2 days ago
      read: false,
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Bell className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Notificaciones</h1>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{notification.title}</span>
                    {notification.read && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDate(notification.date)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No tienes notificaciones</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
