package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.TokenTransferRequest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class TokenTransferDaoImpl implements TokenTransferDao {

    private final JdbcTemplate jdbcTemplate;

    public TokenTransferDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<TokenTransferRequest> rowMapper = (rs, rowNum) -> {
        Timestamp reqTs = rs.getTimestamp("requested_at");
        Timestamp respTs = rs.getTimestamp("responded_at");
        Timestamp actTs = rs.getTimestamp("activity_date");

        TokenTransferRequest req = new TokenTransferRequest();
        req.setRequestId(rs.getInt("request_id"));
        req.setTokenId(rs.getInt("token_id"));
        req.setRequesterStudentId(rs.getInt("requester_student_id"));
        req.setOwnerStudentId(rs.getInt("owner_student_id"));
        req.setRequestStatus(rs.getString("request_status"));
        req.setRequestReason(rs.getString("request_reason"));
        req.setResponseNote(rs.getString("response_note"));
        req.setRequestedAt(reqTs != null ? reqTs.toLocalDateTime() : null);
        req.setRespondedAt(respTs != null ? respTs.toLocalDateTime() : null);

        // Joined fields
        try {
            req.setTokenCode(rs.getString("token_code"));
            req.setActivityTitle(rs.getString("activity_title"));
            req.setActivityCategory(rs.getString("activity_category"));
            req.setActivityVenue(rs.getString("activity_venue"));
            req.setActivityDate(actTs != null ? actTs.toLocalDateTime() : null);
            req.setRequesterName(rs.getString("requester_name"));
            req.setRequesterRollNo(rs.getString("requester_roll_no"));
            req.setRequesterEmail(rs.getString("requester_email"));
            req.setRequesterDepartment(rs.getString("requester_department"));
            req.setOwnerName(rs.getString("owner_name"));
            req.setOwnerRollNo(rs.getString("owner_roll_no"));
            req.setOwnerEmail(rs.getString("owner_email"));
        } catch (Exception ignored) {
        }

        return req;
    };

    private static final String BASE_SELECT =
            "SELECT ttr.*, " +
            "  dt.token_code, ca.title AS activity_title, ca.category AS activity_category, ca.venue AS activity_venue, ca.activity_date, " +
            "  req_s.name AS requester_name, req_s.roll_no AS requester_roll_no, req_s.email AS requester_email, req_s.department AS requester_department, " +
            "  own_s.name AS owner_name, own_s.roll_no AS owner_roll_no, own_s.email AS owner_email " +
            "FROM TOKEN_TRANSFER_REQUESTS ttr " +
            "JOIN DIGITAL_TOKENS dt ON ttr.token_id = dt.token_id " +
            "JOIN CAMPUS_ACTIVITIES ca ON dt.activity_id = ca.activity_id " +
            "JOIN STUDENTS req_s ON ttr.requester_student_id = req_s.student_id " +
            "JOIN STUDENTS own_s ON ttr.owner_student_id = own_s.student_id ";

    @Override
    public Optional<TokenTransferRequest> findById(Integer requestId) {
        String sql = BASE_SELECT + "WHERE ttr.request_id = ?";
        try {
            TokenTransferRequest req = jdbcTemplate.queryForObject(sql, rowMapper, requestId);
            return Optional.ofNullable(req);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<TokenTransferRequest> findIncomingRequests(Integer ownerStudentId) {
        String sql = BASE_SELECT + "WHERE ttr.owner_student_id = ? ORDER BY ttr.requested_at DESC";
        return jdbcTemplate.query(sql, rowMapper, ownerStudentId);
    }

    @Override
    public List<TokenTransferRequest> findOutgoingRequests(Integer requesterStudentId) {
        String sql = BASE_SELECT + "WHERE ttr.requester_student_id = ? ORDER BY ttr.requested_at DESC";
        return jdbcTemplate.query(sql, rowMapper, requesterStudentId);
    }

    @Override
    public List<TokenTransferRequest> findByTokenId(Integer tokenId) {
        String sql = BASE_SELECT + "WHERE ttr.token_id = ? ORDER BY ttr.requested_at DESC";
        return jdbcTemplate.query(sql, rowMapper, tokenId);
    }

    @Override
    public TokenTransferRequest save(TokenTransferRequest request) {
        String sql = "INSERT INTO TOKEN_TRANSFER_REQUESTS (token_id, requester_student_id, owner_student_id, request_status, request_reason) " +
                     "VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, request.getTokenId());
            ps.setInt(2, request.getRequesterStudentId());
            ps.setInt(3, request.getOwnerStudentId());
            ps.setString(4, request.getRequestStatus() != null ? request.getRequestStatus() : "PENDING");
            ps.setString(5, request.getRequestReason());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            request.setRequestId(keyHolder.getKey().intValue());
        }
        return request;
    }

    @Override
    public boolean updateStatus(Integer requestId, String newStatus, String responseNote) {
        String sql = "UPDATE TOKEN_TRANSFER_REQUESTS SET request_status = ?, response_note = ?, responded_at = ? WHERE request_id = ?";
        return jdbcTemplate.update(sql, newStatus, responseNote, Timestamp.valueOf(LocalDateTime.now()), requestId) > 0;
    }

    @Override
    public int rejectAllOtherPendingRequestsForToken(Integer tokenId, Integer approvedRequestId, String note) {
        String sql = "UPDATE TOKEN_TRANSFER_REQUESTS SET request_status = 'REJECTED', response_note = ?, responded_at = ? " +
                     "WHERE token_id = ? AND request_id <> ? AND request_status = 'PENDING'";
        return jdbcTemplate.update(sql, note, Timestamp.valueOf(LocalDateTime.now()), tokenId, approvedRequestId);
    }

    @Override
    public int rejectPendingRequestsForExpiredTokens() {
        String sql = "UPDATE TOKEN_TRANSFER_REQUESTS ttr " +
                     "JOIN DIGITAL_TOKENS dt ON ttr.token_id = dt.token_id " +
                     "SET ttr.request_status = 'REJECTED', " +
                     "    ttr.response_note = 'Auto-rejected because token expired', " +
                     "    ttr.responded_at = NOW() " +
                     "WHERE dt.expiry_date <= NOW() AND ttr.request_status = 'PENDING'";
        return jdbcTemplate.update(sql);
    }

    @Override
    public long countPending() {
        String sql = "SELECT COUNT(*) FROM TOKEN_TRANSFER_REQUESTS WHERE request_status = 'PENDING'";
        Long c = jdbcTemplate.queryForObject(sql, Long.class);
        return c != null ? c : 0;
    }
}
