import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log('🚀 Starting Express server for E2E testing...');
  const server = spawn('node', ['server/server.js'], {
    env: { ...process.env, PORT: '10007' },
    stdio: 'inherit'
  });

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

  console.log('📱 Loading Domain Empire at http://localhost:10007 ...');
  await page.goto('http://localhost:10007');
  await page.waitForTimeout(1000);

  // 1. Sites View Screenshot (default central tab!)
  console.log('📸 Taking Sites (Image 1 style) screenshot...');
  await page.screenshot({ path: 'screenshots/sites-view-main.png' });

  // 2. Click "ВЫПУСТИТЬ САЙТ" to trigger cascading roll
  console.log('🎰 Clicking launch button to test downward waterfall cascade...');
  const launchBtn = page.locator('button:has-text("ВЫПУСТИТЬ САЙТ")').first();
  if (await launchBtn.isVisible()) {
    await launchBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/sites-view-spinning.png' });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: 'screenshots/sites-view-revealed.png' });
  }

  // 3. Switch to Hub
  console.log('🏛️ Switching to minimal Hub...');
  await page.locator('nav button:has-text("Главная")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/hub-view-minimal.png' });

  console.log('✅ All tests and screenshots generated successfully!');
  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
