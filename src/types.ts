export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  image: string;
  amenities?: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
}