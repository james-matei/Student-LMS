package com.lms.backend.dto;

public class CourseRequest {
    private String courseCode;
    private String title;
    private Long lecturerId;

    public CourseRequest() {
    }

    public CourseRequest(String courseCode, String title, Long lecturerId) {
        this.courseCode = courseCode;
        this.title = title;
        this.lecturerId = lecturerId;
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

    public Long getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Long lecturerId) {
        this.lecturerId = lecturerId;
    }


}