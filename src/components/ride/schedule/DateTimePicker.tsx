
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface DateTimePickerProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedHour: string;
  setSelectedHour: (hour: string) => void;
  selectedMinute: string;
  setSelectedMinute: (minute: string) => void;
  onScheduleSelect: () => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  onScheduleSelect
}) => {
  return (
    <div className="space-y-4 border-t border-gray-200 pt-3">
      <div>
        <label className="text-sm text-gray-500 block mb-1">Selecciona fecha y hora:</label>
        <div className="flex flex-col space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : "Selecciona una fecha"}
                <Calendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex space-x-2">
            <Select value={selectedHour} onValueChange={setSelectedHour}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Hora</SelectLabel>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <span className="flex items-center">:</span>
            
            <Select value={selectedMinute} onValueChange={setSelectedMinute}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Minutos</SelectLabel>
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((min) => (
                    <SelectItem key={min} value={min}>
                      {min}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onScheduleSelect} 
        disabled={!selectedDate} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <Clock className="mr-2 h-4 w-4" />
        Programar viaje
      </Button>
    </div>
  );
};

export default DateTimePicker;
