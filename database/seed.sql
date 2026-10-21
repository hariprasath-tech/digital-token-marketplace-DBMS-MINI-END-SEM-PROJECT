-- ====================================================================
-- Digital Token Marketplace - Seed Data
-- DBMS Mini Project - Academic Year 2026-27
-- Author: Hari Prasath (Sri Eshwar College of Engineering)
-- ====================================================================

USE digital_token_marketplace;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE TOKEN_TRANSFER_HISTORY;
TRUNCATE TABLE TOKEN_TRANSFER_REQUESTS;
TRUNCATE TABLE DIGITAL_TOKENS;
TRUNCATE TABLE CAMPUS_ACTIVITIES;
TRUNCATE TABLE STUDENTS;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. SEED STUDENTS
-- Passwords are stored in plain/hash format for project demo (e.g. password123)
-- --------------------------------------------------------------------
INSERT INTO STUDENTS (student_id, roll_no, name, email, password_hash, department, year_of_study, contact_no, role) VALUES
(1, '23CS101', 'Hari Prasath', 'hari@sece.ac.in', 'pass123', 'Computer Science and Engineering', 3, '+91 98765 43210', 'ADMIN'),
(2, '23AD104', 'Priya S', 'priya@sece.ac.in', 'pass123', 'Artificial Intelligence & Data Science', 3, '+91 98765 43211', 'STUDENT'),
(3, '22EC205', 'Arun Kumar', 'arun@sece.ac.in', 'pass123', 'Electronics and Communication', 4, '+91 98765 43212', 'STUDENT'),
(4, '23IT118', 'Divya M', 'divya@sece.ac.in', 'pass123', 'Information Technology', 3, '+91 98765 43213', 'STUDENT'),
(5, '24ME042', 'Sanjay R', 'sanjay@sece.ac.in', 'pass123', 'Mechanical Engineering', 2, '+91 98765 43214', 'STUDENT'),
(6, '24CS089', 'Kavin B', 'kavin@sece.ac.in', 'pass123', 'Computer Science and Engineering', 2, '+91 98765 43215', 'STUDENT');

-- --------------------------------------------------------------------
-- 2. SEED CAMPUS_ACTIVITIES
-- --------------------------------------------------------------------
INSERT INTO CAMPUS_ACTIVITIES (activity_id, title, category, venue, description, organizer, activity_date, total_capacity, image_url) VALUES
(1, 'Generative AI & LLM Fine-Tuning Bootcamp', 'WORKSHOP', 'Advanced Computing Lab (Lab 3)', 'Hands-on training session on fine-tuning open-source LLMs, LoRA adapters, and deploying RAG pipelines.', 'SECE AI Research Club', '2026-10-25 10:00:00', 40, 'assets/images/activity_workshop.webp'),
(2, 'HackIndia 2026 - 24-Hour National Hackathon', 'EVENT', 'Central Auditorium & Innovation Plaza', 'Annual national-level collegiate hackathon featuring Web3, AI, and IoT tracks with industry mentorship.', 'SECE Coding Cell', '2026-11-02 09:00:00', 120, 'assets/images/activity_event.webp'),
(3, 'Autonomous Drone Navigation & Flight Simulation', 'LAB_SESSION', 'Mechatronics & Robotics Center', 'Experimental simulation lab for ROS2-based drone navigation and indoor collision avoidance.', 'Robotics & Automation Dept', '2026-10-22 14:30:00', 25, 'assets/images/activity_lab.webp'),
(4, 'Inter-Department Badminton Championship', 'SPORTS', 'Indoor Sports Complex - Court 1', 'Annual singles and doubles badminton tournament for SECE engineering departments.', 'SECE Physical Education Dept', '2026-10-20 17:00:00', 30, 'assets/images/activity_sports.webp'),
(5, 'Cybersecurity Red-Teaming & CTF Challenge', 'CLUB_ACTIVITY', 'Cyber Defence Lab (Room 204)', 'Live Capture-the-Flag tournament testing binary exploitation, network forensics, and web penetration.', 'Infosec Security Guild', '2026-10-28 15:00:00', 50, 'assets/images/activity_club.webp'),
(6, 'Cloud Native Microservices with Kubernetes', 'WORKSHOP', 'Seminar Hall 2', 'Architecting and scaling resilient containerized cloud applications on AWS and Kubernetes.', 'Cloud Computing Club', '2026-10-18 11:00:00', 60, 'assets/images/activity_k8s.webp');

