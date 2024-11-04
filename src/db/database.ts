import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function initDatabase() {
  if (!db) {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    db = new SQL.Database();
    await setupTables();
    await seedInitialData();
  }
  return db;
}

async function setupTables() {
  if (!db) return;

  // Create rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      image TEXT,
      amenities TEXT
    );
  `);

  // Create reservations table
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES rooms (id)
    );
  `);
}

async function seedInitialData() {
  if (!db) return;

  // Check if rooms table is empty
  const result = db.exec("SELECT COUNT(*) as count FROM rooms");
  if (result[0].values[0][0] === 0) {
    // Insert initial room data
    db.run(`
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
        );
    `);
  }
}

export async function getRooms() {
  const db = await initDatabase();
  const result = db.exec(`
    SELECT id, name, capacity, location, description, image, amenities
    FROM rooms
  `);
  
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0],
    name: row[1],
    capacity: row[2],
    location: row[3],
    description: row[4],
    image: row[5],
    amenities: JSON.parse(row[6] as string)
  }));
}

export async function getReservations() {
  const db = await initDatabase();
  const result = db.exec(`
    SELECT r.id, r.room_id, r.user_id, r.start_date, r.end_date, 
           rm.name as room_name, rm.location as room_location
    FROM reservations r
    JOIN rooms rm ON r.room_id = rm.id
  `);
  
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0],
    roomId: row[1],
    userId: row[2],
    startDate: new Date(row[3] as string),
    endDate: new Date(row[4] as string),
    room: {
      id: row[1],
      name: row[5],
      location: row[6]
    }
  }));
}

export async function addReservation(reservation: {
  roomId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
}) {
  const db = await initDatabase();
  const id = `reservation-${Date.now()}`;
  
  db.run(`
    INSERT INTO reservations (id, room_id, user_id, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `, [
    id,
    reservation.roomId,
    reservation.userId,
    reservation.startDate.toISOString(),
    reservation.endDate.toISOString()
  ]);
  
  return id;
}

export async function deleteReservation(id: string) {
  const db = await initDatabase();
  db.run('DELETE FROM reservations WHERE id = ?', [id]);
}

export async function addRoom(room: {
  name: string;
  capacity: number;
  location: string;
  description: string;
  image: string;
  amenities: string[];
}) {
  const db = await initDatabase();
  const id = `room-${Date.now()}`;
  
  db.run(`
    INSERT INTO rooms (id, name, capacity, location, description, image, amenities)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    room.name,
    room.capacity,
    room.location,
    room.description,
    room.image,
    JSON.stringify(room.amenities)
  ]);
  
  return id;
}

export async function updateRoom(id: string, updates: Partial<{
  name: string;
  capacity: number;
  location: string;
  description: string;
  image: string;
  amenities: string[];
}>) {
  const db = await initDatabase();
  
  const setClauses = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    setClauses.push(`${key} = ?`);
    values.push(key === 'amenities' ? JSON.stringify(value) : value);
  }
  
  if (setClauses.length > 0) {
    values.push(id);
    db.run(`
      UPDATE rooms 
      SET ${setClauses.join(', ')}
      WHERE id = ?
    `, values);
  }
}

export async function deleteRoom(id: string) {
  const db = await initDatabase();
  db.run('DELETE FROM rooms WHERE id = ?', [id]);
}