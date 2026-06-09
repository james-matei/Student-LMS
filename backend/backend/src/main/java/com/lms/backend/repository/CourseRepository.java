package com.lms.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.backend.model.Course;

public interface CourseRepository  extends JpaRepository<Course, Long> {
List<Course> findByLecturerId(Long lecturerId);

}
