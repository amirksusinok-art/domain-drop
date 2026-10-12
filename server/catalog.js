export const UNIQUE_REGISTRY = [
  { id: 'DOM-000001', name: 'nova', zone: 'com', fullName: 'nova.com', rarity: 'Rare', status: 'available' },
  { id: 'DOM-000002', name: 'x7', zone: 'io', fullName: 'x7.io', rarity: 'Legendary', status: 'available' },
  { id: 'DOM-000003', name: 'telegram', zone: 'com', fullName: 'telegram.com', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000004', name: 'telegram', zone: 'org', fullName: 'telegram.org', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000005', name: 'google', zone: 'com', fullName: 'google.com', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000006', name: 'youtube', zone: 'com', fullName: 'youtube.com', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000007', name: 'discord', zone: 'com', fullName: 'discord.com', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000008', name: 'github', zone: 'com', fullName: 'github.com', rarity: 'Secret', status: 'available' },
  { id: 'DOM-000009', name: 'openai', zone: 'com', fullName: 'openai.com', rarity: 'Secret', status: 'available' }
];

export const CATALOG_ITEMS = [
  // Secret
  { name: 'telegram', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000003' },
  { name: 'telegram', zone: 'org', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000004' },
  { name: 'google', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000005' },
  { name: 'youtube', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Secret'], isUnique: true, uniqueId: 'DOM-000006' },
  { name: 'discord', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Tech'], isUnique: true, uniqueId: 'DOM-000007' },
  { name: 'github', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000008' },
  { name: 'openai', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Tech', 'Secret'], isUnique: true, uniqueId: 'DOM-000009' },
  { name: 'tiktok', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Secret'] },
  { name: 'steam', zone: 'com', rarity: 'Secret', categories: ['Popular', 'Gaming', 'Secret'] },

  // Legendary
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

  // Rare
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

export const PACKS_DEFINITIONS = {
  pack_free: {
    id: 'pack_free',
    priceBC: 0,
    odds: { Common: 70, Uncommon: 22, Rare: 6, Epic: 1.8, Legendary: 0.18, Secret: 0.02 }
  },
  pack_basic: {
    id: 'pack_basic',
    priceBC: 100,
    odds: { Common: 65, Uncommon: 23, Rare: 8, Epic: 3.5, Legendary: 0.45, Secret: 0.05 }
  },
  pack_themed: {
    id: 'pack_themed',
    priceBC: 300,
    odds: { Common: 50, Uncommon: 30, Rare: 13, Epic: 6, Legendary: 0.9, Secret: 0.1 }
  },
  pack_premium: {
    id: 'pack_premium',
    priceBC: 700,
    odds: { Common: 30, Uncommon: 35, Rare: 22, Epic: 10, Legendary: 2.6, Secret: 0.4 }
  },
  pack_vault: {
    id: 'pack_vault',
    priceBC: 1500,
    odds: { Common: 0, Uncommon: 15, Rare: 40, Epic: 30, Legendary: 12, Secret: 3 }
  }
};

export const RECYCLE_RATES = {
  Common: 5,
  Uncommon: 12,
  Rare: 30,
  Epic: 75,
  Legendary: 200,
  Secret: 500
};

export function validateDomainLength(name) {
  if (!name || typeof name !== 'string') return false;
  const clean = name.toLowerCase().trim();
  if (clean.length < 1 || clean.length > 8) return false;
  return /^[a-z0-9]+$/.test(clean);
}

export function detectCategories(name) {
  const cats = [];
  const len = name.length;
  if (len >= 1 && len <= 3) cats.push('Short Names');
  else if (len >= 4 && len <= 5) cats.push('Medium Names');
  else if (len >= 6 && len <= 8) cats.push('Long Names');

  const isNum = /^[0-9]+$/.test(name);
  const isAlpha = /^[a-z]+$/.test(name);
  if (isNum) cats.push('Numeric');
  if (!isNum && !isAlpha) cats.push('Numeric Mix');

  const reversed = name.split('').reverse().join('');
  if (name === reversed && len > 1) cats.push('Mirror');
  if (/(.)\1/.test(name)) cats.push('Repeating');

  return cats;
}
