
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Bell } from "lucide-react";

const NotificationsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Bell className="mr-2" /> Notificaciones
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-center py-8">
            No tienes notificaciones nuevas.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
