-- ====================================================================
-- Digital Token Marketplace - Database Schema
-- DBMS Mini Project - Academic Year 2026-27
-- Author: Hari Prasath (Sri Eshwar College of Engineering)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS digital_token_marketplace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE digital_token_marketplace;

-- Disable foreign key checks for clean recreation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS TOKEN_TRANSFER_HISTORY;
DROP TABLE IF EXISTS TOKEN_TRANSFER_REQUESTS;
DROP TABLE IF EXISTS DIGITAL_TOKENS;
DROP TABLE IF EXISTS CAMPUS_ACTIVITIES;
DROP TABLE IF EXISTS STUDENTS;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. STUDENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE STUDENTS (
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

-- --------------------------------------------------------------------
-- 2. CAMPUS_ACTIVITIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE CAMPUS_ACTIVITIES (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category ENUM('WORKSHOP', 'EVENT', 'LAB_SESSION', 'SPORTS', 'CLUB_ACTIVITY') NOT NULL,
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

-- --------------------------------------------------------------------
-- 3. DIGITAL_TOKENS TABLE
-- --------------------------------------------------------------------
CREATE TABLE DIGITAL_TOKENS (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    token_code VARCHAR(64) NOT NULL UNIQUE,
    activity_id INT NOT NULL,
    owner_student_id INT NOT NULL,
    status ENUM('AVAILABLE', 'TRANSFER_PENDING', 'TRANSFERRED', 'USED', 'EXPIRED') NOT NULL DEFAULT 'AVAILABLE',
    valid_from DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL,
    seat_or_slot VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tokens_activity FOREIGN KEY (activity_id)
        REFERENCES CAMPUS_ACTIVITIES (activity_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_tokens_owner FOREIGN KEY (owner_student_id)
        REFERENCES STUDENTS (student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_tokens_status (status),
    INDEX idx_tokens_expiry (expiry_date),
    INDEX idx_tokens_owner (owner_student_id),
    INDEX idx_tokens_activity (activity_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. TOKEN_TRANSFER_REQUESTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE TOKEN_TRANSFER_REQUESTS (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL,
    requester_student_id INT NOT NULL,
    owner_student_id INT NOT NULL,
    request_status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    request_reason VARCHAR(255),
    response_note VARCHAR(255),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME NULL,
    CONSTRAINT fk_requests_token FOREIGN KEY (token_id)
        REFERENCES DIGITAL_TOKENS (token_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_requests_requester FOREIGN KEY (requester_student_id)
        REFERENCES STUDENTS (student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_requests_owner FOREIGN KEY (owner_student_id)
        REFERENCES STUDENTS (student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_requests_token (token_id),
    INDEX idx_requests_requester (requester_student_id),
    INDEX idx_requests_owner (owner_student_id),
    INDEX idx_requests_status (request_status)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. TOKEN_TRANSFER_HISTORY TABLE
-- --------------------------------------------------------------------
CREATE TABLE TOKEN_TRANSFER_HISTORY (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL,
    request_id INT NULL,
    from_student_id INT NOT NULL,
    to_student_id INT NOT NULL,
    transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255),
    CONSTRAINT fk_history_token FOREIGN KEY (token_id)
        REFERENCES DIGITAL_TOKENS (token_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_history_request FOREIGN KEY (request_id)
        REFERENCES TOKEN_TRANSFER_REQUESTS (request_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_history_from FOREIGN KEY (from_student_id)
        REFERENCES STUDENTS (student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_history_to FOREIGN KEY (to_student_id)
        REFERENCES STUDENTS (student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_history_token (token_id),
    INDEX idx_history_from (from_student_id),
    INDEX idx_history_to (to_student_id),
    INDEX idx_history_transferred_at (transferred_at)
) ENGINE=InnoDB;
