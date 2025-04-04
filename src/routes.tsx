
import { createBrowserRouter, RouteObject } from "react-router-dom";
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

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/solicitar",
    element: <RideRequest />,
  },
  {
    path: "/perfil",
    element: <ProfilePage />,
  },
  {
    path: "/ajustes",
    element: <SettingsPage />,
  },
  {
    path: "/notificaciones",
    element: <NotificationsPage />,
  },
  {
    path: "/historial",
    element: <RideHistoryPage />,
  },
  {
    path: "/viaje/:id",
    element: <ActiveRidePage />,
  },
  {
    path: "/ajustes/casa",
    element: <HomeLocationSettings />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

const router = createBrowserRouter(routes);

export default router;
