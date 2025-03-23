
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import RideRequest from "./pages/RideRequest";
import RideTracking from "./pages/RideTracking";
import NotFound from "./pages/NotFound";
import TravelHistory from "./pages/TravelHistory";
import PaymentOptions from "./pages/PaymentOptions";
import DriverProfile from "./pages/DriverProfile";
import RateDriver from "./pages/RateDriver";
import UserRegistration from "./pages/UserRegistration";
import DriverRegistration from "./pages/DriverRegistration";
import FareSettings from "./pages/FareSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-registration" element={<UserRegistration />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/request-ride" element={<RideRequest />} />
            <Route path="/tracking" element={<RideTracking />} />
            <Route path="/travel-history" element={<TravelHistory />} />
            <Route path="/payment-options" element={<PaymentOptions />} />
            <Route path="/driver/:driverId" element={<DriverProfile />} />
            <Route path="/rate-driver/:tripId" element={<RateDriver />} />
            <Route path="/fare-settings" element={<FareSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
