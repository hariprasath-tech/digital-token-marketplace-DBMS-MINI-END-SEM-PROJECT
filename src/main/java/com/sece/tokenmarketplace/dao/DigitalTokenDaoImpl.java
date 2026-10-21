package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.DigitalToken;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.*;

@Repository
public class DigitalTokenDaoImpl implements DigitalTokenDao {

    private final JdbcTemplate jdbcTemplate;

    public DigitalTokenDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DigitalToken> rowMapper = (rs, rowNum) -> {
        Timestamp vf = rs.getTimestamp("valid_from");
        Timestamp exp = rs.getTimestamp("expiry_date");
        Timestamp cre = rs.getTimestamp("created_at");
        Timestamp upd = rs.getTimestamp("updated_at");
        Timestamp actDate = rs.getTimestamp("activity_date");

        DigitalToken token = new DigitalToken();
        token.setTokenId(rs.getInt("token_id"));
        token.setTokenCode(rs.getString("token_code"));
        token.setActivityId(rs.getInt("activity_id"));
        token.setOwnerStudentId(rs.getInt("owner_student_id"));
        token.setStatus(rs.getString("status"));
        token.setValidFrom(vf != null ? vf.toLocalDateTime() : null);
        token.setExpiryDate(exp != null ? exp.toLocalDateTime() : null);
        token.setSeatOrSlot(rs.getString("seat_or_slot"));
        token.setRemarks(rs.getString("remarks"));
        token.setCreatedAt(cre != null ? cre.toLocalDateTime() : null);
        token.setUpdatedAt(upd != null ? upd.toLocalDateTime() : null);

        // Joined fields
        try {
            token.setActivityTitle(rs.getString("activity_title"));
            token.setActivityCategory(rs.getString("activity_category"));
            token.setActivityVenue(rs.getString("activity_venue"));
            token.setActivityDate(actDate != null ? actDate.toLocalDateTime() : null);
            token.setActivityOrganizer(rs.getString("activity_organizer"));
            token.setActivityImageUrl(rs.getString("activity_image_url"));
            token.setOwnerName(rs.getString("owner_name"));
            token.setOwnerRollNo(rs.getString("owner_roll_no"));
            token.setOwnerEmail(rs.getString("owner_email"));
            token.setOwnerDepartment(rs.getString("owner_department"));
            token.setPendingRequestCount(rs.getInt("pending_request_count"));
        } catch (Exception ignored) {
        }

        return token;
    };

    private static final String BASE_SELECT =
            "SELECT dt.*, " +
            "  ca.title AS activity_title, ca.category AS activity_category, ca.venue AS activity_venue, " +
            "  ca.activity_date, ca.organizer AS activity_organizer, ca.image_url AS activity_image_url, " +
            "  s.name AS owner_name, s.roll_no AS owner_roll_no, s.email AS owner_email, s.department AS owner_department, " +
            "  (SELECT COUNT(*) FROM TOKEN_TRANSFER_REQUESTS ttr WHERE ttr.token_id = dt.token_id AND ttr.request_status = 'PENDING') AS pending_request_count " +
            "FROM DIGITAL_TOKENS dt " +
            "JOIN CAMPUS_ACTIVITIES ca ON dt.activity_id = ca.activity_id " +
            "JOIN STUDENTS s ON dt.owner_student_id = s.student_id ";

