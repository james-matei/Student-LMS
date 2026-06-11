
package com.lms.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.backend.model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}