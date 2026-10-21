package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.Student;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentDaoImpl implements StudentDao {

    private final JdbcTemplate jdbcTemplate;

    public StudentDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Student> rowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("created_at");
        String role = "STUDENT";
        try {
            role = rs.getString("role");
            if (role == null || role.trim().isEmpty()) {
                role = "STUDENT";
            }
        } catch (Exception ignored) {
        }

        return new Student(
                rs.getInt("student_id"),
                rs.getString("roll_no"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password_hash"),
                rs.getString("department"),
                rs.getInt("year_of_study"),
                rs.getString("contact_no"),
                role,
                ts != null ? ts.toLocalDateTime() : null
        );
    };

    @Override
    public Optional<Student> findById(Integer studentId) {
        String sql = "SELECT * FROM STUDENTS WHERE student_id = ?";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, studentId);
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Student> findByEmail(String email) {
        String sql = "SELECT * FROM STUDENTS WHERE LOWER(email) = LOWER(?)";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, email);
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Student> findByRollNo(String rollNo) {
        String sql = "SELECT * FROM STUDENTS WHERE LOWER(roll_no) = LOWER(?)";
        try {
            Student student = jdbcTemplate.queryForObject(sql, rowMapper, rollNo);
            return Optional.ofNullable(student);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Student> findAll() {
        String sql = "SELECT * FROM STUDENTS ORDER BY name ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Student save(Student student) {
        String sql = "INSERT INTO STUDENTS (roll_no, name, email, password_hash, department, year_of_study, contact_no, role) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, student.getRollNo());
            ps.setString(2, student.getName());
            ps.setString(3, student.getEmail());
            ps.setString(4, student.getPasswordHash());
            ps.setString(5, student.getDepartment());
            ps.setInt(6, student.getYearOfStudy());
            ps.setString(7, student.getContactNo());
            ps.setString(8, student.getRole() != null ? student.getRole() : "STUDENT");
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            student.setStudentId(keyHolder.getKey().intValue());
        }
        return student;
    }
}
