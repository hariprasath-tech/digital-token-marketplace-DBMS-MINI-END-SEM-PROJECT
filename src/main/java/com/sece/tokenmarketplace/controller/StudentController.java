package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.LoginRequest;
import com.sece.tokenmarketplace.model.Student;
import com.sece.tokenmarketplace.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Student>> register(@RequestBody Student student) {
        Student created = studentService.register(student);
        return new ResponseEntity<>(ApiResponse.ok("Student registration successful", created), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Student>> login(@RequestBody LoginRequest loginRequest) {
        Student student = studentService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(ApiResponse.ok("Login successful. Welcome back, " + student.getName(), student));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getById(id)));
    }
}
