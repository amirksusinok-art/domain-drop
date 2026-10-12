export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Secret';

export type Category = 
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
  | 'Seasonal';

export type PatternType = 
  | 'symmetric' 
  | 'matrix' 
  | 'geometric' 
  | 'circuit' 
  | 'minimal' 
  | 'constellation'
  | 'iridescent';

export interface DomainItem {
  id: string;
  name: string;
  zone: string;
  length: number;
  categories: Category[];
  rarity: Rarity;
  instanceId: string;
  obtainedAt: string;
  visualSeed: number;
  patternType: PatternType;
  showcased?: boolean;
  notes?: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  category: Category;
  targetCount: number;
  requiredNames: string[];
  rewardCoins: number;
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
}

export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  items: DomainItem[];
  completedAlbumIds: string[];
  claimedDailyStreak: number;
  lastDailyClaim: string;
  stats: {
    totalScans: number;
    tasksSolved: number;
    craftedCount: number;
    mirrorCount: number;
    shortCount: number;
  };
  settings: {
    haptics: boolean;
    sound: boolean;
    animations: boolean;
    lang: 'ru' | 'en';
  };
}
