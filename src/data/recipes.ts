import { CraftRecipe } from '../types/domain';

export const CRAFT_RECIPES: CraftRecipe[] = [
  {
    id: 'recipe-mirror-synth',
    title: 'Зеркальный Синтез',
    description: 'Объедините 3 предмета категории Short Names для создания редкого палиндрома в зоне ECHO.',
    costCoins: 30,
    inputCriteria: {
      category: 'Short Names',
      count: 3,
      description: '3 предмета Short Names'
    },
    outputPreview: {
      rarity: 'Epic',
      category: 'Mirror',
      zone: 'ECHO',
      possibleNames: ['X7X', 'RADAR', 'LEVEL']
    }
  },
  {
    id: 'recipe-cyber-forge',
    title: 'Кибернетическая Ковка',
    description: 'Трансформируйте 3 предмета категории Tech в продвинутый предмет киберпространства.',
    costCoins: 25,
    inputCriteria: {
      category: 'Tech',
      count: 3,
      description: '3 предмета Tech'
    },
    outputPreview: {
      rarity: 'Rare',
      category: 'Tech',
      zone: 'TECH',
      possibleNames: ['CYBER', 'NEXORA', 'PULSE']
    }
  },
  {
    id: 'recipe-quantum-ascend',
    title: 'Квантовая Трансмутация',
    description: 'Используйте 2 предмета редкости Rare для создания гарантированного Legendary предмета.',
    costCoins: 50,
    inputCriteria: {
      rarity: 'Rare',
      count: 2,
      description: '2 предмета Rare'
    },
    outputPreview: {
      rarity: 'Legendary',
      category: 'Rare Words',
      zone: 'CORE',
      possibleNames: ['QORVANE', 'ZEMTARON', 'HYPERION']
    }
  },
  {
    id: 'recipe-cipher-matrix',
    title: 'Числовая Матрица',
    description: 'Преобразуйте 2 предмета Numeric в чистый гармонический числовой код.',
    costCoins: 20,
    inputCriteria: {
      category: 'Numeric',
      count: 2,
      description: '2 предмета Numeric'
    },
    outputPreview: {
      rarity: 'Epic',
      category: 'Numeric',
      zone: 'CORE',
      possibleNames: ['777', '10001', '70007']
    }
  }
];
