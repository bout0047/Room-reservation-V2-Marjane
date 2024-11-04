import React from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingsList from '../components/BookingsList';

export default function MyBookings() {
  const { userBookings, cancelBooking } = useBookings();

  const handleCancelBooking = (bookingId: string, roomId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId, roomId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Bookings</h1>
      <BookingsList
        bookings={userBookings}
        onCancel={handleCancelBooking}
      />
    </div>
  );
}