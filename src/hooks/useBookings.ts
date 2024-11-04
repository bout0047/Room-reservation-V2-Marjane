import { useState, useEffect, useMemo } from 'react';
import type { CalendarEvent, Booking } from '../types';
import { getReservations, addReservation, deleteReservation } from '../db/database';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const loadedBookings = await getReservations();
      setBookings(loadedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const userBookings = useMemo(() => {
    return bookings.filter(booking => booking.userId === 'current-user');
  }, [bookings]);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
    return bookings.map((booking, index) => ({
      id: booking.id,
      title: `${booking.room.name} - ${booking.userId === 'current-user' ? 'My Booking' : 'Booked'}`,
      start: booking.startDate,
      end: booking.endDate,
      roomId: booking.roomId,
      color: colors[index % colors.length]
    }));
  }, [bookings]);

  const cancelBooking = async (bookingId: string) => {
    try {
      await deleteReservation(bookingId);
      await loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const addBooking = async (roomId: string, startDate: Date, endDate: Date) => {
    try {
      await addReservation({
        roomId,
        userId: 'current-user',
        startDate,
        endDate
      });
      await loadBookings();
      return true;
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  };

  return {
    userBookings,
    calendarEvents,
    cancelBooking,
    addBooking
  };
}