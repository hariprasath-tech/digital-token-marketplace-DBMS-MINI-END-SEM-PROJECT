package com.sece.tokenmarketplace.service;

import com.sece.tokenmarketplace.dao.StudentDao;
import com.sece.tokenmarketplace.exception.MarketplaceException;
import com.sece.tokenmarketplace.exception.ResourceNotFoundException;
import com.sece.tokenmarketplace.model.Student;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public Student register(Student student) {
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new MarketplaceException("Email cannot be empty");
        }
        if (student.getRollNo() == null || student.getRollNo().trim().isEmpty()) {
            throw new MarketplaceException("Roll Number cannot be empty");
        }
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new MarketplaceException("Name cannot be empty");
        }

        if (studentDao.findByEmail(student.getEmail().trim()).isPresent()) {
            throw new MarketplaceException("Student with email '" + student.getEmail() + "' already exists");
        }
        if (studentDao.findByRollNo(student.getRollNo().trim()).isPresent()) {
            throw new MarketplaceException("Student with roll number '" + student.getRollNo() + "' already exists");
        }

        if (student.getPasswordHash() == null || student.getPasswordHash().trim().isEmpty()) {
            student.setPasswordHash("pass123");
        }

        return studentDao.save(student);
    }

    public Student login(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            throw new MarketplaceException("Email is required for login");
        }
        Student student = studentDao.findByEmail(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("No student found with email: " + email));

        if (password != null && !password.trim().isEmpty()) {
            if (!student.getPasswordHash().equals(password.trim())) {
                throw new MarketplaceException("Invalid password. Please check your credentials.");
            }
        }
        return student;
    }

    public Student getById(Integer studentId) {
        return studentDao.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
    }

    public List<Student> getAll() {
        return studentDao.findAll();
    }

    public boolean isAdmin(Integer studentId) {
        if (studentId == null) return false;
        return studentDao.findById(studentId)
                .map(Student::getIsAdmin)
                .orElse(false);
    }
}
