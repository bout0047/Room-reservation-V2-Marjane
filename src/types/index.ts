export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  image: string;
  description: string;
  bookings?: Booking[];
}

export interface SearchFiltersState {
  search: string;
  location: string;
  capacity: string;
  duration: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  room?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomId: string;
  color: string;
}