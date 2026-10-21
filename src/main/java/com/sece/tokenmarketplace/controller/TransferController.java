package com.sece.tokenmarketplace.controller;

import com.sece.tokenmarketplace.model.ApiResponse;
import com.sece.tokenmarketplace.model.TokenTransferRequest;
import com.sece.tokenmarketplace.model.TransferActionDto;
import com.sece.tokenmarketplace.model.TransferRequestDto;
import com.sece.tokenmarketplace.service.TransferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TokenTransferRequest>> requestTransfer(@RequestBody TransferRequestDto dto) {
        TokenTransferRequest request = transferService.requestTransfer(dto);
        return new ResponseEntity<>(ApiResponse.ok("Transfer request submitted successfully. Awaiting owner approval.", request), HttpStatus.CREATED);
    }

    @GetMapping("/incoming/{studentId}")
    public ResponseEntity<ApiResponse<List<TokenTransferRequest>>> getIncoming(@PathVariable("studentId") Integer studentId) {
        List<TokenTransferRequest> list = transferService.getIncomingRequests(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/outgoing/{studentId}")
    public ResponseEntity<ApiResponse<List<TokenTransferRequest>>> getOutgoing(@PathVariable("studentId") Integer studentId) {
        List<TokenTransferRequest> list = transferService.getOutgoingRequests(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<TokenTransferRequest>> approveTransfer(
            @PathVariable("id") Integer id,
            @RequestBody TransferActionDto actionDto) {
        TokenTransferRequest request = transferService.approveTransfer(id, actionDto.getStudentId(), actionDto.getResponseNote());
        return ResponseEntity.ok(ApiResponse.ok("Transfer approved! Token ownership securely updated in database with row locking.", request));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<TokenTransferRequest>> rejectTransfer(
            @PathVariable("id") Integer id,
            @RequestBody TransferActionDto actionDto) {
        TokenTransferRequest request = transferService.rejectTransfer(id, actionDto.getStudentId(), actionDto.getResponseNote());
        return ResponseEntity.ok(ApiResponse.ok("Transfer request rejected.", request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<TokenTransferRequest>> cancelTransfer(
            @PathVariable("id") Integer id,
            @RequestBody TransferActionDto actionDto) {
        TokenTransferRequest request = transferService.cancelTransfer(id, actionDto.getStudentId());
        return ResponseEntity.ok(ApiResponse.ok("Transfer request cancelled.", request));
    }
}
