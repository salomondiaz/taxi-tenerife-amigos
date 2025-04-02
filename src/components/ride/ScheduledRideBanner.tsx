
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ScheduledRideBannerProps {
  scheduledTime?: string;
}

const ScheduledRideBanner: React.FC<ScheduledRideBannerProps> = ({ scheduledTime }) => {
  if (!scheduledTime) return null;
  
  const formatScheduledTime = () => {
    try {
      const date = new Date(scheduledTime);
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return scheduledTime;
    }
  };
  
  return (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-center space-x-3">
      <Calendar className="h-6 w-6 text-amber-600" />
      <div>
        <h3 className="font-medium text-amber-800">Viaje programado</h3>
        <p className="text-amber-700 text-sm">Para: {formatScheduledTime()}</p>
      </div>
    </div>
  );
};

export default ScheduledRideBanner;
