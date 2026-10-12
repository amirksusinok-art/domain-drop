import { DomainItem, Pack, UniqueRegistryEntry, Rarity, Category } from '../types/domain';

export const INITIAL_UNIQUE_REGISTRY: UniqueRegistryEntry[] = [
  {
    id: 'DOM-000001',
    name: 'nova',
    zone: 'com',
    fullName: 'nova.com',
    rarity: 'Rare',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000002',
    name: 'x7',
    zone: 'io',
    fullName: 'x7.io',
    rarity: 'Legendary',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000003',
    name: 'telegram',
    zone: 'com',
    fullName: 'telegram.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000004',
    name: 'telegram',
    zone: 'org',
    fullName: 'telegram.org',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000005',
    name: 'google',
    zone: 'com',
    fullName: 'google.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000006',
    name: 'youtube',
    zone: 'com',
    fullName: 'youtube.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000007',
    name: 'discord',
    zone: 'com',
    fullName: 'discord.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000008',
    name: 'github',
    zone: 'com',
    fullName: 'github.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  },
  {
    id: 'DOM-000009',
    name: 'openai',
    zone: 'com',
    fullName: 'openai.com',
    rarity: 'Secret',
    status: 'available',
    history: [{ date: '2026-10-01', event: 'Внесен в реестр', actor: 'Genesis Block' }]
  }
];

export interface CatalogItemDef {
  name: string;
  zone: string;
  rarity: Rarity;
  categories: Category[];
  isUnique?: boolean;
  uniqueId?: string;
  specificChanceInRarity?: number;
}

export const CATALOG_ITEMS: CatalogItemDef[] = [
  // Secret (Unique & Non-unique)
  { name: 'telegram', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000003' },
  { name: 'telegram', zone: 'org', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000004' },
  { name: 'google', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000005' },
  { name: 'youtube', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Secret'], isUnique: true, uniqueId: 'DOM-000006' },
  { name: 'discord', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Tech'], isUnique: true, uniqueId: 'DOM-000007' },
  { name: 'github', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000008' },
  { name: 'openai', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000009' },
  { name: 'tiktok', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Secret'] },
  { name: 'steam', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Secret'] },

  // Legendary (Unique & Non-unique)
  { name: 'x7', zone: 'io', rarity: 'Legendary', categories: ['Short Names', 'Numeric Mix', 'Tech'], isUnique: true, uniqueId: 'DOM-000002' },
  { name: 'unigram', zone: 'org', rarity: 'Legendary', categories: ['Popular', 'Tech'] },
  { name: 'vk', zone: 'com', rarity: 'Legendary', categories: ['Popular', 'Short Names'] },
  { name: 'twitch', zone: 'tv', rarity: 'Legendary', categories: ['Popular', 'Gaming'] },
  { name: 'reddit', zone: 'com', rarity: 'Legendary', categories: ['Popular', 'Tech'] },
  { name: 'roblox', zone: 'com', rarity: 'Legendary', categories: ['Popular', 'Gaming'] },
  { name: 'spotify', zone: 'com', rarity: 'Legendary', categories: ['Popular', 'Tech'] },
  { name: 'netflix', zone: 'com', rarity: 'Legendary', categories: ['Popular', 'Tech'] },
  { name: 'x', zone: 'io', rarity: 'Legendary', categories: ['Short Names', 'Tech'] },

  // Epic
  { name: 'yandex', zone: 'ru', rarity: 'Epic', categories: ['Popular', 'Tech'] },
  { name: 'vexor', zone: 'io', rarity: 'Epic', categories: ['Tech', 'Rare Words'] },
  { name: 'qbit', zone: 'app', rarity: 'Epic', categories: ['Tech', 'Short Names'] },
  { name: 'zentry', zone: 'io', rarity: 'Epic', categories: ['Gaming', 'Tech'] },
  { name: 'radar', zone: 'net', rarity: 'Epic', categories: ['Mirror', 'Tech'] },
  { name: '777', zone: 'xyz', rarity: 'Epic', categories: ['Numeric', 'Short Names'] },

  // Rare (Unique & Non-unique)
  { name: 'nova', zone: 'com', rarity: 'Rare', categories: ['Popular', 'Tech'], isUnique: true, uniqueId: 'DOM-000001' },
  { name: 'nexora', zone: 'dev', rarity: 'Rare', categories: ['Tech'] },
  { name: 'orbix', zone: 'gg', rarity: 'Rare', categories: ['Gaming', 'Tech'] },
  { name: 'luma', zone: 'dev', rarity: 'Rare', categories: ['Tech'] },
  { name: 'fox', zone: 'net', rarity: 'Rare', categories: ['Short Names'] },
  { name: 'q7', zone: 'gg', rarity: 'Rare', categories: ['Short Names', 'Gaming'] },
  { name: 'aba', zone: 'org', rarity: 'Rare', categories: ['Mirror', 'Short Names'] },
  { name: '10001', zone: 'io', rarity: 'Rare', categories: ['Numeric', 'Mirror'] },

  // Uncommon
  { name: 'pixly', zone: 'net', rarity: 'Uncommon', categories: ['Gaming'] },
  { name: 'novix', zone: 'site', rarity: 'Uncommon', categories: ['Tech'] },
  { name: 'nex', zone: 'io', rarity: 'Uncommon', categories: ['Short Names', 'Tech'] },
  { name: 'zen', zone: 'gg', rarity: 'Uncommon', categories: ['Gaming', 'Short Names'] },
  { name: 'echo', zone: 'net', rarity: 'Uncommon', categories: ['Tech'] },
  { name: 'pulse', zone: 'io', rarity: 'Uncommon', categories: ['Tech'] },
  { name: 'alpha', zone: 'app', rarity: 'Uncommon', categories: ['Tech'] },

  // Common
  { name: 'byte', zone: 'dev', rarity: 'Common', categories: ['Tech'] },
  { name: 'core', zone: 'app', rarity: 'Common', categories: ['Tech'] },
  { name: 'meta', zone: 'site', rarity: 'Common', categories: ['Tech'] },
  { name: 'flux', zone: 'xyz', rarity: 'Common', categories: ['Tech'] },
  { name: 'zero', zone: 'site', rarity: 'Common', categories: ['Tech'] },
  { name: 'link', zone: 'net', rarity: 'Common', categories: ['Tech'] },
  { name: 'volt', zone: 'io', rarity: 'Common', categories: ['Gaming', 'Tech'] }
];

export const PACKS_CATALOG: Pack[] = [
  {
    id: 'pack_free',
    name: 'Бесплатный набор',
    subtitle: 'Доступен раз в 24 часа',
    priceBC: 0,
    freeCooldownHours: 24,
    icon: '🎁',
    badge: 'FREE 24H',
    accentColor: '#38bdf8',
    zones: ['.com', '.net', '.org', '.io'],
    odds: {
      Common: 70.0,
      Uncommon: 22.0,
      Rare: 6.0,
      Epic: 1.8,
      Legendary: 0.18,
      Secret: 0.02
    },
    description: 'Ежедневный подарок для поддержания прогресса. Честные шансы без скрытых комиссий.'
  },
  {
    id: 'pack_basic',
    name: 'Basic Pack',
    subtitle: 'Классические зоны .com, .net, .org',
    priceBC: 100,
    icon: '📦',
    accentColor: '#60a5fa',
    zones: ['.com', '.net', '.org', '.io'],
    odds: {
      Common: 65.0,
      Uncommon: 23.0,
      Rare: 8.0,
      Epic: 3.5,
      Legendary: 0.45,
      Secret: 0.05
    },
    description: 'Базовый набор исследователя. Шанс выбить nova.com (Unique) и telegram.com (Unique).'
  },
  {
    id: 'pack_themed',
    name: 'Themed Pack',
    subtitle: 'Зоны .io, .dev, .gg, .app',
    priceBC: 300,
    icon: '⚡',
    badge: 'POPULAR',
    accentColor: '#a855f7',
    zones: ['.io', '.dev', '.gg', '.app'],
    odds: {
      Common: 50.0,
      Uncommon: 30.0,
      Rare: 13.0,
      Epic: 6.0,
      Legendary: 0.9,
      Secret: 0.1
    },
    description: 'Технологические и игровые домены. Повышенный шанс на короткие и IT-названия.'
  },
  {
    id: 'pack_premium',
    name: 'Premium Pack',
    subtitle: 'Высокие шансы на Rare & Epic',
    priceBC: 700,
    icon: '💎',
    badge: 'HIGH VALUE',
    accentColor: '#f59e0b',
    zones: ['.com', '.org', '.dev', '.io', '.tv'],
    odds: {
      Common: 30.0,
      Uncommon: 35.0,
      Rare: 22.0,
      Epic: 10.0,
      Legendary: 2.6,
      Secret: 0.4
    },
    description: 'Премиальный пул для коллекционеров с x5 шансом на Legendary и Secret.'
  },
  {
    id: 'pack_vault',
    name: 'Vault Pack',
    subtitle: 'Только Rare+ с гарантией ценности',
    priceBC: 1500,
    icon: '👑',
    badge: 'LEGENDARY',
    accentColor: '#ef4444',
    zones: ['.com', '.org', '.io', '.gg', '.dev'],
    odds: {
      Common: 0.0,
      Uncommon: 15.0,
      Rare: 40.0,
      Epic: 30.0,
      Legendary: 12.0,
      Secret: 3.0
    },
    description: 'Элитный сейф. Без обычных предметов. Максимальная вероятность Unique артефактов.'
  }
];

export const RECYCLE_RATES: Record<Rarity, number> = {
  Common: 5,
  Uncommon: 12,
  Rare: 30,
  Epic: 75,
  Legendary: 200,
  Secret: 500
};
