package com.lms.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.lms.backend.model.*;
import com.lms.backend.repository.*;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads/submissions/";

    public SubmissionService(SubmissionRepository submissionRepository,
                             AssignmentRepository assignmentRepository,
                             UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    // Student submits a file
    public Submission submit(Long studentId, Long assignmentId, MultipartFile file) throws IOException {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = studentId + "_" + assignmentId + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);

        // overwrite if already submitted
        Submission submission = submissionRepository
                .findByStudentIdAndAssignmentId(studentId, assignmentId)
                .orElse(new Submission(fileName, student, assignment));

        submission.setFileName(fileName);
        submission.setStatus("SUBMITTED");
        return submissionRepository.save(submission);
    }

    // Teacher grades a submission
    public Submission grade(Long submissionId, String grade) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setGrade(grade);
        submission.setStatus("GRADED");
        return submissionRepository.save(submission);
    }

    // Get all submissions for an assignment (teacher view)
    public List<Submission> getByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    // Get all submissions by a student (student view)
    public List<Submission> getByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    // Get all submissions for a course (teacher dashboard)
    public List<Submission> getByCourse(Long courseId) {
        return submissionRepository.findByAssignmentCourseId(courseId);
    }
}