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
    private final UserService userService;

    private final String uploadDir = "uploads/submissions/";

    public SubmissionService(SubmissionRepository submissionRepository,
                             AssignmentRepository assignmentRepository,
                             UserRepository userRepository,
                             UserService userService) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public Submission submit(Long studentId, Long assignmentId, MultipartFile file) throws IOException {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = studentId + "_" + assignmentId + "_" +
                file.getOriginalFilename().replaceAll("\\s+", "_");
        Files.copy(file.getInputStream(), uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);

        // check if first submission to avoid awarding tokens twice
        boolean isFirstSubmission = submissionRepository
                .findByStudentIdAndAssignmentId(studentId, assignmentId)
                .isEmpty();

        Submission submission = submissionRepository
                .findByStudentIdAndAssignmentId(studentId, assignmentId)
                .orElse(new Submission(fileName, student, assignment));

        submission.setFileName(fileName);
        submission.setStatus("SUBMITTED");
        Submission saved = submissionRepository.save(submission);

        // award tokens only on first submission
        if (isFirstSubmission && assignment.getTokenReward() != null && assignment.getTokenReward() > 0) {
            userService.addTokens(studentId, assignment.getTokenReward());
        }

        return saved;
    }

    public Submission grade(Long submissionId, String grade) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setGrade(grade);
        submission.setStatus("GRADED");
        return submissionRepository.save(submission);
    }

    public List<Submission> getByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public List<Submission> getByCourse(Long courseId) {
        return submissionRepository.findByAssignmentCourseId(courseId);
    }
}