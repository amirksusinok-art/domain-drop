import { Category, DomainItem, PatternType, Rarity } from '../types/domain';

export interface CatalogTemplate {
  name: string;
  zone: string;
  rarity: Rarity;
  categories: Category[];
  patternType: PatternType;
}

export const INITIAL_CATALOG: CatalogTemplate[] = [
  // Short Names (1-3 chars)
  { name: 'X', zone: 'CORE', rarity: 'Legendary', categories: ['Short Names', 'Rare Words'], patternType: 'minimal' },
  { name: 'Q7', zone: 'ARCADE', rarity: 'Epic', categories: ['Short Names', 'Numeric Mix', 'Gaming'], patternType: 'geometric' },
  { name: 'NEX', zone: 'TECH', rarity: 'Rare', categories: ['Short Names', 'Tech'], patternType: 'circuit' },
  { name: 'ABA', zone: 'ECHO', rarity: 'Rare', categories: ['Short Names', 'Mirror'], patternType: 'symmetric' },
  { name: 'X7X', zone: 'ARCADE', rarity: 'Epic', categories: ['Short Names', 'Mirror', 'Numeric Mix'], patternType: 'symmetric' },
  { name: '777', zone: 'CORE', rarity: 'Epic', categories: ['Short Names', 'Numeric', 'Repeating'], patternType: 'geometric' },
  { name: 'ZZX', zone: 'NEXUS', rarity: 'Rare', categories: ['Short Names', 'Repeating'], patternType: 'symmetric' },
  { name: 'VOX', zone: 'TECH', rarity: 'Uncommon', categories: ['Short Names', 'Tech'], patternType: 'circuit' },
  { name: 'A1', zone: 'CORE', rarity: 'Rare', categories: ['Short Names', 'Numeric Mix'], patternType: 'minimal' },
  { name: 'SKY', zone: 'AURA', rarity: 'Common', categories: ['Short Names'], patternType: 'constellation' },
  { name: 'ION', zone: 'TECH', rarity: 'Common', categories: ['Short Names', 'Tech'], patternType: 'circuit' },
  { name: '808', zone: 'CORE', rarity: 'Uncommon', categories: ['Short Names', 'Numeric', 'Mirror'], patternType: 'symmetric' },
  { name: 'K9', zone: 'ARCADE', rarity: 'Uncommon', categories: ['Short Names', 'Numeric Mix', 'Gaming'], patternType: 'geometric' },
  { name: 'LUX', zone: 'AURA', rarity: 'Common', categories: ['Short Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'ZEN', zone: 'AURA', rarity: 'Common', categories: ['Short Names'], patternType: 'minimal' },

  // Medium Names (4-5 chars)
  { name: 'VEXOR', zone: 'NEXUS', rarity: 'Rare', categories: ['Medium Names', 'Tech', 'Gaming'], patternType: 'circuit' },
  { name: 'RADAR', zone: 'ECHO', rarity: 'Epic', categories: ['Medium Names', 'Mirror', 'Tech'], patternType: 'symmetric' },
  { name: 'AABB', zone: 'ECHO', rarity: 'Uncommon', categories: ['Medium Names', 'Repeating'], patternType: 'geometric' },
  { name: '10001', zone: 'CORE', rarity: 'Rare', categories: ['Medium Names', 'Numeric', 'Mirror'], patternType: 'symmetric' },
  { name: 'CYBER', zone: 'CYBER', rarity: 'Rare', categories: ['Medium Names', 'Tech', 'Gaming'], patternType: 'matrix' },
  { name: 'AURA', zone: 'AURA', rarity: 'Common', categories: ['Medium Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'LEVEL', zone: 'ARCADE', rarity: 'Epic', categories: ['Medium Names', 'Mirror', 'Gaming'], patternType: 'symmetric' },
  { name: 'PULSE', zone: 'TECH', rarity: 'Uncommon', categories: ['Medium Names', 'Tech'], patternType: 'circuit' },
  { name: 'NEO99', zone: 'ARCADE', rarity: 'Rare', categories: ['Medium Names', 'Numeric Mix', 'Repeating'], patternType: 'matrix' },
  { name: 'GHOST', zone: 'NEXUS', rarity: 'Uncommon', categories: ['Medium Names', 'Gaming'], patternType: 'constellation' },
  { name: 'ORBIT', zone: 'CORE', rarity: 'Common', categories: ['Medium Names', 'Tech'], patternType: 'geometric' },
  { name: '70007', zone: 'ECHO', rarity: 'Epic', categories: ['Medium Names', 'Numeric', 'Mirror'], patternType: 'symmetric' },
  { name: 'SYNTH', zone: 'TECH', rarity: 'Uncommon', categories: ['Medium Names', 'Tech'], patternType: 'circuit' },
  { name: 'KRONO', zone: 'CORE', rarity: 'Uncommon', categories: ['Medium Names', 'Rare Words'], patternType: 'geometric' },
  { name: 'PIXEL', zone: 'ARCADE', rarity: 'Common', categories: ['Medium Names', 'Gaming'], patternType: 'geometric' },

  // Long Names (6-8 chars)
  { name: 'NEXORA', zone: 'TECH', rarity: 'Rare', categories: ['Long Names', 'Tech'], patternType: 'circuit' },
  { name: 'ZENTRIO', zone: 'ARCADE', rarity: 'Epic', categories: ['Long Names', 'Gaming', 'Rare Words'], patternType: 'geometric' },
  { name: 'QORVANE', zone: 'CORE', rarity: 'Legendary', categories: ['Long Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'ZEMTARON', zone: 'CORE', rarity: 'Legendary', categories: ['Long Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'ROTATOR', zone: 'ECHO', rarity: 'Legendary', categories: ['Long Names', 'Mirror'], patternType: 'symmetric' },
  { name: '888888', zone: 'CORE', rarity: 'Legendary', categories: ['Long Names', 'Numeric', 'Repeating'], patternType: 'geometric' },
  { name: 'HYPERION', zone: 'TECH', rarity: 'Legendary', categories: ['Long Names', 'Tech', 'Rare Words'], patternType: 'circuit' },
  { name: 'GLITCHX', zone: 'ARCADE', rarity: 'Epic', categories: ['Long Names', 'Gaming', 'Tech'], patternType: 'matrix' },
  { name: 'SOLARIS', zone: 'AURA', rarity: 'Rare', categories: ['Long Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'VOID999', zone: 'NEXUS', rarity: 'Epic', categories: ['Long Names', 'Numeric Mix', 'Repeating'], patternType: 'matrix' },
  { name: 'CHRONOS', zone: 'CORE', rarity: 'Epic', categories: ['Long Names', 'Rare Words'], patternType: 'constellation' },
  { name: 'SPECTRA', zone: 'AURA', rarity: 'Rare', categories: ['Long Names', 'Tech'], patternType: 'iridescent' },
  { name: 'AETHERX', zone: 'NEXUS', rarity: 'Epic', categories: ['Long Names', 'Rare Words', 'Tech'], patternType: 'iridescent' },
  { name: 'OMEGA01', zone: 'CORE', rarity: 'Rare', categories: ['Long Names', 'Numeric Mix', 'Gaming'], patternType: 'geometric' },
  { name: 'LUMINA', zone: 'AURA', rarity: 'Common', categories: ['Long Names', 'Rare Words'], patternType: 'constellation' },

  // Secret & Seasonal special names
  { name: 'GENESIS', zone: 'CORE', rarity: 'Secret', categories: ['Long Names', 'Seasonal', 'Rare Words'], patternType: 'iridescent' },
  { name: '0X0', zone: 'NEXUS', rarity: 'Secret', categories: ['Short Names', 'Mirror', 'Numeric Mix'], patternType: 'symmetric' },
  { name: 'AURORA', zone: 'AURA', rarity: 'Secret', categories: ['Medium Names', 'Seasonal', 'Mirror'], patternType: 'iridescent' }
];

export const TRADEMARK_BLOCKLIST = new Set([
  'GOOGLE', 'TELEGRAM', 'YOUTUBE', 'DISCORD', 'STEAM', 'OPENAI', 'APPLE',
  'MICROSOFT', 'AMAZON', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'TWITTER',
  'BITCOIN', 'ETHEREUM', 'TON', 'NOTCOIN', 'DOGS', 'HAMSTER'
]);

export function detectCategories(name: string): Category[] {
  const cats: Category[] = [];
  const len = name.length;

  if (len >= 1 && len <= 3) cats.push('Short Names');
  else if (len >= 4 && len <= 5) cats.push('Medium Names');
  else if (len >= 6 && len <= 8) cats.push('Long Names');

  const isNum = /^[0-9]+$/.test(name);
  const isAlpha = /^[A-Z]+$/.test(name);
  const isMix = !isNum && !isAlpha;

  if (isNum) cats.push('Numeric');
  if (isMix) cats.push('Numeric Mix');

  // Palindrome check
  const reversed = name.split('').reverse().join('');
  if (name === reversed && len > 1) {
    cats.push('Mirror');
  }

  // Repeating check (e.g. AABB, 777, ZZX)
  const hasRepeating = /(.)\1/.test(name);
  if (hasRepeating) {
    cats.push('Repeating');
  }

  return cats;
}

export function determinePattern(name: string, cats: Category[]): PatternType {
  if (cats.includes('Mirror')) return 'symmetric';
  if (cats.includes('Tech')) return 'circuit';
  if (cats.includes('Numeric')) return 'geometric';
  if (cats.includes('Gaming')) return 'matrix';
  if (name.length <= 2) return 'minimal';
  return 'constellation';
}

export function createInstanceItem(
  template: { name: string; zone: string; rarity: Rarity; categories?: Category[]; patternType?: PatternType },
  instanceSeq: number
): DomainItem {
  const cats = template.categories || detectCategories(template.name);
  const pattern = template.patternType || determinePattern(template.name, cats);
  const instanceNumber = String(instanceSeq).padStart(6, '0');

  return {
    id: `DOM-${instanceNumber}`,
    name: template.name.toUpperCase(),
    zone: template.zone || 'CORE',
    length: template.name.length,
    categories: cats,
    rarity: template.rarity,
    instanceId: `DOM-${instanceNumber}`,
    obtainedAt: new Date().toISOString(),
    visualSeed: Math.abs(hashCode(template.name + instanceNumber)),
    patternType: pattern,
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
