import React from "react";
import { cn } from "@/lib/utils";

interface CalendarEventProps {
  title: string;
  onClick: () => void;
  color?: string;
  className?: string;
}

const CalendarEvent = ({ 
  title, 
  onClick, 
  color = "bg-primary-100 text-primary-700", 
  className 
}: CalendarEventProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left px-2 py-1 rounded-md text-xs font-medium truncate w-full",
        color,
        className
      )}
    >
      {title}
    </button>
  );
};

export default CalendarEvent;
