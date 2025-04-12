
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange }) => {
  // Generate times from 00:00 to 23:59 in 30 minute intervals
  const times = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <ScrollArea className="h-72 w-48">
      <div className="grid grid-cols-1 gap-1 p-2">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => onChange(time)}
            className={`px-3 py-2 rounded text-left ${
              value === time 
                ? "bg-tenerife-blue text-white" 
                : "hover:bg-gray-100"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
