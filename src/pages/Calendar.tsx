import React, { useCallback, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useRooms } from '../hooks/useRooms';
import CalendarView from '../components/CalendarView';
import RoomSelectionModal from '../components/RoomSelectionModal';

export default function Calendar() {
  const { calendarEvents } = useBookings();
  const { rooms, bookRoom, businessHours } = useRooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleEventCreate = useCallback((start: Date, end: Date) => {
    setSelectedTimes({ start, end });
    setIsModalOpen(true);
  }, []);

  const handleRoomSelect = (roomId: string) => {
    if (!selectedTimes) return;

    const success = bookRoom(roomId, selectedTimes.start, selectedTimes.end);
    if (!success) {
      alert('This time slot is not available or outside business hours (9 AM - 5 PM)');
    } else {
      setIsModalOpen(false);
      setSelectedTimes(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Calendar</h1>
      <CalendarView 
        events={calendarEvents} 
        onEventCreate={handleEventCreate}
        businessHours={businessHours}
      />
      <RoomSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTimes(null);
        }}
        onSelect={handleRoomSelect}
        rooms={rooms}
        startTime={selectedTimes?.start ?? new Date()}
        endTime={selectedTimes?.end ?? new Date()}
      />
    </div>
  );
}