import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { setupBot } from './bot.js';
import { 
  CATALOG_ITEMS, 
  PACKS_DEFINITIONS, 
  RECYCLE_RATES, 
  validateDomainLength, 
  detectCategories 
} from './catalog.js';

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

function validateTelegramInitData(initData, botToken) {
  if (!botToken) return true;
  if (!initData) return false;

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) return false;
    urlParams.delete('hash');

    const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (authDate && (currentTime - authDate > 86400)) {
      console.warn('Telegram initData has expired (>24h)');
      return false;
    }

    const dataCheckArr = [];
    urlParams.sort();
    urlParams.forEach((val, key) => dataCheckArr.push(`${key}=${val}`));
    const dataCheckString = dataCheckArr.join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash.length !== hash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(hash));
  } catch (e) {
    return false;
  }
}

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Domain Empire',
    currency: 'BC',
    version: '2.0.0',
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
      username: user?.username || 'empire_collector',
      firstName: user?.first_name || 'Коллекционер',
      level: 1,
      xp: 25,
      xpToNextLevel: 100,
      coins: 200, // 200 BC starter capital
      items: [
        {
          id: `DOM-${String(starterSeq).padStart(6, '0')}`,
          name: 'pixly',
          zone: 'net',
          fullName: 'pixly.net',
          length: 5,
          categories: ['Gaming'],
          rarity: 'Uncommon',
          instanceId: `DOM-${String(starterSeq).padStart(6, '0')}`,
          obtainedAt: new Date().toISOString(),
          visualSeed: 2901,
          patternType: 'geometric'
        }
      ],
      completedAlbumIds: [],
      claimedDailyStreak: 1,
      lastDailyClaim: new Date().toISOString(),
      lastFreePackClaim: null,
      stats: {
        totalPacksOpened: 0,
        totalBCSpent: 0,
        totalBCEarned: 200,
        marketSales: 0,
        marketPurchases: 0,
        uniqueOwned: 0,
        itemsRecycled: 0
      },
      settings: {
        theme: 'obsidian',
        haptics: true,
        sound: true,
        animations: true,
        fastOpen: false,
        lang: 'ru'
      }
    };
    db.setUser(userId, profile);
  }

  res.json(profile);
});

// 3. Save User Profile
app.post('/api/user/save', (req, res) => {
  const { initData, profile } = req.body;
  if (BOT_TOKEN && !validateTelegramInitData(initData, BOT_TOKEN)) {
    return res.status(403).json({ error: 'Invalid Telegram authentication' });
  }
  if (!profile || !profile.id) {
    return res.status(400).json({ error: 'Missing profile' });
  }
  db.setUser(profile.id, profile);
  res.json({ success: true });
});

// 4. Open Pack atomically
app.post('/api/packs/open', (req, res) => {
  const { initData, userId, packId } = req.body;
  if (BOT_TOKEN && !validateTelegramInitData(initData, BOT_TOKEN)) {
    return res.status(403).json({ error: 'Invalid Telegram authentication' });
  }

  const profile = db.getUser(userId || 10842099);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const packDef = PACKS_DEFINITIONS[packId] || PACKS_DEFINITIONS.pack_basic;
  const price = packDef.priceBC;

  if (profile.coins < price) {
    return res.status(400).json({ error: 'Недостаточно BC монет' });
  }

  // Deduct coins
  profile.coins -= price;
  profile.stats = profile.stats || {};
  profile.stats.totalBCSpent = (profile.stats.totalBCSpent || 0) + price;
  profile.stats.totalPacksOpened = (profile.stats.totalPacksOpened || 0) + 1;

  // Determine rarity from pack odds
  const odds = packDef.odds;
  const rand = Math.random() * 100;
  let cumulative = 0;
  let chosenRarity = 'Common';

  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Secret'];
  for (const r of rarities) {
    cumulative += odds[r] || 0;
    if (rand <= cumulative) {
      chosenRarity = r;
      break;
    }
  }

  // Filter available items for that rarity
  const uniqueRegistry = db.getUniqueRegistry();
  const claimedUniqueIds = new Set(uniqueRegistry.filter(u => u.status !== 'available').map(u => u.id));

  let pool = CATALOG_ITEMS.filter(it => it.rarity === chosenRarity);
  // Filter out unique items that have already been claimed (probability redistribution!)
  pool = pool.filter(it => !it.isUnique || !claimedUniqueIds.has(it.uniqueId));

  // Fallback if pool is empty
  if (pool.length === 0) {
    pool = CATALOG_ITEMS.filter(it => it.rarity === 'Uncommon');
  }

  const selectedDef = pool[Math.floor(Math.random() * pool.length)];
  const isUnique = !!selectedDef.isUnique;

  // If unique, claim it in server registry
  if (isUnique && selectedDef.uniqueId) {
    db.claimUniqueItem(selectedDef.uniqueId, profile.username);
    profile.stats.uniqueOwned = (profile.stats.uniqueOwned || 0) + 1;
  }

  const instanceSeq = isUnique && selectedDef.uniqueId 
    ? selectedDef.uniqueId 
    : `DOM-${String(db.getNextSeq()).padStart(6, '0')}`;

  const patternTypes = ['geometric', 'matrix', 'circuit', 'symmetric', 'minimal', 'constellation', 'iridescent'];
  const patternType = isUnique ? 'hologram' : patternTypes[Math.floor(Math.random() * patternTypes.length)];

  const newItem = {
    id: instanceSeq,
    name: selectedDef.name,
    zone: selectedDef.zone,
    fullName: `${selectedDef.name}.${selectedDef.zone}`,
    length: selectedDef.name.length,
    categories: selectedDef.categories || detectCategories(selectedDef.name),
    rarity: selectedDef.rarity,
    isUnique,
    instanceId: instanceSeq,
    obtainedAt: new Date().toISOString(),
    visualSeed: Math.floor(Math.random() * 10000),
    patternType,
    recycleValueBC: RECYCLE_RATES[selectedDef.rarity] || 5
  };

  profile.items = profile.items || [];
  profile.items.unshift(newItem);

  // Add XP
  const xpReward = chosenRarity === 'Secret' ? 250 : chosenRarity === 'Legendary' ? 120 : chosenRarity === 'Epic' ? 60 : chosenRarity === 'Rare' ? 30 : 15;
  profile.xp += xpReward;
  if (profile.xp >= profile.xpToNextLevel) {
    profile.level += 1;
    profile.xp -= profile.xpToNextLevel;
    profile.xpToNextLevel = Math.floor(profile.xpToNextLevel * 1.5);
  }

  db.setUser(profile.id, profile);

  res.json({
    success: true,
    item: newItem,
    profile
  });
});

