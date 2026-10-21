package com.sece.tokenmarketplace.service;

import com.sece.tokenmarketplace.dao.DigitalTokenDao;
import com.sece.tokenmarketplace.dao.HistoryDao;
import com.sece.tokenmarketplace.dao.StudentDao;
import com.sece.tokenmarketplace.dao.TokenTransferDao;
import com.sece.tokenmarketplace.exception.MarketplaceException;
import com.sece.tokenmarketplace.exception.ResourceNotFoundException;
import com.sece.tokenmarketplace.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransferService {

    private final TokenTransferDao transferDao;
    private final DigitalTokenDao tokenDao;
    private final StudentDao studentDao;
    private final HistoryDao historyDao;

    public TransferService(TokenTransferDao transferDao, DigitalTokenDao tokenDao,
                           StudentDao studentDao, HistoryDao historyDao) {
        this.transferDao = transferDao;
        this.tokenDao = tokenDao;
        this.studentDao = studentDao;
        this.historyDao = historyDao;
    }

    public List<TokenTransferRequest> getIncomingRequests(Integer ownerStudentId) {
        studentDao.findById(ownerStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + ownerStudentId));
        return transferDao.findIncomingRequests(ownerStudentId);
    }

    public List<TokenTransferRequest> getOutgoingRequests(Integer requesterStudentId) {
        studentDao.findById(requesterStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + requesterStudentId));
        return transferDao.findOutgoingRequests(requesterStudentId);
    }

    @Transactional
    public TokenTransferRequest requestTransfer(TransferRequestDto dto) {
        if (dto.getTokenId() == null) {
            throw new MarketplaceException("Token ID is required to request transfer");
        }
        if (dto.getRequesterStudentId() == null) {
            throw new MarketplaceException("Requester Student ID is required");
        }

        Student requester = studentDao.findById(dto.getRequesterStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Requester student not found"));

        DigitalToken token = tokenDao.findById(dto.getTokenId())
                .orElseThrow(() -> new ResourceNotFoundException("Token not found with ID: " + dto.getTokenId()));

        // Rule: A token can only be requested while AVAILABLE (or with pending transfers) and not expired
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenDao.updateStatus(token.getTokenId(), "EXPIRED");
            throw new MarketplaceException("Cannot request this token because it has already expired.");
        }

        if (!"AVAILABLE".equalsIgnoreCase(token.getStatus()) && !"TRANSFER_PENDING".equalsIgnoreCase(token.getStatus())) {
            throw new MarketplaceException("Token is not available for transfer. Current status: " + token.getStatus());
        }

        // Rule: Owners cannot request their own tokens
        if (token.getOwnerStudentId().equals(requester.getStudentId())) {
            throw new MarketplaceException("You cannot request your own listed token.");
        }

        // Prevent duplicate pending request by the same student
        List<TokenTransferRequest> existingRequests = transferDao.findByTokenId(token.getTokenId());
        boolean alreadyRequested = existingRequests.stream()
                .anyMatch(r -> r.getRequesterStudentId().equals(requester.getStudentId()) && "PENDING".equalsIgnoreCase(r.getRequestStatus()));
        if (alreadyRequested) {
            throw new MarketplaceException("You already have an active pending transfer request for this token.");
        }

        TokenTransferRequest request = new TokenTransferRequest();
        request.setTokenId(token.getTokenId());
        request.setRequesterStudentId(requester.getStudentId());
        request.setOwnerStudentId(token.getOwnerStudentId());
        request.setRequestStatus("PENDING");
        request.setRequestReason(dto.getRequestReason() != null && !dto.getRequestReason().trim().isEmpty()
                ? dto.getRequestReason().trim()
                : "Student transfer request");

        request = transferDao.save(request);

        // Update token state to TRANSFER_PENDING
        tokenDao.updateStatus(token.getTokenId(), "TRANSFER_PENDING");

        return transferDao.findById(request.getRequestId())
                .orElse(request);
    }

    /**
     * Approving a transfer runs in one transaction with row locking (SELECT ... FOR UPDATE),
     * guaranteeing race conditions are prevented and a token can never go to two students.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public TokenTransferRequest approveTransfer(Integer requestId, Integer ownerStudentId, String note) {
        TokenTransferRequest request = transferDao.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + requestId));

        if (!"PENDING".equalsIgnoreCase(request.getRequestStatus())) {
            throw new MarketplaceException("Request is no longer pending. Current status: " + request.getRequestStatus());
        }

        if (!request.getOwnerStudentId().equals(ownerStudentId)) {
            throw new MarketplaceException("Unauthorized: Only the current token owner can approve this request.");
        }

        // Acquire pessimistic row lock on the token row in MySQL
        DigitalToken lockedToken = tokenDao.findByIdForUpdate(request.getTokenId())
                .orElseThrow(() -> new ResourceNotFoundException("Token locked for transaction but not found: " + request.getTokenId()));

        // Re-validate token state under lock
        if (lockedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenDao.updateStatus(lockedToken.getTokenId(), "EXPIRED");
            transferDao.updateStatus(requestId, "REJECTED", "Auto-rejected: token expired before approval.");
            throw new MarketplaceException("Approval failed: Token has already expired.");
        }

        if (!lockedToken.getOwnerStudentId().equals(ownerStudentId)) {
            throw new MarketplaceException("Approval failed: Token ownership has already changed.");
        }

        if ("USED".equalsIgnoreCase(lockedToken.getStatus()) || "EXPIRED".equalsIgnoreCase(lockedToken.getStatus())) {
            throw new MarketplaceException("Approval failed: Token is already " + lockedToken.getStatus());
        }

        // 1. Update Token ownership to requester, and mark as AVAILABLE for the new owner
        tokenDao.updateOwnerAndStatus(lockedToken.getTokenId(), request.getRequesterStudentId(), "AVAILABLE");

        // 2. Mark this request as APPROVED
        String approvalNote = (note != null && !note.trim().isEmpty()) ? note.trim() : "Transfer request approved by owner.";
        transferDao.updateStatus(requestId, "APPROVED", approvalNote);

        // 3. Automatically reject any other pending requests for the same token
        transferDao.rejectAllOtherPendingRequestsForToken(
                lockedToken.getTokenId(),
                requestId,
                "Token transfer completed to student " + request.getRequesterName() + " (" + request.getRequesterRollNo() + ")."
        );

        // 4. Record permanent audit entry in TOKEN_TRANSFER_HISTORY
        TokenTransferHistory history = new TokenTransferHistory();
        history.setTokenId(lockedToken.getTokenId());
        history.setRequestId(requestId);
        history.setFromStudentId(ownerStudentId);
        history.setToStudentId(request.getRequesterStudentId());
        history.setTransferredAt(LocalDateTime.now());
        history.setRemarks("Peer-to-peer transfer approved with DBMS row lock verification.");
        historyDao.save(history);

        return transferDao.findById(requestId).orElse(request);
    }

    @Transactional
    public TokenTransferRequest rejectTransfer(Integer requestId, Integer ownerStudentId, String note) {
        TokenTransferRequest request = transferDao.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + requestId));

        if (!"PENDING".equalsIgnoreCase(request.getRequestStatus())) {
            throw new MarketplaceException("Request is no longer pending. Current status: " + request.getRequestStatus());
        }

        if (!request.getOwnerStudentId().equals(ownerStudentId)) {
            throw new MarketplaceException("Unauthorized: Only the current token owner can reject this request.");
        }

        String rejectNote = (note != null && !note.trim().isEmpty()) ? note.trim() : "Transfer request declined by owner.";
        transferDao.updateStatus(requestId, "REJECTED", rejectNote);

        // Check if there are remaining pending requests for this token
        List<TokenTransferRequest> pending = transferDao.findByTokenId(request.getTokenId());
        boolean hasOtherPending = pending.stream()
                .anyMatch(r -> !r.getRequestId().equals(requestId) && "PENDING".equalsIgnoreCase(r.getRequestStatus()));

        if (!hasOtherPending) {
            tokenDao.updateStatus(request.getTokenId(), "AVAILABLE");
        }

        return transferDao.findById(requestId).orElse(request);
    }

    @Transactional
    public TokenTransferRequest cancelTransfer(Integer requestId, Integer requesterStudentId) {
        TokenTransferRequest request = transferDao.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer request not found with ID: " + requestId));

        if (!"PENDING".equalsIgnoreCase(request.getRequestStatus())) {
            throw new MarketplaceException("Request is not pending. Cannot cancel a request with status: " + request.getRequestStatus());
        }

        if (!request.getRequesterStudentId().equals(requesterStudentId)) {
            throw new MarketplaceException("Unauthorized: Only the requester can cancel their request.");
        }

        transferDao.updateStatus(requestId, "CANCELLED", "Cancelled by requester student.");

        // Check if there are remaining pending requests for this token
        List<TokenTransferRequest> pending = transferDao.findByTokenId(request.getTokenId());
        boolean hasOtherPending = pending.stream()
                .anyMatch(r -> !r.getRequestId().equals(requestId) && "PENDING".equalsIgnoreCase(r.getRequestStatus()));

        if (!hasOtherPending) {
            tokenDao.updateStatus(request.getTokenId(), "AVAILABLE");
        }

        return transferDao.findById(requestId).orElse(request);
    }
}
