package com.sece.tokenmarketplace.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class TokenCreateDto {
    private Integer activityId;
    private Integer ownerStudentId;

    @JsonFormat(pattern = "yyyy-MM-dd['T'][' ']HH:mm[:ss]")
    private LocalDateTime validFrom;

    @JsonFormat(pattern = "yyyy-MM-dd['T'][' ']HH:mm[:ss]")
    private LocalDateTime expiryDate;
    private String seatOrSlot;
    private String remarks;

    public TokenCreateDto() {
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
}
