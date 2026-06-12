package com.lms.backend.controller;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.lms.backend.model.Submission;
import com.lms.backend.service.SubmissionService;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // Student uploads submission
    @PostMapping(consumes = "multipart/form-data")
    public Submission submit(
            @RequestParam("studentId") Long studentId,
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return submissionService.submit(studentId, assignmentId, file);
    }

    // Teacher grades submission
    @PutMapping("/{id}/grade")
    public Submission grade(
            @PathVariable Long id,
            @RequestParam String grade) {
        return submissionService.grade(id, grade);
    }

    // Get submissions for an assignment (teacher)
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(@PathVariable Long assignmentId) {
        return submissionService.getByAssignment(assignmentId);
    }

    // Get submissions by student
    @GetMapping("/student/{studentId}")
    public List<Submission> getByStudent(@PathVariable Long studentId) {
        return submissionService.getByStudent(studentId);
    }

    // Get all submissions for a course (teacher dashboard)
    @GetMapping("/course/{courseId}")
    public List<Submission> getByCourse(@PathVariable Long courseId) {
        return submissionService.getByCourse(courseId);
    }

    // Serve submission file
    @GetMapping("/file/{fileName}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get("uploads/submissions/").resolve(fileName);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }

    
}