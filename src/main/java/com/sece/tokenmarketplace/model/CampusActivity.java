package com.sece.tokenmarketplace.model;

import java.time.LocalDateTime;

public class CampusActivity {
    private Integer activityId;
    private String title;
    private String category; // WORKSHOP, EVENT, LAB_SESSION, SPORTS, CLUB_ACTIVITY
    private String venue;
    private String description;
    private String organizer;
    private LocalDateTime activityDate;
    private Integer totalCapacity;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Integer availableTokenCount;

    public CampusActivity() {
    }

    public CampusActivity(Integer activityId, String title, String category, String venue,
                          String description, String organizer, LocalDateTime activityDate,
                          Integer totalCapacity, LocalDateTime createdAt) {
        this(activityId, title, category, venue, description, organizer, activityDate, totalCapacity, null, createdAt);
    }

    public CampusActivity(Integer activityId, String title, String category, String venue,
                          String description, String organizer, LocalDateTime activityDate,
                          Integer totalCapacity, String imageUrl, LocalDateTime createdAt) {
        this.activityId = activityId;
        this.title = title;
        this.category = category;
        this.venue = venue;
        this.description = description;
        this.organizer = organizer;
        this.activityDate = activityDate;
        this.totalCapacity = totalCapacity;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getAvailableTokenCount() {
        return availableTokenCount;
    }

    public void setAvailableTokenCount(Integer availableTokenCount) {
        this.availableTokenCount = availableTokenCount;
    }
}
