
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";
import router from "./routes";

import "@/global.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
