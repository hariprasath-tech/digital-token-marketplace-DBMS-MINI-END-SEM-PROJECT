# Digital Token Marketplace

A futuristic campus platform where students exchange unused digital tokens and reservations for workshops, events, lab sessions, sports facilities and club activities.

---

## Academic Details
- **Project**: DBMS Mini Project (End Semester)
- **Academic Year**: 2026-27
- **Institution**: Sri Eshwar College of Engineering (SECE)
- **Author**: Hari Prasath

---

## Key Features
- **Student Authentication & Switching**: Registration and login with seamless 1-click active student switching for peer-to-peer demonstration.
- **Campus Activity Management**: Comprehensive registry of workshops, national hackathons, robotic simulations, sports tournaments, and club activities.
- **Digital Token Listing**: Mint tokens with custom allocations (seats, slots, pods), validity ranges, and precise expiry timestamps.
- **Search & Filter Marketplace**: Real-time keyword search, category filtering, availability status toggles, and live expiry countdown timers.
- **Row-Locking Transfer Transaction**: Peer-to-peer transfer requests with pessimistic row locking (`SELECT ... FOR UPDATE`), strictly preventing double transfers.
- **Automated Scheduled Expiry**: Background cron job (`@Scheduled`) sweeping expired tokens every 60 seconds and auto-rejecting outstanding requests.
- **Complete Transfer Audit Trail**: Permanent transaction ledger (`TOKEN_TRANSFER_HISTORY`) tracking token lifecycle and ownership history.
- **Animated Futuristic UI**: Dark cyberpunk aesthetics, glassmorphism, responsive layout, and an interactive 3D Three.js hologram canvas.
- **Menu-Driven Console Mode**: Full-featured interactive CLI menu for terminal demonstration.

---

## Technology Stack
| Layer | Technology |
|---|---|
| **Backend** | Java 17, Spring Boot 3.3.4, Plain JDBC / Prepared Statements |
| **Database** | MySQL 8.x InnoDB (ACID Compliant) |
| **Build & Dependencies** | Apache Maven 3.9+ |
| **Frontend** | HTML5, Modern CSS3 (Glassmorphism & Cyberpunk Theme), Vanilla JS |
| **Visuals & Animation** | Three.js (3D Hologram), GSAP, Studio Freight Lenis |
| **Concurrency Control** | InnoDB Row-Level Locking (`FOR UPDATE`) with Spring Transactions |

---

## Database Architecture
The application runs on the `digital_token_marketplace` database with five interconnected tables:

### 1. `STUDENTS`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `student_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student identifier |
| `roll_no` | VARCHAR(50) | UNIQUE, NOT NULL | College roll number (e.g. 23CS101) |
| `name` | VARCHAR(100) | NOT NULL | Full student name |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | College email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Authentication password |
| `department` | VARCHAR(50) | NOT NULL | Department / Branch |
| `year_of_study` | INT | CHECK (1-5) | Current academic year |
| `contact_no` | VARCHAR(20) | NULL | Phone number |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

### 2. `CAMPUS_ACTIVITIES`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `activity_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique activity identifier |
| `title` | VARCHAR(150) | NOT NULL | Name of workshop or event |
| `category` | ENUM | NOT NULL | WORKSHOP, EVENT, LAB_SESSION, SPORTS, CLUB_ACTIVITY |
| `venue` | VARCHAR(100) | NOT NULL | Campus location / Lab |
| `description` | TEXT | NULL | Agenda and prerequisites |
| `organizer` | VARCHAR(100) | NOT NULL | Organizing club or department |
| `activity_date` | DATETIME | NOT NULL | Scheduled session datetime |
| `total_capacity` | INT | DEFAULT 50 | Total seats / capacity |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created timestamp |

### 3. `DIGITAL_TOKENS`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `token_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique token identifier |
| `token_code` | VARCHAR(64) | UNIQUE, NOT NULL | Cryptographic code (e.g. TKN-WOR-2026-XXXX) |
| `activity_id` | INT | FOREIGN KEY -> CAMPUS_ACTIVITIES | Associated campus event |
| `owner_student_id` | INT | FOREIGN KEY -> STUDENTS | Current token owner |
| `status` | ENUM | NOT NULL DEFAULT 'AVAILABLE' | AVAILABLE, TRANSFER_PENDING, TRANSFERRED, USED, EXPIRED |
| `valid_from` | DATETIME | NOT NULL | Token valid start time |
| `expiry_date` | DATETIME | NOT NULL | Token expiration timestamp |
| `seat_or_slot` | VARCHAR(50) | NULL | Seat number / Workstation pod |
| `remarks` | TEXT | NULL | Additional perks or conditions |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Created timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last updated timestamp |

