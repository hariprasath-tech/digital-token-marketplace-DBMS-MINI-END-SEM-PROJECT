package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.dao.HistoryDao;
import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.TokenTransferHistory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryDao historyDao;

    public HistoryController(HistoryDao historyDao) {
        this.historyDao = historyDao;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TokenTransferHistory>>> getHistory(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "studentId", required = false) Integer studentId,
            @RequestParam(value = "limit", required = false) Integer limit) {
        List<TokenTransferHistory> list = historyDao.findAll(search, studentId, limit);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
