import React, { useState } from 'react';
import { Room } from '../types';
import { Users, MapPin, Calendar, Clock, X } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBook: (roomId: string, startDate: Date, endDate: Date) => Promise<boolean>;
}

export default function RoomCard({ room, onBook }: RoomCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  const handleBook = async () => {
    setError('');
    
    if (!bookingDate) {
      setError('Please select a date');
      return;
    }

    const selectedDate = new Date(bookingDate);
    if (isNaN(selectedDate.getTime())) {
      setError('Invalid date selected');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Cannot book dates in the past');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    // Create start date
    const startDate = new Date(bookingDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    // Create end date
    const endDate = new Date(bookingDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    const success = await onBook(room.id, startDate, endDate);
    if (success) {
      setIsBooking(false);
      setBookingDate('');
      setStartTime('09:00');
      setEndTime('10:00');
    } else {
      setError('This time slot is not available');
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
      <img 
        src={room.image} 
        alt={room.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{room.name}</h3>
          <p className="text-gray-600 text-sm">{room.description}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>{room.location}</span>
          </div>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {room.amenities.map((amenity, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          {!isBooking ? (
            <button
              onClick={() => setIsBooking(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Book Room
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Book Room</h4>
                <button
                  onClick={() => setIsBooking(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={16} className="inline mr-1" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={16} className="inline mr-1" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setIsBooking(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}