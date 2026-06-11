package com.lms.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String grade;
    private String status;  // SUBMITTED, GRADED
    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    @JsonIgnoreProperties({"course", "hibernateLazyInitializer"})
    private Assignment assignment;

    public Submission() {}

    public Submission(String fileName, User student, Assignment assignment) {
        this.fileName = fileName;
        this.student = student;
        this.assignment = assignment;
        this.status = "SUBMITTED";
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }
}