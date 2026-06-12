package com.lms.backend.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AssignmentRequest {

    private String title;
    private LocalDate dueDate;
    private Integer tokenReward;
    private Long courseId;

    // explicit constructor forces Jackson to map fields correctly
    @JsonCreator
    public AssignmentRequest(
            @JsonProperty("title") String title,
            @JsonProperty("dueDate") LocalDate dueDate,
            @JsonProperty("tokenReward") Integer tokenReward,
            @JsonProperty("courseId") Long courseId) {
        this.title = title;
        this.dueDate = dueDate;
        this.tokenReward = tokenReward;
        this.courseId = courseId;
    }

    public String getTitle() { return title; }
    public LocalDate getDueDate() { return dueDate; }
    public Integer getTokenReward() { return tokenReward; }
    public Long getCourseId() { return courseId; }
}