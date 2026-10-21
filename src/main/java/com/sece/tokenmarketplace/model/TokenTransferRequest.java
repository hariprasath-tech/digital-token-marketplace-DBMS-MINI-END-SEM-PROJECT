package com.sece.tokenmarketplace.model;

import java.time.LocalDateTime;

public class TokenTransferRequest {
    private Integer requestId;
    private Integer tokenId;
    private Integer requesterStudentId;
    private Integer ownerStudentId;
    private String requestStatus; // PENDING, APPROVED, REJECTED, CANCELLED
    private String requestReason;
    private String responseNote;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;

    // Joined / Presentation fields
    private String tokenCode;
    private String activityTitle;
    private String activityCategory;
    private String activityVenue;
    private LocalDateTime activityDate;
    private String requesterName;
    private String requesterRollNo;
    private String requesterEmail;
    private String requesterDepartment;
    private String ownerName;
    private String ownerRollNo;
    private String ownerEmail;

    public TokenTransferRequest() {
    }

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public Integer getTokenId() {
        return tokenId;
    }

    public void setTokenId(Integer tokenId) {
        this.tokenId = tokenId;
    }

    public Integer getRequesterStudentId() {
        return requesterStudentId;
    }

    public void setRequesterStudentId(Integer requesterStudentId) {
        this.requesterStudentId = requesterStudentId;
    }

    public Integer getOwnerStudentId() {
        return ownerStudentId;
    }

    public void setOwnerStudentId(Integer ownerStudentId) {
        this.ownerStudentId = ownerStudentId;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public String getRequestReason() {
        return requestReason;
    }

    public void setRequestReason(String requestReason) {
        this.requestReason = requestReason;
    }

    public String getResponseNote() {
        return responseNote;
    }

    public void setResponseNote(String responseNote) {
        this.responseNote = responseNote;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public String getTokenCode() {
        return tokenCode;
    }

    public void setTokenCode(String tokenCode) {
        this.tokenCode = tokenCode;
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

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterRollNo() {
        return requesterRollNo;
    }

    public void setRequesterRollNo(String requesterRollNo) {
        this.requesterRollNo = requesterRollNo;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getRequesterDepartment() {
        return requesterDepartment;
    }

    public void setRequesterDepartment(String requesterDepartment) {
        this.requesterDepartment = requesterDepartment;
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
}
