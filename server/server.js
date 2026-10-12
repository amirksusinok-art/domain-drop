import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { setupBot } from './bot.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Serve static frontend build from dist
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Telegram WebApp initData HMAC-SHA256 validator
function validateTelegramInitData(initData, botToken) {
  if (!botToken || !initData) return true; // dev/standalone fallback

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckArr = [];
    urlParams.sort();
    urlParams.forEach((val, key) => dataCheckArr.push(`${key}=${val}`));
    const dataCheckString = dataCheckArr.join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
  } catch (e) {
    return false;
  }
}

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'DomainDrop',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// 2. Get or Create User Profile
app.post('/api/user/profile', (req, res) => {
  const { initData, user } = req.body;

  if (BOT_TOKEN && !validateTelegramInitData(initData, BOT_TOKEN)) {
    return res.status(403).json({ error: 'Invalid Telegram authentication' });
  }

  const userId = user?.id || 10842099;
  let profile = db.getUser(userId);

  if (!profile) {
    const starterSeq = db.getNextSeq();
    profile = {
      id: userId,
      username: user?.username || 'domain_master',
      firstName: user?.first_name || 'Коллекционер',
      level: 1,
      xp: 40,
      xpToNextLevel: 100,
      coins: 50,
      items: [
        {
          id: `DOM-${String(starterSeq).padStart(6, '0')}`,
          name: 'NEX',
          zone: 'TECH',
          length: 3,
          categories: ['Short Names', 'Tech'],
          rarity: 'Rare',
          instanceId: `DOM-${String(starterSeq).padStart(6, '0')}`,
          obtainedAt: new Date().toISOString(),
          visualSeed: 4242,
          patternType: 'circuit'
        }
      ],
      completedAlbumIds: [],
      claimedDailyStreak: 1,
      lastDailyClaim: new Date().toISOString(),
      stats: {
        totalScans: 1,
        tasksSolved: 0,
        craftedCount: 0,
        mirrorCount: 0,
        shortCount: 1
      },
      settings: {
        haptics: true,
        sound: true,
        animations: true,
        lang: 'ru'
      }
    };
    db.setUser(userId, profile);
  }

  res.json(profile);
});

// 3. Save User Profile
app.post('/api/user/save', (req, res) => {
  const { profile } = req.body;
  if (!profile || !profile.id) {
    return res.status(400).json({ error: 'Missing profile' });
  }
  db.setUser(profile.id, profile);
  res.json({ success: true });
});

// Fallback all routes to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DomainDrop server running on port ${PORT}`);
  console.log(`🌐 Public App URL: ${APP_URL}`);

  if (BOT_TOKEN) {
    setupBot(BOT_TOKEN, APP_URL);
  } else {
    console.log('ℹ️ BOT_TOKEN not set. Running in web preview mode.');
  }
});
