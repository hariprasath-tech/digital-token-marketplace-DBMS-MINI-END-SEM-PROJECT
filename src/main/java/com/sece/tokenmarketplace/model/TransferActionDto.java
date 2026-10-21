package com.sece.tokenmarketplace.model;

public class TransferActionDto {
    private Integer studentId;
    private String responseNote;

    public TransferActionDto() {
    }

    public TransferActionDto(Integer studentId, String responseNote) {
        this.studentId = studentId;
        this.responseNote = responseNote;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getResponseNote() {
        return responseNote;
    }

    public void setResponseNote(String responseNote) {
        this.responseNote = responseNote;
    }
}
