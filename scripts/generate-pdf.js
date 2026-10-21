const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Chrome to render PDF...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, '../report/report.html');
  console.log('Navigating to:', htmlPath);

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Small delay to ensure all base64 fonts & images are fully decoded
  await new Promise(r => setTimeout(r, 2000));

  const outputPath = path.resolve(__dirname, '../Digital_Token_Marketplace_DBMS_Report.pdf');
  console.log('Generating PDF at:', outputPath);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  console.log('PDF generated successfully!');
  await browser.close();

  // Check file size
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`Generated PDF size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }
})();
