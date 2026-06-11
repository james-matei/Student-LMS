package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.model.Course;
import com.lms.backend.model.User;
import com.lms.backend.dto.CourseRequest;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

      // CREATE COURSE (LECTURER OWNERSHIP)
    public Course createCourse(CourseRequest request) {

        User lecturer = userRepository.findById(request.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));

        Course course = new Course();
        course.setCourseCode(request.getCourseCode());
        course.setTitle(request.getTitle());
        course.setLecturer(lecturer);
        course.setPublished(false);
        course.setStudents(0);

        return courseRepository.save(course);
    }

     // GET COURSES BY LECTURER (TEACHER DASHBOARD)
    public List<Course> getCoursesByLecturer(Long lecturerId) {
        return courseRepository.findByLecturerId(lecturerId);
    }



    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
    // TOGGLE PUBLISH
    public Course togglePublish(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setPublished(!course.isPublished());
        return courseRepository.save(course);
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