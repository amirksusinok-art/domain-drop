export const TRADEMARK_BLOCKLIST = new Set([
  'GOOGLE', 'TELEGRAM', 'YOUTUBE', 'DISCORD', 'STEAM', 'OPENAI', 'APPLE',
  'MICROSOFT', 'AMAZON', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'TWITTER',
  'BITCOIN', 'ETHEREUM', 'TON', 'NOTCOIN', 'DOGS', 'HAMSTER'
]);

export function validateDomainName(name) {
  if (!name || typeof name !== 'string') return false;
  const upper = name.toUpperCase().trim();
  if (upper.length < 1 || upper.length > 8) return false;
  if (!/^[A-Z0-9]+$/.test(upper)) return false;
  if (TRADEMARK_BLOCKLIST.has(upper)) return false;
  return true;
}

export function detectCategories(name) {
  const cats = [];
  const len = name.length;

  if (len >= 1 && len <= 3) cats.push('Short Names');
  else if (len >= 4 && len <= 5) cats.push('Medium Names');
  else if (len >= 6 && len <= 8) cats.push('Long Names');

  const isNum = /^[0-9]+$/.test(name);
  const isAlpha = /^[A-Z]+$/.test(name);
  if (isNum) cats.push('Numeric');
  if (!isNum && !isAlpha) cats.push('Numeric Mix');

  const reversed = name.split('').reverse().join('');
  if (name === reversed && len > 1) cats.push('Mirror');
  if (/(.)\1/.test(name)) cats.push('Repeating');

  return cats;
}
