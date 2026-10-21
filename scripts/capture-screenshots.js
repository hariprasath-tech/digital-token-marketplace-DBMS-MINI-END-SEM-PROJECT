const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 720, deviceScaleFactor: 2 });

  // Helper to log in as Hari Prasath (Admin)
  async function loginAsAdmin() {
    await page.evaluate(() => {
      localStorage.setItem('nexus_student_id', '1');
    });
  }

  // 1. First visit to initialize localStorage
  await page.goto('http://localhost:8085/', { waitUntil: 'networkidle0' });
  await loginAsAdmin();
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Fig 4: Dashboard Overview
  console.log('Capturing Fig 4 (Dashboard)...');
  await page.goto('http://localhost:8085/#/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig4_dashboard.png') });

  // Fig 5: Auth Portal (Clear localStorage temporarily)
  console.log('Capturing Fig 5 (Auth Portal)...');
  await page.evaluate(() => localStorage.removeItem('nexus_student_id'));
  await page.goto('http://localhost:8085/#/auth', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig5_auth.png') });

  // Re-login as Admin
  await loginAsAdmin();

  // Fig 6: Campus Activities Catalog
  console.log('Capturing Fig 6 (Activities Catalog)...');
  await page.goto('http://localhost:8085/#/activities', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig6_activities.png') });

  // Fig 7: Token Details Modal
  console.log('Capturing Fig 7 (Token Details Modal)...');
  await page.goto('http://localhost:8085/#/token/1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig7_token_details.png') });

  // Fig 8: Student Vault (My Tokens)
  console.log('Capturing Fig 8 (Student Vault)...');
  await page.goto('http://localhost:8085/#/my-tokens', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig8_vault.png') });

  // Fig 9: Admin Activity Management
  console.log('Capturing Fig 9 (Admin Activities Management)...');
  await page.goto('http://localhost:8085/#/activities', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  // If there is a modal or add button, trigger it
  const addBtn = await page.$('button[data-action="create-activity"], #create-activity-btn, .btn-primary');
  if (addBtn) {
    try { await addBtn.click(); await new Promise(r => setTimeout(r, 600)); } catch(e) {}
  }
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig9_admin_activity.png') });

  // Fig 10: Audit Trail / History
  console.log('Capturing Fig 10 (Audit History)...');
  await page.goto('http://localhost:8085/#/history', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig10_history.png') });

  console.log('All real app screenshots refreshed with live data!');
  await browser.close();
})();
