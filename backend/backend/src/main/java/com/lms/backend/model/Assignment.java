package com.lms.backend.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDate dueDate;
    private Integer tokenReward = 0; 
    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties({"lecturer", "hibernateLazyInitializer"})
    private Course course;

    public Assignment() {
    }

    public Assignment(String title, LocalDate dueDate, Course course, Integer tokenReward) {
        this.title = title;
        this.dueDate = dueDate;
        this.course = course;
        this.tokenReward = tokenReward;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
    public Integer getTokenReward() {
        return tokenReward;
    }

    public void setTokenReward(Integer tokenReward) {
        this.tokenReward = tokenReward;
    }
}   
