import { getDb } from './client';
import { initializeSchema } from './schema';
import type { Room, Booking } from '../types';

// Initialize schema when the module is imported
initializeSchema().catch(console.error);

// Room operations
export async function getRooms(): Promise<Room[]> {
  try {
    const worker = await getDb();
    const result = await worker.db.exec('SELECT * FROM rooms');
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      capacity: row[2],
      location: row[3],
      description: row[4],
      image: row[5],
      amenities: JSON.parse(row[6])
    }));
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  try {
    const worker = await getDb();
    const id = `room-${Date.now()}`;
    
    await worker.db.exec({
      sql: `INSERT INTO rooms (id, name, capacity, location, description, image, amenities)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      bind: [
        id,
        room.name,
        room.capacity,
        room.location,
        room.description,
        room.image,
        JSON.stringify(room.amenities)
      ]
    });
    
    return {
      id,
      ...room
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create room');
  }
}

export async function updateRoom(id: string, updates: Partial<Room>): Promise<boolean> {
  try {
    const worker = await getDb();
    const sets: string[] = [];
    const values: any[] = [];

    if (updates.name) {
      sets.push('name = ?');
      values.push(updates.name);
    }
    if (updates.capacity) {
      sets.push('capacity = ?');
      values.push(updates.capacity);
    }
    if (updates.location) {
      sets.push('location = ?');
      values.push(updates.location);
    }
    if (updates.description) {
      sets.push('description = ?');
      values.push(updates.description);
    }
    if (updates.image) {
      sets.push('image = ?');
      values.push(updates.image);
    }
    if (updates.amenities) {
      sets.push('amenities = ?');
      values.push(JSON.stringify(updates.amenities));
    }

    if (sets.length === 0) return false;

    values.push(id);
    await worker.db.exec({
      sql: `UPDATE rooms SET ${sets.join(', ')} WHERE id = ?`,
      bind: values
    });

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const worker = await getDb();
    await worker.db.exec({
      sql: 'DELETE FROM rooms WHERE id = ?',
      bind: [id]
    });
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

// Reservation operations
export async function getReservations(): Promise<Booking[]> {
  try {
    const worker = await getDb();
    const result = await worker.db.exec('SELECT * FROM reservations');
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      roomId: row[1],
      userId: row[2],
      startDate: new Date(row[3]),
      endDate: new Date(row[4])
    }));
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function createReservation(booking: Omit<Booking, 'id'>): Promise<Booking> {
  try {
    const worker = await getDb();
    const id = `booking-${Date.now()}`;
    
    await worker.db.exec({
      sql: `INSERT INTO reservations (id, room_id, user_id, start_date, end_date)
            VALUES (?, ?, ?, ?, ?)`,
      bind: [
        id,
        booking.roomId,
        booking.userId,
        booking.startDate.toISOString(),
        booking.endDate.toISOString()
      ]
    });
    
    return {
      id,
      ...booking
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to create reservation');
  }
}

export async function deleteReservation(id: string): Promise<boolean> {
  try {
    const worker = await getDb();
    await worker.db.exec({
      sql: 'DELETE FROM reservations WHERE id = ?',
      bind: [id]
    });
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}

export async function isTimeSlotAvailable(
  roomId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  try {
    const worker = await getDb();
    const result = await worker.db.exec({
      sql: `SELECT COUNT(*) as count FROM reservations
            WHERE room_id = ?
            AND ((start_date <= ? AND end_date > ?)
            OR (start_date < ? AND end_date >= ?)
            OR (start_date >= ? AND end_date <= ?))`,
      bind: [
        roomId,
        endDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString(),
        startDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString()
      ]
    });
    
    return result[0].values[0][0] === 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
}