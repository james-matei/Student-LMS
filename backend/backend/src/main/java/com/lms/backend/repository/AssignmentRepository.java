package com.lms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.lms.backend.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
List<Assignment> findByCourseId(Long courseId);

}
