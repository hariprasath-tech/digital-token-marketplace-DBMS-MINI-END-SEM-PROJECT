const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 480, deviceScaleFactor: 2 });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      body { background: #f8fafc; padding: 15px; }
      .app-frame { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; overflow: hidden; }
      .top-nav { background: #0f172a; color: white; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
      .brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }
      .dot { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; }
      .body-content { display: flex; }
      .sidebar { width: 180px; border-right: 1px solid #e2e8f0; background: #fafbfc; padding: 16px 12px; font-size: 12px; color: #64748b; }
      .sidebar-item { padding: 8px 10px; border-radius: 6px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
      .sidebar-item.active { background: #e0f2fe; color: #0284c7; font-weight: 600; }
      .main { flex: 1; padding: 20px 24px; }
      .page-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
      .page-subtitle { font-size: 11px; color: #94a3b8; margin-bottom: 16px; }
      .table-card { border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: white; }
      .table-header-info { padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #334155; }
      .table-header-info span { font-weight: 400; color: #94a3b8; font-size: 11px; margin-left: 6px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; }
      th { background: #f1f5f9; padding: 8px 14px; font-weight: 600; color: #475569; border-bottom: 1px solid #cbd5e1; }
      td { padding: 9px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
      .badge { display: inline-block; padding: 2px 7px; border-radius: 10px; font-size: 9px; font-weight: 600; letter-spacing: 0.3px; }
      .badge-avail { background: #dcfce7; color: #15803d; }
      .badge-pending { background: #fef3c7; color: #b45309; }
      .badge-trans { background: #e0f2fe; color: #0369a1; }
      .badge-used { background: #f1f5f9; color: #475569; }
      .table-footer { padding: 8px 14px; background: #fafbfc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
      .count-tag { color: #0284c7; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="app-frame">
      <div class="top-nav">
        <div class="brand"><span class="dot"></span> TokenMarketplace DBMS</div>
        <div>Help &bull; Admin: Hari Prasath &#9662;</div>
      </div>
      <div class="body-content">
        <div class="sidebar">
          <div class="sidebar-item">&#9638; Marketplace</div>
          <div class="sidebar-item">&#9776; Campus Activities</div>
          <div class="sidebar-item">&#9643; Token Vault</div>
          <div class="sidebar-item active">&#9881; Database Admin</div>
        </div>
        <div class="main">
          <div class="page-title">Database Records</div>
          <div class="page-subtitle">Inspect persisted digital tokens and relational integrity in MySQL 8.</div>
          
          <div class="table-card">
            <div class="table-header-info">
              digital_tokens
              <span>digital_token_marketplace / digital_tokens</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>token_id</th>
                  <th>token_code</th>
                  <th>activity_id</th>
                  <th>owner_student_id</th>
                  <th>seat_or_slot</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><strong>TKN-GAI-2026-001</strong></td>
                  <td>1</td>
                  <td>1 (Hari Prasath)</td>
                  <td>Seat A-14 (GPU Workstation)</td>
                  <td><span class="badge badge-avail">AVAILABLE</span></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><strong>TKN-HCK-2026-002</strong></td>
                  <td>2</td>
                  <td>2 (Priya S)</td>
                  <td>Team Table B-04</td>
                  <td><span class="badge badge-pending">TRANSFER_PENDING</span></td>
                </tr>
                <tr>
                  <td>6</td>
                  <td><strong>TKN-K8S-2026-006</strong></td>
                  <td>6</td>
                  <td>1 (Hari Prasath)</td>
                  <td>Seat C-08</td>
                  <td><span class="badge badge-trans">TRANSFERRED</span></td>
                </tr>
                <tr>
                  <td>7</td>
                  <td><strong>TKN-GAI-2026-007</strong></td>
                  <td>1</td>
                  <td>2 (Priya S)</td>
                  <td>Seat A-15</td>
                  <td><span class="badge badge-used">USED</span></td>
                </tr>
              </tbody>
            </table>
            <div class="table-footer">
              <span class="count-tag">4 rows displayed</span>
              <span>Primary keys and foreign keys preserve student and event ownership integrity.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig11_mysql_records.png') });
  console.log('fig11_mysql_records.png created successfully!');
  await browser.close();
})();
