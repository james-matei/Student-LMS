package com.lms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.backend.model.Course;

public interface CourseRepository  extends JpaRepository<Course, Long> {
}
