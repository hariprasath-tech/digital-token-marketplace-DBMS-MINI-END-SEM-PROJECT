package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.DashboardStats;
import com.sece.tokenmarketplace.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        DashboardStats stats = statsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @PostMapping("/run-expiry")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerExpirySweep() {
        int count = statsService.runManualExpiryCheck();
        return ResponseEntity.ok(ApiResponse.ok("Token expiry engine executed successfully.", Map.of(
                "expiredTokensCount", count,
                "message", count > 0 ? "Identified and expired " + count + " tokens." : "All tokens are up to date. None expired."
        )));
    }
}
