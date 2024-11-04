import Database from 'better-sqlite3';

const db = new Database('rooms.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create rooms table
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    image TEXT,
    amenities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create reservations table
db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
  )
`);

// Create trigger to update updated_at timestamp
db.exec(`
  CREATE TRIGGER IF NOT EXISTS rooms_update_trigger 
  AFTER UPDATE ON rooms
  BEGIN
    UPDATE rooms SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

db.exec(`
  CREATE TRIGGER IF NOT EXISTS reservations_update_trigger
  AFTER UPDATE ON reservations
  BEGIN
    UPDATE reservations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

// Insert initial rooms data if table is empty
const roomCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get();

if (roomCount.count === 0) {
  const insertRoom = db.prepare(`
    INSERT INTO rooms (name, location, capacity, description, image, amenities)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialRooms = [
    {
      name: 'Executive Boardroom',
      location: 'Floor 5',
      capacity: 20,
      description: 'Luxurious Modern Space',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200',
      amenities: JSON.stringify(['4K Projector', 'Video Conferencing', 'Whiteboard', 'Coffee Machine'])
    },
    {
      name: 'Creative Studio',
      location: 'Floor 3',
      capacity: 8,
      description: 'Informal Brainstorm Space',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200',
      amenities: JSON.stringify(['Smart TV', 'Standing Desks', 'Design Tools', 'Brainstorm Wall'])
    },
    {
      name: 'Training Room',
      location: 'Ground Floor',
      capacity: 30,
      description: 'Large Training Space',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200',
      amenities: JSON.stringify(['Dual Projectors', 'Sound System', 'Flexible Seating', 'Training PCs'])
    }
  ];

  initialRooms.forEach(room => {
    insertRoom.run(
      room.name,
      room.location,
      room.capacity,
      room.description,
      room.image,
      room.amenities
    );
  });
}

console.log('Database setup completed successfully!');

// Close the database connection
db.close();