import { ScannerTask } from '../types/domain';

export const SCANNER_TASKS: ScannerTask[] = [
  {
    id: 'task-1',
    type: 'palindrome',
    difficulty: 'easy',
    title: 'Поиск симметрии',
    description: 'Какое из предложенных имён является истинным палиндромом (читается зеркально одинаково)?',
    options: ['VEXOR', 'RADAR', 'ZENTRIO', 'NEXORA'],
    correctIndex: 1,
    hint: 'Слово R-A-D-A-R читается справа налево точно так же, как и слева направо.',
    rewardCoins: 10,
    rewardXp: 40,
    rewardItemPreview: {
      name: 'RADAR',
      zone: 'ECHO',
      rarity: 'Epic',
      category: 'Mirror'
    }
  },
  {
    id: 'task-2',
    type: 'shortest',
    difficulty: 'easy',
    title: 'Анализ длины символов',
    description: 'Определите самое короткое коллекционное имя среди вариантов:',
    options: ['ZEMTARON', 'CYBER', 'Q7', 'ROTATOR'],
    correctIndex: 2,
    hint: 'Q7 содержит всего 2 символа, относясь к категории Short Names.',
    rewardCoins: 10,
    rewardXp: 35,
    rewardItemPreview: {
      name: 'Q7',
      zone: 'ARCADE',
      rarity: 'Epic',
      category: 'Short Names'
    }
  },
  {
    id: 'task-3',
    type: 'repeating',
    difficulty: 'medium',
    title: 'Детектор дубликатов',
    description: 'В каком имени содержится максимальное число одинаковых повторяющихся символов?',
    options: ['888888', 'HYPERION', 'SPECTRA', 'ORBIT'],
    correctIndex: 0,
    hint: '888888 состоит из 6 одинаковых символов цифры 8.',
    rewardCoins: 15,
    rewardXp: 50,
    rewardItemPreview: {
      name: '888888',
      zone: 'CORE',
      rarity: 'Legendary',
      category: 'Repeating'
    }
  },
  {
    id: 'task-4',
    type: 'missing_char',
    difficulty: 'medium',
    title: 'Восстановление последовательности',
    description: 'Какая цифра завершает симметричный числовой код: 7 - 0 - 0 - 0 - [ ? ]',
    options: ['1', '9', '7', '0'],
    correctIndex: 2,
    hint: 'Зеркальный палиндром 70007 требует одинаковых крайних символов.',
    rewardCoins: 15,
    rewardXp: 45,
    rewardItemPreview: {
      name: '70007',
      zone: 'ECHO',
      rarity: 'Epic',
      category: 'Mirror'
    }
  },
  {
    id: 'task-5',
    type: 'palindrome',
    difficulty: 'hard',
    title: 'Длинный зеркальный код',
    description: 'Найдите 7-символьный зеркальный палиндром в зоне ECHO:',
    options: ['ROTATOR', 'ZEMTARON', 'GLITCHX', 'SPECTRA'],
    correctIndex: 0,
    hint: 'R-O-T-A-T-O-R зеркально симметричен относительно центральной буквы A.',
    rewardCoins: 20,
    rewardXp: 60,
    rewardItemPreview: {
      name: 'ROTATOR',
      zone: 'ECHO',
      rarity: 'Legendary',
      category: 'Mirror'
    }
  },
  {
    id: 'task-6',
    type: 'pattern',
    difficulty: 'medium',
    title: 'Смешанный паттерн',
    description: 'Какая комбинация относится к категории Numeric Mix (буквы + цифры)?',
    options: ['CYBER', '10001', 'NEO99', 'NEXORA'],
    correctIndex: 2,
    hint: 'NEO99 содержит буквы NEO и цифры 99.',
    rewardCoins: 15,
    rewardXp: 40,
    rewardItemPreview: {
      name: 'NEO99',
      zone: 'ARCADE',
      rarity: 'Rare',
      category: 'Numeric Mix'
    }
  }
];
