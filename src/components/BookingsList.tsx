import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Booking } from '../types';

interface BookingsListProps {
  bookings: (Booking & { room: { id: string; name: string; location: string } })[];
  onCancel: (bookingId: string, roomId: string) => void;
}

export default function BookingsList({ bookings, onCancel }: BookingsListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-2 text-sm text-gray-500">Start by booking a room from the main page.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.room.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.room.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(booking.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {getDuration(booking.startTime, booking.endTime)}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onCancel(booking.id, booking.room.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}