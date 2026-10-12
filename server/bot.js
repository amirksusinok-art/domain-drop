// Telegram Bot Integration for DomainDrop Mini App

export const BOT_TEXTS = {
  START_MESSAGE: `🌐 *Добро пожаловать в DomainDrop (Domain Empire)!* 💎

*DomainDrop* — интеллектуальная коллекционная игра внутри Telegram, где вы исследуете редкие комбинации букв и цифр, решаете логические задания и создаёте собственную библиотеку редких игровых имён!

✨ *Что вас ждёт в игре:*
• 🎴 *Уникальные визуальные карточки:* каждое имя (от 1 до 8 символов) имеет процедурный геометрический узор, игровую зону (\`TECH\`, \`ARCADE\`, \`CORE\`, \`ECHO\`) и индивидуальный \`instance_id\`.
• 🔍 *Domain Scanner:* логические головоломки на поиск палиндромов, повторяющихся последовательностей и числовых кодов с предсказуемыми наградами.
• 📚 *Коллекционные альбомы:* фиксированные серии (Short Names, Mirror Palindromes, Numeric Cyphers, Cyber Architecture) с щедрыми бонусами.
• 🛠️ *Domain Workshop:* детерминированная мастерская для объединения дубликатов в редкие и легендарные артефакты.
• 🪙 *Честная экономика:* внутриигровая валюта *Domain Coins (DC)* зарабатывается исключительно игровыми действиями.

👇 *Нажмите кнопку ниже, чтобы запустить игру!*`,

  GOAL_MESSAGE: `🎯 *Цели и дорожная карта коллекционера в DomainDrop:*

🏆 *Текущие цели коллекционера:*
1. 📈 *Повысить уровень коллекционера:* решайте ежедневные задачи сканера, получайте опыт (XP) и открывайте новые категории заданий.
2. 🪞 *Собрать зеркальные палиндромы:* закройте альбом «Mirror Palindromes» (ABA, RADAR, 10001, ROTATOR) и получите титул *Symmetry Seeker*.
3. ⚡ *Освоить лаконичность:* найдите 15 коротких имён длиной 1–3 символа (\`X\`, \`Q7\`, \`NEX\`, \`777\`).
4. 🛠️ *Мастер квантового крафта:* объедините редкие дубликаты в мастерской и скуйте легендарные предметы (\`QORVANE\`, \`ZEMTARON\`).
5. 🔥 *Поддерживать серию входа:* забирайте ежедневный бонус +10 DC каждый день!

🌟 *Миссия проекта DomainDrop:*
Доказать, что коллекционирование и логические исследования красивых буквенно-цифровых узоров увлекательнее случайных ставок и рулеток. Никакого рандома вслепую — только чистый интеллект, эстетика и предсказуемый прогресс!`,

  HELP_MESSAGE: `📖 *Правила игры DomainDrop:*

1. Все имена состоят строго из 1–8 английских букв и цифр.
2. Имена разделены по категориям: Short (1-3C), Medium (4-5C), Long (6-8C), Mirror, Numeric, Tech, Gaming.
3. Каждое имя привязано к игровой зоне (например, \`NEXORA / TECH\`). Это не интернет-домены, а коллекционные игровые объекты.
4. Выполняйте задачи в Domain Scanner или используйте радар для открытия новых предметов.
5. Зарабатывайте Domain Coins (DC) за ежедневный вход и выполнение задач.
6. В мастерской (Workshop) можно объединить 3 предмета одной категории в гарантированный результат!`,

  TOP_MESSAGE: `🏅 *Зал славы коллекционеров DomainDrop:*

1. 🥇 @alex_domain — Lvl 18 • 32 предмета • 🪞 Master of Symmetry
2. 🥈 @crypto_keeper — Lvl 15 • 28 предметов • ⚡ Short Specialist
3. 🥉 @matrix_runner — Lvl 12 • 22 предмета • 🌐 Cyber Architect
4. 🎖️ @qorvane_fan — Lvl 10 • 19 предметов • 🔢 Cipher King

Ваш текущий ранг обновляется в профиле Mini App!`
};

export function setupBot(botToken, appUrl) {
  if (!botToken) {
    console.log('BOT_TOKEN not provided, running in standalone/web mode.');
    return;
  }

  const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

  // Register bot commands with Telegram BotFather API
  fetch(`${TELEGRAM_API}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [
        { command: 'start', description: 'Запустить DomainDrop и открыть игру' },
        { command: 'goal', description: 'Цели и дорожная карта коллекционера' },
        { command: 'scanner', description: 'Логические испытания Domain Scanner' },
        { command: 'help', description: 'Правила игры и руководство' },
        { command: 'top', description: 'Таблица рекордов коллекционеров' }
      ]
    })
  }).catch((err) => console.error('Error setting bot commands:', err));

  // Long-polling loop
  let offset = 0;
  async function pollUpdates() {
    try {
      const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${offset}&timeout=30`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            offset = update.update_id + 1;
            if (update.message && update.message.text) {
              await handleMessage(update.message, TELEGRAM_API, appUrl);
            }
          }
        }
      }
    } catch (e) {
      // Quiet fail on network hiccups
    }
    setTimeout(pollUpdates, 1500);
  }

  pollUpdates();
  console.log('🤖 Telegram Bot polling started successfully.');
}

async function handleMessage(message, apiBase, appUrl) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();

  let replyText = BOT_TEXTS.START_MESSAGE;
  let replyMarkup = {
    inline_keyboard: [
      [{ text: '🌐 Играть в DomainDrop', web_app: { url: appUrl } }],
      [
        { text: '🎯 Мои цели (/goal)', callback_data: 'cmd_goal' },
        { text: '📖 Правила (/help)', callback_data: 'cmd_help' }
      ]
    ]
  };

  if (text.startsWith('/goal')) {
    replyText = BOT_TEXTS.GOAL_MESSAGE;
    replyMarkup = {
      inline_keyboard: [
        [{ text: '🚀 Запустить Mini App', web_app: { url: appUrl } }]
      ]
    };
  } else if (text.startsWith('/help')) {
    replyText = BOT_TEXTS.HELP_MESSAGE;
  } else if (text.startsWith('/top')) {
    replyText = BOT_TEXTS.TOP_MESSAGE;
  } else if (text.startsWith('/scanner')) {
    replyText = `🔍 *Domain Scanner готов к запуску!*\n\nПерейдите в приложение, чтобы исследовать редкие имена:`;
    replyMarkup = {
      inline_keyboard: [
        [{ text: '🔍 Открыть Scanner', web_app: { url: appUrl } }]
      ]
    };
  }

  try {
    await fetch(`${apiBase}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      })
    });
  } catch (e) {
    console.error('Error sending message:', e);
  }
}
