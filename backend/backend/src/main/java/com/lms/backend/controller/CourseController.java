package com.lms.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lms.backend.dto.CourseRequest;
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
    public Course createCourse(@RequestBody CourseRequest request) {
        return courseService.createCourse(request);
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }


    @GetMapping("/lecturer/{id}")
    public List<Course> getByLecturer(@PathVariable Long id) {
        return courseService.getCoursesByLecturer(id);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "Course deleted";
    }
  @PutMapping("/{id}/toggle")
    public Course toggle(@PathVariable Long id) {
        return courseService.togglePublish(id);
    }

    @PutMapping("/{id}")
public Course updateCourse(
        @PathVariable Long id,
        @RequestBody Course course) {
    return courseService.updateCourse(id, course);
}


}