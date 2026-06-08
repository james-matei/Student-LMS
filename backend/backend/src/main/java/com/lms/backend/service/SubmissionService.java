package com.lms.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.backend.dto.SubmissionRequest;
import com.lms.backend.model.Assignment;
import com.lms.backend.model.Submission;
import com.lms.backend.model.User;
import com.lms.backend.repository.AssignmentRepository;
import com.lms.backend.repository.SubmissionRepository;
import com.lms.backend.repository.UserRepository;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            AssignmentRepository assignmentRepository,
            UserRepository userRepository
    ) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // CREATE SUBMISSION (DTO)
    // =========================
    public Submission createSubmission(SubmissionRequest request) {

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Submission submission = new Submission();
        submission.setFileName(request.getFileName());
        submission.setAssignment(assignment);
        submission.setStudent(student);

        return submissionRepository.save(submission);
    }

    // =========================
    // READ ALL
    // =========================
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    // =========================
    // BY ASSIGNMENT
    // =========================
    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    // =========================
    // BY STUDENT
    // =========================
    public List<Submission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    // =========================
    // DELETE
    // =========================
    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }

    // =========================
    // GRADE SUBMISSION
    // =========================
    public Submission gradeSubmission(Long id, String grade) {

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setGrade(grade);

        return submissionRepository.save(submission);
    }
}