
package com.lms.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.lms.backend.model.Course;
import com.lms.backend.model.Enrollment;
import com.lms.backend.model.User;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.EnrollmentRepository;
import com.lms.backend.repository.UserRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    // Enroll student in course
    public Enrollment enroll(Long studentId, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Already enrolled");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // increment course student counter
        course.setStudents(course.getStudents() + 1);
        courseRepository.save(course);

        return enrollmentRepository.save(new Enrollment(student, course));
    }

    // Drop course
    public void unenroll(Long studentId, Long courseId) {
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        // decrement course student counter
        Course course = enrollment.getCourse();
        course.setStudents(Math.max(0, course.getStudents() - 1));
        courseRepository.save(course);

        enrollmentRepository.delete(enrollment);
    }

    // Get all enrollments for a student
    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    // Update progress
    public Enrollment updateProgress(Long studentId, Long courseId, Integer progress) {
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setProgress(progress);
        enrollment.setCompleted(progress >= 100);
        return enrollmentRepository.save(enrollment);
    }

    // Check if student is enrolled
    public boolean isEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
}