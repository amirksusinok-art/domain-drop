import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log('🚀 Starting Express server for E2E testing...');
  const server = spawn('node', ['server/server.js'], {
    env: { ...process.env, PORT: '10006' },
    stdio: 'inherit'
  });

  // Wait 1.5s for server to start
  await new Promise(r => setTimeout(r, 1500));

  console.log('🌐 Launching Chromium browser with mobile viewport...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  // Mock Telegram WebApp object
  await page.addInitScript(() => {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        expand: () => {},
        colorScheme: 'dark',
        themeParams: {
          bg_color: '#090c12',
          text_color: '#f8fafc',
          hint_color: '#94a3b8',
          link_color: '#38bdf8'
        },
        HapticFeedback: {
          impactOccurred: () => {},
          notificationOccurred: () => {},
          selectionChanged: () => {}
        },
        initData: 'query_id=test&user=%7B%22id%22%3A10842099%2C%22first_name%22%3A%22Alex%22%2C%22username%22%3A%22alex_collector%22%7D&auth_date=1700000000&hash=mock',
        initDataUnsafe: {
          user: { id: 10842099, first_name: 'Alex', username: 'alex_collector' }
        }
      }
    };
  });

  console.log('📱 Loading Domain Empire at http://localhost:10006 ...');
  await page.goto('http://localhost:10006');
  await page.waitForTimeout(1000);

  // 1. Hub Screenshot
  console.log('📸 Taking Hub screenshot...');
  await page.screenshot({ path: 'screenshots/domain-empire-hub.png' });

  // 2. Click Packs Tab in nav
  console.log('📦 Switching to Packs tab...');
  await page.locator('nav button:has-text("Наборы")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/domain-empire-packs.png' });

  // 3. Open Basic Pack to test Dynamic Reel
  console.log('🎰 Opening Basic Pack to test dynamic reel spin...');
  const openBasicBtn = page.locator('button:has-text("100 BC ⚡")').first();
  if (await openBasicBtn.isVisible()) {
    await openBasicBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/domain-empire-reel-spinning.png' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'screenshots/domain-empire-reel-revealed.png' });

    // Close reveal modal
    const closeBtn = page.locator('button:has-text("В коллекцию")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  }

  // 4. Click Inventory Tab in nav
  console.log('🗃️ Switching to Inventory tab...');
  await page.locator('nav button:has-text("Инвентарь")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/domain-empire-inventory.png' });

  // 5. Click Market Tab in nav
  console.log('⚖️ Switching to Market tab...');
  await page.locator('nav button:has-text("Биржа")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/domain-empire-market.png' });

  // 6. Click Profile Tab in nav (Settings & Themes)
  console.log('👤 Switching to Profile & Settings tab...');
  await page.locator('nav button:has-text("Профиль")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/domain-empire-settings.png' });

  // 7. Switch theme to Midnight
  console.log('🎨 Switching theme to Midnight Navy...');
  const midnightBtn = page.locator('button:has-text("Midnight")');
  if (await midnightBtn.isVisible()) {
    await midnightBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/domain-empire-theme-midnight.png' });
  }

  // 8. Click Unique Registry tab
  console.log('👑 Switching to Unique Registry subtab...');
  const uniqueBtn = page.locator('button:has-text("Реестр Unique")');
  if (await uniqueBtn.isVisible()) {
    await uniqueBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/domain-empire-unique-registry.png' });
  }

  console.log('✅ All E2E test steps and screenshots completed successfully!');
  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
