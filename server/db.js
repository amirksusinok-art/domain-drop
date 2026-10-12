import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let cache = {
  users: {},
  nextInstanceSeq: 105
};

// Load database from file
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    cache = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read database.json, starting fresh', e);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database.json', e);
  }
}

export const db = {
  getUser(userId) {
    return cache.users[userId] || null;
  },

  setUser(userId, profile) {
    cache.users[userId] = profile;
    saveDb();
    return profile;
  },

  getNextSeq() {
    cache.nextInstanceSeq = (cache.nextInstanceSeq || 100) + 1;
    saveDb();
    return cache.nextInstanceSeq;
  },

  getAllUsers() {
    return Object.values(cache.users);
  }
};
