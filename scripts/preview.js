const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1300, deviceScaleFactor: 1.5 });
  const htmlPath = path.resolve(__dirname, '../report/report.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  const p1 = await page.$('#page-1');
  if (p1) await p1.screenshot({ path: path.join(__dirname, '../report_assets/preview_page_1.png') });

  const p9 = await page.$('#page-9');
  if (p9) await p9.screenshot({ path: path.join(__dirname, '../report_assets/preview_page_9.png') });

  const p21 = await page.$('#page-21');
  if (p21) await p21.screenshot({ path: path.join(__dirname, '../report_assets/preview_page_21.png') });

  console.log('Preview screenshots saved successfully!');
  await browser.close();
})();
