package com.sece.tokenmarketplace.model;

public class TransferRequestDto {
    private Integer tokenId;
    private Integer requesterStudentId;
    private String requestReason;

    public TransferRequestDto() {
    }

    public TransferRequestDto(Integer tokenId, Integer requesterStudentId, String requestReason) {
        this.tokenId = tokenId;
        this.requesterStudentId = requesterStudentId;
        this.requestReason = requestReason;
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

    public String getRequestReason() {
        return requestReason;
    }

    public void setRequestReason(String requestReason) {
        this.requestReason = requestReason;
    }
}
