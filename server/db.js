import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UNIQUE_REGISTRY, CATALOG_ITEMS } from './catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let cache = {
  users: {},
  nextInstanceSeq: 105,
  uniqueRegistry: UNIQUE_REGISTRY.map(u => ({ ...u, owner: null })),
  marketListings: [
    {
      id: 'list-1',
      item: {
        id: 'DOM-000088',
        name: 'pixel',
        zone: 'io',
        fullName: 'pixel.io',
        length: 5,
        categories: ['Gaming', 'Tech'],
        rarity: 'Uncommon',
        instanceId: 'DOM-000088',
        obtainedAt: new Date(Date.now() - 3600000).toISOString(),
        visualSeed: 1209,
        patternType: 'geometric'
      },
      priceBC: 45,
      seller: 'cyber_collector',
      sellerAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=cyber',
      listedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'list-2',
      item: {
        id: 'DOM-000092',
        name: 'q7',
        zone: 'gg',
        fullName: 'q7.gg',
        length: 2,
        categories: ['Short Names', 'Gaming'],
        rarity: 'Rare',
        instanceId: 'DOM-000092',
        obtainedAt: new Date(Date.now() - 7200000).toISOString(),
        visualSeed: 8871,
        patternType: 'minimal'
      },
      priceBC: 240,
      seller: 'matrix_hacker',
      sellerAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=matrix',
      listedAt: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  auctions: [
    {
      id: 'auc-1',
      item: {
        id: 'DOM-000002',
        name: 'x7',
        zone: 'io',
        fullName: 'x7.io',
        length: 2,
        categories: ['Short Names', 'Numeric Mix', 'Tech'],
        rarity: 'Legendary',
        isUnique: true,
        instanceId: 'DOM-000002',
        obtainedAt: '2026-10-01T00:00:00Z',
        visualSeed: 7777,
        patternType: 'iridescent'
      },
      currentBidBC: 850,
      minStepBC: 50,
      buyNowPriceBC: 3500,
      highestBidder: 'crypto_whale',
      endsAt: new Date(Date.now() + 14400000).toISOString(), // 4h
      bidsCount: 14
    },
    {
      id: 'auc-2',
      item: {
        id: 'DOM-000001',
        name: 'nova',
        zone: 'com',
        fullName: 'nova.com',
        length: 4,
        categories: ['Popular', 'Tech'],
        rarity: 'Rare',
        isUnique: true,
        instanceId: 'DOM-000001',
        obtainedAt: '2026-10-01T00:00:00Z',
        visualSeed: 4412,
        patternType: 'constellation'
      },
      currentBidBC: 320,
      minStepBC: 20,
      buyNowPriceBC: 1200,
      highestBidder: 'starlight',
      endsAt: new Date(Date.now() + 28800000).toISOString(), // 8h
      bidsCount: 8
    }
  ],
  history: []
};

// Load database from file
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    cache = { ...cache, ...parsed };
    if (!cache.uniqueRegistry || cache.uniqueRegistry.length === 0) {
      cache.uniqueRegistry = UNIQUE_REGISTRY.map(u => ({ ...u, owner: null }));
    }
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
  },

  getUniqueRegistry() {
    return cache.uniqueRegistry || [];
  },

  claimUniqueItem(uniqueId, ownerUsername) {
    const item = cache.uniqueRegistry.find(u => u.id === uniqueId);
    if (item && item.status === 'available') {
      item.status = 'owned';
      item.owner = ownerUsername;
      saveDb();
      return item;
    }
    return null;
  },

  getMarketListings() {
    return cache.marketListings || [];
  },

  addMarketListing(listing) {
    cache.marketListings = cache.marketListings || [];
    cache.marketListings.unshift(listing);
    saveDb();
    return listing;
  },

  removeMarketListing(listingId) {
    cache.marketListings = (cache.marketListings || []).filter(l => l.id !== listingId);
    saveDb();
  },

  getAuctions() {
    return cache.auctions || [];
  },

  placeBid(auctionId, bidderUsername, bidAmount) {
    const auc = (cache.auctions || []).find(a => a.id === auctionId);
    if (!auc) return { error: 'Auction not found' };
    if (bidAmount < auc.currentBidBC + auc.minStepBC) {
      return { error: 'Bid too low' };
    }
    auc.currentBidBC = bidAmount;
    auc.highestBidder = bidderUsername;
    auc.bidsCount = (auc.bidsCount || 0) + 1;
    saveDb();
    return { success: true, auction: auc };
  }
};
