package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.CampusActivity;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CampusActivityDaoImpl implements CampusActivityDao {

    private final JdbcTemplate jdbcTemplate;

    public CampusActivityDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CampusActivity> rowMapper = (rs, rowNum) -> {
        Timestamp actTs = rs.getTimestamp("activity_date");
        Timestamp creTs = rs.getTimestamp("created_at");
        String imgUrl = null;
        try {
            imgUrl = rs.getString("image_url");
        } catch (Exception ignored) {
        }

        CampusActivity activity = new CampusActivity(
                rs.getInt("activity_id"),
                rs.getString("title"),
                rs.getString("category"),
                rs.getString("venue"),
                rs.getString("description"),
                rs.getString("organizer"),
                actTs != null ? actTs.toLocalDateTime() : null,
                rs.getInt("total_capacity"),
                imgUrl,
                creTs != null ? creTs.toLocalDateTime() : null
        );

        // Check if available_token_count was selected
        try {
            int tokenCount = rs.getInt("available_token_count");
            activity.setAvailableTokenCount(tokenCount);
        } catch (Exception ignored) {
            activity.setAvailableTokenCount(0);
        }

        return activity;
    };

    @Override
    public Optional<CampusActivity> findById(Integer activityId) {
        String sql = "SELECT ca.*, " +
                "  (SELECT COUNT(*) FROM DIGITAL_TOKENS dt WHERE dt.activity_id = ca.activity_id AND dt.status = 'AVAILABLE' AND dt.expiry_date > NOW()) AS available_token_count " +
                "FROM CAMPUS_ACTIVITIES ca WHERE ca.activity_id = ?";
        try {
            CampusActivity activity = jdbcTemplate.queryForObject(sql, rowMapper, activityId);
            return Optional.ofNullable(activity);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<CampusActivity> findAll(String category, String search) {
        StringBuilder sql = new StringBuilder(
                "SELECT ca.*, " +
                "  (SELECT COUNT(*) FROM DIGITAL_TOKENS dt WHERE dt.activity_id = ca.activity_id AND dt.status = 'AVAILABLE' AND dt.expiry_date > NOW()) AS available_token_count " +
                "FROM CAMPUS_ACTIVITIES ca WHERE 1=1 "
        );
        List<Object> params = new ArrayList<>();

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            sql.append("AND ca.category = ? ");
            params.add(category.trim().toUpperCase());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(ca.title) LIKE ? OR LOWER(ca.venue) LIKE ? OR LOWER(ca.organizer) LIKE ?) ");
            String q = "%" + search.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY ca.activity_date ASC");
        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    @Override
    public CampusActivity save(CampusActivity activity) {
        String sql = "INSERT INTO CAMPUS_ACTIVITIES (title, category, venue, description, organizer, activity_date, total_capacity, image_url) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, activity.getTitle());
            ps.setString(2, activity.getCategory());
            ps.setString(3, activity.getVenue());
            ps.setString(4, activity.getDescription());
            ps.setString(5, activity.getOrganizer());
            ps.setTimestamp(6, activity.getActivityDate() != null ? Timestamp.valueOf(activity.getActivityDate()) : null);
            ps.setInt(7, activity.getTotalCapacity() != null ? activity.getTotalCapacity() : 50);
            ps.setString(8, activity.getImageUrl());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            activity.setActivityId(keyHolder.getKey().intValue());
        }
        return activity;
    }

    @Override
    public boolean update(CampusActivity activity) {
        String sql = "UPDATE CAMPUS_ACTIVITIES SET title = ?, category = ?, venue = ?, description = ?, organizer = ?, activity_date = ?, total_capacity = ?, image_url = ? " +
                     "WHERE activity_id = ?";
        int rows = jdbcTemplate.update(sql,
                activity.getTitle(),
                activity.getCategory(),
                activity.getVenue(),
                activity.getDescription(),
                activity.getOrganizer(),
                activity.getActivityDate() != null ? Timestamp.valueOf(activity.getActivityDate()) : null,
                activity.getTotalCapacity(),
                activity.getImageUrl(),
                activity.getActivityId()
        );
        return rows > 0;
    }

    @Override
    public boolean delete(Integer activityId) {
        String sql = "DELETE FROM CAMPUS_ACTIVITIES WHERE activity_id = ?";
        int rows = jdbcTemplate.update(sql, activityId);
        return rows > 0;
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM CAMPUS_ACTIVITIES";
        Long c = jdbcTemplate.queryForObject(sql, Long.class);
        return c != null ? c : 0;
    }
}
