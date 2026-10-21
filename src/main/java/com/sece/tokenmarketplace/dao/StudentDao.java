package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentDao {
    Optional<Student> findById(Integer studentId);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findAll();
    Student save(Student student);
}