// 5. Unique Registry Endpoint
app.get('/api/unique-registry', (req, res) => {
  res.json(db.getUniqueRegistry());
});

// 6. Marketplace Endpoints
app.get('/api/market/listings', (req, res) => {
  res.json(db.getMarketListings());
});

app.post('/api/market/list', (req, res) => {
  const { userId, itemId, priceBC } = req.body;
  const profile = db.getUser(userId || 10842099);
  if (!profile) return res.status(404).json({ error: 'User not found' });

  const itemIdx = profile.items.findIndex(it => it.id === itemId);
  if (itemIdx === -1) return res.status(400).json({ error: 'Item not in inventory' });

  const item = profile.items[itemIdx];
  profile.items.splice(itemIdx, 1);

  const listing = {
    id: `list-${Date.now()}`,
    item,
    priceBC: Math.max(1, parseInt(priceBC, 10) || 50),
    seller: profile.username,
    sellerAvatar: profile.avatarUrl,
    listedAt: new Date().toISOString()
  };

  db.addMarketListing(listing);
  db.setUser(profile.id, profile);

  res.json({ success: true, listing, profile });
});

app.post('/api/market/buy', (req, res) => {
  const { userId, listingId } = req.body;
  const buyer = db.getUser(userId || 10842099);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

  const listings = db.getMarketListings();
  const listing = listings.find(l => l.id === listingId);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  if (buyer.coins < listing.priceBC) {
    return res.status(400).json({ error: 'Недостаточно BC монет' });
  }

  // Deduct coins from buyer
  buyer.coins -= listing.priceBC;
  buyer.items.unshift(listing.item);
  buyer.stats = buyer.stats || {};
  buyer.stats.marketPurchases = (buyer.stats.marketPurchases || 0) + 1;

  db.removeMarketListing(listingId);
  db.setUser(buyer.id, buyer);

  res.json({ success: true, item: listing.item, profile: buyer });
});

// 7. Auctions Endpoints
app.get('/api/auctions', (req, res) => {
  res.json(db.getAuctions());
});

app.post('/api/auctions/bid', (req, res) => {
  const { userId, auctionId, bidAmount } = req.body;
  const user = db.getUser(userId || 10842099);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.coins < bidAmount) {
    return res.status(400).json({ error: 'Недостаточно BC монет для ставки' });
  }

  const result = db.placeBid(auctionId, user.username, bidAmount);
  if (result.error) return res.status(400).json(result);

  res.json({ success: true, auction: result.auction });
});

// 8. Recycle Items into BC
app.post('/api/user/recycle', (req, res) => {
  const { userId, itemIds } = req.body;
  const profile = db.getUser(userId || 10842099);
  if (!profile) return res.status(404).json({ error: 'User not found' });

  let earnedBC = 0;
  const remainingItems = [];

  for (const item of profile.items) {
    if (itemIds.includes(item.id)) {
      if (item.isUnique) {
        // Unique cannot be scrapped!
        remainingItems.push(item);
        continue;
      }
      const val = RECYCLE_RATES[item.rarity] || 5;
      earnedBC += val;
    } else {
      remainingItems.push(item);
    }
  }

  profile.items = remainingItems;
  profile.coins += earnedBC;
  profile.stats = profile.stats || {};
  profile.stats.itemsRecycled = (profile.stats.itemsRecycled || 0) + itemIds.length;
  profile.stats.totalBCEarned = (profile.stats.totalBCEarned || 0) + earnedBC;

  db.setUser(profile.id, profile);
  res.json({ success: true, earnedBC, profile });
});

// Fallback all routes to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Domain Empire server running on port ${PORT}`);
  console.log(`🌐 Public App URL: ${APP_URL}`);

  if (BOT_TOKEN) {
    setupBot(BOT_TOKEN, APP_URL);
  } else {
    console.log('ℹ️ BOT_TOKEN not set. Running in web preview mode.');
  }
});
