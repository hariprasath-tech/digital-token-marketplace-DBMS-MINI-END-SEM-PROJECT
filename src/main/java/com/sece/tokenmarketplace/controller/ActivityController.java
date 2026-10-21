package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.model.ActivityCreateDto;
import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.CampusActivity;
import com.sece.tokenmarketplace.service.ActivityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final com.sece.tokenmarketplace.service.StudentService studentService;

    public ActivityController(ActivityService activityService, com.sece.tokenmarketplace.service.StudentService studentService) {
        this.activityService = activityService;
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampusActivity>>> getAll(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search) {
        List<CampusActivity> activities = activityService.getAll(category, search);
        return ResponseEntity.ok(ApiResponse.ok(activities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampusActivity>> getById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(activityService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampusActivity>> create(
            @RequestHeader(value = "X-Student-Id", required = false) Integer headerStudentId,
            @RequestParam(value = "studentId", required = false) Integer paramStudentId,
            @RequestBody ActivityCreateDto dto) {
        Integer callerId = dto.getAdminStudentId() != null ? dto.getAdminStudentId() : (paramStudentId != null ? paramStudentId : headerStudentId);
        if (!studentService.isAdmin(callerId)) {
            return new ResponseEntity<>(ApiResponse.error("Access denied: Administrator role required (403)"), HttpStatus.FORBIDDEN);
        }
        CampusActivity created = activityService.create(dto);
        return new ResponseEntity<>(ApiResponse.ok("Campus activity created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampusActivity>> update(
            @PathVariable("id") Integer id,
            @RequestHeader(value = "X-Student-Id", required = false) Integer headerStudentId,
            @RequestParam(value = "studentId", required = false) Integer paramStudentId,
            @RequestBody ActivityCreateDto dto) {
        Integer callerId = dto.getAdminStudentId() != null ? dto.getAdminStudentId() : (paramStudentId != null ? paramStudentId : headerStudentId);
        if (!studentService.isAdmin(callerId)) {
            return new ResponseEntity<>(ApiResponse.error("Access denied: Administrator role required (403)"), HttpStatus.FORBIDDEN);
        }
        CampusActivity updated = activityService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Campus activity updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable("id") Integer id,
            @RequestHeader(value = "X-Student-Id", required = false) Integer headerStudentId,
            @RequestParam(value = "studentId", required = false) Integer paramStudentId) {
        Integer callerId = paramStudentId != null ? paramStudentId : headerStudentId;
        if (!studentService.isAdmin(callerId)) {
            return new ResponseEntity<>(ApiResponse.error("Access denied: Administrator role required (403)"), HttpStatus.FORBIDDEN);
        }
        activityService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Campus activity removed successfully", null));
    }
}
