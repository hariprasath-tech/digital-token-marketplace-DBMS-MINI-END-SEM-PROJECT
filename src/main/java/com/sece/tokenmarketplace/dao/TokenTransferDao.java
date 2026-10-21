package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.TokenTransferRequest;

import java.util.List;
import java.util.Optional;

public interface TokenTransferDao {
    Optional<TokenTransferRequest> findById(Integer requestId);
    List<TokenTransferRequest> findIncomingRequests(Integer ownerStudentId);
    List<TokenTransferRequest> findOutgoingRequests(Integer requesterStudentId);
    List<TokenTransferRequest> findByTokenId(Integer tokenId);
    TokenTransferRequest save(TokenTransferRequest request);
    boolean updateStatus(Integer requestId, String newStatus, String responseNote);
    int rejectAllOtherPendingRequestsForToken(Integer tokenId, Integer approvedRequestId, String note);
    int rejectPendingRequestsForExpiredTokens();
    long countPending();
}
