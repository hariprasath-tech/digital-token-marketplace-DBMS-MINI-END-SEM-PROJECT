package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.DigitalToken;
import com.sece.tokenmarketplace.model.TokenCreateDto;
import com.sece.tokenmarketplace.service.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DigitalToken>>> getTokens(
            @RequestParam(value = "activityId", required = false) Integer activityId,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "venue", required = false) String venue,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "minDate", required = false) String minDate,
            @RequestParam(value = "maxDate", required = false) String maxDate) {
        List<DigitalToken> list = tokenService.getTokens(activityId, category, venue, status, search, minDate, maxDate);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DigitalToken>> getById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(tokenService.getById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<DigitalToken>>> getMyTokens(@PathVariable("studentId") Integer studentId) {
        return ResponseEntity.ok(ApiResponse.ok(tokenService.getByOwner(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DigitalToken>> createToken(@RequestBody TokenCreateDto dto) {
        DigitalToken created = tokenService.createToken(dto);
        return new ResponseEntity<>(ApiResponse.ok("Token listing created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/use")
    public ResponseEntity<ApiResponse<DigitalToken>> markTokenAsUsed(
            @PathVariable("id") Integer id,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(value = "studentId", required = false) Integer queryStudentId) {

        Integer studentId = queryStudentId;
        if (studentId == null && body != null && body.containsKey("studentId")) {
            studentId = Integer.valueOf(body.get("studentId").toString());
        }
        if (studentId == null) {
            studentId = 1; // Default to active student if not specified
        }

        DigitalToken token = tokenService.markAsUsed(id, studentId);
        return ResponseEntity.ok(ApiResponse.ok("Token redeemed successfully and marked as USED.", token));
    }
}
