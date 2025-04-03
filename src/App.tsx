
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import RideRequest from "@/pages/RideRequest";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import HelpPage from "@/pages/HelpPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import HomeLocationSettings from "@/pages/HomeLocationSettings"; // Add import

import "@/global.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AppContextProvider>
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ride" element={<RideRequest />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/home-location" element={<HomeLocationSettings />} /> 
          </Routes>
        </main>
        <Toaster />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