    @Override
    public Optional<DigitalToken> findById(Integer tokenId) {
        String sql = BASE_SELECT + "WHERE dt.token_id = ?";
        try {
            DigitalToken token = jdbcTemplate.queryForObject(sql, rowMapper, tokenId);
            return Optional.ofNullable(token);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DigitalToken> findByIdForUpdate(Integer tokenId) {
        // Explicit Row Lock FOR UPDATE inside a transaction
        String sql = BASE_SELECT + "WHERE dt.token_id = ? FOR UPDATE";
        try {
            DigitalToken token = jdbcTemplate.queryForObject(sql, rowMapper, tokenId);
            return Optional.ofNullable(token);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DigitalToken> findByCode(String tokenCode) {
        String sql = BASE_SELECT + "WHERE dt.token_code = ?";
        try {
            DigitalToken token = jdbcTemplate.queryForObject(sql, rowMapper, tokenCode);
            return Optional.ofNullable(token);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<DigitalToken> findAll(Integer activityId, String category, String venue, String status, String search, String minDate, String maxDate) {
        StringBuilder sql = new StringBuilder(BASE_SELECT + "WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (activityId != null && activityId > 0) {
            sql.append("AND dt.activity_id = ? ");
            params.add(activityId);
        }

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            sql.append("AND ca.category = ? ");
            params.add(category.trim().toUpperCase());
        }

        if (venue != null && !venue.trim().isEmpty()) {
            sql.append("AND LOWER(ca.venue) LIKE ? ");
            params.add("%" + venue.trim().toLowerCase() + "%");
        }

        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            sql.append("AND dt.status = ? ");
            params.add(status.trim().toUpperCase());
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(dt.token_code) LIKE ? OR LOWER(ca.title) LIKE ? OR LOWER(ca.venue) LIKE ? OR LOWER(s.name) LIKE ?) ");
            String q = "%" + search.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        if (minDate != null && !minDate.trim().isEmpty()) {
            sql.append("AND ca.activity_date >= ? ");
            params.add(minDate + " 00:00:00");
        }

        if (maxDate != null && !maxDate.trim().isEmpty()) {
            sql.append("AND ca.activity_date <= ? ");
            params.add(maxDate + " 23:59:59");
        }

        sql.append("ORDER BY dt.expiry_date ASC, dt.token_id DESC");
        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    @Override
    public List<DigitalToken> findByOwner(Integer ownerStudentId) {
        String sql = BASE_SELECT + "WHERE dt.owner_student_id = ? ORDER BY dt.expiry_date DESC";
        return jdbcTemplate.query(sql, rowMapper, ownerStudentId);
    }

    @Override
    public DigitalToken save(DigitalToken token) {
        String sql = "INSERT INTO DIGITAL_TOKENS (token_code, activity_id, owner_student_id, status, valid_from, expiry_date, seat_or_slot, remarks) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, token.getTokenCode());
            ps.setInt(2, token.getActivityId());
            ps.setInt(3, token.getOwnerStudentId());
            ps.setString(4, token.getStatus() != null ? token.getStatus() : "AVAILABLE");
            ps.setTimestamp(5, token.getValidFrom() != null ? Timestamp.valueOf(token.getValidFrom()) : Timestamp.valueOf(java.time.LocalDateTime.now()));
            ps.setTimestamp(6, Timestamp.valueOf(token.getExpiryDate()));
            ps.setString(7, token.getSeatOrSlot());
            ps.setString(8, token.getRemarks());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            token.setTokenId(keyHolder.getKey().intValue());
        }
        return token;
    }

    @Override
    public boolean updateStatus(Integer tokenId, String status) {
        String sql = "UPDATE DIGITAL_TOKENS SET status = ? WHERE token_id = ?";
        return jdbcTemplate.update(sql, status, tokenId) > 0;
    }

    @Override
    public boolean updateOwnerAndStatus(Integer tokenId, Integer newOwnerId, String status) {
        String sql = "UPDATE DIGITAL_TOKENS SET owner_student_id = ?, status = ? WHERE token_id = ?";
        return jdbcTemplate.update(sql, newOwnerId, status, tokenId) > 0;
    }

    @Override
    public int markExpiredTokens() {
        // Marks tokens whose expiry_date is in the past and status is AVAILABLE or TRANSFER_PENDING
        String sql = "UPDATE DIGITAL_TOKENS SET status = 'EXPIRED' WHERE expiry_date <= NOW() AND status IN ('AVAILABLE', 'TRANSFER_PENDING')";
        return jdbcTemplate.update(sql);
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM DIGITAL_TOKENS";
        Long c = jdbcTemplate.queryForObject(sql, Long.class);
        return c != null ? c : 0;
    }

    @Override
    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM DIGITAL_TOKENS WHERE status = ?";
        Long c = jdbcTemplate.queryForObject(sql, Long.class, status);
        return c != null ? c : 0;
    }

    @Override
    public Map<String, Long> countGroupByStatus() {
        String sql = "SELECT status, COUNT(*) AS cnt FROM DIGITAL_TOKENS GROUP BY status";
        Map<String, Long> map = new LinkedHashMap<>();
        jdbcTemplate.query(sql, rs -> {
            map.put(rs.getString("status"), rs.getLong("cnt"));
        });
        return map;
    }

    @Override
    public Map<String, Long> countGroupByCategory() {
        String sql = "SELECT ca.category, COUNT(dt.token_id) AS cnt " +
                     "FROM CAMPUS_ACTIVITIES ca " +
                     "LEFT JOIN DIGITAL_TOKENS dt ON ca.activity_id = dt.activity_id " +
                     "GROUP BY ca.category";
        Map<String, Long> map = new LinkedHashMap<>();
        jdbcTemplate.query(sql, rs -> {
            map.put(rs.getString("category"), rs.getLong("cnt"));
        });
        return map;
    }
}
