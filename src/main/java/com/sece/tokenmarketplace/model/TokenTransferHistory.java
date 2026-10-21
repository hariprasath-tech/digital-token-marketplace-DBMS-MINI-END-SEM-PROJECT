package com.sece.tokenmarketplace.model;

import java.time.LocalDateTime;

public class TokenTransferHistory {
    private Integer historyId;
    private Integer tokenId;
    private Integer requestId;
    private Integer fromStudentId;
    private Integer toStudentId;
    private LocalDateTime transferredAt;
    private String remarks;

    // Joined / Presentation fields
    private String tokenCode;
    private String activityTitle;
    private String activityCategory;
    private String fromStudentName;
    private String fromStudentRollNo;
    private String fromStudentEmail;
    private String toStudentName;
    private String toStudentRollNo;
    private String toStudentEmail;

    public TokenTransferHistory() {
    }

    public Integer getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Integer historyId) {
        this.historyId = historyId;
    }

    public Integer getTokenId() {
        return tokenId;
    }

    public void setTokenId(Integer tokenId) {
        this.tokenId = tokenId;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public Integer getFromStudentId() {
        return fromStudentId;
    }

    public void setFromStudentId(Integer fromStudentId) {
        this.fromStudentId = fromStudentId;
    }

    public Integer getToStudentId() {
        return toStudentId;
    }

    public void setToStudentId(Integer toStudentId) {
        this.toStudentId = toStudentId;
    }

    public LocalDateTime getTransferredAt() {
        return transferredAt;
    }

    public void setTransferredAt(LocalDateTime transferredAt) {
        this.transferredAt = transferredAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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

    public String getFromStudentName() {
        return fromStudentName;
    }

    public void setFromStudentName(String fromStudentName) {
        this.fromStudentName = fromStudentName;
    }

    public String getFromStudentRollNo() {
        return fromStudentRollNo;
    }

    public void setFromStudentRollNo(String fromStudentRollNo) {
        this.fromStudentRollNo = fromStudentRollNo;
    }

    public String getFromStudentEmail() {
        return fromStudentEmail;
    }

    public void setFromStudentEmail(String fromStudentEmail) {
        this.fromStudentEmail = fromStudentEmail;
    }

    public String getToStudentName() {
        return toStudentName;
    }

    public void setToStudentName(String toStudentName) {
        this.toStudentName = toStudentName;
    }

    public String getToStudentRollNo() {
        return toStudentRollNo;
    }

    public void setToStudentRollNo(String toStudentRollNo) {
        this.toStudentRollNo = toStudentRollNo;
    }

    public String getToStudentEmail() {
        return toStudentEmail;
    }

    public void setToStudentEmail(String toStudentEmail) {
        this.toStudentEmail = toStudentEmail;
    }
}
