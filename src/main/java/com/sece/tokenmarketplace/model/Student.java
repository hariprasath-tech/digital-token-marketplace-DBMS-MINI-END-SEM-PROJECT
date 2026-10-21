package com.sece.tokenmarketplace.model;

import java.time.LocalDateTime;

public class Student {
    private Integer studentId;
    private String rollNo;
    private String name;
    private String email;
    private String passwordHash;
    private String department;
    private Integer yearOfStudy;
    private String contactNo;
    private String role = "STUDENT";
    private LocalDateTime createdAt;

    public Student() {
    }

    public Student(Integer studentId, String rollNo, String name, String email, String passwordHash,
                   String department, Integer yearOfStudy, String contactNo, LocalDateTime createdAt) {
        this(studentId, rollNo, name, email, passwordHash, department, yearOfStudy, contactNo, "STUDENT", createdAt);
    }

    public Student(Integer studentId, String rollNo, String name, String email, String passwordHash,
                   String department, Integer yearOfStudy, String contactNo, String role, LocalDateTime createdAt) {
        this.studentId = studentId;
        this.rollNo = rollNo;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
        this.contactNo = contactNo;
        this.role = role != null ? role : "STUDENT";
        this.createdAt = createdAt;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role != null ? role : "STUDENT";
    }

    public void setRole(String role) {
        this.role = role != null ? role : "STUDENT";
    }

    public boolean getIsAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }
}

