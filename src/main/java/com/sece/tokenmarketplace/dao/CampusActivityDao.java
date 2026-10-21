package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.CampusActivity;

import java.util.List;
import java.util.Optional;

public interface CampusActivityDao {
    Optional<CampusActivity> findById(Integer activityId);
    List<CampusActivity> findAll(String category, String search);
    CampusActivity save(CampusActivity activity);
    boolean update(CampusActivity activity);
    boolean delete(Integer activityId);
    long count();
}
