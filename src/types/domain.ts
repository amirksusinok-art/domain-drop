export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Secret';

export type Category = 
  | 'Popular'
  | 'Short Names'
  | 'Medium Names'
  | 'Long Names'
  | 'Numeric'
  | 'Numeric Mix'
  | 'Mirror'
  | 'Repeating'
  | 'Tech'
  | 'Gaming'
  | 'Rare Words'
  | 'Seasonal'
  | 'Secret';

export type PatternType = 
  | 'symmetric' 
  | 'matrix' 
  | 'geometric' 
  | 'circuit' 
  | 'minimal' 
  | 'constellation'
  | 'iridescent'
  | 'hologram';

export type ThemeId = 'obsidian' | 'midnight' | 'oled' | 'amber' | 'amethyst' | 'studio';

export interface DomainItem {
  id: string;
  name: string;
  zone: string;
  fullName?: string; // e.g. "telegram.com"
  length: number; // strictly 1 to 8 characters
  categories: Category[];
  rarity: Rarity;
  isUnique?: boolean; // Unique server-wide specimen
  instanceId: string; // e.g. "DOM-000001"
  obtainedAt: string;
  visualSeed: number;
  patternType: PatternType;
  showcased?: boolean;
  notes?: string;
  recycleValueBC?: number;
}

export interface Pack {
  id: string;
  name: string;
  subtitle: string;
  priceBC: number;
  freeCooldownHours?: number;
  icon: string;
  badge?: string;
  accentColor: string;
  zones: string[];
  odds: {
    Common: number;
    Uncommon: number;
    Rare: number;
    Epic: number;
    Legendary: number;
    Secret: number;
  };
  description: string;
}

export interface MarketListing {
  id: string;
  item: DomainItem;
  priceBC: number;
  seller: string;
  sellerAvatar?: string;
  listedAt: string;
}

export interface AuctionLot {
  id: string;
  item: DomainItem;
  currentBidBC: number;
  minStepBC: number;
  buyNowPriceBC?: number;
  highestBidder: string;
  endsAt: string;
  bidsCount: number;
}

export interface UniqueRegistryEntry {
  id: string;
  name: string;
  zone: string;
  fullName: string;
  rarity: Rarity;
  status: 'available' | 'owned' | 'auction';
  owner?: string;
  history: {
    date: string;
    event: string;
    actor: string;
  }[];
}

export interface Album {
  id: string;
  title: string;
  description: string;
  category: Category;
  targetCount: number;
  requiredNames: string[];
  rewardCoins: number;
  rewardBC?: number;
  rewardXp: number;
  rewardBadge: string;
  completed: boolean;
}

export interface ScannerTask {
  id: string;
  type: 'palindrome' | 'repeating' | 'shortest' | 'missing_char' | 'pattern';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  options: string[];
  correctIndex: number;
  hint: string;
  rewardCoins: number;
  rewardXp: number;
  rewardItemPreview: {
    name: string;
    zone: string;
    rarity: Rarity;
    category: Category;
  };
}

export interface CraftRecipe {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  inputCriteria: {
    category?: Category;
    rarity?: Rarity;
    count: number;
    description: string;
  };
  outputPreview: {
    rarity: Rarity;
    category: Category;
    zone: string;
    possibleNames: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
  rewardBC?: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardBC: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number; // BC (Domain Empire Coins)
  items: DomainItem[];
  completedAlbumIds: string[];
  claimedDailyStreak: number;
  lastDailyClaim: string;
  lastFreePackClaim?: string;
  stats: {
    totalPacksOpened?: number;
    totalBCSpent?: number;
    totalBCEarned?: number;
    marketSales?: number;
    marketPurchases?: number;
    uniqueOwned?: number;
    itemsRecycled?: number;
    totalScans?: number;
    tasksSolved?: number;
    craftedCount?: number;
    mirrorCount?: number;
    shortCount?: number;
  };
  settings: {
    theme: ThemeId;
    haptics: boolean;
    sound: boolean;
    animations: boolean;
    fastOpen: boolean;
    lang: 'ru' | 'en';
  };
  avitaDeals?: AvitaDeal[];
}

export interface AvitaDeal {
  id: string;
  timestamp: string;
  itemCount: number;
  itemNames: string[];
  totalPayoutBC: number;
}

