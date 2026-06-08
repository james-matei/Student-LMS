package com.lms.backend.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String grade;

    private boolean graded;



    private LocalDateTime submissionDate; 
    @PrePersist
public void prePersist() {
    this.submissionDate = LocalDateTime.now();
}

    @ManyToOne
    private Assignment assignment;

    @ManyToOne
    private User student;

    public Submission() {
    }

    public Submission(String fileName, Assignment assignment, User student, LocalDateTime submissionDate) {
        this.fileName = fileName;
        this.assignment = assignment;
        this.student = student;
        this.submissionDate = submissionDate;
        this.graded = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
        this.graded = true;
    }

    public boolean isGraded() {
        return graded;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

}
