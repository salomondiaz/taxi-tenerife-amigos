
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import router from "./routes";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "@/pages/Error";
import HomePage from "@/pages/Home";
import RideRequest from "@/pages/RideRequest";
import ProfilePage from "@/pages/Profile";
import SettingsPage from "@/pages/Settings";
import NotificationsPage from "@/pages/Notifications";
import RideHistoryPage from "@/pages/RideHistory";
import ActiveRidePage from "@/pages/ActiveRide";
import HomeLocationSettings from "@/pages/HomeLocationSettings";
import NotFound from "@/pages/NotFound";

import "@/global.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
            <Route path="/solicitar" element={<RideRequest />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/ajustes" element={<SettingsPage />} />
            <Route path="/notificaciones" element={<NotificationsPage />} />
            <Route path="/historial" element={<RideHistoryPage />} />
            <Route path="/viaje/:id" element={<ActiveRidePage />} />
            <Route path="/ajustes/casa" element={<HomeLocationSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
