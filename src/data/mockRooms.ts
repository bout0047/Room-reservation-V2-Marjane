import { Room } from '../types';

export const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Executive Boardroom',
    location: 'Floor 1',
    capacity: 20,
    description: 'Luxurious Modern Space',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    amenities: ['Projector', 'Video Conference', 'Whiteboard']
  },
  {
    id: '2',
    name: 'Creative Space',
    location: 'Floor 2',
    capacity: 8,
    description: 'Informal Brainstorming Room',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    amenities: ['Whiteboard', 'Smart TV', 'Standing Desks']
  }
];