import { createClient } from '@libsql/client';

async function setupDatabase() {
  const db = createClient({
    url: 'file:local.db',
  });

  try {
    // Create rooms table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        image TEXT,
        amenities TEXT
      )
    `);

    // Create reservations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms (id)
      )
    `);

    // Insert some initial rooms if the table is empty
    const roomsCount = await db.execute('SELECT COUNT(*) as count FROM rooms');
    if (roomsCount.rows[0].count === 0) {
      await db.execute(`
        INSERT INTO rooms (name, capacity, location, description, image, amenities)
        VALUES 
        (
          'Executive Boardroom',
          20,
          'Floor 1',
          'Luxurious Modern Space',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
          '["Projector", "Video Conference", "Whiteboard"]'
        ),
        (
          'Creative Space',
          8,
          'Floor 2',
          'Informal Brainstorming Room',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          '["Whiteboard", "Smart TV", "Standing Desks"]'
        ),
        (
          'Training Room',
          30,
          'Ground Floor',
          'Large Training Space',
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
          '["Dual Projectors", "Sound System", "Training PCs"]'
        )
      `);
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();