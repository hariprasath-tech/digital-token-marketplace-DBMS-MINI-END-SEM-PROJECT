const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // -------------------------------------------------------------
  // 1. FIG 1: ER DIAGRAM
  // -------------------------------------------------------------
  await page.setViewport({ width: 950, height: 420, deviceScaleFactor: 2 });
  const erdHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; }
      body { background: white; padding: 20px; display: flex; flex-direction: column; align-items: center; }
      .title { font-weight: bold; font-size: 14px; text-transform: uppercase; margin-bottom: 25px; letter-spacing: 0.5px; }
      .diagram-container { position: relative; width: 900px; height: 320px; border: 1px solid #111; }
      .entity-box { position: absolute; border: 1.5px solid black; background: white; z-index: 2; }
      .entity-header { border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 4px 6px; font-size: 12px; background: #fafafa; }
      .entity-body { padding: 6px 10px; font-size: 10px; line-height: 1.5; font-family: monospace; }
      svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
      .cardinality { font-weight: bold; font-size: 11px; font-family: 'Times New Roman'; }
      .caption-text { font-size: 9px; font-family: Arial, sans-serif; text-align: center; margin-top: 8px; color: #333; }
    </style>
  </head>
  <body>
    <div class="title">DIGITAL TOKEN MARKETPLACE – ENTITY RELATIONSHIP DIAGRAM</div>
    <div class="diagram-container">
      <svg>
        <!-- STUDENTS to DIGITAL_TOKENS -->
        <line x1="200" y1="90" x2="350" y2="90" stroke="black" stroke-width="1.5" />
        <!-- CAMPUS_ACTIVITIES to DIGITAL_TOKENS -->
        <line x1="700" y1="90" x2="570" y2="90" stroke="black" stroke-width="1.5" />
        <!-- DIGITAL_TOKENS to TOKEN_TRANSFER_REQUESTS -->
        <line x1="460" y1="180" x2="460" y2="230" stroke="black" stroke-width="1.5" />
        <!-- STUDENTS to TOKEN_TRANSFER_REQUESTS -->
        <path d="M 120 180 L 120 280 L 330 280" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="4,2" />
        <!-- DIGITAL_TOKENS to TOKEN_TRANSFER_HISTORY -->
        <path d="M 570 140 L 750 140 L 750 230" fill="none" stroke="black" stroke-width="1.5" />
      </svg>

      <!-- STUDENTS BOX -->
      <div class="entity-box" style="left: 30px; top: 25px; width: 170px;">
        <div class="entity-header">STUDENTS</div>
        <div class="entity-body">
          PK student_id<br>
          &nbsp;&nbsp;&nbsp;roll_no (UNIQUE)<br>
          &nbsp;&nbsp;&nbsp;name<br>
          &nbsp;&nbsp;&nbsp;email (UNIQUE)<br>
          &nbsp;&nbsp;&nbsp;department<br>
          &nbsp;&nbsp;&nbsp;role
        </div>
      </div>

      <!-- DIGITAL_TOKENS BOX (CENTER) -->
      <div class="entity-box" style="left: 350px; top: 15px; width: 220px;">
        <div class="entity-header">DIGITAL_TOKENS</div>
        <div class="entity-body">
          PK token_id<br>
          FK activity_id<br>
          FK owner_student_id<br>
          &nbsp;&nbsp;&nbsp;token_code (UNIQUE)<br>
          &nbsp;&nbsp;&nbsp;status<br>
          &nbsp;&nbsp;&nbsp;seat_or_slot<br>
          &nbsp;&nbsp;&nbsp;valid_from, expiry_date
        </div>
      </div>

      <!-- CAMPUS_ACTIVITIES BOX -->
      <div class="entity-box" style="left: 700px; top: 25px; width: 170px;">
        <div class="entity-header">CAMPUS_ACTIVITIES</div>
        <div class="entity-body">
          PK activity_id<br>
          &nbsp;&nbsp;&nbsp;title<br>
          &nbsp;&nbsp;&nbsp;category<br>
          &nbsp;&nbsp;&nbsp;venue<br>
          &nbsp;&nbsp;&nbsp;organizer<br>
          &nbsp;&nbsp;&nbsp;activity_date
        </div>
      </div>

      <!-- TOKEN_TRANSFER_REQUESTS BOX -->
      <div class="entity-box" style="left: 330px; top: 225px; width: 260px;">
        <div class="entity-header">TOKEN_TRANSFER_REQUESTS</div>
        <div class="entity-body">
          PK request_id<br>
          FK token_id, FK requester_student_id, FK owner_student_id<br>
          &nbsp;&nbsp;&nbsp;request_status, request_reason, requested_at
        </div>
      </div>

      <!-- TOKEN_TRANSFER_HISTORY BOX -->
      <div class="entity-box" style="left: 650px; top: 225px; width: 220px;">
        <div class="entity-header">TOKEN_TRANSFER_HISTORY</div>
        <div class="entity-body">
          PK history_id<br>
          FK token_id, FK request_id<br>
          FK from_student_id, FK to_student_id<br>
          &nbsp;&nbsp;&nbsp;transferred_at, remarks
        </div>
      </div>

      <!-- LABELS -->
      <div style="position: absolute; left: 210px; top: 72px;" class="cardinality">1</div>
      <div style="position: absolute; left: 330px; top: 72px;" class="cardinality">N</div>
      <div style="position: absolute; left: 260px; top: 95px; font-size: 10px;">owns</div>

      <div style="position: absolute; left: 680px; top: 72px;" class="cardinality">1</div>
      <div style="position: absolute; left: 580px; top: 72px;" class="cardinality">N</div>
      <div style="position: absolute; left: 620px; top: 95px; font-size: 10px;">defines</div>

      <div style="position: absolute; left: 470px; top: 190px;" class="cardinality">1</div>
      <div style="position: absolute; left: 470px; top: 210px;" class="cardinality">N</div>
    </div>
    <div class="caption-text">One STUDENT can own multiple DIGITAL_TOKENS; each DIGITAL_TOKEN belongs to one STUDENT and one CAMPUS_ACTIVITY.<br>Token transfers are recorded immutably in TOKEN_TRANSFER_HISTORY with atomic row locking.</div>
  </body>
  </html>
  `;
  await page.setContent(erdHtml);
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig1_erd.png') });
  console.log('fig1_erd.png created!');

  // -------------------------------------------------------------
  // 2. FIG 2: SCHEMA DIAGRAM
  // -------------------------------------------------------------
  await page.setViewport({ width: 950, height: 380, deviceScaleFactor: 2 });
  const schemaHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; }
      body { background: white; padding: 20px; display: flex; flex-direction: column; align-items: center; }
      .diagram-container { position: relative; width: 900px; height: 340px; border: 1px solid #111; }
      .table-box { position: absolute; border: 1px solid black; background: white; font-family: Arial, sans-serif; }
      .table-header { border-bottom: 1px solid black; font-weight: bold; text-align: center; padding: 4px; font-size: 11px; background: #f5f5f5; }
      .table-fields { padding: 6px 8px; font-size: 9.5px; line-height: 1.45; font-family: 'Consolas', monospace; color: #222; }
      svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div class="diagram-container">
      <svg>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
          </marker>
        </defs>
        <!-- Arrow: DIGITAL_TOKENS.owner_student_id -> STUDENTS.student_id -->
        <line x1="330" y1="50" x2="230" y2="50" stroke="#333" stroke-width="1.2" marker-end="url(#arrow)" />
        <!-- Arrow: DIGITAL_TOKENS.activity_id -> CAMPUS_ACTIVITIES.activity_id -->
        <line x1="590" y1="50" x2="680" y2="50" stroke="#333" stroke-width="1.2" marker-end="url(#arrow)" />
        <!-- Arrow: TOKEN_TRANSFER_REQUESTS.token_id -> DIGITAL_TOKENS.token_id -->
        <line x1="460" y1="210" x2="460" y2="155" stroke="#333" stroke-width="1.2" marker-end="url(#arrow)" />
        <!-- Arrow: TOKEN_TRANSFER_HISTORY.token_id -> DIGITAL_TOKENS.token_id -->
        <path d="M 680 250 L 630 250 L 630 110 L 590 110" fill="none" stroke="#333" stroke-width="1.2" marker-end="url(#arrow)" />
      </svg>

      <!-- STUDENTS TABLE -->
      <div class="table-box" style="left: 20px; top: 15px; width: 210px;">
        <div class="table-header">STUDENTS</div>
        <div class="table-fields">
          <b>student_id INT PK</b><br>
          roll_no VARCHAR(50) UNIQUE<br>
          name VARCHAR(100)<br>
          email VARCHAR(100) UNIQUE<br>
          password_hash VARCHAR(255)<br>
          department VARCHAR(50)<br>
          year_of_study INT<br>
          role VARCHAR(20)
        </div>
      </div>

      <!-- DIGITAL_TOKENS TABLE -->
      <div class="table-box" style="left: 330px; top: 15px; width: 260px;">
        <div class="table-header">DIGITAL_TOKENS</div>
        <div class="table-fields">
          <b>token_id INT PK</b><br>
          token_code VARCHAR(64) UNIQUE<br>
          <i>activity_id INT FK &rarr; CAMPUS_ACTIVITIES</i><br>
          <i>owner_student_id INT FK &rarr; STUDENTS</i><br>
          status VARCHAR(20)<br>
          valid_from DATETIME<br>
          expiry_date DATETIME<br>
          seat_or_slot VARCHAR(50)
        </div>
      </div>

      <!-- CAMPUS_ACTIVITIES TABLE -->
      <div class="table-box" style="left: 680px; top: 15px; width: 200px;">
        <div class="table-header">CAMPUS_ACTIVITIES</div>
        <div class="table-fields">
          <b>activity_id INT PK</b><br>
          title VARCHAR(150)<br>
          category VARCHAR(30)<br>
          venue VARCHAR(100)<br>
          organizer VARCHAR(100)<br>
          activity_date DATETIME<br>
          total_capacity INT
        </div>
      </div>

      <!-- TOKEN_TRANSFER_REQUESTS TABLE -->
      <div class="table-box" style="left: 260px; top: 210px; width: 330px;">
        <div class="table-header">TOKEN_TRANSFER_REQUESTS</div>
        <div class="table-fields">
          <b>request_id INT PK</b><br>
          <i>token_id INT FK &rarr; DIGITAL_TOKENS</i><br>
          <i>requester_student_id INT FK &rarr; STUDENTS</i><br>
          <i>owner_student_id INT FK &rarr; STUDENTS</i><br>
          request_status VARCHAR(20)<br>
          request_reason VARCHAR(255), requested_at TIMESTAMP
        </div>
      </div>

      <!-- TOKEN_TRANSFER_HISTORY TABLE -->
      <div class="table-box" style="left: 680px; top: 210px; width: 200px;">
        <div class="table-header">TOKEN_TRANSFER_HISTORY</div>
        <div class="table-fields">
          <b>history_id INT PK</b><br>
          <i>token_id INT FK &rarr; DIGITAL_TOKENS</i><br>
          <i>from_student_id INT FK &rarr; STUDENTS</i><br>
          <i>to_student_id INT FK &rarr; STUDENTS</i><br>
          transferred_at TIMESTAMP
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(schemaHtml);
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig2_schema.png') });
  console.log('fig2_schema.png created!');

  // -------------------------------------------------------------
  // 3. FIG 3: USE CASE DIAGRAM
  // -------------------------------------------------------------
  await page.setViewport({ width: 900, height: 420, deviceScaleFactor: 2 });
  const useCaseHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
      body { background: white; padding: 15px; display: flex; justify-content: center; }
      .boundary { position: relative; width: 850px; height: 380px; border: 2px solid #3b82f6; border-radius: 12px; background: #f0f9ff; }
      .boundary-title { font-weight: bold; text-align: center; padding: 8px; font-size: 13px; color: #0f172a; border-bottom: 1.5px solid #bae6fd; background: #e0f2fe; border-radius: 10px 10px 0 0; }
      .usecase { position: absolute; background: white; border: 1.5px solid #0284c7; border-radius: 20px; padding: 6px 14px; font-size: 10px; text-align: center; color: #0369a1; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
      .usecase.center-uc { border-color: #f59e0b; background: #fef3c7; color: #b45309; }
      .actor { position: absolute; display: flex; flex-direction: column; align-items: center; font-size: 11px; font-weight: bold; color: #1e293b; z-index: 10; }
      .actor-icon { width: 36px; height: 50px; }
      svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
      .include-tag { font-size: 8px; fill: #64748b; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="boundary">
      <div class="boundary-title">Digital Token Marketplace – Peer-to-Peer Campus Token Exchange</div>

      <svg>
        <!-- Lines from Student -->
        <line x1="60" y1="180" x2="160" y2="70" stroke="#64748b" stroke-width="1.2" />
        <line x1="60" y1="180" x2="160" y2="120" stroke="#64748b" stroke-width="1.2" />
        <line x1="60" y1="180" x2="160" y2="175" stroke="#64748b" stroke-width="1.2" />
        <line x1="60" y1="180" x2="160" y2="230" stroke="#64748b" stroke-width="1.2" />
        <line x1="60" y1="180" x2="160" y2="285" stroke="#64748b" stroke-width="1.2" />
        <line x1="60" y1="180" x2="160" y2="340" stroke="#64748b" stroke-width="1.2" />

        <!-- Includes to Authenticate Student -->
        <line x1="280" y1="175" x2="380" y2="175" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" />
        <text x="300" y="170" class="include-tag">&lt;&lt;include&gt;&gt;</text>
        
        <line x1="270" y1="230" x2="390" y2="190" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" />
        <text x="310" y="215" class="include-tag">&lt;&lt;include&gt;&gt;</text>

        <!-- Lines to Concurrency & Locking Engine -->
        <line x1="270" y1="285" x2="390" y2="285" stroke="#10b981" stroke-width="1" stroke-dasharray="3,3" />
        <text x="300" y="280" class="include-tag">&lt;&lt;locks row&gt;&gt;</text>

        <!-- Lines from Admin -->
        <line x1="790" y1="180" x2="680" y2="70" stroke="#64748b" stroke-width="1.2" />
        <line x1="790" y1="180" x2="680" y2="125" stroke="#64748b" stroke-width="1.2" />
        <line x1="790" y1="180" x2="680" y2="180" stroke="#64748b" stroke-width="1.2" />
        <line x1="790" y1="180" x2="680" y2="240" stroke="#64748b" stroke-width="1.2" />
        <line x1="790" y1="180" x2="680" y2="300" stroke="#64748b" stroke-width="1.2" />
      </svg>

      <!-- LEFT ACTOR: STUDENT -->
      <div class="actor" style="left: 15px; top: 150px;">
        <svg class="actor-icon" viewBox="0 0 40 60">
          <circle cx="20" cy="12" r="8" fill="none" stroke="#dc2626" stroke-width="2" />
          <line x1="20" y1="20" x2="20" y2="40" stroke="#dc2626" stroke-width="2" />
          <line x1="6" y1="28" x2="34" y2="28" stroke="#dc2626" stroke-width="2" />
          <line x1="20" y1="40" x2="8" y2="58" stroke="#dc2626" stroke-width="2" />
          <line x1="20" y1="40" x2="32" y2="58" stroke="#dc2626" stroke-width="2" />
        </svg>
        <span style="color: #dc2626; margin-top: 4px;">Student</span>
      </div>

      <!-- STUDENT USE CASES -->
      <div class="usecase" style="left: 140px; top: 55px; width: 140px;">Register & Login</div>
      <div class="usecase" style="left: 140px; top: 108px; width: 140px;">Browse Campus Activities</div>
      <div class="usecase" style="left: 140px; top: 162px; width: 140px;">Explore Token Marketplace</div>
      <div class="usecase" style="left: 140px; top: 216px; width: 140px;">Request Token Transfer</div>
      <div class="usecase" style="left: 140px; top: 270px; width: 140px;">Approve / Reject Request</div>
      <div class="usecase" style="left: 140px; top: 324px; width: 140px;">View My Token Vault</div>

      <!-- CENTER USE CASES -->
      <div class="usecase center-uc" style="left: 360px; top: 162px; width: 150px;">Authenticate Student &amp; Role Check</div>
      <div class="usecase center-uc" style="left: 360px; top: 270px; width: 150px; background: #ecfdf5; border-color: #10b981; color: #047857;">InnoDB Row Lock (FOR UPDATE)</div>

      <!-- ADMIN USE CASES -->
      <div class="usecase" style="left: 540px; top: 55px; width: 160px; border-color: #059669; color: #065f46;">Create / Edit Activities</div>
      <div class="usecase" style="left: 540px; top: 110px; width: 160px; border-color: #059669; color: #065f46;">Set Seat Capacities</div>
      <div class="usecase" style="left: 540px; top: 165px; width: 160px; border-color: #059669; color: #065f46;">View Audit Trail &amp; History</div>
      <div class="usecase" style="left: 540px; top: 225px; width: 160px; border-color: #059669; color: #065f46;">Trigger Token Expiry Sweep</div>
      <div class="usecase" style="left: 540px; top: 285px; width: 160px; border-color: #059669; color: #065f46;">Manage Student Records</div>

      <!-- RIGHT ACTOR: ADMIN -->
      <div class="actor" style="right: 15px; top: 150px;">
        <svg class="actor-icon" viewBox="0 0 40 60">
          <circle cx="20" cy="12" r="8" fill="none" stroke="#16a34a" stroke-width="2" />
          <line x1="20" y1="20" x2="20" y2="40" stroke="#16a34a" stroke-width="2" />
          <line x1="6" y1="28" x2="34" y2="28" stroke="#16a34a" stroke-width="2" />
          <line x1="20" y1="40" x2="8" y2="58" stroke="#16a34a" stroke-width="2" />
          <line x1="20" y1="40" x2="32" y2="58" stroke="#16a34a" stroke-width="2" />
        </svg>
        <span style="color: #16a34a; margin-top: 4px;">Admin</span>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(useCaseHtml);
  await page.screenshot({ path: path.join(__dirname, '../report_assets/fig3_usecase.png') });
  console.log('fig3_usecase.png created!');

  await browser.close();
})();
