package com.sece.tokenmarketplace.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ActivityCreateDto {
    private String title;
    private String category; // WORKSHOP, EVENT, LAB_SESSION, SPORTS, CLUB_ACTIVITY
    private String venue;
    private String description;
    private String organizer;

    @JsonFormat(pattern = "yyyy-MM-dd['T'][' ']HH:mm[:ss]")
    private LocalDateTime activityDate;
    private Integer totalCapacity;
    private String imageUrl;
    private Integer adminStudentId;

    public ActivityCreateDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public LocalDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDateTime activityDate) {
        this.activityDate = activityDate;
    }

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getAdminStudentId() {
        return adminStudentId;
    }

    public void setAdminStudentId(Integer adminStudentId) {
        this.adminStudentId = adminStudentId;
    }
}
