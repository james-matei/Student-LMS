package com.lms.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.lms.backend.dto.SubmissionRequest;
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

    // =========================
    // CREATE (DTO - CLEAN API)
    // =========================
    @PostMapping
    public Submission createSubmission(@RequestBody SubmissionRequest request) {
        return submissionService.createSubmission(request);
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    // =========================
    // BY ASSIGNMENT
    // =========================
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getByAssignment(@PathVariable Long assignmentId) {
        return submissionService.getSubmissionsByAssignment(assignmentId);
    }

    // =========================
    // BY STUDENT
    // =========================
    @GetMapping("/student/{studentId}")
    public List<Submission> getByStudent(@PathVariable Long studentId) {
        return submissionService.getSubmissionsByStudent(studentId);
    }

    // =========================
    // GRADE SUBMISSION
    // =========================
    @PutMapping("/{id}/grade")
    public Submission gradeSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return submissionService.gradeSubmission(id, body.get("grade"));
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public void deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
    }
}