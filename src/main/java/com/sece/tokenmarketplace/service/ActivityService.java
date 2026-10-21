package com.sece.tokenmarketplace.service;

import com.sece.tokenmarketplace.dao.CampusActivityDao;
import com.sece.tokenmarketplace.exception.MarketplaceException;
import com.sece.tokenmarketplace.exception.ResourceNotFoundException;
import com.sece.tokenmarketplace.model.ActivityCreateDto;
import com.sece.tokenmarketplace.model.CampusActivity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

    private final CampusActivityDao activityDao;

    public ActivityService(CampusActivityDao activityDao) {
        this.activityDao = activityDao;
    }

    public List<CampusActivity> getAll(String category, String search) {
        return activityDao.findAll(category, search);
    }

    public CampusActivity getById(Integer activityId) {
        return activityDao.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus activity not found with ID: " + activityId));
    }

    public CampusActivity create(ActivityCreateDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new MarketplaceException("Activity title is required");
        }
        if (dto.getVenue() == null || dto.getVenue().trim().isEmpty()) {
            throw new MarketplaceException("Activity venue is required");
        }
        if (dto.getActivityDate() == null) {
            throw new MarketplaceException("Activity date is required");
        }

        CampusActivity act = new CampusActivity();
        act.setTitle(dto.getTitle().trim());
        act.setCategory(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "EVENT");
        act.setVenue(dto.getVenue().trim());
        act.setDescription(dto.getDescription());
        act.setOrganizer(dto.getOrganizer() != null ? dto.getOrganizer().trim() : "Campus Committee");
        act.setActivityDate(dto.getActivityDate());
        act.setTotalCapacity(dto.getTotalCapacity() != null ? dto.getTotalCapacity() : 50);
        act.setImageUrl(dto.getImageUrl());
        act.setCreatedAt(LocalDateTime.now());

        return activityDao.save(act);
    }

    public CampusActivity update(Integer id, ActivityCreateDto dto) {
        CampusActivity existing = getById(id);
        if (dto.getTitle() != null) existing.setTitle(dto.getTitle().trim());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory().toUpperCase());
        if (dto.getVenue() != null) existing.setVenue(dto.getVenue().trim());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getOrganizer() != null) existing.setOrganizer(dto.getOrganizer().trim());
        if (dto.getActivityDate() != null) existing.setActivityDate(dto.getActivityDate());
        if (dto.getTotalCapacity() != null) existing.setTotalCapacity(dto.getTotalCapacity());
        if (dto.getImageUrl() != null) existing.setImageUrl(dto.getImageUrl().trim());

        activityDao.update(existing);
        return existing;
    }

    public void delete(Integer id) {
        CampusActivity existing = getById(id);
        try {
            activityDao.delete(existing.getActivityId());
        } catch (Exception e) {
            throw new MarketplaceException("Cannot delete activity because it is referenced by existing digital tokens. Please remove associated tokens first.");
        }
    }
}
