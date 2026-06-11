
package com.lms.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer"})
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private Integer progress = 0;       // 0-100
    private boolean completed = false;

    public Enrollment() {}

    public Enrollment(User student, Course course) {
        this.student = student;
        this.course = course;
        this.progress = 0;
        this.completed = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}