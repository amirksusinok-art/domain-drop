import { 
  UserProfile, 
  DomainItem, 
  UniqueRegistryEntry, 
  MarketListing, 
  AuctionLot 
} from '../types/domain';
import { 
  CATALOG_ITEMS, 
  PACKS_CATALOG, 
  RECYCLE_RATES, 
  INITIAL_UNIQUE_REGISTRY 
} from '../data/initialCatalog';

const API_BASE = (import.meta as any).env?.PROD ? '/api' : 'http://localhost:10000/api';

const DEFAULT_PROFILE: UserProfile = {
  id: 10842099,
  username: 'empire_collector',
  firstName: 'Коллекционер',
  avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=empire',
  level: 1,
  xp: 35,
  xpToNextLevel: 100,
  coins: 200, // 200 BC
  items: [
    {
      id: 'DOM-000101',
      name: 'pixly',
      zone: 'net',
      fullName: 'pixly.net',
      length: 5,
      categories: ['Gaming'],
      rarity: 'Uncommon',
      instanceId: 'DOM-000101',
      obtainedAt: new Date().toISOString(),
      visualSeed: 3012,
      patternType: 'geometric',
      recycleValueBC: 12
    }
  ],
  completedAlbumIds: [],
  claimedDailyStreak: 1,
  lastDailyClaim: new Date().toISOString(),
  lastFreePackClaim: undefined,
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

export const apiClient = {
  async getProfile(): Promise<UserProfile> {
    const initData = window.Telegram?.WebApp?.initData || '';
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, user })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API connection failed, using local storage cache.');
    }

    const saved = localStorage.getItem('domain_empire_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {}
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: UserProfile, initData?: string): Promise<void> {
    try {
      localStorage.setItem('domain_empire_user', JSON.stringify(profile));
      await fetch(`${API_BASE}/user/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData: initData || window.Telegram?.WebApp?.initData || '',
          profile
        })
      });
    } catch (e) {
      // Quietly save to localStorage if offline
    }
  },

  async openPack(packId: string, currentProfile: UserProfile): Promise<{ item: DomainItem; profile: UserProfile }> {
    const initData = window.Telegram?.WebApp?.initData || '';
    try {
      const res = await fetch(`${API_BASE}/packs/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          userId: currentProfile.id,
          packId
        })
      });
      if (res.ok) {
        const data = await res.json();
        return { item: data.item, profile: data.profile };
      }
    } catch (e) {
      console.warn('Server pack open failed, falling back to local deterministic roll', e);
    }

    // Client-side fallback if server unreachable
    const pack = PACKS_CATALOG.find(p => p.id === packId) || PACKS_CATALOG[1];
    if (currentProfile.coins < pack.priceBC) {
      throw new Error('Недостаточно BC монет');
    }

    const rand = Math.random() * 100;
    let cumulative = 0;
    let chosenRarity = 'Common';
    for (const [r, chance] of Object.entries(pack.odds)) {
      cumulative += chance;
      if (rand <= cumulative) {
        chosenRarity = r;
        break;
      }
    }

    const pool = CATALOG_ITEMS.filter(it => it.rarity === chosenRarity);
    const chosen = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : CATALOG_ITEMS[0];
    const isUnique = !!chosen.isUnique;
    const instanceId = isUnique && chosen.uniqueId ? chosen.uniqueId : `DOM-${Math.floor(100000 + Math.random() * 900000)}`;

    const newItem: DomainItem = {
      id: instanceId,
      name: chosen.name,
      zone: chosen.zone,
      fullName: `${chosen.name}.${chosen.zone}`,
      length: chosen.name.length,
      categories: chosen.categories,
      rarity: chosen.rarity,
      isUnique,
      instanceId,
      obtainedAt: new Date().toISOString(),
      visualSeed: Math.floor(Math.random() * 9999),
      patternType: isUnique ? 'hologram' : 'geometric',
      recycleValueBC: RECYCLE_RATES[chosen.rarity] || 5
    };

    const nextProfile: UserProfile = {
      ...currentProfile,
      coins: currentProfile.coins - pack.priceBC,
      items: [newItem, ...currentProfile.items],
      xp: currentProfile.xp + 25,
      stats: {
        ...currentProfile.stats,
        totalBCSpent: (currentProfile.stats?.totalBCSpent || 0) + pack.priceBC,
        totalPacksOpened: (currentProfile.stats?.totalPacksOpened || 0) + 1,
        uniqueOwned: (currentProfile.stats?.uniqueOwned || 0) + (isUnique ? 1 : 0)
      }
    };

    this.saveProfile(nextProfile);
    return { item: newItem, profile: nextProfile };
  },

  async getUniqueRegistry(): Promise<UniqueRegistryEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/unique-registry`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_UNIQUE_REGISTRY;
  },

  async getMarketListings(): Promise<MarketListing[]> {
    try {
      const res = await fetch(`${API_BASE}/market/listings`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
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
          patternType: 'geometric',
          recycleValueBC: 12
        },
        priceBC: 45,
        seller: 'cyber_collector',
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
          patternType: 'minimal',
          recycleValueBC: 30
        },
        priceBC: 240,
        seller: 'matrix_hacker',
        listedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  },

  async listMarketItem(userId: number, itemId: string, priceBC: number): Promise<{ success: boolean; listing?: MarketListing; profile?: UserProfile }> {
    try {
      const res = await fetch(`${API_BASE}/market/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, priceBC })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async buyMarketItem(userId: number, listingId: string): Promise<{ success: boolean; item?: DomainItem; profile?: UserProfile }> {
    try {
      const res = await fetch(`${API_BASE}/market/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, listingId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async getAuctions(): Promise<AuctionLot[]> {
    try {
      const res = await fetch(`${API_BASE}/auctions`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
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
        endsAt: new Date(Date.now() + 14400000).toISOString(),
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
        endsAt: new Date(Date.now() + 28800000).toISOString(),
        bidsCount: 8
      }
    ];
  },

  async bidAuction(userId: number, auctionId: string, bidAmount: number): Promise<{ success: boolean; auction?: AuctionLot }> {
    try {
      const res = await fetch(`${API_BASE}/auctions/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, auctionId, bidAmount })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  async recycleItems(userId: number, itemIds: string[]): Promise<{ success: boolean; earnedBC: number; profile?: UserProfile }> {
    try {
      const res = await fetch(`${API_BASE}/user/recycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemIds })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false, earnedBC: 0 };
  }
};
