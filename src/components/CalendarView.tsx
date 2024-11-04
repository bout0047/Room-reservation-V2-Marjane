import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventCreate: (start: Date, end: Date) => void;
  businessHours: { start: number; end: number };
}

export default function CalendarView({ events, onEventCreate, businessHours }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ hour: number; day: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ hour: number; day: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const hoursInDay = businessHours.end - businessHours.start;
  const daysInWeek = 7;
  
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = Array.from({ length: daysInWeek }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const hours = Array.from(
    { length: hoursInDay }, 
    (_, i) => i + businessHours.start
  );

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatHour = (hour: number) => {
    return new Date(0, 0, 0, hour).toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  };

  const getEventStyle = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Adjust to business hours
    const startHour = Math.max(eventStart.getHours(), businessHours.start);
    const endHour = Math.min(eventEnd.getHours(), businessHours.end);
    
    const startDay = eventStart.getDay();
    const endDay = eventEnd.getDay();
    
    // Calculate grid positions
    const gridStart = startHour - businessHours.start + 1;
    const gridEnd = endHour - businessHours.start + 1;
    
    return {
      gridColumn: `${startDay + 2} / span ${endDay - startDay + 1}`,
      gridRow: `${gridStart} / ${gridEnd + 1}`,
      backgroundColor: event.color,
      margin: '0 1px',
    };
  };

  const handleMouseDown = (hour: number, day: number) => {
    if (hour >= businessHours.start && hour < businessHours.end) {
      setIsDragging(true);
      setDragStart({ hour, day });
      setDragEnd({ hour, day });
    }
  };

  const handleMouseMove = (hour: number, day: number) => {
    if (isDragging && dragStart) {
      setDragEnd({ hour, day });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startDay = Math.min(dragStart.day, dragEnd.day);
      const endDay = Math.max(dragStart.day, dragEnd.day);
      const startHour = Math.max(
        Math.min(dragStart.hour, dragEnd.hour),
        businessHours.start
      );
      const endHour = Math.min(
        Math.max(dragStart.hour, dragEnd.hour) + 1,
        businessHours.end
      );

      if (startHour >= endHour) return;

      const startDate = new Date(weekDays[startDay]);
      startDate.setHours(startHour, 0, 0, 0);
      
      const endDate = new Date(weekDays[endDay]);
      endDate.setHours(endHour, 0, 0, 0);

      if (startDate >= endDate) return;
      
      onEventCreate(startDate, endDate);
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd]);

  const getDragSelectionStyle = () => {
    if (!dragStart || !dragEnd) return null;

    const startDay = Math.min(dragStart.day, dragEnd.day);
    const endDay = Math.max(dragStart.day, dragEnd.day);
    const startHourIndex = Math.max(
      Math.min(dragStart.hour, dragEnd.hour) - businessHours.start + 1,
      1
    );
    const endHourIndex = Math.min(
      Math.max(dragStart.hour, dragEnd.hour) - businessHours.start + 2,
      hoursInDay + 1
    );

    return {
      gridColumn: `${startDay + 2} / span ${endDay - startDay + 1}`,
      gridRow: `${startHourIndex} / ${endHourIndex}`,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      border: '2px dashed #3b82f6',
    };
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {formatDay(weekDays[0])} - {formatDay(weekDays[6])}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
            <div className="p-4"></div>
            {weekDays.map((day, i) => (
              <div
                key={i}
                className="p-4 text-center font-medium text-gray-900"
              >
                {formatDay(day)}
              </div>
            ))}
          </div>

          <div 
            ref={gridRef}
            className="grid grid-cols-[100px_repeat(7,1fr)] relative"
            onMouseLeave={handleMouseUp}
          >
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-r border-b p-2 text-sm text-gray-500">
                  {formatHour(hour)}
                </div>
                {Array.from({ length: daysInWeek }).map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border-r border-b h-16 relative cursor-pointer hover:bg-gray-50"
                    onMouseDown={() => handleMouseDown(hour, dayIndex)}
                    onMouseMove={() => handleMouseMove(hour, dayIndex)}
                  />
                ))}
              </React.Fragment>
            ))}

            {events.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                style={getEventStyle(event)}
                className="absolute mx-1 p-2 rounded text-white text-sm overflow-hidden"
              >
                {event.title}
              </div>
            ))}

            {isDragging && dragStart && dragEnd && (
              <div
                className="absolute mx-1 rounded pointer-events-none"
                style={getDragSelectionStyle() || undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}