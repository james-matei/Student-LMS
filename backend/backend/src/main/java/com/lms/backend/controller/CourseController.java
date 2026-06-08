package com.lms.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lms.backend.model.Course;
import com.lms.backend.service.CourseService;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "Course deleted";
    }

    @PutMapping("/{id}")
public Course updateCourse(
        @PathVariable Long id,
        @RequestBody Course course) {
    return courseService.updateCourse(id, course);
}


}