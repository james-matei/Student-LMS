package com.lms.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseCode;

    private String title;

    private Integer students =0;

    private boolean published =false;

    @ManyToOne
    @JoinColumn(name = "lecturer_id")
    @JsonIgnoreProperties({ "password", "courses", "hibernateLazyInitializer"})
    private User lecturer;


    public Course() {
    }

    public Course(String courseCode, String title,
                  User lecturer, Integer students,
                  boolean published) {
        this.courseCode = courseCode;
        this.title = title;
        this.students = 0;
        this.lecturer = lecturer;
        this.published = published;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public Integer getStudents() {
        return students;
    }

    public void setStudents(Integer students) {
        this.students = students;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public User getLecturer() {
        return lecturer;
    }

    public void setLecturer(User lecturer) {
        this.lecturer = lecturer;
    }
}
