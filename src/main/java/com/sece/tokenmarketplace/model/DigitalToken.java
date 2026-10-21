package com.sece.tokenmarketplace.model;

import java.time.LocalDateTime;

public class DigitalToken {
    private Integer tokenId;
    private String tokenCode;
    private Integer activityId;
    private Integer ownerStudentId;
    private String status; // AVAILABLE, TRANSFER_PENDING, TRANSFERRED, USED, EXPIRED
    private LocalDateTime validFrom;
    private LocalDateTime expiryDate;
    private String seatOrSlot;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Joined / Presentation fields
    private String activityTitle;
    private String activityCategory;
    private String activityVenue;
    private LocalDateTime activityDate;
    private String activityOrganizer;
    private String activityImageUrl;
    private String ownerName;
    private String ownerRollNo;
    private String ownerEmail;
    private String ownerDepartment;
    private Integer pendingRequestCount;

    public DigitalToken() {
    }

    public Integer getTokenId() {
        return tokenId;
    }

    public void setTokenId(Integer tokenId) {
        this.tokenId = tokenId;
    }

    public String getTokenCode() {
        return tokenCode;
    }

    public void setTokenCode(String tokenCode) {
        this.tokenCode = tokenCode;
    }

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
    }

    public Integer getOwnerStudentId() {
        return ownerStudentId;
    }

    public void setOwnerStudentId(Integer ownerStudentId) {
        this.ownerStudentId = ownerStudentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSeatOrSlot() {
        return seatOrSlot;
    }

    public void setSeatOrSlot(String seatOrSlot) {
        this.seatOrSlot = seatOrSlot;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle) {
        this.activityTitle = activityTitle;
    }

    public String getActivityCategory() {
        return activityCategory;
    }

    public void setActivityCategory(String activityCategory) {
        this.activityCategory = activityCategory;
    }

    public String getActivityVenue() {
        return activityVenue;
    }

    public void setActivityVenue(String activityVenue) {
        this.activityVenue = activityVenue;
    }

    public LocalDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDateTime activityDate) {
        this.activityDate = activityDate;
    }

    public String getActivityOrganizer() {
        return activityOrganizer;
    }

    public void setActivityOrganizer(String activityOrganizer) {
        this.activityOrganizer = activityOrganizer;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerRollNo() {
        return ownerRollNo;
    }

    public void setOwnerRollNo(String ownerRollNo) {
        this.ownerRollNo = ownerRollNo;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getOwnerDepartment() {
        return ownerDepartment;
    }

    public void setOwnerDepartment(String ownerDepartment) {
        this.ownerDepartment = ownerDepartment;
    }

    public Integer getPendingRequestCount() {
        return pendingRequestCount;
    }

    public void setPendingRequestCount(Integer pendingRequestCount) {
        this.pendingRequestCount = pendingRequestCount;
    }

    public String getVenue() {
        return activityVenue != null ? activityVenue : "";
    }

    public LocalDateTime getExpiresAt() {
        return expiryDate;
    }

    public String getActivityImageUrl() {
        return activityImageUrl;
    }

    public void setActivityImageUrl(String activityImageUrl) {
        this.activityImageUrl = activityImageUrl;
    }
}

