package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.DigitalToken;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DigitalTokenDao {
    Optional<DigitalToken> findById(Integer tokenId);
    Optional<DigitalToken> findByIdForUpdate(Integer tokenId);
    Optional<DigitalToken> findByCode(String tokenCode);
    List<DigitalToken> findAll(Integer activityId, String category, String venue, String status, String search, String minDate, String maxDate);
    List<DigitalToken> findByOwner(Integer ownerStudentId);
    DigitalToken save(DigitalToken token);
    boolean updateStatus(Integer tokenId, String status);
    boolean updateOwnerAndStatus(Integer tokenId, Integer newOwnerId, String status);
    int markExpiredTokens();
    long count();
    long countByStatus(String status);
    Map<String, Long> countGroupByStatus();
    Map<String, Long> countGroupByCategory();
}
