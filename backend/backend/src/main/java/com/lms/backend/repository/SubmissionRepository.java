
package com.lms.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.backend.model.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByAssignmentId(Long assignmentId);

    List<Submission> findByStudentId(Long studentId);

    Optional<Submission> findByStudentIdAndAssignmentId(Long studentId, Long assignmentId);

    List<Submission> findByAssignmentCourseId(Long courseId);
}