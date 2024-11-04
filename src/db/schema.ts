import { getDb } from './client';

export async function initializeSchema() {
  try {
    const worker = await getDb();
    
    // Create rooms table
    await worker.db.exec(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        image TEXT,
        amenities TEXT
      )
    `);

    // Create reservations table
    await worker.db.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        room_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `);

    // Check if rooms table is empty
    const result = await worker.db.exec(
      'SELECT COUNT(*) as count FROM rooms'
    );
    
    if (result[0].values[0][0] === 0) {
      // Insert initial data
      await worker.db.exec(`
        INSERT INTO rooms (id, name, capacity, location, description, image, amenities)
        VALUES 
        (
          'room-1',
          'Executive Boardroom',
          20,
          'Floor 1',
          'Luxurious Modern Space',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
          '["Projector", "Video Conference", "Whiteboard"]'
        ),
        (
          'room-2',
          'Creative Space',
          8,
          'Floor 2',
          'Informal Brainstorming Room',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          '["Whiteboard", "Smart TV", "Standing Desks"]'
        ),
        (
          'room-3',
          'Training Room',
          30,
          'Ground Floor',
          'Large Training Space',
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
          '["Dual Projectors", "Sound System", "Training PCs"]'
        )
      `);
    }

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}