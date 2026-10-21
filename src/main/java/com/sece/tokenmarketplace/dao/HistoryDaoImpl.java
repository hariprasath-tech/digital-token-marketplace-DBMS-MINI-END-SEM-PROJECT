package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.TokenTransferHistory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class HistoryDaoImpl implements HistoryDao {

    private final JdbcTemplate jdbcTemplate;

    public HistoryDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TokenTransferHistory> rowMapper = (rs, rowNum) -> {
        Timestamp trTs = rs.getTimestamp("transferred_at");
        TokenTransferHistory h = new TokenTransferHistory();
        h.setHistoryId(rs.getInt("history_id"));
        h.setTokenId(rs.getInt("token_id"));

        int reqId = rs.getInt("request_id");
        if (!rs.wasNull()) {
            h.setRequestId(reqId);
        }

        h.setFromStudentId(rs.getInt("from_student_id"));
        h.setToStudentId(rs.getInt("to_student_id"));
        h.setTransferredAt(trTs != null ? trTs.toLocalDateTime() : null);
        h.setRemarks(rs.getString("remarks"));

        // Joined fields
        try {
            h.setTokenCode(rs.getString("token_code"));
            h.setActivityTitle(rs.getString("activity_title"));
            h.setActivityCategory(rs.getString("activity_category"));
            h.setFromStudentName(rs.getString("from_student_name"));
            h.setFromStudentRollNo(rs.getString("from_student_roll_no"));
            h.setFromStudentEmail(rs.getString("from_student_email"));
            h.setToStudentName(rs.getString("to_student_name"));
            h.setToStudentRollNo(rs.getString("to_student_roll_no"));
            h.setToStudentEmail(rs.getString("to_student_email"));
        } catch (Exception ignored) {
        }

        return h;
    };

    private static final String BASE_SELECT =
            "SELECT tth.*, " +
            "  dt.token_code, ca.title AS activity_title, ca.category AS activity_category, " +
            "  from_s.name AS from_student_name, from_s.roll_no AS from_student_roll_no, from_s.email AS from_student_email, " +
            "  to_s.name AS to_student_name, to_s.roll_no AS to_student_roll_no, to_s.email AS to_student_email " +
            "FROM TOKEN_TRANSFER_HISTORY tth " +
            "JOIN DIGITAL_TOKENS dt ON tth.token_id = dt.token_id " +
            "JOIN CAMPUS_ACTIVITIES ca ON dt.activity_id = ca.activity_id " +
            "JOIN STUDENTS from_s ON tth.from_student_id = from_s.student_id " +
            "JOIN STUDENTS to_s ON tth.to_student_id = to_s.student_id ";

    @Override
    public List<TokenTransferHistory> findAll(String search, Integer studentId, Integer limit) {
        StringBuilder sql = new StringBuilder(BASE_SELECT + "WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (studentId != null && studentId > 0) {
            sql.append("AND (tth.from_student_id = ? OR tth.to_student_id = ?) ");
            params.add(studentId);
            params.add(studentId);
        }

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(dt.token_code) LIKE ? OR LOWER(ca.title) LIKE ? OR LOWER(from_s.name) LIKE ? OR LOWER(to_s.name) LIKE ?) ");
            String q = "%" + search.trim().toLowerCase() + "%";
            params.add(q);
            params.add(q);
            params.add(q);
            params.add(q);
        }

        sql.append("ORDER BY tth.transferred_at DESC ");
        if (limit != null && limit > 0) {
            sql.append("LIMIT ?");
            params.add(limit);
        }

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
    }

    @Override
    public TokenTransferHistory save(TokenTransferHistory history) {
        String sql = "INSERT INTO TOKEN_TRANSFER_HISTORY (token_id, request_id, from_student_id, to_student_id, transferred_at, remarks) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, history.getTokenId());
            if (history.getRequestId() != null) {
                ps.setInt(2, history.getRequestId());
            } else {
                ps.setNull(2, java.sql.Types.INTEGER);
            }
            ps.setInt(3, history.getFromStudentId());
            ps.setInt(4, history.getToStudentId());
            ps.setTimestamp(5, history.getTransferredAt() != null ? Timestamp.valueOf(history.getTransferredAt()) : Timestamp.valueOf(LocalDateTime.now()));
            ps.setString(6, history.getRemarks());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            history.setHistoryId(keyHolder.getKey().intValue());
        }
        return history;
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM TOKEN_TRANSFER_HISTORY";
        Long c = jdbcTemplate.queryForObject(sql, Long.class);
        return c != null ? c : 0;
    }
}
