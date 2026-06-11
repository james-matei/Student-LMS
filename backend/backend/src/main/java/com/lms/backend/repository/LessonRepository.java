package com.lms.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.backend.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByLessonOrder(Long courseId);
}
