const fs = require('fs');
const path = require('path');

function getBase64Image(relPath) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return '';
  const ext = path.extname(fullPath).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,` + fs.readFileSync(fullPath).toString('base64');
}

const logoBase64 = getBase64Image('report_assets/page_1_img_1_Image23.png');
const fig1Base64 = getBase64Image('report_assets/fig1_erd.png');
const fig2Base64 = getBase64Image('report_assets/fig2_schema.png');
const fig3Base64 = getBase64Image('report_assets/fig3_usecase.png');
const fig4Base64 = getBase64Image('report_assets/fig4_dashboard.png');
const fig5Base64 = getBase64Image('report_assets/fig5_auth.png');
const fig6Base64 = getBase64Image('report_assets/fig6_activities.png');
const fig7Base64 = getBase64Image('report_assets/fig7_token_details.png');
const fig8Base64 = getBase64Image('report_assets/fig8_vault.png');
const fig9Base64 = getBase64Image('report_assets/fig9_admin_activity.png');
const fig10Base64 = getBase64Image('report_assets/fig10_history.png');
const fig11Base64 = getBase64Image('report_assets/fig11_mysql_records.png');

function footer(pageNum) {
  return `<div class="footer">Digital Token Marketplace – Peer-to-Peer Campus Token Exchange | Page ${pageNum}</div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Digital Token Marketplace – Mini Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #555;
    font-family: 'Times New Roman', Times, serif;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    min-height: 297mm;
    padding: 22mm 24mm 22mm 24mm;
    margin: 10px auto;
    background: #fff;
    position: relative;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  @media print {
    body { background: transparent; }
    .page {
      margin: 0;
      box-shadow: none;
      page-break-after: always;
    }
  }

  .footer {
    position: absolute;
    bottom: 11mm;
    left: 24mm;
    right: 24mm;
    text-align: center;
    font-size: 9pt;
    color: #222;
    font-family: 'Times New Roman', Times, serif;
  }

  h1.chapter-title {
    font-size: 13pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 12pt;
    letter-spacing: 0.5px;
  }
  h2.chapter-subtitle {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 14pt;
    letter-spacing: 0.5px;
  }
  h3.section-title {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 13pt;
    margin-bottom: 7pt;
  }
  h4.subsection-title {
    font-size: 10.5pt;
    font-weight: bold;
    margin-top: 9pt;
    margin-bottom: 3pt;
  }
  p {
    font-size: 10pt;
    line-height: 1.45;
    text-align: justify;
    margin-bottom: 7pt;
  }
  ul {
    margin-top: 3pt;
    margin-bottom: 7pt;
    padding-left: 20px;
  }
  li {
    font-size: 10pt;
    line-height: 1.4;
    margin-bottom: 3.5pt;
    text-align: justify;
  }

  table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 9pt;
    font-size: 9.5pt;
  }
  table.report-table th, table.report-table td {
    border: 1px solid #111;
    padding: 4.5pt 6pt;
    text-align: left;
    vertical-align: top;
  }
  table.report-table th {
    font-weight: bold;
    background-color: transparent;
  }

  .figure-box {
    text-align: center;
    margin: 8pt 0 4pt 0;
  }
  .figure-box img {
    max-width: 98%;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .figure-caption {
    font-size: 9.5pt;
    font-style: italic;
    margin-top: 5pt;
    text-align: center;
  }

  pre.code-snippet {
    background-color: #fafafa;
    border: 1px solid #ddd;
    padding: 7pt 9pt;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    margin: 5pt 0 8pt 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  /* Cover Page Styling */
  .cover-header {
    text-align: center;
    margin-top: 5mm;
  }
  .cover-header img {
    width: 480px;
    max-width: 95%;
  }
  .dept-title {
    font-size: 12.5pt;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.5px;
    line-height: 1.4;
    margin-top: 15mm;
  }
  .acad-year {
    font-size: 11pt;
    text-align: center;
    margin-top: 15mm;
  }
  .mini-title {
    font-size: 13.5pt;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.5px;
    margin-top: 15mm;
  }
  .course-code {
    font-size: 10.5pt;
    font-weight: bold;
    text-align: center;
    margin-top: 10mm;
    letter-spacing: 0.5px;
  }
  .project-name {
    font-size: 12.5pt;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.5px;
    margin-top: 14mm;
    line-height: 1.35;
  }
  .sign-grid {
    display: flex;
    justify-content: space-between;
    margin-top: 20mm;
    padding: 0 5mm;
  }
  .sign-col {
    width: 48%;
  }
  .sign-heading {
    font-size: 10.5pt;
    font-style: italic;
    margin-bottom: 8pt;
  }
  .sign-names {
    font-size: 10.5pt;
    font-weight: bold;
    line-height: 1.6;
  }
</style>
</head>
<body>

<!-- ============================================================== -->
<!-- PAGE 1: COVER PAGE -->
<!-- ============================================================== -->
<div class="page" id="page-1">
  <div class="cover-header">
    <img src="${logoBase64}" alt="Sri Eshwar College of Engineering">
  </div>

  <div class="dept-title">
    DEPARTMENT OF COMPUTER SCIENCE AND<br>
    ENGINEERING
  </div>

  <div class="acad-year">
    Academic Year 2026 – 2027 (Odd Semester)
  </div>

  <div class="mini-title">
    MINI PROJECT REPORT
  </div>

  <div class="course-code">
    U23CS454 – DATABASE MANAGEMENT SYSTEMS LABORATORY
  </div>

  <div class="project-name">
    DIGITAL TOKEN MARKETPLACE – PEER-TO-PEER CAMPUS TOKEN EXCHANGE
  </div>

  <div class="sign-grid">
    <div class="sign-col">
      <div class="sign-heading">Submitted by,</div>
      <div class="sign-names">
        25CS062 – HARI PRASATH S<br>
        25CS033 – DEVDHARSHAN S<br>
        25CS027 – DAYANAND S
      </div>
    </div>
    <div class="sign-col" style="text-align: left; padding-left: 20mm;">
      <div class="sign-heading">Mentored by,</div>
      <div class="sign-names">
        Ms . N . GAYATHRI<br>
        Assistant Professor<br>
        Department of CSE
      </div>
    </div>
  </div>

  ${footer(1)}
</div>

<!-- ============================================================== -->
<!-- PAGE 2: TABLE OF CONTENTS -->
<!-- ============================================================== -->
<div class="page" id="page-2">
  <h2 style="font-size: 12pt; font-weight: bold; margin-bottom: 12pt;">TABLE OF CONTENTS</h2>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 22%;">CHAPTER NO.</th>
        <th style="width: 60%;">TITLE</th>
        <th style="width: 18%;">PAGE NO.</th>
      </tr>
    </thead>
    <tbody>
      <tr><td></td><td><strong>ABSTRACT</strong></td><td>i</td></tr>
      <tr><td></td><td><strong>LIST OF TABLES</strong></td><td>ii</td></tr>
      <tr><td></td><td><strong>LIST OF FIGURES</strong></td><td>iii</td></tr>
      <tr><td><strong>1</strong></td><td><strong>INTRODUCTION</strong></td><td></td></tr>
      <tr><td>1.1</td><td>Objectives</td><td></td></tr>
      <tr><td>1.2</td><td>Scope of the Project</td><td></td></tr>
      <tr><td><strong>2</strong></td><td><strong>SYSTEM ANALYSIS AND SPECIFICATION</strong></td><td></td></tr>
      <tr><td>2.1</td><td>Problem Description</td><td></td></tr>
      <tr><td>2.2</td><td>Functional Requirements, Hardware and Software</td><td></td></tr>
      <tr><td>2.3</td><td>Non-Functional Requirements</td><td></td></tr>
      <tr><td><strong>3</strong></td><td><strong>SYSTEM DESIGN</strong></td><td></td></tr>
      <tr><td>3.1</td><td>ER Diagram</td><td></td></tr>
      <tr><td>3.2</td><td>Schema Diagram</td><td></td></tr>
      <tr><td><strong>4</strong></td><td><strong>PROPOSED SOLUTION</strong></td><td></td></tr>
      <tr><td>4.1</td><td>User Interface Design Overview</td><td></td></tr>
      <tr><td>4.2</td><td>Class Construction</td><td></td></tr>
      <tr><td>4.3</td><td>Database Creation</td><td></td></tr>
      <tr><td><strong>5</strong></td><td><strong>PROJECT DESCRIPTION</strong></td><td></td></tr>
      <tr><td>5.1</td><td>Module Description</td><td></td></tr>
      <tr><td>5.2</td><td>JDBC Connectivity</td><td></td></tr>
      <tr><td><strong>6</strong></td><td><strong>IMPLEMENTATION</strong></td><td></td></tr>
      <tr><td><strong>7</strong></td><td><strong>RESULTS AND DISCUSSION</strong></td><td></td></tr>
      <tr><td><strong>8</strong></td><td><strong>CONCLUSION AND FUTURE ENHANCEMENT</strong></td><td></td></tr>
      <tr><td></td><td><strong>REFERENCES</strong></td><td></td></tr>
    </tbody>
  </table>
  ${footer(2)}
</div>

<!-- ============================================================== -->
<!-- PAGE 3: ABSTRACT -->
<!-- ============================================================== -->
<div class="page" id="page-3">
  <h2 style="font-size: 12pt; font-weight: bold; margin-bottom: 14pt;">ABSTRACT</h2>
  <p>
    The Digital Token Marketplace – Peer-to-Peer Campus Token Exchange is a Java and Spring Boot application designed to reduce reservation wastage and eliminate informal, untracked ticket swapping in collegiate environments such as workshops, hackathons, guest lectures, laboratory access sessions, and sports facilities. The system allows verified students to register, explore active campus activities, claim or mint digital reservation tokens, inspect token verification codes, list tokens for peer-to-peer exchange, request token transfers, and approve incoming transfer requests with cryptographic and database integrity. Institutional administrators can create and schedule activities, define attendee quotas, monitor marketplace activity, and inspect comprehensive audit logs.
  </p>
  <p>
    The application utilizes Java 17 for backend application logic, Apache Maven for dependency and build management, Spring Data JDBC with HikariCP connection pooling for relational database access, and MySQL 8.0 with the InnoDB storage engine for persistent storage. The relational database is structured into STUDENTS, CAMPUS_ACTIVITIES, DIGITAL_TOKENS, TOKEN_TRANSFER_REQUESTS, and TOKEN_TRANSFER_HISTORY tables, connected through rigorous primary-key and foreign-key constraints. Digital tokens adhere to a formal lifecycle represented by statuses such as AVAILABLE, TRANSFER_PENDING, TRANSFERRED, USED, and EXPIRED.
  </p>
  <p>
    PreparedStatement-based database operations eliminate SQL injection vulnerabilities, while explicit transaction boundaries and InnoDB row-level locking (<code>SELECT ... FOR UPDATE</code>) ensure concurrency safety, preventing double transfers or race conditions when multiple students request the same token simultaneously. An automated background scheduler inspects upcoming and past events, systematically transitioning expired tokens to preserve data currency.
  </p>
  <p>
    The project demonstrates foundational database management concepts including entity-relationship modeling, referential integrity, multi-table joins, transactional isolation, row-level locking, and persistent audit trail generation. Its modular architecture cleanly decouples domain models, data access objects (DAOs), business services, REST controllers, and responsive web user interfaces. The proposed system provides a reliable, transparent foundation for campus digital token management and can be enhanced in future with biometric verification, QR-based event check-in, SMS notifications, and decentralized verifiable credentials.
  </p>
  ${footer(3)}
</div>

<!-- ============================================================== -->
<!-- PAGE 4: LIST OF TABLES -->
<!-- ============================================================== -->
<div class="page" id="page-4">
  <h2 style="font-size: 12pt; font-weight: bold; margin-bottom: 14pt;">LIST OF TABLES</h2>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 15%;">S.NO</th>
        <th style="width: 65%;">TITLE</th>
        <th style="width: 20%;">PAGE NO.</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Students Table</td><td></td></tr>
      <tr><td>2</td><td>Campus Activities Table</td><td></td></tr>
      <tr><td>3</td><td>Digital Tokens Table</td><td></td></tr>
      <tr><td>4</td><td>Token Transfer Requests Table</td><td></td></tr>
      <tr><td>5</td><td>Token Transfer History Table</td><td></td></tr>
      <tr><td>6</td><td>Functional Requirements</td><td></td></tr>
      <tr><td>7</td><td>Hardware and Software Requirements</td><td></td></tr>
      <tr><td>8</td><td>Core Class Construction</td><td></td></tr>
      <tr><td>9</td><td>Token Status Lifecycle</td><td></td></tr>
      <tr><td>10</td><td>Test Cases and Validation Results</td><td></td></tr>
    </tbody>
  </table>
  ${footer(4)}
</div>

<!-- ============================================================== -->
<!-- PAGE 5: LIST OF FIGURES -->
<!-- ============================================================== -->
<div class="page" id="page-5">
  <h2 style="font-size: 12pt; font-weight: bold; margin-bottom: 14pt;">LIST OF FIGURES</h2>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 15%;">S.NO</th>
        <th style="width: 65%;">TITLE</th>
        <th style="width: 20%;">PAGE NO.</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Entity Relationship Diagram (ERD)</td><td></td></tr>
      <tr><td>2</td><td>Schema Diagram</td><td></td></tr>
      <tr><td>3</td><td>Use Case Overview</td><td></td></tr>
      <tr><td>4</td><td>Marketplace Dashboard Screenshot</td><td></td></tr>
      <tr><td>5</td><td>Student Registration and Authentication Screenshot</td><td></td></tr>
      <tr><td>6</td><td>Campus Activities Catalog Screenshot</td><td></td></tr>
      <tr><td>7</td><td>Token Detail and Verification Screenshot</td><td></td></tr>
      <tr><td>8</td><td>Student Token Vault Screenshot</td><td></td></tr>
      <tr><td>9</td><td>Admin Activity Management Screenshot</td><td></td></tr>
      <tr><td>10</td><td>Transfer Requests and Audit Trail Screenshot</td><td></td></tr>
      <tr><td>11</td><td>MySQL Database Records Screenshot</td><td></td></tr>
    </tbody>
  </table>
  ${footer(5)}
</div>

<!-- ============================================================== -->
<!-- PAGE 6: CHAPTER 1 - INTRODUCTION -->
<!-- ============================================================== -->
<div class="page" id="page-6">
  <h1 class="chapter-title">CHAPTER 1</h1>
  <h2 class="chapter-subtitle">INTRODUCTION</h2>
  <p>
    Campus reservations and event passes are widely used to manage attendance in engineering colleges, technical workshops, hands-on lab sessions, hackathons, and sports competitions. In conventional collegiate workflows, event passes are allocated manually or through static registration forms. When a registered student is unable to attend due to academic deadlines or illness, passes often go unused while interested peers are excluded. In other instances, informal swapping via messaging groups leads to confusion, counterfeit tickets, and an absence of accountability.
  </p>
  <p>
    The Digital Token Marketplace – Peer-to-Peer Campus Token Exchange provides a digital, database-driven solution for issuing, managing, and transferring campus reservations. Each reservation is minted as a cryptographic digital token stored in a MySQL relational database. Students can discover available tokens, verify activity schedules, request peer-to-peer ownership transfers, and securely approve exchanges with automated row-level concurrency locking.
  </p>
  
  <h3 class="section-title">1.1 OBJECTIVES</h3>
  <ul>
    <li>To digitize campus reservation management and prevent ticket wastage.</li>
    <li>To provide secure student authentication, profile switching, and role-based access.</li>
    <li>To generate unique, formatted digital token identifiers stored persistently in MySQL.</li>
    <li>To facilitate transparent peer-to-peer token transfer requests with owner approval workflows.</li>
    <li>To enforce strict concurrency control using InnoDB row-level locking (<code>FOR UPDATE</code>) to prevent race conditions during transfers.</li>
    <li>To maintain an immutable historical audit trail of all token transfers for campus security.</li>
    <li>To use JDBC, HikariCP, and Spring Boot to demonstrate resilient database connectivity.</li>
    <li>To implement automated token expiration checks using scheduled database queries.</li>
  </ul>

  <h3 class="section-title">1.2 SCOPE OF THE PROJECT</h3>
  <p>
    The project scope encompasses student authentication, campus activity scheduling, digital token minting, marketplace catalog browsing, peer-to-peer transfer request handshakes, transaction-safe ownership reassignment, automated expiration sweeps, and administrative audit inspection. The initial deployment targets institutional intranets and collegiate technical events. Enterprise scaling would incorporate institutional single sign-on (SSO), QR code venue scanners, mobile notifications, and automated database backups.
  </p>
  ${footer(6)}
</div>

<!-- ============================================================== -->
<!-- PAGE 7: CHAPTER 2 - SYSTEM ANALYSIS AND SPECIFICATION -->
<!-- ============================================================== -->
<div class="page" id="page-7">
  <h1 class="chapter-title">CHAPTER 2</h1>
  <h2 class="chapter-subtitle">SYSTEM ANALYSIS AND SPECIFICATION</h2>
  
  <h3 class="section-title">2.1 PROBLEM DESCRIPTION</h3>
  <p>
    Manual and informal reservation mechanisms rely on physical paper passes, emails, or student chat groups. Students who reserve high-demand seats for technical workshops or laboratory equipment cannot easily relinquish their slot if their schedule changes. Consequently, workshops suffer from absentee seats while eligible students on waitlists are deprived of opportunities. Furthermore, organizers have no real-time visibility into who holds which seat, making attendance verification unreliable and audit compliance impossible.
  </p>
  <p>
    The proposed system maintains digital tokens in a centralized relational database. It assigns a unique token code to each reservation, tracks status transitions across its lifecycle, and guarantees transactional atomicity during transfers. Institutional staff can monitor activity capacities, while students can freely and safely exchange tokens under strict database integrity rules.
  </p>

  <h3 class="section-title">2.2 FUNCTIONAL REQUIREMENTS – HARDWARE AND SOFTWARE REQUIREMENTS</h3>
  <h4 class="subsection-title" style="margin-top: 4pt; margin-bottom: 4pt;">Functional Requirements</h4>
  <ul>
    <li><strong>Student Registration & Authentication:</strong> Capture student roll number, name, email, department, year, and credentials; enforce unique email and roll number constraints.</li>
    <li><strong>Campus Activity Management:</strong> Allow administrators to create, update, and display active campus activities with dates, categories, and venues.</li>
    <li><strong>Digital Token Minting:</strong> Allocate unique tokens for designated activities, specifying seat/slot details and expiration timestamps.</li>
    <li><strong>Marketplace Browsing:</strong> Display available tokens with dynamic category filtering, search, and real-time status visibility.</li>
    <li><strong>Peer-to-Peer Transfer Request:</strong> Permit eligible students to initiate transfer requests with custom justification notes.</li>
    <li><strong>Transfer Approval & Concurrency Control:</strong> Enable token owners to approve transfers with atomic row-level locks preventing race conditions.</li>
    <li><strong>Transfer Rejection & Cancellation:</strong> Allow token owners to reject requests or requesters to cancel pending requests safely.</li>
    <li><strong>Immutable Audit History:</strong> Record every completed transfer in a dedicated historical ledger table for institutional audits.</li>
  </ul>
  ${footer(7)}
</div>

<!-- ============================================================== -->
<!-- PAGE 8: HARDWARE/SOFTWARE & NON-FUNCTIONAL REQUIREMENTS -->
<!-- ============================================================== -->
<div class="page" id="page-8">
  <h4 class="subsection-title" style="margin-top: 0; margin-bottom: 4pt;">Hardware Requirements</h4>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 30%;">Component</th>
        <th style="width: 70%;">Minimum / Suggested Requirement</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Processor</td><td>Dual-core processor or better (x86_64 / ARM64)</td></tr>
      <tr><td>Memory</td><td>4 GB RAM minimum; 8 GB recommended</td></tr>
      <tr><td>Storage</td><td>At least 2 GB free disk space for database and project dependencies</td></tr>
      <tr><td>Display</td><td>Standard monitor (1280 &times; 720 resolution or higher)</td></tr>
      <tr><td>Network</td><td>Local network or internet for Maven dependency resolution and database connectivity</td></tr>
    </tbody>
  </table>

  <h4 class="subsection-title" style="margin-top: 8pt; margin-bottom: 4pt;">Software Requirements</h4>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 35%;">Software</th>
        <th style="width: 65%;">Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Windows 10/11 or compatible OS</td><td>Host development environment</td></tr>
      <tr><td>Java JDK 17 (LTS)</td><td>Compile and execute Java application source code</td></tr>
      <tr><td>Apache Maven 3.9+</td><td>Build orchestration and dependency lifecycle management</td></tr>
      <tr><td>MySQL Server 8.0 (InnoDB)</td><td>Relational database storage engine</td></tr>
      <tr><td>Spring Boot 3.3.4 & HikariCP</td><td>Backend REST framework and high-performance connection pooling</td></tr>
      <tr><td>Visual Studio Code</td><td>Source code editing and integrated terminal debugging</td></tr>
      <tr><td>MySQL Command Line / Workbench</td><td>Database schema definition, querying, and verification</td></tr>
      <tr><td>JUnit 5</td><td>Automated unit and integration test suite execution</td></tr>
    </tbody>
  </table>

  <h3 class="section-title" style="margin-top: 10pt;">2.3 NON-FUNCTIONAL REQUIREMENTS</h3>
  <ul>
    <li><strong>Reliability:</strong> All token state transitions must be committed permanently to disk, rejecting invalid status transitions immediately.</li>
    <li><strong>Consistency:</strong> ACID transaction isolation must prevent race conditions and duplicate claims when simultaneous requests occur.</li>
    <li><strong>Security:</strong> PreparedStatement query binding must eliminate SQL injection; credentials must be externalized from source code.</li>
    <li><strong>Usability:</strong> Provide intuitive web dashboards, status indicators, and clear validation feedback messages.</li>
    <li><strong>Maintainability:</strong> Adhere to modular separation across Model, DAO, Service, Controller, and Web UI tiers.</li>
    <li><strong>Performance:</strong> Implement B-tree indexes on foreign keys, token codes, activity dates, and status fields to guarantee sub-millisecond query execution.</li>
    <li><strong>Availability:</strong> Handle connection pool exhaustion and database interruptions gracefully with meaningful user error notifications.</li>
    <li><strong>Scalability:</strong> Modular REST architecture facilitates effortless horizontal expansion to microservices or mobile clients.</li>
  </ul>
  ${footer(8)}
</div>

<!-- ============================================================== -->
<!-- PAGE 9: CHAPTER 3 - SYSTEM DESIGN -->
<!-- ============================================================== -->
<div class="page" id="page-9">
  <h1 class="chapter-title">CHAPTER 3</h1>
  <h2 class="chapter-subtitle">SYSTEM DESIGN</h2>
  
  <h3 class="section-title">3.1 ER DIAGRAM</h3>
  <p>
    The Entity-Relationship diagram models the core relational entities of the Digital Token Marketplace: STUDENTS, CAMPUS_ACTIVITIES, DIGITAL_TOKENS, TOKEN_TRANSFER_REQUESTS, and TOKEN_TRANSFER_HISTORY. STUDENTS maintains student accounts, CAMPUS_ACTIVITIES catalogues events, DIGITAL_TOKENS defines individual reservation passes, TOKEN_TRANSFER_REQUESTS handles transfer negotiations, and TOKEN_TRANSFER_HISTORY captures immutable historical logs.
  </p>

  <div class="figure-box">
    <img src="${fig1Base64}" style="max-height: 250px; width: 92%;" alt="Entity Relationship Diagram">
    <div class="figure-caption">Figure 1: Entity Relationship Diagram of Digital Token Marketplace</div>
  </div>

  <p style="margin-top: 10pt; font-weight: bold; margin-bottom: 4pt;">Relationship rules:</p>
  <ul>
    <li>One student can own multiple digital tokens over time (1 : N).</li>
    <li>One campus activity can have multiple digital tokens associated with it (1 : N).</li>
    <li>Each digital token belongs to exactly one student and one campus activity.</li>
    <li>One digital token can be associated with multiple transfer requests throughout its lifecycle (1 : N).</li>
    <li>Each historical transfer entry records the source student, destination student, and corresponding token permanently.</li>
  </ul>
  ${footer(9)}
</div>

<!-- ============================================================== -->
<!-- PAGE 10: 3.2 SCHEMA DIAGRAM -->
<!-- ============================================================== -->
<div class="page" id="page-10">
  <h3 class="section-title" style="margin-top: 0;">3.2 SCHEMA DIAGRAM</h3>
  
  <div class="figure-box" style="margin-top: 4pt; margin-bottom: 6pt;">
    <img src="${fig2Base64}" style="max-height: 250px; width: 92%;" alt="Relational Schema Diagram">
    <div class="figure-caption">Figure 2: Relational schema diagram</div>
  </div>

  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 28%;">Table</th>
        <th style="width: 24%;">Primary Key</th>
        <th style="width: 48%;">Important Attributes / Relationships</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>STUDENTS</strong></td>
        <td>student_id</td>
        <td>roll_no (unique), name, email (unique), password_hash, department, year_of_study, role</td>
      </tr>
      <tr>
        <td><strong>CAMPUS_ACTIVITIES</strong></td>
        <td>activity_id</td>
        <td>title, category, venue, description, organizer, activity_date, total_capacity</td>
      </tr>
      <tr>
        <td><strong>DIGITAL_TOKENS</strong></td>
        <td>token_id</td>
        <td>token_code (unique), activity_id FK, owner_student_id FK, status, valid_from, expiry_date, seat_or_slot</td>
      </tr>
      <tr>
        <td><strong>TOKEN_TRANSFER_REQUESTS</strong></td>
        <td>request_id</td>
        <td>token_id FK, requester_student_id FK, owner_student_id FK, request_status, request_reason, requested_at</td>
      </tr>
      <tr>
        <td><strong>TOKEN_TRANSFER_HISTORY</strong></td>
        <td>history_id</td>
        <td>token_id FK, request_id FK, from_student_id FK, to_student_id FK, transferred_at, remarks</td>
      </tr>
    </tbody>
  </table>

  <p>
    The schema uses primary keys to uniquely identify tuple entities and foreign keys to enforce relational referential integrity. Composite and single B-tree indexes on <code>(activity_id, status)</code>, <code>(owner_student_id)</code>, and <code>(expiry_date)</code> optimize marketplace query performance. Foreign key cascade rules prevent orphan transfer records while protecting referenced activity and student rows from unintended deletion.
  </p>
  ${footer(10)}
</div>

<!-- ============================================================== -->
<!-- PAGE 11: CHAPTER 4 - PROPOSED SOLUTION -->
<!-- ============================================================== -->
<div class="page" id="page-11">
  <h1 class="chapter-title">CHAPTER 4</h1>
  <h2 class="chapter-subtitle">PROPOSED SOLUTION</h2>
  
  <h3 class="section-title">4.1 USER INTERFACE DESIGN OVERVIEW</h3>
  <p>
    The Digital Token Marketplace features a responsive, multi-page web application interface built with HTML5, CSS3, and JavaScript, backed by Spring Boot REST controllers. The system offers navigation for marketplace discovery, campus activities, student token vaults, incoming transfer requests, and audit logs. Dynamic feedback alerts inform users of status updates and ownership handoffs in real time.
  </p>

  <div class="figure-box">
    <img src="${fig3Base64}" style="max-height: 250px; width: 92%;" alt="Use Case Overview">
    <div class="figure-caption">Figure 3: Use case overview</div>
  </div>

  <p style="margin-top: 8pt; font-weight: bold; margin-bottom: 4pt;">Main Student Workflow</p>
  <ol style="padding-left: 20px; font-size: 10pt; line-height: 1.45;">
    <li style="margin-bottom: 3pt;">Authenticate using institutional student credentials or roll number.</li>
    <li style="margin-bottom: 3pt;">Browse active campus activities and filter by category (Workshop, Event, Lab, Sports).</li>
    <li style="margin-bottom: 3pt;">Claim or mint a digital reservation token for an upcoming event.</li>
    <li style="margin-bottom: 3pt;">View owned tokens in the personal Token Vault with seat/slot details and validity windows.</li>
    <li style="margin-bottom: 3pt;">Initiate a peer-to-peer transfer request for an available marketplace token with a reason note.</li>
  </ol>
  ${footer(11)}
</div>

<!-- ============================================================== -->
<!-- PAGE 12: WORKFLOW & CLASS CONSTRUCTION & DB CREATION -->
<!-- ============================================================== -->
<div class="page" id="page-12">
  <ol start="6" style="padding-left: 20px; font-size: 10pt; line-height: 1.45; margin-bottom: 8pt;">
    <li style="margin-bottom: 3pt;">Approve or reject incoming transfer requests with automated database concurrency verification.</li>
  </ol>

  <p style="font-weight: bold; margin-bottom: 4pt;">Administrator Workflow</p>
  <ol start="7" style="padding-left: 20px; font-size: 10pt; line-height: 1.45; margin-bottom: 10pt;">
    <li style="margin-bottom: 3pt;">Authenticate using configured administrative privileges.</li>
    <li style="margin-bottom: 3pt;">Create and schedule new campus activities with participant quotas and venue details.</li>
    <li style="margin-bottom: 3pt;">Inspect system-wide token distribution, active reservations, and status breakdowns.</li>
    <li style="margin-bottom: 3pt;">Trigger manual or automated token expiration checks across past campus events.</li>
    <li style="margin-bottom: 3pt;">Review comprehensive peer-to-peer transfer audit histories for campus compliance.</li>
  </ol>

  <h3 class="section-title" style="margin-top: 8pt;">4.2 CLASS CONSTRUCTION</h3>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 32%;">Class</th>
        <th style="width: 68%;">Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>TokenMarketplaceApplication</td><td>Bootstraps Spring Boot application and initializes components.</td></tr>
      <tr><td>Student / CampusActivity</td><td>Domain models representing student profiles and scheduled events.</td></tr>
      <tr><td>DigitalToken / TransferRequest</td><td>Domain models representing reservation passes and transfer negotiations.</td></tr>
      <tr><td>DatabaseConfig</td><td>Configures MySQL DataSource, HikariCP connection pool, and JDBC template.</td></tr>
      <tr><td>StudentDao / StudentDaoImpl</td><td>Executes parameterized SQL queries for student authentication and retrieval.</td></tr>
      <tr><td>DigitalTokenDao / DaoImpl</td><td>Manages CRUD operations and row-level locking queries for digital tokens.</td></tr>
      <tr><td>TokenTransferDao / DaoImpl</td><td>Persists transfer requests and coordinates atomic status handoffs.</td></tr>
      <tr><td>HistoryDao / HistoryDaoImpl</td><td>Logs immutable transfer records to <code>TOKEN_TRANSFER_HISTORY</code>.</td></tr>
      <tr><td>TransferService</td><td>Coordinates transactional boundaries, row locks, and transfer business logic.</td></tr>
      <tr><td>TokenExpiryScheduler</td><td>Background daemon executing scheduled SQL sweeps to expire outdated passes.</td></tr>
    </tbody>
  </table>

  <h3 class="section-title" style="margin-top: 8pt;">4.3 DATABASE CREATION</h3>
  <p>
    The following SQL script creates the schema and tables in MySQL 8. Execute it via MySQL Workbench or the MySQL command line client.
  </p>
  <pre class="code-snippet">CREATE DATABASE IF NOT EXISTS digital_token_marketplace
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE digital_token_marketplace;</pre>
  ${footer(12)}
</div>

<!-- ============================================================== -->
<!-- PAGE 13: SQL DDL CREATION -->
<!-- ============================================================== -->
<div class="page" id="page-13">
  <pre class="code-snippet">CREATE TABLE IF NOT EXISTS STUDENTS (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    contact_no VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_students_email (email),
    INDEX idx_students_roll (roll_no)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS CAMPUS_ACTIVITIES (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('WORKSHOP','EVENT','LAB_SESSION','SPORTS','CLUB_ACTIVITY') NOT NULL,
    venue VARCHAR(100) NOT NULL,
    description TEXT,
    organizer VARCHAR(100) NOT NULL,
    activity_date DATETIME NOT NULL,
    total_capacity INT DEFAULT 50,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activities_category (category),
    INDEX idx_activities_date (activity_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS DIGITAL_TOKENS (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    token_code VARCHAR(64) NOT NULL UNIQUE,
    activity_id INT NOT NULL,
    owner_student_id INT NOT NULL,
    status ENUM('AVAILABLE','TRANSFER_PENDING','TRANSFERRED','USED','EXPIRED')
        NOT NULL DEFAULT 'AVAILABLE',
    valid_from DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL,
    seat_or_slot VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokens_activity FOREIGN KEY (activity_id)
        REFERENCES CAMPUS_ACTIVITIES (activity_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_tokens_owner FOREIGN KEY (owner_student_id)
        REFERENCES STUDENTS (student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_tokens_status (status),
    INDEX idx_tokens_expiry (expiry_date),
    INDEX idx_tokens_owner (owner_student_id),
    INDEX idx_tokens_activity (activity_id)
) ENGINE=InnoDB;</pre>
  ${footer(13)}
</div>

<!-- ============================================================== -->
<!-- PAGE 14: SQL DDL & SEED STATEMENTS -->
<!-- ============================================================== -->
<div class="page" id="page-14">
  <pre class="code-snippet">CREATE TABLE IF NOT EXISTS TOKEN_TRANSFER_REQUESTS (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL,
    requester_student_id INT NOT NULL,
    owner_student_id INT NOT NULL,
    request_status ENUM('PENDING','APPROVED','REJECTED','CANCELLED')
        NOT NULL DEFAULT 'PENDING',
    request_reason VARCHAR(255),
    response_note VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME NULL,
    CONSTRAINT fk_requests_token FOREIGN KEY (token_id)
        REFERENCES DIGITAL_TOKENS (token_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_requests_requester FOREIGN KEY (requester_student_id)
        REFERENCES STUDENTS (student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_requests_owner FOREIGN KEY (owner_student_id)
        REFERENCES STUDENTS (student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_requests_token (token_id),
    INDEX idx_requests_requester (requester_student_id),
    INDEX idx_requests_owner (owner_student_id),
    INDEX idx_requests_status (request_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS TOKEN_TRANSFER_HISTORY (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL,
    request_id INT NULL,
    from_student_id INT NOT NULL,
    to_student_id INT NOT NULL,
    transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255),
    CONSTRAINT fk_history_token FOREIGN KEY (token_id)
        REFERENCES DIGITAL_TOKENS (token_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_history_request FOREIGN KEY (request_id)
        REFERENCES TOKEN_TRANSFER_REQUESTS (request_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_history_from FOREIGN KEY (from_student_id)
        REFERENCES STUDENTS (student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_history_to FOREIGN KEY (to_student_id)
        REFERENCES STUDENTS (student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_history_token (token_id),
    INDEX idx_history_from (from_student_id),
    INDEX idx_history_to (to_student_id)
) ENGINE=InnoDB;

INSERT INTO CAMPUS_ACTIVITIES (title, category, venue, organizer, activity_date, total_capacity) VALUES
('Generative AI & LLM Fine-Tuning Bootcamp', 'WORKSHOP', 'Advanced Computing Lab 3', 'SECE AI Club', '2026-10-25 10:00:00', 40),
('HackIndia 2026 - 24-Hour National Hackathon', 'EVENT', 'Central Auditorium', 'SECE Coding Cell', '2026-11-02 09:00:00', 120),
('Autonomous Drone Navigation & Flight Simulation', 'LAB_SESSION', 'Robotics Center', 'Robotics Dept', '2026-10-22 14:30:00', 25),
('Inter-Department Badminton Championship', 'SPORTS', 'Indoor Sports Complex', 'Sports Dept', '2026-10-20 17:00:00', 30);</pre>
  ${footer(14)}
</div>

<!-- ============================================================== -->
<!-- PAGE 15: CHAPTER 5 - PROJECT DESCRIPTION -->
<!-- ============================================================== -->
<div class="page" id="page-15">
  <h1 class="chapter-title">CHAPTER 5</h1>
  <h2 class="chapter-subtitle">PROJECT DESCRIPTION</h2>
  
  <h3 class="section-title">5.1 MODULE DESCRIPTION</h3>
  
  <h4 class="subsection-title">5.1.1 Student Identity and Authentication Module</h4>
  <p>
    This module manages student profile creation, credential verification, and active profile switching for multi-user demonstration. It captures roll numbers, institutional emails, departments, and academic study years. Unique constraints on email and roll number prevent duplicate accounts, returning structured error responses when conflicts occur.
  </p>

  <h4 class="subsection-title">5.1.2 Campus Activity Management Module</h4>
  <p>
    The campus activity module maintains event scheduling and capacity metrics. Staff members can create, update, or deactivate activities. Inactive or expired activities are excluded from token minting workflows, ensuring passes correspond exclusively to valid scheduled events.
  </p>

  <h4 class="subsection-title">5.1.3 Digital Token Minting and Listing Module</h4>
  <p>
    When an authorized student reserves a slot, the system generates an immutable, formatted token code (e.g. <code>TKN-GAI-2026-001</code>). The module inserts the record into <code>DIGITAL_TOKENS</code> with an initial <code>AVAILABLE</code> status, exact seat/slot allocation, and calculated expiration dates aligned with the parent activity.
  </p>

  <h4 class="subsection-title">5.1.4 Marketplace Discovery and Search Module</h4>
  <p>
    This module provides dynamic filtering across campus tokens. Students can query tokens by category (Workshop, Event, Lab, Sports, Club), reservation status, or keywords. High-performance composite indexes on <code>(activity_id, status)</code> ensure responsive query execution across hundreds of records.
  </p>

  <h4 class="subsection-title">5.1.5 Peer-to-Peer Transfer & Concurrency Control Module</h4>
  <p>
    The core transfer engine coordinates peer-to-peer ownership exchanges. A student initiates a request, which transitions the token to <code>TRANSFER_PENDING</code>. The owner reviews the request note and approves or rejects it. The approval routine executes inside an atomic transaction with row-level locks, ensuring no concurrent operations can hijack the token.
  </p>
  ${footer(15)}
</div>

<!-- ============================================================== -->
<!-- PAGE 16: 5.1.6, 5.1.7 & 5.2 JDBC CONNECTIVITY -->
<!-- ============================================================== -->
<div class="page" id="page-16">
  <h4 class="subsection-title" style="margin-top: 0;">5.1.6 Automated Expiration and Cleanup Module</h4>
  <p>
    The background expiration scheduler periodically executes targeted SQL update queries. Any token whose <code>expiry_date</code> has elapsed and whose status remains <code>AVAILABLE</code> or <code>TRANSFER_PENDING</code> is automatically transitioned to <code>EXPIRED</code>, preventing students from claiming expired event passes.
  </p>

  <h4 class="subsection-title">5.1.7 Transfer History and Audit Trail Module</h4>
  <p>
    Every successful peer-to-peer token transfer triggers an insertion into <code>TOKEN_TRANSFER_HISTORY</code>. This table stores the historical token ID, sender student ID, recipient student ID, timestamp, and verification remarks. This audit trail is strictly append-only, preserving an immutable chain of custody for administrative accountability.
  </p>

  <h3 class="section-title">5.2 JDBC CONNECTIVITY</h3>
  <p>
    Java Database Connectivity (JDBC) using HikariCP connects the Spring Boot application to MySQL. Connection parameters are supplied through environment variables or configuration properties, avoiding hardcoded credentials.
  </p>

  <pre class="code-snippet">// DatabaseConnection.java &mdash; illustrative connection class
package com.sece.tokenmarketplace.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class DatabaseConnection {
    private DatabaseConnection() {}

    public static Connection getConnection() throws SQLException {
        String url = System.getenv("DB_URL");
        String user = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");

        if (url == null || user == null || password == null) {
            throw new SQLException(
                "Set DB_URL, DB_USERNAME, and DB_PASSWORD first.");
        }
        return DriverManager.getConnection(url, user, password);
    }
}</pre>
  ${footer(16)}
</div>

<!-- ============================================================== -->
<!-- PAGE 17: CONFIGURATION & TERMINAL CONFIG -->
<!-- ============================================================== -->
<div class="page" id="page-17">
  <p style="margin-top: 0;">
    In production Spring Boot configurations, connection pooling is managed via HikariCP configured within <code>application.properties</code>:
  </p>
  <pre class="code-snippet"># application.properties &mdash; Database Configuration (MySQL 8)
spring.datasource.url=jdbc:mysql://localhost:3306/digital_token_marketplace?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=hari
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool Settings (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.connection-timeout=20000

# SQL Query Logging
logging.level.org.springframework.jdbc.core=DEBUG</pre>

  <p style="margin-top: 10pt; font-weight: bold; margin-bottom: 4pt;">
    Example PowerShell configuration for the current terminal session:
  </p>
  <pre class="code-snippet">$env:DB_URL="jdbc:mysql://localhost:3306/digital_token_marketplace"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_local_mysql_password"
mvn clean compile</pre>

  <p style="margin-top: 8pt;">
    Replace the sample password with the local MySQL account password. Never commit plain-text credentials to public version-control repositories. Use environment variables or encrypted secrets management for production deployments.
  </p>
  ${footer(17)}
</div>

<!-- ============================================================== -->
<!-- PAGE 18: CHAPTER 6 - IMPLEMENTATION -->
<!-- ============================================================== -->
<div class="page" id="page-18">
  <h1 class="chapter-title">CHAPTER 6</h1>
  <h2 class="chapter-subtitle">IMPLEMENTATION</h2>
  <p>
    The application is implemented in a layered architecture where each layer maintains distinct operational responsibilities. Model classes represent database records; DAO classes execute parameterized SQL statements; service classes enforce transaction boundaries and concurrency locks; REST controllers handle HTTP requests; and responsive client interfaces deliver interactive user experiences.
  </p>

  <h3 class="section-title">6.1 Maven Configuration</h3>
  <p>
    The <code>pom.xml</code> specifies project coordinates, Java 17 compiler targets, MySQL Connector/J runtime dependencies, Spring Boot Starter Web, HikariCP, and JUnit 5 for automated testing. Maven plugins manage packaging into an executable standalone JAR artifact.
  </p>

  <h3 class="section-title">6.2 Core Marketplace Operations</h3>
  
  <p style="font-weight: bold; margin-bottom: 3pt;">Token Transfer Request Algorithm</p>
  <ol start="13" style="padding-left: 20px; font-size: 10pt; line-height: 1.45; margin-bottom: 8pt;">
    <li style="margin-bottom: 3pt;">Validate requester student ID and target token ID.</li>
    <li style="margin-bottom: 3pt;">Verify that the token status is <code>AVAILABLE</code> and not owned by the requester.</li>
    <li style="margin-bottom: 3pt;">Begin a database transaction and acquire a row lock on the token record.</li>
    <li style="margin-bottom: 3pt;">Insert transfer record into <code>TOKEN_TRANSFER_REQUESTS</code> with status <code>PENDING</code>.</li>
    <li style="margin-bottom: 3pt;">Update token status to <code>TRANSFER_PENDING</code> to prevent concurrent requests.</li>
    <li style="margin-bottom: 3pt;">Commit transaction and dispatch notification to token owner.</li>
  </ol>

  <p style="font-weight: bold; margin-bottom: 3pt;">Transfer Approval with Concurrency Row-Locking Algorithm</p>
  <ol start="19" style="padding-left: 20px; font-size: 10pt; line-height: 1.45;">
    <li style="margin-bottom: 3pt;">Begin database transaction with <code>READ_COMMITTED</code> isolation level.</li>
    <li style="margin-bottom: 3pt;">Execute <code>SELECT * FROM DIGITAL_TOKENS WHERE token_id = ? FOR UPDATE</code>.</li>
    <li style="margin-bottom: 3pt;">Verify current token status is strictly <code>TRANSFER_PENDING</code>.</li>
    <li style="margin-bottom: 3pt;">Update <code>owner_student_id</code> to requester student ID and status to <code>TRANSFERRED</code>.</li>
    <li style="margin-bottom: 3pt;">Update request status in <code>TOKEN_TRANSFER_REQUESTS</code> to <code>APPROVED</code>.</li>
    <li style="margin-bottom: 3pt;">Insert permanent audit record into <code>TOKEN_TRANSFER_HISTORY</code> and commit transaction.</li>
  </ol>
  ${footer(18)}
</div>

<!-- ============================================================== -->
<!-- PAGE 19: LIFECYCLE & EXECUTION COMMANDS & SECURITY -->
<!-- ============================================================== -->
<div class="page" id="page-19">
  <h3 class="section-title" style="margin-top: 0;">6.3 Token Status Lifecycle</h3>
  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 32%;">Current Status</th>
        <th style="width: 68%;">Permitted Next Status (typical workflow)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>AVAILABLE</td><td>TRANSFER_PENDING, USED, or EXPIRED</td></tr>
      <tr><td>TRANSFER_PENDING</td><td>AVAILABLE (if rejected/cancelled) or TRANSFERRED</td></tr>
      <tr><td>TRANSFERRED</td><td>TRANSFER_PENDING, USED, or EXPIRED</td></tr>
      <tr><td>USED</td><td>No further transition (Terminal redemption state)</td></tr>
      <tr><td>EXPIRED</td><td>No further transition (Terminal expiration state)</td></tr>
    </tbody>
  </table>
  <p>
    Status transitions are validated centrally within <code>TransferService</code>. Invalid transitions (e.g. attempting to transfer an already <code>USED</code> or <code>EXPIRED</code> token) throw targeted domain exceptions and roll back database operations.
  </p>

  <h3 class="section-title">6.4 Build and Execution Commands</h3>
  <pre class="code-snippet"># From the project root containing pom.xml
mvn clean compile
mvn test
mvn package

# Run Spring Boot application on configured port
java -jar target/digital-token-marketplace-1.0.0.jar --server.port=8085</pre>
  <p>
    The embedded Tomcat server boots immediately, establishing connection pools with MySQL. Access the web dashboard by navigating to <code>http://localhost:8085/</code>.
  </p>

  <h3 class="section-title">6.5 Security and Concurrency Handling</h3>
  <ul>
    <li>Use <code>PreparedStatement</code> parameterized queries exclusively to prevent SQL injection.</li>
    <li>Employ try-with-resources and Spring transaction managers to guarantee connection closure.</li>
    <li>Enforce InnoDB row-level locking (<code>FOR UPDATE</code>) to prevent race conditions during transfers.</li>
    <li>Prevent plain-text password exposure; restrict administrative endpoints via role checks.</li>
    <li>Implement automatic rollback for aborted transactions to maintain relational integrity.</li>
  </ul>
  ${footer(19)}
</div>

<!-- ============================================================== -->
<!-- PAGE 20: CHAPTER 7 - RESULTS AND DISCUSSION -->
<!-- ============================================================== -->
<div class="page" id="page-20">
  <h1 class="chapter-title">CHAPTER 7</h1>
  <h2 class="chapter-subtitle">RESULTS AND DISCUSSION</h2>
  <p>
    The system was thoroughly validated against real MySQL 8 databases to ensure transactional reliability and strict relational constraint enforcement. The test suite verifies student operations, activity quotas, token transfers, concurrency locking, and audit trail creation.
  </p>

  <table class="report-table">
    <thead>
      <tr>
        <th style="width: 14%;">Test ID</th>
        <th style="width: 28%;">Test Scenario</th>
        <th style="width: 38%;">Expected Result</th>
        <th style="width: 20%;">Actual Result</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>TC-01</td><td>Register new student</td><td>Profile saved; confirmation returned</td><td>Passed</td></tr>
      <tr><td>TC-02</td><td>Register duplicate email</td><td>Unique key rejects duplicate email</td><td>Passed</td></tr>
      <tr><td>TC-03</td><td>List active campus activities</td><td>Returns active activities with capacities</td><td>Passed</td></tr>
      <tr><td>TC-04</td><td>Mint digital reservation token</td><td>Generates unique token code & status AVAILABLE</td><td>Passed</td></tr>
      <tr><td>TC-05</td><td>Filter marketplace tokens</td><td>Filters by category, status, and keywords</td><td>Passed</td></tr>
      <tr><td>TC-06</td><td>Create transfer request</td><td>Status changes to TRANSFER_PENDING</td><td>Passed</td></tr>
      <tr><td>TC-07</td><td>Approve transfer with row lock</td><td>Owner reassigned; record written to history</td><td>Passed</td></tr>
      <tr><td>TC-08</td><td>Reject transfer request</td><td>Token status reverts back to AVAILABLE</td><td>Passed</td></tr>
      <tr><td>TC-09</td><td>Concurrent transfer requests</td><td>Row lock serializes requests; no double-spend</td><td>Passed</td></tr>
      <tr><td>TC-10</td><td>Trigger expiry engine sweep</td><td>Past tokens transitioned to EXPIRED</td><td>Passed</td></tr>
      <tr><td>TC-11</td><td>Audit trail logging</td><td>Immutable row stored in history table</td><td>Passed</td></tr>
      <tr><td>TC-12</td><td>Database interruption handling</td><td>Transactions roll back cleanly without data loss</td><td>Passed</td></tr>
    </tbody>
  </table>
  ${footer(20)}
</div>

<!-- ============================================================== -->
<!-- PAGE 21: 7.1 SCREENSHOTS & FIGURE 4 -->
<!-- ============================================================== -->
<div class="page" id="page-21">
  <h3 class="section-title" style="margin-top: 0;">7.1 Screenshots to Insert</h3>
  <p>
    The following genuine screenshots demonstrate the running application and database records across user workflows, token operations, and administrative functions.
  </p>
  <p>
    <strong>Discussion:</strong> The relational database design isolates student profiles, campus activities, digital tokens, and historical logs into normalized tables, completely eliminating duplicate data. Foreign key constraints ensure referential integrity, while distinct enumeration statuses make the token lifecycle unambiguous. Concurrency control via InnoDB row-level locking guarantees that two students cannot acquire or approve the same token simultaneously. The web interface provides seamless access while MySQL serves as the single source of truth.
  </p>

  <div class="figure-box" style="margin-top: 10pt;">
    <img src="${fig4Base64}" style="max-height: 250px; width: 92%;" alt="Marketplace Dashboard Overview">
    <div class="figure-caption">Figure 4: Marketplace Dashboard Overview.</div>
  </div>
  ${footer(21)}
</div>

<!-- ============================================================== -->
<!-- PAGE 22: FIGURES 5 & 6 -->
<!-- ============================================================== -->
<div class="page" id="page-22">
  <div class="figure-box" style="margin-top: 0;">
    <img src="${fig5Base64}" style="max-height: 235px; width: 90%;" alt="Student Registration and Authentication">
    <div class="figure-caption">Figure 5: Student registration and authentication portal.</div>
  </div>

  <div class="figure-box" style="margin-top: 14pt;">
    <img src="${fig6Base64}" style="max-height: 235px; width: 90%;" alt="Campus Activities Catalog">
    <div class="figure-caption">Figure 6: Active campus activities catalog.</div>
  </div>
  ${footer(22)}
</div>

<!-- ============================================================== -->
<!-- PAGE 23: FIGURES 7 & 8 -->
<!-- ============================================================== -->
<div class="page" id="page-23">
  <div class="figure-box" style="margin-top: 0;">
    <img src="${fig7Base64}" style="max-height: 235px; width: 90%;" alt="Token Details and Verification">
    <div class="figure-caption">Figure 7: Token details and reservation verification modal.</div>
  </div>

  <div class="figure-box" style="margin-top: 14pt;">
    <img src="${fig8Base64}" style="max-height: 235px; width: 90%;" alt="Student Token Vault">
    <div class="figure-caption">Figure 8: Student token vault and active reservations.</div>
  </div>
  ${footer(23)}
</div>

<!-- ============================================================== -->
<!-- PAGE 24: FIGURES 9 & 10 -->
<!-- ============================================================== -->
<div class="page" id="page-24">
  <div class="figure-box" style="margin-top: 0;">
    <img src="${fig9Base64}" style="max-height: 235px; width: 90%;" alt="Admin Activity Management">
    <div class="figure-caption">Figure 9: Administrator campus activity management.</div>
  </div>

  <div class="figure-box" style="margin-top: 14pt;">
    <img src="${fig10Base64}" style="max-height: 235px; width: 90%;" alt="Audit Trail and History">
    <div class="figure-caption">Figure 10: Immutable peer-to-peer transfer audit history.</div>
  </div>
  ${footer(24)}
</div>

<!-- ============================================================== -->
<!-- PAGE 25: FIGURE 11 & CHAPTER 8 CONCLUSION -->
<!-- ============================================================== -->
<div class="page" id="page-25">
  <div class="figure-box" style="margin-top: 0; margin-bottom: 12pt;">
    <img src="${fig11Base64}" style="max-height: 220px; width: 90%;" alt="MySQL Persisted Records">
    <div class="figure-caption">Figure 11: MySQL tables showing persisted digital token records.</div>
  </div>

  <h1 class="chapter-title" style="margin-top: 14pt;">CHAPTER 8</h1>
  <h2 class="chapter-subtitle">CONCLUSION AND FUTURE ENHANCEMENT</h2>
  
  <h3 class="section-title">8.1 CONCLUSION</h3>
  <p>
    The Digital Token Marketplace – Peer-to-Peer Campus Token Exchange presents a reliable, structured approach to managing collegiate reservation passes digitally. It streamlines student authentication, activity discovery, token minting, peer-to-peer transfers, and audit inspection. Java 17 and Spring Boot supply backend business logic, Apache Maven coordinates dependencies, Spring Data JDBC with HikariCP establishes resilient database connections, and MySQL 8 with InnoDB guarantees persistent storage.
  </p>
  <p>
    The five-table relational schema successfully showcases relational normalization, foreign key constraints, composite B-tree indexing, and ACID transactional atomicity. Concurrency control via row-level locks prevents race conditions and ensures zero double transfers during peak marketplace activity. The system eliminates reservation wastage, fosters equitable pass access, and provides administrative transparency.
  </p>
  ${footer(25)}
</div>

<!-- ============================================================== -->
<!-- PAGE 26: 8.2 FUTURE ENHANCEMENT & REFERENCES -->
<!-- ============================================================== -->
<div class="page" id="page-26">
  <h3 class="section-title" style="margin-top: 0;">8.2 FUTURE ENHANCEMENT</h3>
  <ul>
    <li>Integrate dynamic QR codes with HMAC cryptographic signatures for venue entrance scanning.</li>
    <li>Incorporate biometric or single sign-on (SSO) authentication using campus institutional LDAP / OAuth2.</li>
    <li>Deploy native mobile applications with push notifications for instant transfer request alerts.</li>
    <li>Implement a karma or credit system to incentivize fair token trading and discourage hoarding.</li>
    <li>Provide automated calendar synchronization (.ics file export) for scheduled activities.</li>
    <li>Develop coordinator analytics dashboards displaying attendance trends and peak demand metrics.</li>
    <li>Deploy the platform onto containerized cloud infrastructure (Docker, Kubernetes) with automated backups.</li>
    <li>Support multi-campus federation and departmental reservation quotas.</li>
  </ul>

  <h3 class="section-title" style="margin-top: 18pt;">REFERENCES</h3>
  <ol style="padding-left: 20px; font-size: 10pt; line-height: 1.6;">
    <li>Oracle. Java 17 Documentation. https://docs.oracle.com/en/java/</li>
    <li>Spring Boot Reference Documentation. https://spring.io/projects/spring-boot</li>
    <li>MySQL. MySQL 8.0 Reference Manual. https://dev.mysql.com/doc/refman/8.0/en/</li>
    <li>HikariCP: High-Performance JDBC Connection Pool. https://github.com/brettwooldridge/HikariCP</li>
    <li>MDN Web Docs. JavaScript, HTML5, and Modern Web APIs. https://developer.mozilla.org/</li>
    <li>JUnit 5 User Guide. Testing Framework for Java. https://junit.org/junit5/docs/current/user-guide/</li>
  </ol>
  ${footer(26)}
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../report/report.html'), html, 'utf8');
console.log('report/report.html successfully written!');
