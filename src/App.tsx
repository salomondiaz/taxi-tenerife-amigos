
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/context/AppContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import RideRequest from "@/pages/RideRequest";
import RideTracking from "@/pages/RideTracking";
import PaymentOptions from "@/pages/PaymentOptions";
import DriverProfile from "@/pages/DriverProfile";
import Profile from "@/pages/Profile";
import RateDriver from "@/pages/RateDriver";
import TravelHistory from "@/pages/TravelHistory";
import FareSettings from "@/pages/FareSettings";
import UserRegistration from "@/pages/UserRegistration";
import DriverRegistration from "@/pages/DriverRegistration";

// Components
import { Toaster } from "@/components/ui/toaster";
import StripePaymentProvider from "@/components/payment/StripePaymentProvider";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <StripePaymentProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/request-ride" element={<RideRequest />} />
            <Route path="/ride-tracking" element={<RideTracking />} />
            <Route path="/payment-options" element={<PaymentOptions />} />
            <Route path="/driver/:id" element={<DriverProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rate-driver/:id" element={<RateDriver />} />
            <Route path="/travel-history" element={<TravelHistory />} />
            <Route path="/fare-settings" element={<FareSettings />} />
            <Route path="/user-registration" element={<UserRegistration />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </StripePaymentProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
