package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.model.Course;
import com.lms.backend.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Course updateCourse(Long id, Course course) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        existingCourse.setCourseCode(course.getCourseCode());
        existingCourse.setTitle(course.getTitle());
        existingCourse.setLecturer(course.getLecturer());
        existingCourse.setStudents(course.getStudents());
        existingCourse.setPublished(course.isPublished());

        return courseRepository.save(existingCourse);
    }
}