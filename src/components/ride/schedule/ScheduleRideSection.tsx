
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import DateTimePicker from "./DateTimePicker";

interface ScheduleRideSectionProps {
  scheduledTime?: string;
  onScheduleRide: (date: Date) => void;
}

const ScheduleRideSection: React.FC<ScheduleRideSectionProps> = ({ 
  scheduledTime,
  onScheduleRide 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  
  // Handle scheduling a ride
  const handleScheduleSelect = () => {
    if (!selectedDate) return;
    
    const hour = parseInt(selectedHour);
    const minute = parseInt(selectedMinute);
    
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hour, minute);
    
    onScheduleRide(scheduledDate);
    setShowDatePicker(false);
  };

  return (
    <div className="border border-gray-200 rounded-md p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-purple-600" />
          <span className="font-medium">Programar viaje</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="text-xs h-8"
        >
          {showDatePicker ? "Cancelar" : "Programar"}
        </Button>
      </div>

      {showDatePicker && (
        <DateTimePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          onScheduleSelect={handleScheduleSelect}
        />
      )}

      {scheduledTime && (
        <div className="mt-2 bg-purple-50 p-2 rounded-md">
          <p className="text-sm font-medium flex items-center">
            <CalendarDays className="h-4 w-4 mr-1 text-purple-600" />
            <span>Viaje programado para:</span>
          </p>
          <p className="text-purple-700 font-medium mt-1">{scheduledTime}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleRideSection;
