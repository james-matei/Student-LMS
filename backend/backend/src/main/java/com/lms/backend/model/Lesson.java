package com.lms.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;


    @Entity
    @Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String fileName;

    private String type;

    private Integer lessonOrder;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties({"lecturer", "hibernateLazyInitializer"})
    private Course course;


    public Lesson() {
    }

    public Lesson(String title, String fileName, String type, Integer lessonOrder, Course course) {
        this.title = title;
        this.fileName = fileName;
        this.type = type;
        this.lessonOrder = lessonOrder;
        this.course = course;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
    

