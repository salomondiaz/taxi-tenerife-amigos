
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useFavoriteLocations } from "@/hooks/useFavoriteLocations";

// Import our new components
import UserGreeting from "@/components/home/UserGreeting";
import HomeLocationSection from "@/components/home/HomeLocationSection";
import QuickRideRequest from "@/components/home/QuickRideRequest";
import RecentRides from "@/components/home/RecentRides";

const Home = () => {
  const navigate = useNavigate();
  const { user, testMode } = useAppContext();
  const [recentRides, setRecentRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getLocationByType } = useFavoriteLocations();
  const [homeLocation, setHomeLocation] = useState<any>(null);

  useEffect(() => {
    // Check if home location exists
    const home = getLocationByType('home');
    if (home) {
      setHomeLocation(home);
    }
    
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (testMode) {
        setRecentRides([
          {
            id: "ride-1",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            origin: "Plaza del Charco, Puerto de la Cruz",
            destination: "Loro Parque, Puerto de la Cruz",
            price: 5.75,
            distance: 2.3,
            duration: 8,
            rating: 5,
            driver: {
              name: "Carlos M.",
              rating: 4.8,
              vehicle: "Toyota Prius",
              licensePlate: "1234-ABC",
            },
          },
          {
            id: "ride-2",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            origin: "Hotel Botánico, Puerto de la Cruz",
            destination: "Playa Jardín, Puerto de la Cruz",
            price: 4.50,
            distance: 1.8,
            duration: 6,
            rating: 4,
            driver: {
              name: "Ana L.",
              rating: 4.9,
              vehicle: "Hyundai Ioniq",
              licensePlate: "5678-DEF",
            },
          },
          {
            id: "ride-3",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            origin: "La Orotava Centro",
            destination: "Puerto de la Cruz",
            price: 8.25,
            distance: 4.5,
            duration: 12,
            rating: 5,
            driver: {
              name: "Miguel R.",
              rating: 4.7,
              vehicle: "Dacia Lodgy",
              licensePlate: "9012-GHI",
            },
          },
        ]);
      } else {
        setRecentRides([]);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [testMode, getLocationByType]);

  const handleRequestRide = () => {
    navigate("/request-ride");
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen pb-16">
        <div className="bg-tenerife-blue text-white px-6 pt-12 pb-6 rounded-b-3xl shadow-md">
          <UserGreeting user={user} />
          
          <Button 
            onClick={handleRequestRide}
            variant="default" 
            className="w-full bg-white text-tenerife-blue hover:bg-gray-100 transition-colors shadow-lg"
          >
            <MapPin size={20} className="mr-2" />
            Solicitar un taxi
          </Button>
        </div>
        
        <div className="px-6 py-8">
          {/* Home location section */}
          <HomeLocationSection homeLocation={homeLocation} />
          
          {/* Quick ride request section */}
          <QuickRideRequest />

          {/* Recent rides section */}
          <RecentRides 
            recentRides={recentRides} 
            loading={loading} 
            handleRequestRide={handleRequestRide} 
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
