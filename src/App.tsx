
import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppProvider } from "@/context/AppContext";
import { MapProvider } from "@/context/MapContext";
import { Toaster } from "@/components/ui/toaster";

import routes from "./routes";

import "@/global.css";

// Router component that uses the routes configuration
const AppRoutes = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AppProvider>
        <MapProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </MapProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
