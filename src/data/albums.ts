import { Album, Achievement } from '../types/domain';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'short-names',
    title: 'Short Names',
    description: 'Соберите коллекцию минималистичных имён длиной от 1 до 3 символов.',
    category: 'Short Names',
    targetCount: 15,
    requiredNames: ['X', 'Q7', 'NEX', 'ABA', 'X7X', '777', 'ZZX', 'VOX', 'A1', 'SKY', 'ION', '808', 'K9', 'LUX', 'ZEN'],
    rewardCoins: 100,
    rewardBC: 100,
    rewardXp: 250,
    rewardBadge: '⚡ Master of Brevity',
    completed: false
  },
  {
    id: 'numeric',
    title: 'Numeric & Cyphers',
    description: 'Имена, состоящие исключительно из цифр и числовых паттернов.',
    category: 'Numeric',
    targetCount: 6,
    requiredNames: ['777', '808', '10001', '70007', '888888', '0X0'],
    rewardCoins: 80,
    rewardBC: 80,
    rewardXp: 200,
    rewardBadge: '🔢 Cipher Monarch',
    completed: false
  },
  {
    id: 'mirror',
    title: 'Mirror Palindromes',
    description: 'Идеальные зеркальные комбинации, читающиеся одинаково в обе стороны.',
    category: 'Mirror',
    targetCount: 8,
    requiredNames: ['ABA', 'X7X', '808', 'RADAR', 'LEVEL', '10001', '70007', 'ROTATOR'],
    rewardCoins: 120,
    rewardBC: 120,
    rewardXp: 300,
    rewardBadge: '🪞 Symmetry Seeker',
    completed: false
  },
  {
    id: 'tech',
    title: 'Tech Architecture',
    description: 'Футуристические технологические наименования цифрового фронтира.',
    category: 'Tech',
    targetCount: 10,
    requiredNames: ['NEX', 'VOX', 'ION', 'VEXOR', 'CYBER', 'PULSE', 'SYNTH', 'NEXORA', 'HYPERION', 'SPECTRA'],
    rewardCoins: 100,
    rewardBC: 100,
    rewardXp: 250,
    rewardBadge: '🌐 Cyber Architect',
    completed: false
  },
  {
    id: 'gaming',
    title: 'Arcade & Gaming',
    description: 'Культовые названия игровых вселенных, аркад и киберпространства.',
    category: 'Gaming',
    targetCount: 8,
    requiredNames: ['Q7', 'K9', 'VEXOR', 'LEVEL', 'NEO99', 'PIXEL', 'ZENTRIO', 'GLITCHX'],
    rewardCoins: 100,
    rewardBC: 100,
    rewardXp: 250,
    rewardBadge: '🎮 Arcade Veteran',
    completed: false
  },
  {
    id: 'seasonal',
    title: 'Genesis Archive',
    description: 'Специальная историческая коллекция первой эпохи Domain Empire.',
    category: 'Seasonal',
    targetCount: 3,
    requiredNames: ['GENESIS', '0X0', 'AURORA'],
    rewardCoins: 150,
    rewardBC: 150,
    rewardXp: 500,
    rewardBadge: '🌌 First Pioneer',
    completed: false
  }
];

export const ALBUMS: Album[] = INITIAL_ALBUMS;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Первое открытие',
    description: 'Откройте свой первый набор доменов в игре.',
    icon: '📦',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardCoins: 25,
    rewardBC: 25
  },
  {
    id: 'ach-2',
    title: 'Охотник за редкостью',
    description: 'Получите домен категории Rare или выше.',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 50,
    rewardBC: 50
  },
  {
    id: 'ach-3',
    title: 'Биржевой магнат',
    description: 'Совершите успешную сделку на рынке доменов.',
    icon: '⚖️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 75,
    rewardBC: 75
  },
  {
    id: 'ach-4',
    title: 'Утилизатор',
    description: 'Переработайте 5 ненужных предметов в монеты BC.',
    icon: '♻️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rewardCoins: 40,
    rewardBC: 40
  },
  {
    id: 'ach-5',
    title: 'Легенда империи',
    description: 'Станьте владельцем уникального всемирного домена #1/1.',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 500,
    rewardBC: 500
  }
];
