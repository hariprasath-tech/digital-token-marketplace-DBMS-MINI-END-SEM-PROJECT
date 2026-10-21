package com.sece.tokenmarketplace.service;

import com.sece.tokenmarketplace.dao.CampusActivityDao;
import com.sece.tokenmarketplace.dao.DigitalTokenDao;
import com.sece.tokenmarketplace.dao.StudentDao;
import com.sece.tokenmarketplace.exception.MarketplaceException;
import com.sece.tokenmarketplace.exception.ResourceNotFoundException;
import com.sece.tokenmarketplace.model.CampusActivity;
import com.sece.tokenmarketplace.model.DigitalToken;
import com.sece.tokenmarketplace.model.Student;
import com.sece.tokenmarketplace.model.TokenCreateDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TokenService {

    private final DigitalTokenDao tokenDao;
    private final CampusActivityDao activityDao;
    private final StudentDao studentDao;

    public TokenService(DigitalTokenDao tokenDao, CampusActivityDao activityDao, StudentDao studentDao) {
        this.tokenDao = tokenDao;
        this.activityDao = activityDao;
        this.studentDao = studentDao;
    }

    public List<DigitalToken> getTokens(Integer activityId, String category, String venue, String status, String search, String minDate, String maxDate) {
        return tokenDao.findAll(activityId, category, venue, status, search, minDate, maxDate);
    }

    public DigitalToken getById(Integer tokenId) {
        return tokenDao.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException("Digital Token not found with ID: " + tokenId));
    }

    public List<DigitalToken> getByOwner(Integer ownerStudentId) {
        studentDao.findById(ownerStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + ownerStudentId));
        return tokenDao.findByOwner(ownerStudentId);
    }

    @Transactional
    public DigitalToken createToken(TokenCreateDto dto) {
        if (dto.getActivityId() == null) {
            throw new MarketplaceException("Activity selection is required to list a token");
        }
        if (dto.getOwnerStudentId() == null) {
            throw new MarketplaceException("Owner Student ID is required");
        }
        if (dto.getExpiryDate() == null) {
            throw new MarketplaceException("Token expiry date is required");
        }
        if (dto.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new MarketplaceException("Expiry date cannot be in the past");
        }

        CampusActivity activity = activityDao.findById(dto.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected campus activity not found"));

        Student student = studentDao.findById(dto.getOwnerStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner student not found"));

        LocalDateTime validFrom = dto.getValidFrom() != null ? dto.getValidFrom() : LocalDateTime.now();
        if (dto.getExpiryDate().isBefore(validFrom)) {
            throw new MarketplaceException("Token expiry date cannot precede valid from date");
        }

        // Generate clean unique token code
        String prefix = activity.getCategory() != null && activity.getCategory().length() >= 3
                ? activity.getCategory().substring(0, 3).toUpperCase()
                : "TKN";
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String tokenCode = "TKN-" + prefix + "-2026-" + randomSuffix;

        DigitalToken token = new DigitalToken();
        token.setTokenCode(tokenCode);
        token.setActivityId(activity.getActivityId());
        token.setOwnerStudentId(student.getStudentId());
        token.setStatus("AVAILABLE");
        token.setValidFrom(validFrom);
        token.setExpiryDate(dto.getExpiryDate());
        token.setSeatOrSlot(dto.getSeatOrSlot() != null && !dto.getSeatOrSlot().trim().isEmpty()
                ? dto.getSeatOrSlot().trim()
                : "General Admission");
        token.setRemarks(dto.getRemarks());

        token = tokenDao.save(token);
        return getById(token.getTokenId());
    }

    @Transactional
    public DigitalToken markAsUsed(Integer tokenId, Integer studentId) {
        DigitalToken token = getById(tokenId);

        if (!token.getOwnerStudentId().equals(studentId)) {
            throw new MarketplaceException("You are not authorized to redeem or mark this token as used. Only the current owner can redeem it.");
        }

        if ("USED".equalsIgnoreCase(token.getStatus())) {
            throw new MarketplaceException("Token is already marked as USED.");
        }

        if ("EXPIRED".equalsIgnoreCase(token.getStatus()) || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenDao.updateStatus(tokenId, "EXPIRED");
            throw new MarketplaceException("Cannot redeem token because it has already expired.");
        }

        tokenDao.updateStatus(tokenId, "USED");
        return getById(tokenId);
    }
}