### 4. `TOKEN_TRANSFER_REQUESTS`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `request_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Transfer request ID |
| `token_id` | INT | FOREIGN KEY -> DIGITAL_TOKENS | Requested token |
| `requester_student_id`| INT | FOREIGN KEY -> STUDENTS | Student seeking token |
| `owner_student_id` | INT | FOREIGN KEY -> STUDENTS | Current owner of token |
| `request_status` | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED, CANCELLED |
| `request_reason` | VARCHAR(255) | NULL | Justification for transfer |
| `response_note` | VARCHAR(255) | NULL | Owner's reply note |
| `requested_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Request timestamp |
| `responded_at` | DATETIME | NULL | Approval/Rejection timestamp |

### 5. `TOKEN_TRANSFER_HISTORY`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `history_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Audit entry identifier |
| `token_id` | INT | FOREIGN KEY -> DIGITAL_TOKENS | Token transferred |
| `request_id` | INT | FOREIGN KEY -> TOKEN_TRANSFER_REQUESTS | Associated request |
| `from_student_id` | INT | FOREIGN KEY -> STUDENTS | Former owner |
| `to_student_id` | INT | FOREIGN KEY -> STUDENTS | New owner |
| `transferred_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Transaction timestamp |
| `remarks` | VARCHAR(255) | NULL | Audit verification notes |

---

## Concurrency & Business Rules
1. **Pessimistic Row-Level Locking**: When an owner approves a transfer request, Spring executes an atomic transaction with `SELECT * FROM DIGITAL_TOKENS WHERE token_id = ? FOR UPDATE`. This locks the row in InnoDB, preventing race conditions so a token can never be transferred to more than one student.
2. **Mutual Exclusion**: Token owners cannot request transfers for their own listed tokens.
3. **Automatic Rival Rejection**: Upon approval of one transfer request, all other competing `PENDING` requests for the same token are automatically rejected with an audit notification.
4. **Scheduled Expiration Sweep**: An automatic background cron task sweeps the database every 60 seconds (`0 * * * * ?`), moving past-due tokens to `EXPIRED` status and canceling any stale requests.

---

## Getting Started

### Prerequisites
- **JDK 17+**
- **Apache Maven 3.9+**
- **MySQL Server 8.x**

### 1. Database Setup
```bash
# Apply schema and create database
mysql -u root -p < database/schema.sql

# Seed initial demonstration data
mysql -u root -p digital_token_marketplace < database/seed.sql
```

### 2. Configure Database Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/digital_token_marketplace?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run the Web Application
```bash
mvn spring-boot:run
```
Open your browser and navigate to:
```
http://localhost:8080
```

### 4. Run Menu-Driven Console Mode
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--console
```
Or execute directly from the packaged JAR:
```bash
java -jar target/digital-token-marketplace-1.0.0.jar --console
```

---

## REST API Overview

| Area | HTTP Method | Endpoint | Description |
|---|---|---|---|
| **Students** | `POST` | `/api/students` | Register a new student |
| | `POST` | `/api/students/login` | Student email & password login |
| | `GET` | `/api/students` | List all registered students |
| | `GET` | `/api/students/{id}` | Get student profile by ID |
| **Activities** | `GET` | `/api/activities` | List campus activities (with category/search filters) |
| | `GET` | `/api/activities/{id}` | Get activity details by ID |
| | `POST` | `/api/activities` | Create a new campus activity |
| | `PUT` | `/api/activities/{id}` | Update an existing activity |
| | `DELETE` | `/api/activities/{id}` | Delete activity |
| **Tokens** | `GET` | `/api/tokens` | Browse and filter marketplace tokens |
| | `GET` | `/api/tokens/{id}` | Retrieve comprehensive token details |
| | `GET` | `/api/tokens/student/{studentId}` | Retrieve all tokens owned by a student |
| | `POST` | `/api/tokens` | List a new token for an activity |
| | `PUT` | `/api/tokens/{id}/use` | Redeem / mark token as USED |
| **Transfers** | `POST` | `/api/transfers` | Submit a token transfer request |
| | `GET` | `/api/transfers/incoming/{studentId}`| Get transfer requests for my tokens |
| | `GET` | `/api/transfers/outgoing/{studentId}`| Get requests sent by me |
| | `PUT` | `/api/transfers/{id}/approve` | Approve transfer request (Row Lock `FOR UPDATE`) |
| | `PUT` | `/api/transfers/{id}/reject` | Decline transfer request |
| | `PUT` | `/api/transfers/{id}/cancel` | Cancel an outgoing transfer request |
| **Audit Trail** | `GET` | `/api/history` | Retrieve verified transfer audit trail |
| **Analytics** | `GET` | `/api/stats` | Aggregated marketplace metrics & status meters |
| | `POST` | `/api/stats/run-expiry` | Trigger on-demand expiry sweep engine |

---

## Project Directory Structure
```
digital-token-marketplace/
├── database/
│   ├── schema.sql              # Database DDL with foreign keys and indexes
│   └── seed.sql                # Demonstration seed records
├── src/
│   ├── main/
│   │   ├── java/com/sece/tokenmarketplace/
│   │   │   ├── TokenMarketplaceApplication.java
│   │   │   ├── config/         # DatabaseConfig, WebConfig
│   │   │   ├── model/          # Entities & DTOs (Student, Token, Request, History)
│   │   │   ├── dao/            # Plain JDBC DAOs with row locking
│   │   │   ├── service/        # Business logic & transactional operations
│   │   │   ├── controller/     # REST API Controllers
│   │   │   ├── scheduler/      # Scheduled token expiry engine
│   │   │   ├── exception/      # Global exception handling
│   │   │   └── console/        # Menu-driven CLI runner
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/         # Frontend Web Application
│   │           ├── index.html  # Cyberpunk single-page application
│   │           ├── css/
│   │           │   └── style.css
│   │           └── js/
│   │               ├── app.js          # Master frontend controller
│   │               ├── api.js          # REST client wrapper
│   │               └── three-scene.js  # 3D Three.js hologram canvas
├── pom.xml                     # Maven project configuration
└── README.md
```

---

## Author & Credits
- **Author**: Hari Prasath
- **Institution**: Sri Eshwar College of Engineering (SECE)
- **Department**: Computer Science and Engineering
- **Academic Year**: 2026-2027
