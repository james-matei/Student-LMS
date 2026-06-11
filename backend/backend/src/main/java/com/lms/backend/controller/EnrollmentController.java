package com.lms.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.lms.backend.model.Enrollment;
import com.lms.backend.service.EnrollmentService;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{studentId}/{courseId}")
    public Enrollment enroll(@PathVariable Long studentId,
                             @PathVariable Long courseId) {
        return enrollmentService.enroll(studentId, courseId);
    }

    @DeleteMapping("/{studentId}/{courseId}")
    public void unenroll(@PathVariable Long studentId,
                         @PathVariable Long courseId) {
        enrollmentService.unenroll(studentId, courseId);
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> getEnrollments(@PathVariable Long studentId) {
        return enrollmentService.getEnrollmentsByStudent(studentId);
    }

    @PutMapping("/{studentId}/{courseId}/progress")
    public Enrollment updateProgress(@PathVariable Long studentId,
                                     @PathVariable Long courseId,
                                     @RequestParam Integer progress) {
        return enrollmentService.updateProgress(studentId, courseId, progress);
    }
}