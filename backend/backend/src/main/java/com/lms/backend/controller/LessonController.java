package com.lms.backend.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.lms.backend.model.Lesson;
import com.lms.backend.service.LessonService;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "http://localhost:5173")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // multipart because we're uploading a file + metadata together
    @PostMapping(consumes = "multipart/form-data")
    public Lesson createLesson(
            @RequestParam("courseId") Long courseId,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) throws IOException {
        return lessonService.createLesson(courseId, title, type, file);
    }

    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourse(@PathVariable Long courseId) {
        return lessonService.getLessonsByCourse(courseId);
    }

    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
    }
}