package com.lms.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.lms.backend.model.Course;
import com.lms.backend.model.Lesson;
import com.lms.backend.repository.CourseRepository;
import com.lms.backend.repository.LessonRepository;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    // folder on disk where files are saved
    private final String uploadDir = "uploads/lessons/";

    public LessonService(LessonRepository lessonRepository, CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    public Lesson createLesson(Long courseId, String title, String type, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        // get next order number for this course
        List<Lesson> existing = lessonRepository.findByCourseIdOrderByLessonOrder(courseId);
        int nextOrder = existing.size() + 1;

        Lesson lesson = new Lesson(title, fileName, type, nextOrder, course);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByLessonOrder(courseId);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}
