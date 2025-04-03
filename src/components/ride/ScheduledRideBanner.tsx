
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ScheduledRideBannerProps {
  scheduledTime?: string;
}

const ScheduledRideBanner: React.FC<ScheduledRideBannerProps> = ({ scheduledTime }) => {
  if (!scheduledTime) return null;
  
  // No need to parse the date since we already have a formatted string
  return (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-center space-x-3">
      <Calendar className="h-6 w-6 text-amber-600" />
      <div>
        <h3 className="font-medium text-amber-800">Viaje programado</h3>
        <p className="text-amber-700 text-sm">Para: {scheduledTime}</p>
      </div>
    </div>
  );
};

export default ScheduledRideBanner;
