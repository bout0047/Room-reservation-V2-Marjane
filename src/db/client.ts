import initSqlJs from 'sql.js';

let db: any = null;

export async function getDb() {
  if (!db) {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    db = new SQL.Database();
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}