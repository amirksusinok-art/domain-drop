// Telegram Bot Integration for Domain Empire Mini App

export const BOT_TEXTS = {
  START_MESSAGE: `👑 *Добро пожаловать в Domain Empire!* 🌐

*Domain Empire* — коллекционная экономическая игра внутри Telegram, где вы открываете наборы виртуальных доменных имён, охотитесь за редкими и уникальными доменами, торгуете на бирже и участвуете в аукционах!

✨ *Что вас ждёт в игре:*
• 📦 *Наборы доменов:* открывайте наборы (Free, Basic, Themed, Premium, Vault) с прозрачной математикой выпадения от Common (65%) до Secret (0.05%).
• 🎰 *Динамическая барабанная прокрутка:* количество слотов барабана в точности равно длине имени от 1 до 8 символов (\`x7.io\` — 2 барабана, \`google.com\` — 6, \`telegram.com\` — 8)!
• 👑 *Статус Unique:* 9 легендарных предметов (\`nova.com\`, \`x7.io\`, \`telegram.com\`, \`google.com\`, \`openai.com\` и др.) существуют СТРОГО в 1 экземпляре на весь мир!
• ⚖️ *Биржа & Аукционы:* выставляйте предметы на продажу, делайте ставки на редкие лоты в валюте *BC* и забирайте трофеи.
• ♻️ *Переработка:* мгновенный выкуп ненужных предметов в монеты *BC* для продолжения игры даже при нулевом балансе.
• 🪙 *Игровая валюта:* *BC* (Domain Empire Coins) зарабатывается за вход, задания и сделки.

👇 *Нажмите кнопку ниже, чтобы войти в империю доменов!*`,

  GOAL_MESSAGE: `🎯 *Цели и дорожная карта коллекционера в Domain Empire:*

🏆 *Главные цели сезона:*
1. 👑 *Охота за Unique-артефактами:* успеть выбить один из 9 всемирных уникальных экземпляров (\`telegram.com\`, \`x7.io\`, \`nova.com\`, \`google.com\`, \`openai.com\`) до того, как их заберут другие!
2. 📦 *Мастер открытий:* открыть все 5 типов наборов, исследуя зоны \`.com\`, \`.io\`, \`.dev\`, \`.app\`, \`.gg\`.
3. 💼 *Барон биржи:* успешно продать 3 домена на внутреннем рынке и заработать более 1 000 BC.
4. 🔨 *Победа на аукционе:* выиграть редкий лот со ставкой на последних секундах таймера.
5. 📚 *Закрыть тематические альбомы:* собрать коллекцию «Short Giants» (1–3 символа) и «Mirror Palindromes».
6. 💎 *Поддерживать серию входа:* забирать +50 BC ежедневно и открывать бесплатный набор каждые 24 часа!

🌟 *Философия Domain Empire:*
Все предметы являются виртуальными игровыми коллекционными ценностями. Абсолютно честная серверная генерация, защита от дубликатов уникальных предметов, перераспределение вероятностей и доступность игры без обязательных платежей!`,

  HELP_MESSAGE: `📖 *Справочник и правила Domain Empire:*

1. Все имена состоят строго из 1–8 английских символов и цифр (доменные зоны .com, .io, .dev в длину не входят).
2. 6 градаций редкости: Common, Uncommon, Rare, Epic, Legendary, Secret.
3. Unique — отдельный статус, означающий единственный экземпляр на весь сервер.
4. Вы можете переработать ненужные предметы в монеты BC (Common 5 BC, Uncommon 12 BC, Rare 30 BC, Epic 75 BC).
5. На рынке и аукционах цены устанавливают сами игроки в монетах BC.`
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
        { command: 'start', description: 'Запустить Domain Empire и открыть игру' },
        { command: 'goal', description: 'Цели и дорожная карта коллекционера' },
        { command: 'help', description: 'Справочник правил и экономика BC' }
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
  console.log('🤖 Telegram Bot polling started successfully for Domain Empire.');
}

async function handleMessage(message, apiBase, appUrl) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();

  let replyText = BOT_TEXTS.START_MESSAGE;
  let replyMarkup = {
    inline_keyboard: [
      [{ text: '👑 Играть в Domain Empire', web_app: { url: appUrl } }],
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
        [{ text: '🚀 Открыть Domain Empire', web_app: { url: appUrl } }]
      ]
    };
  } else if (text.startsWith('/help')) {
    replyText = BOT_TEXTS.HELP_MESSAGE;
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
  } catch (err) {
    console.error('Error sending bot response:', err);
  }
}