-- --------------------------------------------------------------------
-- 3. SEED DIGITAL_TOKENS
-- Mix of AVAILABLE, TRANSFER_PENDING, TRANSFERRED, USED, EXPIRED
-- --------------------------------------------------------------------
INSERT INTO DIGITAL_TOKENS (token_id, token_code, activity_id, owner_student_id, status, valid_from, expiry_date, seat_or_slot, remarks) VALUES
-- Token 1: Available GenAI workshop token owned by Hari
(1, 'TKN-GAI-2026-001', 1, 1, 'AVAILABLE', '2026-10-14 00:00:00', '2026-10-24 23:59:59', 'Seat A-14 (GPU Workstation)', 'Reserved for full day session. Includes high-RAM GPU workstation access.'),

-- Token 2: Transfer pending HackIndia pass owned by Priya (has pending request from Hari)
(2, 'TKN-HCK-2026-002', 2, 2, 'TRANSFER_PENDING', '2026-10-14 00:00:00', '2026-11-01 18:00:00', 'Team Table B-04', 'Hackathon pass with food vouchers and 24h IoT hardware workbench.'),

-- Token 3: Available Drone Simulation token owned by Arun
(3, 'TKN-DRN-2026-003', 3, 3, 'AVAILABLE', '2026-10-14 00:00:00', '2026-10-21 20:00:00', 'Flight Sim Pod #3', 'High-end drone simulation station slot for ROS2 controller testing.'),

-- Token 4: Badminton court slot owned by Sanjay
(4, 'TKN-SPT-2026-004', 4, 5, 'AVAILABLE', '2026-10-14 00:00:00', '2026-10-20 16:00:00', 'Court 1 - Slot 5PM-6PM', 'Reserved evening prime time slot for men singles practice.'),

-- Token 5: Cybersecurity CTF slot owned by Divya
(5, 'TKN-CTF-2026-005', 5, 4, 'AVAILABLE', '2026-10-14 00:00:00', '2026-10-27 22:00:00', 'Terminal 22', 'Qualifying round terminal with dedicated Kali Linux access.'),

-- Token 6: Cloud workshop token transferred from Arun to Hari in the past
(6, 'TKN-K8S-2026-006', 6, 1, 'TRANSFERRED', '2026-10-10 00:00:00', '2026-10-18 10:00:00', 'Seat C-08', 'Transferred earlier from Arun to Hari. Ready for use.'),

-- Token 7: GenAI workshop token owned by Priya, marked USED
(7, 'TKN-GAI-2026-007', 1, 2, 'USED', '2026-10-10 00:00:00', '2026-10-25 10:00:00', 'Seat A-15', 'Token redeemed at registration desk.'),

-- Token 8: An older badminton pass that already expired
(8, 'TKN-SPT-2026-008', 4, 3, 'EXPIRED', '2026-10-01 00:00:00', '2026-10-08 17:00:00', 'Court 2 - Slot 4PM', 'Expired without redemption.'),

-- Token 9: Available Cloud workshop pass owned by Kavin
(9, 'TKN-K8S-2026-009', 6, 6, 'AVAILABLE', '2026-10-14 00:00:00', '2026-10-18 09:00:00', 'Seat B-21', 'Extra pass from department reservation.'),

-- Token 10: HackIndia pass owned by Divya
(10, 'TKN-HCK-2026-010', 2, 4, 'AVAILABLE', '2026-10-14 00:00:00', '2026-11-01 12:00:00', 'Team Table C-01', 'Includes mentor consultation pass and presentation slot.');

-- --------------------------------------------------------------------
-- 4. SEED TOKEN_TRANSFER_REQUESTS
-- --------------------------------------------------------------------
INSERT INTO TOKEN_TRANSFER_REQUESTS (request_id, token_id, requester_student_id, owner_student_id, request_status, request_reason, response_note, requested_at, responded_at) VALUES
-- Pending request: Hari Prasath requesting Token 2 (HackIndia pass) from Priya S
(1, 2, 1, 2, 'PENDING', 'Need this pass to represent our department AI hackathon team!', NULL, '2026-10-14 11:30:00', NULL),

-- Approved request: Hari requested Token 6 from Arun Kumar (already processed into history)
(2, 6, 1, 3, 'APPROVED', 'I have lab exams on the other day, so I really need this Kubernetes workshop seat.', 'Transfer approved! Best of luck with the workshop.', '2026-10-11 14:15:00', '2026-10-11 16:45:00'),

-- Rejected request: Sanjay requested Token 1 from Hari
(3, 1, 5, 1, 'REJECTED', 'Can I take your GenAI token?', 'Sorry, I am attending this workshop myself.', '2026-10-13 09:20:00', '2026-10-13 10:00:00');

-- --------------------------------------------------------------------
-- 5. SEED TOKEN_TRANSFER_HISTORY
-- --------------------------------------------------------------------
INSERT INTO TOKEN_TRANSFER_HISTORY (history_id, token_id, request_id, from_student_id, to_student_id, transferred_at, remarks) VALUES
(1, 6, 2, 3, 1, '2026-10-11 16:45:00', 'Official peer-to-peer transfer via Marketplace with row locking verification.');
